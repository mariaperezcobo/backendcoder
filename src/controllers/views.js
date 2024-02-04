import {request, response} from 'express'
import ProductManager from '../dao/managers/productManager.js'
import passport from 'passport'
import logger from '../logging/logger.js'

export const profileUser =async(req=request,res=response)=>{
    try{
        const user = req.session.user

        res.render('profile',
            {
                user,
                style: 'index.css',
                title: 'Fitness Ropa deportiva',
            } 
        )
    }catch (error){
        logger.error(`User error: ${error.message}`);
       // console.error('error', error)
    }
 }


 export const initUser =async(req=request,res=response)=>{
    try{
        const user = req.session.user

        return  res.render('index',{
         user,
         style: 'index.css',
         title: 'Fitness Ropa deportiva',
        })
    }catch (error){
        logger.error(`EUser error from initUser: ${error.message}`);
       // console.error('error', error)
    }
 }
 export const loginView =async(req=request,res=response)=>{
    try{
        return res.render('login', {
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        })
    }catch (error){
        logger.error(`Error t: ${error.message}`);
        //console.error('error', error)
    }
 }

 export const registerView =async(req=request,res=response)=>{
    try{
        return res.render('registeruser',{
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        })
    }catch (error){
        console.error('error', error)
    }
 }

 export const homeView =async(req=request,res=response)=>{
    try{
        const productManager = new ProductManager()
        const products = await productManager.getProducts()
      
        res.render('home', {
               products,
               style: 'index.css',
               title: 'Fitness Ropa deportiva',
               
            })

    }catch (error){
        console.error('error', error)
    }
 }

 export const realtimeproductsView =async(req=request,res=response)=>{
    try{
        const productManager = new ProductManager()
        const products = await productManager.getProducts()
        res.render('realtimeproducts',{
            products,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        })
    }catch (error){
        console.error('error', error)
    }
 }








