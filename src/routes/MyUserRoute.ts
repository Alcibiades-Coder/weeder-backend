import express from "express"; // Importa Express para manejar rutas y solicitudes HTTP
import MyUserController from "../controllers/MyUserController"; // Importa el controlador de usuario
import { jwtCheck, jwtParse } from "../middleware/auth"; // Importa los middlewares de autenticación
import { validateMyUserRequest } from "../middleware/validation"; // Importa el middleware para la validación de los datos

const router = express.Router(); // Crea un enrutador de Express para manejar las rutas

// Ruta para obtener la información del usuario actual, con autenticación y autorización
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

// Ruta para crear un nuevo usuario, con autenticación
router.post("/", jwtCheck, MyUserController.createCurrentUser);

// Ruta para actualizar la información del usuario actual, con autenticación, validación de datos y autorización
router.put(
  "/",
  jwtCheck, // Verifica que el token JWT sea válido
  jwtParse, // Extrae y valida el usuario desde el token JWT
  validateMyUserRequest, // Valida los datos de la solicitud
  MyUserController.updateCurrentUser // Llama al método para actualizar la información del usuario
);

export default router; // Exporta el enrutador para su uso en otras partes de la aplicación
