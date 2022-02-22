import { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap-libs/uikit'
import useAuth from './useAuth'
import { connectorsByName } from '../utils/web3React'
import { useWeb3React } from '@web3-react/core'
import { getBalance } from "../utils/getBalance";
import { getMyBalance } from '../store/actions';

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },
      set(bsc) {
        this.bsc = bsc

        resolve()
      },
    }),
  )

const useEagerConnect = () => {
  const { conActivate } = useAuth()
  const { activate, account } = useWeb3React()
  const dispatch = useDispatch();

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames
    const isSupportedConnectorId = Object.values(ConnectorNames).includes(connectorId)
    if (connectorId && isSupportedConnectorId) {
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => conActivate(connectorId))
        return
      }

      conActivate(connectorId)
    } else {
      const injected = connectorsByName[ConnectorNames.Injected]
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
            conActivate(ConnectorNames.Injected)
        } else {
          // eslint-disable-next-line no-lonely-if
          if (window.ethereum) {
            conActivate(ConnectorNames.Injected)
          }
        }
      })
    }

    if(account) {
      getBal(account);
    }
  }, [account, activate, conActivate])

  const getBal = async (account: string) => {
    const wallet_balance = await getBalance(account);
    dispatch(getMyBalance(wallet_balance));
  }
}

export default useEagerConnect
