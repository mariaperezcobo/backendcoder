import logger from "../logging/logger.js";

//Middleware para verificar el rol del usuario
export function isAdmin(req, res, next) {
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (
    req.user &&
    (req.user.rol === "admin" || req.session.user.rol === "premium")
  ) {
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

export function isAdminEliminate(req, res, next) {
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (
    req.user &&
    (req.user.rol === "admin" || req.session.user.rol === "premium")
  ) {
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
    // Si no hay un usuario adjunto al objeto `req`, redirige a la página de inicio de sesión
    return res.redirect("/login");
  }

  // Si hay un usuario adjunto al objeto `req`, continúa con la siguiente función middleware
  next();
}
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
