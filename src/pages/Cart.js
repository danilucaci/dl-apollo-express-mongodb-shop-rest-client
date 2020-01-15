import React, { useEffect, useContext } from "react";
import {
  Layout,
  Spin,
  Typography,
  Row,
  Col,
  Select,
  Divider,
  Button,
} from "antd";
import { useHistory } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Header from "../components/Header/Header";

import Footer from "../components/Footer/Footer";
import {
  formatMoney,
  calculateItemTotal,
  calculateCartTotal,
} from "../utils/helpers";
import "./styles.css";

import withProtectedRoute from "../hoc/withProtectedRoute";
import routes from "../utils/routes";
import { CartContext } from "../context/cart";
import { LocalAuthContext } from "../context/localAuth";
import useLocalCart from "../hooks/useLocalCart";
const { Content } = Layout;
const { Option } = Select;

const { Paragraph, Title, Text } = Typography;
const quantityValues = Array.from({ length: 10 }, (_, i) => i + 1);

function Cart() {
  const {
    cart: { cart, loading: cartLoading, error: cartError },
    dispatch: cartDispatch,
    actions: { updateLocalCartItem, deleteLocalCartItem, resetCart },
  } = useContext(CartContext);

  const {
    localAuth: {
      isAuthenticated,
      userToken,
      currentLocalUser: { id: currentLocalUserID } = {},
    } = {},
  } = useContext(LocalAuthContext);

  const [
    {
      deleteCartItemLoading,
      addOrderLoading,
      addOrderError,
      addOrderAdded,
      updateCartItemLoading,
    },
    dispatch,
    { deleteCartItem, addOrder, updateCartItem },
  ] = useLocalCart();

  const history = useHistory();

  useEffect(() => {
    // Wait for the mutation to refetch to avoid seeing stale data in the orders confirmation
    if (addOrderAdded && !addOrderLoading && !addOrderError) {
      history.push(routes.orderConfirmation);
    }
  }, [addOrderAdded, addOrderError, addOrderLoading, history]);

  return (
    <Layout>
      <Header />
      <Content
        style={{
          background: "f3f3f3",
          paddingTop: 40,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 48,
        }}
      >
        <Row type="flex" justify="center">
          <Col span={24} lg={18}>
            <Title level={2} style={{ marginBottom: 24 }}>
              Cart
            </Title>
            <Row gutter={[24, 24]}>
              <Col md={16}>
                <Layout style={{ padding: 20, background: "white" }}>
                  {cartError && <Paragraph>Something went wrong...</Paragraph>}
                  {cartLoading && <Spin size="large" />}
                  {cart && cart.length > 0 ? (
                    cart.map((cartItem) => (
                      <Row key={cartItem.id} className="ItemsRow">
                        <Col>
                          <Row
                            type="flex"
                            justify="space-between"
                            gutter={[16, 16]}
                          >
                            <Col span={24} sm={8}>
                              <Image fluid src={cartItem.item.image} />
                            </Col>
                            <Col span={24} sm={16}>
                              <Row
                                className="CartItemHeight"
                                gutter={[
                                  { xs: 16, sm: 0 },
                                  { xs: 16, sm: 0 },
                                ]}
                              >
                                <Col
                                  span={24}
                                  sm={18}
                                  className="CartItemHeight"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <Paragraph strong style={{ marginBottom: 8 }}>
                                    {cartItem.item.name}
                                  </Paragraph>
                                  <Paragraph style={{ marginBottom: 8 }}>
                                    Size: {cartItem.size}
                                  </Paragraph>
                                  <Paragraph
                                    style={{ marginBottom: 8, marginTop: 8 }}
                                  >
                                    Total:{" "}
                                    {formatMoney(calculateItemTotal(cartItem))}
                                  </Paragraph>
                                  <Button
                                    className="CartItemRemoveButton"
                                    type="ghost"
                                    disabled={
                                      addOrderLoading ||
                                      updateCartItemLoading ||
                                      deleteCartItemLoading ||
                                      cart.length === 0
                                    }
                                    loading={deleteCartItemLoading}
                                    onClick={() =>
                                      dispatch(
                                        deleteCartItem(
                                          cartItem.id,
                                          cartDispatch,
                                          deleteLocalCartItem,
                                          isAuthenticated,
                                          userToken,
                                        ),
                                      )
                                    }
                                  >
                                    Remove from cart
                                  </Button>
                                </Col>
                                <Col span={24} sm={6}>
                                  <Select
                                    placeholder="Quantity"
                                    loading={updateCartItemLoading}
                                    defaultValue={cartItem.quantity}
                                    disabled={
                                      addOrderLoading ||
                                      updateCartItemLoading ||
                                      deleteCartItemLoading ||
                                      cart.length === 0
                                    }
                                    onChange={(value) =>
                                      dispatch(
                                        updateCartItem(
                                          cartItem.id,
                                          Number(value),
                                          cartDispatch,
                                          updateLocalCartItem,
                                          isAuthenticated,
                                          userToken,
                                        ),
                                      )
                                    }
                                    style={{ width: "100%" }}
                                  >
                                    {quantityValues.map((x) => (
                                      <Option key={x}>{x}</Option>
                                    ))}
                                  </Select>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col>
                          <Divider className="ItemsDivider" />
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Row>
                      <Col>
                        <Title level={4}>Your cart is empty</Title>
                        <Paragraph>Add some items to get started.</Paragraph>
                      </Col>
                    </Row>
                  )}
                </Layout>
              </Col>
              <Col md={8}>
                <Row style={{ background: "white", padding: 16 }}>
                  <Col>
                    <Title level={3} style={{ marginBottom: 24 }}>
                      Total
                    </Title>
                  </Col>
                  <Col>
                    <Row type="flex" justify="space-between">
                      <Col>
                        <Text>Subtotal</Text>
                      </Col>
                      <Col>
                        <Text strong>
                          {cart ? formatMoney(calculateCartTotal(cart)) : 0}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      size="large"
                      style={{ width: "100%", marginTop: 24 }}
                      disabled={
                        addOrderLoading ||
                        updateCartItemLoading ||
                        deleteCartItemLoading ||
                        cart.length === 0
                      }
                      loading={addOrderLoading}
                      onClick={() =>
                        dispatch(
                          addOrder(
                            currentLocalUserID,
                            cartDispatch,
                            resetCart,
                            isAuthenticated,
                            userToken,
                          ),
                        )
                      }
                    >
                      Checkout
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>

      <Footer />
    </Layout>
  );
}

export default withProtectedRoute()(Cart);
