const ethSigUtil = require("eth-sig-util");
const ethereumJS = require("ethereumjs-util");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const config = require("../config");

class AuthController {
  createSignature = async (req, res) => {
    const { signature, publicAddress } = req.body;
    if (!signature || !publicAddress) {
      return res
        .status(400)
        .send({ error: "Request should have signature and publicAddress" });
    }

    ////////////////////////////////////////////////////
    // Step 1: Get the user with the given publicAddress
    ////////////////////////////////////////////////////
    const user = await UserModel.findOne({ public_address: publicAddress });
    if (!user) {
      res.status(401).send({
        error: `User with publicAddress ${publicAddress} is not found in database`,
      });

      return null;
    }
    ////////////////////////////////////////////////////
    // Step 2: Verify digital signature
    ////////////////////////////////////////////////////
    const msg = `I am signing into vega NFT marketplace with my one-time nonce: ${user.nonce}`;

    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = ethereumJS.bufferToHex(Buffer.from(msg, "utf8"));
    const address = ethSigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });
    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial publicAddress
    if (address.toLowerCase() === publicAddress.toLowerCase()) {
      ////////////////////////////////////////////////////
      // Step 3: Create JWT
      ////////////////////////////////////////////////////
      await jwt.sign(
        {
          payload: {
            id: user.id,
            publicAddress,
          },
        },
        config.secret,
        {
          algorithm: config.algorithms[0],
        },
        (err, token) => {
          if (err) {
            res.status(401).send({
                error: err,
              });        
          }
          if (!token) {
            res.status(401).send({
                error: new Error("Empty token"),
              });
        
          }
          res.status(200).send({'access_token':token});
        }
      );
    } else {
      res.status(401).send({
        error: "Signature verification failed",
      });
    }
  };
}

module.exports = new AuthController();
