import { randomBytes } from 'crypto';

export const generateRandomString = (len: number): string => {
  return randomBytes(len).toString('hex');
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const MICRO_SERVICES = {
  givethio: 'givethio',
  trace: 'trace',
};
