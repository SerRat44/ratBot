import * as bitcoinMessage from 'bitcoinjs-message';
import * as bitcoin from "bitcoinjs-lib";
import { bech32m } from 'bech32';
import CryptoJS from 'crypto-js';
import BN from 'bn.js';

import * as ecc from 'tiny-secp256k1';

bitcoin.initEccLib(ecc);

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

async function verifyTaprootSignature(message, address, signature) {
  try {
    // Step 1: Decode the address to obtain the public key
    const decodedAddress = bech32m.decode(address);
    const publicKey = bech32m.fromWords(decodedAddress.words);

    // Step 2: Calculate the message hash
    const messageHash = bitcoin.crypto.sha256(Buffer.from(message));

    // Step 3: Verify the signature
    const signatureBuffer = Buffer.from(signature, 'hex');
    const signatureObj = bitcoin.script.signature.decode(signatureBuffer);
    const hashType = signatureObj.hashType;
    const signatureDER = signatureObj.signature;

    const publicKeyPair = bitcoin.ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'));
    const signatureRS = bitcoin.script.signature.decodeDER(signatureDER);
    const signatureECDSA = {
      signature: signatureRS.signature,
      hashType: hashType,
    };

    const result = await bitcoin.script.signature.verify(
      messageHash,
      signatureECDSA.signature,
      publicKeyPair.publicKey,
    );

    return result;
  } catch (error) {
    console.error('Error during signature verification:', error);
    return false;
  }
}

function schnorrVerify(msg, signature, pubKey) {
    // Calculate the hash of the message
    const msgHash = CryptoJS.SHA256(msg).toString(CryptoJS.enc.Hex);

    // Convert the signature to a Buffer
    const signatureBuffer = Buffer.from(signature, 'base64');

    // Split the signature into r and s
    const r = signatureBuffer.slice(0, 32);
    const s = signatureBuffer.slice(32, 64);

    // Convert the public key to a Buffer
    const publicKeyBuffer = Buffer.from(pubKey, 'hex');

    // Calculate e = H(r || pubKey || m)
    const e = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(r.toString('hex') + publicKeyBuffer.toString('hex') + msgHash)).toString(CryptoJS.enc.Hex);

    // Calculate R = sG + eP
    const sG = secp256k1.ec.g.mul(new BN(s.toString('hex'), 16)); // Convert s to big number
    const eP = ec.keyFromPublic(publicKeyBuffer.toString('hex'), 'hex').pub.mul(new BN(e, 16)); // Convert e to big number
    const R = sG.add(eP);

    // Verify the x coordinate of R equals r
    return R.getX().toString(16) === r.toString('hex');
}

function verifyBip322MessageSimple({ message, address, signature, network }) {
  const { sha256 } = bitcoin.crypto;
  const tag = 'BIP0322-signed-message';
  const tagHash = sha256(Buffer.from(tag));
  const messageHash = sha256(Buffer.concat([tagHash, tagHash, Buffer.from(message)]));

  const outputScript = bitcoin.address.toOutputScript(address, network);

  const tx = bitcoin.Transaction.fromHex(signature, network);
  const input = tx.ins[0];
  const witness = input.witness;

  const scriptSig = Buffer.concat([Buffer.from('0020', 'hex'), messageHash]);
  const txToVerify = new bitcoin.Transaction();
  txToVerify.version = 0;
  txToVerify.addInput(input.hash, input.index, input.sequence, scriptSig);
  txToVerify.addOutput(outputScript, 0);

  const hash = txToVerify.getHash();

  return tx.hash === hash;
}

document.getElementById('authorize-button').addEventListener('click', async () => {
  const randomMsg = Math.random().toString(36).substring(2);
  try {
    const signature = await activeWallet.signMessage(randomMsg, "bip322-simple");
	const pubKey = await window.activeWallet.getPublicKey();
	
	console.log("pubKey", pubKey)
	console.log("randomMsg: ", randomMsg);
    console.log("connectedWallet: ", connectedWallet);
    console.log("signature: ", signature);
	
	//let hash = bitcoin.crypto.sha256(message);
	//let keyPairFromPublic = bitcoin.ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'));
	
	
    if (signature) {

// Call the function
	const isValid = verifyBip322MessageSimple({
  message: randomMsg,
  address: connectedWallet,
  signature: signature,
  network: bitcoin.networks.bitcoin // or bitcoin.networks.testnet
});
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
  
  const array = new Uint8Array(16);
  console.log(window.crypto.getRandomValues(array));