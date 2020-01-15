import React, { useContext } from "react";
import { Layout, Spin, Typography, Row, Col, Select, Button } from "antd";
import Image from "react-bootstrap/Image";
import { useParams } from "react-router-dom";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { formatMoney } from "../utils/helpers";
import withProtectedRoute from "../hoc/withProtectedRoute";
import { LocalAuthContext } from "../context/localAuth";
import { CartContext } from "../context/cart";
import useShopItem from "../hooks/useShopItem";

const { Content } = Layout;
const { Option } = Select;

const { Paragraph, Title } = Typography;

function ShopItem() {
  const [
    {
      initialFetchLoading,
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
    { handleAddToCart, handleItemSizeChange },
  ] = useShopItem();

  let { id: shopItemID } = useParams();

  const { localAuth: { isAuthenticated, userToken } = {} } = useContext(
    LocalAuthContext,
  );

  const {
    cart: { loading: cartLoading },
    dispatch: cartDispatch,
    types: cartTypes,
  } = useContext(CartContext);

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
                      onChange={(value) =>
                        dispatch(handleItemSizeChange(value))
                      }
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
                      onClick={() =>
                        dispatch(
                          handleAddToCart(
                            cartDispatch,
                            cartTypes,
                            isAuthenticated,
                            userToken,
                            selectedItemSize,
                            shopItemID,
                          ),
                        )
                      }
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
