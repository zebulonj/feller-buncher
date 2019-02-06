## Feller Buncher

A light, middleware enabled, logger for Node.

> A feller buncher is a type of harvester used in logging. It is a motorized vehicle with an attachment that can rapidly gather and cut a tree before felling it. Feller is a traditional name for someone who cuts down trees, and bunching is the skidding and assembly of two or more trees.

-- [Wikipedia](https://en.wikipedia.org/wiki/Feller_buncher)

### Example

```js
const { createLogger } = require('feller-buncher');

const log = createLogger({ name: 'my-app' });

log.info('Hello World!')
```

_Log on..._
