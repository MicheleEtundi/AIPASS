import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExperimentsModule } from './experiments/experiments.module';
import { LearnerProfilesModule } from './learner-profiles/learner-profiles.module';
import { QueriesModule } from './queries/queries.module';
import { AiResponsesModule } from './ai-responses/ai-responses.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiConfigModule } from './ai-config/ai-config.module';
import { GatewayModule } from './gateway/gateway.module';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    ExperimentsModule,
    LearnerProfilesModule,
    QueriesModule,
    AiResponsesModule,
    AnalyticsModule,
    AiConfigModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}