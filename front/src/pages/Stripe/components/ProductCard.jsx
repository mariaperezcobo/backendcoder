
import styles from '../Stripe.module.scss'

const ProductCard = ({ product, setCurrentProduct}) => {
    console.log('product:', product);

    return (<>
    <div className={styles.contenedorProductos2}>
        <div className={styles.contenedorProductos}>
        <p className={styles.titulo_card2}>Se generó la orden con el siguiente número. </p>
        <p className={styles.titulo_card2}> Seleccionala para ir a pagar</p>
        </div>

<div className={styles.contenedorProductos}>
<div className={styles.productCard2} onClick={()=>setCurrentProduct(product.id)}>
           
           <p>{product.id}</p>
           <p>{product.price}</p>
       </div>
</div>

    </div>
     
    </>)
}

export default ProductCard;