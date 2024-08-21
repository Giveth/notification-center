import { assert } from 'chai';
import { sign } from 'jsonwebtoken';
import { Keypair } from '@solana/web3.js';
import { Notification } from '../src/entities/notification';
import { UserAddress } from '../src/entities/userAddress';
import { NotificationType } from '../src/entities/notificationType';
import { createBasicAuthentication } from '../src/utils/authorizationUtils';

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

export function generateRandomSolanaAddress(): string {
  return Keypair.generate().publicKey.toString();
}

// eslint:disable-next-line
export function generateRandomTxHash(): string {
  return `0x${generateHexNumber(64)}`;
}

function generateHexNumber(len: number) {
  const hex = '0123456789abcdef';
  let output = '';

  for (let i = 0; i < len; i++) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

export interface userAddressData {
  walletAddress: string;
}

export const saveUserAddressDirectlyToDb = async (
  userAddressData: userAddressData,
) => {
  return UserAddress.create({
    ...userAddressData,
  }).save();
};

export const saveNotificationDirectlyToDb = async (
  userAddress: UserAddress,
  notificationType: NotificationType,
) => {
  const notification = Notification.create({
    userAddress: userAddress,
    notificationType: notificationType,
  });

  return notification.save();
};
export const SEED_DATA = {};

export const getGivethIoBasicAuth = () => {
  return createBasicAuthentication({
    secret: process.env.GIVETH_IO_THIRD_PARTY_SECRET as string,
    username: process.env.GIVETH_IO_THIRD_PARTY_MICRO_SERVICE as string,
  });
};

export const getGivEconomyBasicAuth = () => {
  return createBasicAuthentication({
    secret: process.env.GIV_ECONOMY_THIRD_PARTY_SECRET as string,
    username: process.env.GIV_ECONOMY_THIRD_PARTY_MICRO_SERVICE as string,
  });
};

export const getNotifyRewardBasicAuth = () => {
  return createBasicAuthentication({
    secret: process.env.NOTIFY_REWARD_THIRD_PARTY_SECRET as string,
    username: process.env.NOTIFY_REWARD_THIRD_PARTY_MICRO_SERVICE as string,
  });
};

export const getQaccBasicAuth = () => {
  return createBasicAuthentication({
    secret: process.env.QACC_THIRD_PARTY_SECRET as string,
    username: process.env.QACC_THIRD_PARTY_MICRO_SERVICE as string,
  });
};

export const getAccessTokenForMockAuthMicroService = (
  walletAddress: string,
) => {
  return `Bearer ${sign({ publicAddress: walletAddress }, 'test secret')}`;
};
