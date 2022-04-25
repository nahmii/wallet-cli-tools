# Wallet CLI Tools

This repository contains some CLIs that are useful working with Ethereum wallets (EOAs).

## Node.js
The CLIs have been successfully tested with the Node.js 16 ("Gallium") LTS release.

## Build and install
The binaries are built and installed globally by 
```
npm install -g
```

## Execute

### generate-private-key
This executable generates and outputs to standard out randomly generated private key(s) and optionally the associated address:
```shell
$ generate-private-key
0x5e0720fe097196c75f592339eafc74b32f940137682147514abdd853dd1889bb
```

```shell
$ generate-private-key -a
0xba5ced1d6812dd190458c5b28cfc068d1b66e645277b2eaff1e7aafb879c4432 0xf1227571ba64c7783c05245de987a8455951216a
```

The full outline of the usage is as follows:
```shell
$ generate-private-key -h
generate-private-key [options]

Generate private key(s)

Options:
      --version  Show version number                                   [boolean]
  -c, --count    The number of private keys.               [number] [default: 1]
  -a, --address  Output address alongside the private key.             [boolean]
  -i, --index    Prefix each line with index, for use with larger values of
                 count.                                                [boolean]
  -h, --help     Show help                                             [boolean]
```

### private-key-to-keystore-file
With private key at hand it is sometimes useful to generate a keystore from it. The executable `private-key-to-keystore-file` is the tool to use for this purpose:
```shell
$ private-key-to-keystore-file 0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2 -p InToddWeTrust
{"version":3,"id":"514ac583-4eef-4c6d-a438-5191887bdf1d","address":"c247fea5d7db3121cd4e35952a27b695591c1ccd","crypto":{"ciphertext":"a71ce00461163d21a4abd41a439d2d3727e0fa5610d9a054f258a038f1478f02","cipherparams":{"iv":"a0a2449b9fa463619a77455d4b33c897"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"109a51f5f4dae997a33c9d371f906b2779b83d33967e14756a316f7a0c8f11e4","c":262144,"prf":"hmac-sha256"},"mac":"0f44f92736368f6d5c7c5341652803797655258c111dca1945ddd084c8f811a2"}}
```

Add option `-f` and a file output will be generated instead of output of keystore to standard out:
```shell
$ private-key-to-keystore-file 0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2 -p InToddWeTrust -F
Keystore output to 'keystore/UTC--2022-04-22T17-57-43.052Z--c247fea5d7db3121cd4e35952a27b695591c1ccd'
```

The usage is as follows:
```shell
$ private-key-to-keystore-file -h
private-key-to-keystore-file <private-key> [options]

Generate keystore file from private key and password

Positionals:
  private-key  The private key.                                         [string]

Options:
      --version                  Show version number                   [boolean]
  -h, --help                     Show help                             [boolean]
  -p, --password                 The password for encrypting the keystore.
                                                             [string] [required]
  -F, --file-output              Output to file. If not provided the keystore is
                                 sent to std out.               [default: false]
  -d, --output-directory         The directory for file output.
                                                  [string] [default: "keystore"]
  -f, --output-file              The directory for file output. If not provided
                                 the name will be generated according to a
                                 template of 'UTC--<timestamp>--<address>'.
                                                                        [string]
  -k, --key-derivation-function  The key derivation function.
                      [string] [choices: "pbkdf2", "scrypt"] [default: "pbkdf2"]
```

Finally, `private-key-to-keystore-file` may also be called in a piped mode to receive input e.g. from `generate-private-key`. This allows the generation of multiple keystore files from randomly generated private keys:
```shell
$ generate-private-key -c 3 | private-key-to-keystore-file -p InToddWeTrust -f
Keystore output to 'keystore/UTC--2022-04-22T18-03-19.381Z--d094ea92c10c210f08dc461b7a4acbf5b89ac1bc'
Keystore output to 'keystore/UTC--2022-04-22T18-03-19.382Z--bf7c246239170eedd2080372e6bf452e4298a886'
Keystore output to 'keystore/UTC--2022-04-22T18-03-19.383Z--d71cc773ea0e412689718b695af05ef42c665f66'
```