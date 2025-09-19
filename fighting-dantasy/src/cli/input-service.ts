/**
 * Interface for the readline API
 */
export interface IReadlineInterface {
  question: (query: string, callback: (answer: string) => void) => void;
  close: () => void;
}

/**
 * InputService class for handling user input
 */
export class InputService {
  private rl: IReadlineInterface;

  /**
   * Create a new InputService
   * @param readlineInterface The readline interface to use
   */
  constructor(readlineInterface: IReadlineInterface) {
    this.rl = readlineInterface;
  }

  /**
   * Ask a question and get the user's answer
   * @param question The question to ask
   * @returns A promise that resolves with the user's answer
   */
  public async askQuestion(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question, answer => {
        resolve(answer);
      });
    });
  }

  /**
   * Close the readline interface
   */
  public close(): void {
    this.rl.close();
  }

  /**
   * Ask a yes/no question and get a boolean response
   * @param question The question to ask
   * @returns A promise that resolves with true for yes, false for no
   */
  public async askYesNo(question: string): Promise<boolean> {
    const answer = await this.askQuestion(`${question} (y/n): `);
    return answer.toLowerCase() === 'y';
  }

  /**
   * Ask a numeric question and get a number response
   * @param question The question to ask
   * @returns A promise that resolves with the parsed number
   */
  public async askNumber(question: string): Promise<number> {
    const answer = await this.askQuestion(question);
    return parseInt(answer);
  }
}

/**
 * Create a readline interface compatible with Bun
 * @returns A readline interface
 */
export function createBunReadlineInterface(): IReadlineInterface {
  return {
    question: (query: string, callback: (answer: string) => void) => {
      process.stdout.write(query);
      process.stdin.once('data', data => {
        const answer = data.toString().trim();
        callback(answer);
      });
    },
    close: () => {
      process.stdin.removeAllListeners();
    },
  };
}
