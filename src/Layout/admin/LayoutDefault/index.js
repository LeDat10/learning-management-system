import { Button, Col, Drawer, Flex, Layout, Row } from "antd";
import { Link, Outlet } from "react-router-dom";
import Logo from "../../../images/admin/image.png";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./LayoutDefaultAdmin.scss";
import MenuSider from "./MenuSider";
import { CloseOutlined } from "@ant-design/icons";
import Info from "./Info";

const { Header, Sider, Content } = Layout;

function LayoutDefaultAdmin() {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    };

    const showDrawer = () => {
        setOpen(true);
    };
    return (
        <>
            <Layout className="layout-sider">
                <Sider theme="light"
                    collapsed={collapsed}
                    className="sider"
                    breakpoint="md"
                    onBreakpoint={(below) => {
                        if (below) {
                            // Khi < 768px → tự động thu gọn
                            setCollapsed(true);
                        } else {
                            // Khi >= 768px → tự động mở ra
                            setCollapsed(false);
                        }
                    }}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'sticky',
                        insetInlineStart: 0,
                        top: 0,
                        bottom: 0,
                    }}
                >
                    <Link to={"/admin/dashboard"} className="sider__inner-logo">
                        <img src={Logo} alt="Adminator" />
                        <h5 className='sider__label' collapsed={`${collapsed}`}>Adminator</h5>
                    </Link>

                    <MenuSider />
                </Sider>

                <Layout>
                    <Header
                        className="header"
                    >
                        <Flex justify="space-between" align="center">
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => {
                                    if (window.innerWidth >= 768) {
                                        setCollapsed(!collapsed);
                                    };
                                }}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />

                            <Info />
                        </Flex>
                    </Header>

                    <Content className='content'>
                        <Outlet />
                    </Content>
                </Layout >
            </Layout>

            <Layout className="layout-basic">
                <Header>
                    <Row style={{
                        width: "100%",
                        position: 'sticky',
                        top: "0",
                        zIndex: 999
                    }} justify={"space-between"}>
                        <Col>
                            <Row>
                                <Col>
                                    <Link to={'/admin/dashboard'} className="layout-basic__inner-logo">
                                        <img src={Logo} alt="Adminator" />
                                    </Link>
                                </Col>

                                <Col>
                                    <Button
                                        type="text"
                                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                        onClick={showDrawer}
                                        className="layout-basic__button"
                                    />
                                </Col>
                            </Row>
                        </Col>

                        <Col>
                            <Flex style={{height: "100%"}} align="center">
                                <Info />
                            </Flex>
                        </Col>
                    </Row>
                </Header>

                <Content className='content'>
                    <Drawer
                        open={open}
                        placement='left'
                        closable={false}
                        onClose={onClose}
                        width={"70%"}
                        className="drawer"
                        title={<div>
                            <Row align={"middle"} justify={"space-between"}>
                                <Col flex={"auto"}>
                                    <Link to={"/admin/dashboard"}>
                                        <Row align={"middle"}>
                                            <Col>
                                                <img src={Logo} alt="Adminator" />
                                            </Col>

                                            <Col>
                                                <h5 className='sider__label'>Adminator</h5>
                                            </Col>
                                        </Row>
                                    </Link>
                                </Col>

                                <Col>
                                    <Button style={{
                                        border: "0px",
                                        fontSize: "16px",
                                        width: '64px',
                                        height: "64px"
                                    }} icon={<CloseOutlined />}
                                        onClick={onClose}
                                    />
                                </Col>
                            </Row>
                        </div>}
                    >
                        <MenuSider />
                    </Drawer>

                    <Outlet />
                </Content>
            </Layout>


        </>
    );
};

export default LayoutDefaultAdmin;