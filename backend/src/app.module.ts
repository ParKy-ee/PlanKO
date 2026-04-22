import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppModules } from './modules';
import { SeesionPerfomanceModule } from './modules/seesion-perfomance/seesion-perfomance.module';
import { ProgramPlanModule } from './modules/program-plan/program-plan.module';
import { HomeDashboardModule } from './modules/home-dashboard/home-dashboard.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().optional(),

        POSTGRES_HOST: Joi.string().when('DATABASE_URL', {
          is: Joi.exist(),
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USER: Joi.string(),
        POSTGRES_PASSWORD: Joi.string(),
        POSTGRES_DB: Joi.string(),

        // REDIS_HOST: Joi.string().required(),
        // REDIS_PORT: Joi.number().default(6379),

        PORT: Joi.number().default(3001),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
      }),
    }),
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ...AppModules,
    SeesionPerfomanceModule,
    ProgramPlanModule,
    HomeDashboardModule,



  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
