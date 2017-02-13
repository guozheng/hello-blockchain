/**
 * Get account info given the account id / public key
 * See API doc at https://stellar.github.io/js-stellar-sdk/index.html
 */
var StellarSdk = require('stellar-sdk');

var publicKey = 'GAJSDNOHEXCCW2GE6YC5D5K2VD4FGMFLKWG33WCJDXME334P3SNAKE76';
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

server.loadAccount(publicKey)
    .then(function(account) {
        console.log('Balance for account:', publicKey, ', sequence:', account.sequence);
        account.balances.forEach(function(balance) {
            console.log('Asset type:', balance.asset_type, ', balance:', balance.balance);
        });
    });