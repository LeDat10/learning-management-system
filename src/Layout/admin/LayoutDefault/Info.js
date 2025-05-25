import { Button, message, Popover } from "antd";
import { UserOutlined, SettingOutlined, PoweroffOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { getInfoAccount, logout } from "../../../services/admin/accountService";
import { logoutAccount } from "../../../actions/auth";

function Info() {
    const [account, setAccount] = useState({});
    const [loadingLogOut, setLoadingLogout] = useState(false);
    const naviagte = useNavigate();
    const dispatch = useDispatch();

    const fetchAPI = async () => {
        const result = await getInfoAccount();
        console.log(result);
        if (result.code === 200) {
            setAccount(result.account);
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
            dispatch(logoutAccount());
            naviagte("/admin/login");
        } else {
            message.error(result.message);
        };
        setLoadingLogout(false);
    };
    return (
        <>
            <div className="header__avatar">
                <Popover content={
                    <div className="header__account">
                        <div className="header__info">
                            <div className="header__avatar-pop">
                                <img src={account.avatar} alt={account.fullName} />
                            </div>

                            <div className="header__content-info">
                                <div className="header__full-name">
                                    {account.fullName}
                                </div>

                                <div className="header__email">
                                    {account.email}
                                </div>
                            </div>
                        </div>

                        <div className="header__menu-info">
                            <Button icon={<UserOutlined />} type="text" color="primary">Chỉnh sửa thông tin</Button>
                            <Button icon={<SettingOutlined />} type="text" color="primary">Cài đặt tài khoản</Button>
                            <Button loading={loadingLogOut} onClick={handleLogout} icon={<PoweroffOutlined />} type="text" danger>Đăng xuất</Button>
                        </div>
                    </div>
                } trigger="click" placement="bottomRight">
                    <img src={account.avatar} alt='Avatar' />
                </Popover>
            </div>
        </>
    );
};

export default Info;