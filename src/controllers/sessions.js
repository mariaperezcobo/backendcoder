
import UserRegisterModel from '../dao/models/userregister.model.js'
import passport from 'passport'


export const loginUser =async(req,res) =>{

    passport.authenticate('login', {failureRedirect: '/'}, (err,user)=>{

        if(err){
            console.error('Passport error:', err);
            return res.status(500).send('An error occurred')
        }
        if(!user){
            console.log('User not found');
            return res.status(400).send('invalid credentials')
        }
        //console.log('User authenticated successfully');
        req.session.user = user
        return res.redirect('/productsmongoose')
    })(req, res);


}




export const registerUser =async(req,res) =>{

    passport.authenticate('registeruser', {failureRedirect: '/'}, (err,user)=>{

   
 return res.redirect('/login')
 })(req, res);


}
    export const logOutSession = (req, res) => {
        req.logout(function(err) {
            if (err) {
                return res.send('logout error');
            }
            req.session.destroy(function(err) {
                if (err) {
                    return res.send('logout error');
                }
                return res.redirect('/');
            });
        });
    };
    


