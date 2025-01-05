import { accountList } from './accounts/accounts.js';
import './src/chain/dest_chain.js';
import { COINS } from './src/coin/coins.js';
import { CoreService } from './src/service/core-service.js';
import { Helper } from './src/utils/helper.js';
import _0x58c199 from './src/utils/logger.js';
async function operation(_0x5a9aeb) {
  const _0x542722 = new CoreService(_0x5a9aeb);
  try {
    await _0x542722.getAccountInfo();
    await _0x542722.getBalance(true);
    await _0x542722.connectMango();
    await _0x542722.getMangoUser(true);
    //await Helper.refCheck(_0x542722.address, _0x542722.user.Premium);
    await _0x542722.getFaucet();
    await _0x542722.checkIn();
    await _0x542722.getSwapTask();
    if (_0x542722.swapTask.step.find(_0x5a8fb3 => _0x5a8fb3.status == '0') != undefined) {
      await _0x542722.swap(COINS.MGO, COINS.USDT);
      await _0x542722.swap(COINS.USDT, COINS.MAI);
      await _0x542722.swap(COINS.MAI, COINS.USDT);
      await _0x542722.swap(COINS.USDT, COINS.MGO);
      for (const _0x4376c2 of _0x542722.swapTask.step) {
        if (_0x4376c2.status == '0') {
          await _0x542722.addStep(_0x542722.swapTask.detail.ID, _0x4376c2);
        }
      }
      await Helper.delay(0x7d0, _0x5a9aeb, _0x542722.swapTask.detail.title + " Task is now Syncronizing", _0x542722);
      await _0x542722.getMangoUser(true);
    }
    await _0x542722.getDiscordTask();
    if (_0x542722.discordTask.step.find(_0x59d3db => _0x59d3db.status == '0') != undefined) {
      await _0x542722.addStep(_0x542722.discordTask.detail.ID, _0x542722.discordTask.step[0x0]);
    }
    await _0x542722.getExchangeTask();
    if (_0x542722.exchangeTask.step.find(_0x50099b => _0x50099b.status == '0') != undefined) {
      await _0x542722.swap(COINS.MGO, COINS.USDT);
      await _0x542722.exchange(COINS.USDT, COINS.AI);
      await _0x542722.exchange(COINS.AI, COINS.USDT);
      await _0x542722.swap(COINS.USDT, COINS.MGO);
      for (const _0x4ab54d of _0x542722.exchangeTask.step) {
        if (_0x4ab54d.status == '0') {
          await _0x542722.addStep(_0x542722.exchangeTask.detail.ID, _0x4ab54d);
        }
      }
      await Helper.delay(0x7d0, _0x5a9aeb, _0x542722.exchangeTask.detail.title + " Task is now Syncronizing", _0x542722);
      await _0x542722.getMangoUser(true);
    }
    await Helper.delay(0x5265c00, _0x5a9aeb, "Accounts Processing Complete, Delaying For " + Helper.msToTime(0x5265c00) + '...', _0x542722);
  } catch (_0x13a9d7) {
    _0x58c199.info(_0x13a9d7.message);
    await Helper.delay(0x1388, _0x5a9aeb, _0x13a9d7.message, _0x542722);
    operation(_0x5a9aeb);
  }
}
async function startBot() {
  try {
    _0x58c199.info("BOT STARTED");
    if (accountList.length == 0x0) {
      throw Error("Please input your account first on accounts.js file");
    }
    const _0x8395 = [];
    for (const _0x48096e of accountList) {
      _0x8395.push(operation(_0x48096e));
    }
    await Promise.all(_0x8395);
  } catch (_0xa373bf) {
    _0x58c199.info("BOT STOPPED");
    _0x58c199.error(JSON.stringify(_0xa373bf));
    throw _0xa373bf;
  }
}
(async () => {
  try {
    _0x58c199.clear();
    _0x58c199.info('');
    _0x58c199.info("Application Started");
    console.log();
    console.log(`
         █████╗ ██╗██████╗ ██████╗ ██████╗  ██████╗ ██████╗ 
        ██╔══██╗██║██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
        ███████║██║██████╔╝██║  ██║██████╔╝██║   ██║██████╔╝
        ██╔══██║██║██╔══██╗██║  ██║██╔══██╗██║   ██║██╔═══╝ 
        ██║  ██║██║██║  ██║██████╔╝██║  ██║╚██████╔╝██║     
        ╚═╝  ╚═╝╚═╝╚═╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     

        ██╗███╗   ██╗███████╗██╗██████╗ ███████╗██████╗     
        ██║████╗  ██║██╔════╝██║██╔══██╗██╔════╝██╔══██╗    
        ██║██╔██╗ ██║███████╗██║██║  ██║█████╗  ██████╔╝    
        ██║██║╚██╗██║╚════██║██║██║  ██║██╔══╝  ██╔══██╗    
        ██║██║ ╚████║███████║██║██████╔╝███████╗██║  ██║    
        ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
    `);
    console.log("MANGO TESTNET AUTO BOT");
    console.log("Join our Channel : https://t.me/AirdropInsiderID");
    await startBot();
  } catch (_0x4ab8f5) {
    console.log("Error During executing bot", _0x4ab8f5);
    await startBot();
  }
})();
