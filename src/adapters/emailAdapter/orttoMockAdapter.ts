import { logger } from '../../utils/logger';
import {
  OrttoActivityResult,
  OrttoAdapterInterface,
  OrttoContactMatch,
} from './orttoAdapterInterface';

export class OrttoMockAdapter implements OrttoAdapterInterface {
  // Lets a test drive a failure outcome (e.g. to exercise the contact-sync 502
  // path) without a real Ortto call; defaults to success.
  public nextResult: OrttoActivityResult = { ok: true, retryable: false };

  async callOrttoActivity(
    data: any,
    microService: string,
  ): Promise<OrttoActivityResult> {
    // Log only non-sensitive identifiers — the activity `data` carries contact
    // PII (email / names / v6-user-id), so it must never be written to logs,
    // even under EMAIL_ADAPTER=mock at debug level.
    const activityIds = Array.isArray(data?.activities)
      ? data.activities.map((a: any) => a?.activity_id)
      : [];
    logger.debug('OrttoMockAdapter has been called', {
      microService,
      activityIds,
    });
    return this.nextResult;
  }

  // Lets a test say which contacts v6 has claimed (by the matched value), or
  // make the lookup fail outright; by default nothing is claimed.
  public claimedValues = new Set<string>();
  public claimLookupFails = false;
  public claimLookups: OrttoContactMatch[] = [];

  async isV6ClaimedContact(
    match: OrttoContactMatch,
  ): Promise<boolean | undefined> {
    this.claimLookups.push(match);
    if (this.claimLookupFails) return undefined;
    return this.claimedValues.has(match.value);
  }
}
