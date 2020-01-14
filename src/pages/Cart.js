import React, { useEffect, useContext, useReducer, useRef } from "react";
import axios from "axios";
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
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import useCart from "../hooks/useCart";
const { Content } = Layout;
const { Option } = Select;

const { Paragraph, Title, Text } = Typography;
const quantityValues = Array.from({ length: 10 }, (_, i) => i + 1);

const types = {
  DELETE_CART_ITEM_LOADING: "DELETE_CART_ITEM_LOADING",
  DELETE_CART_ITEM_DELETED: "DELETE_CART_ITEM_DELETED",
  DELETE_CART_ITEM_ERROR: "DELETE_CART_ITEM_ERROR",
  ADD_ORDER_LOADING: "ADD_ORDER_LOADING",
  ADD_ORDER_ERROR: "ADD_ORDER_ERROR",
  ADD_ORDER_ADDED: "ADD_ORDER_ADDED",
  UPDATE_CART_ITEM_LOADING: "UPDATE_CART_ITEM_LOADING",
  UPDATE_CART_ITEM_UPDATED: "UPDATE_CART_ITEM_UPDATED",
  UPDATE_CART_ITEM_ERROR: "UPDATE_CART_ITEM_ERROR",
};

const initialState = {
  deleteCartItemLoading: false,
  deleteCartItemError: null,
  addOrderLoading: false,
  addOrderError: null,
  addOrderAdded: false,
  updateCartItemLoading: false,
  updateCartItemError: null,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case types.DELETE_CART_ITEM_LOADING: {
      return {
        ...state,
        deleteCartItemLoading: true,
      };
    }
    case types.DELETE_CART_ITEM_DELETED: {
      return {
        ...state,
        deleteCartItemLoading: false,
      };
    }
    case types.DELETE_CART_ITEM_ERROR: {
      return {
        ...state,
        deleteCartItemLoading: false,
      };
    }
    case types.ADD_ORDER_LOADING: {
      return {
        ...state,
        addOrderLoading: true,
      };
    }
    case types.ADD_ORDER_ADDED: {
      return {
        ...state,
        addOrderLoading: false,
        addOrderAdded: true,
      };
    }
    case types.ADD_ORDER_ERROR: {
      return {
        ...state,
        addOrderError: payload,
      };
    }
    case types.UPDATE_CART_ITEM_LOADING: {
      return {
        ...state,
        updateCartItemLoading: true,
      };
    }
    case types.UPDATE_CART_ITEM_UPDATED: {
      return {
        ...state,
        updateCartItemLoading: false,
      };
    }
    case types.UPDATE_CART_ITEM_ERROR: {
      return {};
    }
    default: {
      return state;
    }
  }
};

function Cart() {
  const {
    cart: { cart, loading: cartLoading, error: cartError },
    dispatch: cartDispatch,
    types: cartTypes,
  } = useContext(CartContext);

  const {
    localAuth: {
      isAuthenticated,
      userToken,
      currentLocalUser: { id: currentLocalUserID } = {},
    } = {},
  } = useContext(LocalAuthContext);

  const mounted = useRef();

  useEffect(() => {
    mounted.current = true;

    return () => (mounted.current = false);
  });

  const addOrderCancelToken = useRef();
  const deleteCartItemCancelToken = useRef();
  const updateCartItemCancelToken = useRef();

  const [
    {
      deleteCartItemLoading,
      addOrderLoading,
      addOrderError,
      addOrderAdded,
      updateCartItemLoading,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const history = useHistory();

  async function deleteCartItem(id) {
    deleteCartItemCancelToken.current = axios.CancelToken.source();

    if (mounted.current) {
      dispatch({ type: types.DELETE_CART_ITEM_LOADING });
    }

    await axios({
      url: `http://localhost:4000/api/cart/${id}`,
      method: "delete",
      headers:
        isAuthenticated && userToken
          ? {
              Authorization: `Bearer ${userToken}`,
            }
          : null,
      cancelToken: deleteCartItemCancelToken.current.token,
      validateStatus: (_status) => {
        // Fix for Axios not returning response for POST on 500 error
        // @see https://github.com/axios/axios#request-config
        return true;
      },
    }).catch((error) => {
      if (axios.isCancel(error)) {
        console.warn("Cancelled axios request");
      }

      console.warn(error.message);

      if (mounted.current) {
        dispatch({
          type: types.DELETE_CART_ITEM_ERROR,
          payload: error.message,
        });
      }
    });

    if (mounted.current) {
      dispatch({ type: types.DELETE_CART_ITEM_DELETED });

      cartDispatch({
        type: cartTypes.DELETE_CART_ITEM,
        payload: {
          id: id,
        },
      });
    }
  }

  async function addOrder() {
    addOrderCancelToken.current = axios.CancelToken.source();

    if (currentLocalUserID) {
      if (mounted.current) {
        dispatch({ type: types.ADD_ORDER_LOADING });
      }

      await axios({
        url: `http://localhost:4000/api/orders`,
        method: "post",
        headers:
          isAuthenticated && userToken
            ? {
                Authorization: `Bearer ${userToken}`,
              }
            : null,
        cancelToken: addOrderCancelToken.current.token,
        validateStatus: (status) => {
          // @see https://github.com/axios/axios#request-config
          if (status === 201) {
            return true;
          }
          if (status > 400) {
            return false;
          }
        },
      }).catch((error) => {
        if (axios.isCancel(error)) {
          console.warn("Cancelled axios request");
        }

        console.warn(error.message);

        if (mounted.current) {
          dispatch({
            type: types.ADD_ORDER_ERROR,
            payload: error.message,
          });
        }
      });

      if (mounted.current) {
        cartDispatch({
          type: cartTypes.RESET_CART,
        });

        dispatch({ type: types.ADD_ORDER_ADDED });
      }
    }
  }

  async function updateCartItem({ id, quantity }) {
    updateCartItemCancelToken.current = axios.CancelToken.source();

    if (mounted.current) {
      dispatch({ type: types.UPDATE_CART_ITEM_LOADING });
    }

    await axios({
      url: `http://localhost:4000/api/cart/${id}`,
      method: "patch",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          isAuthenticated && userToken ? `Bearer ${userToken}` : ``,
      },
      cancelToken: updateCartItemCancelToken.current.token,
      data: JSON.stringify({
        quantity: quantity,
      }),
      validateStatus: (_status) => {
        // Fix for Axios not returning response for POST on 500 error
        // @see https://github.com/axios/axios#request-config
        return true;
      },
    }).catch((error) => {
      if (axios.isCancel(error)) {
        console.warn("Cancelled axios request");
      }

      console.warn(error.message);

      if (mounted.current) {
        dispatch({
          type: types.UPDATE_CART_ITEM_ERROR,
          payload: error.message,
        });
      }
    });

    if (mounted.current) {
      dispatch({ type: types.UPDATE_CART_ITEM_UPDATED });

      cartDispatch({
        type: cartTypes.UPDATE_CART_ITEM,
        payload: {
          id: id,
          quantity: quantity,
        },
      });
    }
  }

  // useEffect(() => {
  //   return () => {
  //     if (updateCartItemCancelToken.current) {
  //       updateCartItemCancelToken.current.cancel();
  //     }

  //     if (deleteCartItemCancelToken.current) {
  //       deleteCartItemCancelToken.current.cancel();
  //     }

  //     if (addOrderCancelToken.current) {
  //       addOrderCancelToken.current.cancel();
  //     }
  //   };
  // });

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
                                    onClick={() => deleteCartItem(cartItem.id)}
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
                                      updateCartItem({
                                        id: cartItem.id,
                                        quantity: Number(value),
                                      })
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
                      onClick={addOrder}
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
