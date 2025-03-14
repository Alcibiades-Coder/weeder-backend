import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

// Configuración de Stripe con las claves de entorno
const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

// Obtiene las órdenes del usuario autenticado
const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant") // Agrega información del restaurante
      .populate("user"); // Agrega información del usuario

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

// Tipo de datos esperado en una solicitud de sesión de pago
type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

// Maneja los webhooks de Stripe
const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Si el pago ha sido completado, actualiza el estado de la orden
  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

// Crea una sesión de pago en Stripe
const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    // Busca el restaurante asociado a la orden
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Crea una nueva orden en la base de datos
    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    // Genera los elementos de línea de la orden
    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    // Crea una sesión de pago en Stripe
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

    await newOrder.save(); // Guarda la orden en la base de datos
    res.json({ url: session.url }); // Devuelve la URL de pago al frontend
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

// Genera los elementos de línea de Stripe basados en los productos del carrito
const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "clp",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

// Crea una sesión de pago en Stripe con los datos de la orden
const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "clp",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};

export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebhookHandler,
};
