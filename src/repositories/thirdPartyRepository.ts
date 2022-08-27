import { ThirdParty } from '../entities/ThirdParty';

export const findThirdPartyBySecret = async (params: {
  username: string;
  secret: string;
}): Promise<ThirdParty | null> => {
  const query = ThirdParty.createQueryBuilder()
    .where('"microService" = :microService', { microService: params.username })
    .andWhere('secret = :secret', { secret: params.secret })
    .andWhere('"isActive" = true');

  return query.getOne();
};
