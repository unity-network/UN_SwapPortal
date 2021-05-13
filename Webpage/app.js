/**
 * !!!! --- Test 1 --- !!!!
 * :: Account A sends 100 tokens to the Migration Contract. This must be retrievable using two different approaches:
 * 1. Check Account A transaction list and pull the transfer to the Migration Contract
 * 2. Check the Migration Contract tx list and pull Account A and the value sent
 */
// Implementing Test 1.1.....
// Fetches all transactions where [address] either sends or receives ERC20 tokens
fetch('https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=0x12a0778ba8Da6Fbbf59cfd6B2b90947C69176c5E&startblock=0&endblock=999999999&sort=asc&apikey=NYKIEH6R2AFQXJP5ANJSF1TUW42CFCI9KK')
.then(res => res.json())
// Now we filter to find transfer to the Migration Contract
.then(res => {
    txs = res.result;
    console.log(txs)
    const result = txs.filter(tx => tx.to == TOKENRECEIVER);
    result.forEach(tx => console.log("Sent "+100000000000000000000/(10e17)+" "+TICKER+" to Migration"));
})

// Implementing Test 1.2.....
fetch('https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=0xf53b16d20e501c7d65a1055eb41af4364509ebdf&startblock=0&endblock=999999999&sort=asc&apikey=NYKIEH6R2AFQXJP5ANJSF1TUW42CFCI9KK')
.then(res => res.json())
.then(res => {
    console.log("Transfers received by the Migration Contract: ");
    console.log(res);
});

async function _checkStatus(address) {
    if (address === "") { 
        return "Error: Empty address field";
    }

    return fetch('https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address='+address+'&startblock=0&endblock=999999999&sort=asc&apikey=NYKIEH6R2AFQXJP5ANJSF1TUW42CFCI9KK')
    .then(res => {return res.json()})
    // Now we filter to find transfer to the Migration Contract
    .then(res => {
        txs = res.result;
        console.log(txs)
        const result = txs.filter(tx => (tx.to == TOKENECEIVER) && (tx.contractAddress == OLDTOKEN) );
        let msg = '';
        result.forEach(tx => {
            console.log("Sent "+tx.value/(10e17)+" "+TICKER+" to Migration");
            msg += ("Sent "+tx.value/(10e17)+" "+TICKER+" to Migration")+"...";
        });
        return msg;
    })
}


async function _getMigrants() {
    return fetch('https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=0xf53b16d20e501c7d65a1055eb41af4364509ebdf&startblock=0&endblock=999999999&sort=asc&apikey=NYKIEH6R2AFQXJP5ANJSF1TUW42CFCI9KK')
    .then(res => { return res.json()})
    .then(res => {
        txs=res.result;
        txs = txs.filter(tx => tx.contractAddress == OLDTOKEN)
        console.log("Old Token transfers received by the Migration Contract: ");
        console.log(txs);
        return txs;
    });
}


async function _airDrop() {
    // Prepare 2 arrays: one for addresses and one for amounts
    const migrants = await _getMigrants();
    console.log("Migrants length: "+migrants.length);
    var addresses = new Array(migrants.length);
    var amounts = new Array(migrants.length);
    for (i=0;  i < addresses.length; i++) {
        addresses[i] = migrants[i].from;
        amounts[i] = migrants[i].value;
    }

    console.log(addresses);
    console.log(amounts);

    migration = new web3.eth.Contract(migrationABI, MIGRATIONCONTRACT);
    console.log(migration) // Test connection to contract

    return migration.methods.airDrop(addresses,amounts).send({from: currentAccount})
    .receipt(receipt => { return receipt; })
    .erro(err => {return err; });
}


async function _withdraw() {
    migration = new web3.eth.Contract(migrationABI, MIGRATIONCONTRACT);
    console.log(migration) // Test connection to contract

    return migration.methods.withdraw().send({from: currentAccount})
    .on("receipt", receipt => { return receipt; })
    .on("error", error => {return error; });
}


function _totalCollected(txs) {
    let total = web3.utils.toBN('0');
    txs.forEach(tx => {
        total = total.add(web3.utils.toBN(tx.value));
    });
    return total;
}

async function transfer() {
    const lockContract = new web3.eth.Contract(tokenABI, OLDTOKEN);
    console.log(currentAccount);
    lockContract.methods.balanceOf(currentAccount).call()
    .then(balance => {
        console.log("Token balance: "+balance);
        lockContract.methods.transfer(TOKENRECEIVER, balance).send({from: currentAccount})
        .on("receipt", receipt => { return receipt; })
        .on("error", error => { return error; });
    })

}