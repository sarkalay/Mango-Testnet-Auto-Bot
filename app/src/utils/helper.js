import _0x5ca82f from './twist.js';
export class Helper {
  static ["delay"] = (_0x5482b9, _0x287a06, _0x95bcf3, _0x76032c) => {
    return new Promise(async _0x1cd5e6 => {
      let _0x295614 = _0x5482b9;
      if (_0x287a06 != undefined) {
        await _0x5ca82f.log(_0x95bcf3, _0x287a06, _0x76032c, "Delaying for " + this.msToTime(_0x5482b9));
      } else {
        _0x5ca82f.info("Delaying for " + this.msToTime(_0x5482b9));
      }
      const _0x3d86cd = setInterval(async () => {
        _0x295614 -= 0x3e8;
        if (_0x287a06 != undefined) {
          await _0x5ca82f.log(_0x95bcf3, _0x287a06, _0x76032c, "Delaying for " + this.msToTime(_0x295614));
        } else {
          _0x5ca82f.info("Delaying for " + this.msToTime(_0x295614));
        }
        if (_0x295614 <= 0x0) {
          clearInterval(_0x3d86cd);
          _0x1cd5e6();
        }
      }, 0x3e8);
      setTimeout(async () => {
        clearInterval(_0x3d86cd);
        await _0x5ca82f.clearInfo();
        if (_0x287a06) {
          await _0x5ca82f.log(_0x95bcf3, _0x287a06, _0x76032c);
        }
        _0x1cd5e6();
      }, _0x5482b9);
    });
  };
  static ['msToTime'](_0x3bdc71) {
    const _0x311ee4 = Math.floor(_0x3bdc71 / 0x36ee80);
    const _0x21ea78 = _0x3bdc71 % 0x36ee80;
    const _0x27d0e9 = Math.floor(_0x21ea78 / 0xea60);
    const _0x509973 = _0x21ea78 % 0xea60;
    const _0x549dd8 = Math.round(_0x509973 / 0x3e8);
    return _0x311ee4 + " Hours " + _0x27d0e9 + " Minutes " + _0x549dd8 + " Seconds";
  }
  static ["refCheck"](_0x47839d, _0x35ad35) {}
  static ["randomUserAgent"]() {
    const _0x35e06c = ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/125.2535.60 Mobile/15E148 Safari/605.1.15", "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 EdgA/124.0.2478.104", "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 EdgA/124.0.2478.104", "Mozilla/5.0 (Linux; Android 10; VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 OPR/76.2.4027.73374", "Mozilla/5.0 (Linux; Android 10; SM-N975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 OPR/76.2.4027.73374"];
    return _0x35e06c[Math.floor(Math.random() * _0x35e06c.length)];
  }
  ["static"]() {
    console.log();
  }
}