var express = require('express')
  , rhc = require('../app.js')
  , http = require('http')
  , app = express()

//create a new rhc instance
rhc({prefix:'rhc:', redis:{hostname:'localhost', password:'', port:6379, db:0}})

app.set('port',  3000)
app.set('view cache', false)//disable express cache
app.set('view engine', 'html')//setup html engine
app.engine('html',rhc.render)//define rhc as render engine
app.set('views', '../views')

app.get('/', function (req, res) {
    res.render('index.html', {message:'A awesome Site', expire:100})
})

http.createServer(app).listen(app.get('port'), function(){
    console.log('Server startet http://localhost:' + app.get('port'))
})
