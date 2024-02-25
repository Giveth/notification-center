import { logger } from '../../utils/logger';
import axios from 'axios';
import {OrttoAdapterInterface} from "./orttoAdapterInterface";


export class OrttoMockAdapter implements OrttoAdapterInterface{
  async callOrttoActivity(data: any): Promise<void> {
    logger.debug('OrttoMockAdapter has been called', data)
  }

}
