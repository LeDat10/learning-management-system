import { Button, Card, Checkbox, Col, Pagination, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { changeMultiRole, deleteRole, getRole } from "../../../services/admin/roleService";
import parse from "html-react-parser";
import { useQueryParams } from "../../../hooks/useQueryParams";
import InputSearch from "../../../Components/InputSearch";
import Sort from "../../../Components/Sort";
import ChangeMulti from "../../../Components/ChangeMulti";
import Delete from "../../../Components/Delete";
import Permission from "./Permission";
import { RedoOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Meta } = Card;

function Role() {
    const [roles, setRoles] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const limit = 5;
    const [totalRole, setTotalRole] = useState(1);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async (params = {}) => {
        const result = await getRole(params);
        setRoles(result.roles);
        setTotalRole(result.totalRole);
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || 'title';
        const sortValue = queryParams.get('sortValue') || 'asc';
        const keyword = queryParams.get('keyword') || '';
        const page = queryParams.get('page') || 1;
        fetchAPI(
            {
                sortKey: sortKey,
                sortValue: sortValue,
                keyword: keyword,
                page: page,
                limit: limit
            }
        );
    }, [reload, location.search]);

    const handleReload = () => {
        setReload(!reload);
    };

    const columns = [
        {
            title: "Nhóm quyền",
            dataIndex: "title",
            key: "title",
            render: (title, record) => <Link to={`/admin/roles/detail/${record._id}`} >{title}</Link>
        },
        {
            title: "Mô tả ngắn",
            dataIndex: "description",
            key: "description",
            width: 700,
            render: (value) => parse(value) || ""
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Row gutter={[10, 10]}>
                        {permissions.includes("roles_permissions") && (
                            <Col>
                                <Permission record={record} />
                            </Col>
                        )}

                        {permissions.includes("roles_edit") && (
                            <Col>
                                <Link to={`/admin/roles/edit/${record._id}`} >
                                    <Button color="primary" variant="filled">Chỉnh sửa</Button>
                                </Link>
                            </Col>
                        )}

                        {permissions.includes("roles_delete") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteRole} textConfirm={"Bạn có muốn xóa nhóm quyền này không?"} />
                            </Col>
                        )}
                    </Row>
                </>
            )
        }
    ];

    const sortOptions = [
        {
            value: "title-asc",
            label: "-- Tiêu đề từ A - Z --"
        },
        {
            value: "title-desc",
            label: "-- Tiêu đề từ Z - A --"
        }
    ];

    const changeMultiOption = [
        {
            value: '',
            label: "-- Chọn hành động --",
            disabled: true
        },
        {
            value: 'delete-all',
            label: "-- Xóa tất cả --"
        }
    ];

    const handleSearch = (keyword) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('keyword', keyword);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

    const handleSort = (value) => {
        const [sortKey, sortValue] = value.split("-");
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('sortKey', sortKey);
        queryParams.set('sortValue', sortValue);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const setRowKeysEmpty = () => {
        setSelectedRowKeys([]);
    };

    const handleCheck = (id) => {
        setSelectedRowKeys((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleChangePagination = (page) => {
        const queryParams = new URLSearchParams(location.search);

        queryParams.set('page', page);
        queryParams.set('limit', limit);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

    return (
        <>
            {permissions.includes("roles_view") ? (
                <div className="role">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row justify="space-between" align="middle" gutter={[20, 20]}>
                                <Col md={12}>
                                    <h3 className="role__title">
                                        Danh sách nhóm quyền
                                    </h3>
                                </Col>

                                <Col flex="none">
                                    <Row gutter={[10, 10]}>
                                        {permissions.includes("roles_delete") && (
                                            <Col flex="none">
                                                <div className="course__change-multi">
                                                    <ChangeMulti
                                                        changeMultiOption={changeMultiOption}
                                                        onReload={handleReload}
                                                        selectedRowKeys={selectedRowKeys}
                                                        rowKeysEmpty={setRowKeysEmpty}
                                                        changeMulti={changeMultiRole}
                                                        textConfirm="Bạn có chắc muốn xóa những nhóm quyền này này?"
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                        {permissions.includes("roles_create") && (
                                            <Col>
                                                <Link to={'/admin/roles/create'}>
                                                    <Button color="primary" variant="outlined">Thêm nhóm quyền</Button>
                                                </Link>
                                            </Col>
                                        )}

                                        {permissions.includes("roles_trash") && (
                                            <Col flex="none">
                                                <Link to={'/admin/roles/trash'}><Button icon={<RedoOutlined />} color="purple" variant="outlined">Khôi phục</Button></Link>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <div className="role__filter-bar">
                            <Row gutter={[30, 20]}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <InputSearch valueDefault={queryParams.get('keyword') || ''} onSearch={handleSearch} />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect={`${queryParams.get('sortKey') || "title"}-${queryParams.get('sortValue') || "asc"}`} />
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col span={24}>
                                <div className="role__table">
                                    <Table rowSelection={rowSelection} columns={columns} dataSource={roles} rowKey="_id" pagination={false} />
                                </div>

                                <div className="role__card">
                                    <Row gutter={[20, 20]}>
                                        {roles && (
                                            roles.map(role => (
                                                <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} key={role._id}>
                                                    <Card
                                                        actions={[
                                                            <Checkbox
                                                                checked={selectedRowKeys.includes(role._id)}
                                                                onChange={() => handleCheck(role._id)}
                                                            >
                                                            </Checkbox>,
                                                        ]}
                                                        hoverable
                                                        type="inner"
                                                        extra={
                                                            <>
                                                                <Row style={{ marginTop: "5px", marginBottom: "5px" }} gutter={[10, 10]} justify={"end"}>
                                                                    {permissions.includes("roles_permissions") && (
                                                                        <Col>
                                                                            <Permission record={role} />
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("roles_edit") && (
                                                                        <Col>
                                                                            <Link to={`/admin/roles/edit/${role._id}`} >
                                                                                <Button color="primary" variant="filled">Chỉnh sửa</Button>
                                                                            </Link>
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("roles_delete") && (
                                                                        <Col>
                                                                            <Delete id={role._id} onReload={handleReload} functionDelete={deleteRole} textConfirm={"Bạn có muốn xóa nhóm quyền này không?"} />
                                                                        </Col>
                                                                    )}
                                                                </Row>
                                                            </>
                                                        }
                                                        className="role__card-item"
                                                    >
                                                        <Meta
                                                            title={role.title}
                                                            description={parse(role.description)}
                                                        />
                                                    </Card>
                                                </Col>
                                            ))
                                        )}
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[20, 20]}>
                            <Col span={24}>
                                <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalRole} pageSize={limit} />
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền truy cập</div>
            )}
        </>
    );
};

export default Role;