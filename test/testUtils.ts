import { assert } from 'chai';
import { scopeLabels } from '../src/services/scopeService';
import { findApplicationById } from '../src/repositories/applicationRepository';
import { generateAccessToken } from '../src/services/tokenServie';
import { Application } from 'express';
import { Notification } from '../src/entities/accessToken';
import { findActiveTokenByValue } from '../src/repositories/accessTokenRepository';
import { AdminRole } from "../src/entities/admin";

// eslint:disable-next-line
export const serverUrl = 'http://localhost:3041';
// eslint:disable-next-line
export const assertThrowsAsync = async (fn: any, errorMessage?: string) => {
  let f = () => {
    // empty function
  };
  try {
    await fn();
  } catch (e) {
    f = () => {
      throw e;
    };
  } finally {
    if (errorMessage) {
      assert.throw(f, errorMessage);
    } else {
      assert.throw(f);
    }
  }
};

// eslint:disable-next-line
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint:disable-next-line
export const assertNotThrowsAsync = async (fn: any) => {
  let f = () => {
    // empty function
  };
  try {
    await fn();
  } catch (e) {
    f = () => {
      throw e;
    };
  } finally {
    assert.doesNotThrow(f);
  }
};

// eslint:disable-next-line
export function generateRandomEthereumAddress(): string {
  return `0x${generateHexNumber(40)}`;
}

// eslint:disable-next-line
export function generateRandomTxHash(): string {
  return `0x${generateHexNumber(64)}`;
}

function generateHexNumber(len: number) {
  const hex = '0123456789abcdef';
  let output = '';
  /* eslint-disable no-plusplus */
  for (let i = 0; i < len; i++) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

export const SEED_DATA = {

};

export const createAccessTokenForTest = async (params: {
  scopes: string[];
  applicationId: number;
}): Promise<Notification> => {
  const application = await findApplicationById(params.applicationId);
  if (!application) {
    throw new Error('Application not found');
  }
  const { accessToken } = await generateAccessToken({
    application,
    scopes: params.scopes,
  });
  const fetchedAccessToken = (await findActiveTokenByValue(
    accessToken,
  )) as Notification;
  return fetchedAccessToken;
};
