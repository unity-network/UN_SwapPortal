// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UNT is ERC20 {
    constructor() ERC20("UNT", "UNT") {
        _mint(msg.sender, 12000000 * 10 ** decimals());
    }
}