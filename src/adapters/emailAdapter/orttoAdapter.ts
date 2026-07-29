import axios from 'axios';
import { logger } from '../../utils/logger';
import { OrttoAdapterInterface } from './orttoAdapterInterface';
import { MICRO_SERVICES } from '../../utils/utils';

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
      logger.error('orttoActivityCall error', {
        error: e,
        data,
      });
      // Report failure (do not throw) so callers that need a confirmed upsert
      // can react; existing fire-and-forget callers ignore the return value and
      // keep their previous swallow-and-continue behavior.
      return false;
    }
  }
}
