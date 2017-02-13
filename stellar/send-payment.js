/**
 * Send payment to another account, example is from https://www.stellar.org/developers/guides/get-started/transactions.html
 * Source account:
 * - secret: SCUMNQAHTHWF5RWYL34G6QLROA3DTJLZCM43FLQVHAG5XSWGVYJGNGED
 * - public key: GAP3JJWBZBQ4M4UMFLLO3PJ7BJL6E6L7DKOA7M3YJMYZAPLI2Z74Y57P
 * Destination account:
 * - secret: SCH2ALNHFV2M5E5J4DXFW7JTIDDTSHUTOM4QEC5DDUG27PODVAULPY3V
 * - public key: GAJSDNOHEXCCW2GE6YC5D5K2VD4FGMFLKWG33WCJDXME334P3SNAKE76
 */
var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const srcSecret = 'SCUMNQAHTHWF5RWYL34G6QLROA3DTJLZCM43FLQVHAG5XSWGVYJGNGED';
var srcPair = StellarSdk.Keypair.fromSecret(srcSecret);
const destPubKey = 'GAJSDNOHEXCCW2GE6YC5D5K2VD4FGMFLKWG33WCJDXME334P3SNAKE76';

server.loadAccount(destPubKey)
    .catch(StellarSdk.NotFoundError, function(error) {
        throw new Error('Error: receiving account does not exist!');
    })
    .then(function() {
        return server.loadAccount(srcPair.publicKey());
    })
    .then(function(srcAccount) {
        console.log('Balance for account before transfer:', srcPair.publicKey(), ', sequence:', srcAccount.sequence);
        srcAccount.balances.forEach(function(balance) {
            console.log('Asset type:', balance.asset_type, ', balance:', balance.balance);
        });
        var trx = new StellarSdk.TransactionBuilder(srcAccount)
            .addOperation(StellarSdk.Operation.payment({
                destination: destPubKey,
                asset: StellarSdk.Asset.native(),
                amount: '10'
            }))
            // memo has a max length of 28 bytes, do not exceed the max length
            .addMemo(StellarSdk.Memo.text('Sending 10 Lumen'))
            .build();
        trx.sign(srcPair);
        return server.submitTransaction(trx);
    })
    .then(function(result) {
        console.log('Success! Result:', result);
    })
    .catch(function(error) {
        console.error('Failure! Could not send payment:', error);
    })
    // load src account again to check balance
    .then(function(){
        return server.loadAccount(srcPair.publicKey());
    })
    .then(function(srcAccount) {
        console.log('Balance for account after transfer:', srcPair.publicKey(), ', sequence:', srcAccount.sequence);
        srcAccount.balances.forEach(function(balance) {
            console.log('Asset type:', balance.asset_type, ', balance:', balance.balance);
        });
    });

