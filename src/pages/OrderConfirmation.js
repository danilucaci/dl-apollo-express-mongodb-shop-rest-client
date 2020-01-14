import React from "react";
import { Layout, Typography, Spin, Row, Col, Divider } from "antd";
import Image from "react-bootstrap/Image";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import withProtectedRoute from "../hoc/withProtectedRoute";

import { formatMoney, formatOrderDate } from "../utils/helpers";
import useOrders from "../hooks/useOrders";
const { Content } = Layout;

const { Paragraph, Title } = Typography;

function OrderConfirmation() {
  const [{ orders, loading, error }] = useOrders();

  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content
        style={{
          paddingTop: 56,
          paddingRight: 12,
          paddingBottom: 64,
          paddingLeft: 12,
        }}
      >
        <Row type="flex" justify="center">
          <Col span={24} lg={18}>
            <Row type="flex" justify={loading ? "center" : "start"}>
              <Col style={{ padding: 8 }}>
                <Title level={3}>Your order</Title>
              </Col>
              {error && (
                <Col
                  style={{
                    background: "white",
                    marginLeft: 12,
                    marginRight: 12,
                    padding: 16,
                  }}
                >
                  <Paragraph>Something went wrong...</Paragraph>
                </Col>
              )}
              {loading && (
                <Col
                  style={{
                    background: "white",
                    marginLeft: 12,
                    marginRight: 12,
                    padding: 16,
                  }}
                >
                  <Spin size="large" />
                </Col>
              )}
              {orders && orders.length > 0 && (
                <Col>
                  <Row style={{ padding: 12 }}>
                    <Col
                      sm={24}
                      style={{
                        background: "white",
                        paddingTop: 24,
                        paddingLeft: 24,
                        paddingRight: 24,
                        paddingBottom: 0,
                      }}
                    >
                      <Row type="flex" gutter={24}>
                        <Col md={10}>
                          <Paragraph strong style={{ marginBottom: 8 }}>
                            Order ID:
                          </Paragraph>
                          <Paragraph>{orders[0].id}</Paragraph>
                        </Col>

                        <Col md={10}>
                          <Paragraph strong style={{ marginBottom: 8 }}>
                            Date:
                          </Paragraph>
                          <Paragraph>
                            {formatOrderDate(orders[0].createdAt)}
                          </Paragraph>
                        </Col>

                        <Col md={4}>
                          <Paragraph strong style={{ marginBottom: 8 }}>
                            Total:
                          </Paragraph>
                          <Paragraph>{formatMoney(orders[0].total)}</Paragraph>
                        </Col>
                      </Row>
                    </Col>

                    <Col sm={24} style={{ background: "white", padding: 24 }}>
                      <Title level={4} style={{ marginBottom: 16 }}>
                        Items
                      </Title>
                      {orders[0].items.map((item) => (
                        <Row key={item.id} className="ItemsRow">
                          <Col>
                            <Row type="flex" gutter={[24, 24]}>
                              <Col sm={6}>
                                <Image fluid src={item.image} />
                              </Col>
                              <Col sm={18}>
                                <Paragraph strong>{item.name}</Paragraph>
                                <Paragraph strong>
                                  Cost: {formatMoney(item.price)}
                                </Paragraph>
                                <Paragraph strong>Size: {item.size}</Paragraph>
                                <Paragraph strong>
                                  Quantity: {item.quantity}
                                </Paragraph>
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <Divider className="ItemsDivider" />
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default withProtectedRoute()(OrderConfirmation);
