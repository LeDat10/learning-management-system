import { Button, message, Popover } from "antd";
import { UserOutlined, SettingOutlined, PoweroffOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDetailUser, logout } from "../../../services/client/userService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logoutUser } from "../../../actions/auth";

function Info() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const naviagte = useNavigate();
    const dispatch = useDispatch();
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

    console.log(user);

    const handleLogout = async () => {
        setLoading(true);
        const result = await logout();
        if (result.code === 200) {
            message.success(result.message);
            dispatch(logoutUser());
            naviagte("/users/login");
        } else {
            message.error(result.message);
        };
        setLoading(false);
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
                            <Button loading={loading} onClick={handleLogout} icon={<PoweroffOutlined />} type="text" danger>Đăng xuất</Button>
                        </div>
                    </div>
                } trigger="click" placement="bottomRight">
                    <img src={user.avatar} alt='Avatar' />
                </Popover>
            </div>
        </>
    );
};

export default Info;