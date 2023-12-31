const { Alchemy, Network, Wallet, Utils } = require('alchemy-sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { TEST_API_KEY, TEST_PRIVATE_KEY } = process.env;

const settings = {
	apiKey: TEST_API_KEY,
	network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

let wallet = new Wallet(TEST_PRIVATE_KEY);

async function main() {
	const nonce = await alchemy.core.getTransactionCount(
		wallet.address,
		'latest'
	);

	let transaction = {
		to: "0xa1502cFDfFe919221B0327Df316c35953eFc009F",
		value: Utils.parseEther('0.1'), // 0.001 worth of ETH being sent
		gasLimit: '21000',
		maxPriorityFeePerGas: Utils.parseUnits('5', 'gwei'),
		maxFeePerGas: Utils.parseUnits('20', 'gwei'),
		nonce: nonce,
		type: 2,
		chainId: 11155111
	};

	let rawTransaction = await wallet.signTransaction(transaction);
	console.log('Raw tx: ', rawTransaction);
	let tx = await alchemy.core.sendTransaction(rawTransaction);
	console.log(`https://goerli.etherscan.io/tx/${tx.hash}`);
}

main();