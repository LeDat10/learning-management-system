import { Button, Col, Drawer, Layout, Row } from "antd";
import { Link, Outlet, useParams } from "react-router-dom";
import "./Course.scss";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDetailCourse } from "../../../services/client/courseSevice";
import { Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

function PlayCourse() {
    const [collapsed, setCollapsed] = useState(false);
    const [course, setCourse] = useState({});
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const params = useParams();
    const slugCourse = params.slugCourse;
    const fetchAPI = async () => {
        const result = await getDetailCourse(slugCourse);
        if (result.code === 200) {
            setCourse(result.course);
            setItems(result.course.sections.map((section) => ({
                key: section._id,
                label: <Link to={`/courses/${slugCourse}/play-course/${result.course._id}/${section._id}/${null}`}>{section.title}</Link>,
                children: section.lessons.map((lesson) => ({
                    key: lesson._id,
                    label: <Link to={`/courses/${slugCourse}/play-course/${result.course._id}/${section._id}/${lesson._id}`}>{lesson.title}</Link>,
                })),
            })));
        };
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    const onClose = () => {
        setOpen(false);
    };

    const showDrawer = () => {
        setOpen(true);
    };
    return (
        <>
            <Layout className="course__layout-sider">
                <Sider theme="light"
                    width={339}
                    collapsed={collapsed}
                    className="sider course__sider-layout"
                    breakpoint="md"
                    collapsedWidth={0}
                >
                    <Link to={`/courses/detail/${slugCourse}`} className="sider__inner-logo" style={{ width: "339px" }}>
                        <img src={course.thumbnail} alt={course.title} className="course__img-layout" />
                        <h5 className='sider__label course__label-sider' collapsed={`${collapsed}`}>{course.title}</h5>
                    </Link>

                    <Menu
                        mode="inline"
                        items={items}
                        theme="light"
                        triggerSubMenuAction={"click"}
                        style={{ width: "339px" }}
                    />
                </Sider>

                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: "#fff",
                            borderBottom: '1px solid #ddd',
                            position: 'sticky',
                            height: "65",
                            top: 65,
                            zIndex: 1,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                        }} >
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => {
                                setCollapsed(!collapsed);
                            }}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>

                    <Content className='content'>
                        <Outlet />
                    </Content>
                </Layout >
            </Layout>

            <Layout className="course__layout-basic">
                <Header
                    style={{
                        padding: 0,
                        background: "#fff",
                        borderBottom: '1px solid #ddd',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        overflow: "hidden"
                        // width: '100%',
                        // display: 'flex',
                        // alignItems: 'center',
                    }}
                    className="layout-basic__header">
                    <Row>
                        <Col style={{height: "64px"}}>
                            <Link to={`/courses/detail/${slugCourse}`} className="layout-basic__inner-logo">
                                <img src={course.thumbnail} alt={course.title} className="course__img-layout" />
                            </Link>
                        </Col>

                        <Col style={{height: "64px"}}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={showDrawer}
                                className="layout-basic__button"
                            />
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
                                <Col span={19} flex={"auto"}>
                                    <Link to={`/courses/detail/${slugCourse}`}>
                                        <Row align={"middle"}>
                                            <Col span={19}>
                                                <h5 className='sider__label course__label-sider word-wrap' collapsed={`${collapsed}`}>{course.title}</h5>
                                            </Col>
                                        </Row>
                                    </Link>
                                </Col>

                                <Col span={5}>
                                    <Button style={{
                                        border: "0px",
                                        fontSize: "16px",
                                        width: '100%',
                                        height: "64px"
                                    }} icon={<CloseOutlined />}
                                        onClick={onClose}
                                    />
                                </Col>
                            </Row>
                        </div>}
                    >
                        <Menu
                            mode="inline"
                            items={items}
                            theme="light"
                            triggerSubMenuAction={"click"}
                        />
                    </Drawer>

                    <Outlet />
                </Content>
            </Layout>


        </>
    );
};

export default PlayCourse;