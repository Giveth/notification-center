import axios from 'axios';
import { logger } from '../../utils/logger';
import {
  CallOrttoActivityOptions,
  OrttoActivityResult,
  OrttoAdapterInterface,
  OrttoContactMatch,
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
      const config: Record<string, any> = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.ORTTO_ACTIVITY_API,
        headers: {
          'X-Api-Key': resolveOrttoApiKey(microService),
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
      // Log only the activity ids, never the full activity: its `attributes` /
      // `fields` carry contact PII (email, names, v6-user-id) and the default
      // log level is DEBUG on a 30-day retained file (CWE-532). Matches the
      // redaction applied on the error path below and in the mock adapter.
      logger.debug('orttoActivityCall', {
        microService,
        activityIds: Array.isArray(data?.activities)
          ? data.activities.map((a: any) => a?.activity_id)
          : [],
      });
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

  async isV6ClaimedContact(
    match: OrttoContactMatch,
    microService: string,
  ): Promise<boolean | undefined> {
    const url = resolveOrttoPersonGetUrl();
    if (!url) {
      logger.error('isV6ClaimedContact: no Ortto person-get URL configured', {
        microService,
      });
      return undefined;
    }
    try {
      const response = await axios.request({
        method: 'post',
        url,
        headers: {
          'X-Api-Key': resolveOrttoApiKey(microService),
          'Content-Type': 'application/json',
        },
        timeout: resolveOrttoLookupTimeoutMs(),
        data: {
          // More than one is possible while duplicates exist (#486); the
          // contact counts as claimed if ANY match carries the marker, since
          // an update could land on any of them.
          limit: 10,
          fields: [match.fieldId, V6_SOURCED_MARKER],
          filter: {
            '$str::is': { field_id: match.fieldId, value: match.value },
          },
        },
      });
      const contacts = response?.data?.contacts;
      return (
        Array.isArray(contacts) &&
        contacts.some(
          (contact: any) => contact?.fields?.[V6_SOURCED_MARKER] === true,
        )
      );
    } catch (e) {
      // Never log the matched value — it identifies a person.
      logger.error('isV6ClaimedContact error', {
        microService,
        fieldId: match.fieldId,
        status: axios.isAxiosError(e) ? e.response?.status : undefined,
        message: e instanceof Error ? e.message : String(e),
      });
      return undefined;
    }
  }
}

// The durable marker giveth-v6-core#426 stamps on every contact v6 manages.
const V6_SOURCED_MARKER = 'bol:cm:sourced-from-v6';

const DEFAULT_ORTTO_LOOKUP_TIMEOUT_MS = 10_000;

const resolveOrttoLookupTimeoutMs = (): number => {
  const parsed = Number(process.env.ORTTO_REQUEST_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_ORTTO_LOOKUP_TIMEOUT_MS;
};

const resolveOrttoApiKey = (microService: string): string =>
  (microService === MICRO_SERVICES.qacc
    ? process.env.QACC_ORTTO_API_KEY
    : process.env.ORTTO_API_KEY) as string;

// `ORTTO_PERSON_GET_API` when set; otherwise the person-get endpoint on the
// same Ortto host the activity API already points at, so an instance that can
// send activities can look contacts up without new configuration.
export const resolveOrttoPersonGetUrl = (): string | undefined => {
  if (process.env.ORTTO_PERSON_GET_API) {
    return process.env.ORTTO_PERSON_GET_API;
  }
  if (!process.env.ORTTO_ACTIVITY_API) return undefined;
  try {
    return new URL('/v1/person/get', process.env.ORTTO_ACTIVITY_API).toString();
  } catch {
    return undefined;
  }
};
