// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenSwap {
    using SafeMath for uint256;
    uint256 public _arrayLimit = 250;
    /**
     * @dev Emitted when 'total' tokens are moved to multiple other accounts
     */
    event MultiSend(uint256 total, address tokenAddress);
    
    /**
     * @notice Does multiple ERC20 transfers in one transaction
     * 
     * @dev The array length limit prevents the function to exceed block gas limit
     * @dev allowance[msg.sender][address(this)] > SUM(amounts)
     * otherwise the transaction will revert when the contract runs out of allowance
     * @dev balanceOf(msg.sender) > SUM(amounts) 
     * otherwise the transaction will revert when msg.sender runs out of funds

     * @param receivers The list of addresses to transfer the tokens to
     * @param amounts The list of the corresponding amounts to be transfered
     * @param token The contract address of the ERC20 token being transfered
     */
    
    function multiSendERC20(address[] calldata receivers, uint256[] calldata amounts, address token) external  {
        require(receivers.length == amounts.length, "Each receiver address must have exactly one correspondent amount to be sent");
        require(receivers.length < _arrayLimit, "The given address list exceeds allowed size");
        ERC20 _token = ERC20(token);
        uint256 total = 0;
        
        for (uint256 i=0; i<receivers.length; i++) {
            _token.transferFrom(msg.sender, receivers[i], amounts[i]);
            total += amounts[i];
        }
        emit MultiSend(total, token);
    }  
}