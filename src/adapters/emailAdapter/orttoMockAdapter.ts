import { logger } from '../../utils/logger';
import {
  OrttoActivityResult,
  OrttoAdapterInterface,
} from './orttoAdapterInterface';

export class OrttoMockAdapter implements OrttoAdapterInterface {
  // Lets a test drive a failure outcome (e.g. to exercise the contact-sync 502
  // path) without a real Ortto call; defaults to success.
  public nextResult: OrttoActivityResult = { ok: true, retryable: false };

  async callOrttoActivity(
    data: any,
    microService: string,
  ): Promise<OrttoActivityResult> {
    logger.debug('OrttoMockAdapter has been called', data, microService);
    return this.nextResult;
  }
}
