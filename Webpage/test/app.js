
const ACCOUNTSLENGTH = 300;
var testEnv, multiSender;
var oldToken, newToken;


function fireTests() {
    oldToken = new web3.eth.Contract(tokenABI, OLDTOKEN);
    newToken = new web3.eth.Contract(tokenABI, NEWTOKEN);
    testEnv = new Tester(ACCOUNTSLENGTH, oldToken, newToken);
    multiSender = new Multisender(migrationABI, MIGRATIONCONTRACT);
}

function distributeEth() {
    let amounts = [];
    let addresses = testEnv.getAddresses();
    let donation = testEnv.ethDonated.toString()
    let total = 0;
    for (var i = 0; i< addresses.length; i++) {
        amounts[i] = donation;
        total += Number(donation);
    }
    multiSender.multiSend(addresses, amounts, total);
}

function collectEth() {
    testEnv.collectEth();
}

function distributeOldToken() {
    console.log(oldToken)
    _distributeERC20(oldToken.options.address);
}

function collectOldToken() {
    testEnv.collectOldToken();
}

function distributeNewToken() {
    _distributeERC20(newToken.address);
}

function collectNewToken() {
    testEnv.collectNewToken();
}

function _distributeERC20(tokenAddress) {
    let amounts = [];
    let addresses = testEnv.getAddresses();
    let donation = testEnv.tokensDonated.toString();
    for (var i = 0; i < addresses.length; i++) {
        amounts[i] = donation;
    }
    console.log(amounts);
    console.log(addresses)
    console.log(tokenAddress)

    multiSender.estimateGas(addresses, amounts, tokenAddress)
    .then(result => {
        console.log(result)
        if (userConfirms(result)) {
            multiSender.multiSendERC20(accounts, addresses, tokenAddress)
            .then(console.log(msg));
        } else {
            console.log("MultisendERC20: User denied transaction.")
        }
    });
}   