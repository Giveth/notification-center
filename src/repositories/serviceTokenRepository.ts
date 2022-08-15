import { ServiceToken } from '../entities/serviceToken';

export const findMicroserviceByToken = async (
  token: string,
): Promise<ServiceToken | null> => {
  const query = ServiceToken.createQueryBuilder()
    .where('token = :token', { token: token })
    .andWhere('isActive = true');

  return query.getOne();
};
