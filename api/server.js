const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;
var FormData = require('form-data');
const fetch = require("node-fetch");
global.Headers = fetch.Headers;

// monzo auth data
const clientId = 'oauth2client_0000A0KbBZa0KNVrXacVzG';
const redirectUrl = 'http://localhost:3000';
const clientSecret = 'mnzconf.jz53zo9w6vTQ8b9yGkQys/YPNdVNK6BRiIpOec+8EbkX7dKOvzxfBJJ1VzYJX4FhFsGBJ2yDeo5F4NLPGmuO';

// monzo access token, should be instantiated as empty 
var monzoAccessToken = '';
// monzo account id
var monzoAccountId = '';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../my-app/build')));


app.get('/api/monzoIsAuthenticated', (req, res) => {
  console.log('Checking monzo access token : ' + monzoAccessToken);
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

  var data = new FormData();
  data.append('grant_type', 'authorization_code')
  data.append('client_id', clientId)
  data.append('client_secret', clientSecret)
  data.append('redirect_uri', redirectUrl)
  data.append('code', authCode)

  var url = "https://api.monzo.com/oauth2/token"

  var requestRes = await new Promise((resolve, reject) => {
    data.submit(url, function(err, res) {

      if(err) reject(err)
  
      var body = '';
  
      res.on('data', function(chunk) {
        body += chunk;
      });
  
      res.on('end', function() {
        var bodyJson = JSON.parse(body);
        console.log(bodyJson);
        if (bodyJson.access_token) {
          monzoAccessToken = bodyJson.access_token;
          resolve('success')
        } else {
          reject('')
        }
      })
  
    });
  })

  console.log('monzo access token : ' + monzoAccessToken);

  if (requestRes = 'success') {
    console.log('Access token request was successful, monzo access token is : ' + monzoAccessToken);
    res.json(true);
  } else {
    console.log('Access token request was unsucessful, monzo access token is : ' + monzoAccessToken);
    res.json(false);
  }

})


app.get('/api/getMonzoBalance', async (req, res) => {

  // check if account id has already been fetched
  await getAccountId()

  let url = "https://api.monzo.com/balance";

  const myHeaders = new Headers();
  console.log('getting balance');

  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + monzoAccessToken);

  let requestRes = await new Promise((resolve, reject) => {
    fetch(url + '?account_id=' + monzoAccountId, {
      method: 'GET',
      headers: myHeaders
    })
    .then(res => res.json())
    .then(data => {resolve(data)})
  });

  console.log();
  console.log('getMonzoBalance result :');
  console.log(requestRes);
  console.log();

  res.json(requestRes);

})

app.get('/api/getMonzoPots', async (req, res) => {

  // check if account id has already been fetched
  await getAccountId()

  let url = "https://api.monzo.com/pots";

  const myHeaders = new Headers();
  console.log('getting pots');

  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Bearer ' + monzoAccessToken);

  let requestRes = await new Promise((resolve, reject) => {
    fetch(url + '?current_account_id=' + monzoAccountId, {
      method: 'GET',
      headers: myHeaders
    })
    .then(res => res.json())
    .then(data => {resolve(data)})
  });

  console.log();
  console.log('getMonzoPots result :');
  console.log(requestRes);
  console.log();

  res.json(requestRes);

})

async function getAccountId() {

  if (monzoAccountId == '') {

    let url = "https://api.monzo.com/accounts";
    console.log('getting accounts');
    
    const myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + monzoAccessToken);
    
    let requestRes = await new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: myHeaders,
      })
      .then(res => res.json())
      .then(data => {resolve(data)})
    });

    console.log();
    console.log('getAccountId result : ');
    console.log(requestRes);
    console.log();

    monzoAccountId = requestRes.accounts[0].id;
  }

} 


app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});