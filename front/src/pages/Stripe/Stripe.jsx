import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';
import Wrapper from '../../components/Wrapper';
import styles from './Stripe.module.scss';
import ProductCard from './components/ProductCard';
import PaymentService from '../../services/paymentService';
import { useParams } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);



const Stripe = () => {
    console.log('ver si entra en este codigo')
    const [currentProduct, setCurrentProduct] = useState(null);
   
    const [clientSecret,setClientSecret] = useState(null);

    const { ticketId } = useParams();

    console.log('tikcetId desde front',ticketId)


    const mockCart = [
        { id: ticketId },
       
    ]

    useEffect(() => {
        const getClientSecret = async () => {
            console.log(currentProduct);
            const service = new PaymentService();
            service.createPaymentIntent({productId:currentProduct,callbackSuccess:callbackSuccessPaymentIntent,callbackError:callbackErrorPaymentIntent})
        }
        currentProduct&&getClientSecret();
    }, [currentProduct])

    const callbackSuccessPaymentIntent = (res) =>{
        setClientSecret(res.data.payload.client_secret)
    }

    const callbackErrorPaymentIntent = err => {
        console.log(err);
    }
    return (<>

<div className={styles.contenedorProductos}>
<div className={styles.contenedorTituloPrincipal}>
 <h2>Iniciar Pago</h2>
  </div>
  
  
        <div className={styles.contenedorProductos} >
            <Wrapper hidden={currentProduct}>
                <div className={styles.productsContainer}>

                    {mockCart.map(product => <ProductCard key={product.id} product={product} setCurrentProduct={setCurrentProduct} />)}
                </div>
            </Wrapper>
            <Wrapper hidden={!clientSecret||!stripePromise}>
                <Elements stripe={stripePromise} options={{clientSecret:clientSecret}}>
                    <PaymentForm/>
                </Elements>
            </Wrapper>
        </div>       
           
          

    




</div>
    

    </>)
}

export default Stripe;
