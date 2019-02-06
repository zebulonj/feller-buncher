import fs from 'fs';
import path from 'path';

import { createLogger } from '../index';

// TODO: Write real tests that include assertions. :laughing:

describe('Feller', () => {
    const base = createLogger({
        middleware: [
            data => ({ ...data, rid: 1 }),
            data => ({ ...data, tid: 2 }),
        ],
        serializers: {
            err: err => ({
                name: err.name,
                message: err.message,
                stack: err.stack,
            }),
        },
        stream: fs.createWriteStream(path.resolve(__dirname, './logs.out'), {
            flags: 'a',
        }),
    });

    it('Should support sub-component loggers', () => {
        const log = base.child({ component: 'Test' });

        log.info({ value: 'A' }, 'Hello %s!', 'World');
    });

    it('Should handle omission of the data argument', () => {
        base.info('Alert!');
    });

    it('Should handle errors specially', () => {
        const err = new Error('Oh no!');

        base.info(err);
    });

    it('Should expose convenience methods for each log level', () => {
      const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

      levels.forEach(level => {
        expect(typeof base[level]).toEqual('function');
        expect(() => base[level]('Test')).not.toThrow();
      });
    });
});
