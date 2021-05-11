# UN_SwapPortal

This repository contains the tools that will be used to migrate from the LOCK ERC20 token to the new UNT ERC20 token. Specifically:

- A single function migration smart contract to air drop the UNT token to multiple addresses in a single transaction.

- A frontend interface to monitor deposits of the old LOCK token and interact with the migration contract when the time comes to air drop.

- A frontend interface to simplify the task of sending held LOCK and give feedback to holders on the current state of the migration. This interface's code is to be merged with the official one, designed by the UNT team. 


# Proposed solution for the migration process

## Glossary

Team: The UNT project team  
Holders: Addresses with positive LOCK (old token) balance  
Migration Contract: The smart contract used to air drop the UNT (the new token)  


## It is important to first understand the specific requirements of this migration

1. The old token cannot be burned because a pool exists in Uniswap with trapped ETH in it. The requirement is that the old tokens can be collected by the project team, so to recover the ETH on UniSwap and use it to create a new pool for the new UNT token. 

2. UNT will be sent to depositors in a proportion of 1 UNT per 1 LOCK. 

3. Transaction fees should be minimized.

4. Transaction fees should not be relayed to the holders. The team will cover for the major expenses of the migration. The number of transactions a LOCK holder needs to do to receive the new UNT token should be minimized.

5. The UNT token contract must be as vanilla and standard as possible. Including migration functionality in this contract was never considered as an option. 


## Process overview

First, holders deposit their LOCK on a team's address, one by one. When the given timeframe expires, the team fetches a list with all the depositors and drops, in a single transaction, the new token to all the holders. The team then takes the LOCK and exchanges it for ETH in the UniSwap pool. This ETH is used to create the new UNT pool.


## Process Details

1. During a predetermined time frame, all holders can go to the web-platform and "deposit" their LOCK. Deposited LOCK will be stored safely on an address controlled by the team. Using the etherscan API, an interface is built for the team to obtain a list, at any time, with the addresses that already deposited LOCK and the corresponding amount. Holders can also view this information for their addresses.

2. The migration contract must be deployed to the mainnet. 

3. The UNT token contract must be deployed to the mainnet. 

4. The deployer of the UNT contract, and thus single holder of all UNT tokens must give an allowance to the migration contract big enough to provide for all the UNT being air dropped. This means that the migration contract must have access to the UNT funds, otherwise it will not be able to airdrop the token. More specifically, this will be done by calling "approve()" on the UNT token contract. The approved amount should be equal to the total amount of LOCK tokens deposited by the holders. 

5. When the deadline arrives, an already prepared script will be executed by the team by pressing a button in the admin frontend platform. A list of depositors and amounts will be compiled and a transaction sent to the migration contract with this list as parameter. 

6. The address pushing the migrate button reffered in step (5) MUST BE THE DEPLOYER OF THE UNT TOKEN. It will now have to sign the transaction on MetaMask and have enough ETH to pay one fee of around half a block size. The value should be in the range of the thousands of dollars (according to current gas price). Depending on the amount of holders, there might be a need to split this transaction in two or three. This split will be done automatically, but I explain why for the more curious:

      a. If a single transaction spends more gas than the block gas limit, it gets reverted when it runs out of gas and the sender loses all the fees paid up to that point. This can amount to thousands of dollars lost. 

      b. If a single transaction spends close to the block gas limit, it will never be included in a block unless the gas price paid is humongous. This is because a whole-block transaction needs to be the first to be added to a block (needs a virgin block). 

      c. Thus, we need to find a balance in batching enough transfers to economize on fees, but avoid batching so many that our batch transaction never goes through. We will aim for 150-200 transfers per transaction (around half a block of gas).

      An interesting thread on the topic of batching transactions can be found here: https://www.reddit.com/r/ethdev/comments/8ofb32/batching_erc20_transfers_can_let_you_send_over/
 
7. Confirmation will be received for each batch transfer transaction that goes through. In the end of the process, the total UNT air dropped will be compared to the LOCK deposited and the two must match. The approved UNT amount for the migration contract on behalf of the deployer should now be 0.
