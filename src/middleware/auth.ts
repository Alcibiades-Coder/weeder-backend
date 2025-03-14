import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

// Extiende la interfaz Request de Express para incluir los campos userId y auth0Id
declare global {
  namespace Express {
    interface Request {
      userId: string; // ID del usuario en la base de datos
      auth0Id: string; // ID del usuario proporcionado por Auth0
    }
  }
}

// Middleware para verificar la validez del token JWT proporcionado en la solicitud
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE, // Especifica la audiencia esperada del token
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL, // URL del emisor del token (Auth0)
  tokenSigningAlg: "RS256", // Algoritmo utilizado para la firma del token
});

// Middleware para decodificar el token JWT y asociarlo con un usuario en la base de datos
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers; // Obtiene el encabezado de autorización

  // Verifica que el encabezado de autorización existe y tiene el formato adecuado
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401); // Devuelve un estado 401 (No autorizado) si no hay token válido
  }

  const token = authorization.split(" ")[1]; // Extrae el token JWT del encabezado

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload; // Decodifica el token sin validarlo
    const auth0Id = decoded.sub; // Obtiene el ID de usuario proporcionado por Auth0

    const user = await User.findOne({ auth0Id }); // Busca al usuario en la base de datos

    if (!user) {
      return res.sendStatus(401); // Devuelve 401 si el usuario no existe en la base de datos
    }

    // Asigna los valores extraídos al objeto req para que estén disponibles en el siguiente middleware
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();

    next(); // Llama al siguiente middleware en la cadena de ejecución
  } catch (error) {
    return res.sendStatus(401); // Captura errores y devuelve 401 en caso de fallo
  }
};
