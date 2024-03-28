import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements , CardElement} from '@stripe/react-stripe-js';
import {PaymentForm} from './components/PaymentForm.jsx'
import {PaymentService} from '../../services/paymentService.js'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);



const Stripe = () => {
    // const [currentProduct, setCurrentProduct] = useState(null);
    const [clientSecret,setClientSecret] = useState(null);

    const mockCart = [
        { id: 1, name: "papas", price: 1000 },
        { id: 2, name: "queso", price: 500 },
        { id: 3, name: "hamburguesa", price: 1500 },
        { id: 4, name: "soda", price: 1000 },
        { id: 5, name: "golosinas", price: 800 }
    ]

    useEffect(() => {
        const getClientSecret = async () => {
            console.log(currentProduct);
            const service = new PaymentService();
            const {data} = await service.createPaymentIntent()
            setClientSecret(res.data.payload.client_secret)
        }
       getClientSecret();
    }, [])

    // const callbackSuccessPaymentIntent = (res) =>{
        
    // }

    // const callbackErrorPaymentIntent = err => {
    //     console.log(err);
    // }
    return (<>
        <div className={styles.container}>
            <h1 className={styles.title}>Stripe</h1>
        </div>
        <div className={classnames([styles.container, styles.highlighted])}>
        
        
                <Elements stripe={stripePromise} options={{clientSecret:clientSecret}}>
                    <PaymentForm/>
                </Elements>
        
        </div>
    </>)
}

export default Stripe;