import express, { Request, Response } from "express"; // Importa Express para manejar rutas y solicitudes HTTP y tipos Request y Response
import cors from "cors"; // Importa CORS para permitir solicitudes de otros orígenes
import "dotenv/config"; // Importa la configuración de las variables de entorno desde un archivo .env
import mongoose from "mongoose"; // Importa Mongoose para interactuar con la base de datos MongoDB
import myUserRoute from "./routes/MyUserRoute"; // Importa las rutas relacionadas con el usuario
import { v2 as cloudinary } from "cloudinary"; // Importa Cloudinary para gestionar imágenes y archivos
import myRestaurantRoute from "./routes/MyRestaurantRoute"; // Importa las rutas relacionadas con el restaurante del usuario
import restaurantRoute from "./routes/RestaurantRoute"; // Importa las rutas relacionadas con los restaurantes
import orderRoute from "./routes/OrderRoute"; // Importa las rutas relacionadas con las órdenes

// Conexión a la base de datos MongoDB usando Mongoose
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string) // Se conecta a la base de datos usando la cadena de conexión desde las variables de entorno
  .then(() => console.log("Conectado a la Base de Datos!")); // Muestra un mensaje en consola si la conexión es exitosa

// Configura Cloudinary con las credenciales obtenidas desde las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Nombre del cloud de Cloudinary
  api_key: process.env.CLOUDINARY_API_KEY, // API Key de Cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET, // API Secret de Cloudinary
});

const app = express(); // Crea una instancia de la aplicación Express

app.use(cors()); // Habilita CORS para permitir solicitudes desde diferentes orígenes

// Configura para manejar los webhooks de Stripe con un tipo de cuerpo 'raw'
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json()); // Configura Express para que pueda parsear JSON en las solicitudes

// Ruta de salud del servidor, utilizada para verificar si el servidor está funcionando correctamente
app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Salud OK!" }); // Responde con un mensaje de "Salud OK!" si el servidor está activo
});

// Rutas para las APIs de usuario, restaurante, y órdenes
app.use("/api/my/user", myUserRoute); // Rutas relacionadas con el usuario (e.g., creación y actualización de usuario)
app.use("/api/my/restaurant", myRestaurantRoute); // Rutas relacionadas con el restaurante del usuario
app.use("/api/restaurant", restaurantRoute); // Rutas relacionadas con restaurantes generales
app.use("/api/order", orderRoute); // Rutas relacionadas con las órdenes de los usuarios

// Inicia el servidor en el puerto 7000
app.listen(7000, () => {
  console.log("Servidor Iniciado en localhost:7000"); // Muestra un mensaje en consola cuando el servidor está activo
});
