import React from 'react'
import { Button, useWalletModal } from '@pancakeswap-libs/uikit'
import useAuth from '../hooks/useAuth'

const ConnectWalletButton = React.forwardRef<HTMLButtonElement>((props, ref) => {
  const { login, logout} = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button ref={ref} onClick={onPresentConnectModal} {...props}>
      Connect Wallet
    </Button>
  )
});

export default ConnectWalletButton
