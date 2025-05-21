import { Button, Drawer, message, Tree } from "antd";
import { SettingFilled } from "@ant-design/icons";
import './Role.scss';
import { useState } from "react";
import { setPermissions } from "../../../services/admin/roleService";
import { useSelector } from "react-redux";


function Permission(props) {
    const { record } = props;
    const [open, setOpen] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const handleReload = () => {
        setReload(!reload);
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const treeData = [
        {
            title: <b>Khóa học</b>,
            key: "courses",
            children: [
                {
                    title: 'Xem',
                    key: 'courses_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'courses_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'courses_edit',
                },
                {
                    title: 'Xóa',
                    key: 'courses_delete',
                },
                {
                    title: 'Thùng rác',
                    key: 'courses_trash'
                },
                {
                    title: 'Khôi phục',
                    key: 'courses_restore'
                },
                {
                    title: 'Xóa vĩnh viễn',
                    key: 'courses_delete-permanently'
                }
            ],
        },
        {
            title: <b>Danh mục khóa học</b>,
            key: "category",
            children: [
                {
                    title: 'Xem',
                    key: 'category_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'category_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'category_edit',
                },
                {
                    title: 'Xóa',
                    key: 'category_delete',
                },
                {
                    title: 'Thùng rác',
                    key: 'category_trash'
                },
                {
                    title: 'Khôi phục',
                    key: 'category_restore'
                },
                {
                    title: 'Xóa vĩnh viễn',
                    key: 'category_delete-permanently'
                }
            ],
        },
        {
            title: <b>Chương</b>,
            key: "sections",
            children: [
                {
                    title: 'Xem',
                    key: 'sections_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'sections_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'sections_edit',
                },
                {
                    title: 'Xóa',
                    key: 'sections_delete',
                },
                {
                    title: 'Thùng rác',
                    key: 'sections_trash'
                },
                {
                    title: 'Khôi phục',
                    key: 'sections_restore'
                },
                {
                    title: 'Xóa vĩnh viễn',
                    key: 'sections_delete-permanently'
                }
            ],
        },
        {
            title: <b>Bài học</b>,
            key: "lessons",
            children: [
                {
                    title: 'Xem',
                    key: 'lessons_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'lessons_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'lessons_edit',
                },
                {
                    title: 'Xóa',
                    key: 'lessons_delete',
                },
                {
                    title: 'Thùng rác',
                    key: 'lessons_trash'
                },
                {
                    title: 'Khôi phục',
                    key: 'lessons_restore'
                },
                {
                    title: 'Xóa vĩnh viễn',
                    key: 'lessons_delete-permanently'
                }
            ],
        },
        {
            title: <b>Nhóm quyền</b>,
            key: "roles",
            children: [
                {
                    title: 'Xem',
                    key: 'roles_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'roles_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'roles_edit',
                },
                {
                    title: 'Xóa',
                    key: 'roles_delete',
                },
                {
                    title: 'Phân quyền',
                    key: 'roles_permissions',
                },
                {
                    title: 'Thùng rác',
                    key: 'roles_trash'
                },
                {
                    title: 'Khôi phục',
                    key: 'roles_restore'
                },
                {
                    title: 'Xóa vĩnh viễn',
                    key: 'roles_delete-permanently'
                }
            ],
        },
        {
            title: <b>Tài khoản</b>,
            key: "accounts",
            children: [
                {
                    title: 'Xem',
                    key: 'accounts_view',
                },
                {
                    title: 'Thêm mới',
                    key: 'accounts_create',
                },
                {
                    title: 'Chỉnh sửa',
                    key: 'accounts_edit',
                },
                {
                    title: 'Xóa',
                    key: 'accounts_delete',
                },
                {
                    title: 'Thùng rác',
                    key: 'accounts_trash'
                },
                {
                    title: 'Khôi phục',
                    key: 'accounts_restore'
                },
                {
                    title: 'Xóa vĩnh viễn',
                    key: 'accounts_delete-permanently'
                }
            ],
        },
    ]

    const handleOnCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    const handleClick = async () => {
        setLoading(true);
        const filteredKeys = checkedKeys.filter(
            (key) => !treeData.some((node) => node.key === key)
        );
        const result = await setPermissions({
            id: record._id,
            permissions: filteredKeys
        });

        if (result.code === 200) {
            message.success(result.message);
            handleReload();
        } else {
            message.error(result.message);
        };
        setLoading(false);
    };

    return (
        <>
            <div>
                <Button icon={<SettingFilled />} color="purple" variant="filled" onClick={showDrawer}>
                    Phân quyền
                </Button>

                {permissions.includes("roles_permissions") ? (
                    <Drawer
                        title={record.title}
                        onClose={onClose}
                        open={open}
                        extra={
                            <Button loading={loading} type="primary" onClick={handleClick}>
                                Cập nhật
                            </Button>
                        }
                    >
                        <Tree
                            treeData={treeData}
                            checkable
                            onCheck={handleOnCheck}
                            defaultCheckedKeys={record.permissions}
                            defaultExpandedKeys={treeData.map(node => node.key)}
                            autoExpandParent={true}
                        />
                    </Drawer>
                ) : (
                    <Drawer
                        title={record.title}
                        onClose={onClose}
                        open={open}
                    >
                        <div>Không được cấp quyền truy cập</div>
                    </Drawer>
                )}
            </div>
        </>
    );
};

export default Permission;