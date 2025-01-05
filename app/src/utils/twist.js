import '../service/core-service.js';
import { Twisters } from 'twisters';
import _0x230e63 from './logger.js';
import { accountList } from '../../accounts/accounts.js';
class Twist {
  ["twisters"];
  constructor() {
    this.twisters = new Twisters();
  }
  ['log'](_0xe6713f = '', _0x568ff1 = '', _0x3b4267, _0x1ad177) {
    const _0x3bee01 = accountList.indexOf(_0x568ff1);
    if (_0x1ad177 == undefined) {
      _0x230e63.info("Account " + (_0x3bee01 + 0x1) + " - " + _0xe6713f);
      _0x1ad177 = '-';
    }
    const _0x297a03 = _0x3b4267.address ?? '-';
    const _0x34830a = _0x3b4267.balance ?? [];
    const _0x34c6a3 = _0x3b4267.user ?? {};
    const _0xf3feed = _0x34c6a3.MgoUser ?? {};
    const _0x1e4eda = _0xf3feed.integral ?? '-';
    this.twisters.put(_0x568ff1, {
      'text': "\n================== Account " + (_0x3bee01 + 0x1) + " =================\nAddress      : " + _0x297a03 + "\nBalance      : " + _0x34830a.map(_0x26a238 => {
        return "\n- " + _0x26a238.totalBalance + " " + _0x26a238.coinType.split('::').pop();
      }) + "\nScore        : " + _0x1e4eda + "\n               \nStatus : " + _0xe6713f + "\nDelay  : " + _0x1ad177 + "\n=============================================="
    });
  }
  ["info"](_0x21757e = '') {
    this.twisters.put('2', {
      'text': "\n==============================================\nInfo : " + _0x21757e + "\n=============================================="
    });
    return;
  }
  ["clearInfo"]() {
    this.twisters.remove('2');
  }
  ["clear"](_0x3b5c47) {
    this.twisters.remove(_0x3b5c47);
  }
}
export default new Twist();