import { logger } from '../../utils/logger';
import axios from 'axios';

export const orttoActivityCall = async (data: any) => {
  try {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: process.env.ORTTO_ACTIVITY_API,
      headers: {
        'X-Api-Key': process.env.ORTTO_API_KEY as string,
        'Content-Type': 'application/json'
      },
      data
    };
    data.activities.map((a: any) => logger.debug('orttoActivityCall', a));
    await axios.request(config);
  } catch (e) {
    logger.error('orttoActivityCall error', {
      e,
    });
    throw e;
  }
}