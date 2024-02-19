
import UserRegisterModel from '../dao/models/userregister.model.js'
import passport from 'passport'
import logger from '../logging/logger.js'

export const loginUser =async(req,res) =>{
  try{

  }catch{

  }
    passport.authenticate('login', {failureRedirect: '/'}, (err,user)=>{

        if(err){
          logger.error('Passport error:', err);
            //console.error('Passport error:', err);
            return res.status(500).send('An error occurred')
        }
        if(!user){
          logger.warn('User not found');
           // console.log('User not found');
            return res.status(400).send('invalid credentials')
        }
        //console.log('User authenticated successfully');
        logger.info(`User authenticated successfully: ${user.username}`);
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
              logger.error('logout error:', err);
                return res.send('logout error');
            }
            req.session.destroy(function(err) {
                if (err) {
                  logger.error('logout error:', err);
                    return res.send('logout error');
                }
                return res.redirect('/');
            });
        });
    };

    // Middleware para verificar el rol del usuario
    export function isAdmin(req, res, next) {
    // Verificar si el usuario está autenticado y tiene el rol de admin
    if (req.session?.user && (req.session.user.rol === 'admin' || req.session.user.rol === 'premium')) {
      return next();
    }
  
    // Si el usuario no es admin, redirigir a otra página o enviar un error
    res.status(403).send(`
    <script>
        alert('Acceso denegado: solo los administradores o los premium pueden realizar esta acción');
        window.location.href = '/productsmongoose';  
      </script>
    `
    );
  }
 

  export function isAdminEliminate(req, res, next) {
    // Verificar si el usuario está autenticado y tiene el rol de admin
    if (req.session?.user && (req.session.user.rol === 'admin' || req.session.user.rol === 'premium')) {
      return next();
    }
  
    // Si el usuario no es admin, redirigir a otra página o enviar un error
    res.status(403).json({ error: 'Acceso denegado: solo los administradores pueden realizar esta acción' });
  }

 export function isUser(req, res, next) {

  logger.info(`Estado de la sesión en isUser middleware: ${req.session}`);
  console.log('Estado de la sesión en isUser middleware:', req.session);
    // Verificar si el usuario está autenticado y tiene el rol de admin
    if (req.session?.user && req.session.user.rol !== 'admin') {
      return next();
    }else{
  // Si el usuario no es admin, redirigir a otra página o enviar un error
  res.status(403).send(`
  <script>
      alert('Acceso denegado: solo los usuarios pueden realizar esta acción');
      window.location.href = '/productsmongoose';  
    </script>
  `
  );

    }
  
  
  }

