import { Router } from "express";
import { chatPost, chatView } from "../controllers/chat.js";
import { isUser } from "../middlewares/session.middlewares.js";
import passport from "passport";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isUser,
  chatView
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  isUser,
  chatPost
);

// router.get('/', async (req,res)=>{
//     const contenidochat = await ChatModel.find().lean().exec()
//     console.log({contenidochat})
//     const user=req.session.user

//     res.render('chatmongoose', {
//         user,
//         contenidochat,
//         style: 'index.css',
//         title: 'Fitness Ropa deportiva',
//     })
// })

// router.post('/', async (req,res)=>{
//     try{

//         const chatmongooseNew = req.body
//         const resultadochat = await ChatModel.create(chatmongooseNew)
//         console.log(resultadochat)
//         res.redirect('/chatmongoose')
//     }catch(error){
//         console.log(error)
//         res.send('Error al enviar el mensaje')
//     }
// })

export default router;
