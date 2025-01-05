import { getFullnodeUrl, MgoClient, MgoHTTPTransport } from '@mgonetwork/mango.js/client';
import { Ed25519Keypair } from '@mgonetwork/mango.js/keypairs/ed25519';
import { Helper } from '../utils/helper.js';
import { bcs, decodeMgoPrivateKey, MIST_PER_MGO, TransactionBlock } from '@mgonetwork/mango.js';
import { API } from './api.js';
import { SIGNPACKAGE } from '../packages/sign-package.js';
import { AMMPACKAGE } from '../packages/amm-package.js';
import { COINS } from '../coin/coins.js';
import { BEINGDEXPACKAGE } from '../packages/beingdex.js';
import { accountList } from '../../accounts/accounts.js';
import { proxyList } from '../../config/proxy_list.js';
import { MANGOBRIDGEPACKAGE } from '../packages/mangobridge.js';
import { BRIDGE } from '../chain/dest_chain.js';
export class CoreService extends API {
  constructor(_0x33e38f) {
    let _0x59bbd0;
    const _0x4c0529 = accountList.indexOf(_0x33e38f);
    if (proxyList.length != accountList.length && proxyList.length != 0x0) {
      throw Error("You Have " + accountList.length + " Accounts But Provide " + proxyList.length);
    }
    _0x59bbd0 = proxyList[_0x4c0529];
    super(_0x59bbd0);
    this.acc = _0x33e38f;
    this.explorer = "https://mgoscan.com";
    this.client = new MgoClient({
      'transport': new MgoHTTPTransport({
        'url': getFullnodeUrl("testnet")
      })
    });
  }
  async ["getAccountInfo"]() {
    try {
      await Helper.delay(0x1f4, this.acc, "Getting Wallet Information...", this);
      const _0x1aaf00 = decodeMgoPrivateKey(this.acc);
      this.wallet = Ed25519Keypair.fromSecretKey(_0x1aaf00.secretKey);
      this.address = this.wallet.getPublicKey().toMgoAddress();
      await Helper.delay(0x3e8, this.acc, "Successfully Get Account Information", this);
    } catch (_0x53449c) {
      throw _0x53449c;
    }
  }
  async ["connectMango"]() {
    try {
      await Helper.delay(0x1f4, this.acc, "Connecting to mango DAPPS...", this);
      const _0x38f1c2 = Math.floor(Date.now() / 0x3e8);
      const _0x2765e1 = {
        'address': this.address,
        'signTime': _0x38f1c2,
        'signType': "Login"
      };
      const _0x5c2b35 = JSON.stringify(_0x2765e1);
      const _0xe90341 = new TextEncoder().encode(_0x5c2b35);
      const _0x36d5cb = await this.wallet.signPersonalMessage(_0xe90341);
      const _0x33641a = await this.fetch("https://task-api.testnet.mangonetwork.io/mgoUser/loginMgoUserPublic", "POST", {
        'signData': _0x36d5cb.signature,
        'address': this.address,
        'signTime': _0x38f1c2
      });
      if (_0x33641a.data.code == 0x0) {
        this.token = _0x33641a.data.data.token;
        await Helper.delay(0x1f4, this.acc, _0x33641a.data.msg, this);
      } else {
        throw new Error(_0x33641a.data.msg);
      }
    } catch (_0x3141ca) {
      throw _0x3141ca;
    }
  }
  async ["getMangoUser"](_0x1c963e = false) {
    try {
      if (_0x1c963e) {
        await Helper.delay(0x1f4, this.acc, "Getting User Information..", this);
      }
      const _0x2c0e4b = await this.fetch("https://task-api.testnet.mangonetwork.io/mgoUser/getMgoUser", "GET", undefined, this.token);
      if (_0x2c0e4b.data.code == 0x0) {
        this.user = _0x2c0e4b.data.data;
        if (_0x1c963e) {
          await Helper.delay(0x1f4, this.acc, _0x2c0e4b.data.msg, this);
        }
      } else {
        throw new Error(_0x2c0e4b.data.msg);
      }
    } catch (_0x5f47c1) {
      throw _0x5f47c1;
    }
  }
  async ["getSwapTask"]() {
    try {
      await Helper.delay(0x7d0, this.acc, "Getting Swap Task Details..", this);
      const _0x43d9aa = await this.fetch("https://task-api.testnet.mangonetwork.io/base/taskDetail", 'POST', {
        'taskId': 0x2,
        'type': 0x0
      }, this.token);
      if (_0x43d9aa.data.code == 0x0) {
        this.swapTask = _0x43d9aa.data.data;
        await Helper.delay(0x1f4, this.acc, _0x43d9aa.data.msg, this);
      } else {
        throw new Error(_0x43d9aa.data.msg);
      }
    } catch (_0x1ec373) {
      throw _0x1ec373;
    }
  }
  async ["getExchangeTask"]() {
    try {
      await Helper.delay(0x7d0, this.acc, "Getting BeingDex Task Details..", this);
      const _0x497962 = await this.fetch('https://task-api.testnet.mangonetwork.io/base/taskDetail', 'POST', {
        'taskId': 0x5,
        'type': 0x0
      }, this.token);
      if (_0x497962.data.code == 0x0) {
        this.exchangeTask = _0x497962.data.data;
        await Helper.delay(0x1f4, this.acc, _0x497962.data.msg, this);
      } else {
        throw new Error(_0x497962.data.msg);
      }
    } catch (_0x17c3e2) {
      throw _0x17c3e2;
    }
  }
  async ["getDiscordTask"]() {
    try {
      await Helper.delay(0x7d0, this.acc, "Getting Discord Task Details..", this);
      const _0x3ceb75 = await this.fetch('https://task-api.testnet.mangonetwork.io/base/taskDetail', "POST", {
        'taskId': 0x3,
        'type': 0x0
      }, this.token);
      if (_0x3ceb75.data.code == 0x0) {
        this.discordTask = _0x3ceb75.data.data;
        await Helper.delay(0x1f4, this.acc, _0x3ceb75.data.msg, this);
      } else {
        throw new Error(_0x3ceb75.data.msg);
      }
    } catch (_0xe413c4) {
      throw _0xe413c4;
    }
  }
  async ['addStep'](_0x573d2c, _0x1f61a5, _0x4abf2f = true) {
    try {
      if (_0x4abf2f) {
        await Helper.delay(0x7d0, this.acc, "Try Completing Step " + _0x1f61a5.label + '...', this);
      }
      await this.fetch("https://task-api.testnet.mangonetwork.io/base/addStep", "POST", {
        'taskId': _0x573d2c,
        'stepId': _0x1f61a5.sort
      }, this.token);
    } catch (_0x50b1c1) {
      throw _0x50b1c1;
    }
  }
  async ["getBalance"](_0x2f5289 = false) {
    try {
      if (_0x2f5289) {
        await Helper.delay(0x1f4, this.acc, "Getting Account Balance...", this);
      }
      this.balance = await this.client.getAllBalances({
        'owner': this.address
      });
      this.balance = this.balance.map(_0x511e50 => {
        _0x511e50.totalBalance = parseFloat((Number(_0x511e50.totalBalance) / Number(MIST_PER_MGO)).toFixed(0x5));
        return _0x511e50;
      });
      if (_0x2f5289) {
        await Helper.delay(0x3e8, this.acc, "Successfully Get Account Balance", this);
      }
    } catch (_0x536da6) {
      throw _0x536da6;
    }
  }
  async ["getFaucet"]() {
    try {
      await Helper.delay(0x3e8, this.acc, "Requesting MGO Faucet", this);
      const _0x5c804e = await this.fetch("https://task-api.testnet.mangonetwork.io/base/getFaucet", 'POST', {
        'chain': '0',
        'type': false
      }, this.token);
      if (_0x5c804e.status == 0xc8) {
        await Helper.delay(0x3e8, this.acc, _0x5c804e.data.msg, this);
        await this.getBalance();
      } else {
        throw _0x5c804e;
      }
      await this.addStep(0x1, {
        'label': "Connect to Mango test network and sign to receive Gas",
        'value': "Gas",
        'extend': "Download and use the Beingdex mobile app",
        'sort': 0x0
      }, false);
    } catch (_0x2bc397) {
      await Helper.delay(0xbb8, this.acc, _0x2bc397.data.msg, this);
    }
  }
  async ['checkIn']() {
    try {
      await Helper.delay(0x3e8, this.acc, "Trying to Daily Sign In", this);
      const _0x60a1c6 = new TransactionBlock();
      _0x60a1c6.moveCall({
        'target': SIGNPACKAGE.ADDRESS + "::sign::sign_in",
        'arguments': [_0x60a1c6.object(SIGNPACKAGE.MODULE.SIGN.SIGNPOOL), _0x60a1c6.object(SIGNPACKAGE.MODULE.SIGN.CLOCK)]
      });
      await this.executeTx(_0x60a1c6);
      await Helper.delay(0x3e8, this.acc, "Successfully Daily Sign In", this);
    } catch (_0x23e534) {
      await Helper.delay(0x3e8, this.acc, "Failed to Daily Sign In, Possible already Sign In", this);
    }
  }
  async ["swap"](_0x2f388b, _0x4f5649) {
    try {
      const _0x35cb4e = new TransactionBlock();
      let _0x41160e = await this.client.getCoins({
        'owner': this.address,
        'coinType': _0x2f388b.TYPE
      });
      if (_0x41160e.data.length == 0x0) {
        while (_0x41160e.data.length == 0x0) {
          _0x41160e = await this.client.getCoins({
            'owner': this.address,
            'coinType': _0x2f388b.TYPE
          });
          await this.getBalance();
          await Helper.delay(0x2710, this.acc, "Delaying for " + Helper.msToTime(0x2710) + " until swap balance update", this);
        }
      }
      if (_0x41160e.data.length > 0x1) {
        await this.mergeCoin(_0x2f388b);
        _0x41160e = await this.client.getCoins({
          'owner': this.address,
          'coinType': _0x2f388b.TYPE
        });
      }
      let _0x575a82 = Number(0.1) * Number(MIST_PER_MGO);
      let _0x198a6c;
      if (_0x2f388b == COINS.MGO) {
        _0x198a6c = _0x35cb4e.splitCoins(_0x35cb4e.gas, [_0x35cb4e.pure(_0x575a82)]);
      } else {
        _0x575a82 = Number(_0x41160e.data[0x0].balance);
        _0x198a6c = _0x35cb4e.splitCoins(_0x35cb4e.object(_0x41160e.data[0x0].coinObjectId), [_0x35cb4e.pure(_0x575a82)]);
      }
      await Helper.delay(0x3e8, this.acc, "Try to Swapping " + (_0x2f388b == COINS.MGO ? parseFloat((Number(_0x575a82) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) : parseFloat((Number(_0x41160e.data[0x0].balance) / Number(MIST_PER_MGO)).toString()).toFixed(0x5)) + " " + _0x2f388b.SYMBOL + " to ? " + _0x4f5649.SYMBOL, this);
      const _0x24aa92 = [_0x2f388b, _0x4f5649].find(_0x495f85 => _0x495f85 == COINS.MGO);
      const _0x3a5786 = _0x2f388b == COINS.MGO || !_0x24aa92 && _0x2f388b == COINS.USDT ? [_0x2f388b.TYPE, _0x4f5649.TYPE] : [_0x2f388b.TYPE, _0x4f5649.TYPE].reverse();
      const _0x163767 = await this.getPool(_0x3a5786);
      let _0x5d574a = await this.swapCalculate(_0x3a5786, _0x163767, !!(_0x2f388b == COINS.MGO || !_0x24aa92 && _0x2f388b == COINS.USDT), _0x575a82);
      _0x5d574a = Math.floor(_0x5d574a - _0x5d574a * 0xa / 0x64);
      await Helper.delay(0x3e8, this.acc, "Try to Swapping " + parseFloat((Number(_0x575a82) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x2f388b.SYMBOL + " to " + parseFloat((Number(_0x5d574a) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x4f5649.SYMBOL, this);
      _0x35cb4e.moveCall({
        'target': AMMPACKAGE.ADDRESS + "::amm_script::" + (_0x2f388b == COINS.MGO || !_0x24aa92 && _0x2f388b == COINS.USDT ? "swap_exact_coinA_for_coinB" : "swap_exact_coinB_for_coinA"),
        'typeArguments': _0x3a5786,
        'arguments': [_0x35cb4e.object(_0x163767), _0x35cb4e.object(AMMPACKAGE.MODULE.AMMCONFIG.GLOBALPAUSESTATUSID), _0x198a6c, _0x35cb4e.pure(_0x575a82), _0x35cb4e.pure(_0x5d574a)]
      });
      await this.executeTx(_0x35cb4e);
      await Helper.delay(0x3e8, this.acc, "Successfully Swapping " + parseFloat((Number(_0x575a82) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x2f388b.SYMBOL + " to " + parseFloat((Number(_0x5d574a) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x4f5649.SYMBOL, this);
    } catch (_0x4601e6) {
      throw _0x4601e6;
    }
  }
  async ['exchange'](_0x30b1fa, _0x1590df) {
    try {
      await Helper.delay(0x3e8, this.acc, "Exchanging " + _0x30b1fa.SYMBOL + " to " + _0x1590df.SYMBOL, this);
      const _0x3fc903 = _0x30b1fa == COINS.USDT ? [_0x30b1fa.TYPE, _0x1590df.TYPE].reverse() : [_0x30b1fa.TYPE, _0x1590df.TYPE];
      const _0x4f5191 = new TransactionBlock();
      let _0x5018d3 = await this.client.getCoins({
        'owner': this.address,
        'coinType': _0x30b1fa.TYPE
      });
      if (_0x5018d3.data.length == 0x0) {
        while (_0x5018d3.data.length == 0x0) {
          _0x5018d3 = await this.client.getCoins({
            'owner': this.address,
            'coinType': _0x30b1fa.TYPE
          });
          await this.getBalance();
          await Helper.delay(0x2710, this.acc, "Delaying for " + Helper.msToTime(0x2710) + " until swap balance update", this);
        }
      }
      if (_0x5018d3.data.length > 0x1) {
        await this.mergeCoin(_0x30b1fa);
        _0x5018d3 = await this.client.getCoins({
          'owner': this.address,
          'coinType': _0x30b1fa.TYPE
        });
      }
      const _0x471c52 = Number(_0x5018d3.data[0x0].balance);
      _0x4f5191.moveCall({
        'target': BEINGDEXPACKAGE.ADDRESS + "::clob::" + (_0x30b1fa == COINS.USDT ? "market_buy" : "sell"),
        'typeArguments': _0x3fc903,
        'arguments': _0x30b1fa == COINS.USDT ? [_0x4f5191.object(BEINGDEXPACKAGE.MODULE.CLOB.AIUSDTPOOL), _0x4f5191.object(_0x5018d3.data[0x0].coinObjectId), _0x4f5191.pure(_0x471c52)] : [_0x4f5191.object(BEINGDEXPACKAGE.MODULE.CLOB.AIUSDTPOOL), _0x4f5191.object(_0x5018d3.data[0x0].coinObjectId), _0x4f5191.pure(0x1), _0x4f5191.pure(_0x471c52)]
      });
      await this.executeTx(_0x4f5191);
      await Helper.delay(0x3e8, this.acc, "Successfully Exchanging " + parseFloat((Number(_0x471c52) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + _0x30b1fa.SYMBOL + " to " + _0x1590df.SYMBOL, this);
    } catch (_0x279cf1) {
      throw _0x279cf1;
    }
  }
  async ["mergeCoin"](_0x2625ae) {
    try {
      const _0x3d6082 = await this.client.getCoins({
        'owner': this.address,
        'coinType': _0x2625ae.TYPE
      });
      if (_0x2625ae == COINS.MGO && _0x3d6082.data.length < 0x3) {
        return;
      }
      if (_0x3d6082.data.length < 0x2) {
        return;
      }
      const _0x6a1551 = new TransactionBlock();
      let _0x13602a;
      let _0x33c4d7;
      if (_0x2625ae == COINS.MGO) {
        _0x13602a = _0x3d6082.data[0x1].coinObjectId;
        _0x33c4d7 = _0x3d6082.data.slice(0x2).map(_0x3aacf2 => _0x3aacf2.coinObjectId);
      } else {
        _0x13602a = _0x3d6082.data[0x0].coinObjectId;
        _0x33c4d7 = _0x3d6082.data.slice(0x1).map(_0x2b6970 => _0x2b6970.coinObjectId);
      }
      await Helper.delay(0x3e8, this.acc, "Merging " + _0x2625ae.SYMBOL, this);
      await _0x6a1551.mergeCoins(_0x6a1551.object(_0x13602a), _0x33c4d7.map(_0x545ad9 => _0x6a1551.object(_0x545ad9)));
      await this.executeTx(_0x6a1551);
      await this.getBalance();
    } catch (_0x4aff68) {
      throw _0x4aff68;
    }
  }
  async ['bridge'](_0x3701e5) {
    try {
      if (_0x3701e5 == BRIDGE.MANGOBSC || _0x3701e5 == BRIDGE.MANGOETH) {
        const _0xa4539c = new TransactionBlock();
        let _0x4217f7 = await this.client.getCoins({
          'owner': this.address,
          'coinType': COINS.USDT.TYPE
        });
        if (_0x4217f7.data.length == 0x0) {
          while (coinToSwap.data.length == 0x0) {
            _0x4217f7 = await this.client.getCoins({
              'owner': this.address,
              'coinType': COINS.USDT.TYPE
            });
            await this.getBalance();
            await Helper.delay(0x2710, this.acc, "Delaying for " + Helper.msToTime(0x2710) + " until swap balance update", this);
          }
        }
        if (_0x4217f7.data.length > 0x1) {
          await this.mergeCoin(COINS.USDT);
          _0x4217f7 = await this.client.getCoins({
            'owner': this.address,
            'coinType': COINS.USDT.TYPE
          });
        }
        let _0x3206b8 = Number(0.1) * Number(MIST_PER_MGO);
        const _0xb4c219 = _0xa4539c.splitCoins(_0xa4539c.object(_0x4217f7.data[0x0].coinObjectId), [_0xa4539c.pure(_0x3206b8)]);
        await Helper.delay(0x3e8, this.acc, "Try to Bridge " + parseFloat((Number(_0x3206b8) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + COINS.USDT.SYMBOL + " to BSC NETWORK ", this);
        _0xa4539c.moveCall({
          'target': MANGOBRIDGEPACKAGE.ADDRESS + "::bridge::bridge_token\"}",
          'typeArguments': [COINS.USDT.TYPE],
          'arguments': [_0xa4539c.object(MANGOBRIDGEPACKAGE.MODULE.BRIDGE.BRIDGEXECUTOR), _0xb4c219, _0xa4539c.pure('0x1f0ea6e0b3590e1ab6c12ea0a24d3d0d9bf7707d'), _0xa4539c.pure(_0x3701e5), _0xa4539c.object(MANGOBRIDGEPACKAGE.MODULE.BRIDGE.CLOCK)]
        });
        await this.executeTx(_0xa4539c);
      } else {}
      await Helper.delay(0x3e8, this.acc, "Successfully Bridge " + parseFloat((Number(bridgeAmount) / Number(MIST_PER_MGO)).toString()).toFixed(0x2) + " " + COINS.USDT.SYMBOL + " to BSC NETWORK", this);
    } catch (_0x582077) {
      throw _0x582077;
    }
  }
  async ['swapCalculate'](_0x4af3ba, _0x4a7053, _0x3ae7a6, _0x20100d) {
    const _0x15b0af = new TransactionBlock();
    _0x15b0af.moveCall({
      'target': AMMPACKAGE.ADDRESS + '::amm_router::compute_out',
      'typeArguments': _0x4af3ba,
      'arguments': [_0x15b0af.object(_0x4a7053), _0x15b0af.pure(_0x20100d), _0x15b0af.pure(_0x3ae7a6)]
    });
    const _0x1881e5 = await this.readTx(_0x15b0af);
    return bcs.de(_0x1881e5.results[0x0].returnValues[0x0][0x1], Uint8Array.from(_0x1881e5.results[0x0].returnValues[0x0][0x0]));
  }
  async ["getPool"](_0x4d2b2d) {
    const _0x2dda59 = new TransactionBlock();
    _0x2dda59.moveCall({
      'target': AMMPACKAGE.ADDRESS + "::amm_swap::get_pool_id",
      'typeArguments': _0x4d2b2d,
      'arguments': [_0x2dda59.object(AMMPACKAGE.MODULE.AMMSWAP.AMMFACTORY)]
    });
    const _0x473bcd = await this.readTx(_0x2dda59);
    return bcs.de(_0x473bcd.results[0x0].returnValues[0x0][0x1], Uint8Array.from(_0x473bcd.results[0x0].returnValues[0x0][0x0]));
  }
  async ['executeTx'](_0x1c64c7) {
    try {
      await Helper.delay(0x3e8, this.acc, "Executing Tx ...", this);
      const _0x3ec261 = await this.client.signAndExecuteTransactionBlock({
        'signer': this.wallet,
        'transactionBlock': _0x1c64c7
      });
      await Helper.delay(0xbb8, this.acc, "Tx Executed : " + (this.explorer + "/txblock/" + _0x3ec261.digest), this);
      await this.getBalance();
      return _0x3ec261;
    } catch (_0x539577) {
      throw _0x539577;
    }
  }
  async ["readTx"](_0x363d4e) {
    try {
      const _0x21eab8 = await this.client.devInspectTransactionBlock({
        'sender': this.address,
        'transactionBlock': _0x363d4e
      });
      return _0x21eab8;
    } catch (_0x36a412) {
      throw _0x36a412;
    }
  }
}