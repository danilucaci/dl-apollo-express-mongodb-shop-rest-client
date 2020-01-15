import React from "react";
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

function Home() {
  const [
    { shopItems, hasNextPage, loading, error },
    dispatch,
    { fetchMore } = {},
  ] = useShopItems();

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
                    onClick={() => dispatch(fetchMore(hasNextPage))}
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
