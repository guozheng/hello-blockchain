var httpClient = require('request');

// see API doc at https://stellar.github.io/js-stellar-sdk/index.html
var StellarSdk = require('stellar-sdk');

// use the following to generate a pair
var pair = StellarSdk.Keypair.random();
var secret = pair.secret();
var publicKey = pair.publicKey();

console.log("secret: ", secret);
console.log("public key: ", publicKey);

httpClient.get({
    url: 'https://horizon-testnet.stellar.org/friendbot',
    qs: { addr: publicKey },
    json: true
}, function(error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error('ERROR!', error || body);
  } else {
    console.log('SUCCESS! You have a new account :)\n', body);
  }
});
