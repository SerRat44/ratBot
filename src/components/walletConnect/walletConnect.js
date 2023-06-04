import wallets from './wallets.js';

let activeWallet;

function initializeWallet() {
  
	const connectButton = document.getElementById('connect-wallet');
    const selectMenu = document.getElementById('select-menu');
    const unisatButton = document.getElementById('unisat-wallet');
	const xverseButton = document.getElementById('xverse-wallet');
    const optionsMenu = document.getElementById('options-menu');
    const disconnectButton = document.getElementById('disconnect-wallet');
	
	const setMenuVisibility = (menu, isVisible) => {
		menu.style.display = isVisible ? 'flex' : 'none';
    };
	
    const resetConnectButton = () => {
		connectButton.textContent = 'Connect Wallet';
    };
	
	const handleBodyClick = (event) => {
      if (
        event.target !== connectButton &&
        event.target !== selectMenu &&
        event.target !== unisatButton &&
        event.target !== optionsMenu &&
        event.target !== disconnectButton
      ) {
        setMenuVisibility(selectMenu, false);
        setMenuVisibility(optionsMenu, false);
      }
    };
	document.addEventListener('click', handleBodyClick);
	
	const disconnectWallet = async () => {
    try {	  
	activeWallet = null;
      resetConnectButton();
      optionsMenu.style.display = "none";
      console.log("disconnect successful");
    } catch (e) {
      console.log("disconnect failed");
    }
  };
	
	const connectWallet = async (walletKey) => {
    try {
      activeWallet = wallets[walletKey];
      const accounts = await activeWallet.connect();
      connectButton.textContent = `${accounts[0].substr(0, 8)}...`;
      selectMenu.style.display = "none";
	  console.log("connect successful");
    } catch (e) {
      console.log("connect failed");
    }
  };
  
	connectButton.addEventListener('click', () => {
      if (connectButton.textContent !== 'Connect Wallet') {
        setMenuVisibility(optionsMenu, true);
      } else {
        setMenuVisibility(selectMenu, true);
      }
    });
  
  unisatButton.addEventListener("click", () => {
	connectWallet("unisat");
	});
	
	xverseButton.addEventListener("click", () => {
	connectWallet("xverse");
	});
  
  disconnectButton.addEventListener("click", disconnectWallet);
  
}

initializeWallet();