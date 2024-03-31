import logger from "../logging/logger.js";
import passport from "passport";

//Middleware para verificar el rol del usuario
export function isAdmin(req, res, next) {
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (req.user && (req.user.rol === "admin" || req.user.rol === "premium")) {
    return next();
  }

  // Si el usuario no es admin, redirigir a otra página o enviar un error
  res.status(403).send(`
    <script>
        alert('Acceso denegado: solo los administradores o los premium pueden realizar esta acción');
        window.location.href = '/productsmongoose';
      </script>
    `);
}

export function isAdminOnly(req, res, next) {
  console.log(req.user);
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (req.user && req.user.rol === "admin") {
    return next();
  }

  // Si el usuario no es admin, redirigir a otra página o enviar un error
  res.status(403).send(`
    <script>
        alert('Acceso denegado: solo los administradores pueden realizar esta acción');
        window.location.href = '/productsmongoose';
      </script>
    `);
}
export function noIsAdminOnly(req, res, next) {
  console.log(req.user);
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (req.user && req.user.rol !== "admin") {
    return next();
  }

  // Si el usuario no es admin, redirigir a otra página o enviar un error
  res.status(403).send(`
    <script>
        alert('Acceso denegado: no puedes realizar esta acción');
        window.location.href = '/productsmongoose';
      </script>
    `);
}
export function isAdminEliminate(req, res, next) {
  // Verificar si el usuario está autenticado y tiene el rol de admin

  if (req.user && (req.user.rol === "admin" || req.user.rol === "premium")) {
    return next();
  }

  // Si el usuario no es admin, redirigir a otra página o enviar un error
  res.status(403).json({
    error:
      "Acceso denegado: solo los administradores pueden realizar esta acción",
  });
}

export function auth(req, res, next) {
  if (!req.user) {
    console.log("usuario no logueado");
    // Si no hay un usuario adjunto al objeto `req`, redirige a la página de inicio de sesión
    return res.redirect("/login");
  }

  // Si hay un usuario adjunto al objeto `req`, continúa con la siguiente función middleware
  next();
}

export const requireAuth = (req, res, next) => {
  // Utiliza Passport para autenticar la solicitud
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send(`
      <script>
        alert('No está logueado. Serás redirigido a la página de login.');
        window.location.href = '/login'; 
      </script>
    `);
    }
    // Si el usuario está autenticado, continúa con la siguiente función middleware
    req.user = user;
    next();
  })(req, res, next);
};

export function isUser(req, res, next) {
  logger.info(`Estado de la sesión en isUser middleware: ${req.user}`);
  console.log("Estado de la sesión en isUser middleware:", req.user);
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (req?.user && req.user.rol !== "admin") {
    return next();
  } else {
    // Si el usuario no es admin, redirigir a otra página o enviar un error
    res.status(403).send(`
  <script>
      alert('Acceso denegado: solo los usuarios pueden realizar esta acción');
      window.location.href = '/productsmongoose';
    </script>
  `);
  }
}

export function justPublicWhitoutSession(req, res, next) {
  if (req.user) return res.redirect("/profile");
  return next();
}
