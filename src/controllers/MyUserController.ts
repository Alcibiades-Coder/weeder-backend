import { Request, Response } from "express";
import User from "../models/user";

// Obtiene la información del usuario autenticado
const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Algo salió mal" });
  }
};

// Crea un nuevo usuario si no existe previamente en la base de datos
const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    // Si el usuario ya existe, responde con estado 200 sin crear uno nuevo
    if (existingUser) {
      return res.status(200).send();
    }

    // Crea un nuevo usuario con la información recibida
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

// Actualiza los datos del usuario autenticado
const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Modifica los datos del usuario con los valores recibidos
    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser,
};
