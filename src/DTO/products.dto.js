export default class ProductInsertDTO {

    constructor(product){
        this.title= product?.title ?? "" 
        this.price= product?.price ?? 20000 
        this.thumbnail= product?.thumbnail ?? "" 
        this.description= product?.description ?? "" 
        this.category= product?.category ?? "Remeras" 
        this.code= product?.code ?? 1 
        this.status= product?.status ?? true
        this.stock= product?.stock ?? 10
        this.id = product?.id || product?._id || null;
         }

}

