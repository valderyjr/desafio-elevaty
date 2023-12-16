import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { PhonesController } from './phones.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [PhonesController],
  providers: [PhonesService],
})
export class PhonesModule {}
