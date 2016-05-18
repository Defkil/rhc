# Redis-hogan-cache

Require Redis-hogan-cache
```javascript
var rhc = require('redis-hogan-cache')
```

Create a new RHC instance
```javascript
//with a new redis client
rhc({prefix:'rhc:', expire:'10000', redis:{hostname:'localhost', password:'', port:6379, db:0}})

//with an already created redis client
//redisClient = = redis.createClient()
rhc({prefix:'rhc:', expire:'10000', client:redisClient})
```

```javascript
rhc({options})
/**
 * @param {Object} options                Settings to use to RHC
 * @param {Object} options.client         A Redis client instance
 * @param {Object} options.redis          [Optional] Redis client information, if options.client not used 
 * @param {Object} options.redis.hostname [Optional] Redis server hostname
 * @param {Object} options.redis.password [Optional] Redis server password
 * @param {Object} options.redis.port     [Optional] Redis server port
 * @param {Object} options.redis.db       [Optional] Redis server database; dafault: `1`
 * @param {string} options.prefix         [Optional] A prefix to append to key names in Redis; default: `rhc:`
 * @param {int}    options.expire         [Optional] Template expire; default: `never`
 */
```
