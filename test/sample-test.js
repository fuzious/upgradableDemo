const hre = require("hardhat");
const assert = require('assert');
const { ethers, upgrades } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");
// import { isTypedArray } from 'util/types';

beforeEach('get factories', async function(){

  this.MyToken = await ethers.getContractFactory('MyToken');
  this.MyTokenV2 = await ethers.getContractFactory('MyTokenV2');
  this.MyTokenV3 = await ethers.getContractFactory('MyTokenV3');
  [this.owner, this.addr1, this.addr2] = await ethers.getSigners();
})

it('deploying V1', async function () {
  this.myToken = await upgrades.deployProxy(this.MyToken, {kind: "uups"});
  this.myTokenAdress = this.myToken.address;
  assert(await this.myToken.name() == 'MyToken');
})  

it('upgrading to V2', async function () {
  this.myTokenV2 = await upgrades.upgradeProxy( this.myToken,this.MyTokenV2);
  assert(await this.myTokenV2.address == this.myTokenAdress);
  assert(await this.myTokenV2.version() == "v2")
})  

it('transferring some tokens', async function () {
  const tx = await this.myTokenV2.transfer(this.addr1.address,50);
  assert.ok(tx)
})  

it('upgrade to V3', async function () {
  this.myTokenV3 = await upgrades.upgradeProxy( this.myTokenV2,this.MyTokenV3);
  assert(await this.myTokenV3.address == this.myTokenAdress);
  assert(await this.myTokenV3.version() == "v3")
})