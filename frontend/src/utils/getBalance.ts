import Web3 from "web3";
import getRpcUrl from "./getRpcUrl";

const RPC_URL = getRpcUrl();

export const getBalance = async (account: string|null|undefined) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
  if (account) {
    let balance = await web3.eth.getBalance(account);
    balance = web3.utils.fromWei(balance);
    return Number(balance);
  } else {
    return 0;
  }
};

export const toWeiBalance = (value: any) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
  const price = web3.utils.toWei(value, 'ether')
  return price
}

