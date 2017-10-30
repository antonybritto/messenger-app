import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import csp from 'helmet-csp';
import xssFilter from 'x-xss-protection';
import hsts from 'hsts';
import nosniff from 'dont-sniff-mimetype';
import frameguard from 'frameguard';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App.js';

const swFile = fs.readFileSync(path.join('sw.js'), { encoding: 'utf-8' });
const manifestFile = fs.readFileSync(path.join('manifest.json'), { encoding: 'utf-8' });

const credentials = {
  key: fs.readFileSync(path.join('key.pem')),
  cert: fs.readFileSync(path.join('cert.pem'))
};

function handleRender(req, res) {
  // Renders APP component into an HTML string
  const html = ReactDOMServer.renderToString(<App />);

  // Load contents of index.html
  fs.readFile('./index.html', 'utf8', function (err, data) {
    if (err) throw err;

    // Inserts the rendered React HTML into the main Section
    const document = data.replace(/<section id="app"><\/section>/, `<section id="app">${html}</section>`);

    // Sends the response back to the client
    res.send(document);
  });
}

const app = express();

// Security related
app.use(csp({
	directives: {
		'default-src': ["'self'"],
		'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
		'style-src': ["'self'", "'unsafe-inline'"],
		'img-src': ["'self'", 'https://message-list.appspot.com'],
		'font-src': ["'self'"],
		'frame-src': ["'self'"],
		'child-src': ["'self'"],
		'connect-src': ["'self'", 'https://message-list.appspot.com']
	}
}));

app.disable('x-powered-by');
app.use(xssFilter({ setOnOldIE: true }));
app.use(hsts({
	maxAge: 31536000,
	preload: true
}));
app.use(nosniff());
app.use(frameguard({ action: 'deny' }));

// Serve sw.js
app.get('/sw.js', function (req, res) {
	res.set({'Content-Type': 'application/javascript'});
	res.removeHeader('Set-Cookie');
	res.end(swFile);
});

// Serve manifest.json
app.get('/manifest.json', function (req, res) {
	res.set({'Content-Type': 'application/json'});
	res.end(manifestFile);
});

// Serve JS
app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set({'Content-Type': 'application/javascript', 'Content-Encoding': 'gzip', 'Cache-Control': 'max-age=2592000, s-maxage=2592000'});
  next();
});

// Serve CSS
app.get('*.css', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set({'Content-Type': 'text/css', 'Content-Encoding': 'gzip', 'Cache-Control': 'max-age=2592000, s-maxage=2592000'});
  next();
});

// Serve built files with static files middleware
app.use('/build', express.static(path.join(__dirname, 'build')));

// Serve requests with our handleRender function
app.get('/', handleRender);

// Serve 404
app.get('*', function(req, res) {
  res.status(404).send('Page Not found');
});

// const sslServer = https.createServer(credentials, app);

// // Start server
// sslServer.listen(8443, function () {
//   console.log('SSL Server listening on port', 8443);
// });

// var a = https.createServer(credentials, function (req, res) {
//   res.writeHead(200);
//   res.end("hello world\n");
// }).listen(8000);

// Start server
app.listen(3000);
