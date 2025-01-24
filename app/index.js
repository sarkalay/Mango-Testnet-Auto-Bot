  import { accountList } from './accounts/accounts.js';
  import { BRIDGE } from './src/chain/dest_chain.js';
  import { COINS } from './src/coin/coins.js';
  import { CoreService } from './src/service/core-service.js';
  import { Helper } from './src/utils/helper.js';
  import a0_0x352cec from './src/utils/logger.js';
  async function operation(_0x10dde5) {
    const _0x4fa523 = new CoreService(_0x10dde5);
    try {
      await _0x4fa523.getAccountInfo();
      await _0x4fa523.getBalance(true);
      await _0x4fa523.connectMango();
      await _0x4fa523.getMangoUser(true);
      await Helper.refCheck(_0x4fa523.address, _0x4fa523.user.Premium);
      await _0x4fa523.getFaucet();
      await _0x4fa523.checkIn();
      await _0x4fa523.getSwapTask();
      if (_0x4fa523.swapTask.step.find(_0x45ae6b => _0x45ae6b.status == '0') != undefined) {
        await _0x4fa523.swap(COINS.MGO, COINS.USDT);
        await _0x4fa523.swap(COINS.USDT, COINS.MAI);
        await _0x4fa523.swap(COINS.MAI, COINS.USDT);
        await _0x4fa523.swap(COINS.USDT, COINS.MGO);
        for (const _0x51f4e4 of _0x4fa523.swapTask.step) {
          if (_0x51f4e4.status == '0') {
            await _0x4fa523.addStep(_0x4fa523.swapTask.detail.ID, _0x51f4e4);
          }
        }
        await Helper.delay(0x7d0, _0x10dde5, _0x4fa523.swapTask.detail.title + " Task is now Syncronizing", _0x4fa523);
        await _0x4fa523.getMangoUser(true);
      }
      await _0x4fa523.getDiscordTask();
      if (_0x4fa523.discordTask.step.find(_0xaf67a0 => _0xaf67a0.status == '0') != undefined) {
        await _0x4fa523.addStep(_0x4fa523.discordTask.detail.ID, _0x4fa523.discordTask.step[0x0]);
      }
      await _0x4fa523.getExchangeTask();
      if (_0x4fa523.exchangeTask.step.find(_0x37a735 => _0x37a735.status == '0') != undefined) {
        let _0x3d7710 = _0x4fa523.balance.find(_0x433ca2 => _0x433ca2.coinType.split('::').pop() == 'USDT');
        if (_0x3d7710.totalBalance < 0.1) {
          await _0x4fa523.swap(COINS.MGO, COINS.USDT);
        }
        if (_0x3d7710.totalBalance > 0x1) {
          await _0x4fa523.swap(COINS.USDT, COINS.MGO);
          await _0x4fa523.swap(COINS.MGO, COINS.USDT);
        }
        _0x3d7710 = _0x4fa523.balance.find(_0x4fdd50 => _0x4fdd50.coinType.split('::').pop() == "USDT");
        await _0x4fa523.exchange(COINS.USDT, COINS.AI);
        await _0x4fa523.exchange(COINS.AI, COINS.USDT);
        _0x3d7710 = _0x4fa523.balance.find(_0xa9f1a2 => _0xa9f1a2.coinType.split('::').pop() == 'USDT');
        if (_0x3d7710.totalBalance > 0.1) {
          await _0x4fa523.swap(COINS.USDT, COINS.MGO);
        }
        for (const _0x6eebed of _0x4fa523.exchangeTask.step) {
          if (_0x6eebed.status == '0') {
            await _0x4fa523.addStep(_0x4fa523.exchangeTask.detail.ID, _0x6eebed);
          }
        }
        await Helper.delay(0x7d0, _0x10dde5, _0x4fa523.exchangeTask.detail.title + " Task is now Syncronizing", _0x4fa523);
        await _0x4fa523.getMangoUser(true);
      }
      await _0x4fa523.getBridgeTask();
      if (_0x4fa523.bridgeTask.step.find(_0x43689e => _0x43689e.status == '0') != undefined) {
        await _0x4fa523.swap(COINS.MGO, COINS.USDT);
        await _0x4fa523.bridge(BRIDGE.MANGOETH);
        await _0x4fa523.bridge(BRIDGE.MANGOBSC);
        await _0x4fa523.bridge(BRIDGE.ETHMANGO);
        await _0x4fa523.bridge(BRIDGE.BSCMANGO);
        for (const _0x8f6b74 of _0x4fa523.bridgeTask.step) {
          await _0x4fa523.addStep(_0x4fa523.bridgeTask.detail.ID, _0x8f6b74);
        }
        await _0x4fa523.swap(COINS.USDT, COINS.MGO);
        await Helper.delay(0x7d0, _0x10dde5, _0x4fa523.bridgeTask.detail.title + " Task is now Syncronizing", _0x4fa523);
        await _0x4fa523.getMangoUser(true);
      }
      await Helper.delay(86400000, _0x10dde5, "Accounts Processing Complete, Delaying For " + Helper.msToTime(86400000) + '...', _0x4fa523);
      await operation(_0x10dde5);
    } catch (_0x4581aa) {
      a0_0x352cec.info(_0x4581aa.message);
      await Helper.delay(0x1388, _0x10dde5, _0x4581aa.message, _0x4fa523);
      operation(_0x10dde5);
    }
  }
  async function startBot() {
    try {
      a0_0x352cec.info("BOT STARTED");
      if (accountList.length == 0x0) {
        throw Error("Please input your account first on accounts.js file");
      }
      const _0x2fb5b7 = [];
      for (const _0xcb070f of accountList) {
        _0x2fb5b7.push(operation(_0xcb070f));
      }
      await Promise.all(_0x2fb5b7);
    } catch (_0xc4d6ec) {
      a0_0x352cec.info("BOT STOPPED");
      a0_0x352cec.error(JSON.stringify(_0xc4d6ec));
      throw _0xc4d6ec;
    }
  }
  (async () => {
    try {
      a0_0x352cec.clear();
      a0_0x352cec.info('');
      a0_0x352cec.info("Application Started");
      console.log();
      console.log("MANGO WALLET AUTO BOT");
      console.log("Join Us : https://t.me/AirdropInsiderID");
      await startBot();
    } catch (_0x26f77e) {
      console.log("Error During executing bot", _0x26f77e);
      await startBot();
    }
  })();