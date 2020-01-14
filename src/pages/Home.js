import React, { useEffect, useRef } from "react";
import { Layout, Typography, Spin, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import routes from "../utils/routes";
import { formatMoney } from "../utils/helpers";

import useShopItems from "../hooks/useShopItems";

const { Content } = Layout;
const { Paragraph } = Typography;

const BASE_URL = "http://localhost:4000/shop-items?limit=8";

function Home() {
  const [
    { dataFetched, shopItems, hasNextPage, loading, error },
    dispatch,
    types,
  ] = useShopItems();
  const mounted = useRef();

  useEffect(() => {
    mounted.current = true;

    return () => (mounted.current = false);
  });

  useEffect(() => {
    async function fetchShopItems() {
      dispatch({ type: types.FETCH_START });

      const res = await fetch(BASE_URL).catch((e) =>
        dispatch({ type: types.ERROR }),
      );

      if (res.ok) {
        const data = await res
          .json()
          .catch((e) => dispatch({ type: types.ERROR }));
        const { data: { shopItems, hasNextPage } = {}, errors } = data || {};

        if (errors) {
          dispatch({ type: types.ERROR });
        }

        dispatch({
          type: types.FETCH_DONE,
          payload: {
            hasNextPage: hasNextPage,
            shopItems: shopItems,
          },
        });
      }
    }

    if (!dataFetched && mounted.current === true) {
      fetchShopItems();
    }
  }, [dataFetched, dispatch, types.ERROR, types.FETCH_DONE, types.FETCH_START]);

  async function fetchMore() {
    dispatch({ type: types.FETCH_START });

    if (hasNextPage) {
      const afterItem = shopItems.slice(-1)[0];

      const res = await fetch(`${BASE_URL}&after=${afterItem.id}`).catch((e) =>
        dispatch({ type: types.ERROR }),
      );

      if (res.ok) {
        const data = await res
          .json()
          .catch((e) => dispatch({ type: types.ERROR }));
        const { data: { shopItems, hasNextPage } = {}, errors } = data || {};

        if (errors) {
          dispatch({ type: types.ERROR });
        }

        dispatch({
          type: types.FETCHED_MORE,
          payload: {
            hasNextPage: hasNextPage,
            shopItems: shopItems,
          },
        });
      }
    }
  }

  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content
        style={{
          paddingTop: 48,
          paddingRight: 24,
          paddingBottom: 120,
          paddingLeft: 24,
        }}
      >
        <Row type="flex" justify="center">
          <Col span={24} lg={18}>
            <Row
              gutter={[24, 24]}
              type="flex"
              justify={loading ? "center" : "start"}
            >
              {error && (
                <Col>
                  <Paragraph>Something went wrong...</Paragraph>
                </Col>
              )}
              {loading && (
                <Col>
                  <Spin size="large" />
                </Col>
              )}
              {shopItems &&
                shopItems.map((shopItem) => (
                  <Col key={shopItem.id} span={24} sm={12} md={8} xl={6}>
                    <Link to={routes.shopItem + shopItem.id}>
                      <Row>
                        <Col>
                          <Image fluid src={shopItem.image} />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Paragraph
                            strong
                            style={{
                              marginTop: 12,
                              marginBottom: 4,
                            }}
                          >
                            {formatMoney(shopItem.price)}
                          </Paragraph>
                          <Paragraph>{shopItem.name}</Paragraph>
                        </Col>
                      </Row>
                    </Link>
                  </Col>
                ))}
            </Row>
            {!loading && (
              <Row
                type="flex"
                justify="center"
                style={{
                  marginTop: 80,
                }}
              >
                <Col>
                  <Button
                    size="large"
                    style={{
                      minWidth: 240,
                    }}
                    loading={loading}
                    disabled={loading || !hasNextPage}
                    onClick={fetchMore}
                  >
                    {hasNextPage ? "Load more" : "No more results"}
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Home;
