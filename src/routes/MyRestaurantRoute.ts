import express from "express"; // Importa Express para manejar rutas y solicitudes HTTP
import multer from "multer"; // Importa Multer para manejar la carga de archivos
import MyRestaurantController from "../controllers/MyRestaurantController"; // Importa el controlador de restaurante
import { jwtCheck, jwtParse } from "../middleware/auth"; // Importa los middlewares de autenticación
import { validateMyRestaurantRequest } from "../middleware/validation"; // Importa el middleware para la validación de los datos

const router = express.Router(); // Crea un enrutador de Express para manejar las rutas

// Configuración de Multer para almacenar los archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage, // Establece el almacenamiento en memoria
  limits: {
    fileSize: 5 * 1024 * 1024, // Limita el tamaño de archivo a 5MB
  },
});

// Ruta para obtener las órdenes de un restaurante, con autenticación y autorización
router.get(
  "/order",
  jwtCheck, // Verifica que el token JWT sea válido
  jwtParse, // Extrae y valida el usuario desde el token JWT
  MyRestaurantController.getMyRestaurantOrders // Llama al método para obtener las órdenes del restaurante
);

// Ruta para actualizar el estado de una orden específica, con autenticación y autorización
router.patch(
  "/order/:orderId/status",
  jwtCheck, // Verifica que el token JWT sea válido
  jwtParse, // Extrae y valida el usuario desde el token JWT
  MyRestaurantController.updateOrderStatus // Llama al método para actualizar el estado de la orden
);

// Ruta para obtener la información del restaurante, con autenticación y autorización
router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

// Ruta para crear un nuevo restaurante, con validación de datos, autenticación y autorización
router.post(
  "/",
  upload.single("imageFile"), // Permite cargar un solo archivo bajo el campo "imageFile"
  validateMyRestaurantRequest, // Valida los datos de la solicitud
  jwtCheck, // Verifica que el token JWT sea válido
  jwtParse, // Extrae y valida el usuario desde el token JWT
  MyRestaurantController.createMyRestaurant // Llama al método para crear un nuevo restaurante
);

// Ruta para actualizar la información del restaurante, con validación de datos, autenticación y autorización
router.put(
  "/",
  upload.single("imageFile"), // Permite cargar un solo archivo bajo el campo "imageFile"
  validateMyRestaurantRequest, // Valida los datos de la solicitud
  jwtCheck, // Verifica que el token JWT sea válido
  jwtParse, // Extrae y valida el usuario desde el token JWT
  MyRestaurantController.updateMyRestaurant // Llama al método para actualizar el restaurante
);

export default router; // Exporta el enrutador para su uso en otras partes de la aplicación
