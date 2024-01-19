
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


export const registerUser = async (req, res) => {
    try {
        const registeredUser = await new Promise((resolve, reject) => {
            passport.authenticate('registeruser', { failureRedirect: '/' }, (err, user) => {
                if (err) {
                    console.error('Passport error:', err);
                    reject('Error to register');
                }
                if (!user) {
                    console.log('User registration failed');
                    reject('User registration failed');
                }
                resolve(user);
            })(req, res);
        });

        // Ahora, después de que el usuario se haya registrado correctamente, busca el usuario en la base de datos
        const usuarioCreado = await UserRegisterModel.findOne({ email: registeredUser.email });
        console.log('Usuario creado en la base de datos:', usuarioCreado);

        req.session.user = usuarioCreado;
        return res.redirect('/login');
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).send('An error occurred during user registration');
    }
};


// export const registerUser =async(req,res) =>{

//     passport.authenticate('registeruser', {failureRedirect: '/'}, (err,user)=>{

   
//  return res.redirect('/login')
//  })(req, res);


// }
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
    


