import { Button, Col, Form, Input, message, Row, Select, Switch, Upload } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkImage } from "../../../helper/checkImage";
import { PlusOutlined } from "@ant-design/icons";
import { createAccount, getRoles } from "../../../services/admin/accountService";
import "./Account.scss";
import { useSelector } from "react-redux";

function CreateAccount() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [roleOptions, setRoleOptions] = useState([]);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getRoles();
        setRoleOptions([
            {
                label: "-- Chọn quyền --",
                value: "",
                disabled: true
            },
            ...result.roles.map(role => ({
                value: role._id,
                label: role.title
            }))
        ]);
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    const handleSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();

        for (const key in data) {
            if (key === "avatar") {
                if (data[key]) {
                    formData.append("avatar", data.avatar[0].originFileObj);
                } else {
                    continue;
                };
            } else if (key === "status") {
                if (data[key]) {
                    formData.append("status", "active");
                } else {
                    formData.append("status", "inactive");
                }
            } else if (key === "confirm-password") {
                continue;
            } else {
                formData.append(key, data[key]);
            }
        }

        const result = await createAccount(formData);
        if (result.code === 200) {
            message.success(result.message);
            form.resetFields();
        } else if (result.code === 409) {
            message.error(result.message);
        } else {
            message.error(result.message);
        };

        setLoading(false);
    };

    return (
        <>
            {permissions.includes("accounts_create") ? (
                <div className="account">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="title-page">
                                        Thêm tài khoản
                                    </h3>
                                </Col>

                                {permissions.icludes("accounts_view") && (
                                    <Col flex="none">
                                        <Link to={`/admin/accounts`}>
                                            <Button color="primary" variant="outlined">
                                                Danh sách tài khoản
                                            </Button>
                                        </Link>
                                    </Col>
                                )}
                            </Row>
                        </div>

                        <Row>
                            <Col xs={24}>
                                <Form
                                    form={form}
                                    className="account__form"
                                    layout="vertical"
                                    size="large"
                                    initialValues={{
                                        status: true,
                                        role_id: ""
                                    }}
                                    onFinish={handleSubmit}
                                >
                                    <Form.Item
                                        label="Họ tên"
                                        name="fullName"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Họ tên không thể bỏ trống!"
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            {
                                                type: 'email',
                                                required: true,
                                                message: "Email không thể bỏ trống!"
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label="Mật khẩu"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Mật khẩu không thể bỏ trống!',
                                            },
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        label="Xác nhận mật khẩu"
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
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Row align={"middle"}>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                                            <Form.Item label="Ảnh" name="avatar" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList || []}>
                                                <Upload listType="picture-card" maxCount={1} name="avatar" accept="image/*" beforeUpload={(file) => checkImage(file, Upload)}>
                                                    <button
                                                        style={{
                                                            color: 'inherit',
                                                            cursor: 'inherit',
                                                            border: 0,
                                                            background: 'none',
                                                        }}
                                                        type="button"
                                                    >
                                                        <PlusOutlined />
                                                        <div
                                                            style={{
                                                                marginTop: 8,
                                                            }}
                                                        >
                                                            Upload
                                                        </div>
                                                    </button>
                                                </Upload>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                                            <Form.Item
                                                label="Trạng thái"
                                                name="status"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Hoạt động"
                                                    unCheckedChildren="Dừng hoạt động"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                                            <Form.Item
                                                label="Phân quyền"
                                                name="role_id"
                                            >
                                                <Select options={roleOptions} />
                                            </Form.Item>
                                        </Col>


                                    </Row>

                                    <Form.Item>
                                        <Button loading={loading} style={{ backgroundColor: '#20d489', color: '#fff' }} htmlType="submit" >Thêm tài khoản</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền thêm tài khoản</div>
            )}
        </>
    );
};

export default CreateAccount;