
async function checkStatus() {
    var textnode;
    var address = document.getElementById("addressInput").value;
    let message = await _checkStatus(address);
    textnode = document.createTextNode(message); 
    document.getElementById("migrantConsole").appendChild(document.createElement("br"));
    document.getElementById("migrantConsole").appendChild(textnode);
    textnode = document.createTextNode("- - - - - - - - - - - - - -")
    document.getElementById("migrantConsole").appendChild(document.createElement("br"));
    document.getElementById("migrantConsole").appendChild(textnode);
}

async function printMigrants() {
    let migrants = await _getMigrants(); //array of Txs
    totalCollected(migrants);
    var textnode;

    // Compose the CSV
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(migrants[0])
    const csv = [
    header.join(','), // header row first
    ...migrants.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    console.log(csv)
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "migrants.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    migrants.forEach(migrant => {
        textnode = document.createTextNode("From: "+migrant.from+" || Amount: "+migrant.value/10e17); 
        document.getElementById("adminConsole").appendChild(document.createElement("br"));
        document.getElementById("adminConsole").appendChild(textnode);


    })
}

async function airDrop() {
    let msg = await _airDrop();
    textnode = document.createTextNode(msg); 
    document.getElementById("adminConsole").appendChild(document.createElement("br"));
    document.getElementById("adminConsole").appendChild(textnode);
}

async function withdraw() {
    let msg = await _withdraw();
    textnode = document.createTextNode(msg); 
    document.getElementById("adminConsole").appendChild(document.createElement("br"));
    document.getElementById("adminConsole").appendChild(textnode);
}

function totalCollected(txs) {
    let total = _totalCollected(txs); // BigNumber https://github.com/indutny/bn.js/
    document.getElementById("totalCollected").innerText = "Total "+TICKER+" collected: \n"+web3.utils.fromWei(total.toString());
}

function updateStatus(account) {
    statusH2 = document.getElementById("status");
    if (account == null) {
        statusH2.innerText = "Not connected";
    } else {
        statusH2.innerText = "Connected " + account;
    }
}