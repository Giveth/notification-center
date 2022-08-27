import { UserAddress } from '../entities/userAddress';
import { createNotificationSettingsForNewUser } from './notificationSettingRepository';

export const findUserByWalletAddress = async (
  walletAddress: string,
): Promise<UserAddress | null> => {
  const query = UserAddress.createQueryBuilder().where(
    `LOWER("walletAddress") = :walletAddress`,
    {
      walletAddress: walletAddress.toLowerCase(),
    },
  );

  return query.getOne();
};

export const createNewUserAddress = async (
  walletAddress: string,
): Promise<UserAddress> => {
  const query = UserAddress.create({
    walletAddress: walletAddress,
  });
  const user = await query.save();

  // Create user Settings
  await createNotificationSettingsForNewUser(user);

  return user;
};

export const createNewUserAddressIfNotExists = async (
  walletAddress: string,
): Promise<UserAddress> => {
  return await findUserByWalletAddress(walletAddress) || await createNewUserAddress(walletAddress)
};
