var express = require('express');
var mongodb = require('mongodb');
var uri = 'mongodb://heroku_h54bh5gb:86scquns00al3p7qe2ieo1hjn8@ds023932.mlab.com:23932/heroku_h54bh5gb'
var counter = 0;

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	var url = request.query.url;
	if(url == undefined) {
		response.render('pages/index');
	}
	else{
		//need to verify that the url is in the right format, else need to let them know to try again...
		var valid = validateURL(url);
		if(valid == true)  {
			//connect to database
			mongodb.MongoClient.connect(uri, function(err, db) {
				if(err) {
					response.json({
						"error": err
					});
				}
				insertDocument(db, function(short_url) {
					db.close();
					if(short_url != null){
						response.json({
							"original_url": url,
							"shortened_url": short_url
						});
					}
					else {	
						response.json({
							"error": "There was an error creating the shortened url. Please try again."
						});
					}
				}, response, url);
			});
		}
		else {
			response.json({
							"error": "Incorrect format format for url. Please use this format: http://www.example.com"
						});
		}
	}
});

app.get('*', function(request, response) {
	var url = request.url;
	//connect to database
	mongodb.MongoClient.connect(uri, function(err, db) {
		if(err) {
			response.json({
				"error": err
			});
		}
		urlCheck(db, function(original_URL) {
			db.close();
			if(original_URL != null){
				response.redirect(original_URL);
			}
			else {	
				response.json({
					"error": "shortened URL does not exist"
				});
			}
		}, response,url);
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

//checks to see if shortened url exisits, if it does redirect to original url, else display error
function urlCheck(db,callback,response,tempurl){
	var original_URL = null;
	var cursor = db.collection('urls').find( { "shortened_URL": "https://damp-meadow-51229.herokuapp.com"+tempurl } );
	cursor.each(function(err, doc) {
		if(err) {
			console.log(err);
			response.json({
				"error": err
			});
		}
		if (doc != null) {
			original_URL = doc.original_URL;
		} else {
			callback(original_URL);
		}
	});
}

//insert url into collection
function insertDocument(db, callback, response, tempurl) {
	counter = 0;
	countUrls(db, function() {
		var shortURL = "https://damp-meadow-51229.herokuapp.com/"+(counter+1);
		db.collection('urls').insertOne( {
			"original_URL": tempurl,
			"shortened_URL": shortURL
		}, function(err, result) {
			if(err) {
				console.log(err);
				response.json({
					"error": err
				});
			}
			callback(shortURL);
		});
	});
};

function countUrls(db, callback) {
	var urls =db.collection('urls').find( );
	urls.each(function(err, doc) {
		if(err) {
			console.log(err);
		}
		if (doc != null) {
			counter++;
		} else {
			callback();
		}
	});
};

function validateURL(url){
    var re = /^(https?:\/\/www\.)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return re.test(url);
}