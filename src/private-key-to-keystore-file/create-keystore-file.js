#!/usr/bin/env node

'use strict';

const Wallet = require('ethereumjs-wallet').default;
const fs = require('fs/promises');
const path = require('path');

module.exports = async ({privateKey, password, outputPassword, fileOutput, outputDirectory, outputFile, keyDerivationFunction}) => {
  const key = Buffer.from(privateKey.replace(/^0x/, ''), 'hex');
  const wallet = Wallet.fromPrivateKey(key);

  const keystore = await wallet.toV3String(password, {kdf: keyDerivationFunction});

  if (fileOutput) {
    const filePath = path.join(outputDirectory, outputFile || wallet.getV3Filename());
    await fs.mkdir(outputDirectory, {recursive: true});
    await fs.writeFile(filePath, keystore);

    let line = `Keystore output to '${filePath}'`;

    if (outputPassword) {
      line += ` - Password: ${password}`;
    }

    console.log(line);
  } else {
    console.log(`Keystore: ${keystore}`);

    if (outputPassword) {
      console.log(`Password: ${password}`);
    }
  }
};
