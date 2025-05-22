import { useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from "antd";
import logo2 from "../../../images/logo-2.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ResetPassword.scss";
import { resetPassword } from '../../../services/client/userService';
import { LockOutlined } from "@ant-design/icons";


function ResetPassword() {
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        data.token = token;
        const result = await resetPassword(data);
        if (result.code === 200) {
            navigate(`/users/login`);
            message.success(result.message);
        } else {
            message.error(result.message);
        }
        setLoading(false);
    };
    return (
        <>
            <div className="reset__header-form">
                <div className="reset__logo">
                    <img src={logo2} alt="logo" />

                    <h1 className="reset__title">
                        Đặt lại mật khẩu
                    </h1>
                </div>
            </div>

            <div className="reset__form">
                <Form
                    form={form}
                    name="login"
                    onFinish={handleSubmit}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        label={<b>Mật khẩu</b>}
                        name="newPassword"
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
                        <Button loading={loading} block type="primary" htmlType="submit">
                            Đặt lại mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default ResetPassword;