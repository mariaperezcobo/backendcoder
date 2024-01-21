
import ProductsModel from "../models/prodmongoose.models.js"

export default class Products {
    getProducts = async () => { return ProductsModel.find() }

    getProductsPaginate = async (searchQuery, options) => {
        try {
            const products = await ProductsModel.paginate(searchQuery, options);
    
            //// Convertir cada documento a un objeto plano
            //const productsPlain = products.docs.map(doc => doc.toObject());
    
            // Verificar si cada documento es un objeto plano antes de intentar convertirlo
        const productsPlain = products.docs.map(doc => {
            return typeof doc.toObject === 'function' ? doc.toObject() : doc;
        });

            // Devolver los resultados paginados con documentos convertidos
            return {
                ...products,
                docs: productsPlain
            };
    
        } catch (error) {
            console.error('Error in getProductsPaginate:', error);
            throw error;
        }
       
      
    }
    
      
    getProductsById = async id => { const product = await ProductsModel.findById(id);
        return product ? product.toObject({ virtuals: true }) : null; }

    deleteProduct = async id =>{return ProductsModel.deleteOne({_id: id })}    
    getProductsFindOne = async code => { return ProductsModel.findOne(code) }
    addProduct = async productmongooseNew => { return ProductsModel.create(productmongooseNew) }
   
    updateProduct =  async (id, update) =>{try {
        const updatedProduct = await ProductsModel.findByIdAndUpdate(id, update);
        return updatedProduct;
    } catch (error) {
        console.error('Error en updateCart:', error);
        throw error;
    }}    
}



// import ProductsModel from "../models/prodmongoose.models.js";


//     export const getProducts =async(req=request,res=response)=>{
//             try{
//                 //     const carrito = await CartModel.findOne({}) 
//                 //     console.log(carrito)
//                     // let cid
                   
//                     // if(carrito){
//                     //     cid = carrito.id
//                     // }else{
//                     //     carrito = await CartModel.create({ productosagregados: [] })
//                     //     cid = carrito.id
//                     // }
            
//                       // const usuario = await UserRegisterModel.find()
//                    const user = req.session.user
//                    const cid = req.session.user.cart;
            
//                     const limit = parseInt(req.query?.limit ?? 10)
//                     const page = parseInt(req.query?.page ?? 1)
//                     const query = req.query?.query ?? ''
//                     const categoria = req.query?.categoria ?? ''
//                     const stock = req.query?.stock ?? ''
//                     const precio = req.query?.precio ?? ''
            
//                     const search = {}
//                     // const filtro = {}
//                     if (query) search.title = {"$regex": query, "$options": "i"}
                    
//                     if (categoria && categoria !== 'todos') {
//                         search.category = { "$regex": categoria, "$options": "i" };
//                     }
            
//                     if (stock && stock !== 'todos') {
//                         search.stock = {'$gt': 1}
//                     }
            
//                     let sortDirection = 1
//                     if (precio === 'menor') {
//                         sortDirection = 1
//                     } if (precio === 'mayor'){
//                         sortDirection = -1}
//                         else{
//                         sortDirection = 1
//                     }
            
            
//                     const searchQuery = { ...search };
            
//                     const result = await ProductsModel.paginate(searchQuery,{
//                         page,
//                         limit,
//                         lean:true,
//                         sort: {price: sortDirection}
//                     })
                    
//                    // console.log(result.docs)
//                     //console.log(productsmongoose)
            
//                     result.productsmongoose = result.docs
//                     result.query = query
//                     delete result.docs
                    
//                     result.productsmongoose.forEach(product => {
//                         product.cid = cid;
//                     });
                    
//                    //console.log(result)
//                    //console.log(result)
                    
//                     res.render('list', {
//                         user,
//                         result,
                       
//                         cid,
//                         style: 'index.css',
//                         title: 'Fitness Ropa deportiva',
//                     })
            
//                 }catch(error){
//                     console.error('error', error)
//                     console.error(error)
//                 }  
//          }
         
        
//          export const  getProductsById =async(req=request,res=response)=>{
//             try{
//                 const {code} = req.params
//                 const productmongoose = await ProductsModel.findOne({code}).lean().exec()
        
//                 res.render('one',{
//                     productmongoose,
//                     style: 'index.css',
//                     title: 'Fitness Ropa deportiva',
//                 })
//             }catch (error){
//                 res.send('error al buscar el producto')
        
//             }
//          }
        
//          export const addProduct =async(req=request,res=response)=>{
//             try{
//                 const productmongooseNew = req.body
//                 const result = await ProductsModel.create(productmongooseNew)
        
//                 // console.log(result)
//                 res.redirect('/productsmongoose')
        
//             }catch (error){
//                 console.log(error),
//                 res.send('error al crear productos con mongoose')
//             }
//          }
        
//          export const deleteProduct =async(req=request,res=response)=>{
//             try{
//                 const {id} = req.params
//                 await ProductsModel.deleteOne({ _id: id})
        
//                 return res.json({status: 'success'})
//             }catch (error){
//                 res.status(500).json(error)
//         console.log(error)
//             }
//          }
        
//          export const addProductInCart =async(req=request,res=response)=>{
               
//             try{
        
//                 const cid = req.params.cid   
//                 const pid = req.params.pid
                
//                 const carrito = await CartModel.findById(cid) 
        
//                  console.log('param', cid, pid)
        
                       
//                 const productoInCart = carrito.productosagregados.find(p => p.product._id.toString() === pid);
//                 //console.log(productoInCart)
//                 if (productoInCart){
//                     productoInCart.quantity++;
//                 }
                
//             else{
//                 const newProduct = { product: pid, quantity: 1}
//                 carrito.productosagregados.push(newProduct);
//             }
              
        
//                await carrito.save();
        
//                 //return res.json({ msg: 'Carrito actualizado!', carrito });
        
//             }catch (error){
//                 console.error('error al agregar un prod', error)
//                 res.status(500).json({error: 'error 3', details: error.message})
//                }  
//         }
         
        
//         export const createProduct = (req=request,res=response)=>{
//             res.render('create', {
//                 style: 'index.css',
//                 title: 'Fitness Ropa deportiva',
//             }
//             )
//          }

