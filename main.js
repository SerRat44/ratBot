import * as bitcoinMessage from 'bitcoinjs-message';

  let connectedWallet;
  let walletCheckInterval;
  
  function startWalletCheckInterval() {
    walletCheckInterval = setInterval(async function() {
      await checkWalletConnection();
    }, 100);
  }

async function checkWalletConnection() {
  if (window.activeWallet) {
    const accounts = await window.activeWallet.getAccounts();
    if (accounts && accounts.length > 0) {
      connectedWallet = accounts[0];
      checkROOGHolder();
      clearInterval(walletCheckInterval);
    } else {
      connectedWallet = null;
      document.getElementById('status-message').textContent = 'Unauthorized';
      document.getElementById('authorize-button').disabled = true;
    }
  } else {
    connectedWallet = null;
    document.getElementById('status-message').textContent = 'Unauthorized';
    document.getElementById('authorize-button').disabled = true;
  }
}

async function checkROOGHolder() {
  const response = await fetch(`https://brc20api.bestinslot.xyz/v1/get_brc20_balance/${connectedWallet}`);
  const balances = await response.json();
  const ROOGToken = balances.find(token => token.tick === 'roog');
  
  if (ROOGToken && Number(ROOGToken.overall_balance) >= 0 || ROOGToken == null) {
    document.getElementById('status-message').textContent = `Welcome $ROOG Holder`;
    document.getElementById('authorize-button').disabled = false;
  } else {
    document.getElementById('status-message').textContent = 'Unauthorized';
    document.getElementById('authorize-button').disabled = true;
  }
}

const signatureVerification = (message, address, signature) => {
  let isValid = false;
  const flags = [...Array(12).keys()].map(i => i + 31);
  for (let flag of flags) {
    let flagByte = Buffer.alloc(1);
    flagByte.writeInt8(flag);
    let sigBuffer = Buffer.from(signature, 'base64').slice(1);
    sigBuffer = Buffer.concat([flagByte, sigBuffer]);
    let candidateSig = sigBuffer.toString('base64');
    try {
		console.log("candidateSig: ", candidateSig);
      isValid = bitcoinMessage.verify(message, address, candidateSig);
      if (isValid) break;
    }catch(e) {
    }
  }
  return isValid;
}

document.getElementById('authorize-button').addEventListener('click', async () => {
  const randomMsg = Math.random().toString(36).substring(2);
  try {
    const signature = await activeWallet.signMessage(randomMsg);
	
	console.log("randomMsg: ", randomMsg);
    console.log("connectedWallet: ", connectedWallet);
    console.log("signature: ", signature);

    if (signature) {
      const isValid = signatureVerification(randomMsg, connectedWallet, signature);
      console.log("isValid: ", isValid);
      if (isValid) {
        document.getElementById('authorization-section').style.display = 'none';
        document.getElementById('bot-section').style.display = 'block';
      } else {
        throw new Error('Signature verification failed');
      }
    } else {
      throw new Error('Unable to sign the message');
    }
  } catch (err) {
    document.getElementById('status-message').textContent = 'Unauthorized: ' + err.message;
    document.getElementById('authorize-button').disabled = true;
    console.error(err);
  }
});

startWalletCheckInterval();

// rest of the code

	const fetchTokenInformation = () => {
    const collectionSymbol = document.getElementById('collectionSymbol').value;
    const priceInBTC = document.getElementById('price').value;

    // Convert BTC to sats
    const priceInSats = Math.floor(priceInBTC * 100000000);
    const url = `https://api-mainnet.magiceden.io/v2/ord/btc/tokens?limit=20&offset=0&sortBy=priceAsc&minPrice=0&maxPrice=${priceInSats}&collectionSymbol=${collectionSymbol}&disablePendingTransactions=true`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }