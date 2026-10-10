var hogan = require('hogan.js')
  , redis = require('redis')
  , fs = require('fs')

/**
 * Create a Redis Hogan Cache
 *
 * @param {Object} options                Settings to use to RHC
 * @param {Object} options.client         A Redis client instance
 * @param {Object} options.redis          [Optional] Redis client information, if options.client not used
 * @param {Object} options.redis.hostname [Optional] Redis server hostname
 * @param {Object} options.redis.password [Optional] Redis server password
 * @param {Object} options.redis.port     [Optional] Redis server port
 * @param {Object} options.redis.db       [Optional] Redis server database; dafault: `1`
 * @param {string} options.prefix         [Optional] A prefix to append to key names in Redis; default: `rhc:`
 * @param {int}    options.expire         [Optional] Template expire in seconds or `never`; default: `10`
 */
module.exports = function (options) {
    if(!options.prefix)
        options.prefix = 'rhc:'
    if(!options.client){
        // Without the offline queue a Redis outage fails fast and render falls back to the file
        options.client = redis.createClient({
            host: options.redis.hostname,
            port: options.redis.port,
            password: options.redis.password || undefined,
            db: options.redis.db === undefined ? 1 : options.redis.db,
            enable_offline_queue: false
        })
        // Without a listener a lost Redis connection would crash the process
        options.client.on('error', ignore)
    }
    if(!options.expire)
        options.expire = 10
    module.options = options
}

function ignore(){}

function expire(name, time){
    if(!time)
        time = module.options.expire
    if(time !== 'never')
        module.options.client.expire(name, time, ignore)
}

module.exports.render = function(filePath, options, callback){
    // Cache the template source, not compiled code: up to 1.0.2 the cache held code that
    // render ran with eval, so anyone who could write to Redis could run code in the app
    var key = module.options.prefix + 'source:' + filePath
    module.options.client.get(key, function(errRedis, cached){
        if(!errRedis && cached !== null){
            expire(key, options.expire)
            return render(cached)
        }
        fs.readFile(filePath, 'utf8', function (errFS, content) {
            if(errFS)
                return callback(errFS)
            module.options.client.set(key, content, ignore)
            expire(key, options.expire)
            render(content)
        })
    })

    function render(template){
        var html
        try {
            html = hogan.compile(template).render(options)
        } catch (err) {
            return callback(err)
        }
        callback(null, html)
    }
}
