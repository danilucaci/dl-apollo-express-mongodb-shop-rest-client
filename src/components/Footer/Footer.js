import React from "react";
import { Layout, Typography, Row, Col, Divider } from "antd";

const { Footer: AntDFooter } = Layout;

const { Paragraph, Text } = Typography;

function Footer() {
  return (
    <AntDFooter
      style={{
        textAlign: "center",
        paddingTop: 48,
        paddingRight: 24,
        paddingBottom: 24,
        paddingLeft: 24,
        background: "white",
      }}
    >
      <Row type="flex" justify="center">
        <Col span={24} lg={18}>
          <Row
            type="flex"
            gutter={[{ xs: 24, sm: 48, lg: 88 }, 24]}
            justify="center"
          >
            <Col>
              <Paragraph strong style={{ marginBottom: 8 }}>
                Made by
              </Paragraph>
              <Paragraph strong style={{ marginBottom: 8 }}>
                <Text>
                  <a
                    href="https://www.danilucaci.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dani Lucaci
                  </a>
                </Text>
              </Paragraph>
              <Paragraph strong style={{ marginBottom: 24 }}>
                <Text>
                  <a
                    href="https://www.danilucaci.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact
                  </a>
                </Text>
              </Paragraph>
            </Col>
            <Col>
              <Paragraph strong style={{ marginBottom: 8 }}>
                Front End
              </Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>React.js</Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>Apollo Client</Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>Firebase Auth</Paragraph>
            </Col>
            <Col>
              <Paragraph strong style={{ marginBottom: 8 }}>
                Back End
              </Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>Node.js</Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>
                Apollo Server Express
              </Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>Firebase Auth</Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>MongoDB</Paragraph>
              <Paragraph style={{ marginBottom: 8 }}>Mongoose</Paragraph>
            </Col>
          </Row>
          <Divider />
          <Paragraph>
            &copy; {new Date().getFullYear()} Clothalia
            <Text code>#not-a-real-company</Text>
          </Paragraph>
        </Col>
      </Row>
    </AntDFooter>
  );
}

export default Footer;
