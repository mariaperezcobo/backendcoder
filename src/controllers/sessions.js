
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

    // Middleware para verificar el rol del usuario
    export function isAdmin(req, res, next) {
    // Verificar si el usuario está autenticado y tiene el rol de admin
    if (req.session?.user && req.session.user.rol === 'admin') {
      return next();
    }
  
    // Si el usuario no es admin, redirigir a otra página o enviar un error
    res.status(403).send(`
    <script>
        alert('Acceso denegado: solo los administradores pueden realizar esta acción');
        window.location.href = '/productsmongoose';  
      </script>
    `
    );
  }
 

  export function isAdminEliminate(req, res, next) {
    // Verificar si el usuario está autenticado y tiene el rol de admin
    if (req.session?.user && req.session.user.rol === 'admin') {
      return next();
    }
  
    // Si el usuario no es admin, redirigir a otra página o enviar un error
    res.status(403).json({ error: 'Acceso denegado: solo los administradores pueden realizar esta acción' });
  }


