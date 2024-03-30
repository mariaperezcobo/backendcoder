import { Router } from "express";
import PaymentService from "../services/payment.services.js";
import { TicketService } from "../services/index.js";

const router = Router();

// const products = [
//   { id: 1, name: "papas", price: 1000 },
//   { id: 2, name: "queso", price: 500 },
//   { id: 3, name: "hamburguesa", price: 1500 },
//   { id: 4, name: "soda", price: 1000 },
//   { id: 5, name: "golosinas", price: 800 },
// ];

router.post("/payment-intents", async (req, res) => {
  //const { id } = req.params;
  const productId = req.query.id;
  if (!productId) return res.status(400).send("No product id");
  //console.log(`ID: ${id}`);

  try {
    // const product = products.find((p) => p.id == parseInt(productId));
    // if (!product) return res.status(400).send("Product not found");

    // const productRequested = await TicketService.getTicketById(id);
    // if (!productRequested) return res.status(404).send("ticket not found");

    const productRequested = await TicketService.getTicketById(productId);
    if (!productRequested) return res.status(404).send("ticket not found");

    const data = {
      amount: productRequested.amount,
      currency: "usd",
      payment_method_types: ["card"],
    };
    // const data = {
    //   amount: product.price,
    //   currency: "usd",
    //   payment_method_types: ["card"],
    // };

    const service = new PaymentService();
    const result = await service.createPaymentIntent(data);
    console.log("result", result);
    return res.send({ status: "success", payload: result });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/api/test", (req, res) => {
  res.json({
    message:
      "¡La comunicación entre el backend y el frontend funciona correctamente!",
  });
});

router.get("/pagar", (req, res) => {
  const ticketId = req.query.ticket;
  console.log("ticket id", ticketId);
  // Puedes redirigir al usuario a la página de pago en el frontend
  res.redirect(
    // `http://localhost:3000/pagar?ticket=${JSON.stringify(ticketId)}`
    // `http://localhost:3000/pagar?ticket=${ticketId}`
    `http://localhost:3000/pagar/${ticketId}`
  );
});

export default router;
