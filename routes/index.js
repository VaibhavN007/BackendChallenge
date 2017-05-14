var express = require('express');
var router = express.Router();
var http = require('http');
var server = require('websocket').server;

var stats = {
	totalRequests: 0,		//	total number of reqests since server startup
	getRequests: 0,			//	active get requests
	postRequests: 0,		//	active post requests
	putRequests: 0,			//	active put requests
	deleteRequests: 0,		//	active delete requests
	pastHour: {
		totalRequests: 0,	//	total requests in the past hour
		avgResponseTime: 0	//	average response time for the requests in the past hour
	},
	pastMinute: {
		totalRequests: 0,	//	total requests in the past minute
		avgResponseTime: 0	//	average response time for the requests in the past minute
	}
};

function getStats(req, res, next) {

	stats.totalRequests++;

	incStats(req.method);

	next();
};

function incStats(reqType) {

	if(reqType == "GET")
		stats.getRequests++;
	else if(reqType == "POST")
		stats.postRequests++;
	else if(reqType == "PUT")
		stats.putRequests++;
	else if(reqType == "DELETE")
		stats.deleteRequests++;

};

function decStats(reqType) {

	if(reqType == "GET")
		stats.getRequests--;
	else if(reqType == "POST")
		stats.postRequests--;
	else if(reqType == "PUT")
		stats.putRequests--;
	else if(reqType == "DELETE")
		stats.deleteRequests--;

};

// create a new socket server
var socket = new server({
	httpServer: http.createServer().listen('8888')
});

socket.on('request', function(request) {
	var connection = request.accept(null, request.origin);

	//	send the stats every 5ms
	setInterval(function(){
		connection.send(JSON.stringify(stats));
	}, 5);

	connection.on('close', function() {
		stats.getRequests--;
	});
});


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.all('/process/*', getStats, function(req, res) {
	
	var responseObj = {
		time: new Date(),
		method: req.method,
		headers: req.headers,
		path: req.originalUrl,
		query: req.query,
		body: req.body,
		duration: getRandomInt(15, 30)
	};

	var sendResponse = new Promise(function(resolve, reject) {

		setTimeout(function(){
			resolve();
		}, responseObj.duration * 1000);

	})
	.then(function() {
		res.status(200).json(responseObj);
	})
	.then(function() {
		decStats(req.method);
	})
	.catch(function(err) {
		decStats(req.method);
		console.err("!! ERROR", err);
	});


});

router.get('/stats', function(req, res) {
	res.render('stats');
});

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = router;
