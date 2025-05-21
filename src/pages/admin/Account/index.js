import { useEffect, useState } from "react";
import { changeMultiAccount, changeStatusAccount, deleteAccount, getAccount } from "../../../services/admin/accountService";
import { Button, Card, Checkbox, Col, Image, Pagination, Row, Table, Tag } from "antd";
import ChangeStatus from "../../../Components/ChangeStatus";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputSearch from "../../../Components/InputSearch";
import FilterStatus from "../../../Components/FilterStatus";
import Sort from "../../../Components/Sort";
import ChangeMulti from "../../../Components/ChangeMulti";
import Delete from "../../../Components/Delete";
import { RedoOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Meta } = Card;

function Account() {
    const [accounts, setAccounts] = useState([]);
    const [reload, setReload] = useState(false);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalAccount, setTotalAccount] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const limit = 10;
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async (params = {}) => {
        const result = await getAccount(params);
        setAccounts(result.accounts);
        setTotalAccount(result.totalAccount);
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || 'position';
        const sortValue = queryParams.get('sortValue') || 'desc';
        const keyword = queryParams.get('keyword') || '';
        const status = queryParams.get('status') || '';
        const page = queryParams.get('page') || 1;
        fetchAPI({
            sortKey: sortKey,
            sortValue: sortValue,
            keyword: keyword,
            status: status,
            page: page,
            limit: limit
        });
    }, [reload, location.search]);

    const handleReload = () => {
        setReload(!reload);
    };

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Ảnh đại diện",
            dataIndex: "avatar",
            key: "avatar",
            render: (thumbnail, record) => <Image src={thumbnail} width={100} />
        },
        {
            title: "Họ tên",
            dataIndex: "fullName",
            key: "fullName",
            render: (value) => <b>{value}</b>
        },
        {
            title: "Nhóm quyền",
            dataIndex: "roleTitle",
            key: "roleTitle"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => (
                permissions.includes("accounts_edit") ? (
                    <ChangeStatus status={value} onReload={handleReload} changeStatus={(option) => changeStatusAccount(record._id, option)} />
                ) : (
                    value === "active" ? (
                        <Tag color="success">Hoạt động</Tag>
                    ) : (
                        <Tag color="error">Dừng hoạt động</Tag>
                    )
                )
            )
        },
        {
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Row gutter={[10, 10]}>
                        {permissions.includes("accounts_edit") && (
                            <Col>
                                <Link to={`/admin/accounts/edit/${record._id}`}>
                                    <Button color="primary" variant="filled" style={{ marginLeft: "5px" }}>Chỉnh sửa</Button>
                                </Link>
                            </Col>
                        )}

                        {permissions.includes("accounts_delete") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteAccount} textConfirm={"Bạn có muốn xóa tài khoản này không?"} />
                            </Col>
                        )}
                    </Row>
                </>
            )
        }
    ];

    const sortOptions = [
        {
            value: "fullName-asc",
            label: "-- Tên từ A - Z --"
        },
        {
            value: "fullName-desc",
            label: "-- Tên từ Z - A --"
        }
    ];

    const filterStatusOptions = [
        {
            value: "",
            label: "-- Trạng thái --",
            disabled: true
        },
        {
            value: "all",
            label: "-- Tất cả --"
        },
        {
            value: "active",
            label: "-- Hoạt động --",
        },
        {
            value: "inactive",
            label: "-- Dừng hoạt động --",
        }
    ];

    const changeMultiOption = [
        {
            value: '',
            label: "-- Chọn hành động --",
            disabled: true
        },
        ...(permissions.includes("accounts_edit") ? [{
            value: 'active',
            label: "-- Hoạt động --"
        },
        {
            value: 'inactive',
            label: "-- Dừng hoạt động --"
        }] : []),
        ...(permissions.includes("accounts_delete") ? [{
            value: 'delete-all',
            label: "-- Xóa tất cả --"
        }] : []),
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const setRowKeysEmpty = () => {
        setSelectedRowKeys([]);
    };

    const handleSearch = (keyword) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('keyword', keyword);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

    const handleFilterStatus = (status) => {
        if (status === "all") {
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('status', "");
            navigate({
                pathname: location.pathname,
                search: `?${queryParams.toString()}`
            });
        } else {
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('status', status);
            navigate({
                pathname: location.pathname,
                search: `?${queryParams.toString()}`
            });
        };
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
            {permissions.includes("accounts_view") ? (
                <div className="account">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="title-page">
                                        Danh sách danh mục
                                    </h3>
                                </Col>

                                <Col flex="none">
                                    <Row gutter={[10, 10]}>
                                        <Col flex="none">
                                            <div className="account__change-multi">
                                                <ChangeMulti
                                                    changeMultiOption={changeMultiOption}
                                                    onReload={handleReload}
                                                    selectedRowKeys={selectedRowKeys}
                                                    rowKeysEmpty={setRowKeysEmpty}
                                                    changeMulti={changeMultiAccount}
                                                    textConfirm="Bạn có chắc muốn xóa những tài khoản này?"
                                                />
                                            </div>
                                        </Col>

                                        {permissions.includes("accounts_create") && (
                                            <Col>
                                                <Link to={`/admin/accounts/create`}>
                                                    <Button color="primary" variant="outlined">Thêm tài khoản</Button>
                                                </Link>
                                            </Col>
                                        )}

                                        {permissions.includes("accounts_trash") && (
                                            <Col flex="none">
                                                <Link to={`/admin/accounts/trash`}><Button icon={<RedoOutlined />} color="purple" variant="outlined">Khôi phục</Button></Link>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <div className="account__filter-bar">
                            <Row gutter={[30, 20]}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <InputSearch valueDefault={queryParams.get('keyword') || ''} onSearch={handleSearch} />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <FilterStatus filterStatusOptions={filterStatusOptions} handleChangeStatus={handleFilterStatus} valueDefault={queryParams.get('status') || ''} />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect={`${queryParams.get('sortKey') || "fullName"}-${queryParams.get('sortValue') || "asc"}`} />
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col xs={24}>
                                <div className="account__table">
                                    <Table rowSelection={rowSelection} columns={columns} rowKey={"_id"} dataSource={accounts} pagination={false} />
                                </div>

                                <div className="account__card">
                                    <Row gutter={[20, 20]}>
                                        {accounts && (
                                            accounts.map(account => (
                                                <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} key={account._id}>
                                                    <Card
                                                        actions={[
                                                            <Checkbox
                                                                checked={selectedRowKeys.includes(account._id)}
                                                                onChange={() => handleCheck(account._id)}
                                                            >
                                                            </Checkbox>,
                                                            permissions.includes("accounts_edit") ? (
                                                                <ChangeStatus status={account.status} onReload={handleReload} changeStatus={(option) => changeStatusAccount(account._id, option)} />
                                                            ) : (
                                                                account.status === "active" ? (
                                                                    <Tag color="success">Hoạt động</Tag>
                                                                ) : (
                                                                    <Tag color="error">Dừng hoạt động</Tag>
                                                                )
                                                            )
                                                        ]}
                                                        hoverable
                                                        type="inner"
                                                        cover={
                                                            <Image
                                                                alt={account.fullName}
                                                                src={account.avatar}
                                                                className="account__card-image"
                                                            />
                                                        }
                                                        extra={
                                                            <>
                                                                <Row style={{ marginTop: "5px", marginBottom: "5px" }} gutter={[10, 10]} justify={"end"}>
                                                                    {permissions.includes("accounts_edit") && (
                                                                        <Col>
                                                                            <Link to={`/admin/account/edit/${account._id}`}>
                                                                                <Button color="primary" variant="filled" style={{ marginLeft: "5px" }}>Chỉnh sửa</Button>
                                                                            </Link>
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("accounts_delete") && (
                                                                        <Col>
                                                                            <Delete id={account._id} onReload={handleReload} functionDelete={deleteAccount} textConfirm={"Bạn có muốn xóa tài khoản này không?"} />
                                                                        </Col>
                                                                    )}
                                                                </Row>
                                                            </>
                                                        }
                                                        className="account__card-item"
                                                    >
                                                        <Meta
                                                            title={account.email}
                                                            description={<>
                                                                <div>{account.fullName}</div>
                                                                <div>{account.roleTitle}</div>
                                                            </>}
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
                                <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalAccount} pageSize={limit} />
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền vào trang tài khoản</div>
            )}
        </>
    );
};

export default Account;