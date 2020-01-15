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

function App() {
  return (
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
  );
}

export default App;
