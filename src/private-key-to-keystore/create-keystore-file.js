'use strict';

const Wallet = require('ethereumjs-wallet').default;
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

module.exports = async ({
  privateKey,
  password,
  outputPassword,
  fileOutput,
  outputDirectory,
  outputFile,
  keyDerivationFunction
}) => {
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

    process.stdout.write(line + os.EOL);
  } else {
    process.stdout.write(`${keystore}` + os.EOL);

    if (outputPassword) {
      process.stdout.write(`password: ${password}` + os.EOL);
    }
  }
};
