import axios from 'axios';
import { logger } from '../../utils/logger';
import { OrttoAdapterInterface } from './orttoAdapterInterface';
import { MICRO_SERVICES } from '../../utils/utils';

export class OrttoAdapter implements OrttoAdapterInterface {
  async callOrttoActivity(data: any, microService: string): Promise<void> {
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
        headers: {
          'X-Api-Key': apiKey as string,
          'Content-Type': 'application/json',
        },
        data,
      };
      data.activities.map((a: any) => logger.debug('orttoActivityCall', a));
      await axios.request(config);
    } catch (e) {
      logger.error('orttoActivityCall error', {
        error: e,
        data,
      });
    }
  }
}
