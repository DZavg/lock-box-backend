import { runSeeders } from 'typeorm-extension';
import { MainSeeder } from './main.seeder';
import dataSource from '../data-source';

(async () => {
  const SeedDataSource = dataSource;

  await SeedDataSource.initialize();
  await runSeeders(SeedDataSource, { seeds: [MainSeeder] });
  process.exit();
})();
