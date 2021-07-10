const Token = artifacts.require("Token");
const UndercoverSwap = artifacts.require("UndercoverSwap");

module.exports = async function(deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed()

  await deployer.deploy(UndercoverSwap, token.address);
  const undercoverSwap = await UndercoverSwap.deployed()

  // Transfer all UCT tokens to UndercoverSwap address
  await token.transfer(undercoverSwap.address, '10000000000000')

};
