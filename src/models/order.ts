import mongoose from "mongoose";

// Definición del esquema para la colección de órdenes
const orderSchema = new mongoose.Schema({
  // Referencia al restaurante asociado a la orden
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },

  // Referencia al usuario que realizó la orden
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Detalles de entrega del usuario que hizo la orden
  deliveryDetails: {
    email: { type: String, required: true }, // Correo del usuario
    name: { type: String, required: true }, // Nombre del usuario
    addressLine1: { type: String, required: true }, // Dirección principal
    city: { type: String, required: true }, // Ciudad
  },

  // Lista de productos incluidos en la orden
  cartItems: [
    {
      menuItemId: { type: String, required: true }, // ID del producto en el menú
      quantity: { type: Number, required: true }, // Cantidad de ese producto
      name: { type: String, required: true }, // Nombre del producto
    },
  ],

  // Monto total de la orden
  totalAmount: Number,

  // Estado actual de la orden, restringido a valores específicos
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"], // Estados permitidos para el pedido
  },

  // Fecha de creación de la orden, con valor predeterminado de la fecha actual
  createdAt: { type: Date, default: Date.now },
});

// Creación del modelo de orden basado en el esquema definido
const Order = mongoose.model("Order", orderSchema);

export default Order; // Exporta el modelo para su uso en otras partes de la aplicación
