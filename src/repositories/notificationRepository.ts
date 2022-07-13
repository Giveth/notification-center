import { Log, LogStatus } from '../entities/log';
import { Notification } from '../entities/accessToken';
import { Application } from '../entities/application';

export const createNewLog = async (params: {
  url: string;
  status: string;
  trackId: string;
  method: string;
  ip: any;
}): Promise<Log> => {
  return Log.create({ ...params }).save();
};

export const updateScopeLog = async (data: {
  trackId: string;
  scope: string;
}): Promise<void> => {
  const { trackId, scope } = data;
  await Log.update({ trackId }, { scope });
};

export const updateFailedLog = async (data: {
  trackId: string;
  error: string;
  statusCode: number;
}): Promise<void> => {
  const { trackId, error, statusCode } = data;
  await Log.update(
    { trackId },
    { status: LogStatus.FAILED, error, statusCode },
  );
};

export const updateSuccessLog = async (data: {
  trackId: string;
  result: string;
  statusCode: number;
}): Promise<void> => {
  const { trackId, result, statusCode } = data;
  await Log.update({ trackId }, { status: LogStatus.DONE, result, statusCode });
};

export const updateAccessTokenAndApplication = async (data: {
  trackId: string;
  accessToken?: Notification;
  application: Application;
}): Promise<void> => {
  const { trackId, application, accessToken } = data;

  await Log.update({ trackId }, {
    application,
    accessToken
  });
};
