const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;
const monzoIntereface = require('./monzoInterface');

// monzo auth data
var clientId = 'oauth2client_0000A0KbBZa0KNVrXacVzG';
var redirectUrl = 'http://192.168.1.98:3000';
var clientSecret = 'mnzconf.jz53zo9w6vTQ8b9yGkQys/YPNdVNK6BRiIpOec+8EbkX7dKOvzxfBJJ1VzYJX4FhFsGBJ2yDeo5F4NLPGmuO';

// place holder for the data
const users = [];
var monzoAccessToken = '';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../my-app/build')));


app.get('/api/monzoIsAuthenticated', (req, res) => {
  if (monzoAccessToken == '') {
    res.json(false);
  } else {
    res.json(true);
  }
});


app.get('/api/getMonzoRedirectLink', (req, res) => {
  var link = 'https://auth.monzo.com/?client_id=' + clientId +'&redirect_uri=' + redirectUrl + '&response_type=code'
  res.json(link);
})


app.post('/api/authenticateMonzo', async (req, res) => {
  const authCode = req.body.authCode;
  console.log('authCode: ' + authCode);

  var data = new FormData();
  data.append('grant_type', 'authorization_code')
  data.append('client_id', clientId)
  data.append('client_secret', clientSecret)
  data.append('redirect_uri', redirectUrl)
  data.append('code', code)

  var url = "https://api.monzo.com/oauth2/token"

  const response = await fetch(url, {
      method: 'POST',
      body: data
    });

  console.log(response.json);

  res.json(true);
})



app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});


app.get('/api/users', (req, res) => {
  console.log('api/users called!')
  res.json(users);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  console.log('Adding user:::::', user);
  users.push(user);
  res.json("user added");
});