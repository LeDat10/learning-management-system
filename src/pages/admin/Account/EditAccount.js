import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { processThumbnail } from "../../../helper/processThumnail";
import { Button, Col, Form, Input, message, Row, Select, Switch, Upload } from "antd";
import { checkImage } from "../../../helper/checkImage";
import { PlusOutlined } from "@ant-design/icons";
import { editAccount, getDetailAccount, getRoles } from "../../../services/admin/accountService";
import { useSelector } from "react-redux";


function EditAccount() {
    const params = useParams();
    const accountId = params.accountId;
    const [account, setAccount] = useState({});
    const [form] = Form.useForm();
    const [originalThumbnail, setOriginalThumbnail] = useState(null);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roleOptions, setRoleOptions] = useState([]);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailAccount(accountId);
        setAccount(result.account);
        setOriginalThumbnail(result.account.avatar);
    };

    const fetchAPIRole = async () => {
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

    const handleReload = () => {
        setReload(!reload);
    };

    useEffect(() => {
        fetchAPIRole();
    }, []);

    useEffect(() => {
        fetchAPI();
    }, [reload]);

    useEffect(() => {
        const formInitialValues = async () => {
            if (Object.keys(account).length > 0) {
                if (account.status === "active") {
                    account.status = true;
                } else if (account.status === "inactive") {
                    account.status = false;
                };

                form.setFieldsValue({
                    fullName: account.fullName || "",
                    status: account.status,
                    avatar: await processThumbnail(account.avatar),
                    email: account.email,
                    phone: account.phone,
                    role_id: account.role_id || "",
                });
            };
        };
        formInitialValues();
    }, [account]);

    const handleSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        for (const key in data) {
            if (key === "avatar") {
                const newFile = data[key]?.[0];
                if (!newFile) {
                    // Người dùng đã xóa ảnh (fileList rỗng) → gửi thumbnail = ""
                    formData.append("avatar", "");
                } else {
                    if (newFile.url === originalThumbnail) {
                        // Không thay đổi ảnh → không append gì
                        continue;
                    }

                    if (newFile.originFileObj) {
                        // Người dùng chọn ảnh mới → gửi file
                        formData.append("avatar", newFile.originFileObj);
                    }
                }
            } else if (key === "status") {
                if (data[key]) {
                    formData.append("status", "active");
                } else {
                    formData.append("status", "inactive");
                }
            } else if (key === "confirm-password") {
                continue;
            } else if (key === "password") {
                if (data[key]) {
                    formData.append("password", data[key]);
                } else {
                    continue;
                };
            } else if (key === "phone") {
                if (data[key]) {
                    formData.append("phone", data[key]);
                } else {
                    continue;
                }
            } else {
                formData.append(key, data[key]);
            }
        };
        const result = await editAccount(accountId, formData);
        if (result.code === 200) {
            message.success(result.message);
            handleReload();
        } else {
            message.error(result.message);
        };
        setLoading(false);
    };

    return (
        <>
            {permissions.includes("accounts_edit") ? (
                <div className="account">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="title-page">
                                        Chỉnh sửa tài khoản
                                    </h3>
                                </Col>

                                {permissions.includes("accounts_view") && (
                                    <Col flex="none">
                                        <Link to={'/admin/accounts'}>
                                            <Button color="primary" variant="outlined">Danh sách tài khoản</Button>
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
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item
                                        label="Xác nhận mật khẩu"
                                        name='confirm-password'
                                        dependencies={["password"]}
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    const password = getFieldValue("password");

                                                    // Nếu không có mật khẩu thì không yêu cầu xác nhận
                                                    if (!password) {
                                                        return Promise.resolve();
                                                    }

                                                    // Nếu có mật khẩu mà không nhập xác nhận
                                                    if (!value) {
                                                        return Promise.reject(new Error("Vui lòng nhập xác nhận mật khẩu!"));
                                                    }

                                                    // Nếu mật khẩu và xác nhận không khớp
                                                    return password === value
                                                        ? Promise.resolve()
                                                        : Promise.reject(new Error("Mật khẩu không khớp!"));
                                                }
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
                                        <Button loading={loading} style={{ backgroundColor: '#20d489', color: '#fff' }} htmlType="submit" >Cập nhật</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền chỉnh sửa tài khoản</div>
            )}
        </>
    );
};

export default EditAccount;