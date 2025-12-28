// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 public immutable MAX_SUPPLY;
    address public minter;

    constructor(string memory name_, string memory symbol_, uint256 maxSupply_) ERC20(name_, symbol_) {
        MAX_SUPPLY = maxSupply_;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Token: caller is not the minter");
        require(totalSupply() + amount <= MAX_SUPPLY, "Token: max supply exceeded");
        _mint(to, amount);
    }
}
