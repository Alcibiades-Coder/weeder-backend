import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

// Obtiene un restaurante por su ID
const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId; // Obtiene el ID del restaurante desde los parámetros de la URL

    const restaurant = await Restaurant.findById(restaurantId); // Busca el restaurante en la base de datos
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" }); // Retorna un error si no se encuentra
    }

    res.json(restaurant); // Retorna la información del restaurante en formato JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" }); // Manejo de errores en caso de fallo del servidor
  }
};

// Busca restaurantes en una ciudad y aplica filtros opcionales
const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city; // Obtiene la ciudad desde los parámetros de la URL

    // Obtiene los filtros opcionales desde los parámetros de consulta
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    // Filtra los restaurantes por ciudad (búsqueda insensible a mayúsculas/minúsculas)
    query["city"] = new RegExp(city, "i");

    // Verifica si hay restaurantes en la ciudad especificada
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    // Filtra por tipos de cocina si se especifican
    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }

    // Filtra por nombre de restaurante o tipo de cocina si se proporciona un término de búsqueda
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10; // Número de resultados por página
    const skip = (page - 1) * pageSize; // Cálculo de elementos a omitir para la paginación

    // Obtiene los restaurantes aplicando filtros, orden y paginación
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query); // Cuenta el total de restaurantes encontrados

    // Construye la respuesta con los datos y la paginación
    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response); // Retorna la respuesta en formato JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" }); // Manejo de errores en caso de fallo del servidor
  }
};

export default {
  getRestaurant,
  searchRestaurant,
};
