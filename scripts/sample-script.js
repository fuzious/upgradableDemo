
const hre = require("hardhat");
const assert = require('assert');
const { ethers, upgrades } = require("hardhat");

// import { isTypedArray } from 'util/types';

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();
  console.log(owner,addr1,addr2)

  this.MyToken = await ethers.getContractFactory('MyToken');
  this.MyTokenV2 = await ethers.getContractFactory('MyTokenV2');
  this.MyTokenV3 = await ethers.getContractFactory('MyTokenV3');

  const myToken = await upgrades.deployProxy(this.MyToken);
  assert(await myToken.name() == 'MyToken');
  // console.log( await myToken.version())

  const myTokenV2 = await upgrades.upgradeProxy( myToken,this.MyTokenV2,);
  assert(await myToken.name() == 'MyToken');
  console.log( await myTokenV2.version())
  await myTokenV2.transfer(addr1.address,50);

  const myTokenV3 = await upgrades.upgradeProxy( myToken,this.MyTokenV3);
  console.log( await myTokenV3.version())
  console.log(await myTokenV3.balanceOf(addr1.address))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
