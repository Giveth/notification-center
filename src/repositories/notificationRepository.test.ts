import { findOrganizationById } from './organizationRepository';
import {
  createAccessTokenForTest,
  SEED_DATA,
  serverUrl,
} from '../../test/testUtils';
import { assert } from 'chai';
import { Log, LogStatus } from '../entities/log';
import { generateRandomString } from '../utils/utils';
import {
  createNewLog,
  updateAccessTokenAndApplication,
  updateFailedLog,
  updateScopeLog,
  updateSuccessLog,
} from './logRepository';
import { scopeLabels } from '../services/scopeService';
import axios from 'axios';
import { createBasicAuthentication } from '../utils/authorizationUtils';
import { findApplicationById } from './applicationRepository';
import { Application } from '../entities/application';

describe('createNewLog() test cases', () => {
  it('should createNewLog', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    const logData = {
      url: 'http://google.come',
      status: LogStatus.PENDING,
      trackId,
      method: 'GET',
      ip:"0.0.0.0"
    };
    const log = await createNewLog(logData);
    assert.isOk(log);
    assert.equal(log.trackId, trackId);
  });
});

describe('updateScopeLog() test cases', () => {
  it('should updateScopeLog', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    const logData = {
      url: 'http://google.come',
      status: LogStatus.PENDING,
      trackId,
      method: 'GET',
      ip:"0.0.0.0"

    };
    const log = await createNewLog(logData);
    await updateScopeLog({
      trackId,
      scope: scopeLabels.CREATE_DONATION,
    });
    const newLog = await Log.findOne({ where: { id: log.id } });
    assert.isOk(newLog);
    assert.equal(newLog?.scope, scopeLabels.CREATE_DONATION);
  });
  it('should not updateScopeLog because log not found', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    await updateScopeLog({
      trackId,
      scope: scopeLabels.CREATE_DONATION,
    });
    const newLog = await Log.findOne({ where: { trackId } });
    assert.equal(newLog, null);
  });
});

describe('updateFailedLog() test cases', () => {
  it('should updateFailedLog', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    const logData = {
      url: 'http://google.come',
      status: LogStatus.PENDING,
      trackId,
      method: 'GET',
      ip:"0.0.0.0"

    };
    const log = await createNewLog(logData);
    await updateFailedLog({
      trackId,
      error: 'testLogFailed',
      statusCode: 404,
    });
    const newLog = await Log.findOne({ where: { id: log.id } });
    assert.isOk(newLog);
    assert.equal(newLog?.statusCode, 404);
    assert.equal(newLog?.error, 'testLogFailed');
  });
  it('should not updateFailedLog because log not found', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    await updateFailedLog({
      trackId,
      error: 'testLogFailed',
      statusCode: 404,
    });
    const newLog = await Log.findOne({ where: { trackId } });
    assert.equal(newLog, null);
  });
});

describe('updateSuccessLog() test cases', () => {
  it('should updateSuccessLog', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    const logData = {
      url: 'http://google.come',
      status: LogStatus.PENDING,
      trackId,
      method: 'GET',
      ip:"0.0.0.0"

    };
    const log = await createNewLog(logData);
    await updateSuccessLog({
      trackId,
      result: JSON.stringify(log),
      statusCode: 201,
    });
    const newLog = await Log.findOne({ where: { id: log.id } });
    assert.isOk(newLog);
    assert.equal(newLog?.statusCode, 201);
    assert.equal(newLog?.result, JSON.stringify(log));
  });
  it('should not updateSuccessLog because log not found', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    await updateSuccessLog({
      trackId,
      result: 'testLogSuccess',
      statusCode: 200,
    });
    const newLog = await Log.findOne({ where: { trackId } });
    assert.equal(newLog, null);
  });
});

describe('updateAccessTokenAndApplication() test cases', () => {
  it('should updateAccessTokenAndApplication', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    const logData = {
      url: 'http://google.come',
      status: LogStatus.PENDING,
      trackId,
      method: 'GET',
      ip:"0.0.0.0"

    };
    const log = await createNewLog(logData);
    const application = (await findApplicationById(
      SEED_DATA.firstApplication.id,
    )) as Application;
    const accessToken = await createAccessTokenForTest({
      applicationId: SEED_DATA.firstApplication.id,
      scopes: [scopeLabels.CREATE_DONATION],
    });
    await updateAccessTokenAndApplication({
      trackId,
      application,
      accessToken,
    });
    const newLog = await Log.findOne({ where: { id: log.id } });
    assert.isOk(newLog);
    assert.equal(newLog?.applicationId, application.id);
    assert.equal(newLog?.accessTokenId, accessToken.id);
  });
  it('should not updateAccessTokenAndApplication because log not found', async () => {
    const trackId = `${new Date().getTime()}_${generateRandomString(6)}`;
    const application = (await findApplicationById(
      SEED_DATA.firstApplication.id,
    )) as Application;
    const accessToken = await createAccessTokenForTest({
      applicationId: SEED_DATA.firstApplication.id,
      scopes: [scopeLabels.CREATE_DONATION],
    });
    await updateAccessTokenAndApplication({
      trackId,
      application,
      accessToken,
    });
    const newLog = await Log.findOne({ where: { trackId } });
    assert.equal(newLog, null);
  });
});
