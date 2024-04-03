import { Routes, Route , Link, useParams} from "react-router-dom";
import React, { Suspense } from "react";
import "./App.css";
import { useParams } from 'react-router-dom';

const Home = React.lazy(() => import("./pages/Home"));
const Stripe = React.lazy(() => import("./pages/Stripe"));



function App() {
  return (
    <Suspense fallback="loading">
      <Routes>
        <Route path="" element={<Home />} />
        {/* <Route path="/stripe" element={<Stripe />} /> */}
        <Route path="/pagar/:ticketId" element={<Stripe />} />
      </Routes>
    </Suspense>
  );
}

export default App;
