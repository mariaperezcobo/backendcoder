import Stripe from "stripe";

//private key
const key =
  "sk_test_51OvqE5P6ivAJFcXxx3RGgideVFuqIupAADPCjhfDQY95DI0tZ2kWMAJlMkcVXemAwCq08IlEYatko3Gj7otemutx00Kjzj4kEO";

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
