# Redis-hogan-cache
Use hogan.js with a cache in redis. You can use a already defined redis client

Require Redis-hogan-cache
```javascript
var rhc = require('redis-hogan-cache')
```

---

Create a new RHC instance
```javascript
//with a new redis client
rhc({prefix:'rhc:', expire:'10000', redis:{hostname:'localhost', password:'', port:6379, db:0}})

//with an already created redis client
//redisClient = = redis.createClient()
rhc({prefix:'rhc:', expire:'10000', client:redisClient})
```

---

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

---

With Express

```javascript
app.set('view cache', false)//disable express cache
app.set('view engine', 'html')//setup html engine
app.engine('html',rhc.render)//define rhc as render engine
app.get('/', function (req, res) {
    res.render('index.html', {message:'A awesome Site', expire:100})
})
```

Just on a http server
```javascript
//create a new rhc instance
rhc({prefix:'rhc:', redis:{hostname:'localhost', password:'', port:6379, db:0}})
var server = http.createServer(function(req, res){
    //use rhc.render()
    rhc.render('../views/index.html', {message:'A awesome Site', expire:100}, function(err, html){
      res.end(html) 
    })
})
```
