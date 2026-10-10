# Redis-hogan-cache

> **Deprecated:** this package is no longer developed, and hogan.js has had no release since 2014.
> For new projects use a maintained template engine such as [Handlebars](https://handlebarsjs.com/)
> (Mustache-compatible, for Express via [express-handlebars](https://www.npmjs.com/package/express-handlebars)),
> [Eta](https://eta.js.org/), [LiquidJS](https://liquidjs.com/) or [EJS](https://ejs.co/), and let Express keep
> compiled views in memory (`view cache`, on by default in production).
>
> Versions before 1.0.3 stored compiled templates in Redis and ran them with `eval`: anyone who could write to
> that Redis could run code in your app. Update to 1.0.3 at least. 2.x needs Node 20 and a node-redis client of
> version 4 or later; 1.0.3 keeps the callback client of node-redis 3.

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

//with an already created and connected redis client (node-redis 4 or later)
//redisClient = await redis.createClient().connect()
rhc({prefix:'rhc:', expire:'10000', client:redisClient})
```

---

```javascript
rhc({options})
/**
 * @param {Object} options                Settings to use to RHC
 * @param {Object} options.client         A connected node-redis client, version 4 or later
 * @param {Object} options.redis          [Optional] Redis client information, if options.client not used 
 * @param {Object} options.redis.hostname [Optional] Redis server hostname
 * @param {Object} options.redis.password [Optional] Redis server password
 * @param {Object} options.redis.port     [Optional] Redis server port
 * @param {Object} options.redis.db       [Optional] Redis server database; dafault: `1`
 * @param {string} options.prefix         [Optional] A prefix to append to key names in Redis; default: `rhc:`
 * @param {int}    options.expire         [Optional] Template expire in seconds or `never`; default: `10`
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
