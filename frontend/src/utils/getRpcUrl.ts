import sample from 'lodash/sample'

if (
  process.env.NODE_ENV !== 'production' &&
  (!process.env.REACT_APP_RPC_URL)
) {
  throw Error('One base RPC URL is undefined')
}

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_RPC_URL]

const getNodeUrl = () => {
  // Use custom node if available (both for development and production)
  // However on the testnet it wouldn't work, so if on testnet - comment out the NEXT_PUBLIC_NODE_PRODUCTION from env file
  if (process.env.REACT_APP_RPC_URL_PRODUCT) {
    return process.env.REACT_APP_RPC_URL_PRODUCT
  }
  return sample(nodes)
}

export default getNodeUrl
