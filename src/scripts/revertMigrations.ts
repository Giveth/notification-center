import { initializeDataSource, AppDataSource } from '../dataSource';

(async () => {
  try {
    await initializeDataSource();
    await AppDataSource.undoLastMigration();
    console.log('Last migration has been reverted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error reverting migrations:', error);
    process.exit(1);
  }
})();
