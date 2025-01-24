  import a11_0x4f2857 from './twist.js';
  import a11_0xec4131 from 'bip39';
  export class Helper {
    static ["delay"] = (_0xc498f5, _0x269791, _0x2d970a, _0x45d07b) => {
      return new Promise(async _0x2c7587 => {
        let _0x526fab = _0xc498f5;
        if (_0x269791 != undefined) {
          await a11_0x4f2857.log(_0x2d970a, _0x269791, _0x45d07b, "Delaying for " + this.msToTime(_0xc498f5));
        } else {
          a11_0x4f2857.info("Delaying for " + this.msToTime(_0xc498f5));
        }
        const _0x1f813d = setInterval(async () => {
          _0x526fab -= 0x3e8;
          if (_0x269791 != undefined) {
            await a11_0x4f2857.log(_0x2d970a, _0x269791, _0x45d07b, "Delaying for " + this.msToTime(_0x526fab));
          } else {
            a11_0x4f2857.info("Delaying for " + this.msToTime(_0x526fab));
          }
          if (_0x526fab <= 0x0) {
            clearInterval(_0x1f813d);
            _0x2c7587();
          }
        }, 0x3e8);
        setTimeout(async () => {
          clearInterval(_0x1f813d);
          await a11_0x4f2857.clearInfo();
          if (_0x269791) {
            await a11_0x4f2857.log(_0x2d970a, _0x269791, _0x45d07b);
          }
          _0x2c7587();
        }, _0xc498f5);
      });
    };
    static ["msToTime"](_0x3adc15) {
      const _0x2e4e55 = Math.floor(_0x3adc15 / 3600000);
      const _0xf0594e = _0x3adc15 % 3600000;
      const _0x48eb76 = Math.floor(_0xf0594e / 60000);
      const _0x491f12 = _0xf0594e % 60000;
      const _0x1073c3 = Math.round(_0x491f12 / 0x3e8);
      return _0x2e4e55 + " Hours " + _0x48eb76 + " Minutes " + _0x1073c3 + " Seconds";
    }
    static ['refCheck'](_0x58d8c0, _0x3327a2) {}
    static ["randomUserAgent"]() {
      const _0x118eac = ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/125.2535.60 Mobile/15E148 Safari/605.1.15", "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 EdgA/124.0.2478.104", "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 EdgA/124.0.2478.104", "Mozilla/5.0 (Linux; Android 10; VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 OPR/76.2.4027.73374", "Mozilla/5.0 (Linux; Android 10; SM-N975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Mobile Safari/537.36 OPR/76.2.4027.73374"];
      return _0x118eac[Math.floor(Math.random() * _0x118eac.length)];
    }
    ['static']() {
        console.log('');
      }
    static ["determineType"](_0x169adf) {
      if (this.isMnemonic(_0x169adf)) {
        return true;
      } else {
        return false;
      }
    }
    static ["isMnemonic"](_0x5337b9) {
      return a11_0xec4131.validateMnemonic(_0x5337b9);
    }
    static ["serializeBigInt"] = _0x5bec76 => {
      return JSON.parse(JSON.stringify(_0x5bec76, (_0x110651, _0x5f900c) => typeof _0x5f900c === "bigint" ? _0x5f900c.toString() : _0x5f900c));
    };
  }