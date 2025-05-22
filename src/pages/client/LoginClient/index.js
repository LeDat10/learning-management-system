import { Row, Col, Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import logo2 from "../../../images/logo-2.png";
import { Link, useNavigate } from "react-router-dom";
import "./LoginClient.scss";
import { loginUserSuccess } from "../../../actions/auth";
import { login } from "../../../services/client/userService";
import { useState } from "react";
import { useDispatch } from 'react-redux';

function LoginClient() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (value) => {
        setLoading(true);
        const result = await login(value);
        if (result.code === 200) {
            dispatch(loginUserSuccess(result.token));
            navigate("/courses");
            message.success(result.message);
        } else {
            message.error(result.message);
        }
        setLoading(false);
    };
    return (
        <>
            <div className="login-client__header-form">
                <div className="login-client__logo">
                    <img src={logo2} alt="logo" />

                    <h1 className="login-client__title">
                        Đăng nhập
                    </h1>
                </div>
            </div>

            <div className="login-client__form">
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
                        <Input placeholder="Nhập email" prefix={<MailOutlined />} />
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
                        <Input.Password placeholder="Nhập mật khẩu" prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Row justify={"space-between"} gutter={[12, 12]}>
                            <Col sm={16} xs={24}>
                                <div>Bạn chưa có tài khoản? <Link to={"/users/register"}>Đăng ký ngay</Link></div>
                            </Col>

                            <Col sm={8} xs={24}>
                                <Link to={"/users/password/forgot"}>Quên mật khẩu</Link>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item>
                        <Button loading={loading} block type="primary" htmlType="submit">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default LoginClient;