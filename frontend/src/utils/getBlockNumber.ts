import Web3 from "web3";
import getRpcUrl from "./getRpcUrl";

const RPC_URL = getRpcUrl();
const avarageBlockTime = Number(process.env.REACT_APP_AVARAGE_BLOCK_TIME);

const getBlockNumber = async (endDate: any) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
  const currentBlockNumber = await web3.eth.getBlockNumber();
  const currentTime = new Date();
  const duration_time = Number(
    ((endDate.getTime() - currentTime.getTime()) / 1000).toFixed()
  );
  const endBlockNumber =
    Number(currentBlockNumber) +
    Number((duration_time / avarageBlockTime).toFixed());
  return endBlockNumber;
};

export default getBlockNumber;
