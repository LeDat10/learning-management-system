import { Button, Card, Checkbox, Col, Image, Pagination, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Delete from "../../../Components/Delete";
import Restore from "../../../Components/Restore";
import ChangeMulti from "../../../Components/ChangeMulti";
import InputSearch from "../../../Components/InputSearch";
import Sort from "../../../Components/Sort";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { deleteTrashAccount, getTrashAccount, restoreMultiAccount, restoreTrashAccount } from "../../../services/admin/accountService";
import { useSelector } from "react-redux";

const { Meta } = Card;

function TrashAccount() {
    const [accounts, setAccounts] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalAccount, setTotalAccount] = useState(1);
    const limit = 5;
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async (params = {}) => {
        const result = await getTrashAccount(params);
        setAccounts(result.accounts);
        setTotalAccount(result.totalAccount);
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || '';
        const sortValue = queryParams.get('sortValue') || '';
        const keyword = queryParams.get('keyword') || '';
        const page = queryParams.get('page') || 1;
        fetchAPI({
            sortKey: sortKey,
            sortValue: sortValue,
            keyword: keyword,
            limit: limit,
            page: page
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
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Row gutter={[10, 10]}>
                        {permissions.includes("accounts_restore") && (
                            <Col>
                                <Restore id={record._id} onReload={handleReload} functionRestore={restoreTrashAccount} />
                            </Col>
                        )}

                        {permissions.includes("accounts_delete-permanently") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteTrashAccount} textConfirm={"Bạn có muốn xóa tài khoản này vĩnh viễn không?"} />
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

    const changeMultiOption = [
        {
            value: '',
            label: "-- Chọn hành động --",
            disabled: true
        },
        ...(permissions.includes("accounts_restore") ? [{
            value: 'restore',
            label: "-- Khôi phục --"
        }] : []),
        ...(permissions.includes("accounts_delete-permanently") ? [{
            value: 'delete',
            label: "-- Xóa vĩnh viễn --"
        }] : [])
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
            {permissions.includes("accounts_trash") ? (
                <div className="account__trash">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row justify="space-between" align="middle" gutter={[20, 20]}>
                                <Col md={12}>
                                    <h3 className="title-page">
                                        Thùng rác
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
                                                    changeMulti={restoreMultiAccount}
                                                    textConfirm="Bạn có chắc muốn xóa vĩnh viễn những tài khoản này?"
                                                />
                                            </div>
                                        </Col>

                                        {permissions.includes("accounts_view") && (
                                            <Col flex="none">
                                                <Link to={'/admin/accounts'}>
                                                    <Button color="primary" variant="outlined">Danh sách tài khoản</Button>
                                                </Link>
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
                                    <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect={`${queryParams.get('sortKey') || "fullName"}-${queryParams.get('sortValue') || "asc"}`} />
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col span={24}>
                                <div className="account__table">
                                    <Table rowSelection={rowSelection} columns={columns} dataSource={accounts} rowKey="_id" pagination={false} />
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
                                                                    {permissions.includes("accounts_restore") && (
                                                                        <Col>
                                                                            <Restore id={account._id} onReload={handleReload} functionRestore={restoreTrashAccount} />
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("accounts_delete-permanently") && (
                                                                        <Col>
                                                                            <Delete id={account._id} onReload={handleReload} functionDelete={deleteTrashAccount} textConfirm={"Bạn có muốn xóa tài khoản này vĩnh viễn không?"} />
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
                </div >
            ) : (
                <div>Không được cấp quyền truy cập</div>
            )}
        </>
    );
};

export default TrashAccount;