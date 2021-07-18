pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";

contract UndercoverSwap {
  string public name = "UndercoverSwap Instant Exchange";
  Token public token;
  uint public rate = 10;

  event TokenPurchased(
    address account,
    address token,
    uint amount,
    uint rate
  );

  event TokenSold(
      address account,
      address token,
      uint amount,
      uint rate
    );

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    // Amount of ether for buying tokens * Number of tokens receive for 1 eth
    uint tokenAmount = msg.value * rate;
    // because UCT use only 9 decimal places we have to divide our rate
    tokenAmount = tokenAmount / (10**(18-9));

    require(token.balanceOf(address(this)) >= tokenAmount);

    token.transfer(msg.sender, tokenAmount);
    // Emit on event
    emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public {
    require(token.balanceOf(msg.sender) >= _amount);

    uint ethAmount = _amount / rate;
    ethAmount = ethAmount * (10**(18-9));

    require(address(this).balance >= ethAmount);

    token.transferFrom(msg.sender, address(this), _amount);
    msg.sender.transfer(ethAmount);

    emit TokenSold(msg.sender, address(token), _amount, rate);
  }
}
