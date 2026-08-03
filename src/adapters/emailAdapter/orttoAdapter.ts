import axios from 'axios';
import { logger } from '../../utils/logger';
import { OrttoAdapterInterface } from './orttoAdapterInterface';
import { MICRO_SERVICES } from '../../utils/utils';

// Finite timeout so a stalled Ortto connection rejects promptly instead of
// keeping the notification-center request — and, for the contact sync, its 502
// retry path — pending indefinitely. Sourced from ORTTO_REQUEST_TIMEOUT_MS with
// a validated fallback so a missing/garbage value never disables the timeout.
const DEFAULT_ORTTO_TIMEOUT_MS = 10_000;
const resolveOrttoTimeoutMs = (): number => {
  const parsed = Number(process.env.ORTTO_REQUEST_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_ORTTO_TIMEOUT_MS;
};

export class OrttoAdapter implements OrttoAdapterInterface {
  async callOrttoActivity(data: any, microService: string): Promise<boolean> {
    try {
      if (!data) {
        throw new Error('callOrttoActivity input data is empty');
      }
      const apiKey =
        microService === MICRO_SERVICES.qacc
          ? process.env.QACC_ORTTO_API_KEY
          : process.env.ORTTO_API_KEY;
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.ORTTO_ACTIVITY_API,
        timeout: resolveOrttoTimeoutMs(),
        headers: {
          'X-Api-Key': apiKey as string,
          'Content-Type': 'application/json',
        },
        data,
      };
      data.activities.map((a: any) => logger.debug('orttoActivityCall', a));
      await axios.request(config);
      return true;
    } catch (e) {
      // Log only a sanitized summary. NEVER log `data` (it carries the contact's
      // email / names / v6-user-id) or the raw Axios error (its `config` holds
      // the `X-Api-Key` header and the request body). Activity ids and the HTTP
      // status are safe, non-sensitive identifiers that are enough to debug.
      const activityIds = Array.isArray(data?.activities)
        ? data.activities.map((a: any) => a?.activity_id)
        : [];
      logger.error('orttoActivityCall error', {
        microService,
        activityIds,
        status: axios.isAxiosError(e) ? e.response?.status : undefined,
        message: e instanceof Error ? e.message : String(e),
      });
      // Report failure (do not throw) so callers that need a confirmed upsert
      // can react; existing fire-and-forget callers ignore the return value and
      // keep their previous swallow-and-continue behavior.
      return false;
    }
  }
}
