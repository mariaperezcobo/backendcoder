import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Stripe } from "./pages/Stripe/Stripe";
import { loadStripe } from "@stripe/stripe-js";

// Carga la clave pública de Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Stripe = React.lazy(() => import("./pages/Stripe"));

function App() {
  return (
    <Suspense fallback="loading">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/stripe" element={<Stripe />} />
      </Routes>
    </Suspense>
  );
}

export default App;
