import { Axios, Canceler } from "../../../core/axios";
import * as actions from "../../actions";
import Cookies from "universal-cookie";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const fetchAccessToken =
  (public_address, signature) => async (dispatch) => {
    dispatch(actions.getAccessToken.request(Canceler.cancel));
    var form = { publicAddress: public_address, signature: signature };
    try {
      const { data } = await Axios.post(
        `${backendUrl}/vega/ethsign`,
        form
      );
      dispatch(actions.getAccessToken.success(data.accessToken));
      const cookies = new Cookies();
      var ex_date = new Date();
      ex_date.setTime(ex_date.getTime() + 60 * 60 * 1000);
      cookies.set(
        process.env.REACT_APP_TOKEN_COOKIE_NAME,
        JSON.stringify(data.accessToken),
        { expires: ex_date }
      );
      cookies.set(
        process.env.REACT_APP_ADDRESS_COOKIE_NAME,
        JSON.stringify(public_address),
        { expires: ex_date }
      );
    } catch (err) {
      dispatch(actions.getAccessToken.failure(err));
    }
  };

export const fetchAuthInfo = (public_address) => async (dispatch) => {
  dispatch(actions.getAuthInfo.request(Canceler.cancel));
  try {
    let query = public_address ? "publicAddress=" + public_address : "";
    const { data } = await Axios.get(
      `${backendUrl}/vega/singleuser?${query}`, {
        cancelToken: Canceler.token,
        params: {},
      });
    dispatch(actions.getAuthInfo.success(data.user[0]));
    dispatch(actions.setAuthStatus.success());
  } catch (err) {
    dispatch(actions.getAuthInfo.failure(err));
    dispatch(actions.setAuthStatus.failure());
  }
};
