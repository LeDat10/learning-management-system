import NavBar from "./NavBar";
// import logo from "../../../images/logo.png";
import logo from "../../../images/logo-22DQx7cW.svg";
import { Menu, Input, Button, Popover } from 'antd';
import { AppstoreOutlined, UserOutlined, SettingOutlined, PoweroffOutlined } from "@ant-design/icons";
import "./LayoutDefalut.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { Search } = Input;
function Header() {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    console.log(isMobile)

    const items = [
        {
            label: <Link to={"/"} className="header__label">Home</Link>,
            key: "home"
        },
        {
            label: <Link to={"/courses"} className="header__label">Course</Link>,
            key: "course"
        },
        {
            label: <div className="header__label">Pages</div>,
            key: "instructors"
        },
        {
            label: <div className="header__label">Slider</div>,
            key: "events"
        },
    ];

    const content = (
        <div className="header__user">
            <div className="header__info">
                <div className="header__avatar-pop">
                    <img src="https://themes.stackbros.in/eduport_r/assets/01-7N0KytgQ.jpg" alt="Avatar" />
                </div>

                <div className="header__content-info">
                    <div className="header__full-name">
                        Nguyễn Văn A
                    </div>

                    <div className="header__email">
                        nguyenvana@gmail.com
                    </div>
                </div>
            </div>

            <div className="header__menu-info">
                <Button icon={<UserOutlined />} type="text" color="primary">Chỉnh sửa thông tin</Button>
                <Button icon={<SettingOutlined />} type="text" color="primary">Cài đặt tài khoản</Button>
                <Button icon={<PoweroffOutlined />} type="text" danger>Đăng xuất</Button>
            </div>
        </div>
    );



    return (
        <>
            <div className="container">
                <div className="header__content">
                    <div className="header__left">
                        <div className="header__logo">
                            <img src={logo} />
                        </div>

                        <div className="header__button">
                            <Button color="primary" variant="filled" icon={<AppstoreOutlined />} size="large">
                                Danh mục
                            </Button>
                        </div>
                    </div>

                    <div className="header__mid">
                        <Menu mode="horizontal" className="header__menu" key={isMobile ? 'mobile' : 'desktop'} items={items} />

                    </div>

                    <div className="header__right">
                        <div className="header__search">
                            <Search className="home__input" placeholder="Tìm kiếm..." size="large" />
                        </div>

                        <NavBar />

                        <div className="header__avatar">
                            <Popover content={content} trigger="click" placement="bottomRight">
                                <img src="https://themes.stackbros.in/eduport_r/assets/01-7N0KytgQ.jpg" alt="Avatar" />
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;