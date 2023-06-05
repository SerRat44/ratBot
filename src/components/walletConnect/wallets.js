const wallets = {
  unisat: {
    connect: async () => await window.unisat.requestAccounts(),
    getAccounts: async () => await window.unisat.getAccounts(),
    getNetwork: async () => await window.unisat.getNetwork(),
    switchNetwork: async (network) => await window.unisat.switchNetwork(network),
    getPublicKey: async () => await window.unisat.getPublicKey(),
    getBalance: async () => await window.unisat.getBalance(),
    getInscriptions: async (cursor, size) => await window.unisat.getInscriptions(cursor, size),
    sendBitcoin: async (toAddress, satoshis, options) => await window.unisat.sendBitcoin(toAddress, satoshis, options),
    sendInscription: async (address, inscriptionId, options) => await window.unisat.sendInscription(address, inscriptionId, options),
    signMessage: async (msg, type) => await window.unisat.signMessage(msg, type),
    pushTx: async (options) => await window.unisat.pushTx(options),
    signPsbt: async (psbtHex) => await window.unisat.signPsbt(psbtHex),
    pushPsbt: async (psbtHex) => await window.unisat.pushPsbt(psbtHex),
    onAccountsChanged: (handler) => window.unisat.on('accountsChanged', handler),
    offAccountsChanged: (handler) => window.unisat.removeListener('accountsChanged', handler),
    onNetworkChanged: (handler) => window.unisat.on('networkChanged', handler),
    offNetworkChanged: (handler) => window.unisat.removeListener('networkChanged', handler),
  },
};

export default wallets;