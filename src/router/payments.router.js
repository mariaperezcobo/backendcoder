import { Router } from "express";
import { pagar, paymentIntents } from "../controllers/payments.js";

const router = Router();

router.post("/payment-intents", paymentIntents);

router.get("/pagar", pagar);

export default router;
