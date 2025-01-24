  import { getFullnodeUrl, MgoClient, MgoHTTPTransport } from '@mgonetwork/mango.js/client';
  import { DEFAULT_ED25519_DERIVATION_PATH, Ed25519Keypair } from '@mgonetwork/mango.js/keypairs/ed25519';
  import { Helper } from '../utils/helper.js';
  import { bcs, MIST_PER_MGO, TransactionBlock } from '@mgonetwork/mango.js';
  import { API } from './api.js';
  import { SIGNPACKAGE } from '../packages/sign-package.js';
  import { AMMPACKAGE } from '../packages/amm-package.js';
  import { COINS } from '../coin/coins.js';
  import { BEINGDEXPACKAGE } from '../packages/beingdex.js';
  import { accountList } from '../../accounts/accounts.js';
  import { proxyList } from '../../config/proxy_list.js';
  import { MANGOBRIDGEPACKAGE } from '../packages/mangobridge.js';
  import { BRIDGE } from '../chain/dest_chain.js';
  import { ethers } from 'ethers';
  import { ERC1967PROXY } from '../abi/erc1967_proxy.js';
  import { Config } from '../../config/config.js';
  import a10_0x1dace5 from '../utils/logger.js';
  import { ERC1967BSCPROXY } from '../abi/erc1967_proxy_bsc.js';
  export class CoreService extends API {
    constructor(_0x13f6d4) {
      let _0x54e136;
      const _0x2cc828 = Helper.determineType(_0x13f6d4);
      if (!_0x2cc828) {
        throw Error("Sorry this bot is now only support Seed Pharse, Please use Seed Pharse instead of Private Key");
      }
      if (Config.BRIDGERAWDATA.length == 0x0) {
        throw Error("Please Provide BRIDGERAWDATA on config.js");
      }
      if (Config.BRIDGERAWDATA.length != accountList.length) {
        throw Error("You have " + accountList.length + " Accounts, but provide " + Config.BRIDGERAWDATA.length + " BRIDGERAWDATA");
      }
      const _0x4dcdb6 = accountList.indexOf(_0x13f6d4);
      if (proxyList.length != accountList.length && proxyList.length != 0x0) {
        throw Error("You Have " + accountList.length + " Accounts But Provide " + proxyList.length + " Proxy");
      }
      _0x54e136 = proxyList[_0x4dcdb6];
      super(_0x54e136);
      this.acc = _0x13f6d4;
      this.client = new MgoClient({
        'transport': new MgoHTTPTransport({
          'url': getFullnodeUrl("testnet")
        })
      });
      this.ethProvider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com', 0xaa36a7);
      this.bscProvider = new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com", 0x61);
    }
    async ["getAccountInfo"]() {
      try {
        await Helper.delay(0x1f4, this.acc, "Getting Wallet Information...", this);
        this.wallet = Ed25519Keypair.deriveKeypair(this.acc, DEFAULT_ED25519_DERIVATION_PATH);
        this.evmWallet = ethers.Wallet.fromPhrase(this.acc, this.ethProvider);
        this.bscWallet = ethers.Wallet.fromPhrase(this.acc, this.bscProvider);
        this.evmAddress = this.evmWallet.address;
        this.address = this.wallet.getPublicKey().toMgoAddress();
        await Helper.delay(0x3e8, this.acc, "Successfully Get Account Information", this);
      } catch (_0xe0e127) {
        throw _0xe0e127;
      }
    }
    async ['connectMango']() {
      try {
        await Helper.delay(0x1f4, this.acc, "Connecting to mango DAPPS...", this);
        const _0x4282de = Math.floor(Date.now() / 0x3e8);
        const _0x453344 = {
          'address': this.address,
          'signTime': _0x4282de,
          'signType': "Login"
        };
        const _0x4c8bfb = JSON.stringify(_0x453344);
        const _0x1c3e5a = new TextEncoder().encode(_0x4c8bfb);
        const _0x2c3a18 = await this.wallet.signPersonalMessage(_0x1c3e5a);
        const _0x5ca5f5 = await this.fetch("https://task-api.testnet.mangonetwork.io/mgoUser/loginMgoUserPublic", "POST", {
          'signData': _0x2c3a18.signature,
          'address': this.address,
          'signTime': _0x4282de
        });
        if (_0x5ca5f5.data.code == 0x0) {
          this.token = _0x5ca5f5.data.data.token;
          await Helper.delay(0x1f4, this.acc, _0x5ca5f5.data.msg, this);
        } else {
          throw new Error(_0x5ca5f5.data.msg);
        }
      } catch (_0x5499ce) {
        throw _0x5499ce;
      }
    }
    async ["getMangoUser"](_0x58fd31 = false) {
      try {
        if (_0x58fd31) {
          await Helper.delay(0x1f4, this.acc, "Getting User Information..", this);
        }
        const _0x54dec0 = await this.fetch("https://task-api.testnet.mangonetwork.io/mgoUser/getMgoUser", 'GET', undefined, this.token);
        if (_0x54dec0.data.code == 0x0) {
          this.user = _0x54dec0.data.data;
          if (_0x58fd31) {
            await Helper.delay(0x1f4, this.acc, _0x54dec0.data.msg, this);
          }
        } else {
          throw new Error(_0x54dec0.data.msg);
        }
      } catch (_0x5911f8) {
        throw _0x5911f8;
      }
    }
    async ["getSwapTask"]() {
      try {
        await Helper.delay(0x7d0, this.acc, "Getting Swap Task Details..", this);
        const _0xf1f705 = await this.fetch('https://task-api.testnet.mangonetwork.io/base/taskDetail', "POST", {
          'taskId': 0x2,
          'type': 0x0
        }, this.token);
        if (_0xf1f705.data.code == 0x0) {
          this.swapTask = _0xf1f705.data.data;
          await Helper.delay(0x1f4, this.acc, _0xf1f705.data.msg, this);
        } else {
          throw new Error(_0xf1f705.data.msg);
        }
      } catch (_0x38d153) {
        throw _0x38d153;
      }
    }
    async ["getExchangeTask"]() {
      try {
        await Helper.delay(0x7d0, this.acc, "Getting BeingDex Task Details..", this);
        const _0x21305c = await this.fetch("https://task-api.testnet.mangonetwork.io/base/taskDetail", "POST", {
          'taskId': 0x5,
          'type': 0x0
        }, this.token);
        if (_0x21305c.data.code == 0x0) {
          this.exchangeTask = _0x21305c.data.data;
          await Helper.delay(0x1f4, this.acc, _0x21305c.data.msg, this);
        } else {
          throw new Error(_0x21305c.data.msg);
        }
      } catch (_0x5551cb) {
        throw _0x5551cb;
      }
    }
    async ["getDiscordTask"]() {
      try {
        await Helper.delay(0x7d0, this.acc, "Getting Discord Task Details..", this);
        const _0x1ab131 = await this.fetch('https://task-api.testnet.mangonetwork.io/base/taskDetail', 'POST', {
          'taskId': 0x3,
          'type': 0x0
        }, this.token);
        if (_0x1ab131.data.code == 0x0) {
          this.discordTask = _0x1ab131.data.data;
          await Helper.delay(0x1f4, this.acc, _0x1ab131.data.msg, this);
        } else {
          throw new Error(_0x1ab131.data.msg);
        }
      } catch (_0x32882e) {
        throw _0x32882e;
      }
    }
    async ["getBridgeTask"]() {
      try {
        await Helper.delay(0x7d0, this.acc, "Getting Mango Bridge Task Details..", this);
        const _0x35e9e6 = await this.fetch("https://task-api.testnet.mangonetwork.io/base/taskDetail", "POST", {
          'taskId': 0x4,
          'type': 0x0
        }, this.token);
        if (_0x35e9e6.data.code == 0x0) {
          this.bridgeTask = _0x35e9e6.data.data;
          await Helper.delay(0x1f4, this.acc, _0x35e9e6.data.msg, this);
        } else {
          throw new Error(_0x35e9e6.data.msg);
        }
      } catch (_0x45e233) {
        throw _0x45e233;
      }
    }
    async ["addStep"](_0x12bfc3, _0x470bef, _0x303bae = true) {
      try {
        if (_0x303bae) {
          await Helper.delay(0x7d0, this.acc, "Try Completing Step " + _0x470bef.label + "...", this);
        }
        await this.fetch("https://task-api.testnet.mangonetwork.io/base/addStep", 'POST', {
          'taskId': _0x12bfc3,
          'stepId': _0x470bef.sort
        }, this.token);
      } catch (_0x3d3b95) {
        throw _0x3d3b95;
      }
    }
    async ["getBalance"](_0x50ba86 = false) {
      try {
        if (_0x50ba86) {
          await Helper.delay(0x1f4, this.acc, "Getting Account Balance...", this);
        }
        this.balance = await this.client.getAllBalances({
          'owner': this.address
        });
        this.balance = this.balance.map(_0x100868 => {
          _0x100868.totalBalance = parseFloat((Number(_0x100868.totalBalance) / Number(MIST_PER_MGO)).toFixed(0x5));
          return _0x100868;
        });
        const _0xb5d5ca = ethers.formatEther(await this.ethProvider.getBalance(this.evmAddress));
        const _0x1b8320 = ethers.formatEther(await this.bscProvider.getBalance(this.evmAddress));
        this.evmBalance = [{
          'SYMBOL': 'ETH',
          'BALANCE': _0xb5d5ca
        }];
        this.bscBalance = [{
          'SYMBOL': "BNB",
          'BALANCE': _0x1b8320
        }];
        if (_0x50ba86) {
          await Helper.delay(0x3e8, this.acc, "Successfully Get Account Balance", this);
        }
      } catch (_0x265033) {
        throw _0x265033;
      }
    }
    async ["getFaucet"]() {
      try {
        await Helper.delay(0x3e8, this.acc, "Requesting MGO Faucet", this);
        const _0x487028 = await this.fetch("https://task-api.testnet.mangonetwork.io/base/getFaucet", "POST", {
          'chain': '0',
          'type': false
        }, this.token);
        if (_0x487028.status == 0xc8) {
          await Helper.delay(0x3e8, this.acc, _0x487028.data.msg, this);
          await this.getBalance();
        } else {
          throw _0x487028;
        }
        await this.addStep(0x1, {
          'label': "Connect to Mango test network and sign to receive Gas",
          'value': "Gas",
          'extend': "Download and use the Beingdex mobile app",
          'sort': 0x0
        }, false);
      } catch (_0x54d810) {
        if (_0x54d810.msg) {
          await Helper.delay(0xbb8, this.acc, _0x54d810.data.msg, this);
        } else {
          await Helper.delay(0xbb8, this.acc, _0x54d810.data.msg, this);
        }
      }
    }
    async ["checkIn"]() {
      try {
        await Helper.delay(0x3e8, this.acc, "Trying to Daily Sign In", this);
        const _0x4d1df8 = new TransactionBlock();
        _0x4d1df8.moveCall({
          'target': SIGNPACKAGE.ADDRESS + "::sign::sign_in",
          'arguments': [_0x4d1df8.object(SIGNPACKAGE.MODULE.SIGN.SIGNPOOL), _0x4d1df8.object(SIGNPACKAGE.MODULE.SIGN.CLOCK)]
        });
        await this.executeTx(_0x4d1df8);
        await Helper.delay(0x3e8, this.acc, "Successfully Daily Sign In", this);
      } catch (_0x3b1370) {
        await Helper.delay(0x3e8, this.acc, "Failed to Daily Sign In, Possible already Sign In", this);
      }
    }
    async ['swap'](_0x1a6f8b, _0x280aba) {
      try {
        const _0x1d797c = new TransactionBlock();
        let _0x920945 = await this.client.getCoins({
          'owner': this.address,
          'coinType': _0x1a6f8b.TYPE
        });
        if (_0x920945.data.length == 0x0) {
          while (_0x920945.data.length == 0x0) {
            _0x920945 = await this.client.getCoins({
              'owner': this.address,
              'coinType': _0x1a6f8b.TYPE
            });
            await this.getBalance();
            await Helper.delay(0x2710, this.acc, "Delaying for " + Helper.msToTime(0x2710) + " until swap balance update", this);
          }
        }
        if (_0x920945.data.length > 0x1) {
          await this.mergeCoin(_0x1a6f8b);
          _0x920945 = await this.client.getCoins({
            'owner': this.address,
            'coinType': _0x1a6f8b.TYPE
          });
        }
        let _0x583c1b = Number(0.1) * Number(MIST_PER_MGO);
        let _0x5b045a;
        if (_0x1a6f8b == COINS.MGO) {
          _0x5b045a = _0x1d797c.splitCoins(_0x1d797c.gas, [_0x1d797c.pure(_0x583c1b)]);
        } else {
          _0x583c1b = Number(_0x920945.data[0x0].balance);
          _0x5b045a = _0x1d797c.splitCoins(_0x1d797c.object(_0x920945.data[0x0].coinObjectId), [_0x1d797c.pure(_0x583c1b)]);
        }
        await Helper.delay(0x3e8, this.acc, "Try to Swapping " + (_0x1a6f8b == COINS.MGO ? parseFloat((Number(_0x583c1b) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) : parseFloat((Number(_0x920945.data[0x0].balance) / Number(MIST_PER_MGO)).toString()).toFixed(0x5)) + " " + _0x1a6f8b.SYMBOL + " to ? " + _0x280aba.SYMBOL, this);
        const _0xe6fc62 = [_0x1a6f8b, _0x280aba].find(_0x50d6e0 => _0x50d6e0 == COINS.MGO);
        const _0x24c628 = _0x1a6f8b == COINS.MGO || !_0xe6fc62 && _0x1a6f8b == COINS.USDT ? [_0x1a6f8b.TYPE, _0x280aba.TYPE] : [_0x1a6f8b.TYPE, _0x280aba.TYPE].reverse();
        const _0x4f7a95 = await this.getPool(_0x24c628);
        let _0x26f505 = await this.swapCalculate(_0x24c628, _0x4f7a95, !!(_0x1a6f8b == COINS.MGO || !_0xe6fc62 && _0x1a6f8b == COINS.USDT), _0x583c1b);
        _0x26f505 = Math.floor(_0x26f505 - _0x26f505 * 0xa / 0x64);
        await Helper.delay(0x3e8, this.acc, "Try to Swapping " + parseFloat((Number(_0x583c1b) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x1a6f8b.SYMBOL + " to " + parseFloat((Number(_0x26f505) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x280aba.SYMBOL, this);
        _0x1d797c.moveCall({
          'target': AMMPACKAGE.ADDRESS + '::amm_script::' + (_0x1a6f8b == COINS.MGO || !_0xe6fc62 && _0x1a6f8b == COINS.USDT ? "swap_exact_coinA_for_coinB" : "swap_exact_coinB_for_coinA"),
          'typeArguments': _0x24c628,
          'arguments': [_0x1d797c.object(_0x4f7a95), _0x1d797c.object(AMMPACKAGE.MODULE.AMMCONFIG.GLOBALPAUSESTATUSID), _0x5b045a, _0x1d797c.pure(_0x583c1b), _0x1d797c.pure(_0x26f505)]
        });
        await this.executeTx(_0x1d797c);
        await Helper.delay(0x3e8, this.acc, "Successfully Swapping " + parseFloat((Number(_0x583c1b) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x1a6f8b.SYMBOL + " to " + parseFloat((Number(_0x26f505) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x280aba.SYMBOL, this);
      } catch (_0x5bf00d) {
        throw _0x5bf00d;
      }
    }
    async ['exchange'](_0x56f385, _0x528504) {
      try {
        await Helper.delay(0x3e8, this.acc, "Exchanging " + _0x56f385.SYMBOL + " to " + _0x528504.SYMBOL, this);
        const _0x490355 = _0x56f385 == COINS.USDT ? [_0x56f385.TYPE, _0x528504.TYPE].reverse() : [_0x56f385.TYPE, _0x528504.TYPE];
        const _0x93bc40 = new TransactionBlock();
        let _0x54b835 = await this.client.getCoins({
          'owner': this.address,
          'coinType': _0x56f385.TYPE
        });
        if (_0x54b835.data.length == 0x0) {
          while (_0x54b835.data.length == 0x0) {
            _0x54b835 = await this.client.getCoins({
              'owner': this.address,
              'coinType': _0x56f385.TYPE
            });
            console.log(_0x54b835.data.length);
            await this.claimDealPool(BEINGDEXPACKAGE.MODULE.CLOB.AIUSDTPOOL, _0x490355);
            await this.getBalance();
            await Helper.delay(0x1388, this.acc, "Delaying for " + Helper.msToTime(0x1388) + " until Exchange balance update", this);
          }
        }
        if (_0x54b835.data.length > 0x1) {
          await this.mergeCoin(_0x56f385);
          _0x54b835 = await this.client.getCoins({
            'owner': this.address,
            'coinType': _0x56f385.TYPE
          });
        }
        const _0x2f2252 = Number(_0x54b835.data[0x0].balance);
        _0x93bc40.moveCall({
          'target': BEINGDEXPACKAGE.ADDRESS + "::clob::" + (_0x56f385 == COINS.USDT ? 'buy' : "sell"),
          'typeArguments': _0x490355,
          'arguments': _0x56f385 == COINS.USDT ? [_0x93bc40.object(BEINGDEXPACKAGE.MODULE.CLOB.AIUSDTPOOL), _0x93bc40.pure("9223372036854775808"), _0x93bc40.pure(_0x2f2252), _0x93bc40.pure(true), _0x93bc40.object(_0x54b835.data[0x0].coinObjectId)] : [_0x93bc40.object(BEINGDEXPACKAGE.MODULE.CLOB.AIUSDTPOOL), _0x93bc40.pure("9223372036854775808"), _0x93bc40.pure(_0x2f2252), _0x93bc40.pure(false), _0x93bc40.object(_0x54b835.data[0x0].coinObjectId)]
        });
        await this.executeTx(_0x93bc40);
        await Helper.delay(0x3e8, this.acc, "Successfully Exchanging " + parseFloat((Number(_0x2f2252) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x56f385.SYMBOL + " to " + _0x528504.SYMBOL, this);
      } catch (_0x2cd30a) {
        throw _0x2cd30a;
      }
    }
    async ["mergeCoin"](_0xda350c) {
      try {
        const _0x14ac22 = await this.client.getCoins({
          'owner': this.address,
          'coinType': _0xda350c.TYPE
        });
        if (_0xda350c == COINS.MGO && _0x14ac22.data.length < 0x3) {
          return;
        }
        if (_0x14ac22.data.length < 0x2) {
          return;
        }
        const _0xa298b6 = new TransactionBlock();
        let _0x18839d;
        let _0x2a44ca;
        if (_0xda350c == COINS.MGO) {
          _0x18839d = _0x14ac22.data[0x1].coinObjectId;
          _0x2a44ca = _0x14ac22.data.slice(0x2).map(_0x54c1ab => _0x54c1ab.coinObjectId);
        } else {
          _0x18839d = _0x14ac22.data[0x0].coinObjectId;
          _0x2a44ca = _0x14ac22.data.slice(0x1).map(_0x3dc652 => _0x3dc652.coinObjectId);
        }
        await Helper.delay(0x3e8, this.acc, "Merging " + _0xda350c.SYMBOL, this);
        await _0xa298b6.mergeCoins(_0xa298b6.object(_0x18839d), _0x2a44ca.map(_0x581e2c => _0xa298b6.object(_0x581e2c)));
        await this.executeTx(_0xa298b6);
        await this.getBalance();
      } catch (_0x270bb7) {
        throw _0x270bb7;
      }
    }
    async ["bridge"](_0x4a2f6a) {
      try {
        if (_0x4a2f6a == BRIDGE.MANGOBSC || _0x4a2f6a == BRIDGE.MANGOETH) {
          const _0x4b16a6 = new TransactionBlock();
          let _0x3d4538 = await this.client.getCoins({
            'owner': this.address,
            'coinType': COINS.USDT.TYPE
          });
          if (_0x3d4538.data.length == 0x0) {
            while (coinToSwap.data.length == 0x0) {
              _0x3d4538 = await this.client.getCoins({
                'owner': this.address,
                'coinType': COINS.USDT.TYPE
              });
              await this.getBalance();
              await Helper.delay(0x2710, this.acc, "Delaying for " + Helper.msToTime(0x2710) + " until swap balance update", this);
            }
          }
          if (_0x3d4538.data.length > 0x1) {
            await this.mergeCoin(COINS.USDT);
            _0x3d4538 = await this.client.getCoins({
              'owner': this.address,
              'coinType': COINS.USDT.TYPE
            });
          }
          let _0x58f9f1 = Number(0.001) * Number(MIST_PER_MGO);
          const _0x17939b = _0x4b16a6.splitCoins(_0x4b16a6.object(_0x3d4538.data[0x0].coinObjectId), [_0x4b16a6.pure(_0x58f9f1)]);
          await Helper.delay(0x3e8, this.acc, "Try to Bridge " + parseFloat((Number(_0x58f9f1) / Number(MIST_PER_MGO)).toString()).toFixed(0x5) + " " + COINS.USDT.SYMBOL + " to " + _0x4a2f6a + " ", this);
          _0x4b16a6.moveCall({
            'target': MANGOBRIDGEPACKAGE.ADDRESS + "::bridge::bridge_token",
            'typeArguments': [COINS.USDT.TYPE],
            'arguments': [_0x4b16a6.object(MANGOBRIDGEPACKAGE.MODULE.BRIDGE.BRIDGEXECUTOR), _0x17939b, _0x4b16a6.pure(this.evmAddress), _0x4b16a6.pure(_0x4a2f6a), _0x4b16a6.object(MANGOBRIDGEPACKAGE.MODULE.BRIDGE.CLOCK)]
          });
          await this.executeTx(_0x4b16a6);
          await Helper.delay(0x3e8, this.acc, "Successfully Bridge USDT Token From Mango Network to " + _0x4a2f6a, this);
        } else {
          await Helper.delay(0x3e8, this.acc, "Try to Bridge Token From " + (_0x4a2f6a == BRIDGE.ETHMANGO ? "ETH Sepolia" : "BNB Testnet") + " to Mango Network ", this);
          if (_0x4a2f6a == BRIDGE.ETHMANGO) {
            const _0x2e88d4 = this.evmBalance.find(_0x134351 => _0x134351.SYMBOL == "ETH");
            if (_0x2e88d4 == 0x0) {
              await Helper.delay(0xbb8, this.acc, "Not Enought ETH Sepolia Balance, Skipping", this);
              return;
            }
          } else {
            const _0x4fc5e8 = this.evmBalance.find(_0x5e1108 => _0x5e1108.SYMBOL == "BNB");
            if (_0x4fc5e8 == 0x0) {
              await Helper.delay(0xbb8, this.acc, "Not Enought BNB Testnet Balance, Skipping", this);
              return;
            }
          }
          const _0x4863fd = accountList.indexOf(this.acc);
          const _0xa48a11 = Config.BRIDGERAWDATA[_0x4863fd];
          const _0x2266cd = {
            'to': _0x4a2f6a == BRIDGE.ETHMANGO ? ERC1967PROXY.CA : ERC1967BSCPROXY.CA,
            'from': this.evmAddress,
            'data': _0xa48a11,
            'value': ethers.parseEther("0.00001")
          };
          await this.executeEvmTx(_0x2266cd, _0x4a2f6a);
          await Helper.delay(0x3e8, this.acc, "Successfully Bridge Token From " + (_0x4a2f6a == BRIDGE.ETHMANGO ? "ETH Sepolia" : "BNB Testnet") + " to Mango Network ", this);
        }
      } catch (_0x350997) {
        throw _0x350997;
      }
    }
    async ["swapCalculate"](_0xb6a46a, _0x19a14c, _0x29742f, _0x4026d9) {
      const _0x4355a6 = new TransactionBlock();
      _0x4355a6.moveCall({
        'target': AMMPACKAGE.ADDRESS + '::amm_router::compute_out',
        'typeArguments': _0xb6a46a,
        'arguments': [_0x4355a6.object(_0x19a14c), _0x4355a6.pure(_0x4026d9), _0x4355a6.pure(_0x29742f)]
      });
      const _0xa5d86a = await this.readTx(_0x4355a6);
      return bcs.de(_0xa5d86a.results[0x0].returnValues[0x0][0x1], Uint8Array.from(_0xa5d86a.results[0x0].returnValues[0x0][0x0]));
    }
    async ["getAndClaimDealPool"](_0x32d0b3, _0x4fc353) {
      const _0x3a5983 = new TransactionBlock();
      _0x3a5983.moveCall({
        'target': BEINGDEXPACKAGE.ADDRESS + "::clob::check_deal_pool_balance",
        'typeArguments': _0x4fc353,
        'arguments': [_0x3a5983.object(_0x32d0b3), _0x3a5983.pure(this.address)]
      });
      const _0x29aa97 = await this.readTx(_0x3a5983);
      const _0x341046 = _0x29aa97.events[0x0].parsedJson;
      if (_0x341046.token0_balance != 0x0) {
        await this.claimDealPool(_0x32d0b3, _0x4fc353);
      }
    }
    async ["claimDealPool"](_0x12d3aa, _0x573dbc) {
      await Helper.delay(0x3e8, this.acc, "Check and Claiming Being Dex Pool Balance ...", this);
      const _0x4e8db6 = new TransactionBlock();
      _0x4e8db6.moveCall({
        'target': BEINGDEXPACKAGE.ADDRESS + "::clob::claim_deal_pool_balance",
        'typeArguments': _0x573dbc,
        'arguments': [_0x4e8db6.object(_0x12d3aa)]
      });
      await this.executeTx(_0x4e8db6);
      await Helper.delay(0x3e8, this.acc, "Being Dex Pool Balance Extracted Tx ...", this);
    }
    async ["getPool"](_0x503222) {
      const _0x1d7b35 = new TransactionBlock();
      _0x1d7b35.moveCall({
        'target': AMMPACKAGE.ADDRESS + "::amm_swap::get_pool_id",
        'typeArguments': _0x503222,
        'arguments': [_0x1d7b35.object(AMMPACKAGE.MODULE.AMMSWAP.AMMFACTORY)]
      });
      const _0x1f216e = await this.readTx(_0x1d7b35);
      return bcs.de(_0x1f216e.results[0x0].returnValues[0x0][0x1], Uint8Array.from(_0x1f216e.results[0x0].returnValues[0x0][0x0]));
    }
    async ['executeTx'](_0x51c4bc) {
      try {
        await Helper.delay(0x3e8, this.acc, "Executing Tx ...", this);
        const _0x4fa48a = await this.client.signAndExecuteTransactionBlock({
          'signer': this.wallet,
          'transactionBlock': _0x51c4bc
        });
        await Helper.delay(0xbb8, this.acc, "Tx Executed : " + ('https://mgoscan.com/txblock/' + _0x4fa48a.digest), this);
        await this.getBalance();
        return _0x4fa48a;
      } catch (_0x42d5e8) {
        throw _0x42d5e8;
      }
    }
    async ["readTx"](_0x476183) {
      try {
        const _0x2bc7a6 = await this.client.devInspectTransactionBlock({
          'sender': this.address,
          'transactionBlock': _0x476183
        });
        return _0x2bc7a6;
      } catch (_0x2adc45) {
        throw _0x2adc45;
      }
    }
    async ['executeEvmTx'](_0x11a6ce, _0x13b783) {
      try {
        a10_0x1dace5.info("TX DATA " + JSON.stringify(Helper.serializeBigInt(_0x11a6ce)));
        await Helper.delay(0x1f4, this.acc, "Executing TX...", this);
        const _0x465f24 = _0x13b783 == BRIDGE.ETHMANGO ? await this.evmWallet.sendTransaction(_0x11a6ce) : await this.bscWallet.sendTransaction(_0x11a6ce);
        await Helper.delay(0x1f4, this.acc, "Tx Executed Waiting For Block Confirmation...", this);
        const _0x57cc24 = await _0x465f24.wait();
        a10_0x1dace5.info("Tx Confirmed and Finalizing: " + JSON.stringify(_0x57cc24));
        await Helper.delay(0x1388, this.acc, "Tx Executed and Confirmed \n" + (_0x13b783 == BRIDGE.ETHMANGO ? 'https://sepolia.etherscan.io' : "https://testnet.bscscan.com") + "/tx/" + _0x57cc24.hash, this);
        await this.getBalance();
      } catch (_0x1ee708) {
        if (_0x1ee708.message.includes("504")) {
          await Helper.delay(0x1388, this.acc, _0x1ee708.message, this);
        } else {
          throw _0x1ee708;
        }
      }
    }
  }