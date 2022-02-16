import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  Modal,
  ModalBody,
  Text,
  Box,
  CardBody,
  Flex,
  Skeleton,
  Svg,
} from "@pancakeswap-libs/uikit";
import * as selectors from "../../../store/selectors";

const MintFlowModal = ({ createMethod, onDismiss }) => {
  const creationStatusState = useSelector(selectors.creationStatusState);
  const creationStatus = creationStatusState ? creationStatusState : 0;

  const getBoxShadow = ({ isActive = false, theme }) => {
    if (isActive) {
      return theme.shadows.active;
    }

    return theme.shadows.inset;
  };

  const CardWrapper = styled.div`
    float: left;
    align-items: center;
    border-radius: 4px;
    box-shadow: ${getBoxShadow};
    background-color: ${({ theme }) => theme.colors.tertiary};
    margin-bottom: 1.5rem;
  `;

  const CheckBoxIcon = () => {
    return (
      <Svg color="success" width="40px" viewBox="0 0 20 20">
        <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
      </Svg>
    );
  };

  const QueueIcon = () => {
    return (
      <Svg color="warning" width="40px" viewBox="0 0 20 20">
        <path d="M10.25,2.375c-4.212,0-7.625,3.413-7.625,7.625s3.413,7.625,7.625,7.625s7.625-3.413,7.625-7.625S14.462,2.375,10.25,2.375M10.651,16.811v-0.403c0-0.221-0.181-0.401-0.401-0.401s-0.401,0.181-0.401,0.401v0.403c-3.443-0.201-6.208-2.966-6.409-6.409h0.404c0.22,0,0.401-0.181,0.401-0.401S4.063,9.599,3.843,9.599H3.439C3.64,6.155,6.405,3.391,9.849,3.19v0.403c0,0.22,0.181,0.401,0.401,0.401s0.401-0.181,0.401-0.401V3.19c3.443,0.201,6.208,2.965,6.409,6.409h-0.404c-0.22,0-0.4,0.181-0.4,0.401s0.181,0.401,0.4,0.401h0.404C16.859,13.845,14.095,16.609,10.651,16.811 M12.662,12.412c-0.156,0.156-0.409,0.159-0.568,0l-2.127-2.129C9.986,10.302,9.849,10.192,9.849,10V5.184c0-0.221,0.181-0.401,0.401-0.401s0.401,0.181,0.401,0.401v4.651l2.011,2.008C12.818,12.001,12.818,12.256,12.662,12.412"></path>
      </Svg>
    );
  };

  return (
    <Modal title="Minting Flow" hideCloseButton={true} onDismiss={onDismiss}>
      <ModalBody>
        <CardWrapper isActive={creationStatus === 0}>
          <CardBody p="0px" px="4px" py="24px">
            <Flex justifyContent="space-between">
              <Box width={creationStatus === 0 ? "100%" : "90%"}>
                <Text textAlign="center">
                  Uploading assets and metadata to the IPFS storage.
                </Text>
                {creationStatus === 0 ?
                <Skeleton
                  mt="5px"
                  animation="waves"
                  variant="rect"
                  width="100%"
                  height={15}
                />
                :
                null}
              </Box>
              {creationStatus !== 0 && (
                <Flex width="10%" justifyContent="center">
                  <CheckBoxIcon />
                </Flex>
              )}
            </Flex>
          </CardBody>
        </CardWrapper>
        <CardWrapper isActive={creationStatus === 1}>
          <CardBody p="0px" px="4px" py="24px">
            <Flex justifyContent="space-between">
              <Box width={creationStatus === 1 ? "100%" : "90%"}>
                <Text textAlign="center">
                  Minting Asset for selling or auction.
                </Text>
                {creationStatus === 1 ?
                <Skeleton
                  mt="5px"
                  animation="waves"
                  variant="rect"
                  width="100%"
                  height={15}
                />
                :
                null}
              </Box>
              {creationStatus !== 1 && (
                <Flex width="10%" justifyContent="center">
                  {creationStatus !== 0?<CheckBoxIcon />:<QueueIcon />}
                </Flex>
              )}
            </Flex>
          </CardBody>
        </CardWrapper>
        {(createMethod===1 || createMethod===3) && <CardWrapper isActive={creationStatus === 2}>
          <CardBody p="0px" px="4px" py="24px">
            <Flex justifyContent="space-between">
              <Box width={creationStatus === 2 ? "100%" : "90%"}>
                <Text textAlign="center">
                  Listing on marketplace
                </Text>
                {creationStatus === 2 ?
                <Skeleton
                  mt="5px"
                  animation="waves"
                  variant="rect"
                  width="100%"
                  height={15}
                />
                :
                null}
              </Box>
              {creationStatus !== 2 && (
                <Flex width="10%" justifyContent="center">
                  {creationStatus < 2?<QueueIcon />:<CheckBoxIcon />}
                </Flex>
              )}
            </Flex>
          </CardBody>
        </CardWrapper>}

        {(createMethod===2 || createMethod===3) && <CardWrapper isActive={creationStatus === 3}>
          <CardBody p="0px" px="4px" py="24px">
            <Flex justifyContent="space-between">
              <Box width={creationStatus === 3 ? "100%" : "90%"}>
                <Text textAlign="center">
                  Open for Auction.
                </Text>
                {creationStatus === 3 ?
                <Skeleton
                  mt="5px"
                  animation="waves"
                  variant="rect"
                  width="100%"
                  height={15}
                />
                :
                null}
              </Box>
              {creationStatus !== 3 && (
                <Flex width="10%" justifyContent="center">
                  {creationStatus<3?<QueueIcon />:<CheckBoxIcon />}
                </Flex>
              )}
            </Flex>
          </CardBody>
        </CardWrapper>}
        
      </ModalBody>
    </Modal>
  );
};

export default MintFlowModal;
