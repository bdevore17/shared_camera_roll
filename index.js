var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var path = require('path');

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL not specified');
  process.exit();
}

var api = new ParseServer({
  databaseURI: process.env.DATABASE_URL,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Photos"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

var config = {
    "apps": [{
      "serverURL": process.env.SERVER_URL,
      "appId": process.env.APP_ID,
      "masterKey": process.env.MASTER_KEY,
      "appName": "Shared_Camera_Roll"
    }],
    "users": [{
      "user": process.env.USERNAME,
      "pass": process.env.PASSWORD
    }],
    "useEncryptedPasswords": true
  };

var dashboard = new ParseDashboard(config, true);
app.use('/dashboard', dashboard);

app.get('/', function(req, res) {
  res.status(200).send('Shared Camera Roll Server is up and running.');
});


var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('shared_camera_roll running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);