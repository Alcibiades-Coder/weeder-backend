import express from "express"; // Importa Express para manejar rutas y solicitudes HTTP
import { jwtCheck, jwtParse } from "../middleware/auth"; // Importa los middlewares de autenticación para verificar y analizar el JWT
import OrderController from "../controllers/OrderController"; // Importa el controlador de órdenes

const router = express.Router(); // Crea un enrutador de Express para manejar las rutas

// Ruta para obtener las órdenes del usuario actual, con autenticación y autorización
router.get("/", jwtCheck, jwtParse, OrderController.getMyOrders);

// Ruta para crear una sesión de pago con Stripe, con autenticación y autorización
router.post(
  "/checkout/create-checkout-session",
  jwtCheck, // Verifica que el token JWT sea válido
  jwtParse, // Extrae y valida el usuario desde el token JWT
  OrderController.createCheckoutSession // Llama al método para crear una sesión de pago con Stripe
);

// Ruta para manejar los webhooks de Stripe (notificaciones de eventos de pago)
router.post("/checkout/webhook", OrderController.stripeWebhookHandler);

export default router; // Exporta el enrutador para su uso en otras partes de la aplicación
