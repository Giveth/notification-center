import { initializeDataSource, AppDataSource } from '../dataSource';

(async () => {
  try {
    await initializeDataSource();
    await AppDataSource.runMigrations();
    console.log('Migrations have been executed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
})();
