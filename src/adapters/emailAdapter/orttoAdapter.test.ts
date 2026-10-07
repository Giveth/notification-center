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

// impact-graph#2348: notification-center asks Ortto whether the contact a v5
// event is about has been claimed by v6 before letting it touch the address.
describe('OrttoAdapter.isV6ClaimedContact', () => {
  let server: http.Server;
  let respond: (res: http.ServerResponse) => void = res => res.end('{}');
  let lastRequest: { url?: string; body?: any; apiKey?: string } = {};
  const origApi = process.env.ORTTO_ACTIVITY_API;
  const origKey = process.env.ORTTO_API_KEY;
  const origGetApi = process.env.ORTTO_PERSON_GET_API;
  const match = { fieldId: 'str:cm:user-id', value: '42' };

  const reply = (body: unknown) => (res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  before(done => {
    server = http.createServer((req, res) => {
      let raw = '';
      req.on('data', chunk => (raw += chunk));
      req.on('end', () => {
        lastRequest = {
          url: req.url,
          body: raw ? JSON.parse(raw) : undefined,
          apiKey: req.headers['x-api-key'] as string,
        };
        respond(res);
      });
    });
    server.listen(0, () => {
      const port = (server.address() as { port: number }).port;
      process.env.ORTTO_ACTIVITY_API = `http://127.0.0.1:${port}/v1/activities/create`;
      process.env.ORTTO_API_KEY = 'test-key';
      delete process.env.ORTTO_PERSON_GET_API;
      done();
    });
  });

  after(done => {
    for (const [key, value] of [
      ['ORTTO_ACTIVITY_API', origApi],
      ['ORTTO_API_KEY', origKey],
      ['ORTTO_PERSON_GET_API', origGetApi],
    ] as const) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    server.close(() => done());
  });

  it('asks the person-get endpoint on the activity host for the marker', async () => {
    respond = reply({ contacts: [] });
    await new OrttoAdapter().isV6ClaimedContact(match, MICRO_SERVICES.givethio);
    expect(lastRequest.url).to.equal('/v1/person/get');
    expect(lastRequest.apiKey).to.equal('test-key');
    expect(lastRequest.body.fields).to.deep.equal([
      'str:cm:user-id',
      'bol:cm:sourced-from-v6',
    ]);
    expect(lastRequest.body.filter).to.deep.equal({
      '$str::is': { field_id: 'str:cm:user-id', value: '42' },
    });
  });

  it('is true when a matching contact carries the v6 marker', async () => {
    respond = reply({
      contacts: [
        { id: 'a', fields: { 'str:cm:user-id': '42' } },
        { id: 'b', fields: { 'bol:cm:sourced-from-v6': true } },
      ],
    });
    expect(
      await new OrttoAdapter().isV6ClaimedContact(
        match,
        MICRO_SERVICES.givethio,
      ),
    ).to.equal(true);
  });

  it('is false when no matching contact carries it, or there is none', async () => {
    respond = reply({
      contacts: [{ id: 'a', fields: { 'bol:cm:sourced-from-v6': false } }],
    });
    expect(
      await new OrttoAdapter().isV6ClaimedContact(
        match,
        MICRO_SERVICES.givethio,
      ),
    ).to.equal(false);
    respond = reply({ contacts: [] });
    expect(
      await new OrttoAdapter().isV6ClaimedContact(
        match,
        MICRO_SERVICES.givethio,
      ),
    ).to.equal(false);
  });

  it('is undefined when the lookup fails, so the caller can fail safe', async () => {
    respond = res => {
      res.writeHead(500);
      res.end('{}');
    };
    expect(
      await new OrttoAdapter().isV6ClaimedContact(
        match,
        MICRO_SERVICES.givethio,
      ),
    ).to.equal(undefined);
  });

  it('prefers ORTTO_PERSON_GET_API when it is set', async () => {
    const port = (server.address() as { port: number }).port;
    process.env.ORTTO_PERSON_GET_API = `http://127.0.0.1:${port}/custom/get`;
    try {
      respond = reply({ contacts: [] });
      await new OrttoAdapter().isV6ClaimedContact(
        match,
        MICRO_SERVICES.givethio,
      );
      expect(lastRequest.url).to.equal('/custom/get');
    } finally {
      delete process.env.ORTTO_PERSON_GET_API;
    }
  });
});
