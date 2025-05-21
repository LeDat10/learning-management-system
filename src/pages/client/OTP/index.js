import { Row, Col, Form, Input, Button, message } from "antd";
import logo2 from "../../../images/logo-2.png";
import lmsImage from "../../../images/client/learning-management-system_pixian_ai.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./OTP.scss";
import { confirmOTP } from "../../../services/client/userService";
import { useState } from "react";

function OTP() {
    const [form] = Form.useForm();
    const params = useParams();
    const {email} = params;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        data.email = email;
        
        const result = await confirmOTP(data);

        if(result.code === 200) {
            navigate("/users/login");
            message.success(result.message);
        } else {
            message.error(result.message);
        };

        setLoading(false);
    }
    return (
        <>
            <div className="otp">
                <Row style={{ height: "100%" }}>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <div className="otp__inner-content">
                            <div className="otp__content">
                                <div className="otp__header-form">
                                    <div className="otp__logo">
                                        <img src={logo2} alt="logo" />

                                        <h1 className="otp__title">
                                            Nhập mã OTP xác thực
                                        </h1>

                                        <p className="otp__sub-title">Mã OTP đã được gửi về email <b>{email}</b>. Vui lòng nhập mã OTP vào ô bên dưới để xác thực tài khoản.</p>
                                    </div>
                                </div>

                                <div className="otp__form">
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
                            </div>
                        </div>
                    </Col>

                    <Col lg={12} md={0} sm={0} xs={0}>
                        <div className="otp__inner-image">
                            <img className="otp__image" src={lmsImage} />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default OTP;