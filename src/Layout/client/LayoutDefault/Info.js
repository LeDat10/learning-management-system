import { Button, Flex, Form, Input, message, Modal, Popover } from "antd";
import { UserOutlined, SettingOutlined, PoweroffOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDetailUser, logout } from "../../../services/client/userService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../../actions/auth";
import { registerCourseWithCode } from "../../../services/client/enrollmentService";

function Info() {
    const [user, setUser] = useState({});
    const [loadingLogOut, setLoadingLogout] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const naviagte = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const fetchAPI = async () => {
        const result = await getDetailUser();
        if (result.code === 200) {
            setUser(result.user);
        } else {
            message.error(result.message);
        };
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    const handleLogout = async () => {
        setLoadingLogout(true);
        const result = await logout();
        if (result.code === 200) {
            message.success(result.message);
            dispatch(logoutUser());
            naviagte("/users/login");
        } else {
            message.error(result.message);
        };
        setLoadingLogout(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmitRegister = async (data) => {
        setLoadingRegister(true);
        const result = await registerCourseWithCode(data);
        if (result.code === 200) {
            form.resetFields();
            naviagte(`/courses/detail/${result.slugCourse}`);
        }
        setLoadingRegister(false);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="header__avatar">
                <Popover content={
                    <div className="header__user">
                        <div className="header__info">
                            <div className="header__avatar-pop">
                                <img src={user.avatar} alt={user.fullName} />
                            </div>

                            <div className="header__content-info">
                                <div className="header__full-name">
                                    {user.fullName}
                                </div>

                                <div className="header__email">
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="header__menu-info">
                            <Button icon={<UserOutlined />} type="text" color="primary">Chỉnh sửa thông tin</Button>
                            <Button icon={<SettingOutlined />} type="text" color="primary">Cài đặt tài khoản</Button>
                            <Button icon={<QrcodeOutlined />} type="text" color="primary" onClick={showModal}>Tham gia bằng mã lớp học</Button>
                            <Button loading={loadingLogOut} onClick={handleLogout} icon={<PoweroffOutlined />} type="text" danger>Đăng xuất</Button>
                        </div>
                    </div>
                } trigger="click" placement="bottomRight">
                    <img src={user.avatar} alt='Avatar' />
                </Popover>

                <Modal
                    title={<h2>Tham gia khóa học</h2>}
                    centered
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    width={{
                        xs: '90%',
                        sm: '80%',
                        md: '70%',
                        lg: '60%',
                        xl: '50%',
                        xxl: '40%',
                    }}
                >
                    <Form
                        form={form}
                        name="login"
                        onFinish={handleSubmitRegister}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            label={<b>Mã khóa học</b>}
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: "Mã khóa học không được bỏ trống!"
                                }
                            ]}
                        >
                            <Input placeholder="Nhập mã khóa học" />
                        </Form.Item>

                        <Form.Item>
                            <Flex justify="center">
                                <Button loading={loadingRegister} type="primary" htmlType="submit">
                                    Đi đến khóa học
                                </Button>
                            </Flex>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default Info;