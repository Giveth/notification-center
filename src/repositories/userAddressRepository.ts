import { UserAddress } from '../entities/userAddress';

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

  return query.save();
};
