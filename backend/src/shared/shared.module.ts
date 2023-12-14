import { Module } from '@nestjs/common';
import { PrismaClientService } from './prisma/prisma-client.service';

@Module({
  providers: [PrismaClientService],
  exports: [PrismaClientService],
})
export class SharedModule {}
