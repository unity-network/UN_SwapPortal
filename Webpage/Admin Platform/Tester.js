class Tester {

  constructor(arrayLimit, oldToken, newToken) {
    this.web3 = window.web3;
    this.multiSender = new Multisender(migrationABI, MIGRATIONCONTRACT)
    this.ethDonated = 1*10e14;
    this.tokensDonated = 1*10e18;
    this.setAccounts(arrayLimit);
    this.oldToken = oldToken;
    this.newToken = newToken;
  }

  createAccounts(arrayLimit) {
    let accounts = [];
    for (var i=0; i < arrayLimit; i++) {
        this.web3.eth.accounts.create()
        accounts.push(this.web3.eth.accounts.create());
    }
    console.log(accounts);
    return accounts;
  }

  setAccounts(arrayLimit) {
      this.accounts = this.createAccounts(arrayLimit);
  }


  collectEth() {
      this.accounts.forEach(account => {
          this.web3.eth.accounts.signTransaction(
              {to:currentAccount, value:(this.ethDonated-(5*10e13)).toString(), gas:3000000}, 
               account.privateKey)
              .then(tx => {
                  this.web3.eth.sendSignedTransaction(tx.rawTransaction)
                  .then(receipt => console.log(receipt))
              })
      })   
  }

  collectNewToken() {
    // {to: contractAddress, data: callData}
    let callData = this.newToken.methods.transfer(currentAccount, this.tokensDonated).encodeABI();
    this.accounts.forEach(account => {
      this.web3.eth.accounts.signTransaction(
          {to:currentAccount, gas:3000000, data:callData}, 
           account.privateKey)
          .then(tx => {
              this.web3.eth.sendSignedTransaction(tx.rawTransaction)
              .then(receipt => console.log(receipt))
          })
    })   
  }

  collectOldToken() {
    // {to: contractAddress, data: callData}
    let callData = this.oldToken.methods.transfer(currentAccount, this.tokensDonated.toString()).encodeABI();
    this.accounts.forEach(account => {
      this.web3.eth.accounts.signTransaction(
          {to:currentAccount, gas:3000000, data:callData}, 
           account.privateKey)
          .then(tx => {
              this.web3.eth.sendSignedTransaction(tx.rawTransaction)
              .then(receipt => console.log(receipt))
          })
    })   
  }

  getAddresses() {
      let addresses = this.accounts.map(account => account.address);
      console.log(addresses);
      return addresses;
  }

}