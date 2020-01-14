import React from "react";
import { Switch, Route } from "react-router-dom";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import routes from "./utils/routes";
import ShopItem from "./pages/ShopItem";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";

import AuthProvider from "./context/localAuth";
import CartProvider from "./context/cart";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Switch>
          <Route path={routes.home} exact>
            <Home />
          </Route>
          <Route path={routes.profile}>
            <Profile />
          </Route>
          <Route path={routes.shopItemID}>
            <ShopItem />
          </Route>
          <Route path={routes.cart}>
            <Cart />
          </Route>
          <Route path={routes.orderConfirmation}>
            <OrderConfirmation />
          </Route>
          <Route path={routes.orders}>
            <Orders />
          </Route>
        </Switch>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
