const Token = artifacts.require("Token");
const UndercoverSwap = artifacts.require("UndercoverSwap");

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return n * 1000000000
}

contract('UndercoverSwap', (accounts) => {
  let token, undercoverSwap

  before(async() => {
    token = await Token.new()
    undercoverSwap = await UndercoverSwap.new(token.address)
    await token.transfer(undercoverSwap.address, tokens('10000'))
  })

  describe('Token deployment', async() => {
    it('contract has a name', async() => {
      const name = await token.name()
      assert.equal(name, 'Undercover Token')
    })
  })

  describe('UndercoverSwap deployment', async() => {
    it('contract has a name', async() => {
      const name = await undercoverSwap.name()
      assert.equal(name, 'UndercoverSwap Instant Exchange')
    })

    it('contract has tokens', async() => {
      let balance = await token.balanceOf(undercoverSwap.address)
      assert.equal(balance.toString(), tokens('10000'))
    })

  })

  describe('UndercoverSwap possibility to buy tokens', async() => {
    it('Allow users to buy UCT for fixed price', async() => {
      await undercoverSwap.buyTokens(
        {from: accounts[0], value: web3.utils.toWei('1', 'ether')}
      )
      let balance = await token.balanceOf(accounts[0])
      assert.equal(balance.toString(), tokens('10'))
    })
  })

})
