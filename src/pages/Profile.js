import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Divider,
  Form,
  Input,
  Button,
} from "antd";
import Image from "react-bootstrap/Image";

import withProtectedRoute from "../hoc/withProtectedRoute";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import avatarPlaceholder from "../assets/img/avatar-placeholder.png";
import { LocalAuthContext } from "../context/localAuth";
import axios from "axios";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Profile = Form.create()(({ form }) => {
  const [updateUserCalled, setUpdateUserCalled] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(false);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);

  const mounted = useRef();

  const {
    localAuth: { currentLocalUser, isAuthenticated, userToken } = {},
    dispatch: authDispatch,
    types: authTypes,
  } = useContext(LocalAuthContext);

  useEffect(() => {
    mounted.current = true;

    return () => (mounted.current = false);
  });

  const { getFieldDecorator, validateFields } = form;

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((errors, values) => {
      if (!errors) {
        const { fullname, photoURL } = values;

        if (fullname || photoURL) {
          updateCurrentUser();
        }

        async function updateCurrentUser() {
          const RESPONSE_TYPES = {
            updated: "updated",
          };

          let responseType;
          let source = axios.CancelToken.source();

          if (mounted.current) {
            setUpdateUserLoading(true);
          }

          const data = JSON.stringify({
            displayName: fullname,
            photoURL,
          });

          await axios({
            method: "PATCH",
            url: `http://localhost:4000/api/user`,
            headers: {
              "Content-Type": "application/json",
              Authorization:
                isAuthenticated && userToken ? `Bearer ${userToken}` : ``,
            },
            data,
            cancelToken: source.token,
            validateStatus: (status) => {
              if (status === 204) {
                responseType = RESPONSE_TYPES.updated;
              }
              return true;
            },
          }).catch((error) => {
            if (axios.isCancel(error)) {
              console.warn("Cancelled axios request");
            }

            console.warn(error.message);

            if (mounted.current) {
              setUpdateUserError(error.message);
              setUpdateUserLoading(false);
            }
          });

          if (mounted.current && responseType === RESPONSE_TYPES.updated) {
            setUpdateUserLoading(false);
            setUpdateUserCalled(true);
            authDispatch({
              type: authTypes.UPDATE_CURRENT_USER,
              payload: {
                displayName: fullname,
                photoURL,
              },
            });
          }
        }
      }
    });
  }

  return (
    <Layout style={{ background: "#f3f3f3" }}>
      <Header />
      <Content
        style={{
          paddingTop: 48,
          paddingRight: 16,
          paddingBottom: 88,
          paddingLeft: 16,
        }}
      >
        <Row type="flex" justify="center">
          <Col span={24} lg={12}>
            <Row>
              <Col
                style={{
                  marginBottom: 24,
                }}
              >
                <Title level={3}>Your account</Title>
              </Col>

              {currentLocalUser && (
                <Col
                  style={{
                    background: "white",
                    padding: 24,
                  }}
                >
                  <Row>
                    <Col>
                      <Row gutter={[24, 24]} type="flex" align="middle">
                        <Col span={8} sm={4}>
                          <Image
                            fluid
                            roundedCircle
                            src={
                              currentLocalUser.photoURL
                                ? currentLocalUser.photoURL
                                : avatarPlaceholder
                            }
                            onError={(e) => (e.target.src = avatarPlaceholder)}
                          />
                        </Col>
                        <Col span={16} sm={20}>
                          <Title
                            level={4}
                            style={{
                              marginBottom: 8,
                            }}
                          >
                            {currentLocalUser.displayName}
                          </Title>
                          <Paragraph
                            style={{
                              marginBottom: 0,
                            }}
                          >
                            {currentLocalUser.email}
                          </Paragraph>
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <Divider />
                    </Col>
                    <Col>
                      <Title
                        level={4}
                        style={{
                          marginBottom: 24,
                        }}
                      >
                        Update profile
                      </Title>
                      <Form layout="vertical" onSubmit={handleSubmit}>
                        <Form.Item label="Full name" hasFeedback>
                          {getFieldDecorator(`fullname`, {
                            rules: [
                              {
                                required: true,
                                message: "Please enter your name",
                              },
                            ],
                          })(<Input placeholder="Full name" />)}
                        </Form.Item>

                        <Form.Item label="Image url" hasFeedback>
                          {getFieldDecorator(`photoURL`)(
                            <Input placeholder="Image url" />,
                          )}
                        </Form.Item>

                        {updateUserCalled &&
                          !updateUserError &&
                          !updateUserLoading && <Paragraph>Updated</Paragraph>}

                        <Button
                          type="primary"
                          size="large"
                          disabled={updateUserLoading}
                          loading={updateUserLoading}
                          htmlType="submit"
                          style={{
                            minWidth: 200,
                          }}
                        >
                          Submit
                        </Button>
                      </Form>
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
});

export default withProtectedRoute()(Profile);
