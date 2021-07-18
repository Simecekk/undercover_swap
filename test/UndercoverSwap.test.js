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
    let result;

    before(async() => {
      // Purchase tokens before every test
      result = await undercoverSwap.buyTokens({
         from: accounts[0],
         value: web3.utils.toWei('1', 'ether')
       })
    })

    it('Allow users to buy UCT for fixed price', async() => {
      let investor = accounts[0];
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens('10'))

      let undercoverSwapBalanace = await token.balanceOf(undercoverSwap.address)
      assert.equal(undercoverSwapBalanace.toString(), tokens('9990'))
      let ethUndercoverSwatpBalance = await web3.eth.getBalance(undercoverSwap.address)
      assert.equal(ethUndercoverSwatpBalance.toString(), web3.utils.toWei('1', 'ether'))

      let event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount, tokens(10))
      assert.equal(event.rate, '10')
    })
  })

  describe('UndercoverSwap possibility to sell tokens', async() => {
    let result

    before(async() => {
      await token.approve(undercoverSwap.address, tokens('10'), {from: accounts[0]})
      result = await undercoverSwap.sellTokens(
        tokens('10'), {from: accounts[0]}
      )
    })

    it('Allows users to sell their tokens for eth', async() => {
      let seller = accounts[0];
      let sellerBalance = await token.balanceOf(seller)
      assert.equal(sellerBalance.toString(), tokens('0'))

      let undercoverSwapBalance = await web3.eth.getBalance(undercoverSwap.address)
      assert.equal(undercoverSwapBalance.toString(), web3.utils.toWei('0'))

      let uctUndercoverSwapBalance = await token.balanceOf(undercoverSwap.address)
      assert.equal(uctUndercoverSwapBalance.toString(), tokens('10000'))

      let event = result.logs[0].args
      assert.equal(event.account, accounts[0])
      assert.equal(event.token, token.address)
      assert.equal(event.amount, tokens(10))
      assert.equal(event.rate, '10')

      await undercoverSwap.sellTokens(
        tokens('100'),
         {from: accounts[0]}
       ).should.be.rejected;
    })
  })

})
