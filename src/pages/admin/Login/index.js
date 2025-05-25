import { Button, Col, Form, Input, message, Row } from "antd";
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from "../../../services/admin/accountService";
import { loginAccountSuccess } from "../../../actions/auth";
import { useState } from "react";
function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (value) => {
        setLoading(true);
        const result = await login(value);
        if (result.code === 200) {
            dispatch(loginAccountSuccess(result.token));
            navigate("/admin/dashboard");
            message.success(result.message);
        } else if (result.code === 401) {
            message.error(result.message);
        } else {
            message.error(result.message);
        };
        setLoading(false);
    };

    return (
        <>
            <div className="login">
                <div className="login__box">
                    <Row gutter={30} justify="center">
                        <Col span={16}>
                            <h1 className="login__title">Đăng nhập</h1>

                            <Form
                                form={form}
                                name="login"
                                onFinish={handleSubmit}
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Email không thể bỏ trống!"
                                        }
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Mật khẩu không thể bỏ trống!"
                                        }
                                    ]}
                                >
                                    <Input.Password prefix={<LockOutlined />} />
                                </Form.Item>

                                <Form.Item>
                                    <Button loading={loading} block type="primary" htmlType="submit">
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default Login;