// A light, middleware enabled, logger.

import os from 'os';
import util from 'util';
import fs from 'fs';

import EventEmitter from 'events';

import stringify from 'json-stable-stringify';

export const FATAL = 60;
export const ERROR = 50;
export const WARN = 40;
export const INFO = 30;
export const DEBUG = 20;
export const TRACE = 10;

/**
 *
 * @param  {String} [name='app'] Logger name.
 * @param  {Array}  [middleware=[]]      Middleware is applied, left-to-right, before a payload is logged.
 */
export function createLogger({
    name = 'app',
    level: threshold = INFO,
    middleware = [],
    serializers = {},
    stream = process.stdout,
    streams = [],
    ...rest
} = {}) {
    const transforms = compose([
        ...middleware,
        ...prepareSerializers(serializers),
    ]);

    const events = new EventEmitter();
    events.on('error', err => console.error(err));

    // Mount streams.
    const listeners =
        streams.length > 0
            ? streams
            : [
                  {
                      stream,
                      level: threshold,
                  },
              ];

    listeners.forEach(def => registerListener(events, def));

    function encapsulate(props = {}) {
        function log(level, data, message, ...args) {
            if (level >= threshold) {
                const hostname = os.hostname();
                const { pid } = process;
                const time = new Date().toISOString();

                if (typeof data === 'string') {
                    log(level, {}, data, message, ...args);
                } else if (data instanceof Error) {
                    log(level, { err: data }, message || data.message, ...args);
                } else {
                    events.emit('message', {
                        level,
                        message: {
                            ...transforms({
                                ...props,
                                ...data,
                            }),
                            msg: util.format(message, ...args),
                            level,
                            name,
                            hostname,
                            pid,
                            time,
                            v: 0,
                        },
                    });
                }
            }
        }

        return {
            fatal: (...args) => log(FATAL, ...args),
            error: (...args) => log(ERROR, ...args),
            warn:  (...args) => log(WARN, ...args),
            info:  (...args) => log(INFO, ...args),
            debug: (...args) => log(DEGUB, ...args),
            trace: (...args) => log(TRACE, ...args),

            log,
            
            child: (childProps = {}) =>
                encapsulate({ ...props, ...childProps }),
        };
    }

    return encapsulate(rest);
}

function compose(fns = []) {
    return data => fns.reduce((acc, fn) => fn(acc), data);
}

/**
 * Accepts a map of serializers, and converts them to an array middleware for insertion
 * into the middleware stack.
 *
 * @param  {Object} [serializers={}]
 */
function prepareSerializers(serializers = {}) {
    return Object.keys(serializers).map(
        key => ({ [key]: target, ...rest }) => ({
            ...rest,
            [key]: target ? serializers[key](target) : target,
        }),
    );
}

function registerListener(
    emitter,
    { level: threshold = INFO, stream, path } = {},
) {
    if (!stream && !path) {
        emitter.emit('error', new Error('Invalid stream specification'));
    } else {
        const listener =
            stream ||
            fs.createWriteStream(path, {
                flags: 'a',
            });

        emitter.on('message', ({ level, message }) => {
            if (level >= threshold) {
                listener.write(`${stringify(message)}\n`, 'utf8');
            }
        });
    }
}

export default { createLogger };
