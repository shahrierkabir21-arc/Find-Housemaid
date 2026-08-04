import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { EmployerModule } from './employer/employer.module';
import { HousemaidModule } from './housemaid/housemaid.module';
import { PaymentModule } from './payment/payment.module';
import { MailModule } from './mail/mail.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'housemaid_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
          user: 'kabjrshahrier@gmail.com', 
          pass: 'itle hytv pxxb mkao',
        },
      },
      defaults: {
        from: '"Housemaid Search Hub" <your-email@gmail.com>',
      },
    }),
    CommonModule,
    MailModule,
    AuthModule,
    AdminModule,
    EmployerModule,
    HousemaidModule,
    PaymentModule,
  ],
})
export class AppModule {}