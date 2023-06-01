/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/content-script/pageProvider/pushEventHandlers.ts":
/*!**************************************************************!*\
  !*** ./src/content-script/pageProvider/pushEventHandlers.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eth-rpc-errors */ "./node_modules/eth-rpc-errors/dist/index.js");

class PushEventHandlers {
  constructor(provider) {
    this.provider = void 0;
    this.connect = data => {
      if (!this.provider._isConnected) {
        this.provider._isConnected = true;
        this.provider._state.isConnected = true;
        this._emit('connect', data);
      }
    };
    this.unlock = () => {
      this.provider._isUnlocked = true;
      this.provider._state.isUnlocked = true;
    };
    this.lock = () => {
      this.provider._isUnlocked = false;
    };
    this.disconnect = () => {
      this.provider._isConnected = false;
      this.provider._state.isConnected = false;
      this.provider._state.accounts = null;
      this.provider._selectedAddress = null;
      const disconnectError = eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.provider.disconnected();
      this._emit('accountsChanged', []);
      this._emit('disconnect', disconnectError);
      this._emit('close', disconnectError);
    };
    this.accountsChanged = accounts => {
      if ((accounts === null || accounts === void 0 ? void 0 : accounts[0]) === this.provider._selectedAddress) {
        return;
      }
      this.provider._selectedAddress = accounts === null || accounts === void 0 ? void 0 : accounts[0];
      this.provider._state.accounts = accounts;
      this._emit('accountsChanged', accounts);
    };
    this.networkChanged = _ref => {
      let {
        network
      } = _ref;
      this.connect({});
      if (network !== this.provider._network) {
        this.provider._network = network;
        this._emit('networkChanged', network);
      }
    };
    this.provider = provider;
  }
  _emit(event, data) {
    if (this.provider._initialized) {
      this.provider.emit(event, data);
    }
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PushEventHandlers);

/***/ }),

/***/ "./src/content-script/pageProvider/readyPromise.ts":
/*!*********************************************************!*\
  !*** ./src/content-script/pageProvider/readyPromise.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class ReadyPromise {
  constructor(count) {
    this._allCheck = [];
    this._tasks = [];
    this.check = index => {
      this._allCheck[index - 1] = true;
      this._proceed();
    };
    this.uncheck = index => {
      this._allCheck[index - 1] = false;
    };
    this._proceed = () => {
      if (this._allCheck.some(_ => !_)) {
        return;
      }
      while (this._tasks.length) {
        const {
          resolve,
          fn
        } = this._tasks.shift();
        resolve(fn());
      }
    };
    this.call = fn => {
      return new Promise(resolve => {
        this._tasks.push({
          fn,
          resolve
        });
        this._proceed();
      });
    };
    this._allCheck = [...Array(count)];
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReadyPromise);

/***/ }),

/***/ "./src/content-script/pageProvider/utils.ts":
/*!**************************************************!*\
  !*** ./src/content-script/pageProvider/utils.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": () => (/* binding */ $),
/* harmony export */   "domReadyCall": () => (/* binding */ domReadyCall)
/* harmony export */ });
let tryCount = 0;
const checkLoaded = callback => {
  tryCount++;
  if (tryCount > 600) {
    // some error happen?
    return;
  }
  if (document.readyState === 'complete') {
    callback();
    return true;
  } else {
    setTimeout(() => {
      checkLoaded(callback);
    }, 100);
  }
};
const domReadyCall = callback => {
  checkLoaded(callback);

  // if (document.readyState === 'complete') {
  //   callback();
  // } else {
  //   const domContentLoadedHandler = (e) => {
  //     callback();
  //     document.removeEventListener('DOMContentLoaded', domContentLoadedHandler);
  //   };
  //   document.addEventListener('DOMContentLoaded', domContentLoadedHandler);
  // }
};

const $ = document.querySelector.bind(document);


/***/ }),

/***/ "./src/shared/types.ts":
/*!*****************************!*\
  !*** ./src/shared/types.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AddressType": () => (/* binding */ AddressType),
/* harmony export */   "NetworkType": () => (/* binding */ NetworkType),
/* harmony export */   "RestoreWalletType": () => (/* binding */ RestoreWalletType),
/* harmony export */   "TokenInscriptionType": () => (/* binding */ TokenInscriptionType),
/* harmony export */   "TxType": () => (/* binding */ TxType)
/* harmony export */ });
let AddressType;
(function (AddressType) {
  AddressType[AddressType["P2PKH"] = 0] = "P2PKH";
  AddressType[AddressType["P2WPKH"] = 1] = "P2WPKH";
  AddressType[AddressType["P2TR"] = 2] = "P2TR";
  AddressType[AddressType["P2SH_P2WPKH"] = 3] = "P2SH_P2WPKH";
  AddressType[AddressType["M44_P2WPKH"] = 4] = "M44_P2WPKH";
  AddressType[AddressType["M44_P2TR"] = 5] = "M44_P2TR";
})(AddressType || (AddressType = {}));
let NetworkType;
(function (NetworkType) {
  NetworkType[NetworkType["MAINNET"] = 0] = "MAINNET";
  NetworkType[NetworkType["TESTNET"] = 1] = "TESTNET";
})(NetworkType || (NetworkType = {}));
let RestoreWalletType;
(function (RestoreWalletType) {
  RestoreWalletType[RestoreWalletType["UNISAT"] = 0] = "UNISAT";
  RestoreWalletType[RestoreWalletType["SPARROW"] = 1] = "SPARROW";
  RestoreWalletType[RestoreWalletType["XVERSE"] = 2] = "XVERSE";
  RestoreWalletType[RestoreWalletType["OTHERS"] = 3] = "OTHERS";
})(RestoreWalletType || (RestoreWalletType = {}));
let TxType;
(function (TxType) {
  TxType[TxType["SIGN_TX"] = 0] = "SIGN_TX";
  TxType[TxType["SEND_BITCOIN"] = 1] = "SEND_BITCOIN";
  TxType[TxType["SEND_INSCRIPTION"] = 2] = "SEND_INSCRIPTION";
})(TxType || (TxType = {}));
let TokenInscriptionType;
(function (TokenInscriptionType) {
  TokenInscriptionType[TokenInscriptionType["INSCRIBE_TRANSFER"] = 0] = "INSCRIBE_TRANSFER";
  TokenInscriptionType[TokenInscriptionType["INSCRIBE_MINT"] = 1] = "INSCRIBE_MINT";
})(TokenInscriptionType || (TokenInscriptionType = {}));

/***/ }),

/***/ "./src/shared/utils/message/broadcastChannelMessage.ts":
/*!*************************************************************!*\
  !*** ./src/shared/utils/message/broadcastChannelMessage.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BroadcastChannelMessage)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/shared/utils/message/index.ts");

class BroadcastChannelMessage extends _index__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(name) {
    super();
    this._channel = void 0;
    this.connect = () => {
      this._channel.onmessage = _ref => {
        let {
          data: {
            type,
            data
          }
        } = _ref;
        if (type === 'message') {
          this.emit('message', data);
        } else if (type === 'response') {
          this.onResponse(data);
        }
      };
      return this;
    };
    this.listen = listenCallback => {
      this.listenCallback = listenCallback;
      this._channel.onmessage = _ref2 => {
        let {
          data: {
            type,
            data
          }
        } = _ref2;
        if (type === 'request') {
          this.onRequest(data);
        }
      };
      return this;
    };
    this.send = (type, data) => {
      this._channel.postMessage({
        type,
        data
      });
    };
    this.dispose = () => {
      this._dispose();
      this._channel.close();
    };
    if (!name) {
      throw new Error('the broadcastChannel name is missing');
    }
    this._channel = new BroadcastChannel(name);
  }
}

/***/ }),

/***/ "./src/shared/utils/message/index.ts":
/*!*******************************************!*\
  !*** ./src/shared/utils/message/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eth-rpc-errors */ "./node_modules/eth-rpc-errors/dist/index.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);
/**
 * this script is live in content-script / dapp's page
 */


class Message extends events__WEBPACK_IMPORTED_MODULE_1__.EventEmitter {
  constructor() {
    var _this;
    super(...arguments);
    _this = this;
    // avaiable id list
    // max concurrent request limit
    this._requestIdPool = [...Array(500).keys()];
    this._EVENT_PRE = 'UNISAT_WALLET_';
    this.listenCallback = void 0;
    this._waitingMap = new Map();
    this.request = data => {
      if (!this._requestIdPool.length) {
        throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.limitExceeded();
      }
      const ident = this._requestIdPool.shift();
      return new Promise((resolve, reject) => {
        this._waitingMap.set(ident, {
          data,
          resolve,
          reject
        });
        this.send('request', {
          ident,
          data
        });
      });
    };
    this.onResponse = async function () {
      let {
        ident,
        res,
        err
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // the url may update
      if (!_this._waitingMap.has(ident)) {
        return;
      }
      const {
        resolve,
        reject
      } = _this._waitingMap.get(ident);
      _this._requestIdPool.push(ident);
      _this._waitingMap.delete(ident);
      err ? reject(err) : resolve(res);
    };
    this.onRequest = async _ref => {
      let {
        ident,
        data
      } = _ref;
      if (this.listenCallback) {
        let res, err;
        try {
          res = await this.listenCallback(data);
        } catch (e) {
          err = {
            message: e.message,
            stack: e.stack
          };
          e.code && (err.code = e.code);
          e.data && (err.data = e.data);
        }
        this.send('response', {
          ident,
          res,
          err
        });
      }
    };
    this._dispose = () => {
      for (const request of this._waitingMap.values()) {
        request.reject(eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.provider.userRejectedRequest());
      }
      this._waitingMap.clear();
    };
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Message);

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/classes.js":
/*!*****************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/classes.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.EthereumProviderError = exports.EthereumRpcError = void 0;
const fast_safe_stringify_1 = __webpack_require__(/*! fast-safe-stringify */ "./node_modules/fast-safe-stringify/index.js");
/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors
 * per EIP-1474.
 * Permits any integer error code.
 */
class EthereumRpcError extends Error {
  constructor(code, message, data) {
    if (!Number.isInteger(code)) {
      throw new Error('"code" must be an integer.');
    }
    if (!message || typeof message !== 'string') {
      throw new Error('"message" must be a nonempty string.');
    }
    super(message);
    this.code = code;
    if (data !== undefined) {
      this.data = data;
    }
  }
  /**
   * Returns a plain object with all public class properties.
   */
  serialize() {
    const serialized = {
      code: this.code,
      message: this.message
    };
    if (this.data !== undefined) {
      serialized.data = this.data;
    }
    if (this.stack) {
      serialized.stack = this.stack;
    }
    return serialized;
  }
  /**
   * Return a string representation of the serialized error, omitting
   * any circular references.
   */
  toString() {
    return fast_safe_stringify_1.default(this.serialize(), stringifyReplacer, 2);
  }
}
exports.EthereumRpcError = EthereumRpcError;
/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 * Permits integer error codes in the [ 1000 <= 4999 ] range.
 */
class EthereumProviderError extends EthereumRpcError {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   * `code` must be an integer in the 1000 <= 4999 range.
   */
  constructor(code, message, data) {
    if (!isValidEthProviderCode(code)) {
      throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');
    }
    super(code, message, data);
  }
}
exports.EthereumProviderError = EthereumProviderError;
// Internal
function isValidEthProviderCode(code) {
  return Number.isInteger(code) && code >= 1000 && code <= 4999;
}
function stringifyReplacer(_, value) {
  if (value === '[Circular]') {
    return undefined;
  }
  return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3Nlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGFzc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZEQUFnRDtBQVNoRDs7OztHQUlHO0FBQ0gsTUFBYSxnQkFBb0IsU0FBUSxLQUFLO0lBTTVDLFlBQVksSUFBWSxFQUFFLE9BQWUsRUFBRSxJQUFRO1FBRWpELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQ2IsNEJBQTRCLENBQzdCLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQzNDLE1BQU0sSUFBSSxLQUFLLENBQ2Isc0NBQXNDLENBQ3ZDLENBQUM7U0FDSDtRQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVM7UUFDUCxNQUFNLFVBQVUsR0FBK0I7WUFDN0MsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztTQUM3QjtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUMvQjtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxRQUFRO1FBQ04sT0FBTyw2QkFBYSxDQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLEVBQ2hCLGlCQUFpQixFQUNqQixDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXRERCw0Q0FzREM7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLHFCQUF5QixTQUFRLGdCQUFtQjtJQUUvRDs7O09BR0c7SUFDSCxZQUFZLElBQVksRUFBRSxPQUFlLEVBQUUsSUFBUTtRQUVqRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FDYiwyREFBMkQsQ0FDNUQsQ0FBQztTQUNIO1FBRUQsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBaEJELHNEQWdCQztBQUVELFdBQVc7QUFFWCxTQUFTLHNCQUFzQixDQUFDLElBQVk7SUFDMUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztBQUNoRSxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxDQUFVLEVBQUUsS0FBYztJQUNuRCxJQUFJLEtBQUssS0FBSyxZQUFZLEVBQUU7UUFDMUIsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMifQ==

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/error-constants.js":
/*!*************************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/error-constants.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.errorValues = exports.errorCodes = void 0;
exports.errorCodes = {
  rpc: {
    invalidInput: -32000,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    limitExceeded: -32005,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603
  },
  provider: {
    userRejectedRequest: 4001,
    unauthorized: 4100,
    unsupportedMethod: 4200,
    disconnected: 4900,
    chainDisconnected: 4901
  }
};
exports.errorValues = {
  '-32700': {
    standard: 'JSON RPC 2.0',
    message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.'
  },
  '-32600': {
    standard: 'JSON RPC 2.0',
    message: 'The JSON sent is not a valid Request object.'
  },
  '-32601': {
    standard: 'JSON RPC 2.0',
    message: 'The method does not exist / is not available.'
  },
  '-32602': {
    standard: 'JSON RPC 2.0',
    message: 'Invalid method parameter(s).'
  },
  '-32603': {
    standard: 'JSON RPC 2.0',
    message: 'Internal JSON-RPC error.'
  },
  '-32000': {
    standard: 'EIP-1474',
    message: 'Invalid input.'
  },
  '-32001': {
    standard: 'EIP-1474',
    message: 'Resource not found.'
  },
  '-32002': {
    standard: 'EIP-1474',
    message: 'Resource unavailable.'
  },
  '-32003': {
    standard: 'EIP-1474',
    message: 'Transaction rejected.'
  },
  '-32004': {
    standard: 'EIP-1474',
    message: 'Method not supported.'
  },
  '-32005': {
    standard: 'EIP-1474',
    message: 'Request limit exceeded.'
  },
  '4001': {
    standard: 'EIP-1193',
    message: 'User rejected the request.'
  },
  '4100': {
    standard: 'EIP-1193',
    message: 'The requested account and/or method has not been authorized by the user.'
  },
  '4200': {
    standard: 'EIP-1193',
    message: 'The requested method is not supported by this Ethereum provider.'
  },
  '4900': {
    standard: 'EIP-1193',
    message: 'The provider is disconnected from all chains.'
  },
  '4901': {
    standard: 'EIP-1193',
    message: 'The provider is disconnected from the specified chain.'
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9yLWNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF1QmEsUUFBQSxVQUFVLEdBQWU7SUFDcEMsR0FBRyxFQUFFO1FBQ0gsWUFBWSxFQUFFLENBQUMsS0FBSztRQUNwQixnQkFBZ0IsRUFBRSxDQUFDLEtBQUs7UUFDeEIsbUJBQW1CLEVBQUUsQ0FBQyxLQUFLO1FBQzNCLG1CQUFtQixFQUFFLENBQUMsS0FBSztRQUMzQixrQkFBa0IsRUFBRSxDQUFDLEtBQUs7UUFDMUIsYUFBYSxFQUFFLENBQUMsS0FBSztRQUNyQixLQUFLLEVBQUUsQ0FBQyxLQUFLO1FBQ2IsY0FBYyxFQUFFLENBQUMsS0FBSztRQUN0QixjQUFjLEVBQUUsQ0FBQyxLQUFLO1FBQ3RCLGFBQWEsRUFBRSxDQUFDLEtBQUs7UUFDckIsUUFBUSxFQUFFLENBQUMsS0FBSztLQUNqQjtJQUNELFFBQVEsRUFBRTtRQUNSLG1CQUFtQixFQUFFLElBQUk7UUFDekIsWUFBWSxFQUFFLElBQUk7UUFDbEIsaUJBQWlCLEVBQUUsSUFBSTtRQUN2QixZQUFZLEVBQUUsSUFBSTtRQUNsQixpQkFBaUIsRUFBRSxJQUFJO0tBQ3hCO0NBQ0YsQ0FBQztBQUVXLFFBQUEsV0FBVyxHQUFHO0lBQ3pCLFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLE9BQU8sRUFBRSx1R0FBdUc7S0FDakg7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsY0FBYztRQUN4QixPQUFPLEVBQUUsOENBQThDO0tBQ3hEO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsUUFBUSxFQUFFLGNBQWM7UUFDeEIsT0FBTyxFQUFFLCtDQUErQztLQUN6RDtJQUNELFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLE9BQU8sRUFBRSw4QkFBOEI7S0FDeEM7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsY0FBYztRQUN4QixPQUFPLEVBQUUsMEJBQTBCO0tBQ3BDO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsUUFBUSxFQUFFLFVBQVU7UUFDcEIsT0FBTyxFQUFFLGdCQUFnQjtLQUMxQjtJQUNELFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSxxQkFBcUI7S0FDL0I7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsVUFBVTtRQUNwQixPQUFPLEVBQUUsdUJBQXVCO0tBQ2pDO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsUUFBUSxFQUFFLFVBQVU7UUFDcEIsT0FBTyxFQUFFLHVCQUF1QjtLQUNqQztJQUNELFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSx1QkFBdUI7S0FDakM7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsVUFBVTtRQUNwQixPQUFPLEVBQUUseUJBQXlCO0tBQ25DO0lBQ0QsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFLFVBQVU7UUFDcEIsT0FBTyxFQUFFLDRCQUE0QjtLQUN0QztJQUNELE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSwwRUFBMEU7S0FDcEY7SUFDRCxNQUFNLEVBQUU7UUFDTixRQUFRLEVBQUUsVUFBVTtRQUNwQixPQUFPLEVBQUUsa0VBQWtFO0tBQzVFO0lBQ0QsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFLFVBQVU7UUFDcEIsT0FBTyxFQUFFLCtDQUErQztLQUN6RDtJQUNELE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSx3REFBd0Q7S0FDbEU7Q0FDRixDQUFDIn0=

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/errors.js":
/*!****************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/errors.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ethErrors = void 0;
const classes_1 = __webpack_require__(/*! ./classes */ "./node_modules/eth-rpc-errors/dist/classes.js");
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/eth-rpc-errors/dist/utils.js");
const error_constants_1 = __webpack_require__(/*! ./error-constants */ "./node_modules/eth-rpc-errors/dist/error-constants.js");
exports.ethErrors = {
  rpc: {
    /**
     * Get a JSON RPC 2.0 Parse (-32700) error.
     */
    parse: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.parse, arg),
    /**
     * Get a JSON RPC 2.0 Invalid Request (-32600) error.
     */
    invalidRequest: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidRequest, arg),
    /**
     * Get a JSON RPC 2.0 Invalid Params (-32602) error.
     */
    invalidParams: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidParams, arg),
    /**
     * Get a JSON RPC 2.0 Method Not Found (-32601) error.
     */
    methodNotFound: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.methodNotFound, arg),
    /**
     * Get a JSON RPC 2.0 Internal (-32603) error.
     */
    internal: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.internal, arg),
    /**
     * Get a JSON RPC 2.0 Server error.
     * Permits integer error codes in the [ -32099 <= -32005 ] range.
     * Codes -32000 through -32004 are reserved by EIP-1474.
     */
    server: opts => {
      if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
        throw new Error('Ethereum RPC Server errors must provide single object argument.');
      }
      const {
        code
      } = opts;
      if (!Number.isInteger(code) || code > -32005 || code < -32099) {
        throw new Error('"code" must be an integer such that: -32099 <= code <= -32005');
      }
      return getEthJsonRpcError(code, opts);
    },
    /**
     * Get an Ethereum JSON RPC Invalid Input (-32000) error.
     */
    invalidInput: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidInput, arg),
    /**
     * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
     */
    resourceNotFound: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.resourceNotFound, arg),
    /**
     * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
     */
    resourceUnavailable: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.resourceUnavailable, arg),
    /**
     * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
     */
    transactionRejected: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.transactionRejected, arg),
    /**
     * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
     */
    methodNotSupported: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.methodNotSupported, arg),
    /**
     * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
     */
    limitExceeded: arg => getEthJsonRpcError(error_constants_1.errorCodes.rpc.limitExceeded, arg)
  },
  provider: {
    /**
     * Get an Ethereum Provider User Rejected Request (4001) error.
     */
    userRejectedRequest: arg => {
      return getEthProviderError(error_constants_1.errorCodes.provider.userRejectedRequest, arg);
    },
    /**
     * Get an Ethereum Provider Unauthorized (4100) error.
     */
    unauthorized: arg => {
      return getEthProviderError(error_constants_1.errorCodes.provider.unauthorized, arg);
    },
    /**
     * Get an Ethereum Provider Unsupported Method (4200) error.
     */
    unsupportedMethod: arg => {
      return getEthProviderError(error_constants_1.errorCodes.provider.unsupportedMethod, arg);
    },
    /**
     * Get an Ethereum Provider Not Connected (4900) error.
     */
    disconnected: arg => {
      return getEthProviderError(error_constants_1.errorCodes.provider.disconnected, arg);
    },
    /**
     * Get an Ethereum Provider Chain Not Connected (4901) error.
     */
    chainDisconnected: arg => {
      return getEthProviderError(error_constants_1.errorCodes.provider.chainDisconnected, arg);
    },
    /**
     * Get a custom Ethereum Provider error.
     */
    custom: opts => {
      if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
        throw new Error('Ethereum Provider custom errors must provide single object argument.');
      }
      const {
        code,
        message,
        data
      } = opts;
      if (!message || typeof message !== 'string') {
        throw new Error('"message" must be a nonempty string');
      }
      return new classes_1.EthereumProviderError(code, message, data);
    }
  }
};
// Internal
function getEthJsonRpcError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new classes_1.EthereumRpcError(code, message || utils_1.getMessageFromCode(code), data);
}
function getEthProviderError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new classes_1.EthereumProviderError(code, message || utils_1.getMessageFromCode(code), data);
}
function parseOpts(arg) {
  if (arg) {
    if (typeof arg === 'string') {
      return [arg];
    } else if (typeof arg === 'object' && !Array.isArray(arg)) {
      const {
        message,
        data
      } = arg;
      if (message && typeof message !== 'string') {
        throw new Error('Must specify string message.');
      }
      return [message || undefined, data];
    }
  }
  return [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBb0U7QUFDcEUsbUNBQTZDO0FBQzdDLHVEQUErQztBQWVsQyxRQUFBLFNBQVMsR0FBRztJQUN2QixHQUFHLEVBQUU7UUFFSDs7V0FFRztRQUNILEtBQUssRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUNyRCw0QkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUMxQjtRQUVEOztXQUVHO1FBQ0gsY0FBYyxFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQzlELDRCQUFVLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQ25DO1FBRUQ7O1dBRUc7UUFDSCxhQUFhLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDN0QsNEJBQVUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FDbEM7UUFFRDs7V0FFRztRQUNILGNBQWMsRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUM5RCw0QkFBVSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUNuQztRQUVEOztXQUVHO1FBQ0gsUUFBUSxFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQ3hELDRCQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQzdCO1FBRUQ7Ozs7V0FJRztRQUNILE1BQU0sRUFBRSxDQUFJLElBQTJCLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM1RCxNQUFNLElBQUksS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7YUFDcEY7WUFDRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzdELE1BQU0sSUFBSSxLQUFLLENBQ2IsK0RBQStELENBQ2hFLENBQUM7YUFDSDtZQUNELE9BQU8sa0JBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRDs7V0FFRztRQUNILFlBQVksRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUM1RCw0QkFBVSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUNqQztRQUVEOztXQUVHO1FBQ0gsZ0JBQWdCLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDaEUsNEJBQVUsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUNyQztRQUVEOztXQUVHO1FBQ0gsbUJBQW1CLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDbkUsNEJBQVUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUN4QztRQUVEOztXQUVHO1FBQ0gsbUJBQW1CLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDbkUsNEJBQVUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUN4QztRQUVEOztXQUVHO1FBQ0gsa0JBQWtCLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDbEUsNEJBQVUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUN2QztRQUVEOztXQUVHO1FBQ0gsYUFBYSxFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQzdELDRCQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQ2xDO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFFUjs7V0FFRztRQUNILG1CQUFtQixFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFO1lBQ2hELE9BQU8sbUJBQW1CLENBQ3hCLDRCQUFVLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FDN0MsQ0FBQztRQUNKLENBQUM7UUFFRDs7V0FFRztRQUNILFlBQVksRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRTtZQUN6QyxPQUFPLG1CQUFtQixDQUN4Qiw0QkFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUN0QyxDQUFDO1FBQ0osQ0FBQztRQUVEOztXQUVHO1FBQ0gsaUJBQWlCLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUU7WUFDOUMsT0FBTyxtQkFBbUIsQ0FDeEIsNEJBQVUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUMzQyxDQUFDO1FBQ0osQ0FBQztRQUVEOztXQUVHO1FBQ0gsWUFBWSxFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFO1lBQ3pDLE9BQU8sbUJBQW1CLENBQ3hCLDRCQUFVLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQ3RDLENBQUM7UUFDSixDQUFDO1FBRUQ7O1dBRUc7UUFDSCxpQkFBaUIsRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRTtZQUM5QyxPQUFPLG1CQUFtQixDQUN4Qiw0QkFBVSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQzNDLENBQUM7UUFDSixDQUFDO1FBRUQ7O1dBRUc7UUFDSCxNQUFNLEVBQUUsQ0FBSSxJQUF1QixFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDNUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO2FBQ3pGO1lBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBRXJDLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO2dCQUMzQyxNQUFNLElBQUksS0FBSyxDQUNiLHFDQUFxQyxDQUN0QyxDQUFDO2FBQ0g7WUFDRCxPQUFPLElBQUksK0JBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsV0FBVztBQUVYLFNBQVMsa0JBQWtCLENBQUksSUFBWSxFQUFFLEdBQXFCO0lBQ2hFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sSUFBSSwwQkFBZ0IsQ0FDekIsSUFBSSxFQUNKLE9BQU8sSUFBSSwwQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFDbkMsSUFBSSxDQUNMLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBSSxJQUFZLEVBQUUsR0FBcUI7SUFDakUsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkMsT0FBTyxJQUFJLCtCQUFxQixDQUM5QixJQUFJLEVBQ0osT0FBTyxJQUFJLDBCQUFrQixDQUFDLElBQUksQ0FBQyxFQUNuQyxJQUFJLENBQ0wsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBSSxHQUFxQjtJQUN6QyxJQUFJLEdBQUcsRUFBRTtRQUNQLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNkO2FBQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3pELE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBRTlCLElBQUksT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2FBQ2pEO1lBQ0QsT0FBTyxDQUFDLE9BQU8sSUFBSSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckM7S0FDRjtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyJ9

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/index.js":
/*!***************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getMessageFromCode = exports.serializeError = exports.EthereumProviderError = exports.EthereumRpcError = exports.ethErrors = exports.errorCodes = void 0;
const classes_1 = __webpack_require__(/*! ./classes */ "./node_modules/eth-rpc-errors/dist/classes.js");
Object.defineProperty(exports, "EthereumRpcError", ({
  enumerable: true,
  get: function () {
    return classes_1.EthereumRpcError;
  }
}));
Object.defineProperty(exports, "EthereumProviderError", ({
  enumerable: true,
  get: function () {
    return classes_1.EthereumProviderError;
  }
}));
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/eth-rpc-errors/dist/utils.js");
Object.defineProperty(exports, "serializeError", ({
  enumerable: true,
  get: function () {
    return utils_1.serializeError;
  }
}));
Object.defineProperty(exports, "getMessageFromCode", ({
  enumerable: true,
  get: function () {
    return utils_1.getMessageFromCode;
  }
}));
const errors_1 = __webpack_require__(/*! ./errors */ "./node_modules/eth-rpc-errors/dist/errors.js");
Object.defineProperty(exports, "ethErrors", ({
  enumerable: true,
  get: function () {
    return errors_1.ethErrors;
  }
}));
const error_constants_1 = __webpack_require__(/*! ./error-constants */ "./node_modules/eth-rpc-errors/dist/error-constants.js");
Object.defineProperty(exports, "errorCodes", ({
  enumerable: true,
  get: function () {
    return error_constants_1.errorCodes;
  }
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQW9FO0FBVWxFLGlHQVZPLDBCQUFnQixPQVVQO0FBQ2hCLHNHQVh5QiwrQkFBcUIsT0FXekI7QUFWdkIsbUNBRWlCO0FBU2YsK0ZBVkEsc0JBQWMsT0FVQTtBQUNkLG1HQVhnQiwwQkFBa0IsT0FXaEI7QUFUcEIscUNBQXFDO0FBS25DLDBGQUxPLGtCQUFTLE9BS1A7QUFKWCx1REFBK0M7QUFHN0MsMkZBSE8sNEJBQVUsT0FHUCJ9

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/utils.js":
/*!***************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/utils.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.serializeError = exports.isValidCode = exports.getMessageFromCode = exports.JSON_RPC_SERVER_ERROR_MESSAGE = void 0;
const error_constants_1 = __webpack_require__(/*! ./error-constants */ "./node_modules/eth-rpc-errors/dist/error-constants.js");
const classes_1 = __webpack_require__(/*! ./classes */ "./node_modules/eth-rpc-errors/dist/classes.js");
const FALLBACK_ERROR_CODE = error_constants_1.errorCodes.rpc.internal;
const FALLBACK_MESSAGE = 'Unspecified error message. This is a bug, please report it.';
const FALLBACK_ERROR = {
  code: FALLBACK_ERROR_CODE,
  message: getMessageFromCode(FALLBACK_ERROR_CODE)
};
exports.JSON_RPC_SERVER_ERROR_MESSAGE = 'Unspecified server error.';
/**
 * Gets the message for a given code, or a fallback message if the code has
 * no corresponding message.
 */
function getMessageFromCode(code) {
  let fallbackMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FALLBACK_MESSAGE;
  if (Number.isInteger(code)) {
    const codeString = code.toString();
    if (hasKey(error_constants_1.errorValues, codeString)) {
      return error_constants_1.errorValues[codeString].message;
    }
    if (isJsonRpcServerError(code)) {
      return exports.JSON_RPC_SERVER_ERROR_MESSAGE;
    }
  }
  return fallbackMessage;
}
exports.getMessageFromCode = getMessageFromCode;
/**
 * Returns whether the given code is valid.
 * A code is only valid if it has a message.
 */
function isValidCode(code) {
  if (!Number.isInteger(code)) {
    return false;
  }
  const codeString = code.toString();
  if (error_constants_1.errorValues[codeString]) {
    return true;
  }
  if (isJsonRpcServerError(code)) {
    return true;
  }
  return false;
}
exports.isValidCode = isValidCode;
/**
 * Serializes the given error to an Ethereum JSON RPC-compatible error object.
 * Merely copies the given error's values if it is already compatible.
 * If the given error is not fully compatible, it will be preserved on the
 * returned object's data.originalError property.
 */
function serializeError(error) {
  let {
    fallbackError = FALLBACK_ERROR,
    shouldIncludeStack = false
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _a, _b;
  if (!fallbackError || !Number.isInteger(fallbackError.code) || typeof fallbackError.message !== 'string') {
    throw new Error('Must provide fallback error with integer number code and string message.');
  }
  if (error instanceof classes_1.EthereumRpcError) {
    return error.serialize();
  }
  const serialized = {};
  if (error && typeof error === 'object' && !Array.isArray(error) && hasKey(error, 'code') && isValidCode(error.code)) {
    const _error = error;
    serialized.code = _error.code;
    if (_error.message && typeof _error.message === 'string') {
      serialized.message = _error.message;
      if (hasKey(_error, 'data')) {
        serialized.data = _error.data;
      }
    } else {
      serialized.message = getMessageFromCode(serialized.code);
      serialized.data = {
        originalError: assignOriginalError(error)
      };
    }
  } else {
    serialized.code = fallbackError.code;
    const message = (_a = error) === null || _a === void 0 ? void 0 : _a.message;
    serialized.message = message && typeof message === 'string' ? message : fallbackError.message;
    serialized.data = {
      originalError: assignOriginalError(error)
    };
  }
  const stack = (_b = error) === null || _b === void 0 ? void 0 : _b.stack;
  if (shouldIncludeStack && error && stack && typeof stack === 'string') {
    serialized.stack = stack;
  }
  return serialized;
}
exports.serializeError = serializeError;
// Internal
function isJsonRpcServerError(code) {
  return code >= -32099 && code <= -32000;
}
function assignOriginalError(error) {
  if (error && typeof error === 'object' && !Array.isArray(error)) {
    return Object.assign({}, error);
  }
  return error;
}
function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdURBQTREO0FBQzVELHVDQUF5RTtBQUV6RSxNQUFNLG1CQUFtQixHQUFHLDRCQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNwRCxNQUFNLGdCQUFnQixHQUFHLDZEQUE2RCxDQUFDO0FBQ3ZGLE1BQU0sY0FBYyxHQUErQjtJQUNqRCxJQUFJLEVBQUUsbUJBQW1CO0lBQ3pCLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQztDQUNqRCxDQUFDO0FBRVcsUUFBQSw2QkFBNkIsR0FBRywyQkFBMkIsQ0FBQztBQUl6RTs7O0dBR0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FDaEMsSUFBWSxFQUNaLGtCQUEwQixnQkFBZ0I7SUFFMUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVuQyxJQUFJLE1BQU0sQ0FBQyw2QkFBVyxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQ25DLE9BQU8sNkJBQVcsQ0FBQyxVQUEyQixDQUFDLENBQUMsT0FBTyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixPQUFPLHFDQUE2QixDQUFDO1NBQ3RDO0tBQ0Y7SUFDRCxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDO0FBZkQsZ0RBZUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixXQUFXLENBQUMsSUFBWTtJQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25DLElBQUksNkJBQVcsQ0FBQyxVQUEyQixDQUFDLEVBQUU7UUFDNUMsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWRELGtDQWNDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixjQUFjLENBQzVCLEtBQWMsRUFDZCxFQUNFLGFBQWEsR0FBRyxjQUFjLEVBQzlCLGtCQUFrQixHQUFHLEtBQUssR0FDM0IsR0FBRyxFQUFFOztJQUdOLElBQ0UsQ0FBQyxhQUFhO1FBQ2QsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDckMsT0FBTyxhQUFhLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFDekM7UUFDQSxNQUFNLElBQUksS0FBSyxDQUNiLDBFQUEwRSxDQUMzRSxDQUFDO0tBQ0g7SUFFRCxJQUFJLEtBQUssWUFBWSwwQkFBZ0IsRUFBRTtRQUNyQyxPQUFPLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUMxQjtJQUVELE1BQU0sVUFBVSxHQUF3QyxFQUFFLENBQUM7SUFFM0QsSUFDRSxLQUFLO1FBQ0wsT0FBTyxLQUFLLEtBQUssUUFBUTtRQUN6QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxLQUFnQyxFQUFFLE1BQU0sQ0FBQztRQUNoRCxXQUFXLENBQUUsS0FBb0MsQ0FBQyxJQUFJLENBQUMsRUFDdkQ7UUFDQSxNQUFNLE1BQU0sR0FBRyxLQUE0QyxDQUFDO1FBQzVELFVBQVUsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUU5QixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUN4RCxVQUFVLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFFcEMsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUMxQixVQUFVLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDL0I7U0FDRjthQUFNO1lBQ0wsVUFBVSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FDcEMsVUFBeUMsQ0FBQyxJQUFJLENBQ2hELENBQUM7WUFFRixVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7U0FDakU7S0FDRjtTQUFNO1FBQ0wsVUFBVSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBRXJDLE1BQU0sT0FBTyxTQUFJLEtBQWEsMENBQUUsT0FBTyxDQUFDO1FBRXhDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FDbkIsT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVE7WUFDcEMsQ0FBQyxDQUFDLE9BQU87WUFDVCxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FDMUIsQ0FBQztRQUNGLFVBQVUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztLQUNqRTtJQUVELE1BQU0sS0FBSyxTQUFJLEtBQWEsMENBQUUsS0FBSyxDQUFDO0lBRXBDLElBQUksa0JBQWtCLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDckUsVUFBVSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDMUI7SUFDRCxPQUFPLFVBQXdDLENBQUM7QUFDbEQsQ0FBQztBQWxFRCx3Q0FrRUM7QUFFRCxXQUFXO0FBRVgsU0FBUyxvQkFBb0IsQ0FBQyxJQUFZO0lBQ3hDLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMxQyxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFjO0lBQ3pDLElBQUksS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDL0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNqQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLEdBQTRCLEVBQUUsR0FBVztJQUN2RCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEQsQ0FBQyJ9

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}
function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};
function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;
  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }
  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }
  return target;
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }
    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  listeners = events[type];
  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }
  return this;
};
function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};
EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;
  if (events !== undefined) {
    var evlistener = events[type];
    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) copy[i] = arr[i];
  return copy;
}
function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }
    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

/***/ }),

/***/ "./node_modules/fast-safe-stringify/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fast-safe-stringify/index.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = stringify;
stringify.default = stringify;
stringify.stable = deterministicStringify;
stringify.stableStringify = deterministicStringify;
var LIMIT_REPLACE_NODE = '[...]';
var CIRCULAR_REPLACE_NODE = '[Circular]';
var arr = [];
var replacerStack = [];
function defaultOptions() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}

// Regular stringify
function stringify(obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions();
  }
  decirc(obj, '', 0, [], undefined, 0, options);
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer);
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]');
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}
function setReplace(replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, {
        value: replace
      });
      arr.push([parent, k, val, propertyDescriptor]);
    } else {
      replacerStack.push([val, k, replace]);
    }
  } else {
    parent[k] = replace;
    arr.push([parent, k, val]);
  }
}
function decirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }
    if (typeof options.depthLimit !== 'undefined' && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    if (typeof options.edgesLimit !== 'undefined' && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    stack.push(val);
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}

// Stable-stringify
function compareFunction(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
function deterministicStringify(obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions();
  }
  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj;
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer);
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]');
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}
function deterministicDecirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return;
      }
    } catch (_) {
      return;
    }
    if (typeof options.depthLimit !== 'undefined' && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    if (typeof options.edgesLimit !== 'undefined' && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    stack.push(val);
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {};
      var keys = Object.keys(val).sort(compareFunction);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        deterministicDecirc(val[key], key, i, stack, val, depth, options);
        tmp[key] = val[key];
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val]);
        parent[k] = tmp;
      } else {
        return tmp;
      }
    }
    stack.pop();
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues(replacer) {
  replacer = typeof replacer !== 'undefined' ? replacer : function (k, v) {
    return v;
  };
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i];
        if (part[1] === key && part[0] === val) {
          val = part[2];
          replacerStack.splice(i, 1);
          break;
        }
      }
    }
    return replacer.call(this, key, val);
  };
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************!*\
  !*** ./src/content-script/pageProvider/index.ts ***!
  \**************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UnisatProvider": () => (/* binding */ UnisatProvider)
/* harmony export */ });
/* harmony import */ var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eth-rpc-errors */ "./node_modules/eth-rpc-errors/dist/index.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/shared/types */ "./src/shared/types.ts");
/* harmony import */ var _shared_utils_message_broadcastChannelMessage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/shared/utils/message/broadcastChannelMessage */ "./src/shared/utils/message/broadcastChannelMessage.ts");
/* harmony import */ var _pushEventHandlers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pushEventHandlers */ "./src/content-script/pageProvider/pushEventHandlers.ts");
/* harmony import */ var _readyPromise__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./readyPromise */ "./src/content-script/pageProvider/readyPromise.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ "./src/content-script/pageProvider/utils.ts");
// this script is injected into webpage's context







const log = function (event) {
  if (true) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    console.log(`%c [unisat] (${new Date().toTimeString().slice(0, 8)}) ${event}`, 'font-weight: 600; background-color: #7d6ef9; color: white;', ...args);
  }
};
const script = document.currentScript;
const channelName = (script === null || script === void 0 ? void 0 : script.getAttribute('channel')) || 'UNISAT';
const EXTENSION_CONTEXT_INVALIDATED_CHROMIUM_ERROR = 'Extension context invalidated.';
class UnisatProvider extends events__WEBPACK_IMPORTED_MODULE_1__.EventEmitter {
  constructor() {
    var _this;
    let {
      maxListeners = 100
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super();
    _this = this;
    this._selectedAddress = null;
    this._network = null;
    this._isConnected = false;
    this._initialized = false;
    this._isUnlocked = false;
    this._state = {
      accounts: null,
      isConnected: false,
      isUnlocked: false,
      initialized: false,
      isPermanentlyDisconnected: false
    };
    this._pushEventHandlers = void 0;
    this._requestPromise = new _readyPromise__WEBPACK_IMPORTED_MODULE_5__["default"](0);
    this._bcm = new _shared_utils_message_broadcastChannelMessage__WEBPACK_IMPORTED_MODULE_3__["default"](channelName);
    this.initialize = async () => {
      document.addEventListener('visibilitychange', this._requestPromiseCheckVisibility);
      this._bcm.connect().on('message', this._handleBackgroundMessage);
      (0,_utils__WEBPACK_IMPORTED_MODULE_6__.domReadyCall)(() => {
        var _window$top, _$, _$2, _$3;
        const origin = (_window$top = window.top) === null || _window$top === void 0 ? void 0 : _window$top.location.origin;
        const icon = ((_$ = (0,_utils__WEBPACK_IMPORTED_MODULE_6__.$)('head > link[rel~="icon"]')) === null || _$ === void 0 ? void 0 : _$.href) || ((_$2 = (0,_utils__WEBPACK_IMPORTED_MODULE_6__.$)('head > meta[itemprop="image"]')) === null || _$2 === void 0 ? void 0 : _$2.content);
        const name = document.title || ((_$3 = (0,_utils__WEBPACK_IMPORTED_MODULE_6__.$)('head > meta[name="title"]')) === null || _$3 === void 0 ? void 0 : _$3.content) || origin;
        this._bcm.request({
          method: 'tabCheckin',
          params: {
            icon,
            name,
            origin
          }
        });

        // Do not force to tabCheckin
        // this._requestPromise.check(2);
      });

      try {
        const {
          network,
          accounts,
          isUnlocked
        } = await this._request({
          method: 'getProviderState'
        });
        if (isUnlocked) {
          this._isUnlocked = true;
          this._state.isUnlocked = true;
        }
        this.emit('connect', {});
        this._pushEventHandlers.networkChanged({
          network
        });
        this._pushEventHandlers.accountsChanged(accounts);
      } catch {
        //
      } finally {
        this._initialized = true;
        this._state.initialized = true;
        this.emit('_initialized');
      }
      this.keepAlive();
    };
    /**
     * Sending a message to the extension to receive will keep the service worker alive.
     */
    this.keepAlive = () => {
      this._request({
        method: 'keepAlive',
        params: {}
      }).then(v => {
        setTimeout(() => {
          this.keepAlive();
        }, 1000);
      });
    };
    this._requestPromiseCheckVisibility = () => {
      if (document.visibilityState === 'visible') {
        this._requestPromise.check(1);
      } else {
        this._requestPromise.uncheck(1);
      }
    };
    this._handleBackgroundMessage = _ref => {
      let {
        event,
        data
      } = _ref;
      log('[push event]', event, data);
      if (this._pushEventHandlers[event]) {
        return this._pushEventHandlers[event](data);
      }
      this.emit(event, data);
    };
    // TODO: support multi request!
    // request = async (data) => {
    //   return this._request(data);
    // };
    this._request = async data => {
      if (!data) {
        throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.invalidRequest();
      }
      this._requestPromiseCheckVisibility();
      return this._requestPromise.call(() => {
        log('[request]', JSON.stringify(data, null, 2));
        return this._bcm.request(data).then(res => {
          log('[request: success]', data.method, res);
          return res;
        }).catch(err => {
          log('[request: error]', data.method, (0,eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.serializeError)(err));
          throw (0,eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.serializeError)(err);
        });
      });
    };
    // public methods
    this.requestAccounts = async () => {
      return this._request({
        method: 'requestAccounts'
      });
    };
    this.getNetwork = async () => {
      return this._request({
        method: 'getNetwork'
      });
    };
    this.switchNetwork = async network => {
      return this._request({
        method: 'switchNetwork',
        params: {
          network
        }
      });
    };
    this.getAccounts = async () => {
      return this._request({
        method: 'getAccounts'
      });
    };
    this.getPublicKey = async () => {
      return this._request({
        method: 'getPublicKey'
      });
    };
    this.getBalance = async () => {
      return this._request({
        method: 'getBalance'
      });
    };
    this.getInscriptions = async function () {
      let cursor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
      return _this._request({
        method: 'getInscriptions',
        params: {
          cursor,
          size
        }
      });
    };
    this.signMessage = async (text, type) => {
      return this._request({
        method: 'signMessage',
        params: {
          text,
          type
        }
      });
    };
    this.sendBitcoin = async (toAddress, satoshis, options) => {
      return this._request({
        method: 'sendBitcoin',
        params: {
          toAddress,
          satoshis,
          feeRate: options === null || options === void 0 ? void 0 : options.feeRate,
          type: _shared_types__WEBPACK_IMPORTED_MODULE_2__.TxType.SEND_BITCOIN
        }
      });
    };
    this.sendInscription = async (toAddress, inscriptionId, options) => {
      return this._request({
        method: 'sendInscription',
        params: {
          toAddress,
          inscriptionId,
          feeRate: options === null || options === void 0 ? void 0 : options.feeRate,
          type: _shared_types__WEBPACK_IMPORTED_MODULE_2__.TxType.SEND_INSCRIPTION
        }
      });
    };
    // signTx = async (rawtx: string) => {
    //   return this._request({
    //     method: 'signTx',
    //     params: {
    //       rawtx
    //     }
    //   });
    // };
    /**
     * push transaction
     */
    this.pushTx = async rawtx => {
      return this._request({
        method: 'pushTx',
        params: {
          rawtx
        }
      });
    };
    this.signPsbt = async (psbtHex, options) => {
      return this._request({
        method: 'signPsbt',
        params: {
          psbtHex,
          type: _shared_types__WEBPACK_IMPORTED_MODULE_2__.TxType.SIGN_TX,
          options
        }
      });
    };
    this.signPsbts = async (psbtHexs, options) => {
      return this._request({
        method: 'multiSignPsbt',
        params: {
          psbtHexs,
          options
        }
      });
    };
    this.pushPsbt = async psbtHex => {
      return this._request({
        method: 'pushPsbt',
        params: {
          psbtHex
        }
      });
    };
    this.inscribeTransfer = async (ticker, amount) => {
      return this._request({
        method: 'inscribeTransfer',
        params: {
          ticker,
          amount
        }
      });
    };
    this.setMaxListeners(maxListeners);
    this.initialize();
    this._pushEventHandlers = new _pushEventHandlers__WEBPACK_IMPORTED_MODULE_4__["default"](this);
  }
}
const provider = new UnisatProvider();
if (!window.unisat) {
  window.unisat = new Proxy(provider, {
    deleteProperty: () => true
  });
}
Object.defineProperty(window, 'unisat', {
  value: new Proxy(provider, {
    deleteProperty: () => true
  }),
  writable: false
});
window.dispatchEvent(new Event('unisat#initialized'));
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVByb3ZpZGVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBSUE7QUFHQTtBQUFBO0FBRkE7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdkRBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaURBO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQ2xFQTtBQU9BO0FBQUE7QUFOQTtBQUlBO0FBT0E7QUFDQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBaENBO0FBQ0E7QUFnQ0E7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUJBO0FBT0E7QUFQQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNBO0FBR0E7QUFIQTtBQUFBO0FBQUE7QUFLQTtBQUtBO0FBTEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXdHQTtBQUlBO0FBSkE7QUFBQTtBQUFBO0FBQUE7QUF5REE7QUFHQTtBQUhBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2pMQTtBQUVBO0FBR0E7QUFDQTtBQUFBO0FBSEE7QUFZQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUdBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQXpDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBcUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFTQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUVBOzs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDaFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQURBO0FBQUE7QUFFQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBY0E7QUFDQTtBQW9CQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFFQTtBQVVBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEzUEE7QUFDQTtBQUNBO0FBQ0E7QUF5UEE7QUFRQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3VuaXNhdC1leHRlbnNpb24vLi9zcmMvY29udGVudC1zY3JpcHQvcGFnZVByb3ZpZGVyL3B1c2hFdmVudEhhbmRsZXJzLnRzIiwid2VicGFjazovL3VuaXNhdC1leHRlbnNpb24vLi9zcmMvY29udGVudC1zY3JpcHQvcGFnZVByb3ZpZGVyL3JlYWR5UHJvbWlzZS50cyIsIndlYnBhY2s6Ly91bmlzYXQtZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQtc2NyaXB0L3BhZ2VQcm92aWRlci91dGlscy50cyIsIndlYnBhY2s6Ly91bmlzYXQtZXh0ZW5zaW9uLy4vc3JjL3NoYXJlZC90eXBlcy50cyIsIndlYnBhY2s6Ly91bmlzYXQtZXh0ZW5zaW9uLy4vc3JjL3NoYXJlZC91dGlscy9tZXNzYWdlL2Jyb2FkY2FzdENoYW5uZWxNZXNzYWdlLnRzIiwid2VicGFjazovL3VuaXNhdC1leHRlbnNpb24vLi9zcmMvc2hhcmVkL3V0aWxzL21lc3NhZ2UvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vdW5pc2F0LWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9ldGgtcnBjLWVycm9ycy9kaXN0L2NsYXNzZXMuanMiLCJ3ZWJwYWNrOi8vdW5pc2F0LWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9ldGgtcnBjLWVycm9ycy9kaXN0L2Vycm9yLWNvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly91bmlzYXQtZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL2V0aC1ycGMtZXJyb3JzL2Rpc3QvZXJyb3JzLmpzIiwid2VicGFjazovL3VuaXNhdC1leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvZXRoLXJwYy1lcnJvcnMvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly91bmlzYXQtZXh0ZW5zaW9uLy4vbm9kZV9tb2R1bGVzL2V0aC1ycGMtZXJyb3JzL2Rpc3QvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vdW5pc2F0LWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovL3VuaXNhdC1leHRlbnNpb24vLi9ub2RlX21vZHVsZXMvZmFzdC1zYWZlLXN0cmluZ2lmeS9pbmRleC5qcyIsIndlYnBhY2s6Ly91bmlzYXQtZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3VuaXNhdC1leHRlbnNpb24vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdW5pc2F0LWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdW5pc2F0LWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3VuaXNhdC1leHRlbnNpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly91bmlzYXQtZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQtc2NyaXB0L3BhZ2VQcm92aWRlci9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBldGhFcnJvcnMgfSBmcm9tICdldGgtcnBjLWVycm9ycyc7XHJcblxyXG5pbXBvcnQgeyBVbmlzYXRQcm92aWRlciB9IGZyb20gJy4vaW5kZXgnO1xyXG5cclxuY2xhc3MgUHVzaEV2ZW50SGFuZGxlcnMge1xyXG4gIHByb3ZpZGVyOiBVbmlzYXRQcm92aWRlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdmlkZXIpIHtcclxuICAgIHRoaXMucHJvdmlkZXIgPSBwcm92aWRlcjtcclxuICB9XHJcblxyXG4gIF9lbWl0KGV2ZW50LCBkYXRhKSB7XHJcbiAgICBpZiAodGhpcy5wcm92aWRlci5faW5pdGlhbGl6ZWQpIHtcclxuICAgICAgdGhpcy5wcm92aWRlci5lbWl0KGV2ZW50LCBkYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbm5lY3QgPSAoZGF0YSkgPT4ge1xyXG4gICAgaWYgKCF0aGlzLnByb3ZpZGVyLl9pc0Nvbm5lY3RlZCkge1xyXG4gICAgICB0aGlzLnByb3ZpZGVyLl9pc0Nvbm5lY3RlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMucHJvdmlkZXIuX3N0YXRlLmlzQ29ubmVjdGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5fZW1pdCgnY29ubmVjdCcsIGRhdGEpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHVubG9jayA9ICgpID0+IHtcclxuICAgIHRoaXMucHJvdmlkZXIuX2lzVW5sb2NrZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5wcm92aWRlci5fc3RhdGUuaXNVbmxvY2tlZCA9IHRydWU7XHJcbiAgfTtcclxuXHJcbiAgbG9jayA9ICgpID0+IHtcclxuICAgIHRoaXMucHJvdmlkZXIuX2lzVW5sb2NrZWQgPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBkaXNjb25uZWN0ID0gKCkgPT4ge1xyXG4gICAgdGhpcy5wcm92aWRlci5faXNDb25uZWN0ZWQgPSBmYWxzZTtcclxuICAgIHRoaXMucHJvdmlkZXIuX3N0YXRlLmlzQ29ubmVjdGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLnByb3ZpZGVyLl9zdGF0ZS5hY2NvdW50cyA9IG51bGw7XHJcbiAgICB0aGlzLnByb3ZpZGVyLl9zZWxlY3RlZEFkZHJlc3MgPSBudWxsO1xyXG4gICAgY29uc3QgZGlzY29ubmVjdEVycm9yID0gZXRoRXJyb3JzLnByb3ZpZGVyLmRpc2Nvbm5lY3RlZCgpO1xyXG5cclxuICAgIHRoaXMuX2VtaXQoJ2FjY291bnRzQ2hhbmdlZCcsIFtdKTtcclxuICAgIHRoaXMuX2VtaXQoJ2Rpc2Nvbm5lY3QnLCBkaXNjb25uZWN0RXJyb3IpO1xyXG4gICAgdGhpcy5fZW1pdCgnY2xvc2UnLCBkaXNjb25uZWN0RXJyb3IpO1xyXG4gIH07XHJcblxyXG4gIGFjY291bnRzQ2hhbmdlZCA9IChhY2NvdW50czogc3RyaW5nW10pID0+IHtcclxuICAgIGlmIChhY2NvdW50cz8uWzBdID09PSB0aGlzLnByb3ZpZGVyLl9zZWxlY3RlZEFkZHJlc3MpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJvdmlkZXIuX3NlbGVjdGVkQWRkcmVzcyA9IGFjY291bnRzPy5bMF07XHJcbiAgICB0aGlzLnByb3ZpZGVyLl9zdGF0ZS5hY2NvdW50cyA9IGFjY291bnRzO1xyXG4gICAgdGhpcy5fZW1pdCgnYWNjb3VudHNDaGFuZ2VkJywgYWNjb3VudHMpO1xyXG4gIH07XHJcblxyXG4gIG5ldHdvcmtDaGFuZ2VkID0gKHsgbmV0d29yayB9KSA9PiB7XHJcbiAgICB0aGlzLmNvbm5lY3Qoe30pO1xyXG5cclxuICAgIGlmIChuZXR3b3JrICE9PSB0aGlzLnByb3ZpZGVyLl9uZXR3b3JrKSB7XHJcbiAgICAgIHRoaXMucHJvdmlkZXIuX25ldHdvcmsgPSBuZXR3b3JrO1xyXG4gICAgICB0aGlzLl9lbWl0KCduZXR3b3JrQ2hhbmdlZCcsIG5ldHdvcmspO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFB1c2hFdmVudEhhbmRsZXJzO1xyXG4iLCJjbGFzcyBSZWFkeVByb21pc2Uge1xyXG4gIHByaXZhdGUgX2FsbENoZWNrOiBib29sZWFuW10gPSBbXTtcclxuICBwcml2YXRlIF90YXNrczoge1xyXG4gICAgcmVzb2x2ZSh2YWx1ZTogdW5rbm93bik6IHZvaWQ7XHJcbiAgICBmbigpOiBQcm9taXNlPGFueT47XHJcbiAgfVtdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNvdW50KSB7XHJcbiAgICB0aGlzLl9hbGxDaGVjayA9IFsuLi5BcnJheShjb3VudCldO1xyXG4gIH1cclxuXHJcbiAgY2hlY2sgPSAoaW5kZXgpID0+IHtcclxuICAgIHRoaXMuX2FsbENoZWNrW2luZGV4IC0gMV0gPSB0cnVlO1xyXG4gICAgdGhpcy5fcHJvY2VlZCgpO1xyXG4gIH07XHJcblxyXG4gIHVuY2hlY2sgPSAoaW5kZXgpID0+IHtcclxuICAgIHRoaXMuX2FsbENoZWNrW2luZGV4IC0gMV0gPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIF9wcm9jZWVkID0gKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuX2FsbENoZWNrLnNvbWUoKF8pID0+ICFfKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUgKHRoaXMuX3Rhc2tzLmxlbmd0aCkge1xyXG4gICAgICBjb25zdCB7IHJlc29sdmUsIGZuIH0gPSB0aGlzLl90YXNrcy5zaGlmdCgpITtcclxuICAgICAgcmVzb2x2ZShmbigpKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjYWxsID0gKGZuKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgdGhpcy5fdGFza3MucHVzaCh7XHJcbiAgICAgICAgZm4sXHJcbiAgICAgICAgcmVzb2x2ZVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuX3Byb2NlZWQoKTtcclxuICAgIH0pO1xyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlYWR5UHJvbWlzZTtcclxuIiwibGV0IHRyeUNvdW50ID0gMDtcclxuY29uc3QgY2hlY2tMb2FkZWQgPSAoY2FsbGJhY2spID0+IHtcclxuICB0cnlDb3VudCsrO1xyXG4gIGlmICh0cnlDb3VudCA+IDYwMCkge1xyXG4gICAgLy8gc29tZSBlcnJvciBoYXBwZW4/XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XHJcbiAgICBjYWxsYmFjaygpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjaGVja0xvYWRlZChjYWxsYmFjayk7XHJcbiAgICB9LCAxMDApO1xyXG4gIH1cclxufTtcclxuY29uc3QgZG9tUmVhZHlDYWxsID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgY2hlY2tMb2FkZWQoY2FsbGJhY2spO1xyXG5cclxuICAvLyBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xyXG4gIC8vICAgY2FsbGJhY2soKTtcclxuICAvLyB9IGVsc2Uge1xyXG4gIC8vICAgY29uc3QgZG9tQ29udGVudExvYWRlZEhhbmRsZXIgPSAoZSkgPT4ge1xyXG4gIC8vICAgICBjYWxsYmFjaygpO1xyXG4gIC8vICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZG9tQ29udGVudExvYWRlZEhhbmRsZXIpO1xyXG4gIC8vICAgfTtcclxuICAvLyAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBkb21Db250ZW50TG9hZGVkSGFuZGxlcik7XHJcbiAgLy8gfVxyXG59O1xyXG5cclxuY29uc3QgJCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IuYmluZChkb2N1bWVudCk7XHJcblxyXG5leHBvcnQgeyBkb21SZWFkeUNhbGwsICQgfTtcclxuIiwiaW1wb3J0IHsgQ0hBSU5TX0VOVU0gfSBmcm9tICcuL2NvbnN0YW50JztcclxuXHJcbmV4cG9ydCBlbnVtIEFkZHJlc3NUeXBlIHtcclxuICBQMlBLSCxcclxuICBQMldQS0gsXHJcbiAgUDJUUixcclxuICBQMlNIX1AyV1BLSCxcclxuICBNNDRfUDJXUEtILFxyXG4gIE00NF9QMlRSXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIE5ldHdvcmtUeXBlIHtcclxuICBNQUlOTkVULFxyXG4gIFRFU1RORVRcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmVzdG9yZVdhbGxldFR5cGUge1xyXG4gIFVOSVNBVCxcclxuICBTUEFSUk9XLFxyXG4gIFhWRVJTRSxcclxuICBPVEhFUlNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDaGFpbiB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGxvZ286IHN0cmluZztcclxuICBlbnVtOiBDSEFJTlNfRU5VTTtcclxuICBuZXR3b3JrOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQml0Y29pbkJhbGFuY2Uge1xyXG4gIGNvbmZpcm1fYW1vdW50OiBzdHJpbmc7XHJcbiAgcGVuZGluZ19hbW91bnQ6IHN0cmluZztcclxuICBhbW91bnQ6IHN0cmluZztcclxuICBjb25maXJtX2J0Y19hbW91bnQ6IHN0cmluZztcclxuICBwZW5kaW5nX2J0Y19hbW91bnQ6IHN0cmluZztcclxuICBidGNfYW1vdW50OiBzdHJpbmc7XHJcbiAgY29uZmlybV9pbnNjcmlwdGlvbl9hbW91bnQ6IHN0cmluZztcclxuICBwZW5kaW5nX2luc2NyaXB0aW9uX2Ftb3VudDogc3RyaW5nO1xyXG4gIGluc2NyaXB0aW9uX2Ftb3VudDogc3RyaW5nO1xyXG4gIHVzZF92YWx1ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFkZHJlc3NBc3NldHMge1xyXG4gIHRvdGFsX2J0Yzogc3RyaW5nO1xyXG4gIHNhdG9zaGlzPzogbnVtYmVyO1xyXG4gIHRvdGFsX2luc2NyaXB0aW9uOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHhIaXN0b3J5SXRlbSB7XHJcbiAgdHhpZDogc3RyaW5nO1xyXG4gIHRpbWU6IG51bWJlcjtcclxuICBkYXRlOiBzdHJpbmc7XHJcbiAgYW1vdW50OiBzdHJpbmc7XHJcbiAgc3ltYm9sOiBzdHJpbmc7XHJcbiAgYWRkcmVzczogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluc2NyaXB0aW9uIHtcclxuICBpbnNjcmlwdGlvbklkOiBzdHJpbmc7XHJcbiAgaW5zY3JpcHRpb25OdW1iZXI6IG51bWJlcjtcclxuICBhZGRyZXNzOiBzdHJpbmc7XHJcbiAgb3V0cHV0VmFsdWU6IG51bWJlcjtcclxuICBwcmV2aWV3OiBzdHJpbmc7XHJcbiAgY29udGVudDogc3RyaW5nO1xyXG4gIGNvbnRlbnRUeXBlOiBzdHJpbmc7XHJcbiAgY29udGVudExlbmd0aDogbnVtYmVyO1xyXG4gIHRpbWVzdGFtcDogbnVtYmVyO1xyXG4gIGdlbmVzaXNUcmFuc2FjdGlvbjogc3RyaW5nO1xyXG4gIGxvY2F0aW9uOiBzdHJpbmc7XHJcbiAgb3V0cHV0OiBzdHJpbmc7XHJcbiAgb2Zmc2V0OiBudW1iZXI7XHJcbiAgY29udGVudEJvZHk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnNjcmlwdGlvbk1pbnRlZEl0ZW0ge1xyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgZGVzYzogc3RyaW5nO1xyXG4gIGluc2NyaXB0aW9uczogSW5zY3JpcHRpb25bXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnNjcmlwdGlvblN1bW1hcnkge1xyXG4gIG1pbnRlZExpc3Q6IEluc2NyaXB0aW9uTWludGVkSXRlbVtdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFwcEluZm8ge1xyXG4gIGxvZ286IHN0cmluZztcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIGRlc2M6IHN0cmluZztcclxuICB1cmw6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBcHBTdW1tYXJ5IHtcclxuICBhcHBzOiB7XHJcbiAgICB0YWc6IHN0cmluZztcclxuICAgIGxpc3Q6IEFwcEluZm9bXTtcclxuICB9W107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRmVlU3VtbWFyeSB7XHJcbiAgbGlzdDoge1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIGRlc2M6IHN0cmluZztcclxuICAgIGZlZVJhdGU6IG51bWJlcjtcclxuICB9W107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVVRYTyB7XHJcbiAgdHhJZDogc3RyaW5nO1xyXG4gIG91dHB1dEluZGV4OiBudW1iZXI7XHJcbiAgc2F0b3NoaXM6IG51bWJlcjtcclxuICBzY3JpcHRQazogc3RyaW5nO1xyXG4gIGFkZHJlc3NUeXBlOiBBZGRyZXNzVHlwZTtcclxuICBpbnNjcmlwdGlvbnM6IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBudW06IG51bWJlcjtcclxuICAgIG9mZnNldDogbnVtYmVyO1xyXG4gIH1bXTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gVHhUeXBlIHtcclxuICBTSUdOX1RYLFxyXG4gIFNFTkRfQklUQ09JTixcclxuICBTRU5EX0lOU0NSSVBUSU9OXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG9TaWduSW5wdXQge1xyXG4gIGluZGV4OiBudW1iZXI7XHJcbiAgcHVibGljS2V5OiBzdHJpbmc7XHJcbiAgc2lnaGFzaFR5cGVzPzogbnVtYmVyW107XHJcbn1cclxuZXhwb3J0IHR5cGUgV2FsbGV0S2V5cmluZyA9IHtcclxuICBrZXk6IHN0cmluZztcclxuICBpbmRleDogbnVtYmVyO1xyXG4gIHR5cGU6IHN0cmluZztcclxuICBhZGRyZXNzVHlwZTogQWRkcmVzc1R5cGU7XHJcbiAgYWNjb3VudHM6IEFjY291bnRbXTtcclxuICBhbGlhbk5hbWU6IHN0cmluZztcclxuICBoZFBhdGg6IHN0cmluZztcclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWNjb3VudCB7XHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIHB1YmtleTogc3RyaW5nO1xyXG4gIGFkZHJlc3M6IHN0cmluZztcclxuICBicmFuZE5hbWU/OiBzdHJpbmc7XHJcbiAgYWxpYW5OYW1lPzogc3RyaW5nO1xyXG4gIGRpc3BsYXlCcmFuZE5hbWU/OiBzdHJpbmc7XHJcbiAgaW5kZXg/OiBudW1iZXI7XHJcbiAgYmFsYW5jZT86IG51bWJlcjtcclxuICBrZXk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbnNjcmliZU9yZGVyIHtcclxuICBvcmRlcklkOiBzdHJpbmc7XHJcbiAgcGF5QWRkcmVzczogc3RyaW5nO1xyXG4gIHRvdGFsRmVlOiBudW1iZXI7XHJcbiAgbWluZXJGZWU6IG51bWJlcjtcclxuICBvcmlnaW5TZXJ2aWNlRmVlOiBudW1iZXI7XHJcbiAgc2VydmljZUZlZTogbnVtYmVyO1xyXG4gIG91dHB1dFZhbHVlOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5CYWxhbmNlIHtcclxuICBhdmFpbGFibGVCYWxhbmNlOiBzdHJpbmc7XHJcbiAgb3ZlcmFsbEJhbGFuY2U6IHN0cmluZztcclxuICB0aWNrZXI6IHN0cmluZztcclxuICB0cmFuc2ZlcmFibGVCYWxhbmNlOiBzdHJpbmc7XHJcbiAgYXZhaWxhYmxlQmFsYW5jZVNhZmU6IHN0cmluZztcclxuICBhdmFpbGFibGVCYWxhbmNlVW5TYWZlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5JbmZvIHtcclxuICB0b3RhbFN1cHBseTogc3RyaW5nO1xyXG4gIHRvdGFsTWludGVkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFRva2VuSW5zY3JpcHRpb25UeXBlIHtcclxuICBJTlNDUklCRV9UUkFOU0ZFUixcclxuICBJTlNDUklCRV9NSU5UXHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBUb2tlblRyYW5zZmVyIHtcclxuICB0aWNrZXI6IHN0cmluZztcclxuICBhbW91bnQ6IHN0cmluZztcclxuICBpbnNjcmlwdGlvbklkOiBzdHJpbmc7XHJcbiAgaW5zY3JpcHRpb25OdW1iZXI6IG51bWJlcjtcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBZGRyZXNzVG9rZW5TdW1tYXJ5IHtcclxuICB0b2tlbkluZm86IFRva2VuSW5mbztcclxuICB0b2tlbkJhbGFuY2U6IFRva2VuQmFsYW5jZTtcclxuICBoaXN0b3J5TGlzdDogVG9rZW5UcmFuc2ZlcltdO1xyXG4gIHRyYW5zZmVyYWJsZUxpc3Q6IFRva2VuVHJhbnNmZXJbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEZWNvZGVkUHNidCB7XHJcbiAgaW5wdXRJbmZvczoge1xyXG4gICAgdHhpZDogc3RyaW5nO1xyXG4gICAgdm91dDogbnVtYmVyO1xyXG4gICAgYWRkcmVzczogc3RyaW5nO1xyXG4gICAgdmFsdWU6IG51bWJlcjtcclxuICAgIGluc2NyaXB0aW9uczogSW5zY3JpcHRpb25bXTtcclxuICAgIHNpZ2hhc2hUeXBlOiBudW1iZXI7XHJcbiAgfVtdO1xyXG4gIG91dHB1dEluZm9zOiB7XHJcbiAgICBhZGRyZXNzOiBzdHJpbmc7XHJcbiAgICB2YWx1ZTogbnVtYmVyO1xyXG4gICAgaW5zY3JpcHRpb25zOiBJbnNjcmlwdGlvbltdO1xyXG4gIH1bXTtcclxuICBmZWVSYXRlOiBudW1iZXI7XHJcbiAgZmVlOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG9BZGRyZXNzSW5mbyB7XHJcbiAgYWRkcmVzczogc3RyaW5nO1xyXG4gIGRvbWFpbj86IHN0cmluZztcclxuICBpbnNjcmlwdGlvbj86IEluc2NyaXB0aW9uO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJhd1R4SW5mbyB7XHJcbiAgcHNidEhleDogc3RyaW5nO1xyXG4gIHJhd3R4OiBzdHJpbmc7XHJcbiAgdG9BZGRyZXNzSW5mbz86IFRvQWRkcmVzc0luZm87XHJcbiAgZmVlPzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdhbGxldENvbmZpZyB7XHJcbiAgdmVyc2lvbjogc3RyaW5nO1xyXG4gIG1vb25QYXlFbmFibGVkOiBib29sZWFuO1xyXG4gIHN0YXR1c01lc3NhZ2U6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgTWVzc2FnZSBmcm9tICcuL2luZGV4JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyb2FkY2FzdENoYW5uZWxNZXNzYWdlIGV4dGVuZHMgTWVzc2FnZSB7XHJcbiAgcHJpdmF0ZSBfY2hhbm5lbDogQnJvYWRjYXN0Q2hhbm5lbDtcclxuXHJcbiAgY29uc3RydWN0b3IobmFtZT86IHN0cmluZykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIGlmICghbmFtZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBicm9hZGNhc3RDaGFubmVsIG5hbWUgaXMgbWlzc2luZycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2NoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbChuYW1lKTtcclxuICB9XHJcblxyXG4gIGNvbm5lY3QgPSAoKSA9PiB7XHJcbiAgICB0aGlzLl9jaGFubmVsLm9ubWVzc2FnZSA9ICh7IGRhdGE6IHsgdHlwZSwgZGF0YSB9IH0pID0+IHtcclxuICAgICAgaWYgKHR5cGUgPT09ICdtZXNzYWdlJykge1xyXG4gICAgICAgIHRoaXMuZW1pdCgnbWVzc2FnZScsIGRhdGEpO1xyXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdyZXNwb25zZScpIHtcclxuICAgICAgICB0aGlzLm9uUmVzcG9uc2UoZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgbGlzdGVuID0gKGxpc3RlbkNhbGxiYWNrKSA9PiB7XHJcbiAgICB0aGlzLmxpc3RlbkNhbGxiYWNrID0gbGlzdGVuQ2FsbGJhY2s7XHJcblxyXG4gICAgdGhpcy5fY2hhbm5lbC5vbm1lc3NhZ2UgPSAoeyBkYXRhOiB7IHR5cGUsIGRhdGEgfSB9KSA9PiB7XHJcbiAgICAgIGlmICh0eXBlID09PSAncmVxdWVzdCcpIHtcclxuICAgICAgICB0aGlzLm9uUmVxdWVzdChkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICBzZW5kID0gKHR5cGUsIGRhdGEpID0+IHtcclxuICAgIHRoaXMuX2NoYW5uZWwucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICB0eXBlLFxyXG4gICAgICBkYXRhXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBkaXNwb3NlID0gKCkgPT4ge1xyXG4gICAgdGhpcy5fZGlzcG9zZSgpO1xyXG4gICAgdGhpcy5fY2hhbm5lbC5jbG9zZSgpO1xyXG4gIH07XHJcbn1cclxuIiwiLyoqXHJcbiAqIHRoaXMgc2NyaXB0IGlzIGxpdmUgaW4gY29udGVudC1zY3JpcHQgLyBkYXBwJ3MgcGFnZVxyXG4gKi9cclxuaW1wb3J0IHsgZXRoRXJyb3JzIH0gZnJvbSAnZXRoLXJwYy1lcnJvcnMnO1xyXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgTWVzc2FnZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XHJcbiAgLy8gYXZhaWFibGUgaWQgbGlzdFxyXG4gIC8vIG1heCBjb25jdXJyZW50IHJlcXVlc3QgbGltaXRcclxuICBwcml2YXRlIF9yZXF1ZXN0SWRQb29sID0gWy4uLkFycmF5KDUwMCkua2V5cygpXTtcclxuICBwcm90ZWN0ZWQgX0VWRU5UX1BSRSA9ICdVTklTQVRfV0FMTEVUXyc7XHJcbiAgcHJvdGVjdGVkIGxpc3RlbkNhbGxiYWNrOiBhbnk7XHJcblxyXG4gIHByaXZhdGUgX3dhaXRpbmdNYXAgPSBuZXcgTWFwPFxyXG4gICAgbnVtYmVyLFxyXG4gICAge1xyXG4gICAgICBkYXRhOiBhbnk7XHJcbiAgICAgIHJlc29sdmU6IChhcmc6IGFueSkgPT4gYW55O1xyXG4gICAgICByZWplY3Q6IChhcmc6IGFueSkgPT4gYW55O1xyXG4gICAgfVxyXG4gID4oKTtcclxuXHJcbiAgYWJzdHJhY3Qgc2VuZCh0eXBlOiBzdHJpbmcsIGRhdGE6IGFueSk6IHZvaWQ7XHJcblxyXG4gIHJlcXVlc3QgPSAoZGF0YSkgPT4ge1xyXG4gICAgaWYgKCF0aGlzLl9yZXF1ZXN0SWRQb29sLmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBldGhFcnJvcnMucnBjLmxpbWl0RXhjZWVkZWQoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGlkZW50ID0gdGhpcy5fcmVxdWVzdElkUG9vbC5zaGlmdCgpITtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLl93YWl0aW5nTWFwLnNldChpZGVudCwge1xyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgcmVzb2x2ZSxcclxuICAgICAgICByZWplY3RcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB7IGlkZW50LCBkYXRhIH0pO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgb25SZXNwb25zZSA9IGFzeW5jICh7IGlkZW50LCByZXMsIGVyciB9OiBhbnkgPSB7fSkgPT4ge1xyXG4gICAgLy8gdGhlIHVybCBtYXkgdXBkYXRlXHJcbiAgICBpZiAoIXRoaXMuX3dhaXRpbmdNYXAuaGFzKGlkZW50KSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyByZXNvbHZlLCByZWplY3QgfSA9IHRoaXMuX3dhaXRpbmdNYXAuZ2V0KGlkZW50KSE7XHJcblxyXG4gICAgdGhpcy5fcmVxdWVzdElkUG9vbC5wdXNoKGlkZW50KTtcclxuICAgIHRoaXMuX3dhaXRpbmdNYXAuZGVsZXRlKGlkZW50KTtcclxuICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShyZXMpO1xyXG4gIH07XHJcblxyXG4gIG9uUmVxdWVzdCA9IGFzeW5jICh7IGlkZW50LCBkYXRhIH0pID0+IHtcclxuICAgIGlmICh0aGlzLmxpc3RlbkNhbGxiYWNrKSB7XHJcbiAgICAgIGxldCByZXMsIGVycjtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgcmVzID0gYXdhaXQgdGhpcy5saXN0ZW5DYWxsYmFjayhkYXRhKTtcclxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgICAgZXJyID0ge1xyXG4gICAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgICAgc3RhY2s6IGUuc3RhY2tcclxuICAgICAgICB9O1xyXG4gICAgICAgIGUuY29kZSAmJiAoZXJyLmNvZGUgPSBlLmNvZGUpO1xyXG4gICAgICAgIGUuZGF0YSAmJiAoZXJyLmRhdGEgPSBlLmRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNlbmQoJ3Jlc3BvbnNlJywgeyBpZGVudCwgcmVzLCBlcnIgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgX2Rpc3Bvc2UgPSAoKSA9PiB7XHJcbiAgICBmb3IgKGNvbnN0IHJlcXVlc3Qgb2YgdGhpcy5fd2FpdGluZ01hcC52YWx1ZXMoKSkge1xyXG4gICAgICByZXF1ZXN0LnJlamVjdChldGhFcnJvcnMucHJvdmlkZXIudXNlclJlamVjdGVkUmVxdWVzdCgpKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl93YWl0aW5nTWFwLmNsZWFyKCk7XHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTWVzc2FnZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLkV0aGVyZXVtUHJvdmlkZXJFcnJvciA9IGV4cG9ydHMuRXRoZXJldW1ScGNFcnJvciA9IHZvaWQgMDtcbmNvbnN0IGZhc3Rfc2FmZV9zdHJpbmdpZnlfMSA9IHJlcXVpcmUoXCJmYXN0LXNhZmUtc3RyaW5naWZ5XCIpO1xuLyoqXG4gKiBFcnJvciBzdWJjbGFzcyBpbXBsZW1lbnRpbmcgSlNPTiBSUEMgMi4wIGVycm9ycyBhbmQgRXRoZXJldW0gUlBDIGVycm9yc1xuICogcGVyIEVJUC0xNDc0LlxuICogUGVybWl0cyBhbnkgaW50ZWdlciBlcnJvciBjb2RlLlxuICovXG5jbGFzcyBFdGhlcmV1bVJwY0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcihjb2RlLCBtZXNzYWdlLCBkYXRhKSB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGNvZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiY29kZVwiIG11c3QgYmUgYW4gaW50ZWdlci4nKTtcbiAgICB9XG4gICAgaWYgKCFtZXNzYWdlIHx8IHR5cGVvZiBtZXNzYWdlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIm1lc3NhZ2VcIiBtdXN0IGJlIGEgbm9uZW1wdHkgc3RyaW5nLicpO1xuICAgIH1cbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcGxhaW4gb2JqZWN0IHdpdGggYWxsIHB1YmxpYyBjbGFzcyBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgc2VyaWFsaXplKCkge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWQgPSB7XG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2VcbiAgICB9O1xuICAgIGlmICh0aGlzLmRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc2VyaWFsaXplZC5kYXRhID0gdGhpcy5kYXRhO1xuICAgIH1cbiAgICBpZiAodGhpcy5zdGFjaykge1xuICAgICAgc2VyaWFsaXplZC5zdGFjayA9IHRoaXMuc3RhY2s7XG4gICAgfVxuICAgIHJldHVybiBzZXJpYWxpemVkO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNlcmlhbGl6ZWQgZXJyb3IsIG9taXR0aW5nXG4gICAqIGFueSBjaXJjdWxhciByZWZlcmVuY2VzLlxuICAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGZhc3Rfc2FmZV9zdHJpbmdpZnlfMS5kZWZhdWx0KHRoaXMuc2VyaWFsaXplKCksIHN0cmluZ2lmeVJlcGxhY2VyLCAyKTtcbiAgfVxufVxuZXhwb3J0cy5FdGhlcmV1bVJwY0Vycm9yID0gRXRoZXJldW1ScGNFcnJvcjtcbi8qKlxuICogRXJyb3Igc3ViY2xhc3MgaW1wbGVtZW50aW5nIEV0aGVyZXVtIFByb3ZpZGVyIGVycm9ycyBwZXIgRUlQLTExOTMuXG4gKiBQZXJtaXRzIGludGVnZXIgZXJyb3IgY29kZXMgaW4gdGhlIFsgMTAwMCA8PSA0OTk5IF0gcmFuZ2UuXG4gKi9cbmNsYXNzIEV0aGVyZXVtUHJvdmlkZXJFcnJvciBleHRlbmRzIEV0aGVyZXVtUnBjRXJyb3Ige1xuICAvKipcbiAgICogQ3JlYXRlIGFuIEV0aGVyZXVtIFByb3ZpZGVyIEpTT04tUlBDIGVycm9yLlxuICAgKiBgY29kZWAgbXVzdCBiZSBhbiBpbnRlZ2VyIGluIHRoZSAxMDAwIDw9IDQ5OTkgcmFuZ2UuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb2RlLCBtZXNzYWdlLCBkYXRhKSB7XG4gICAgaWYgKCFpc1ZhbGlkRXRoUHJvdmlkZXJDb2RlKGNvZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiY29kZVwiIG11c3QgYmUgYW4gaW50ZWdlciBzdWNoIHRoYXQ6IDEwMDAgPD0gY29kZSA8PSA0OTk5Jyk7XG4gICAgfVxuICAgIHN1cGVyKGNvZGUsIG1lc3NhZ2UsIGRhdGEpO1xuICB9XG59XG5leHBvcnRzLkV0aGVyZXVtUHJvdmlkZXJFcnJvciA9IEV0aGVyZXVtUHJvdmlkZXJFcnJvcjtcbi8vIEludGVybmFsXG5mdW5jdGlvbiBpc1ZhbGlkRXRoUHJvdmlkZXJDb2RlKGNvZGUpIHtcbiAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIoY29kZSkgJiYgY29kZSA+PSAxMDAwICYmIGNvZGUgPD0gNDk5OTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeVJlcGxhY2VyKF8sIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gJ1tDaXJjdWxhcl0nKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lZMnhoYzNObGN5NXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpJanBiSWk0dUwzTnlZeTlqYkdGemMyVnpMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3p0QlFVRkJMRFpFUVVGblJEdEJRVk5vUkRzN096dEhRVWxITzBGQlEwZ3NUVUZCWVN4blFrRkJiMElzVTBGQlVTeExRVUZMTzBsQlRUVkRMRmxCUVZrc1NVRkJXU3hGUVVGRkxFOUJRV1VzUlVGQlJTeEpRVUZSTzFGQlJXcEVMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZPMWxCUXpOQ0xFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlEySXNORUpCUVRSQ0xFTkJRemRDTEVOQlFVTTdVMEZEU0R0UlFVTkVMRWxCUVVrc1EwRkJReXhQUVVGUExFbEJRVWtzVDBGQlR5eFBRVUZQTEV0QlFVc3NVVUZCVVN4RlFVRkZPMWxCUXpORExFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlEySXNjME5CUVhORExFTkJRM1pETEVOQlFVTTdVMEZEU0R0UlFVVkVMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dFJRVU5tTEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRE8xRkJRMnBDTEVsQlFVa3NTVUZCU1N4TFFVRkxMRk5CUVZNc1JVRkJSVHRaUVVOMFFpeEpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJRenRUUVVOc1FqdEpRVU5JTEVOQlFVTTdTVUZGUkRzN1QwRkZSenRKUVVOSUxGTkJRVk03VVVGRFVDeE5RVUZOTEZWQlFWVXNSMEZCSzBJN1dVRkROME1zU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4SlFVRkpPMWxCUTJZc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFBRVUZQTzFOQlEzUkNMRU5CUVVNN1VVRkRSaXhKUVVGSkxFbEJRVWtzUTBGQlF5eEpRVUZKTEV0QlFVc3NVMEZCVXl4RlFVRkZPMWxCUXpOQ0xGVkJRVlVzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJRenRUUVVNM1FqdFJRVU5FTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSVHRaUVVOa0xGVkJRVlVzUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJRenRUUVVNdlFqdFJRVU5FTEU5QlFVOHNWVUZCVlN4RFFVRkRPMGxCUTNCQ0xFTkJRVU03U1VGRlJEczdPMDlCUjBjN1NVRkRTQ3hSUVVGUk8xRkJRMDRzVDBGQlR5dzJRa0ZCWVN4RFFVTnNRaXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVWQlEyaENMR2xDUVVGcFFpeEZRVU5xUWl4RFFVRkRMRU5CUTBZc1EwRkJRenRKUVVOS0xFTkJRVU03UTBGRFJqdEJRWFJFUkN3MFEwRnpSRU03UVVGRlJEczdPMGRCUjBjN1FVRkRTQ3hOUVVGaExIRkNRVUY1UWl4VFFVRlJMR2RDUVVGdFFqdEpRVVV2UkRzN08wOUJSMGM3U1VGRFNDeFpRVUZaTEVsQlFWa3NSVUZCUlN4UFFVRmxMRVZCUVVVc1NVRkJVVHRSUVVWcVJDeEpRVUZKTEVOQlFVTXNjMEpCUVhOQ0xFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVTdXVUZEYWtNc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGRFlpd3lSRUZCTWtRc1EwRkROVVFzUTBGQlF6dFRRVU5JTzFGQlJVUXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSU3hQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdTVUZETjBJc1EwRkJRenREUVVOR08wRkJhRUpFTEhORVFXZENRenRCUVVWRUxGZEJRVmM3UVVGRldDeFRRVUZUTEhOQ1FVRnpRaXhEUVVGRExFbEJRVms3U1VGRE1VTXNUMEZCVHl4TlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWxCUVVrc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF6dEJRVU5vUlN4RFFVRkRPMEZCUlVRc1UwRkJVeXhwUWtGQmFVSXNRMEZCUXl4RFFVRlZMRVZCUVVVc1MwRkJZenRKUVVOdVJDeEpRVUZKTEV0QlFVc3NTMEZCU3l4WlFVRlpMRVZCUVVVN1VVRkRNVUlzVDBGQlR5eFRRVUZUTEVOQlFVTTdTMEZEYkVJN1NVRkRSQ3hQUVVGUExFdEJRVXNzUTBGQlF6dEJRVU5tTEVOQlFVTWlmUT09IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmVycm9yVmFsdWVzID0gZXhwb3J0cy5lcnJvckNvZGVzID0gdm9pZCAwO1xuZXhwb3J0cy5lcnJvckNvZGVzID0ge1xuICBycGM6IHtcbiAgICBpbnZhbGlkSW5wdXQ6IC0zMjAwMCxcbiAgICByZXNvdXJjZU5vdEZvdW5kOiAtMzIwMDEsXG4gICAgcmVzb3VyY2VVbmF2YWlsYWJsZTogLTMyMDAyLFxuICAgIHRyYW5zYWN0aW9uUmVqZWN0ZWQ6IC0zMjAwMyxcbiAgICBtZXRob2ROb3RTdXBwb3J0ZWQ6IC0zMjAwNCxcbiAgICBsaW1pdEV4Y2VlZGVkOiAtMzIwMDUsXG4gICAgcGFyc2U6IC0zMjcwMCxcbiAgICBpbnZhbGlkUmVxdWVzdDogLTMyNjAwLFxuICAgIG1ldGhvZE5vdEZvdW5kOiAtMzI2MDEsXG4gICAgaW52YWxpZFBhcmFtczogLTMyNjAyLFxuICAgIGludGVybmFsOiAtMzI2MDNcbiAgfSxcbiAgcHJvdmlkZXI6IHtcbiAgICB1c2VyUmVqZWN0ZWRSZXF1ZXN0OiA0MDAxLFxuICAgIHVuYXV0aG9yaXplZDogNDEwMCxcbiAgICB1bnN1cHBvcnRlZE1ldGhvZDogNDIwMCxcbiAgICBkaXNjb25uZWN0ZWQ6IDQ5MDAsXG4gICAgY2hhaW5EaXNjb25uZWN0ZWQ6IDQ5MDFcbiAgfVxufTtcbmV4cG9ydHMuZXJyb3JWYWx1ZXMgPSB7XG4gICctMzI3MDAnOiB7XG4gICAgc3RhbmRhcmQ6ICdKU09OIFJQQyAyLjAnLFxuICAgIG1lc3NhZ2U6ICdJbnZhbGlkIEpTT04gd2FzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2ZXIuIEFuIGVycm9yIG9jY3VycmVkIG9uIHRoZSBzZXJ2ZXIgd2hpbGUgcGFyc2luZyB0aGUgSlNPTiB0ZXh0LidcbiAgfSxcbiAgJy0zMjYwMCc6IHtcbiAgICBzdGFuZGFyZDogJ0pTT04gUlBDIDIuMCcsXG4gICAgbWVzc2FnZTogJ1RoZSBKU09OIHNlbnQgaXMgbm90IGEgdmFsaWQgUmVxdWVzdCBvYmplY3QuJ1xuICB9LFxuICAnLTMyNjAxJzoge1xuICAgIHN0YW5kYXJkOiAnSlNPTiBSUEMgMi4wJyxcbiAgICBtZXNzYWdlOiAnVGhlIG1ldGhvZCBkb2VzIG5vdCBleGlzdCAvIGlzIG5vdCBhdmFpbGFibGUuJ1xuICB9LFxuICAnLTMyNjAyJzoge1xuICAgIHN0YW5kYXJkOiAnSlNPTiBSUEMgMi4wJyxcbiAgICBtZXNzYWdlOiAnSW52YWxpZCBtZXRob2QgcGFyYW1ldGVyKHMpLidcbiAgfSxcbiAgJy0zMjYwMyc6IHtcbiAgICBzdGFuZGFyZDogJ0pTT04gUlBDIDIuMCcsXG4gICAgbWVzc2FnZTogJ0ludGVybmFsIEpTT04tUlBDIGVycm9yLidcbiAgfSxcbiAgJy0zMjAwMCc6IHtcbiAgICBzdGFuZGFyZDogJ0VJUC0xNDc0JyxcbiAgICBtZXNzYWdlOiAnSW52YWxpZCBpbnB1dC4nXG4gIH0sXG4gICctMzIwMDEnOiB7XG4gICAgc3RhbmRhcmQ6ICdFSVAtMTQ3NCcsXG4gICAgbWVzc2FnZTogJ1Jlc291cmNlIG5vdCBmb3VuZC4nXG4gIH0sXG4gICctMzIwMDInOiB7XG4gICAgc3RhbmRhcmQ6ICdFSVAtMTQ3NCcsXG4gICAgbWVzc2FnZTogJ1Jlc291cmNlIHVuYXZhaWxhYmxlLidcbiAgfSxcbiAgJy0zMjAwMyc6IHtcbiAgICBzdGFuZGFyZDogJ0VJUC0xNDc0JyxcbiAgICBtZXNzYWdlOiAnVHJhbnNhY3Rpb24gcmVqZWN0ZWQuJ1xuICB9LFxuICAnLTMyMDA0Jzoge1xuICAgIHN0YW5kYXJkOiAnRUlQLTE0NzQnLFxuICAgIG1lc3NhZ2U6ICdNZXRob2Qgbm90IHN1cHBvcnRlZC4nXG4gIH0sXG4gICctMzIwMDUnOiB7XG4gICAgc3RhbmRhcmQ6ICdFSVAtMTQ3NCcsXG4gICAgbWVzc2FnZTogJ1JlcXVlc3QgbGltaXQgZXhjZWVkZWQuJ1xuICB9LFxuICAnNDAwMSc6IHtcbiAgICBzdGFuZGFyZDogJ0VJUC0xMTkzJyxcbiAgICBtZXNzYWdlOiAnVXNlciByZWplY3RlZCB0aGUgcmVxdWVzdC4nXG4gIH0sXG4gICc0MTAwJzoge1xuICAgIHN0YW5kYXJkOiAnRUlQLTExOTMnLFxuICAgIG1lc3NhZ2U6ICdUaGUgcmVxdWVzdGVkIGFjY291bnQgYW5kL29yIG1ldGhvZCBoYXMgbm90IGJlZW4gYXV0aG9yaXplZCBieSB0aGUgdXNlci4nXG4gIH0sXG4gICc0MjAwJzoge1xuICAgIHN0YW5kYXJkOiAnRUlQLTExOTMnLFxuICAgIG1lc3NhZ2U6ICdUaGUgcmVxdWVzdGVkIG1ldGhvZCBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgRXRoZXJldW0gcHJvdmlkZXIuJ1xuICB9LFxuICAnNDkwMCc6IHtcbiAgICBzdGFuZGFyZDogJ0VJUC0xMTkzJyxcbiAgICBtZXNzYWdlOiAnVGhlIHByb3ZpZGVyIGlzIGRpc2Nvbm5lY3RlZCBmcm9tIGFsbCBjaGFpbnMuJ1xuICB9LFxuICAnNDkwMSc6IHtcbiAgICBzdGFuZGFyZDogJ0VJUC0xMTkzJyxcbiAgICBtZXNzYWdlOiAnVGhlIHByb3ZpZGVyIGlzIGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBzcGVjaWZpZWQgY2hhaW4uJ1xuICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWlhKeWIzSXRZMjl1YzNSaGJuUnpMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE1pT2xzaUxpNHZjM0pqTDJWeWNtOXlMV052Ym5OMFlXNTBjeTUwY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN1FVRjFRbUVzVVVGQlFTeFZRVUZWTEVkQlFXVTdTVUZEY0VNc1IwRkJSeXhGUVVGRk8xRkJRMGdzV1VGQldTeEZRVUZGTEVOQlFVTXNTMEZCU3p0UlFVTndRaXhuUWtGQlowSXNSVUZCUlN4RFFVRkRMRXRCUVVzN1VVRkRlRUlzYlVKQlFXMUNMRVZCUVVVc1EwRkJReXhMUVVGTE8xRkJRek5DTEcxQ1FVRnRRaXhGUVVGRkxFTkJRVU1zUzBGQlN6dFJRVU16UWl4clFrRkJhMElzUlVGQlJTeERRVUZETEV0QlFVczdVVUZETVVJc1lVRkJZU3hGUVVGRkxFTkJRVU1zUzBGQlN6dFJRVU55UWl4TFFVRkxMRVZCUVVVc1EwRkJReXhMUVVGTE8xRkJRMklzWTBGQll5eEZRVUZGTEVOQlFVTXNTMEZCU3p0UlFVTjBRaXhqUVVGakxFVkJRVVVzUTBGQlF5eExRVUZMTzFGQlEzUkNMR0ZCUVdFc1JVRkJSU3hEUVVGRExFdEJRVXM3VVVGRGNrSXNVVUZCVVN4RlFVRkZMRU5CUVVNc1MwRkJTenRMUVVOcVFqdEpRVU5FTEZGQlFWRXNSVUZCUlR0UlFVTlNMRzFDUVVGdFFpeEZRVUZGTEVsQlFVazdVVUZEZWtJc1dVRkJXU3hGUVVGRkxFbEJRVWs3VVVGRGJFSXNhVUpCUVdsQ0xFVkJRVVVzU1VGQlNUdFJRVU4yUWl4WlFVRlpMRVZCUVVVc1NVRkJTVHRSUVVOc1FpeHBRa0ZCYVVJc1JVRkJSU3hKUVVGSk8wdEJRM2hDTzBOQlEwWXNRMEZCUXp0QlFVVlhMRkZCUVVFc1YwRkJWeXhIUVVGSE8wbEJRM3BDTEZGQlFWRXNSVUZCUlR0UlFVTlNMRkZCUVZFc1JVRkJSU3hqUVVGak8xRkJRM2hDTEU5QlFVOHNSVUZCUlN4MVIwRkJkVWM3UzBGRGFrZzdTVUZEUkN4UlFVRlJMRVZCUVVVN1VVRkRVaXhSUVVGUkxFVkJRVVVzWTBGQll6dFJRVU40UWl4UFFVRlBMRVZCUVVVc09FTkJRVGhETzB0QlEzaEVPMGxCUTBRc1VVRkJVU3hGUVVGRk8xRkJRMUlzVVVGQlVTeEZRVUZGTEdOQlFXTTdVVUZEZUVJc1QwRkJUeXhGUVVGRkxDdERRVUVyUXp0TFFVTjZSRHRKUVVORUxGRkJRVkVzUlVGQlJUdFJRVU5TTEZGQlFWRXNSVUZCUlN4alFVRmpPMUZCUTNoQ0xFOUJRVThzUlVGQlJTdzRRa0ZCT0VJN1MwRkRlRU03U1VGRFJDeFJRVUZSTEVWQlFVVTdVVUZEVWl4UlFVRlJMRVZCUVVVc1kwRkJZenRSUVVONFFpeFBRVUZQTEVWQlFVVXNNRUpCUVRCQ08wdEJRM0JETzBsQlEwUXNVVUZCVVN4RlFVRkZPMUZCUTFJc1VVRkJVU3hGUVVGRkxGVkJRVlU3VVVGRGNFSXNUMEZCVHl4RlFVRkZMR2RDUVVGblFqdExRVU14UWp0SlFVTkVMRkZCUVZFc1JVRkJSVHRSUVVOU0xGRkJRVkVzUlVGQlJTeFZRVUZWTzFGQlEzQkNMRTlCUVU4c1JVRkJSU3h4UWtGQmNVSTdTMEZETDBJN1NVRkRSQ3hSUVVGUkxFVkJRVVU3VVVGRFVpeFJRVUZSTEVWQlFVVXNWVUZCVlR0UlFVTndRaXhQUVVGUExFVkJRVVVzZFVKQlFYVkNPMHRCUTJwRE8wbEJRMFFzVVVGQlVTeEZRVUZGTzFGQlExSXNVVUZCVVN4RlFVRkZMRlZCUVZVN1VVRkRjRUlzVDBGQlR5eEZRVUZGTEhWQ1FVRjFRanRMUVVOcVF6dEpRVU5FTEZGQlFWRXNSVUZCUlR0UlFVTlNMRkZCUVZFc1JVRkJSU3hWUVVGVk8xRkJRM0JDTEU5QlFVOHNSVUZCUlN4MVFrRkJkVUk3UzBGRGFrTTdTVUZEUkN4UlFVRlJMRVZCUVVVN1VVRkRVaXhSUVVGUkxFVkJRVVVzVlVGQlZUdFJRVU53UWl4UFFVRlBMRVZCUVVVc2VVSkJRWGxDTzB0QlEyNURPMGxCUTBRc1RVRkJUU3hGUVVGRk8xRkJRMDRzVVVGQlVTeEZRVUZGTEZWQlFWVTdVVUZEY0VJc1QwRkJUeXhGUVVGRkxEUkNRVUUwUWp0TFFVTjBRenRKUVVORUxFMUJRVTBzUlVGQlJUdFJRVU5PTEZGQlFWRXNSVUZCUlN4VlFVRlZPMUZCUTNCQ0xFOUJRVThzUlVGQlJTd3dSVUZCTUVVN1MwRkRjRVk3U1VGRFJDeE5RVUZOTEVWQlFVVTdVVUZEVGl4UlFVRlJMRVZCUVVVc1ZVRkJWVHRSUVVOd1FpeFBRVUZQTEVWQlFVVXNhMFZCUVd0Rk8wdEJRelZGTzBsQlEwUXNUVUZCVFN4RlFVRkZPMUZCUTA0c1VVRkJVU3hGUVVGRkxGVkJRVlU3VVVGRGNFSXNUMEZCVHl4RlFVRkZMQ3REUVVFclF6dExRVU42UkR0SlFVTkVMRTFCUVUwc1JVRkJSVHRSUVVOT0xGRkJRVkVzUlVGQlJTeFZRVUZWTzFGQlEzQkNMRTlCUVU4c1JVRkJSU3gzUkVGQmQwUTdTMEZEYkVVN1EwRkRSaXhEUVVGREluMD0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZXRoRXJyb3JzID0gdm9pZCAwO1xuY29uc3QgY2xhc3Nlc18xID0gcmVxdWlyZShcIi4vY2xhc3Nlc1wiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmNvbnN0IGVycm9yX2NvbnN0YW50c18xID0gcmVxdWlyZShcIi4vZXJyb3ItY29uc3RhbnRzXCIpO1xuZXhwb3J0cy5ldGhFcnJvcnMgPSB7XG4gIHJwYzoge1xuICAgIC8qKlxuICAgICAqIEdldCBhIEpTT04gUlBDIDIuMCBQYXJzZSAoLTMyNzAwKSBlcnJvci5cbiAgICAgKi9cbiAgICBwYXJzZTogYXJnID0+IGdldEV0aEpzb25ScGNFcnJvcihlcnJvcl9jb25zdGFudHNfMS5lcnJvckNvZGVzLnJwYy5wYXJzZSwgYXJnKSxcbiAgICAvKipcbiAgICAgKiBHZXQgYSBKU09OIFJQQyAyLjAgSW52YWxpZCBSZXF1ZXN0ICgtMzI2MDApIGVycm9yLlxuICAgICAqL1xuICAgIGludmFsaWRSZXF1ZXN0OiBhcmcgPT4gZ2V0RXRoSnNvblJwY0Vycm9yKGVycm9yX2NvbnN0YW50c18xLmVycm9yQ29kZXMucnBjLmludmFsaWRSZXF1ZXN0LCBhcmcpLFxuICAgIC8qKlxuICAgICAqIEdldCBhIEpTT04gUlBDIDIuMCBJbnZhbGlkIFBhcmFtcyAoLTMyNjAyKSBlcnJvci5cbiAgICAgKi9cbiAgICBpbnZhbGlkUGFyYW1zOiBhcmcgPT4gZ2V0RXRoSnNvblJwY0Vycm9yKGVycm9yX2NvbnN0YW50c18xLmVycm9yQ29kZXMucnBjLmludmFsaWRQYXJhbXMsIGFyZyksXG4gICAgLyoqXG4gICAgICogR2V0IGEgSlNPTiBSUEMgMi4wIE1ldGhvZCBOb3QgRm91bmQgKC0zMjYwMSkgZXJyb3IuXG4gICAgICovXG4gICAgbWV0aG9kTm90Rm91bmQ6IGFyZyA9PiBnZXRFdGhKc29uUnBjRXJyb3IoZXJyb3JfY29uc3RhbnRzXzEuZXJyb3JDb2Rlcy5ycGMubWV0aG9kTm90Rm91bmQsIGFyZyksXG4gICAgLyoqXG4gICAgICogR2V0IGEgSlNPTiBSUEMgMi4wIEludGVybmFsICgtMzI2MDMpIGVycm9yLlxuICAgICAqL1xuICAgIGludGVybmFsOiBhcmcgPT4gZ2V0RXRoSnNvblJwY0Vycm9yKGVycm9yX2NvbnN0YW50c18xLmVycm9yQ29kZXMucnBjLmludGVybmFsLCBhcmcpLFxuICAgIC8qKlxuICAgICAqIEdldCBhIEpTT04gUlBDIDIuMCBTZXJ2ZXIgZXJyb3IuXG4gICAgICogUGVybWl0cyBpbnRlZ2VyIGVycm9yIGNvZGVzIGluIHRoZSBbIC0zMjA5OSA8PSAtMzIwMDUgXSByYW5nZS5cbiAgICAgKiBDb2RlcyAtMzIwMDAgdGhyb3VnaCAtMzIwMDQgYXJlIHJlc2VydmVkIGJ5IEVJUC0xNDc0LlxuICAgICAqL1xuICAgIHNlcnZlcjogb3B0cyA9PiB7XG4gICAgICBpZiAoIW9wdHMgfHwgdHlwZW9mIG9wdHMgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkob3B0cykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdGhlcmV1bSBSUEMgU2VydmVyIGVycm9ycyBtdXN0IHByb3ZpZGUgc2luZ2xlIG9iamVjdCBhcmd1bWVudC4nKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY29kZVxuICAgICAgfSA9IG9wdHM7XG4gICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoY29kZSkgfHwgY29kZSA+IC0zMjAwNSB8fCBjb2RlIDwgLTMyMDk5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJjb2RlXCIgbXVzdCBiZSBhbiBpbnRlZ2VyIHN1Y2ggdGhhdDogLTMyMDk5IDw9IGNvZGUgPD0gLTMyMDA1Jyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0RXRoSnNvblJwY0Vycm9yKGNvZGUsIG9wdHMpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2V0IGFuIEV0aGVyZXVtIEpTT04gUlBDIEludmFsaWQgSW5wdXQgKC0zMjAwMCkgZXJyb3IuXG4gICAgICovXG4gICAgaW52YWxpZElucHV0OiBhcmcgPT4gZ2V0RXRoSnNvblJwY0Vycm9yKGVycm9yX2NvbnN0YW50c18xLmVycm9yQ29kZXMucnBjLmludmFsaWRJbnB1dCwgYXJnKSxcbiAgICAvKipcbiAgICAgKiBHZXQgYW4gRXRoZXJldW0gSlNPTiBSUEMgUmVzb3VyY2UgTm90IEZvdW5kICgtMzIwMDEpIGVycm9yLlxuICAgICAqL1xuICAgIHJlc291cmNlTm90Rm91bmQ6IGFyZyA9PiBnZXRFdGhKc29uUnBjRXJyb3IoZXJyb3JfY29uc3RhbnRzXzEuZXJyb3JDb2Rlcy5ycGMucmVzb3VyY2VOb3RGb3VuZCwgYXJnKSxcbiAgICAvKipcbiAgICAgKiBHZXQgYW4gRXRoZXJldW0gSlNPTiBSUEMgUmVzb3VyY2UgVW5hdmFpbGFibGUgKC0zMjAwMikgZXJyb3IuXG4gICAgICovXG4gICAgcmVzb3VyY2VVbmF2YWlsYWJsZTogYXJnID0+IGdldEV0aEpzb25ScGNFcnJvcihlcnJvcl9jb25zdGFudHNfMS5lcnJvckNvZGVzLnJwYy5yZXNvdXJjZVVuYXZhaWxhYmxlLCBhcmcpLFxuICAgIC8qKlxuICAgICAqIEdldCBhbiBFdGhlcmV1bSBKU09OIFJQQyBUcmFuc2FjdGlvbiBSZWplY3RlZCAoLTMyMDAzKSBlcnJvci5cbiAgICAgKi9cbiAgICB0cmFuc2FjdGlvblJlamVjdGVkOiBhcmcgPT4gZ2V0RXRoSnNvblJwY0Vycm9yKGVycm9yX2NvbnN0YW50c18xLmVycm9yQ29kZXMucnBjLnRyYW5zYWN0aW9uUmVqZWN0ZWQsIGFyZyksXG4gICAgLyoqXG4gICAgICogR2V0IGFuIEV0aGVyZXVtIEpTT04gUlBDIE1ldGhvZCBOb3QgU3VwcG9ydGVkICgtMzIwMDQpIGVycm9yLlxuICAgICAqL1xuICAgIG1ldGhvZE5vdFN1cHBvcnRlZDogYXJnID0+IGdldEV0aEpzb25ScGNFcnJvcihlcnJvcl9jb25zdGFudHNfMS5lcnJvckNvZGVzLnJwYy5tZXRob2ROb3RTdXBwb3J0ZWQsIGFyZyksXG4gICAgLyoqXG4gICAgICogR2V0IGFuIEV0aGVyZXVtIEpTT04gUlBDIExpbWl0IEV4Y2VlZGVkICgtMzIwMDUpIGVycm9yLlxuICAgICAqL1xuICAgIGxpbWl0RXhjZWVkZWQ6IGFyZyA9PiBnZXRFdGhKc29uUnBjRXJyb3IoZXJyb3JfY29uc3RhbnRzXzEuZXJyb3JDb2Rlcy5ycGMubGltaXRFeGNlZWRlZCwgYXJnKVxuICB9LFxuICBwcm92aWRlcjoge1xuICAgIC8qKlxuICAgICAqIEdldCBhbiBFdGhlcmV1bSBQcm92aWRlciBVc2VyIFJlamVjdGVkIFJlcXVlc3QgKDQwMDEpIGVycm9yLlxuICAgICAqL1xuICAgIHVzZXJSZWplY3RlZFJlcXVlc3Q6IGFyZyA9PiB7XG4gICAgICByZXR1cm4gZ2V0RXRoUHJvdmlkZXJFcnJvcihlcnJvcl9jb25zdGFudHNfMS5lcnJvckNvZGVzLnByb3ZpZGVyLnVzZXJSZWplY3RlZFJlcXVlc3QsIGFyZyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXQgYW4gRXRoZXJldW0gUHJvdmlkZXIgVW5hdXRob3JpemVkICg0MTAwKSBlcnJvci5cbiAgICAgKi9cbiAgICB1bmF1dGhvcml6ZWQ6IGFyZyA9PiB7XG4gICAgICByZXR1cm4gZ2V0RXRoUHJvdmlkZXJFcnJvcihlcnJvcl9jb25zdGFudHNfMS5lcnJvckNvZGVzLnByb3ZpZGVyLnVuYXV0aG9yaXplZCwgYXJnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdldCBhbiBFdGhlcmV1bSBQcm92aWRlciBVbnN1cHBvcnRlZCBNZXRob2QgKDQyMDApIGVycm9yLlxuICAgICAqL1xuICAgIHVuc3VwcG9ydGVkTWV0aG9kOiBhcmcgPT4ge1xuICAgICAgcmV0dXJuIGdldEV0aFByb3ZpZGVyRXJyb3IoZXJyb3JfY29uc3RhbnRzXzEuZXJyb3JDb2Rlcy5wcm92aWRlci51bnN1cHBvcnRlZE1ldGhvZCwgYXJnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdldCBhbiBFdGhlcmV1bSBQcm92aWRlciBOb3QgQ29ubmVjdGVkICg0OTAwKSBlcnJvci5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0ZWQ6IGFyZyA9PiB7XG4gICAgICByZXR1cm4gZ2V0RXRoUHJvdmlkZXJFcnJvcihlcnJvcl9jb25zdGFudHNfMS5lcnJvckNvZGVzLnByb3ZpZGVyLmRpc2Nvbm5lY3RlZCwgYXJnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdldCBhbiBFdGhlcmV1bSBQcm92aWRlciBDaGFpbiBOb3QgQ29ubmVjdGVkICg0OTAxKSBlcnJvci5cbiAgICAgKi9cbiAgICBjaGFpbkRpc2Nvbm5lY3RlZDogYXJnID0+IHtcbiAgICAgIHJldHVybiBnZXRFdGhQcm92aWRlckVycm9yKGVycm9yX2NvbnN0YW50c18xLmVycm9yQ29kZXMucHJvdmlkZXIuY2hhaW5EaXNjb25uZWN0ZWQsIGFyZyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXQgYSBjdXN0b20gRXRoZXJldW0gUHJvdmlkZXIgZXJyb3IuXG4gICAgICovXG4gICAgY3VzdG9tOiBvcHRzID0+IHtcbiAgICAgIGlmICghb3B0cyB8fCB0eXBlb2Ygb3B0cyAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShvcHRzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V0aGVyZXVtIFByb3ZpZGVyIGN1c3RvbSBlcnJvcnMgbXVzdCBwcm92aWRlIHNpbmdsZSBvYmplY3QgYXJndW1lbnQuJyk7XG4gICAgICB9XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvZGUsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGRhdGFcbiAgICAgIH0gPSBvcHRzO1xuICAgICAgaWYgKCFtZXNzYWdlIHx8IHR5cGVvZiBtZXNzYWdlICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wibWVzc2FnZVwiIG11c3QgYmUgYSBub25lbXB0eSBzdHJpbmcnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgY2xhc3Nlc18xLkV0aGVyZXVtUHJvdmlkZXJFcnJvcihjb2RlLCBtZXNzYWdlLCBkYXRhKTtcbiAgICB9XG4gIH1cbn07XG4vLyBJbnRlcm5hbFxuZnVuY3Rpb24gZ2V0RXRoSnNvblJwY0Vycm9yKGNvZGUsIGFyZykge1xuICBjb25zdCBbbWVzc2FnZSwgZGF0YV0gPSBwYXJzZU9wdHMoYXJnKTtcbiAgcmV0dXJuIG5ldyBjbGFzc2VzXzEuRXRoZXJldW1ScGNFcnJvcihjb2RlLCBtZXNzYWdlIHx8IHV0aWxzXzEuZ2V0TWVzc2FnZUZyb21Db2RlKGNvZGUpLCBkYXRhKTtcbn1cbmZ1bmN0aW9uIGdldEV0aFByb3ZpZGVyRXJyb3IoY29kZSwgYXJnKSB7XG4gIGNvbnN0IFttZXNzYWdlLCBkYXRhXSA9IHBhcnNlT3B0cyhhcmcpO1xuICByZXR1cm4gbmV3IGNsYXNzZXNfMS5FdGhlcmV1bVByb3ZpZGVyRXJyb3IoY29kZSwgbWVzc2FnZSB8fCB1dGlsc18xLmdldE1lc3NhZ2VGcm9tQ29kZShjb2RlKSwgZGF0YSk7XG59XG5mdW5jdGlvbiBwYXJzZU9wdHMoYXJnKSB7XG4gIGlmIChhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBbYXJnXTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZGF0YVxuICAgICAgfSA9IGFyZztcbiAgICAgIGlmIChtZXNzYWdlICYmIHR5cGVvZiBtZXNzYWdlICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3Qgc3BlY2lmeSBzdHJpbmcgbWVzc2FnZS4nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbbWVzc2FnZSB8fCB1bmRlZmluZWQsIGRhdGFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gW107XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2laWEp5YjNKekxtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTWlPbHNpTGk0dmMzSmpMMlZ5Y205eWN5NTBjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3UVVGQlFTeDFRMEZCYjBVN1FVRkRjRVVzYlVOQlFUWkRPMEZCUXpkRExIVkVRVUVyUXp0QlFXVnNReXhSUVVGQkxGTkJRVk1zUjBGQlJ6dEpRVU4yUWl4SFFVRkhMRVZCUVVVN1VVRkZTRHM3VjBGRlJ6dFJRVU5JTEV0QlFVc3NSVUZCUlN4RFFVRkpMRWRCUVhGQ0xFVkJRVVVzUlVGQlJTeERRVUZETEd0Q1FVRnJRaXhEUVVOeVJDdzBRa0ZCVlN4RFFVRkRMRWRCUVVjc1EwRkJReXhMUVVGTExFVkJRVVVzUjBGQlJ5eERRVU14UWp0UlFVVkVPenRYUVVWSE8xRkJRMGdzWTBGQll5eEZRVUZGTEVOQlFVa3NSMEZCY1VJc1JVRkJSU3hGUVVGRkxFTkJRVU1zYTBKQlFXdENMRU5CUXpsRUxEUkNRVUZWTEVOQlFVTXNSMEZCUnl4RFFVRkRMR05CUVdNc1JVRkJSU3hIUVVGSExFTkJRMjVETzFGQlJVUTdPMWRCUlVjN1VVRkRTQ3hoUVVGaExFVkJRVVVzUTBGQlNTeEhRVUZ4UWl4RlFVRkZMRVZCUVVVc1EwRkJReXhyUWtGQmEwSXNRMEZETjBRc05FSkJRVlVzUTBGQlF5eEhRVUZITEVOQlFVTXNZVUZCWVN4RlFVRkZMRWRCUVVjc1EwRkRiRU03VVVGRlJEczdWMEZGUnp0UlFVTklMR05CUVdNc1JVRkJSU3hEUVVGSkxFZEJRWEZDTEVWQlFVVXNSVUZCUlN4RFFVRkRMR3RDUVVGclFpeERRVU01UkN3MFFrRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eGpRVUZqTEVWQlFVVXNSMEZCUnl4RFFVTnVRenRSUVVWRU96dFhRVVZITzFGQlEwZ3NVVUZCVVN4RlFVRkZMRU5CUVVrc1IwRkJjVUlzUlVGQlJTeEZRVUZGTEVOQlFVTXNhMEpCUVd0Q0xFTkJRM2hFTERSQ1FVRlZMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUlVGQlJTeEhRVUZITEVOQlF6ZENPMUZCUlVRN096czdWMEZKUnp0UlFVTklMRTFCUVUwc1JVRkJSU3hEUVVGSkxFbEJRVEpDTEVWQlFVVXNSVUZCUlR0WlFVTjZReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEpRVUZKTEU5QlFVOHNTVUZCU1N4TFFVRkxMRkZCUVZFc1NVRkJTU3hMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZPMmRDUVVNMVJDeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMR2xGUVVGcFJTeERRVUZETEVOQlFVTTdZVUZEY0VZN1dVRkRSQ3hOUVVGTkxFVkJRVVVzU1VGQlNTeEZRVUZGTEVkQlFVY3NTVUZCU1N4RFFVRkRPMWxCUTNSQ0xFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFbEJRVWtzUjBGQlJ5eERRVUZETEV0QlFVc3NTVUZCU1N4SlFVRkpMRWRCUVVjc1EwRkJReXhMUVVGTExFVkJRVVU3WjBKQlF6ZEVMRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRMklzSzBSQlFTdEVMRU5CUTJoRkxFTkJRVU03WVVGRFNEdFpRVU5FTEU5QlFVOHNhMEpCUVd0Q0xFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMUZCUTNoRExFTkJRVU03VVVGRlJEczdWMEZGUnp0UlFVTklMRmxCUVZrc1JVRkJSU3hEUVVGSkxFZEJRWEZDTEVWQlFVVXNSVUZCUlN4RFFVRkRMR3RDUVVGclFpeERRVU0xUkN3MFFrRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eFpRVUZaTEVWQlFVVXNSMEZCUnl4RFFVTnFRenRSUVVWRU96dFhRVVZITzFGQlEwZ3NaMEpCUVdkQ0xFVkJRVVVzUTBGQlNTeEhRVUZ4UWl4RlFVRkZMRVZCUVVVc1EwRkJReXhyUWtGQmEwSXNRMEZEYUVVc05FSkJRVlVzUTBGQlF5eEhRVUZITEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzUjBGQlJ5eERRVU55UXp0UlFVVkVPenRYUVVWSE8xRkJRMGdzYlVKQlFXMUNMRVZCUVVVc1EwRkJTU3hIUVVGeFFpeEZRVUZGTEVWQlFVVXNRMEZCUXl4clFrRkJhMElzUTBGRGJrVXNORUpCUVZVc1EwRkJReXhIUVVGSExFTkJRVU1zYlVKQlFXMUNMRVZCUVVVc1IwRkJSeXhEUVVONFF6dFJRVVZFT3p0WFFVVkhPMUZCUTBnc2JVSkJRVzFDTEVWQlFVVXNRMEZCU1N4SFFVRnhRaXhGUVVGRkxFVkJRVVVzUTBGQlF5eHJRa0ZCYTBJc1EwRkRia1VzTkVKQlFWVXNRMEZCUXl4SFFVRkhMRU5CUVVNc2JVSkJRVzFDTEVWQlFVVXNSMEZCUnl4RFFVTjRRenRSUVVWRU96dFhRVVZITzFGQlEwZ3NhMEpCUVd0Q0xFVkJRVVVzUTBGQlNTeEhRVUZ4UWl4RlFVRkZMRVZCUVVVc1EwRkJReXhyUWtGQmEwSXNRMEZEYkVVc05FSkJRVlVzUTBGQlF5eEhRVUZITEVOQlFVTXNhMEpCUVd0Q0xFVkJRVVVzUjBGQlJ5eERRVU4yUXp0UlFVVkVPenRYUVVWSE8xRkJRMGdzWVVGQllTeEZRVUZGTEVOQlFVa3NSMEZCY1VJc1JVRkJSU3hGUVVGRkxFTkJRVU1zYTBKQlFXdENMRU5CUXpkRUxEUkNRVUZWTEVOQlFVTXNSMEZCUnl4RFFVRkRMR0ZCUVdFc1JVRkJSU3hIUVVGSExFTkJRMnhETzB0QlEwWTdTVUZGUkN4UlFVRlJMRVZCUVVVN1VVRkZVanM3VjBGRlJ6dFJRVU5JTEcxQ1FVRnRRaXhGUVVGRkxFTkJRVWtzUjBGQmNVSXNSVUZCUlN4RlFVRkZPMWxCUTJoRUxFOUJRVThzYlVKQlFXMUNMRU5CUTNoQ0xEUkNRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEVkQlFVY3NRMEZETjBNc1EwRkJRenRSUVVOS0xFTkJRVU03VVVGRlJEczdWMEZGUnp0UlFVTklMRmxCUVZrc1JVRkJSU3hEUVVGSkxFZEJRWEZDTEVWQlFVVXNSVUZCUlR0WlFVTjZReXhQUVVGUExHMUNRVUZ0UWl4RFFVTjRRaXcwUWtGQlZTeERRVUZETEZGQlFWRXNRMEZCUXl4WlFVRlpMRVZCUVVVc1IwRkJSeXhEUVVOMFF5eERRVUZETzFGQlEwb3NRMEZCUXp0UlFVVkVPenRYUVVWSE8xRkJRMGdzYVVKQlFXbENMRVZCUVVVc1EwRkJTU3hIUVVGeFFpeEZRVUZGTEVWQlFVVTdXVUZET1VNc1QwRkJUeXh0UWtGQmJVSXNRMEZEZUVJc05FSkJRVlVzUTBGQlF5eFJRVUZSTEVOQlFVTXNhVUpCUVdsQ0xFVkJRVVVzUjBGQlJ5eERRVU16UXl4RFFVRkRPMUZCUTBvc1EwRkJRenRSUVVWRU96dFhRVVZITzFGQlEwZ3NXVUZCV1N4RlFVRkZMRU5CUVVrc1IwRkJjVUlzUlVGQlJTeEZRVUZGTzFsQlEzcERMRTlCUVU4c2JVSkJRVzFDTEVOQlEzaENMRFJDUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEZsQlFWa3NSVUZCUlN4SFFVRkhMRU5CUTNSRExFTkJRVU03VVVGRFNpeERRVUZETzFGQlJVUTdPMWRCUlVjN1VVRkRTQ3hwUWtGQmFVSXNSVUZCUlN4RFFVRkpMRWRCUVhGQ0xFVkJRVVVzUlVGQlJUdFpRVU01UXl4UFFVRlBMRzFDUVVGdFFpeERRVU40UWl3MFFrRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF5eHBRa0ZCYVVJc1JVRkJSU3hIUVVGSExFTkJRek5ETEVOQlFVTTdVVUZEU2l4RFFVRkRPMUZCUlVRN08xZEJSVWM3VVVGRFNDeE5RVUZOTEVWQlFVVXNRMEZCU1N4SlFVRjFRaXhGUVVGRkxFVkJRVVU3V1VGRGNrTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1NVRkJTU3hQUVVGUExFbEJRVWtzUzBGQlN5eFJRVUZSTEVsQlFVa3NTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJUdG5Ra0ZETlVRc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eHpSVUZCYzBVc1EwRkJReXhEUVVGRE8yRkJRM3BHTzFsQlJVUXNUVUZCVFN4RlFVRkZMRWxCUVVrc1JVRkJSU3hQUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTEVkQlFVY3NTVUZCU1N4RFFVRkRPMWxCUlhKRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVsQlFVa3NUMEZCVHl4UFFVRlBMRXRCUVVzc1VVRkJVU3hGUVVGRk8yZENRVU16UXl4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVOaUxIRkRRVUZ4UXl4RFFVTjBReXhEUVVGRE8yRkJRMGc3V1VGRFJDeFBRVUZQTEVsQlFVa3NLMEpCUVhGQ0xFTkJRVU1zU1VGQlNTeEZRVUZGTEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVONFJDeERRVUZETzB0QlEwWTdRMEZEUml4RFFVRkRPMEZCUlVZc1YwRkJWenRCUVVWWUxGTkJRVk1zYTBKQlFXdENMRU5CUVVrc1NVRkJXU3hGUVVGRkxFZEJRWEZDTzBsQlEyaEZMRTFCUVUwc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEVkQlFVY3NVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wbEJRM1pETEU5QlFVOHNTVUZCU1N3d1FrRkJaMElzUTBGRGVrSXNTVUZCU1N4RlFVTktMRTlCUVU4c1NVRkJTU3d3UWtGQmEwSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkRia01zU1VGQlNTeERRVU5NTEVOQlFVTTdRVUZEU2l4RFFVRkRPMEZCUlVRc1UwRkJVeXh0UWtGQmJVSXNRMEZCU1N4SlFVRlpMRVZCUVVVc1IwRkJjVUk3U1VGRGFrVXNUVUZCVFN4RFFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUjBGQlJ5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1NVRkRka01zVDBGQlR5eEpRVUZKTEN0Q1FVRnhRaXhEUVVNNVFpeEpRVUZKTEVWQlEwb3NUMEZCVHl4SlFVRkpMREJDUVVGclFpeERRVUZETEVsQlFVa3NRMEZCUXl4RlFVTnVReXhKUVVGSkxFTkJRMHdzUTBGQlF6dEJRVU5LTEVOQlFVTTdRVUZGUkN4VFFVRlRMRk5CUVZNc1EwRkJTU3hIUVVGeFFqdEpRVU42UXl4SlFVRkpMRWRCUVVjc1JVRkJSVHRSUVVOUUxFbEJRVWtzVDBGQlR5eEhRVUZITEV0QlFVc3NVVUZCVVN4RlFVRkZPMWxCUXpOQ0xFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0VFFVTmtPMkZCUVUwc1NVRkJTU3hQUVVGUExFZEJRVWNzUzBGQlN5eFJRVUZSTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTzFsQlEzcEVMRTFCUVUwc1JVRkJSU3hQUVVGUExFVkJRVVVzU1VGQlNTeEZRVUZGTEVkQlFVY3NSMEZCUnl4RFFVRkRPMWxCUlRsQ0xFbEJRVWtzVDBGQlR5eEpRVUZKTEU5QlFVOHNUMEZCVHl4TFFVRkxMRkZCUVZFc1JVRkJSVHRuUWtGRE1VTXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXc0UWtGQk9FSXNRMEZCUXl4RFFVRkRPMkZCUTJwRU8xbEJRMFFzVDBGQlR5eERRVUZETEU5QlFVOHNTVUZCU1N4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03VTBGRGNrTTdTMEZEUmp0SlFVTkVMRTlCUVU4c1JVRkJSU3hEUVVGRE8wRkJRMW9zUTBGQlF5SjkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZ2V0TWVzc2FnZUZyb21Db2RlID0gZXhwb3J0cy5zZXJpYWxpemVFcnJvciA9IGV4cG9ydHMuRXRoZXJldW1Qcm92aWRlckVycm9yID0gZXhwb3J0cy5FdGhlcmV1bVJwY0Vycm9yID0gZXhwb3J0cy5ldGhFcnJvcnMgPSBleHBvcnRzLmVycm9yQ29kZXMgPSB2b2lkIDA7XG5jb25zdCBjbGFzc2VzXzEgPSByZXF1aXJlKFwiLi9jbGFzc2VzXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiRXRoZXJldW1ScGNFcnJvclwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjbGFzc2VzXzEuRXRoZXJldW1ScGNFcnJvcjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJFdGhlcmV1bVByb3ZpZGVyRXJyb3JcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2xhc3Nlc18xLkV0aGVyZXVtUHJvdmlkZXJFcnJvcjtcbiAgfVxufSk7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJzZXJpYWxpemVFcnJvclwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1dGlsc18xLnNlcmlhbGl6ZUVycm9yO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImdldE1lc3NhZ2VGcm9tQ29kZVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB1dGlsc18xLmdldE1lc3NhZ2VGcm9tQ29kZTtcbiAgfVxufSk7XG5jb25zdCBlcnJvcnNfMSA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImV0aEVycm9yc1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBlcnJvcnNfMS5ldGhFcnJvcnM7XG4gIH1cbn0pO1xuY29uc3QgZXJyb3JfY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi9lcnJvci1jb25zdGFudHNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJlcnJvckNvZGVzXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGVycm9yX2NvbnN0YW50c18xLmVycm9yQ29kZXM7XG4gIH1cbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pYVc1a1pYZ3Vhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdUxpOXpjbU12YVc1a1pYZ3VkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3TzBGQlFVRXNkVU5CUVc5Rk8wRkJWV3hGTEdsSFFWWlBMREJDUVVGblFpeFBRVlZRTzBGQlEyaENMSE5IUVZoNVFpd3JRa0ZCY1VJc1QwRlhla0k3UVVGV2RrSXNiVU5CUldsQ08wRkJVMllzSzBaQlZrRXNjMEpCUVdNc1QwRlZRVHRCUVVOa0xHMUhRVmhuUWl3d1FrRkJhMElzVDBGWGFFSTdRVUZVY0VJc2NVTkJRWEZETzBGQlMyNURMREJHUVV4UExHdENRVUZUTEU5QlMxQTdRVUZLV0N4MVJFRkJLME03UVVGSE4wTXNNa1pCU0U4c05FSkJRVlVzVDBGSFVDSjkiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuc2VyaWFsaXplRXJyb3IgPSBleHBvcnRzLmlzVmFsaWRDb2RlID0gZXhwb3J0cy5nZXRNZXNzYWdlRnJvbUNvZGUgPSBleHBvcnRzLkpTT05fUlBDX1NFUlZFUl9FUlJPUl9NRVNTQUdFID0gdm9pZCAwO1xuY29uc3QgZXJyb3JfY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi9lcnJvci1jb25zdGFudHNcIik7XG5jb25zdCBjbGFzc2VzXzEgPSByZXF1aXJlKFwiLi9jbGFzc2VzXCIpO1xuY29uc3QgRkFMTEJBQ0tfRVJST1JfQ09ERSA9IGVycm9yX2NvbnN0YW50c18xLmVycm9yQ29kZXMucnBjLmludGVybmFsO1xuY29uc3QgRkFMTEJBQ0tfTUVTU0FHRSA9ICdVbnNwZWNpZmllZCBlcnJvciBtZXNzYWdlLiBUaGlzIGlzIGEgYnVnLCBwbGVhc2UgcmVwb3J0IGl0Lic7XG5jb25zdCBGQUxMQkFDS19FUlJPUiA9IHtcbiAgY29kZTogRkFMTEJBQ0tfRVJST1JfQ09ERSxcbiAgbWVzc2FnZTogZ2V0TWVzc2FnZUZyb21Db2RlKEZBTExCQUNLX0VSUk9SX0NPREUpXG59O1xuZXhwb3J0cy5KU09OX1JQQ19TRVJWRVJfRVJST1JfTUVTU0FHRSA9ICdVbnNwZWNpZmllZCBzZXJ2ZXIgZXJyb3IuJztcbi8qKlxuICogR2V0cyB0aGUgbWVzc2FnZSBmb3IgYSBnaXZlbiBjb2RlLCBvciBhIGZhbGxiYWNrIG1lc3NhZ2UgaWYgdGhlIGNvZGUgaGFzXG4gKiBubyBjb3JyZXNwb25kaW5nIG1lc3NhZ2UuXG4gKi9cbmZ1bmN0aW9uIGdldE1lc3NhZ2VGcm9tQ29kZShjb2RlKSB7XG4gIGxldCBmYWxsYmFja01lc3NhZ2UgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IEZBTExCQUNLX01FU1NBR0U7XG4gIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGNvZGUpKSB7XG4gICAgY29uc3QgY29kZVN0cmluZyA9IGNvZGUudG9TdHJpbmcoKTtcbiAgICBpZiAoaGFzS2V5KGVycm9yX2NvbnN0YW50c18xLmVycm9yVmFsdWVzLCBjb2RlU3RyaW5nKSkge1xuICAgICAgcmV0dXJuIGVycm9yX2NvbnN0YW50c18xLmVycm9yVmFsdWVzW2NvZGVTdHJpbmddLm1lc3NhZ2U7XG4gICAgfVxuICAgIGlmIChpc0pzb25ScGNTZXJ2ZXJFcnJvcihjb2RlKSkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuSlNPTl9SUENfU0VSVkVSX0VSUk9SX01FU1NBR0U7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxsYmFja01lc3NhZ2U7XG59XG5leHBvcnRzLmdldE1lc3NhZ2VGcm9tQ29kZSA9IGdldE1lc3NhZ2VGcm9tQ29kZTtcbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBjb2RlIGlzIHZhbGlkLlxuICogQSBjb2RlIGlzIG9ubHkgdmFsaWQgaWYgaXQgaGFzIGEgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gaXNWYWxpZENvZGUoY29kZSkge1xuICBpZiAoIU51bWJlci5pc0ludGVnZXIoY29kZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgY29kZVN0cmluZyA9IGNvZGUudG9TdHJpbmcoKTtcbiAgaWYgKGVycm9yX2NvbnN0YW50c18xLmVycm9yVmFsdWVzW2NvZGVTdHJpbmddKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzSnNvblJwY1NlcnZlckVycm9yKGNvZGUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0cy5pc1ZhbGlkQ29kZSA9IGlzVmFsaWRDb2RlO1xuLyoqXG4gKiBTZXJpYWxpemVzIHRoZSBnaXZlbiBlcnJvciB0byBhbiBFdGhlcmV1bSBKU09OIFJQQy1jb21wYXRpYmxlIGVycm9yIG9iamVjdC5cbiAqIE1lcmVseSBjb3BpZXMgdGhlIGdpdmVuIGVycm9yJ3MgdmFsdWVzIGlmIGl0IGlzIGFscmVhZHkgY29tcGF0aWJsZS5cbiAqIElmIHRoZSBnaXZlbiBlcnJvciBpcyBub3QgZnVsbHkgY29tcGF0aWJsZSwgaXQgd2lsbCBiZSBwcmVzZXJ2ZWQgb24gdGhlXG4gKiByZXR1cm5lZCBvYmplY3QncyBkYXRhLm9yaWdpbmFsRXJyb3IgcHJvcGVydHkuXG4gKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZUVycm9yKGVycm9yKSB7XG4gIGxldCB7XG4gICAgZmFsbGJhY2tFcnJvciA9IEZBTExCQUNLX0VSUk9SLFxuICAgIHNob3VsZEluY2x1ZGVTdGFjayA9IGZhbHNlXG4gIH0gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICB2YXIgX2EsIF9iO1xuICBpZiAoIWZhbGxiYWNrRXJyb3IgfHwgIU51bWJlci5pc0ludGVnZXIoZmFsbGJhY2tFcnJvci5jb2RlKSB8fCB0eXBlb2YgZmFsbGJhY2tFcnJvci5tZXNzYWdlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGZhbGxiYWNrIGVycm9yIHdpdGggaW50ZWdlciBudW1iZXIgY29kZSBhbmQgc3RyaW5nIG1lc3NhZ2UuJyk7XG4gIH1cbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgY2xhc3Nlc18xLkV0aGVyZXVtUnBjRXJyb3IpIHtcbiAgICByZXR1cm4gZXJyb3Iuc2VyaWFsaXplKCk7XG4gIH1cbiAgY29uc3Qgc2VyaWFsaXplZCA9IHt9O1xuICBpZiAoZXJyb3IgJiYgdHlwZW9mIGVycm9yID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShlcnJvcikgJiYgaGFzS2V5KGVycm9yLCAnY29kZScpICYmIGlzVmFsaWRDb2RlKGVycm9yLmNvZGUpKSB7XG4gICAgY29uc3QgX2Vycm9yID0gZXJyb3I7XG4gICAgc2VyaWFsaXplZC5jb2RlID0gX2Vycm9yLmNvZGU7XG4gICAgaWYgKF9lcnJvci5tZXNzYWdlICYmIHR5cGVvZiBfZXJyb3IubWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNlcmlhbGl6ZWQubWVzc2FnZSA9IF9lcnJvci5tZXNzYWdlO1xuICAgICAgaWYgKGhhc0tleShfZXJyb3IsICdkYXRhJykpIHtcbiAgICAgICAgc2VyaWFsaXplZC5kYXRhID0gX2Vycm9yLmRhdGE7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlcmlhbGl6ZWQubWVzc2FnZSA9IGdldE1lc3NhZ2VGcm9tQ29kZShzZXJpYWxpemVkLmNvZGUpO1xuICAgICAgc2VyaWFsaXplZC5kYXRhID0ge1xuICAgICAgICBvcmlnaW5hbEVycm9yOiBhc3NpZ25PcmlnaW5hbEVycm9yKGVycm9yKVxuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2VyaWFsaXplZC5jb2RlID0gZmFsbGJhY2tFcnJvci5jb2RlO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSAoX2EgPSBlcnJvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2U7XG4gICAgc2VyaWFsaXplZC5tZXNzYWdlID0gbWVzc2FnZSAmJiB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgPyBtZXNzYWdlIDogZmFsbGJhY2tFcnJvci5tZXNzYWdlO1xuICAgIHNlcmlhbGl6ZWQuZGF0YSA9IHtcbiAgICAgIG9yaWdpbmFsRXJyb3I6IGFzc2lnbk9yaWdpbmFsRXJyb3IoZXJyb3IpXG4gICAgfTtcbiAgfVxuICBjb25zdCBzdGFjayA9IChfYiA9IGVycm9yKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Iuc3RhY2s7XG4gIGlmIChzaG91bGRJbmNsdWRlU3RhY2sgJiYgZXJyb3IgJiYgc3RhY2sgJiYgdHlwZW9mIHN0YWNrID09PSAnc3RyaW5nJykge1xuICAgIHNlcmlhbGl6ZWQuc3RhY2sgPSBzdGFjaztcbiAgfVxuICByZXR1cm4gc2VyaWFsaXplZDtcbn1cbmV4cG9ydHMuc2VyaWFsaXplRXJyb3IgPSBzZXJpYWxpemVFcnJvcjtcbi8vIEludGVybmFsXG5mdW5jdGlvbiBpc0pzb25ScGNTZXJ2ZXJFcnJvcihjb2RlKSB7XG4gIHJldHVybiBjb2RlID49IC0zMjA5OSAmJiBjb2RlIDw9IC0zMjAwMDtcbn1cbmZ1bmN0aW9uIGFzc2lnbk9yaWdpbmFsRXJyb3IoZXJyb3IpIHtcbiAgaWYgKGVycm9yICYmIHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoZXJyb3IpKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGVycm9yKTtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5mdW5jdGlvbiBoYXNLZXkob2JqLCBrZXkpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkWFJwYkhNdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk5emNtTXZkWFJwYkhNdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPMEZCUVVFc2RVUkJRVFJFTzBGQlF6VkVMSFZEUVVGNVJUdEJRVVY2UlN4TlFVRk5MRzFDUVVGdFFpeEhRVUZITERSQ1FVRlZMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU53UkN4TlFVRk5MR2RDUVVGblFpeEhRVUZITERaRVFVRTJSQ3hEUVVGRE8wRkJRM1pHTEUxQlFVMHNZMEZCWXl4SFFVRXJRanRKUVVOcVJDeEpRVUZKTEVWQlFVVXNiVUpCUVcxQ08wbEJRM3BDTEU5QlFVOHNSVUZCUlN4clFrRkJhMElzUTBGQlF5eHRRa0ZCYlVJc1EwRkJRenREUVVOcVJDeERRVUZETzBGQlJWY3NVVUZCUVN3MlFrRkJOa0lzUjBGQlJ5d3lRa0ZCTWtJc1EwRkJRenRCUVVsNlJUczdPMGRCUjBjN1FVRkRTQ3hUUVVGblFpeHJRa0ZCYTBJc1EwRkRhRU1zU1VGQldTeEZRVU5hTEd0Q1FVRXdRaXhuUWtGQlowSTdTVUZGTVVNc1NVRkJTU3hOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZPMUZCUXpGQ0xFMUJRVTBzVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1EwRkJRenRSUVVWdVF5eEpRVUZKTEUxQlFVMHNRMEZCUXl3MlFrRkJWeXhGUVVGRkxGVkJRVlVzUTBGQlF5eEZRVUZGTzFsQlEyNURMRTlCUVU4c05rSkJRVmNzUTBGQlF5eFZRVUV5UWl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRE8xTkJRM3BFTzFGQlEwUXNTVUZCU1N4dlFrRkJiMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlR0WlFVTTVRaXhQUVVGUExIRkRRVUUyUWl4RFFVRkRPMU5CUTNSRE8wdEJRMFk3U1VGRFJDeFBRVUZQTEdWQlFXVXNRMEZCUXp0QlFVTjZRaXhEUVVGRE8wRkJaa1FzWjBSQlpVTTdRVUZGUkRzN08wZEJSMGM3UVVGRFNDeFRRVUZuUWl4WFFVRlhMRU5CUVVNc1NVRkJXVHRKUVVOMFF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJUdFJRVU16UWl4UFFVRlBMRXRCUVVzc1EwRkJRenRMUVVOa08wbEJSVVFzVFVGQlRTeFZRVUZWTEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1JVRkJSU3hEUVVGRE8wbEJRMjVETEVsQlFVa3NOa0pCUVZjc1EwRkJReXhWUVVFeVFpeERRVUZETEVWQlFVVTdVVUZETlVNc1QwRkJUeXhKUVVGSkxFTkJRVU03UzBGRFlqdEpRVVZFTEVsQlFVa3NiMEpCUVc5Q0xFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVTdVVUZET1VJc1QwRkJUeXhKUVVGSkxFTkJRVU03UzBGRFlqdEpRVU5FTEU5QlFVOHNTMEZCU3l4RFFVRkRPMEZCUTJZc1EwRkJRenRCUVdSRUxHdERRV05ETzBGQlJVUTdPenM3TzBkQlMwYzdRVUZEU0N4VFFVRm5RaXhqUVVGakxFTkJRelZDTEV0QlFXTXNSVUZEWkN4RlFVTkZMR0ZCUVdFc1IwRkJSeXhqUVVGakxFVkJRemxDTEd0Q1FVRnJRaXhIUVVGSExFdEJRVXNzUjBGRE0wSXNSMEZCUnl4RlFVRkZPenRKUVVkT0xFbEJRMFVzUTBGQlF5eGhRVUZoTzFGQlEyUXNRMEZCUXl4TlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExHRkJRV0VzUTBGQlF5eEpRVUZKTEVOQlFVTTdVVUZEY2tNc1QwRkJUeXhoUVVGaExFTkJRVU1zVDBGQlR5eExRVUZMTEZGQlFWRXNSVUZEZWtNN1VVRkRRU3hOUVVGTkxFbEJRVWtzUzBGQlN5eERRVU5pTERCRlFVRXdSU3hEUVVNelJTeERRVUZETzB0QlEwZzdTVUZGUkN4SlFVRkpMRXRCUVVzc1dVRkJXU3d3UWtGQlowSXNSVUZCUlR0UlFVTnlReXhQUVVGUExFdEJRVXNzUTBGQlF5eFRRVUZUTEVWQlFVVXNRMEZCUXp0TFFVTXhRanRKUVVWRUxFMUJRVTBzVlVGQlZTeEhRVUYzUXl4RlFVRkZMRU5CUVVNN1NVRkZNMFFzU1VGRFJTeExRVUZMTzFGQlEwd3NUMEZCVHl4TFFVRkxMRXRCUVVzc1VVRkJVVHRSUVVONlFpeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRE8xRkJRM0pDTEUxQlFVMHNRMEZCUXl4TFFVRm5ReXhGUVVGRkxFMUJRVTBzUTBGQlF6dFJRVU5vUkN4WFFVRlhMRU5CUVVVc1MwRkJiME1zUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZEZGtRN1VVRkRRU3hOUVVGTkxFMUJRVTBzUjBGQlJ5eExRVUUwUXl4RFFVRkRPMUZCUXpWRUxGVkJRVlVzUTBGQlF5eEpRVUZKTEVkQlFVY3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenRSUVVVNVFpeEpRVUZKTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWxCUVVrc1QwRkJUeXhOUVVGTkxFTkJRVU1zVDBGQlR5eExRVUZMTEZGQlFWRXNSVUZCUlR0WlFVTjRSQ3hWUVVGVkxFTkJRVU1zVDBGQlR5eEhRVUZITEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNN1dVRkZjRU1zU1VGQlNTeE5RVUZOTEVOQlFVTXNUVUZCVFN4RlFVRkZMRTFCUVUwc1EwRkJReXhGUVVGRk8yZENRVU14UWl4VlFVRlZMRU5CUVVNc1NVRkJTU3hIUVVGSExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdZVUZETDBJN1UwRkRSanRoUVVGTk8xbEJRMHdzVlVGQlZTeERRVUZETEU5QlFVOHNSMEZCUnl4clFrRkJhMElzUTBGRGNFTXNWVUZCZVVNc1EwRkJReXhKUVVGSkxFTkJRMmhFTEVOQlFVTTdXVUZGUml4VlFVRlZMRU5CUVVNc1NVRkJTU3hIUVVGSExFVkJRVVVzWVVGQllTeEZRVUZGTEcxQ1FVRnRRaXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTEVOQlFVTTdVMEZEYWtVN1MwRkRSanRUUVVGTk8xRkJRMHdzVlVGQlZTeERRVUZETEVsQlFVa3NSMEZCUnl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRE8xRkJSWEpETEUxQlFVMHNUMEZCVHl4VFFVRkpMRXRCUVdFc01FTkJRVVVzVDBGQlR5eERRVUZETzFGQlJYaERMRlZCUVZVc1EwRkJReXhQUVVGUExFZEJRVWNzUTBGRGJrSXNUMEZCVHl4SlFVRkpMRTlCUVU4c1QwRkJUeXhMUVVGTExGRkJRVkU3V1VGRGNFTXNRMEZCUXl4RFFVRkRMRTlCUVU4N1dVRkRWQ3hEUVVGRExFTkJRVU1zWVVGQllTeERRVUZETEU5QlFVOHNRMEZETVVJc1EwRkJRenRSUVVOR0xGVkJRVlVzUTBGQlF5eEpRVUZKTEVkQlFVY3NSVUZCUlN4aFFVRmhMRVZCUVVVc2JVSkJRVzFDTEVOQlFVTXNTMEZCU3l4RFFVRkRMRVZCUVVVc1EwRkJRenRMUVVOcVJUdEpRVVZFTEUxQlFVMHNTMEZCU3l4VFFVRkpMRXRCUVdFc01FTkJRVVVzUzBGQlN5eERRVUZETzBsQlJYQkRMRWxCUVVrc2EwSkJRV3RDTEVsQlFVa3NTMEZCU3l4SlFVRkpMRXRCUVVzc1NVRkJTU3hQUVVGUExFdEJRVXNzUzBGQlN5eFJRVUZSTEVWQlFVVTdVVUZEY2tVc1ZVRkJWU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdTMEZETVVJN1NVRkRSQ3hQUVVGUExGVkJRWGRETEVOQlFVTTdRVUZEYkVRc1EwRkJRenRCUVd4RlJDeDNRMEZyUlVNN1FVRkZSQ3hYUVVGWE8wRkJSVmdzVTBGQlV5eHZRa0ZCYjBJc1EwRkJReXhKUVVGWk8wbEJRM2hETEU5QlFVOHNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhKUVVGSkxFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXp0QlFVTXhReXhEUVVGRE8wRkJSVVFzVTBGQlV5eHRRa0ZCYlVJc1EwRkJReXhMUVVGak8wbEJRM3BETEVsQlFVa3NTMEZCU3l4SlFVRkpMRTlCUVU4c1MwRkJTeXhMUVVGTExGRkJRVkVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVVU3VVVGREwwUXNUMEZCVHl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVVzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXp0TFFVTnFRenRKUVVORUxFOUJRVThzUzBGQlN5eERRVUZETzBGQlEyWXNRMEZCUXp0QlFVVkVMRk5CUVZNc1RVRkJUU3hEUVVGRExFZEJRVFJDTEVWQlFVVXNSMEZCVnp0SlFVTjJSQ3hQUVVGUExFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVVzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEZUVRc1EwRkJReUo5IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbDtcbnZhciBSZWZsZWN0QXBwbHkgPSBSICYmIHR5cGVvZiBSLmFwcGx5ID09PSAnZnVuY3Rpb24nID8gUi5hcHBseSA6IGZ1bmN0aW9uIFJlZmxlY3RBcHBseSh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKSB7XG4gIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbn07XG52YXIgUmVmbGVjdE93bktleXM7XG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzO1xufSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gZnVuY3Rpb24gUmVmbGVjdE93bktleXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCkuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG4gIH07XG59IGVsc2Uge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB9O1xufVxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG52YXIgTnVtYmVySXNOYU4gPSBOdW1iZXIuaXNOYU4gfHwgZnVuY3Rpb24gTnVtYmVySXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn07XG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbm1vZHVsZS5leHBvcnRzLm9uY2UgPSBvbmNlO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHNDb3VudCA9IDA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5mdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgfVxufVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIChhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgfHwgYXJnIDwgMCB8fCBOdW1iZXJJc05hTihhcmcpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiZGVmYXVsdE1heExpc3RlbmVyc1wiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBhcmcgKyAnLicpO1xuICAgIH1cbiAgICBkZWZhdWx0TWF4TGlzdGVuZXJzID0gYXJnO1xuICB9XG59KTtcbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fZXZlbnRzID09PSB1bmRlZmluZWQgfHwgdGhpcy5fZXZlbnRzID09PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykuX2V2ZW50cykge1xuICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IE51bWJlcklzTmFOKG4pKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcIm5cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgbiArICcuJyk7XG4gIH1cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZnVuY3Rpb24gX2dldE1heExpc3RlbmVycyh0aGF0KSB7XG4gIGlmICh0aGF0Ll9tYXhMaXN0ZW5lcnMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICByZXR1cm4gdGhhdC5fbWF4TGlzdGVuZXJzO1xufVxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiBfZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIHZhciBkb0Vycm9yID0gdHlwZSA9PT0gJ2Vycm9yJztcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSBkb0Vycm9yID0gZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT09IHVuZGVmaW5lZDtlbHNlIGlmICghZG9FcnJvcikgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKGRvRXJyb3IpIHtcbiAgICB2YXIgZXI7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkgZXIgPSBhcmdzWzBdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tbWVudHMgb24gdGhlIGB0aHJvd2AgbGluZXMgYXJlIGludGVudGlvbmFsLCB0aGV5IHNob3dcbiAgICAgIC8vIHVwIGluIE5vZGUncyBvdXRwdXQgaWYgdGhpcyByZXN1bHRzIGluIGFuIHVuaGFuZGxlZCBleGNlcHRpb24uXG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9XG4gICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuaGFuZGxlZCBlcnJvci4nICsgKGVyID8gJyAoJyArIGVyLm1lc3NhZ2UgKyAnKScgOiAnJykpO1xuICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgdGhyb3cgZXJyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG4gIGlmIChoYW5kbGVyID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUmVmbGVjdEFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIFJlZmxlY3RBcHBseShsaXN0ZW5lcnNbaV0sIHRoaXMsIGFyZ3MpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcbmZ1bmN0aW9uIF9hZGRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCBwcmVwZW5kKSB7XG4gIHZhciBtO1xuICB2YXIgZXZlbnRzO1xuICB2YXIgZXhpc3Rpbmc7XG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIubGlzdGVuZXIgPyBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICAgICAgLy8gUmUtYXNzaWduIGBldmVudHNgIGJlY2F1c2UgYSBuZXdMaXN0ZW5lciBoYW5kbGVyIGNvdWxkIGhhdmUgY2F1c2VkIHRoZVxuICAgICAgLy8gdGhpcy5fZXZlbnRzIHRvIGJlIGFzc2lnbmVkIHRvIGEgbmV3IG9iamVjdFxuICAgICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gICAgfVxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdO1xuICB9XG4gIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICArK3RhcmdldC5fZXZlbnRzQ291bnQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIH0gZWxzZSBpZiAocHJlcGVuZCkge1xuICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgbSA9IF9nZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtcbiAgICBpZiAobSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSAmJiAhZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgLy8gTm8gZXJyb3IgY29kZSBmb3IgdGhpcyBzaW5jZSBpdCBpcyBhIFdhcm5pbmdcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgdmFyIHcgPSBuZXcgRXJyb3IoJ1Bvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJyArIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIFN0cmluZyh0eXBlKSArICcgbGlzdGVuZXJzICcgKyAnYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICcgKyAnaW5jcmVhc2UgbGltaXQnKTtcbiAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgdy5lbWl0dGVyID0gdGFyZ2V0O1xuICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICBQcm9jZXNzRW1pdFdhcm5pbmcodyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXIgPSBmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG59O1xuZnVuY3Rpb24gb25jZVdyYXBwZXIoKSB7XG4gIGlmICghdGhpcy5maXJlZCkge1xuICAgIHRoaXMudGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy53cmFwRm4pO1xuICAgIHRoaXMuZmlyZWQgPSB0cnVlO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0KTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCwgYXJndW1lbnRzKTtcbiAgfVxufVxuZnVuY3Rpb24gX29uY2VXcmFwKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHN0YXRlID0ge1xuICAgIGZpcmVkOiBmYWxzZSxcbiAgICB3cmFwRm46IHVuZGVmaW5lZCxcbiAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGxpc3RlbmVyOiBsaXN0ZW5lclxuICB9O1xuICB2YXIgd3JhcHBlZCA9IG9uY2VXcmFwcGVyLmJpbmQoc3RhdGUpO1xuICB3cmFwcGVkLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHN0YXRlLndyYXBGbiA9IHdyYXBwZWQ7XG4gIHJldHVybiB3cmFwcGVkO1xufVxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kT25jZUxpc3RlbmVyID0gZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgdGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gRW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmIGFuZCBvbmx5IGlmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgZXZlbnRzLCBwb3NpdGlvbiwgaSwgb3JpZ2luYWxMaXN0ZW5lcjtcbiAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcztcbiAgbGlzdCA9IGV2ZW50c1t0eXBlXTtcbiAgaWYgKGxpc3QgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXM7XG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fCBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO2Vsc2Uge1xuICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0Lmxpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICBwb3NpdGlvbiA9IC0xO1xuICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBvcmlnaW5hbExpc3RlbmVyID0gbGlzdFtpXS5saXN0ZW5lcjtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBvc2l0aW9uIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgaWYgKHBvc2l0aW9uID09PSAwKSBsaXN0LnNoaWZ0KCk7ZWxzZSB7XG4gICAgICBzcGxpY2VPbmUobGlzdCwgcG9zaXRpb24pO1xuICAgIH1cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIGV2ZW50c1t0eXBlXSA9IGxpc3RbMF07XG4gICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgb3JpZ2luYWxMaXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICB2YXIgbGlzdGVuZXJzLCBldmVudHMsIGk7XG4gIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRzW3R5cGVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO2Vsc2UgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV2ZW50cyk7XG4gICAgdmFyIGtleTtcbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICBmb3IgKGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuZnVuY3Rpb24gX2xpc3RlbmVycyh0YXJnZXQsIHR5cGUsIHVud3JhcCkge1xuICB2YXIgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xuICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcbiAgaWYgKGV2bGlzdGVuZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFtdO1xuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHJldHVybiB1bndyYXAgPyBbZXZsaXN0ZW5lci5saXN0ZW5lciB8fCBldmxpc3RlbmVyXSA6IFtldmxpc3RlbmVyXTtcbiAgcmV0dXJuIHVud3JhcCA/IHVud3JhcExpc3RlbmVycyhldmxpc3RlbmVyKSA6IGFycmF5Q2xvbmUoZXZsaXN0ZW5lciwgZXZsaXN0ZW5lci5sZW5ndGgpO1xufVxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCB0cnVlKTtcbn07XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycyA9IGZ1bmN0aW9uIHJhd0xpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIGZhbHNlKTtcbn07XG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uIChlbWl0dGVyLCB0eXBlKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5saXN0ZW5lckNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsIHR5cGUpO1xuICB9XG59O1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudDtcbmZ1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcbiAgICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoZXZsaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAwO1xufVxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3RPd25LZXlzKHRoaXMuX2V2ZW50cykgOiBbXTtcbn07XG5mdW5jdGlvbiBhcnJheUNsb25lKGFyciwgbikge1xuICB2YXIgY29weSA9IG5ldyBBcnJheShuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyArK2kpIGNvcHlbaV0gPSBhcnJbaV07XG4gIHJldHVybiBjb3B5O1xufVxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAoOyBpbmRleCArIDEgPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKykgbGlzdFtpbmRleF0gPSBsaXN0W2luZGV4ICsgMV07XG4gIGxpc3QucG9wKCk7XG59XG5mdW5jdGlvbiB1bndyYXBMaXN0ZW5lcnMoYXJyKSB7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgKytpKSB7XG4gICAgcmV0W2ldID0gYXJyW2ldLmxpc3RlbmVyIHx8IGFycltpXTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuZnVuY3Rpb24gb25jZShlbWl0dGVyLCBuYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lcihlcnIpIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobmFtZSwgcmVzb2x2ZXIpO1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlc29sdmVyKCkge1xuICAgICAgaWYgKHR5cGVvZiBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICByZXNvbHZlKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgfVxuICAgIDtcbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgbmFtZSwgcmVzb2x2ZXIsIHtcbiAgICAgIG9uY2U6IHRydWVcbiAgICB9KTtcbiAgICBpZiAobmFtZSAhPT0gJ2Vycm9yJykge1xuICAgICAgYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgZXJyb3JMaXN0ZW5lciwge1xuICAgICAgICBvbmNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgaGFuZGxlciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsICdlcnJvcicsIGhhbmRsZXIsIGZsYWdzKTtcbiAgfVxufVxuZnVuY3Rpb24gZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIGxpc3RlbmVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgZW1pdHRlci5vbmNlKG5hbWUsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW1pdHRlci5vbihuYW1lLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFdmVudFRhcmdldCBkb2VzIG5vdCBoYXZlIGBlcnJvcmAgZXZlbnQgc2VtYW50aWNzIGxpa2UgTm9kZVxuICAgIC8vIEV2ZW50RW1pdHRlcnMsIHdlIGRvIG5vdCBsaXN0ZW4gZm9yIGBlcnJvcmAgZXZlbnRzIGhlcmUuXG4gICAgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZ1bmN0aW9uIHdyYXBMaXN0ZW5lcihhcmcpIHtcbiAgICAgIC8vIElFIGRvZXMgbm90IGhhdmUgYnVpbHRpbiBgeyBvbmNlOiB0cnVlIH1gIHN1cHBvcnQgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gZG8gaXQgbWFudWFsbHkuXG4gICAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgd3JhcExpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIGxpc3RlbmVyKGFyZyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiZW1pdHRlclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBFdmVudEVtaXR0ZXIuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBlbWl0dGVyKTtcbiAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gc3RyaW5naWZ5O1xuc3RyaW5naWZ5LmRlZmF1bHQgPSBzdHJpbmdpZnk7XG5zdHJpbmdpZnkuc3RhYmxlID0gZGV0ZXJtaW5pc3RpY1N0cmluZ2lmeTtcbnN0cmluZ2lmeS5zdGFibGVTdHJpbmdpZnkgPSBkZXRlcm1pbmlzdGljU3RyaW5naWZ5O1xudmFyIExJTUlUX1JFUExBQ0VfTk9ERSA9ICdbLi4uXSc7XG52YXIgQ0lSQ1VMQVJfUkVQTEFDRV9OT0RFID0gJ1tDaXJjdWxhcl0nO1xudmFyIGFyciA9IFtdO1xudmFyIHJlcGxhY2VyU3RhY2sgPSBbXTtcbmZ1bmN0aW9uIGRlZmF1bHRPcHRpb25zKCkge1xuICByZXR1cm4ge1xuICAgIGRlcHRoTGltaXQ6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGVkZ2VzTGltaXQ6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gIH07XG59XG5cbi8vIFJlZ3VsYXIgc3RyaW5naWZ5XG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCByZXBsYWNlciwgc3BhY2VyLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnMoKTtcbiAgfVxuICBkZWNpcmMob2JqLCAnJywgMCwgW10sIHVuZGVmaW5lZCwgMCwgb3B0aW9ucyk7XG4gIHZhciByZXM7XG4gIHRyeSB7XG4gICAgaWYgKHJlcGxhY2VyU3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICByZXMgPSBKU09OLnN0cmluZ2lmeShvYmosIHJlcGxhY2VyLCBzcGFjZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMgPSBKU09OLnN0cmluZ2lmeShvYmosIHJlcGxhY2VHZXR0ZXJWYWx1ZXMocmVwbGFjZXIpLCBzcGFjZXIpO1xuICAgIH1cbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSgnW3VuYWJsZSB0byBzZXJpYWxpemUsIGNpcmN1bGFyIHJlZmVyZW5jZSBpcyB0b28gY29tcGxleCB0byBhbmFseXplXScpO1xuICB9IGZpbmFsbHkge1xuICAgIHdoaWxlIChhcnIubGVuZ3RoICE9PSAwKSB7XG4gICAgICB2YXIgcGFydCA9IGFyci5wb3AoKTtcbiAgICAgIGlmIChwYXJ0Lmxlbmd0aCA9PT0gNCkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocGFydFswXSwgcGFydFsxXSwgcGFydFszXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0WzBdW3BhcnRbMV1dID0gcGFydFsyXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cbmZ1bmN0aW9uIHNldFJlcGxhY2UocmVwbGFjZSwgdmFsLCBrLCBwYXJlbnQpIHtcbiAgdmFyIHByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocGFyZW50LCBrKTtcbiAgaWYgKHByb3BlcnR5RGVzY3JpcHRvci5nZXQgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChwcm9wZXJ0eURlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocGFyZW50LCBrLCB7XG4gICAgICAgIHZhbHVlOiByZXBsYWNlXG4gICAgICB9KTtcbiAgICAgIGFyci5wdXNoKFtwYXJlbnQsIGssIHZhbCwgcHJvcGVydHlEZXNjcmlwdG9yXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGxhY2VyU3RhY2sucHVzaChbdmFsLCBrLCByZXBsYWNlXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBhcmVudFtrXSA9IHJlcGxhY2U7XG4gICAgYXJyLnB1c2goW3BhcmVudCwgaywgdmFsXSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGRlY2lyYyh2YWwsIGssIGVkZ2VJbmRleCwgc3RhY2ssIHBhcmVudCwgZGVwdGgsIG9wdGlvbnMpIHtcbiAgZGVwdGggKz0gMTtcbiAgdmFyIGk7XG4gIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiB2YWwgIT09IG51bGwpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzdGFja1tpXSA9PT0gdmFsKSB7XG4gICAgICAgIHNldFJlcGxhY2UoQ0lSQ1VMQVJfUkVQTEFDRV9OT0RFLCB2YWwsIGssIHBhcmVudCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmRlcHRoTGltaXQgIT09ICd1bmRlZmluZWQnICYmIGRlcHRoID4gb3B0aW9ucy5kZXB0aExpbWl0KSB7XG4gICAgICBzZXRSZXBsYWNlKExJTUlUX1JFUExBQ0VfTk9ERSwgdmFsLCBrLCBwYXJlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZWRnZXNMaW1pdCAhPT0gJ3VuZGVmaW5lZCcgJiYgZWRnZUluZGV4ICsgMSA+IG9wdGlvbnMuZWRnZXNMaW1pdCkge1xuICAgICAgc2V0UmVwbGFjZShMSU1JVF9SRVBMQUNFX05PREUsIHZhbCwgaywgcGFyZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3RhY2sucHVzaCh2YWwpO1xuICAgIC8vIE9wdGltaXplIGZvciBBcnJheXMuIEJpZyBhcnJheXMgY291bGQga2lsbCB0aGUgcGVyZm9ybWFuY2Ugb3RoZXJ3aXNlIVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGVjaXJjKHZhbFtpXSwgaSwgaSwgc3RhY2ssIHZhbCwgZGVwdGgsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbCk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgZGVjaXJjKHZhbFtrZXldLCBrZXksIGksIHN0YWNrLCB2YWwsIGRlcHRoLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3RhY2sucG9wKCk7XG4gIH1cbn1cblxuLy8gU3RhYmxlLXN0cmluZ2lmeVxuZnVuY3Rpb24gY29tcGFyZUZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmIChhID4gYikge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuZnVuY3Rpb24gZGV0ZXJtaW5pc3RpY1N0cmluZ2lmeShvYmosIHJlcGxhY2VyLCBzcGFjZXIsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucygpO1xuICB9XG4gIHZhciB0bXAgPSBkZXRlcm1pbmlzdGljRGVjaXJjKG9iaiwgJycsIDAsIFtdLCB1bmRlZmluZWQsIDAsIG9wdGlvbnMpIHx8IG9iajtcbiAgdmFyIHJlcztcbiAgdHJ5IHtcbiAgICBpZiAocmVwbGFjZXJTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgIHJlcyA9IEpTT04uc3RyaW5naWZ5KHRtcCwgcmVwbGFjZXIsIHNwYWNlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcyA9IEpTT04uc3RyaW5naWZ5KHRtcCwgcmVwbGFjZUdldHRlclZhbHVlcyhyZXBsYWNlciksIHNwYWNlcik7XG4gICAgfVxuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KCdbdW5hYmxlIHRvIHNlcmlhbGl6ZSwgY2lyY3VsYXIgcmVmZXJlbmNlIGlzIHRvbyBjb21wbGV4IHRvIGFuYWx5emVdJyk7XG4gIH0gZmluYWxseSB7XG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgcmVzdG9yZSB0aGUgb2JqZWN0IGFzIGl0IHdhcy5cbiAgICB3aGlsZSAoYXJyLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdmFyIHBhcnQgPSBhcnIucG9wKCk7XG4gICAgICBpZiAocGFydC5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHBhcnRbMF0sIHBhcnRbMV0sIHBhcnRbM10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydFswXVtwYXJ0WzFdXSA9IHBhcnRbMl07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiBkZXRlcm1pbmlzdGljRGVjaXJjKHZhbCwgaywgZWRnZUluZGV4LCBzdGFjaywgcGFyZW50LCBkZXB0aCwgb3B0aW9ucykge1xuICBkZXB0aCArPSAxO1xuICB2YXIgaTtcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmIHZhbCAhPT0gbnVsbCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHN0YWNrW2ldID09PSB2YWwpIHtcbiAgICAgICAgc2V0UmVwbGFjZShDSVJDVUxBUl9SRVBMQUNFX05PREUsIHZhbCwgaywgcGFyZW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYgKHR5cGVvZiB2YWwudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kZXB0aExpbWl0ICE9PSAndW5kZWZpbmVkJyAmJiBkZXB0aCA+IG9wdGlvbnMuZGVwdGhMaW1pdCkge1xuICAgICAgc2V0UmVwbGFjZShMSU1JVF9SRVBMQUNFX05PREUsIHZhbCwgaywgcGFyZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmVkZ2VzTGltaXQgIT09ICd1bmRlZmluZWQnICYmIGVkZ2VJbmRleCArIDEgPiBvcHRpb25zLmVkZ2VzTGltaXQpIHtcbiAgICAgIHNldFJlcGxhY2UoTElNSVRfUkVQTEFDRV9OT0RFLCB2YWwsIGssIHBhcmVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0YWNrLnB1c2godmFsKTtcbiAgICAvLyBPcHRpbWl6ZSBmb3IgQXJyYXlzLiBCaWcgYXJyYXlzIGNvdWxkIGtpbGwgdGhlIHBlcmZvcm1hbmNlIG90aGVyd2lzZSFcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRldGVybWluaXN0aWNEZWNpcmModmFsW2ldLCBpLCBpLCBzdGFjaywgdmFsLCBkZXB0aCwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENyZWF0ZSBhIHRlbXBvcmFyeSBvYmplY3QgaW4gdGhlIHJlcXVpcmVkIHdheVxuICAgICAgdmFyIHRtcCA9IHt9O1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWwpLnNvcnQoY29tcGFyZUZ1bmN0aW9uKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICBkZXRlcm1pbmlzdGljRGVjaXJjKHZhbFtrZXldLCBrZXksIGksIHN0YWNrLCB2YWwsIGRlcHRoLCBvcHRpb25zKTtcbiAgICAgICAgdG1wW2tleV0gPSB2YWxba2V5XTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGFyZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBhcnIucHVzaChbcGFyZW50LCBrLCB2YWxdKTtcbiAgICAgICAgcGFyZW50W2tdID0gdG1wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRtcDtcbiAgICAgIH1cbiAgICB9XG4gICAgc3RhY2sucG9wKCk7XG4gIH1cbn1cblxuLy8gd3JhcHMgcmVwbGFjZXIgZnVuY3Rpb24gdG8gaGFuZGxlIHZhbHVlcyB3ZSBjb3VsZG4ndCByZXBsYWNlXG4vLyBhbmQgbWFyayB0aGVtIGFzIHJlcGxhY2VkIHZhbHVlXG5mdW5jdGlvbiByZXBsYWNlR2V0dGVyVmFsdWVzKHJlcGxhY2VyKSB7XG4gIHJlcGxhY2VyID0gdHlwZW9mIHJlcGxhY2VyICE9PSAndW5kZWZpbmVkJyA/IHJlcGxhY2VyIDogZnVuY3Rpb24gKGssIHYpIHtcbiAgICByZXR1cm4gdjtcbiAgfTtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIGlmIChyZXBsYWNlclN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwbGFjZXJTdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IHJlcGxhY2VyU3RhY2tbaV07XG4gICAgICAgIGlmIChwYXJ0WzFdID09PSBrZXkgJiYgcGFydFswXSA9PT0gdmFsKSB7XG4gICAgICAgICAgdmFsID0gcGFydFsyXTtcbiAgICAgICAgICByZXBsYWNlclN0YWNrLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbCk7XG4gIH07XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHRoaXMgc2NyaXB0IGlzIGluamVjdGVkIGludG8gd2VicGFnZSdzIGNvbnRleHRcclxuaW1wb3J0IHsgZXRoRXJyb3JzLCBzZXJpYWxpemVFcnJvciB9IGZyb20gJ2V0aC1ycGMtZXJyb3JzJztcclxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcclxuXHJcbmltcG9ydCB7IFR4VHlwZSB9IGZyb20gJ0Avc2hhcmVkL3R5cGVzJztcclxuaW1wb3J0IEJyb2FkY2FzdENoYW5uZWxNZXNzYWdlIGZyb20gJ0Avc2hhcmVkL3V0aWxzL21lc3NhZ2UvYnJvYWRjYXN0Q2hhbm5lbE1lc3NhZ2UnO1xyXG5cclxuaW1wb3J0IFB1c2hFdmVudEhhbmRsZXJzIGZyb20gJy4vcHVzaEV2ZW50SGFuZGxlcnMnO1xyXG5pbXBvcnQgUmVhZHlQcm9taXNlIGZyb20gJy4vcmVhZHlQcm9taXNlJztcclxuaW1wb3J0IHsgJCwgZG9tUmVhZHlDYWxsIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5jb25zdCBsb2cgPSAoZXZlbnQsIC4uLmFyZ3MpID0+IHtcclxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgY29uc29sZS5sb2coXHJcbiAgICAgIGAlYyBbdW5pc2F0XSAoJHtuZXcgRGF0ZSgpLnRvVGltZVN0cmluZygpLnNsaWNlKDAsIDgpfSkgJHtldmVudH1gLFxyXG4gICAgICAnZm9udC13ZWlnaHQ6IDYwMDsgYmFja2dyb3VuZC1jb2xvcjogIzdkNmVmOTsgY29sb3I6IHdoaXRlOycsXHJcbiAgICAgIC4uLmFyZ3NcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5jb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0O1xyXG5jb25zdCBjaGFubmVsTmFtZSA9IHNjcmlwdD8uZ2V0QXR0cmlidXRlKCdjaGFubmVsJykgfHwgJ1VOSVNBVCc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEludGVyY2VwdG9yIHtcclxuICBvblJlcXVlc3Q/OiAoZGF0YTogYW55KSA9PiBhbnk7XHJcbiAgb25SZXNwb25zZT86IChyZXM6IGFueSwgZGF0YTogYW55KSA9PiBhbnk7XHJcbn1cclxuXHJcbmludGVyZmFjZSBTdGF0ZVByb3ZpZGVyIHtcclxuICBhY2NvdW50czogc3RyaW5nW10gfCBudWxsO1xyXG4gIGlzQ29ubmVjdGVkOiBib29sZWFuO1xyXG4gIGlzVW5sb2NrZWQ6IGJvb2xlYW47XHJcbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XHJcbiAgaXNQZXJtYW5lbnRseURpc2Nvbm5lY3RlZDogYm9vbGVhbjtcclxufVxyXG5jb25zdCBFWFRFTlNJT05fQ09OVEVYVF9JTlZBTElEQVRFRF9DSFJPTUlVTV9FUlJPUiA9ICdFeHRlbnNpb24gY29udGV4dCBpbnZhbGlkYXRlZC4nO1xyXG5leHBvcnQgY2xhc3MgVW5pc2F0UHJvdmlkZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xyXG4gIF9zZWxlY3RlZEFkZHJlc3M6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gIF9uZXR3b3JrOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICBfaXNDb25uZWN0ZWQgPSBmYWxzZTtcclxuICBfaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICBfaXNVbmxvY2tlZCA9IGZhbHNlO1xyXG5cclxuICBfc3RhdGU6IFN0YXRlUHJvdmlkZXIgPSB7XHJcbiAgICBhY2NvdW50czogbnVsbCxcclxuICAgIGlzQ29ubmVjdGVkOiBmYWxzZSxcclxuICAgIGlzVW5sb2NrZWQ6IGZhbHNlLFxyXG4gICAgaW5pdGlhbGl6ZWQ6IGZhbHNlLFxyXG4gICAgaXNQZXJtYW5lbnRseURpc2Nvbm5lY3RlZDogZmFsc2VcclxuICB9O1xyXG5cclxuICBwcml2YXRlIF9wdXNoRXZlbnRIYW5kbGVyczogUHVzaEV2ZW50SGFuZGxlcnM7XHJcbiAgcHJpdmF0ZSBfcmVxdWVzdFByb21pc2UgPSBuZXcgUmVhZHlQcm9taXNlKDApO1xyXG5cclxuICBwcml2YXRlIF9iY20gPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbE1lc3NhZ2UoY2hhbm5lbE5hbWUpO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih7IG1heExpc3RlbmVycyA9IDEwMCB9ID0ge30pIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLnNldE1heExpc3RlbmVycyhtYXhMaXN0ZW5lcnMpO1xyXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XHJcbiAgICB0aGlzLl9wdXNoRXZlbnRIYW5kbGVycyA9IG5ldyBQdXNoRXZlbnRIYW5kbGVycyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd2aXNpYmlsaXR5Y2hhbmdlJywgdGhpcy5fcmVxdWVzdFByb21pc2VDaGVja1Zpc2liaWxpdHkpO1xyXG5cclxuICAgIHRoaXMuX2JjbS5jb25uZWN0KCkub24oJ21lc3NhZ2UnLCB0aGlzLl9oYW5kbGVCYWNrZ3JvdW5kTWVzc2FnZSk7XHJcbiAgICBkb21SZWFkeUNhbGwoKCkgPT4ge1xyXG4gICAgICBjb25zdCBvcmlnaW4gPSB3aW5kb3cudG9wPy5sb2NhdGlvbi5vcmlnaW47XHJcbiAgICAgIGNvbnN0IGljb24gPVxyXG4gICAgICAgICgkKCdoZWFkID4gbGlua1tyZWx+PVwiaWNvblwiXScpIGFzIEhUTUxMaW5rRWxlbWVudCk/LmhyZWYgfHxcclxuICAgICAgICAoJCgnaGVhZCA+IG1ldGFbaXRlbXByb3A9XCJpbWFnZVwiXScpIGFzIEhUTUxNZXRhRWxlbWVudCk/LmNvbnRlbnQ7XHJcblxyXG4gICAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQudGl0bGUgfHwgKCQoJ2hlYWQgPiBtZXRhW25hbWU9XCJ0aXRsZVwiXScpIGFzIEhUTUxNZXRhRWxlbWVudCk/LmNvbnRlbnQgfHwgb3JpZ2luO1xyXG5cclxuICAgICAgdGhpcy5fYmNtLnJlcXVlc3Qoe1xyXG4gICAgICAgIG1ldGhvZDogJ3RhYkNoZWNraW4nLFxyXG4gICAgICAgIHBhcmFtczogeyBpY29uLCBuYW1lLCBvcmlnaW4gfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIERvIG5vdCBmb3JjZSB0byB0YWJDaGVja2luXHJcbiAgICAgIC8vIHRoaXMuX3JlcXVlc3RQcm9taXNlLmNoZWNrKDIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgeyBuZXR3b3JrLCBhY2NvdW50cywgaXNVbmxvY2tlZCB9OiBhbnkgPSBhd2FpdCB0aGlzLl9yZXF1ZXN0KHtcclxuICAgICAgICBtZXRob2Q6ICdnZXRQcm92aWRlclN0YXRlJ1xyXG4gICAgICB9KTtcclxuICAgICAgaWYgKGlzVW5sb2NrZWQpIHtcclxuICAgICAgICB0aGlzLl9pc1VubG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9zdGF0ZS5pc1VubG9ja2VkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmVtaXQoJ2Nvbm5lY3QnLCB7fSk7XHJcbiAgICAgIHRoaXMuX3B1c2hFdmVudEhhbmRsZXJzLm5ldHdvcmtDaGFuZ2VkKHtcclxuICAgICAgICBuZXR3b3JrXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5fcHVzaEV2ZW50SGFuZGxlcnMuYWNjb3VudHNDaGFuZ2VkKGFjY291bnRzKTtcclxuICAgIH0gY2F0Y2gge1xyXG4gICAgICAvL1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLl9zdGF0ZS5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuZW1pdCgnX2luaXRpYWxpemVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5rZWVwQWxpdmUoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZW5kaW5nIGEgbWVzc2FnZSB0byB0aGUgZXh0ZW5zaW9uIHRvIHJlY2VpdmUgd2lsbCBrZWVwIHRoZSBzZXJ2aWNlIHdvcmtlciBhbGl2ZS5cclxuICAgKi9cclxuICBwcml2YXRlIGtlZXBBbGl2ZSA9ICgpID0+IHtcclxuICAgIHRoaXMuX3JlcXVlc3Qoe1xyXG4gICAgICBtZXRob2Q6ICdrZWVwQWxpdmUnLFxyXG4gICAgICBwYXJhbXM6IHt9XHJcbiAgICB9KS50aGVuKCh2KSA9PiB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMua2VlcEFsaXZlKCk7XHJcbiAgICAgIH0sIDEwMDApO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBfcmVxdWVzdFByb21pc2VDaGVja1Zpc2liaWxpdHkgPSAoKSA9PiB7XHJcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAndmlzaWJsZScpIHtcclxuICAgICAgdGhpcy5fcmVxdWVzdFByb21pc2UuY2hlY2soMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9yZXF1ZXN0UHJvbWlzZS51bmNoZWNrKDEpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgX2hhbmRsZUJhY2tncm91bmRNZXNzYWdlID0gKHsgZXZlbnQsIGRhdGEgfSkgPT4ge1xyXG4gICAgbG9nKCdbcHVzaCBldmVudF0nLCBldmVudCwgZGF0YSk7XHJcbiAgICBpZiAodGhpcy5fcHVzaEV2ZW50SGFuZGxlcnNbZXZlbnRdKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9wdXNoRXZlbnRIYW5kbGVyc1tldmVudF0oZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5lbWl0KGV2ZW50LCBkYXRhKTtcclxuICB9O1xyXG4gIC8vIFRPRE86IHN1cHBvcnQgbXVsdGkgcmVxdWVzdCFcclxuICAvLyByZXF1ZXN0ID0gYXN5bmMgKGRhdGEpID0+IHtcclxuICAvLyAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KGRhdGEpO1xyXG4gIC8vIH07XHJcblxyXG4gIF9yZXF1ZXN0ID0gYXN5bmMgKGRhdGEpID0+IHtcclxuICAgIGlmICghZGF0YSkge1xyXG4gICAgICB0aHJvdyBldGhFcnJvcnMucnBjLmludmFsaWRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fcmVxdWVzdFByb21pc2VDaGVja1Zpc2liaWxpdHkoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdFByb21pc2UuY2FsbCgoKSA9PiB7XHJcbiAgICAgIGxvZygnW3JlcXVlc3RdJywgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMikpO1xyXG4gICAgICByZXR1cm4gdGhpcy5fYmNtXHJcbiAgICAgICAgLnJlcXVlc3QoZGF0YSlcclxuICAgICAgICAudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgICBsb2coJ1tyZXF1ZXN0OiBzdWNjZXNzXScsIGRhdGEubWV0aG9kLCByZXMpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICBsb2coJ1tyZXF1ZXN0OiBlcnJvcl0nLCBkYXRhLm1ldGhvZCwgc2VyaWFsaXplRXJyb3IoZXJyKSk7XHJcbiAgICAgICAgICB0aHJvdyBzZXJpYWxpemVFcnJvcihlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gcHVibGljIG1ldGhvZHNcclxuICByZXF1ZXN0QWNjb3VudHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ3JlcXVlc3RBY2NvdW50cydcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGdldE5ldHdvcmsgPSBhc3luYyAoKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ2dldE5ldHdvcmsnXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBzd2l0Y2hOZXR3b3JrID0gYXN5bmMgKG5ldHdvcms6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Qoe1xyXG4gICAgICBtZXRob2Q6ICdzd2l0Y2hOZXR3b3JrJyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgbmV0d29ya1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBnZXRBY2NvdW50cyA9IGFzeW5jICgpID0+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KHtcclxuICAgICAgbWV0aG9kOiAnZ2V0QWNjb3VudHMnXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBnZXRQdWJsaWNLZXkgPSBhc3luYyAoKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ2dldFB1YmxpY0tleSdcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGdldEJhbGFuY2UgPSBhc3luYyAoKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ2dldEJhbGFuY2UnXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBnZXRJbnNjcmlwdGlvbnMgPSBhc3luYyAoY3Vyc29yID0gMCwgc2l6ZSA9IDIwKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ2dldEluc2NyaXB0aW9ucycsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIGN1cnNvcixcclxuICAgICAgICBzaXplXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHNpZ25NZXNzYWdlID0gYXN5bmMgKHRleHQ6IHN0cmluZywgdHlwZTogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ3NpZ25NZXNzYWdlJyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgdGV4dCxcclxuICAgICAgICB0eXBlXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHNlbmRCaXRjb2luID0gYXN5bmMgKHRvQWRkcmVzczogc3RyaW5nLCBzYXRvc2hpczogbnVtYmVyLCBvcHRpb25zPzogeyBmZWVSYXRlOiBudW1iZXIgfSkgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Qoe1xyXG4gICAgICBtZXRob2Q6ICdzZW5kQml0Y29pbicsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIHRvQWRkcmVzcyxcclxuICAgICAgICBzYXRvc2hpcyxcclxuICAgICAgICBmZWVSYXRlOiBvcHRpb25zPy5mZWVSYXRlLFxyXG4gICAgICAgIHR5cGU6IFR4VHlwZS5TRU5EX0JJVENPSU5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgc2VuZEluc2NyaXB0aW9uID0gYXN5bmMgKHRvQWRkcmVzczogc3RyaW5nLCBpbnNjcmlwdGlvbklkOiBzdHJpbmcsIG9wdGlvbnM/OiB7IGZlZVJhdGU6IG51bWJlciB9KSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ3NlbmRJbnNjcmlwdGlvbicsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIHRvQWRkcmVzcyxcclxuICAgICAgICBpbnNjcmlwdGlvbklkLFxyXG4gICAgICAgIGZlZVJhdGU6IG9wdGlvbnM/LmZlZVJhdGUsXHJcbiAgICAgICAgdHlwZTogVHhUeXBlLlNFTkRfSU5TQ1JJUFRJT05cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gc2lnblR4ID0gYXN5bmMgKHJhd3R4OiBzdHJpbmcpID0+IHtcclxuICAvLyAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KHtcclxuICAvLyAgICAgbWV0aG9kOiAnc2lnblR4JyxcclxuICAvLyAgICAgcGFyYW1zOiB7XHJcbiAgLy8gICAgICAgcmF3dHhcclxuICAvLyAgICAgfVxyXG4gIC8vICAgfSk7XHJcbiAgLy8gfTtcclxuXHJcbiAgLyoqXHJcbiAgICogcHVzaCB0cmFuc2FjdGlvblxyXG4gICAqL1xyXG4gIHB1c2hUeCA9IGFzeW5jIChyYXd0eDogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ3B1c2hUeCcsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIHJhd3R4XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHNpZ25Qc2J0ID0gYXN5bmMgKHBzYnRIZXg6IHN0cmluZywgb3B0aW9ucz86IGFueSkgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Qoe1xyXG4gICAgICBtZXRob2Q6ICdzaWduUHNidCcsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIHBzYnRIZXgsXHJcbiAgICAgICAgdHlwZTogVHhUeXBlLlNJR05fVFgsXHJcbiAgICAgICAgb3B0aW9uc1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBzaWduUHNidHMgPSBhc3luYyAocHNidEhleHM6IHN0cmluZ1tdLCBvcHRpb25zPzogYW55W10pID0+IHtcclxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KHtcclxuICAgICAgbWV0aG9kOiAnbXVsdGlTaWduUHNidCcsXHJcbiAgICAgIHBhcmFtczoge1xyXG4gICAgICAgIHBzYnRIZXhzLFxyXG4gICAgICAgIG9wdGlvbnNcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcHVzaFBzYnQgPSBhc3luYyAocHNidEhleDogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogJ3B1c2hQc2J0JyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgcHNidEhleFxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBpbnNjcmliZVRyYW5zZmVyID0gYXN5bmMgKHRpY2tlcjogc3RyaW5nLCBhbW91bnQ6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Qoe1xyXG4gICAgICBtZXRob2Q6ICdpbnNjcmliZVRyYW5zZmVyJyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgdGlja2VyLFxyXG4gICAgICAgIGFtb3VudFxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XHJcbiAgICB1bmlzYXQ6IFVuaXNhdFByb3ZpZGVyO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgcHJvdmlkZXIgPSBuZXcgVW5pc2F0UHJvdmlkZXIoKTtcclxuXHJcbmlmICghd2luZG93LnVuaXNhdCkge1xyXG4gIHdpbmRvdy51bmlzYXQgPSBuZXcgUHJveHkocHJvdmlkZXIsIHtcclxuICAgIGRlbGV0ZVByb3BlcnR5OiAoKSA9PiB0cnVlXHJcbiAgfSk7XHJcbn1cclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICd1bmlzYXQnLCB7XHJcbiAgdmFsdWU6IG5ldyBQcm94eShwcm92aWRlciwge1xyXG4gICAgZGVsZXRlUHJvcGVydHk6ICgpID0+IHRydWVcclxuICB9KSxcclxuICB3cml0YWJsZTogZmFsc2VcclxufSk7XHJcblxyXG53aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3VuaXNhdCNpbml0aWFsaXplZCcpKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9