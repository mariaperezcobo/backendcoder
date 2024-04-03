import { request, response } from "express";
import { TicketService } from "../services/index.js";
import PaymentService from "../services/payment.services.js";
import logger from "../logging/logger.js";
import environmentConfig from "../enviroments.js";

export const pagar = async (req = request, res = response) => {
 //const ticketId = req.params.ticketId;
 const ticketId = req.query.ticket;
 console.log("ticket id", ticketId);

  const redirectBaseUrl = environmentConfig.REDIRECT_URL_BASE ;
  console.log('redirectBaseUrl', redirectBaseUrl)

  //`${redirectBaseUrl}/pagar/${ticketId}`
  // Puedes redirigir al usuario a la página de pago en el frontend
  res.redirect(
   
    `${redirectBaseUrl}/pagar/${ticketId}`
  );
};

export const paymentIntents = async (req = request, res = response) => {
 // const productId = req.params.id;
  const productId = req.query.id;
  if (!productId) return res.status(400).send("No id");
  //console.log(`ID: ${id}`);

  try {
    // const product = products.find((p) => p.id == parseInt(productId));
    // if (!product) return res.status(400).send("Product not found");


    const productRequested = await TicketService.getTicketById(productId);
    if (!productRequested) return res.status(404).send("ticket not found");

    const data = {
      amount: productRequested.amount,
      currency: "usd",
      payment_method_types: ["card"],
    };


    const service = new PaymentService();
    const result = await service.createPaymentIntent(data);
    console.log("result", result);
    return res.send({ status: "success", payload: result });
  } catch (error) {
    logger.error("Error:", error);
    return res.status(500).send("Internal server error");
  }
};
