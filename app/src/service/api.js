import _0x27d322, { Response } from 'node-fetch';
import { Helper } from '../utils/helper.js';
import _0x34e538 from '../utils/logger.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
export class API {
  constructor(_0x261e68) {
    this.proxy = _0x261e68;
    this.ua = Helper.randomUserAgent();
  }
  ["generateHeaders"](_0x1a7aab, _0x2e754d) {
    const _0x1881bd = {
      'Accept': "application/json, text/plain, */*",
      'Accept-Language': "en-US,en;q=0.9,id;q=0.8",
      'Content-Type': "application/json",
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Site': "same-site",
      'Sec-Fetch-Mode': "cors",
      'User-Agent': this.ua
    };
    if (_0x1a7aab) {
      _0x1881bd["mgo-token"] = '' + _0x1a7aab;
    }
    if (_0x2e754d) {
      Object.assign(_0x1881bd, _0x2e754d);
    }
    return _0x1881bd;
  }
  async ["fetch"](_0x4cfad7, _0x45c7af = "GET", _0x5d5e42, _0x233415, _0x4a4cdf) {
    const _0x5247c3 = {
      'method': _0x45c7af,
      'headers': this.generateHeaders(_0x233415, _0x4a4cdf),
      'body': _0x5d5e42 ? JSON.stringify(_0x5d5e42) : undefined,
      'agent': this.proxy ? new HttpsProxyAgent(this.proxy) : undefined
    };
    try {
      _0x34e538.info(_0x45c7af + " : " + _0x4cfad7 + " " + (this.proxy ? this.proxy : ''));
      _0x34e538.info("Request Header : " + JSON.stringify(_0x5247c3.headers));
      _0x34e538.info("Request Body : " + JSON.stringify(_0x5247c3.body));
      const _0x124cdb = await _0x27d322(_0x4cfad7, _0x5247c3);
      if (!_0x124cdb.ok) {
        throw _0x124cdb;
      }
      const _0x18997b = _0x124cdb.status;
      const _0x390c9a = _0x124cdb.headers.get("Content-Type");
      let _0x1d6331;
      if (_0x390c9a && _0x390c9a.includes("application/json")) {
        _0x1d6331 = await _0x124cdb.json();
      } else {
        _0x1d6331 = {
          'message': await _0x124cdb.text()
        };
      }
      _0x34e538.info("Response : " + _0x124cdb.status + " " + _0x124cdb.statusText);
      _0x34e538.info("Response Data : " + JSON.stringify(_0x1d6331) + "...");
      return {
        'status': _0x18997b,
        'data': _0x1d6331
      };
    } catch (_0x248517) {
      if (_0x248517 instanceof Response) {
        const _0x36a54f = _0x248517.status;
        const _0x1dddd4 = _0x248517.headers.get("Content-Type");
        let _0x3dcc28;
        if (_0x1dddd4 && _0x1dddd4.includes("application/json")) {
          _0x3dcc28 = await _0x248517.json();
        } else {
          _0x3dcc28 = {
            'message': await _0x248517.text()
          };
        }
        _0x34e538.info("Response : " + _0x248517.status + " " + _0x248517.statusText);
        _0x34e538.info("Response Data : " + JSON.stringify(_0x3dcc28) + "...");
        if (_0x36a54f === 0x193) {
          return {
            'status': _0x36a54f,
            'data': _0x3dcc28
          };
        } else {
          if (_0x36a54f === 0x1f8 || _0x36a54f === 0x194) {
            console.error("DETECT API CHANGE.. EXIT");
            process.exit(0x1);
          } else {
            throw new Error(_0x36a54f + " - " + _0x248517.statusText);
          }
        }
      } else {
        throw new Error("Unexpected error: " + (_0x248517.message || _0x248517));
      }
    }
  }
}