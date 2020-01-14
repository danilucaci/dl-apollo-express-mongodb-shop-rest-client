import React, { useRef, useEffect, useReducer, useContext } from "react";
import { Layout, Spin, Typography, Row, Col, Select, Button } from "antd";
import Image from "react-bootstrap/Image";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { formatMoney } from "../utils/helpers";
import withProtectedRoute from "../hoc/withProtectedRoute";
import { LocalAuthContext } from "../context/localAuth";
import { CartContext } from "../context/cart";
const { Content } = Layout;
const { Option } = Select;

const { Paragraph, Title } = Typography;

const RESPONSE_TYPES = {
  created: "created",
  updated: "updated",
};

const ITEM_SIZES_QUERY = `
  query itemSizes {
    __type(name: "Size") {
      name
      enumValues {
        name
      }
    }
  }
`;

const types = {
  INITIAL_FETCH_START: "INITIAL_FETCH_START",
  SET_INITIAL_FETCH_ERROR: "SET_INITIAL_FETCH_ERROR",
  SET_INITIAL_FETCH_DONE: "SET_INITIAL_FETCH_DONE",
  SET_SELECTED_ITEM_SIZE: "SET_SELECTED_ITEM_SIZE",
  SET_ITEM_SIZES_ERROR: "SET_ITEM_SIZES_ERROR",
  SET_SHOP_ITEM_ERROR: "SET_SHOP_ITEM_ERROR",
  ADD_TO_CART_START: "ADD_TO_CART_START",
  ADD_TO_CART_ERROR: "ADD_TO_CART_ERROR",
  ADD_TO_CART_DONE: "ADD_TO_CART_DONE",
};

const initialState = {
  initialFetchLoading: false,
  initialFetchDone: false,
  initialFetchError: false,
  shopItemSizes: null,
  shopItemSizesError: false,
  shopItem: null,
  shopItemError: false,
  selectedItemSize: null,
  addCartItemCalled: false,
  addCartItemError: null,
  addCartItemLoading: false,
  addToCartItem: null,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case types.INITIAL_FETCH_START: {
      return {
        ...state,
        initialFetchLoading: true,
      };
    }
    case types.SET_INITIAL_FETCH_ERROR: {
      return {
        ...state,
        initialFetchError: true,
        initialFetchLoading: false,
      };
    }
    case types.SET_INITIAL_FETCH_DONE: {
      return {
        ...state,
        initialFetchLoading: false,
        shopItem: payload.shopItem,
        shopItemSizes: payload.shopItemSizes,
      };
    }
    case types.SET_SELECTED_ITEM_SIZE: {
      return {
        ...state,
        selectedItemSize: payload,
      };
    }
    case types.SET_ITEM_SIZES_ERROR: {
      return {
        ...state,
        shopItemSizesError: payload,
      };
    }
    case types.SET_SHOP_ITEM_ERROR: {
      return {
        ...state,
        shopItemError: payload,
      };
    }
    case types.ADD_TO_CART_START: {
      return {
        ...state,
        addCartItemLoading: true,
      };
    }
    case types.ADD_TO_CART_ERROR: {
      return {
        ...state,
        addCartItemLoading: false,
        addCartItemError: payload,
      };
    }
    case types.ADD_TO_CART_DONE: {
      return {
        ...state,
        addCartItemLoading: false,
        addToCartItem: payload,
      };
    }
    default: {
      return state;
    }
  }
};

function ShopItem() {
  const [
    {
      initialFetchLoading,
      initialFetchDone,
      initialFetchError,
      shopItemSizes,
      shopItemSizesError,
      shopItem,
      shopItemError,
      selectedItemSize,
      addCartItemLoading,
      addCartItemCalled,
      addCartItemError,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  let { id: shopItemID } = useParams();

  const { localAuth: { isAuthenticated, userToken } = {} } = useContext(
    LocalAuthContext,
  );

  const {
    cart: { loading: cartLoading },
    dispatch: cartDispatch,
    types: cartTypes,
  } = useContext(CartContext);

  const mounted = useRef();

  useEffect(() => {
    mounted.current = true;

    return () => (mounted.current = false);
  });

  useEffect(() => {
    async function getItemSizes() {
      let source = axios.CancelToken.source();

      return axios({
        method: "post",
        url: "http://localhost:4000/graphql",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            isAuthenticated && userToken ? `Bearer ${userToken}` : "",
        },
        data: JSON.stringify({
          query: ITEM_SIZES_QUERY,
        }),
        cancelToken: source.token,
        validateStatus: (_status) => {
          return true;
        },
      });
    }

    async function getShopItem() {
      let source = axios.CancelToken.source();

      return axios({
        method: "get",
        url: `http://localhost:4000/shop-item/${shopItemID}`,
        headers:
          isAuthenticated && userToken
            ? {
                Authorization: `Bearer ${userToken}`,
              }
            : null,
        cancelToken: source.token,
        validateStatus: (status) => {
          if (status > 400) {
            return false;
          }
          return true;
        },
      });
    }

    async function fetchData() {
      if (mounted.current) {
        dispatch({ type: types.INITIAL_FETCH_START });
      }

      const res = await Promise.all([
        getItemSizes().catch((error) =>
          dispatch({ type: types.SET_SHOP_ITEM_ERROR, payload: error.message }),
        ),
        getShopItem().catch((error) =>
          dispatch({ type: types.SET_SHOP_ITEM_ERROR, payload: error.message }),
        ),
      ]).catch((error) =>
        dispatch({
          type: types.SET_INITIAL_FETCH_ERROR,
          payload: error.message,
        }),
      );

      const [
        {
          data: {
            data: { __type: { enumValues: shopItemSizes } = {} } = {},
          } = {},
        } = {},
        { data: { data: shopItem } = {} } = {},
      ] = res || [];

      if (mounted.current) {
        if (!shopItemSizes && !shopItem) {
          dispatch({
            type: types.SET_INITIAL_FETCH_ERROR,
            payload: "Failed to get the data",
          });
        } else {
          dispatch({
            type: types.SET_INITIAL_FETCH_DONE,
            payload: {
              shopItemSizes: shopItemSizes,
              shopItem: shopItem,
            },
          });
        }
      }
    }

    if (mounted.current && !initialFetchDone) {
      fetchData();
    }
  }, [dispatch, initialFetchDone, isAuthenticated, shopItemID, userToken]);

  function handleItemSizeChange(value) {
    if (mounted.current) {
      dispatch({ type: types.SET_SELECTED_ITEM_SIZE, payload: value });
    }
  }

  async function handleAddToCart() {
    let source = axios.CancelToken.source();
    let responseType;

    if (selectedItemSize) {
      if (mounted.current) {
        dispatch({ type: types.ADD_TO_CART_START });
      }

      const data = JSON.stringify({
        item: shopItemID,
        size: selectedItemSize,
        quantity: 1,
      });

      const res = await axios({
        url: "http://localhost:4000/api/cart",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            isAuthenticated && userToken ? `Bearer ${userToken}` : "",
        },
        data,
        cancelToken: source.token,
        validateStatus: (status) => {
          if (status === 200) {
            responseType = RESPONSE_TYPES.updated;
          }

          if (status === 201) {
            responseType = RESPONSE_TYPES.created;
          }

          if (status > 400) {
            return false;
          }

          return true;
        },
      }).catch((error) => {
        if (mounted.current) {
          dispatch({ type: types.ADD_TO_CART_ERROR, payload: error.message });
        }
      });

      const { data: { data: cartItem } = {} } = res || {};

      if (
        mounted.current &&
        cartItem &&
        responseType === RESPONSE_TYPES.created
      ) {
        cartDispatch({ type: cartTypes.ADD_CART_ITEM, payload: cartItem });
      }

      if (
        mounted.current &&
        cartItem &&
        responseType === RESPONSE_TYPES.updated
      ) {
        cartDispatch({
          type: cartTypes.UPDATE_CART_ITEM,
          payload: {
            id: cartItem.id,
            quantity: cartItem.quantity,
          },
        });
      }

      if (mounted.current && cartItem && responseType) {
        dispatch({
          type: types.ADD_TO_CART_DONE,
        });
      }
    }
  }

  return (
    <Layout>
      <Header />
      <Content
        style={{
          paddingTop: 48,
          paddingRight: 16,
          paddingBottom: 48,
          paddingLeft: 16,

          background: "#f3f3f3",
        }}
      >
        <Row type="flex" justify="center">
          <Col lg={16} style={{ padding: 24, background: "#fff" }}>
            <Row
              gutter={[24, 24]}
              type="flex"
              justify={initialFetchLoading ? "center" : "start"}
            >
              {initialFetchError && (
                <Col>
                  <Paragraph>Something went wrong</Paragraph>
                  <Paragraph>{initialFetchError}</Paragraph>
                </Col>
              )}
              {shopItemSizesError && (
                <Col>
                  <Paragraph>Something went wrong</Paragraph>
                  <Paragraph>{shopItemSizesError}</Paragraph>
                </Col>
              )}
              {shopItemError && (
                <Col>
                  <Paragraph>Something went wrong</Paragraph>
                  <Paragraph>{shopItemError}</Paragraph>
                </Col>
              )}
              {initialFetchLoading && (
                <Col>
                  <Spin size="large" />
                </Col>
              )}
              {shopItem && (
                <>
                  <Col md={12}>
                    <Image fluid src={shopItem.image} />
                  </Col>
                  <Col
                    md={12}
                    style={{
                      padding: 24,
                    }}
                  >
                    <Title level={3}>{shopItem.name}</Title>
                    <Paragraph>{shopItem.description}</Paragraph>
                    <Paragraph strong>{formatMoney(shopItem.price)}</Paragraph>
                    <Select
                      style={{ width: "100%", marginBottom: 24 }}
                      placeholder="Select a size"
                      onChange={handleItemSizeChange}
                      loading={
                        initialFetchLoading || addCartItemLoading || cartLoading
                      }
                      disabled={
                        initialFetchLoading || addCartItemLoading || cartLoading
                      }
                    >
                      {shopItemSizes &&
                        shopItemSizes.map((size) => (
                          <Option key={size.name} value={size.name}>
                            {size.name}
                          </Option>
                        ))}
                    </Select>
                    <Button
                      type="primary"
                      size="large"
                      loading={
                        initialFetchLoading || addCartItemLoading || cartLoading
                      }
                      disabled={
                        !selectedItemSize || addCartItemLoading || cartLoading
                      }
                      onClick={handleAddToCart}
                      icon={
                        addCartItemCalled && !addCartItemError
                          ? "check-circle"
                          : "shopping-cart"
                      }
                    >
                      {addCartItemCalled && !addCartItemError
                        ? "Added!"
                        : "Add to cart"}
                    </Button>
                    {addCartItemError && (
                      <Col>
                        <Paragraph>Something went wrong</Paragraph>
                        <Paragraph>{addCartItemError}</Paragraph>
                      </Col>
                    )}
                  </Col>
                </>
              )}
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default withProtectedRoute()(ShopItem);
