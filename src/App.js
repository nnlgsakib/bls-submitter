import React, { useState } from 'react';
import Web3 from 'web3';
import "./App.css";
const web3 = new Web3(Web3.givenProvider);

function App() {
  const [blsPubKey, setBlsPubKey] = useState('');
  const [status, setStatus] = useState('');
  const [validators, setValidators] = useState([]);

  const connectToMetaMask = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setStatus('Connected to MetaMask!');
    } catch (error) {
      console.error(error);
      setStatus('Failed to connect to MetaMask!');
    }
  };

  const registerBLSPublicKey = async () => {
    if (!window.ethereum) {
      setStatus('Please connect to MetaMask!');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const account = accounts[0];

    const contractAddress = '0x0000000000000000000000000000000000001001'; // Replace with your contract address
    const contractAbi = [
      {
        "inputs": [
          {
            "internalType": "bytes",
            "name": "blsPubKey",
            "type": "bytes"
          }
        ],
        "name": "registerBLSPublicKey",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "blsPubKey",
            "type": "bytes"
          }
        ],
        "name": "BLSPublicKeyRegistered",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "validatorBLSPublicKeys",
        "outputs": [
          {
            "internalType": "bytes[]",
            "name": "",
            "type": "bytes[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "isValidator",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    try {
      const isRegisteredValidator = await contract.methods.isValidator(account).call();
      if (!isRegisteredValidator) {
        setStatus(`Account ${account} is not a registered validator!`);
        return;
      }

      await contract.methods.registerBLSPublicKey(blsPubKey).send({ from: account });
      setStatus(`Registered BLS public key ${blsPubKey} for account ${account}!`);
    } catch (error) {
      console.error(error);
      setStatus('Failed to register BLS public key!');
    }
  };

  const getValidatorBLSPublicKeys = async (providerUrl) => {
    const provider = new Web3.providers.HttpProvider(providerUrl);
    const web3 = new Web3(provider);
  
    const contractAddress = '0x0000000000000000000000000000000000001001'; // Replace with your contract address
    const contractAbi = [
      {
        "inputs": [
          {
            "internalType": "bytes",
            "name": "blsPubKey",
            "type": "bytes"
          }
        ],
        "name": "registerBLSPublicKey",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "blsPubKey",
            "type": "bytes"
          }
        ],
        "name": "BLSPublicKeyRegistered",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "validatorBLSPublicKeys",
        "outputs": [
          {
            "internalType": "bytes[]",
            "name": "",
            "type": "bytes[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "isValidator",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
  
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    try {
      const validatorBLSPublicKeys = await contract.methods.validatorBLSPublicKeys().call();
      setValidators(validatorBLSPublicKeys);
    } catch (error) {
      console.error(error);
      setStatus('Failed to get validator BLS public keys!');
    }
  };
  const providerUrl = 'http://45.76.129.38:8545';
getValidatorBLSPublicKeys(providerUrl);


  return (
    <div class="peer-to-peer">
    <button onClick={connectToMetaMask}>Connect to MetaMask</button>
    <p>{status}</p>
    <input type="text" placeholder="Enter BLS public key" value={blsPubKey} onChange={(e) => setBlsPubKey(e.target.value)} />
    <button onClick={registerBLSPublicKey}>Register BLS Public Key</button>
    
    <div class="validators-container">
      <p class="validators-heading">Validators:</p>
      <ul class="validators-list">
        {validators.map((validator, index) => (
          <li key={index}>{validator}</li>
        ))}
      </ul>
    </div>
  </div>
  
  
  );
  }
  
  export default App; 
