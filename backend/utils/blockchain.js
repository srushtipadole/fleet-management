import { ethers } from "ethers";
import BlockchainLog from "../models/BlockchainLog.js";

let provider = null;
let signer = null;

export const initBlockchain = async () => {
  provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);

  if (process.env.CHAIN_PRIVATE_KEY) {
    signer = new ethers.Wallet(process.env.CHAIN_PRIVATE_KEY, provider);
  }

  console.log("Blockchain initialized:", !!provider);
};

export const addBlockchainLog = async (eventType, data) => {
  if (!provider) {
    console.warn("Blockchain not initialized, logging anyway");
  }

  return BlockchainLog.createBlock(eventType, data);
};

export const releasePaymentOnChain = async (maintenanceId, amount, vendorWallet) => {
  // future smart contract call
  return "SIMULATED_TX_" + Date.now();
};
