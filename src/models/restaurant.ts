import mongoose, { InferSchemaType } from "mongoose";

// Definición del esquema para los elementos del menú de un restaurante
const menuItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Tipo de dato ObjectId de MongoDB para identificar de forma única el elemento
    required: true, // Es obligatorio
    default: () => new mongoose.Types.ObjectId(), // Si no se proporciona, se genera un ObjectId automáticamente
  },
  name: { type: String, required: true }, // Nombre del elemento del menú (obligatorio)
  price: { type: Number, required: true }, // Precio del elemento (obligatorio)
});

// Tipo de datos de un elemento del menú inferido a partir del esquema
export type MenuItemType = InferSchemaType<typeof menuItemSchema>;

// Definición del esquema para el restaurante
const restaurantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Referencia al usuario propietario del restaurante
  restaurantName: { type: String, required: true }, // Nombre del restaurante (obligatorio)
  city: { type: String, required: true }, // Ciudad donde se encuentra el restaurante (obligatorio)
  country: { type: String, required: true }, // País donde se encuentra el restaurante (obligatorio)
  deliveryPrice: { type: Number, required: true }, // Precio del servicio de entrega (obligatorio)
  estimatedDeliveryTime: { type: Number, required: true }, // Tiempo estimado de entrega en minutos (obligatorio)
  cuisines: [{ type: String, required: true }], // Tipos de cocina que ofrece el restaurante (obligatorio)
  menuItems: [menuItemSchema], // Lista de elementos del menú definidos por el esquema `menuItemSchema`
  imageUrl: { type: String, required: true }, // URL de la imagen del restaurante (obligatorio)
  lastUpdated: { type: Date, required: true }, // Fecha de la última actualización de la información del restaurante (obligatorio)
});

// Creación del modelo de restaurante basado en el esquema definido
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

// Exporta el modelo para su uso en otras partes de la aplicación
export default Restaurant;
