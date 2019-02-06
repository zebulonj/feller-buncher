## Feller Buncher

A light, middleware enabled, logger for Node.

> A feller buncher is a type of harvester used in logging. It is a motorized vehicle with an attachment that can rapidly gather and cut a tree before felling it. Feller is a traditional name for someone who cuts down trees, and bunching is the skidding and assembly of two or more trees.

-- [Wikipedia](https://en.wikipedia.org/wiki/Feller_buncher)

```
> npm install --save feller-buncher
```

### Example

```js
const { createLogger } = require('feller-buncher');

const log = createLogger({ name: 'my-app' });

log.info('Hello World!')
```

### Features

The core API and output format of this library mirror those of [bunyan](https://github.com/trentm/node-bunyan), but
it is a slimmed down offering.

- streams
- serializers
- sub-component loggers (`log.child`)
- levels

To that it adds:
- **middleware**. Functions to transform or **amend** log messages before output. These are distinguishable 
  from serializers in that their effect is not isolated to a single top-level key.

_Log on..._
