
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bodyParser=require('body-parser')
  , cors = require('cors');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.methodOverride());
app.use(cors());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* This code is to send email, reference: http://tphangout.com/angular-2-sending-mails-from-your-app/
 * Head over to Account Security Settings (https://www.google.com/settings/security/lesssecureapps)
 * and enable "Access for less secure apps", this allows you to use the google smtp for clients other 
 * than the official ones. see reference: https://stackoverflow.com/questions/20337040/gmail-smtp-debug-error-please-log-in-via-your-web-browser
*/
var email   = require("emailjs/email");

app.post('/sendmail', function(req, resp){	
	//resp.send("{\"success\":false}");        
	var server  = email.server.connect({
		user: "hhy615@gmail.com", 
		password: process.env.gmailPwd, 
		host:    "smtp.gmail.com", 
		authentication : "login",
		ssl:     true
	});

	// send the message and get a callback with an error or details of the message that was sent
	server.send({
	   text:    "Dear Customer:\n\nThank you for purchase. \n\nThis is an automatically generated message to confirm receipt of your order via the Internet. You do not need to reply to this e-mail, but you may wish to save it for your records.\n\nYour order should arrive in four to six weeks. \n\nThank you.\nSale Center", 
	   from:    "hhy615@gmail.com", 
	   to:      req.body.userName,
	   subject: "Welcome mail"
	}, function(err, message) { 
		console.log("sending email");
		console.log("req.body.userName: " + req.body.userName);
	    if(err) {
	    	console.log(err);
	    } else {
	    	return resp.json({success: true, msg: 'sent'});
	    }
	});
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
