// import logo from "../../../images/logo.png";
import logo from "../../../images/logo-22DQx7cW.svg";
import { Menu, Input, Button, Drawer } from 'antd';
import { AppstoreOutlined, AlignCenterOutlined } from "@ant-design/icons";
import "./LayoutDefalut.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
const { Search } = Input;

function NavBar() {
    const [showDrawer, setShowDrawer] = useState(false);
    const items = [
        {
            label: <div className="header__label">Danh mục</div>,
            key: "category"
        },
        {
            label: <Link to={"/"} className="header__label">Trang chủ</Link>,
            key: "home"
        },
        {
            label: <Link to={"/courses"} className="header__label">Khóa học</Link>,
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
        // {
        //     label: <Search className="home__input" placeholder="Tìm kiếm..." size="large" />,
        //     key: "search"
        // },
    ];
    const onClose = () => {
        setShowDrawer(false);
    }

    const open = () => {
        setShowDrawer(true);
    }
    return (
        <>
            <div className="navbar">
                <Button icon={<AlignCenterOutlined />} type="text" size="large" onClick={open} />

                <Drawer placement="top" closable={true} onClose={onClose} open={showDrawer}>
                    <Menu mode="inline" items={items} defaultSelectedKeys={"home"} />
                </Drawer>
            </div>
        </>
    );
};

export default NavBar;