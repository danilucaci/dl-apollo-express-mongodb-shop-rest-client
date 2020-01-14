import React from "react";
import { Layout, Typography, Spin, Row, Col, Divider } from "antd";
import Image from "react-bootstrap/Image";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import withProtectedRoute from "../hoc/withProtectedRoute";
import "./styles.css";

import { formatMoney, formatOrderDate } from "../utils/helpers";
import useOrders from "../hooks/useOrders";
const { Content } = Layout;

const { Paragraph, Title } = Typography;

function Orders() {
  const [{ orders, loading, error }] = useOrders();

  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content
        style={{
          paddingTop: 40,
          paddingRight: 12,
          paddingBottom: 120,
          paddingLeft: 12,
        }}
      >
        <Row type="flex" justify="center">
          <Col span={24} lg={18}>
            <Row>
              <Col style={{ padding: 8 }}>
                <Title level={3}>Your orders</Title>
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

              {!loading && orders && orders.length === 0 && (
                <Row>
                  <Col
                    style={{
                      background: "white",
                      padding: 24,
                    }}
                  >
                    <Title level={4}>You have no past orders</Title>
                    <Paragraph>Visit our shop to get started.</Paragraph>
                  </Col>
                </Row>
              )}

              {orders &&
                orders.length > 0 &&
                orders.map((order) => (
                  <Col key={order.id}>
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
                            <Paragraph>{order.id}</Paragraph>
                          </Col>

                          <Col md={10}>
                            <Paragraph strong style={{ marginBottom: 8 }}>
                              Date:
                            </Paragraph>
                            <Paragraph>
                              {formatOrderDate(order.createdAt)}
                            </Paragraph>
                          </Col>

                          <Col md={4}>
                            <Paragraph strong style={{ marginBottom: 8 }}>
                              Total:
                            </Paragraph>
                            <Paragraph>{formatMoney(order.total)}</Paragraph>
                          </Col>
                        </Row>
                      </Col>

                      <Col sm={24} style={{ background: "white", padding: 24 }}>
                        <Title level={4} style={{ marginBottom: 16 }}>
                          Items
                        </Title>
                        {order.items.map((item) => (
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
                                  <Paragraph strong>
                                    Size: {item.size}
                                  </Paragraph>
                                  <Paragraph strong>
                                    Quantity: {item.quantity}
                                  </Paragraph>
                                </Col>
                              </Row>
                            </Col>
                            <Col>
                              <Col>
                                <Divider className="ItemsDivider" />
                              </Col>
                            </Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Content>
      <Footer />
    </Layout>
  );
}

export default withProtectedRoute()(Orders);
