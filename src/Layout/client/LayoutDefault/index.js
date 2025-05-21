// import logo from "../../../images/logo.png";
import logo from "../../../images/logo-22DQx7cW.svg";
import { Menu, Input, Button, Popover, Dropdown, Drawer } from 'antd';
import { AppstoreOutlined, UserOutlined, SettingOutlined, PoweroffOutlined, AlignCenterOutlined } from "@ant-design/icons";
import "./LayoutDefalut.scss";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
const { Search } = Input;
function LayoutDefault() {
    return (
        <>
            <div className="layout">
                <header className="header">
                    <Header />
                </header>

                <main className="main">
                    <Outlet />
                </main>

                <footer>
                    footer
                </footer>
            </div>

        </>
    );
};

export default LayoutDefault;