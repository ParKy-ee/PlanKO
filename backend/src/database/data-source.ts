import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const AppDataSource = new DataSource({
    type: 'postgres',

    url: process.env.DATABASE_URL,

    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,

    ssl: isProd ? { rejectUnauthorized: false } : false,

    entities: [
        isProd ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts',
    ],
    migrations: [
        isProd
            ? 'dist/database/migrations/*.js'
            : 'src/database/migrations/*.ts',
    ],

    migrationsTableName: 'migrations',
    synchronize: false,
});

export default AppDataSource;