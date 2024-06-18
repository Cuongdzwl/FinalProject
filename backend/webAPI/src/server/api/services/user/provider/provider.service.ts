import { AuthenticationProvider, PrismaClient } from '@prisma/client';
import L from '../../../../common/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export class ProviderService {
  update(__: string, _: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  byId(id: number): Promise<any> {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  findBy(field: string, value: string): Promise<any> {
    return prisma.user.findFirst({
      where: {
        [field]: value,
      },
    });
  }
  async getUserProviders(userid: number, provider?: string): Promise<any> {
    var p = undefined;
    if (provider) {
      p = {
        providerId: await this.getAuthenticationProviderId(provider),
      };
    }
    return prisma.userProvider.findMany({
      select: {
        id: true,
        providerId: true,
        provider: { select: { id: true, name: true } },
      },
      where: { userId: userid, ...p },
    });
  }

  createAuthenticationProvider(name: string): Promise<AuthenticationProvider> {
    return prisma.authenticationProvider.create({
      data: {
        name: name.toLowerCase(),
        nameNormalize: name.toUpperCase(),
      },
    });
  }
  getAuthenticationProviderId(name: string): Promise<number> {
    return prisma.authenticationProvider
      .findUniqueOrThrow({ where: { nameNormalize: name.toUpperCase() } })
      .then((r) => {
        return Promise.resolve(r.id);
      })
      .catch(async (_) => {
        L.error('Unable to find provider, creating new one...');
        let r = await this.createAuthenticationProvider(name).catch(
          async (err) => {
            L.error(err);
            return null;
          }
        );
        if (r === null) return Promise.reject(null);
        return Promise.resolve(r.id);
      });
  }
  async create(userid: number, provider: string, key: string): Promise<any> {
    var providerId: number | null = await this.getAuthenticationProviderId(
      provider
    )
      .then((r) => {
        return Promise.resolve(r);
      })
      .catch(async (err) => {
        L.error(err);
        return Promise.resolve(null);
      });

    return new Promise((resolve, reject) => {
      if (providerId === null) {
        reject({ message: 'Unable to add provider 1' });
        return;
      }
      prisma.userProvider
        .upsert({
          create: { userId: userid, providerId: providerId, key: key },
          update: { providerId: providerId, key: key },
          where: { userId_providerId: { userId: userid, providerId: providerId } },
        })
        .then((_) => resolve({ message: 'Provider added successfully' }))
        .catch((err) => {
          if (err instanceof PrismaClientKnownRequestError) {
            reject({ message: 'Unable to add provider 2' });
            return;
          }
          L.error(err);
        });
    });
  }
  delete(_: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

export default new ProviderService();
