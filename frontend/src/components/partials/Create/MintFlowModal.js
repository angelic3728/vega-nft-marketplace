import React from "react";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import { Modal, ModalBody, Text, Image } from "@pancakeswap-libs/uikit";

const MintFlowModal = ({ onDismiss }) => {
  const { account, chainId } = useActiveWeb3React();

  return (
    <Modal title="Minting Flow" onDismiss={onDismiss}>
      <ModalBody>
        <Text>Asset is minting now!</Text>
        <Image src="/img/loading/loading.gif" width={270} height={180} />
      </ModalBody>
    </Modal>
  );
};

export default MintFlowModal;
