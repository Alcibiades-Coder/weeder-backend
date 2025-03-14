import express from "express"; // Importa Express para manejar rutas y solicitudes HTTP
import { param } from "express-validator"; // Importa el validador de parámetros de la URL
import RestaurantController from "../controllers/RestaurantController"; // Importa el controlador de restaurantes

const router = express.Router(); // Crea un enrutador de Express para manejar las rutas

// Ruta para obtener un restaurante específico usando su ID, con validación del parámetro "restaurantId"
router.get(
  "/:restaurantId", // Define el parámetro dinámico "restaurantId" en la URL
  param("restaurantId") // Valida el parámetro "restaurantId"
    .isString() // Verifica que el valor sea un string
    .trim() // Elimina espacios en blanco al principio y al final
    .notEmpty() // Asegura que no esté vacío
    .withMessage("RestaurantId parameter must be a valid string"), // Mensaje de error si la validación falla
  RestaurantController.getRestaurant // Llama al método del controlador para obtener el restaurante por ID
);

// Ruta para buscar restaurantes por ciudad, con validación del parámetro "city"
router.get(
  "/search/:city", // Define el parámetro dinámico "city" en la URL
  param("city") // Valida el parámetro "city"
    .isString() // Verifica que el valor sea un string
    .trim() // Elimina espacios en blanco al principio y al final
    .notEmpty() // Asegura que no esté vacío
    .withMessage("City parameter must be a valid string"), // Mensaje de error si la validación falla
  RestaurantController.searchRestaurant // Llama al método del controlador para buscar restaurantes por ciudad
);

export default router; // Exporta el enrutador para su uso en otras partes de la aplicación
