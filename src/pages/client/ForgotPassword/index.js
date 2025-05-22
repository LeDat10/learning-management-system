import { Form, Input, Button, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import logo2 from "../../../images/logo-2.png";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../services/client/userService";
import { useState } from "react";
import "./ForgotPassword.scss";

function ForgotPassword() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (value) => {
        setLoading(true);
        const result = await forgotPassword(value);
        if (result.code === 200) {
            navigate(`/users/password/otp?email=${result.email}`);
            message.success(result.message);
        } else {
            message.error(result.message);
        }
        setLoading(false);
    };
    return (
        <>
            <div className="forgot__header-form">
                <div className="forgot__logo">
                    <img src={logo2} alt="logo" />

                    <h1 className="forgot__title">
                        Đặt lại mật khẩu
                    </h1>
                </div>
            </div>

            <div className="forgot__form">
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

                    <Form.Item>
                        <Button loading={loading} block type="primary" htmlType="submit">
                            Gửi mail xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default ForgotPassword;