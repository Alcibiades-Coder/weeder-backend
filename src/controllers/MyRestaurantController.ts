import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

// Obtiene el restaurante asociado al usuario autenticado
const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error al obtener el restaurante" });
  }
};

// Crea un restaurante para el usuario autenticado, si no existe previamente
const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "El restaurante del usuario ya existe" });
    }

    // Sube la imagen del restaurante a Cloudinary
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    // Crea un nuevo documento de restaurante en la base de datos
    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Algo salió mal" });
  }
};

// Actualiza la información del restaurante asociado al usuario autenticado
const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    // Actualiza los datos del restaurante con los valores recibidos
    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    // Si se proporciona una nueva imagen, se sube a Cloudinary y se actualiza la URL
    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Algo salió mal" });
  }
};

// Obtiene todas las órdenes asociadas al restaurante del usuario autenticado
const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurante no encontrado" });
    }

    // Busca todas las órdenes asociadas al restaurante
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Algo salió mal" });
  }
};

// Actualiza el estado de una orden específica
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    // Verifica que el usuario autenticado sea el propietario del restaurante
    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).send();
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "No se pudo actualizar el estado de la orden" });
  }
};

// Sube una imagen a Cloudinary y devuelve la URL resultante
const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  updateOrderStatus,
  getMyRestaurantOrders,
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
};
