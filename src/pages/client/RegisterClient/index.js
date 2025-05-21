import { Row, Col, Form, Input, Button, Flex, message } from "antd";
import logo2 from "../../../images/logo-2.png";
import lmsImage from "../../../images/client/learning-management-system_pixian_ai.png";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterClient.scss";
import { register } from "../../../services/client/userService";
import { useState } from "react";

function RegisterClient() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (data) => {
        setLoading(true);
        delete data["confirm-password"];
        if (!data.phone) {
            data.phone = "";
        };

        const result = await register(data);
        if (result.code === 200) {
            navigate(`/users/confirm/otp/${result.email}`);
            message.success(result.message);
        } else {
            message.error(result.message);
        }
        setLoading(false);
    };
    return (
        <>
            <div className="register-client">
                <Row style={{ height: "100%" }}>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <div className="register-client__inner-content">
                            <div className="register-client__content">
                                <div className="register-client__header-form">
                                    <div className="register-client__logo">
                                        <img src={logo2} alt="logo" />

                                        <h1 className="register-client__title">
                                            Đăng ký
                                        </h1>
                                    </div>
                                </div>

                                <div className="register-client__form">
                                    <Form
                                        form={form}
                                        name="login"
                                        onFinish={handleSubmit}
                                        layout="vertical"
                                        size="large"
                                    >
                                        <Form.Item
                                            label={<b>Email</b>}
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Email không thể bỏ trống!"
                                                }
                                            ]}
                                        >
                                            <Input placeholder="Nhập email" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<b>Họ tên</b>}
                                            name="fullName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Họ tên không thể bỏ trống!"
                                                }
                                            ]}
                                        >
                                            <Input placeholder="Họ tên" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<b>Mật khẩu</b>}
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Mật khẩu không thể bỏ trống!"
                                                }
                                            ]}
                                        >
                                            <Input.Password placeholder="Nhập mật khẩu" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<b>Xác nhận mật khẩu</b>}
                                            name='confirm-password'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Hãy xác nhận mật khẩu!',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Mật khẩu bạn nhập không khớp!'));
                                                    },
                                                })
                                            ]}
                                        >
                                            <Input.Password placeholder="Nhập lại mật khẩu" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<b>Số điện thoại</b>}
                                            name="phone"
                                        >
                                            <Input placeholder="Số điện thoại" />
                                        </Form.Item>



                                        <Form.Item>
                                            <Button loading={loading} block type="primary" htmlType="submit">
                                                Đăng ký
                                            </Button>
                                        </Form.Item>

                                        <Form.Item>
                                            <Flex align="center" justify="center">
                                                <Link to={"/users/login"}>Đăng nhập</Link>
                                            </Flex>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col lg={12} md={0} sm={0} xs={0}>
                        <div className="register-client__inner-image">
                            <img className="register-client__image" src={lmsImage} />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default RegisterClient;