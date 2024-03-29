
import styles from '../Stripe.module.scss'

const ProductCard = ({ product, setCurrentProduct}) => {
    return (<>
        <div className={styles.productCard} onClick={()=>setCurrentProduct(product.id)}>
            <p>{product.id}</p>
            <p>{product.price}</p>
        </div>
    </>)
}

export default ProductCard;