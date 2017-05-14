var content = document.getElementById('content');
var socket = new WebSocket('ws://localhost:8888');
var totalReq = document.querySelector('#totalReq');
var getReq = document.querySelector('#getReq');
var postReq = document.querySelector('#postReq');
var putReq = document.querySelector('#putReq');
var deleteReq = document.querySelector('#deleteReq');

socket.onopen = function () {
	socket.send('hello from the client');
};

socket.onmessage = function (message) {
	var stats = JSON.parse(message.data);
	totalReq.innerHTML = stats.totalRequests;
	getReq.innerHTML = stats.getRequests;
	postReq.innerHTML = stats.postRequests;
	putReq.innerHTML = stats.putRequests;
	deleteReq.innerHTML = stats.deleteRequests;
};

socket.onerror = function (error) {
	alert("WebSocket error "+ error);
	console.log('WebSocket error: ' + error);
};