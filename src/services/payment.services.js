import Stripe from "stripe";
import environmentConfig from "../enviroments.js";

//private key
const key = environmentConfig.KEY;

export default class PaymentService {
  constructor() {
    this.stripe = new Stripe(key);
  }

  createPaymentIntent = async (data) => {
    try {
      const paymentIntent = this.stripe.paymentIntents.create(data);
      console.log("paymentIntent", paymentIntent);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  };
}
