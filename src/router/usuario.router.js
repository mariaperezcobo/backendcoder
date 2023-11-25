// para paginacion clase 17
import { Router } from "express"
import usuarioModel from "../dao/models/usuarios.models.js"




const router = Router()

router.get('/', async (req, res)=>{

    //const limit = parseInt(req.query?.limit ?? 10)
    const result = await usuarioModel.paginate({},{
        page:1,
        limit:10,
        lean: true //para pasar a json

    })

    res.render('pagination',{
        result,
        style: 'index.css',
    })
})
//console.log(result)
export default router