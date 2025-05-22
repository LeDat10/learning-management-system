import { Form, Input, Button, message } from "antd";
import logo2 from "../../../images/logo-2.png";
import { useLocation } from "react-router-dom";
import "./ForgotOTP.scss";
import { otpPassword } from "../../../services/client/userService";
import { useState } from "react";

function ForgotOTP() {
    const [form] = Form.useForm();
    const query = new URLSearchParams(useLocation().search);
    const email = query.get('email');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        data.email = email;

        const result = await otpPassword(data);

        if (result.code === 200) {
            message.success(result.message);
            form.resetFields();
        } else {
            message.error(result.message);
        };

        setLoading(false);
    }
    return (
        <>
            <div className="forgot-otp__header-form">
                <div className="forgot-otp__logo">
                    <img src={logo2} alt="logo" />

                    <h1 className="forgot-otp__title">
                        Nhập mã OTP đặt lại mật khẩu
                    </h1>

                    <p className="forgot-otp__sub-title">Mã OTP đã được gửi về email <b>{email}</b>. Vui lòng nhập mã OTP vào ô bên dưới để đặt lại mật khẩu.</p>
                </div>
            </div>

            <div className="forgot-otp__form">
                <Form
                    form={form}
                    name="login"
                    onFinish={handleSubmit}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        label={<b>Mã OTP</b>}
                        name="otp"
                        rules={[
                            {
                                required: true,
                                message: "OTP không thể bỏ trống!"
                            }
                        ]}
                    >
                        <Input placeholder="Nhập mã OTP" />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={loading} block type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default ForgotOTP;