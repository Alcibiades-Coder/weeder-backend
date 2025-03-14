import mongoose from "mongoose";

// Definición del esquema para el usuario
const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String, // El tipo de dato es un string
    required: true, // Es obligatorio
  },
  email: {
    type: String, // El tipo de dato es un string
    required: true, // Es obligatorio
  },
  name: {
    type: String, // El tipo de dato es un string
    // No es obligatorio
  },
  addressLine1: {
    type: String, // El tipo de dato es un string
    // No es obligatorio
  },
  city: {
    type: String, // El tipo de dato es un string
    // No es obligatorio
  },
  country: {
    type: String, // El tipo de dato es un string
    // No es obligatorio
  },
});

// Creación del modelo de usuario basado en el esquema definido
const User = mongoose.model("User", userSchema);

// Exporta el modelo para su uso en otras partes de la aplicación
export default User;
