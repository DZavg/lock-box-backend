import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: ['migrations/**/*.ts'],
};

export default new DataSource(options);
