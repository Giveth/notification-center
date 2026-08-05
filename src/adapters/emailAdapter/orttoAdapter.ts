import axios from 'axios';
import { logger } from '../../utils/logger';
import {
  CallOrttoActivityOptions,
  OrttoActivityResult,
  OrttoAdapterInterface,
} from './orttoAdapterInterface';
import { MICRO_SERVICES } from '../../utils/utils';

export class OrttoAdapter implements OrttoAdapterInterface {
  async callOrttoActivity(
    data: any,
    microService: string,
    options?: CallOrttoActivityOptions,
  ): Promise<OrttoActivityResult> {
    try {
      if (!data) {
        throw new Error('callOrttoActivity input data is empty');
      }
      const apiKey =
        microService === MICRO_SERVICES.qacc
          ? process.env.QACC_ORTTO_API_KEY
          : process.env.ORTTO_API_KEY;
      const config: Record<string, any> = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.ORTTO_ACTIVITY_API,
        headers: {
          'X-Api-Key': apiKey as string,
          'Content-Type': 'application/json',
        },
        data,
      };
      // Only the contact sync scopes a finite timeout (it needs a prompt failure
      // for its retry path); other events keep their previous no-timeout
      // behavior, so an Ortto latency spike never newly drops their activity.
      if (options?.timeoutMs && options.timeoutMs > 0) {
        config.timeout = options.timeoutMs;
      }
      data.activities.map((a: any) => logger.debug('orttoActivityCall', a));
      await axios.request(config);
      return { ok: true, retryable: false };
    } catch (e) {
      const status = axios.isAxiosError(e) ? e.response?.status : undefined;
      // Ortto's rejection body says WHICH field / attribute / activity it
      // rejected — it carries neither the `X-Api-Key` header nor any contact
      // PII, so it is safe to log and is the only way to diagnose a 4xx. We
      // still never log `data` (contact email / names / v6-user-id) or the raw
      // Axios error (its `config` holds the api key and the request body).
      const responseBody = axios.isAxiosError(e) ? e.response?.data : undefined;
      const activityIds = Array.isArray(data?.activities)
        ? data.activities.map((a: any) => a?.activity_id)
        : [];
      logger.error('orttoActivityCall error', {
        microService,
        activityIds,
        status,
        message: e instanceof Error ? e.message : String(e),
        responseBody,
      });
      // A 4xx is a permanent problem (bad payload, or an unprovisioned custom
      // field / activity) that retrying won't fix; everything else (5xx,
      // timeout, network — no response) is transient and worth retrying. Report
      // (do not throw) so fire-and-forget callers keep their swallow-and-continue
      // behavior while confirmed-upsert callers can act on `retryable`.
      const retryable = status === undefined || status >= 500;
      return { ok: false, retryable, status, responseBody };
    }
  }
}
