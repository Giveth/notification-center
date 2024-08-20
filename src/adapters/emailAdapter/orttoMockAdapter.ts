import { logger } from '../../utils/logger';
import { OrttoAdapterInterface } from './orttoAdapterInterface';

export class OrttoMockAdapter implements OrttoAdapterInterface {
  async callOrttoActivity(data: any, microService: string): Promise<void> {
    logger.debug('OrttoMockAdapter has been called', data, microService);
  }
}
