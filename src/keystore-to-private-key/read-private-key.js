'use strict';

const Wallet = require('ethereumjs-wallet').default;
const path = require('path');
const fs = require('fs/promises');

module.exports = async ({file, keystore, password}) => {
  if (file && !keystore) {
    const data = await fs.readFile(path.resolve(file), 'utf-8');
    keystore = JSON.parse(data);
  }
  const wallet = await Wallet.fromV3(keystore, password);
  return wallet.getPrivateKeyString();
};
