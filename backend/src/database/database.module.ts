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
                synchronize: true, // เปิดให้สร้างตารางอัตโนมัติบน Neon ตามที่คุณขอครับ
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            }),
        }),
    ],
})
export class DatabaseModule { }