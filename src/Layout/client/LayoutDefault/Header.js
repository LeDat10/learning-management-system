import NavBar from "./NavBar";
// import logo from "../../../images/logo.png";
import logo from "../../../images/logo-22DQx7cW.svg";
import { Menu, Input, Button } from 'antd';
import { AppstoreOutlined } from "@ant-design/icons";
import "./LayoutDefalut.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Info from "./Info";

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

                        <Info />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;