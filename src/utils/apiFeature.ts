import { BrowserProvider, Contract } from "ethers";
import Web3Modal from "web3modal";

import { contractAddress, contractABI } from "@/Context/Constants";

//check
export const isWalletConnected = async () => {
    try {
        if (!window.ethereum) {
            console.log("Install MetaMask");
            return null;
        }

        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        return accounts.length > 0 ? accounts[0] : null;
    } catch (e) {
        console.error("Error checking wallet connection:", e);
    }
};

//connect
export const connectWallet = async () => {
    try {
        if (!window.ethereum) {
            console.log("Install MetaMask");
            return null;
        }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        return accounts.length > 0 ? accounts[0] : null;
    } catch (e) {
        console.error("Error connecting wallet:", e);
    }
};


export const fetchContract = (signerOrProvider: any) => {
    return new Contract(contractAddress, contractABI, signerOrProvider);
};

// connect
export const connectingWithContract = async () => {
    try {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new BrowserProvider(connection); // Ethers v6 uses `BrowserProvider`
        const signer = await provider.getSigner();
        const contract = fetchContract(signer);

        return contract;
    } catch (e) {
        console.error("Error connecting with contract:", e);
    }
};

export const convertTime = (time: any) => {
    const newTime = new Date(time.toNumber());
    const realtime = newTime.getHours() + ":" + newTime.getMinutes() + ":" + newTime.getSeconds() + " Date: " + newTime.getDate() + "/" + newTime.getMonth() + "/" + newTime.getFullYear();
    return realtime;
}