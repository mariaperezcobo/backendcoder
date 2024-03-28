import { Router } from "express";
import PaymentService from "../services/payment.services.js";
import { TicketService } from "../services/index.js";

const router = Router();

router.post("/payment-intents/:id", async (req, res) => {
  const { id } = req.params;
  logger.debug(`ID: ${id}`);

  const productRequested = await TicketService.getTicketById(id);
  if (!productRequested) return res.status(404).send("ticket not found");

  const paymentIntentInfo = {
    amount: productRequested.amount,
    currency: "usd",
    payment_method_types: ["card"],
  };

  const service = new PaymentService();
  const result = await service.createPaymentIntent(paymentIntentInfo);
  console.log("result", result);
  return res.send({ status: "success", payload: result });
});

export default router;
