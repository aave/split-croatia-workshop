import Web3 from "web3";

export default function metamask() {
	window.addEventListener('load', async () => {
	    	// Modern dapp browsers...
	    	if (window.ethereum) {
			try {
				if (typeof window.ethereum.selectedAddress === 'undefined') {
					// Request account access if needed
		    			await window.ethereum.enable();
					window.web3 = new Web3(window.ethereum);
					console.log('metamask setting up');
				}
				else {
					window.web3 = new Web3(window.ethereum);
					console.log('metamask already setting up');
				}         
			} catch (error) {
				console.log('User denied account access...');
			}
	    	}
	    	// Legacy dapp browsers...
	    	else if (window.web3) {
			window.web3 = new Web3(Web3.givenProvider);
			console.log('metamask already setting up');
	    	}
	    	// Non-dapp browsers...
	    	else {
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
	    	}
	})
}
