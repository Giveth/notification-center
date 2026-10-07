import * as http from 'http';
import { expect } from 'chai';
import { OrttoAdapter } from './orttoAdapter';
import { MICRO_SERVICES } from '../../utils/utils';

// giveth-v6-core#426: the contact sync needs callOrttoActivity to distinguish a
// transient Ortto failure (5xx / network — retryable) from a permanent one
// (4xx — a bad payload or an unprovisioned field/activity), so sendNotification
// can 502 the former and 422 the latter instead of retrying forever.
describe('OrttoAdapter.callOrttoActivity — failure classification', () => {
  let server: http.Server;
  let respond: (res: http.ServerResponse) => void = res => res.end('{}');
  const origApi = process.env.ORTTO_ACTIVITY_API;
  const origKey = process.env.ORTTO_API_KEY;

  const sampleData = {
    activities: [
      { activity_id: 'act:cm:sync-ortto-contact', attributes: {}, fields: {} },
    ],
    merge_by: ['str:cm:v6-user-id'],
  };

  before(done => {
    server = http.createServer((_req, res) => respond(res));
    server.listen(0, () => {
      const port = (server.address() as { port: number }).port;
      process.env.ORTTO_ACTIVITY_API = `http://127.0.0.1:${port}`;
      process.env.ORTTO_API_KEY = 'test-key';
      done();
    });
  });

  after(done => {
    if (origApi === undefined) delete process.env.ORTTO_ACTIVITY_API;
    else process.env.ORTTO_ACTIVITY_API = origApi;
    if (origKey === undefined) delete process.env.ORTTO_API_KEY;
    else process.env.ORTTO_API_KEY = origKey;
    server.close(() => done());
  });

  it('returns ok on a 2xx', async () => {
    respond = res => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{}');
    };
    const r = await new OrttoAdapter().callOrttoActivity(
      sampleData,
      MICRO_SERVICES.givethio,
      { timeoutMs: 2000 },
    );
    expect(r.ok).to.equal(true);
    expect(r.retryable).to.equal(false);
  });

  it('classifies a 4xx as permanent (non-retryable) and carries the response body', async () => {
    respond = res => {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'unknown field str:cm:v6-user-id' }));
    };
    const r = await new OrttoAdapter().callOrttoActivity(
      sampleData,
      MICRO_SERVICES.givethio,
      { timeoutMs: 2000 },
    );
    expect(r.ok).to.equal(false);
    expect(r.retryable).to.equal(false);
    expect(r.status).to.equal(400);
    expect(r.responseBody).to.deep.equal({
      error: 'unknown field str:cm:v6-user-id',
    });
  });

  it('classifies a 5xx as transient (retryable)', async () => {
    respond = res => {
      res.writeHead(503);
      res.end('{}');
    };
    const r = await new OrttoAdapter().callOrttoActivity(
      sampleData,
      MICRO_SERVICES.givethio,
      { timeoutMs: 2000 },
    );
    expect(r.ok).to.equal(false);
    expect(r.retryable).to.equal(true);
    expect(r.status).to.equal(503);
  });

  it('classifies a connection failure (no response) as transient (retryable)', async () => {
    const saved = process.env.ORTTO_ACTIVITY_API;
    // Nothing listening → ECONNREFUSED, so there is no HTTP response/status.
    process.env.ORTTO_ACTIVITY_API = 'http://127.0.0.1:1';
    try {
      const r = await new OrttoAdapter().callOrttoActivity(
        sampleData,
        MICRO_SERVICES.givethio,
        { timeoutMs: 2000 },
      );
      expect(r.ok).to.equal(false);
      expect(r.retryable).to.equal(true);
      expect(r.status).to.equal(undefined);
    } finally {
      process.env.ORTTO_ACTIVITY_API = saved;
    }
  });
});
