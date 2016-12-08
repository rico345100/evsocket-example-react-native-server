"use strict";
const httpServ = require('http').createServer();
const EvSocket = require('evsocket');
const socketServ = EvSocket.createServer({ server: httpServ });
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	return res.sendFile(__dirname + '/client/index.html');
});
app.get('/app.js', (req, res) => {
	return res.sendFile(__dirname + '/client/app.js');
});
app.get('/evsocket-client.js', (req, res) => {
	return res.sendFile(__dirname + '/node_modules/evsocket-client/evsocket-client.js');
});

socketServ.on('connection', (socket) => {
	console.log('Socket ' + socket.id + ' connected.');

	socket.on('close', (code, reason) => {
		console.log('Socket ' + socket.id + ' closed.');
		if(socket.channelName) {
			socket.broadcast('chat', {
				who: 'system',
				message: socket.id + ' left channel(socket closed).'
			});
		}
	});
	socket.on('channelleave', (channelName) => {
		socket.broadcast('chat', {
			who: 'system',
			message: socket.id + ' left channel.'
		});
	});
});

httpServ.on('request', app);
httpServ.listen(3320, () => {
	console.log('EvSocket Server listens at *:3320');
});