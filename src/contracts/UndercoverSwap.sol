pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";

contract UndercoverSwap {
  string public name = "UndercoverSwap Instant Exchange";
  Token public token;
  uint public rate = 10;

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    // Amount of ether for buying tokens * Number of tokens receive for 1 eth
    uint tokenAmount = msg.value * rate;
    // because UCT use only 9 decimal places we have to divide our rate
    tokenAmount = tokenAmount / (10**(18-9));
    token.transfer(msg.sender, tokenAmount);
  }

}
