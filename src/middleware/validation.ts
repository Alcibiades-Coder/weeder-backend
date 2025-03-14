import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Middleware para manejar los errores de validación y devolver una respuesta de error si hay problemas
const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req); // Obtiene los errores de validación del request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Devuelve un error 400 con los detalles de validación
  }
  next(); // Continúa con la siguiente función de middleware si no hay errores
};

// Middleware de validación para solicitudes de usuario
export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("El nombre debe ser un texto"), // Verifica que el campo "name" sea un string y no esté vacío
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("La dirección debe ser un texto"), // Verifica que "addressLine1" sea un string y no esté vacío
  body("city").isString().notEmpty().withMessage("La ciudad debe ser un texto"), // Verifica que "city" sea un string y no esté vacío
  body("country")
    .isString()
    .notEmpty()
    .withMessage("El país debe ser un texto"), // Verifica que "country" sea un string y no esté vacío
  handleValidationErrors, // Llama a la función que maneja errores de validación
];

// Middleware de validación para solicitudes de restaurantes
export const validateMyRestaurantRequest = [
  body("restaurantName")
    .notEmpty()
    .withMessage("El nombre del restaurante es requerido"), // Verifica que "restaurantName" no esté vacío
  body("city").notEmpty().withMessage("La ciudad es requerida"), // Verifica que "city" no esté vacío
  body("country").notEmpty().withMessage("El país es requerido"), // Verifica que "country" no esté vacío
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("El precio de envío debe ser un valor positivo"), // Verifica que "deliveryPrice" sea un número flotante positivo
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage(
      "El tiempo estimado de entrega debe ser un valor entero positivo"
    ), // Verifica que "estimatedDeliveryTime" sea un número entero positivo
  body("cuisines")
    .isArray()
    .withMessage("Las cocinas deben ser un arreglo")
    .not()
    .isEmpty()
    .withMessage("Las cocinas no pueden estar vacías"), // Verifica que "cuisines" sea un arreglo y no esté vacío
  body("menuItems")
    .isArray()
    .withMessage("Los elementos del menú deben ser un arreglo"), // Verifica que "menuItems" sea un arreglo
  body("menuItems.*.name")
    .notEmpty()
    .withMessage("El nombre del elemento del menú es requerido"), // Verifica que cada elemento de "menuItems" tenga un "name" no vacío
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage(
      "El precio del elemento del menú es requerido y debe ser un valor positivo"
    ), // Verifica que cada "menuItem" tenga un "price" positivo
  handleValidationErrors, // Llama a la función que maneja errores de validación
];
