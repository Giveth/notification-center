import { Route, Get, Tags } from 'tsoa';
import { MESSAGES } from '../../utils/messages';

type HealthResponse = {
  message: string;
};

@Route('/v1/health')
@Tags('Health')
export class HealthController {
  @Get('/')
  public async getMessage(): Promise<HealthResponse> {
    return {
      message: MESSAGES.healthMessageImAlive,
    };
  }
}
