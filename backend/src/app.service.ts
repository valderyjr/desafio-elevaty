import { Injectable } from '@nestjs/common';
import { PrismaClientService } from './shared/prisma/prisma-client.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaClientService) {}
  async getHello(): Promise<string> {
    const users = await this.prisma.user.findMany();
    console.log({ users });
    return 'Hello World!';
  }
}
