import UAuthWeb3Modal from '@uauth/web3modal';
import UAuth from '@uauth/js';
import Web3Modal from 'web3modal';

const uauthOptions = {
	clientID: '68de79d6-382f-4d3c-82a3-6985b6a32a59',
	redirectUri: 'https://app.burgercities.org/',
	// redirectUri: 'http://localhost:8080/',
	scope: 'openid wallet email:optional'
};

const providerOptions = {
	'custom-uauth': {
		display: UAuthWeb3Modal.display,
		connector: UAuthWeb3Modal.connector,
		package: UAuth,
		options: uauthOptions,
	}
};

const web3modal = new Web3Modal({providerOptions, theme: 'dark', disableInjectedProvider: true});

UAuthWeb3Modal.registerWeb3Modal(web3modal);

const UAuthSPAInfo = new UAuth(uauthOptions).user().then().catch();

export default {web3modal, UAuthSPAInfo};
