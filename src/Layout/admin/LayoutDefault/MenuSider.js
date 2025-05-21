import { Menu } from "antd";
import { Link } from "react-router-dom";
import { DashboardOutlined, LaptopOutlined, KeyOutlined, UserOutlined } from "@ant-design/icons";

function MenuSider() {

    const items = [
        {
            key: 'dashboard',
            label: <Link to={"/admin/dashboard"}>Tổng quan</Link>,
            icon: <DashboardOutlined />
        },
        {
            key: 'course',
            label: "Khóa học",
            icon: <LaptopOutlined />,
            children: [
                {
                    key: "list-course",
                    label: <Link to={"/admin/courses"}>Khóa học</Link>
                },
                {
                    key: 'list-category',
                    label: <Link to={"/admin/category"}>Danh mục</Link>
                },
                {
                    key: "create-course",
                    label: <Link to={"/admin/courses/create"}>Thêm khóa học</Link>
                }
            ]
        },
        {
            key: 'role',
            label: "Nhóm quyền",
            icon: <KeyOutlined />,
            children: [
                {
                    key: 'list-role',
                    label: <Link to={"/admin/roles"}>Nhóm quyền</Link>
                },
                {
                    key: 'create-role',
                    label: <Link to={"/admin/roles/create"}>Thêm nhóm quyền</Link>
                }
            ]
        },
        {
            key: 'account',
            label: "Tài khoản",
            icon: <UserOutlined />,
            children: [
                {
                    key: 'list-account',
                    label: <Link to={"/admin/accounts"}>Tài khoản</Link>
                },
                {
                    key: 'create-account',
                    label: <Link to={"/admin/accounts/create"}>Thêm tài khoản</Link>
                }
            ]
        }
    ]

    return (
        <>
            <Menu
                mode="inline"
                items={items}
                defaultSelectedKeys={["dashboard"]}
                theme="light"
                triggerSubMenuAction={"click"}
            />
        </>
    );
};

export default MenuSider;