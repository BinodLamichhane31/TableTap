import { Outlet, RouteObject } from "react-router-dom";
import MenuPage from "../pages/Restaurants/menu/MenuPage";
import MenuDetails from "../pages/Restaurants/menu-details/MenuDetails";
import Cart from "../pages/Restaurants/cart/Cart";
import ItemDetails from "../pages/Restaurants/item-details/ItemDetails";
// import OrderNumber from "../pages/Restaurants/OrderNumber";
import OrderSuccess from "../pages/Restaurants/order-success/OrderSuccess";
import Orders from "../pages/Restaurants/orders/Orders";
import OrderDetails from "../pages/Restaurants/order-details/OrderDetails";
import { CartProvider } from "../context/CartContext";
import Login from "../pages/Auth/Login";
import StaffLogin from "../pages/Auth/StaffLogin";
import Unauthorized from "../errors/Unauthorized";
import App from "../website/App";
import ErrorComponent from "../errors/ErrorComponent";

const OpenRoutes: RouteObject = {
  path: "/",
  element: <Outlet />,
  errorElement: <ErrorComponent />,
  children: [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/staff-login",
      element: <StaffLogin />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/menu",
          element: (
            <CartProvider>
              <MenuPage />
            </CartProvider>
          ),
        },
        {
          path: "/details",
          element: (
            <CartProvider>
              <MenuDetails />
            </CartProvider>
          ),
        },
        {
          path: "/cart",
          element: (
            <CartProvider>
              <Cart />
            </CartProvider>
          ),
        },
        {
          path: "/item-details/:productId",
          element: (
            <CartProvider>
              <ItemDetails />
            </CartProvider>
          ),
        },
        {
          path: "/order-success",
          element: (
            <CartProvider>
              <OrderSuccess />
            </CartProvider>
          ),
        },
        {
          path: "/orders-page",
          element: (
            <CartProvider>
              <Orders />
            </CartProvider>
          ),
        },
        {
          path: "/order-details/:orderId",
          element: (
            <CartProvider>
              <OrderDetails />
            </CartProvider>
          ),
        },
      ],
    },
  ],
};

export default OpenRoutes;
