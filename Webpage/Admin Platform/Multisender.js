class Multisender {

   constructor(abi, contractAddress) {
      this.multiSender = new web3.eth.Contract(abi, contractAddress);
   }

   async estimateGas(addresses, amounts, tokenAddress) {
      return this.multiSender.methods.airDropERC20(addresses, amounts, tokenAddress)
      .estimateGas({from: currentAccount})
      .then(result => { return result })
   }

   async multiSendERC20(addresses, amounts, tokenAddress) {
      return this.multiSender.methods.airDropERC20(addresses, amounts, tokenAddress)
      .send({from: currentAccount, gas: 4000000})
      .then(receipt => { return receipt });
   }
         
  async multiSend(addresses, amounts, total) {
      return this.multiSender.methods.airDropETH(addresses, amounts)
      .send({from: currentAccount, value: total, gas: 10000000})
      .then(receipt => { return receipt });
   }
   
}