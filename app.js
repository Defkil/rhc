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
 * @param {int}    options.expire         [Optional] Template expire; default: `never`
 */
module.exports = function (options) {
    if(!options.prefix)
        options.prefix = 'rhc:'
    if(!options.client){
        options.client = redis.createClient(options.redis.port, options.redis.hostname)
        if(options.redis.password)
            options.client.auth(options.redis.password, function (err) {if(err) new Error(err)})
        if(!options.redis.port)
            options.redis.port = 6379
        if(!options.redis.db)
            options.redis.db = 1
        options.client.select(options.redis.db, function(err){if(err) new Error(err)})
    }
    if(!options.expire)
        options.expire = 10
    module.options = options
}

function expire(name, time){
    if(!time)
        time = module.options.expire
    if(time !== 'never'){
        module.options.client.expire(name, time, function(err){
            if(err) new Error(err)
        })
    }
}

module.exports.render = function(filePath, options, callback){
    module.options.client.get(module.options.prefix + filePath, function(errRedis, response){
         if(errRedis) new Error(errRedis)
         if(response === null){
            fs.readFile(filePath, function (errFS, content) {
                if(errFS) new Error(errFS)
                module.options.client.set(module.options.prefix + filePath
                 , 'new hogan.Template(' + hogan.compile(content.toString(), {asString: true}) + ')'
                 , function(errRedisCache,responseCache){
                    if(errRedisCache) new Error(errRedisCache)
                    if(responseCache !== 'OK') new Error(responseCache)
                })
                expire(module.options.prefix + filePath, options.expire)
                return callback(null, hogan.compile(content.toString()).render(options))
            })
         }else{
             expire(module.options.prefix + filePath, options.expire)
             return callback(null, eval(response).render(options))
         }
    })
}