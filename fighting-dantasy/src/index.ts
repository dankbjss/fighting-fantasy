import { Main, Logger, InputService, createBunReadlineInterface } from './cli';

// Create dependencies
const logger = new Logger();
const inputService = new InputService(createBunReadlineInterface());

// Create a new instance of the Main class with dependencies
const game = new Main(logger, inputService);

// Run the game
game.run().catch((error: Error | undefined) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});