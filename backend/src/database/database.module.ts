import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const isProd = configService.get('NODE_ENV') === 'production';
                const dbUrl = configService.get<string>('DATABASE_URL');

                return {
                    type: 'postgres',

                    // 👇 รองรับทั้ง 2 แบบ
                    ...(dbUrl
                        ? { url: dbUrl }
                        : {
                            host: configService.get<string>('POSTGRES_HOST'),
                            port: configService.get<number>('POSTGRES_PORT'),
                            username: configService.get<string>('POSTGRES_USER'),
                            password: configService.get<string>('POSTGRES_PASSWORD'),
                            database: configService.get<string>('POSTGRES_DB'),
                        }),

                    autoLoadEntities: true,

                    // 👇 สำคัญมากบน Render
                    ssl: isProd ? { rejectUnauthorized: false } : false,

                    synchronize: false,
                };
            },
        }),
    ],
})
export class DatabaseModule { }