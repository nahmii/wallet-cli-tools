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
{"version":3,"id":"fd209e3e-a625-4756-9823-66c14f69314f","address":"c247fea5d7db3121cd4e35952a27b695591c1ccd","crypto":{"ciphertext":"2044653c2c2f9ba6e41f6c0001627951738180c0e8fb8a50fc55b24190390b24","cipherparams":{"iv":"494bbf50670aaf41e0b76bb124cae477"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"55b357e48382dc5ceec45dcbcae102cc6a628a65c5c98356b141c5fb15055b11","n":262144,"r":8,"p":1},"mac":"1e0cadc1436b092c6a33282e9b5e49984ce1f40460e90b2b34bdcc7d0234cd1b"}}
```

Add option `-f` and a file output will be generated instead of output of keystore to standard out:
```shell
$ private-key-to-keystore-file 0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2 -p InToddWeTrust -f
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
      --version      Show version number                               [boolean]
  -h, --help         Show help                                         [boolean]
  -p, --password     The password for encrypting the keystore.
                                                             [string] [required]
  -f, --file-output  The output file directory. If not provided the keystore is
                     sent to std out.                 [boolean] [default: false]
  -o, --output-dir   The directory for file output.
                                                  [string] [default: "keystore"]
```

Finally, `private-key-to-keystore-file` may also be called in a piped mode to receive input e.g. from `generate-private-key`. This allows the generation of multiple keystore files from randomly generated private keys:
```shell
$ generate-private-key -c 3 | private-key-to-keystore-file -p InToddWeTrust -f
Keystore output to 'keystore/UTC--2022-04-22T18-03-19.381Z--d094ea92c10c210f08dc461b7a4acbf5b89ac1bc'
Keystore output to 'keystore/UTC--2022-04-22T18-03-19.382Z--bf7c246239170eedd2080372e6bf452e4298a886'
Keystore output to 'keystore/UTC--2022-04-22T18-03-19.383Z--d71cc773ea0e412689718b695af05ef42c665f66'
```