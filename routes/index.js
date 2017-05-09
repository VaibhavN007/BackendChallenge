var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.all('/process/*', function(req, res) {
	
	var responseObj = {
		time: new Date(),
		method: req.method,
		headers: req.headers,
		path: req.originalUrl,
		query: req.query,
		body: req.body,
		duration: getRandomInt(15, 30)
	};

	res.status(200).json(responseObj);
});

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = router;
