import React from "react";
import { ThemeProvider } from "styled-components";
import { ModalProvider } from "@pancakeswap-libs/uikit";
import { Web3ReactProvider } from "@web3-react/core";
import { ToastsProvider } from "../contexts/ToastsContext";
import { getLibrary } from "../utils/web3React";
import { light } from "@pancakeswap-libs/uikit";

// redux store
import { Provider } from "react-redux";
import store from "../store";

const ThemeProviderWrapper = (props: any) => {
  return <ThemeProvider theme={light} {...props} />;
};

const Providers: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProviderWrapper>
          <ToastsProvider>
            <ModalProvider>{children}</ModalProvider>
          </ToastsProvider>
        </ThemeProviderWrapper>
      </Web3ReactProvider>
    </Provider>
  );
};

export default Providers;
