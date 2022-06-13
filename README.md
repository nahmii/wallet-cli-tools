# Wallet CLI Tools

This repository contains some CLIs that are useful working with Ethereum wallets (EOAs).

## Node.js
The CLIs have been successfully tested with the Node.js 16 ("Gallium") LTS release.

## Build and install
The binaries are built and installed globally by 
```
npm install -g
```

## Executables

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
generate-private-key

Generate private key(s)

Options:
      --version  Show version number                                   [boolean]
  -c, --count    Number of private keys                    [number] [default: 1]
  -a, --address  Output address alongside the private key              [boolean]
  -i, --index    Prefix each line with index, for use with larger values of
                 count                                                 [boolean]
  -h, --help     Show help                                             [boolean]
```

### private-key-to-keystore

With private key at hand it is sometimes useful to generate a keystore from it. The executable `private-key-to-keystore` is the tool to use for this purpose:
```shell
$ private-key-to-keystore -p my-password 0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2
{"version":3,"id":"2d7a200e-7224-4b0a-bfc8-ed65c602f39e","address":"c247fea5d7db3121cd4e35952a27b695591c1ccd","crypto":{"ciphertext":"a9d7939c6c353861ff2a26dfe8ee1300e06136d000ed180e43d015716b0411df","cipherparams":{"iv":"929ef885f296616bc91e5eca4d3ded3c"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"d39e83337a03d71d09b1db24043d59eebafc8fce3d7bd8f46357a8a356d94fca","c":262144,"prf":"hmac-sha256"},"mac":"552bbeb8a226a7f419f42e53293591fcd09470cb1a760426ba8b1848076fe749"}}
```

Add option `-F` and a file output will be generated instead of output of keystore to standard out:
```shell
$ private-key-to-keystore -p my-password -F 0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2
Keystore output to 'keystore/UTC--2022-06-14T07-46-37.480Z--c247fea5d7db3121cd4e35952a27b695591c1ccd'
```

The usage is as follows:
```shell
$ private-key-to-keystore -h
private-key-to-keystore <private-key>

Generate keystore file from private key and password

Positionals:
  private-key  Private key                                              [string]

Options:
      --version                  Show version number                   [boolean]
  -h, --help                     Show help                             [boolean]
  -p, --password                 Password for encrypting the keystore   [string]
  -P, --password-generator       Password generator executable or text file with
                                 one password per line                  [string]
  -F, --file-output              Output to file if true, else output to std out
                                                      [boolean] [default: false]
  -d, --output-directory         Directory for file output
                                                  [string] [default: "keystore"]
  -f, --output-file              Directory for file output. If not provided the
                                 name will be generated according to a template
                                 of 'UTC--<timestamp>--<address>'       [string]
  -k, --key-derivation-function  Key derivation function
                      [string] [choices: "pbkdf2", "scrypt"] [default: "pbkdf2"]
```

#### Piped mode
`private-key-to-keystore` may also be called in a piped mode to receive input e.g. from `generate-private-key`. This allows the generation of multiple keystore files from randomly generated private keys:
```shell
$ generate-private-key -c 3 | private-key-to-keystore -F -p my-password
Keystore output to 'keystore/UTC--2022-06-14T07-48-32.588Z--b932d489954d42a077ef6e370d59f5f79a8d5b39'
Keystore output to 'keystore/UTC--2022-06-14T07-48-32.814Z--8c22274a3a012e5f3724cf69267973f1388c143d'
Keystore output to 'keystore/UTC--2022-06-14T07-48-32.814Z--41636dea774c8a05e1eaf8375de4fdf3bc22d273'
```

The command line above creates multiple keystore files with the same password for each file. In most cases, however, it is fair to assume that a separate password should be used for each keystore file.

`private-key-to-keystore` supports the provision of an executable to generate password, one for each keystore. One example of a password generator is [password-generator](https://www.npmjs.com/package/password-generator). With this executable installed the command line above may be modified to generate one password on the fly for each keystore.

```shell
$ generate-private-key -c 3 | private-key-to-keystore -F -P "password-generator -c"
Keystore output to 'keystore/UTC--2022-06-14T07-49-10.225Z--4544a8c5e8e3818567d1c40dbbafc918197a2857' - Password: pHxNyANsws
Keystore output to 'keystore/UTC--2022-06-14T07-49-10.450Z--79ce05cb48e60aeef476190df10f6926378cfc49' - Password: N5tvpuYFIS
Keystore output to 'keystore/UTC--2022-06-14T07-49-10.337Z--6c694cc85872996a8c632abda3ab5a6a7635b9c9' - Password: YfDrr2vOr1
```

As an alternative to executable password generator a text file may be used. If more passwords are needed than are contained in the provided text file the logics cycle through the password file as many times as required. The sample password file contains two passwords only.

```shell
$ generate-private-key -c 3 | private-key-to-keystore -F -P src/private-key-to-keystore/passwords/sample.txt
Keystore output to 'keystore/UTC--2022-06-14T07-49-35.642Z--e877cc3a2f93300cd8e6c11d2f51d8ebd210ce16' - Password: pw2
Keystore output to 'keystore/UTC--2022-06-14T07-49-35.642Z--e6bd5221d8d6771465ba7e38f37bb9cba0bddd42' - Password: pw1
Keystore output to 'keystore/UTC--2022-06-14T07-49-35.642Z--31a3058d50259ae9a096d66c6737671d610921ee' - Password: pw1
```

### keystore-to-private-key

This executable acts in the opposite direction of `private-key-to-keystore`. With a keystore file or serialized keystore string available as well as the corresponding password it allows you to extract the private key. The executable `keystore-to-private-key` lets to operate as follows:
```shell
 $ keystore-to-private-key -p my-password '{"version":3,"id":"de45b927-5868-4970-abed-545baa11084a","address":"c247fea5d7db3121cd4e35952a27b695591c1ccd","crypto":{"ciphertext":"3eeb950cd72a7f00014f9133c2ac10e0b592d13e23a90feac4b34930583c0a23","cipherparams":{"iv":"9458157ea26a1e283dcd7c7430b127da"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"58c4863aeb152976d100ba2a0c36df77e8accac576018a96e488349562449b55","c":262144,"prf":"hmac-sha256"},"mac":"70e66486c3ff9eaf0ac31ad6a8101be650fe2a176ae346fb6abcc6499305fdf7"}}'
0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2
```

Note that in the above command line the keystore string is wrapped single quotes to avoid the shell from removing the JSON double quotes. Alternatively you may escape the JSON double quotes in the following manner:
```shell
$ keystore-to-private-key -p my-password "{\"version\":3,\"id\":\"de45b927-5868-4970-abed-545baa11084a\",\"address\":\"c247fea5d7db3121cd4e35952a27b695591c1ccd\",\"crypto\":{\"ciphertext\":\"3eeb950cd72a7f00014f9133c2ac10e0b592d13e23a90feac4b34930583c0a23\",\"cipherparams\":{\"iv\":\"9458157ea26a1e283dcd7c7430b127da\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"pbkdf2\",\"kdfparams\":{\"dklen\":32,\"salt\":\"58c4863aeb152976d100ba2a0c36df77e8accac576018a96e488349562449b55\",\"c\":262144,\"prf\":\"hmac-sha256\"},\"mac\":\"70e66486c3ff9eaf0ac31ad6a8101be650fe2a176ae346fb6abcc6499305fdf7\"}}"
0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2
```

If on the other hand your keystore resides in a file you should specify its location
```shell
$ keystore-to-private-key -p my-password -f keystore/UTC--2022-06-14T07-55-27.184Z--c247fea5d7db3121cd4e35952a27b695591c1ccd
0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2
```

The full usage goes like this:
```shell
$ keystore-to-private-key -h
keystore-to-private-key [keystore]

Retrieve private key from keystore file and password

Positionals:
  keystore  Serialized keystore                                         [string]

Options:
      --version   Show version number                                  [boolean]
  -h, --help      Show help                                            [boolean]
  -f, --file      Keystore file                                         [string]
  -p, --password  Password for encrypting the keystore       [string] [required]
```

#### Piped mode

As with its directional counterpart `keystore-to-private-key` may be called as part of piped command line.
```shell
$ echo '{"version":3,"id":"de45b927-5868-4970-abed-545baa11084a","address":"c247fea5d7db3121cd4e35952a27b695591c1ccd","crypto":{"ciphertext":"3eeb950cd72a7f00014f9133c2ac10e0b592d13e23a90feac4b34930583c0a23","cipherparams":{"iv":"9458157ea26a1e283dcd7c7430b127da"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"58c4863aeb152976d100ba2a0c36df77e8accac576018a96e488349562449b55","c":262144,"prf":"hmac-sha256"},"mac":"70e66486c3ff9eaf0ac31ad6a8101be650fe2a176ae346fb6abcc6499305fdf7"}}' | keystore-to-private-key -p my-password
0x1d565082dac27cc7a6cdb3edea39133823cb007f0610c14a430b2e4ebd278cc2
```

Again please note the wrapping of the serialized JSON in single quotes.

Ultimately `keystore-to-private-key` could, primarily for testing purposes be chained with the other two executables to the a complete flow of private key generation, transformation to keystore and finally back to private key.

```shell
$ generate-private-key | private-key-to-keystore -p my-password | keystore-to-private-key -p my-password
0x0cd7b571730dd8096e8978b4937023f52cdfaf9c1a273ba7ba0f04375d03b3f6
```