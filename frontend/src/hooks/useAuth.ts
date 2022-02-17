import Cookies from "universal-cookie";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { BscConnector, NoBscProviderError } from "@binance-chain/bsc-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";
import useWeb3Provider from "./useActiveWeb3React";
import {
  ConnectorNames,
  connectorLocalStorageKey,
} from "@pancakeswap-libs/uikit";
import useToast from "./useToast";
import { connectorsByName, signMessage } from "../utils/web3React";
import { setupNetwork } from "../utils/wallet";
import * as actions from "../store/actions";
import { fetchAccessToken } from "../store/actions/thunks";
import { fetchAuthInfo } from "../store/actions/thunks";
import { Web3Provider } from "@ethersproject/providers";
import { Dispatch } from "redux";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useAuth = () => {
  const { activate, deactivate, account } = useWeb3React();
  const { library, connector } = useWeb3Provider();
  const { toastError, toastInfo } = useToast();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  // const chainId = 3;

  const conActivate = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID];
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              activate(connector);
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey);
            if (
              error instanceof NoEthereumProviderError ||
              error instanceof NoBscProviderError
            ) {
              toastError("Provider Error", "No provider was found");
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector;
                walletConnector.walletConnectProvider = null;
              }
              toastError(
                "Authorization Error",
                "Please authorize to access your account"
              );
            } else {
              toastError(error.name, error.message);
            }
          }
        });
      } else {
        toastError("Unable to find connector", "The connector config is wrong");
      }
    },
    [activate, toastError]
  );

  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID];
      if (account) {
        signin(connector, account, library, dispatch);
      } else {
        if (connectorID==="injected" && window.ethereum) {
          await activate(connector);
          const public_address = window.ethereum.selectedAddress;
          await signin(connector, public_address, library, dispatch);
        } else {
          toastError(
            "Unable to find connector",
            "The connector config is wrong"
          );
        }
      }
    },
    [activate]
  );

  const logout = useCallback(() => {
    dispatch(actions.getAccessToken.failure());
    dispatch(actions.setAuthStatus.failure());
    cookies.remove(process.env.REACT_APP_TOKEN_COOKIE_NAME);
    cookies.remove(process.env.REACT_APP_ADDRESS_COOKIE_NAME);
    if (window.localStorage.getItem("walletconnect")) {
      connectorsByName.walletconnect.close();
      connectorsByName.walletconnect.walletConnectProvider = null;
    }
    window.localStorage.removeItem(connectorLocalStorageKey);
    toastInfo("Information", "Successfully logout!");
  }, [deactivate]);

  const signin = async (
    connector: AbstractConnector,
    public_address: string,
    provider: Web3Provider | undefined,
    dispatch: Dispatch<any>
  ) => {
    var user_obj = [];

    try {
      user_obj = await fetch(
        `${backendUrl}/vega/singleuser?publicAddress=${public_address}`
      ).then((response) => response.json());
    } catch (err) {
      toastError("Error", err.message);
    }

    let current_user =
      user_obj.user.length && user_obj.user.length != 0
        ? {
            public_address: user_obj.user[0].public_address,
            nonce: user_obj.user[0].nonce,
          }
        : await handleSignup(public_address);

    // Popup MetaMask confirmation modal to sign message
    const message = `I am signing into vega NFT marketplace with my one-time nonce: ${current_user.nonce}`;
    let mySignature = await signMessage(
      connector,
      provider,
      current_user.public_address,
      message
    );

    if (mySignature) {
      await dispatch(fetchAccessToken(account, mySignature));
      await dispatch(fetchAuthInfo(account));
    }
  };

  const handleSignup = (publicAddress: any) => {
    return fetch(`${backendUrl}/vega/createuser`, {
      body: JSON.stringify({ public_address: publicAddress }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());
  };

  return { conActivate, login, logout };
};

export default useAuth;
