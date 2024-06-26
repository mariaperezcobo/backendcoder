import AxiosClient from "./axiosClient.js";

const { REACT_APP_BASE_URL, REACT_APP_PAYMENT_ENDPOINT } = process.env;

export default class PaymentService {
  constructor() {
    this.client = new AxiosClient();
  }


  createPaymentIntent = ({ productId, callbackSuccess, callbackError }) => {
    console.log('ver si entra en payment services')
    console.log('REACT_APP_BASE_URL', REACT_APP_BASE_URL)

    const requestInfo = {
      url: `${REACT_APP_BASE_URL}${REACT_APP_PAYMENT_ENDPOINT}/payment-intents/?id=${productId}`,
      callbackSuccess,
      callbackError,
    };
    this.client.makePostRequest(requestInfo);
  };

  pay = ({ body, callbackSuccess, callbackError }) => {
    const requestInfo = {
      url: `${REACT_APP_BASE_URL}${REACT_APP_PAYMENT_ENDPOINT}/checkout`,
      body,
      config: getHeaders(),
      callbackSuccess,
      callbackError,
    };
    this.client.makePostRequest(requestInfo);
  };
}
