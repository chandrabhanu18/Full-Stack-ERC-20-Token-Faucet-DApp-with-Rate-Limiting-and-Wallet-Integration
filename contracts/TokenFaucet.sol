// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IToken {
    function mint(address to, uint256 amount) external;
}

contract TokenFaucet is ReentrancyGuard, Ownable {
    IToken public immutable token;

    uint256 public constant FAUCET_AMOUNT = 1000 * (10 ** 18);
    uint256 public constant COOLDOWN_TIME = 24 hours;
    uint256 public constant MAX_CLAIM_AMOUNT = 10_000 * (10 ** 18);

    bool private _paused;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Faucet: token address is zero");
        token = IToken(tokenAddress);
        _paused = false;
        transferOwnership(msg.sender);
    }

    function requestTokens() external nonReentrant {
        require(!_paused, "Faucet: paused");
        address user = msg.sender;

        // Cooldown check with explicit revert message
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) {
            revert("Faucet: cooldown active");
        }

        // Lifetime limit check with explicit revert message
        if (totalClaimed[user] + FAUCET_AMOUNT > MAX_CLAIM_AMOUNT) {
            revert("Faucet: lifetime limit reached");
        }

        // Effects
        lastClaimAt[user] = block.timestamp;
        totalClaimed[user] += FAUCET_AMOUNT;

        // Interaction - mint tokens to user
        token.mint(user, FAUCET_AMOUNT);

        emit TokensClaimed(user, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (_paused) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        return true;
    }

    function remainingAllowance(address user) public view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return 0;
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    function setPaused(bool paused_) external onlyOwner {
        _paused = paused_;
        emit FaucetPaused(paused_);
    }

    function isPaused() external view returns (bool) {
        return _paused;
    }
}
