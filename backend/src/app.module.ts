import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { PhonesModule } from './phones/phones.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    UsersModule,
    CreditCardsModule,
    PhonesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
