
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , models = require('./models')
  , User = models.User;

  var mongoose = require('mongoose');

  mongoose.connect('mongodb://127.0.0.1:27017/testgl')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname+'/public/images/favicon.ico'));
console.log('icoPath:'+__dirname+'/public/images/favicon.ico');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/users', function(req, res) { 
    User.find(function(err, doc) { 
        res.json(doc); 
    }); 
})
app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/testgl',user.testgl);
app.get('/glbanner',user.glbanner);
app.get('/responsive',user.responsive);
app.get('/haha',user.haha);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
