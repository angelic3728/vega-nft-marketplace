import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap-libs/uikit'
import useAuth from './useAuth'
import { connectorsByName } from '../utils/web3React'
import { useWeb3React } from '@web3-react/core'

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
  const { activate } = useWeb3React()

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
  }, [activate, conActivate])
}

export default useEagerConnect
