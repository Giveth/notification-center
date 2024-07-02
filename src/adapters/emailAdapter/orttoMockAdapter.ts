import { logger } from '../../utils/logger';
import { OrttoAdapterInterface } from './orttoAdapterInterface';

export class OrttoMockAdapter implements OrttoAdapterInterface {
  async callOrttoActivity(data: any): Promise<void> {
    logger.debug('OrttoMockAdapter has been called', data);
  }
}
