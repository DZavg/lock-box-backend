import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { MainSeeder } from './seeds/main.seeder';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: ['src/**/*.entity{.ts,.js}'],
};

const SeedDataSource = new DataSource(options);

(async () => {
  await SeedDataSource.initialize();

  await runSeeders(SeedDataSource, { seeds: [MainSeeder] });

  process.exit();
})();
