import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'), // ✅ ใช้ตัวเดียวพอ
                autoLoadEntities: true,
                ssl: {
                    rejectUnauthorized: false,
                },
                synchronize: false,
            }),
        }),
    ],
})
export class DatabaseModule { }