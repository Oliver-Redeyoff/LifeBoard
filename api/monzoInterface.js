var clientId = 'oauth2client_0000A0KbBZa0KNVrXacVzG';
var redirectUrl = 'http://192.168.1.83:3000/';
var clientSecret = 'mnzconf.jz53zo9w6vTQ8b9yGkQys/YPNdVNK6BRiIpOec+8EbkX7dKOvzxfBJJ1VzYJX4FhFsGBJ2yDeo5F4NLPGmuO';

exports.MonzoAuthenticate = function() {
    // start by seeing if there is a 'code' parameter in the current URL
    var params = getParams(window.location.href);
    console.log(params);

    // if there is a code, exchange it for access token
    if (params.code) {
        getAccessToken(params.code)
            .then(data => {
                console.log(data); // JSON data parsed by data.json() call
            });
    } else {
        getMonzoPermissions();
    }

}

function getMonzoPermissions() {
    var url = 'https://auth.monzo.com/?client_id=' + clientId +'&redirect_uri=' + redirectUrl + '&response_type=code'
    window.open(url);
}

async function getAccessToken(code) {

    console.log('attempting to get access token')

    var data = new FormData();
    data.append('grant_type', 'authorization_code')
    data.append('client_id', clientId)
    data.append('client_secret', clientSecret)
    data.append('redirect_uri', redirectUrl)
    data.append('code', code)

    var url = "https://api.monzo.com/oauth2/token"

    // var request = new XMLHttpRequest();

    // request.onreadystatechange = function() {
    //     console.log()
    // }

    // request.open("POST", url);
    // request.send(data);

    const response = await fetch(url, {
        method: 'POST',
        body: data
      });

    return response.json();
}