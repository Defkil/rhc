var test = require('node:test')
  , assert = require('node:assert')
  , fs = require('node:fs')
  , os = require('node:os')
  , path = require('node:path')
  , rhc = require('..')

function fakeClient(entries){
    var store = new Map(entries)
    return {
        get: function (key) { return Promise.resolve(store.has(key) ? store.get(key) : null) },
        set: function (key, value) { store.set(key, value); return Promise.resolve('OK') },
        expire: function () { return Promise.resolve(1) }
    }
}

function render(file, options){
    return new Promise(function (resolve) {
        rhc.render(file, options, function (err, html) { resolve({ err: err, html: html }) })
    })
}

function template(content){
    var file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rhc-')), 'index.html')
    fs.writeFileSync(file, content)
    return file
}

test('renders from the file, then from the cached source', async function () {
    var file = template('<h1>{{message}}</h1>')
    rhc({ client: fakeClient() })
    assert.deepStrictEqual(await render(file, { message: 'a' }), { err: null, html: '<h1>a</h1>' })
    fs.writeFileSync(file, 'changed on disk')
    assert.deepStrictEqual(await render(file, { message: 'b' }), { err: null, html: '<h1>b</h1>' })
})

test('treats cached content as a template, never as code', async function () {
    var code = '({ render: function () { return process.pid } })'
    rhc({ client: fakeClient([['rhc:source:x.html', code]]) })
    assert.deepStrictEqual(await render('x.html', {}), { err: null, html: code })
})

test('falls back to the file when Redis fails', async function () {
    var client = fakeClient()
    client.get = function () { return Promise.reject(new Error('Redis is down')) }
    client.set = function () { throw new Error('The client is closed') }
    rhc({ client: client })
    assert.deepStrictEqual(await render(template('{{message}}'), { message: 'ok' }), { err: null, html: 'ok' })
})

test('passes a missing template to the callback', async function () {
    rhc({ client: fakeClient() })
    assert.strictEqual((await render('does-not-exist.html', {})).err.code, 'ENOENT')
})
