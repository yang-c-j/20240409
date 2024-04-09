import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import CartContextProvider from "./store/cartContext";
import ItemsContextProvider from "./store/itemsContext";
import AuthPage from "./pages/AuthPage";
import Error from "./components/products/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
    errorElement: <Error error={"Page not found (404)"} />,
  },
  { path: "/auth", element: <AuthPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/cart", element: <CartPage /> },
]);

function App() {
  return (
    <ItemsContextProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
      </CartContextProvider>
    </ItemsContextProvider>
  );
}

export default App;
