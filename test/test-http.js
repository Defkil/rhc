var http = require('http')
  , rhc = require('../app.js')

//create a new rhc instance
rhc({prefix:'rhc:', redis:{hostname:'localhost', password:'', port:6379, db:0}})

var server = http.createServer(function(req, res){
    //use rhc.render()
    rhc.render('../views/index.html', {message:'A awesome Site', expire:100}, function(err, html){
      res.end(html) 
    })
})

server.listen(3000, function(){
    console.log('Server startet http://localhost:3000')
})
