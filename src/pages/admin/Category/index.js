import { Button, Col, Image, InputNumber, Pagination, Row, Table, Card, Checkbox, Tag } from "antd";
import "./Category.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { changeMultiCategory, changeStatusCategory, deleteCategory, getCategory } from "../../../services/admin/categoryService";
import ChangeStatus from "../../../Components/ChangeStatus";
import { getSelected } from "../../../helper/getSelected";
import ChangeMulti from "../../../Components/ChangeMulti";
import { useQueryParams } from "../../../hooks/useQueryParams";
import InputSearch from "../../../Components/InputSearch";
import FilterStatus from "../../../Components/FilterStatus";
import Sort from "../../../Components/Sort";
import Delete from "../../../Components/Delete";
import parse from "html-react-parser";
import { RedoOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const { Meta } = Card;

function Category() {
    const [categories, setCategories] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [positions, setPositions] = useState({});
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalCategory, setTotalCategory] = useState(1);
    const limit = 5;

    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async (params = {}) => {
        const result = await getCategory(params);
        setCategories(result.categories);
        setTotalCategory(result.totalCategory);
    };

    const handleReload = () => {
        setReload(!reload);
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

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (title, record) => <Link to={`/admin/courses/detail/${record._id}`} >{title}</Link>
        },
        {
            title: "Ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (thumbnail, record) => <Image src={thumbnail} width={100} />
        },
        {
            title: "Vị trí",
            dataIndex: "position",
            key: "position",
            render: (position, record) => <InputNumber min={1} defaultValue={position} onChange={(value) => { handleChangePosition(record._id, value) }} />
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => (
                permissions.includes("category_edit") ? (
                    <ChangeStatus status={value} onReload={handleReload} changeStatus={(option) => changeStatusCategory(record._id, option)} />

                ) : (
                    value === "active" ? (
                        <Tag color='success'>Hoạt động</Tag>
                    ) : (
                        <Tag color='error'>Dừng hoạt động</Tag>
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
                        {permissions.includes("category_edit") && (
                            <Col>
                                <Link to={`/admin/category/edit/${record._id}`}>
                                    <Button color="primary" variant="filled" style={{ marginLeft: "5px" }}>Chỉnh sửa</Button>
                                </Link>
                            </Col>
                        )}

                        {permissions.includes("category_delete") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteCategory} textConfirm={"Bạn có muốn xóa danh mục này không?"} />
                            </Col>
                        )}
                    </Row>
                </>
            )
        }
    ];

    const changeMultiOption = [
        {
            value: '',
            label: "-- Chọn hành động --",
            disabled: true
        },
        {
            value: 'active',
            label: "-- Hoạt động --"
        },
        {
            value: 'inactive',
            label: "-- Dừng hoạt động --"
        },
        {
            value: 'position',
            label: "-- Thay đổi vị trí --"
        },
        {
            value: 'delete-all',
            label: "-- Xóa tất cả --"
        }
    ];

    const sortOptions = [
        {
            value: "position-desc",
            label: "-- Vị trí giảm dần --"
        },
        {
            value: "position-asc",
            label: "-- Vị trí tăng dần --"
        },
        {
            value: "title-asc",
            label: "-- Tiêu đề từ A - Z --"
        },
        {
            value: "title-desc",
            label: "-- Tiêu đề từ Z - A --"
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

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const handleChangePosition = (key, value) => {
        setPositions(prev => ({
            ...prev,
            [key]: value
        }));
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
            {permissions.includes("category_view") && (
                <div className="category">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="category__title">
                                        Danh sách danh mục
                                    </h3>
                                </Col>

                                <Col flex="none">
                                    <Row gutter={[10, 10]}>
                                        {permissions.includes("category_edit") && (
                                            <Col flex="none">
                                                <div className="course__change-multi">
                                                    <ChangeMulti
                                                        changeMultiOption={changeMultiOption}
                                                        onReload={handleReload}
                                                        selectedRowKeys={selectedRowKeys}
                                                        getSelected={getSelected}
                                                        rowKeysEmpty={setRowKeysEmpty}
                                                        changeMulti={changeMultiCategory}
                                                        positions={positions}
                                                        textConfirm="Bạn có chắc muốn xóa những danh mục này?"
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                        {permissions.includes("category_create") && (
                                            <Col>
                                                <Link to={`/admin/category/create`}>
                                                    <Button color="primary" variant="outlined">Thêm danh mục</Button>
                                                </Link>
                                            </Col>
                                        )}

                                        {permissions.includes("category_trash") && (
                                            <Col flex="none">
                                                <Link to={`/admin/category/trash`}><Button icon={<RedoOutlined />} color="purple" variant="outlined">Khôi phục</Button></Link>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <div className="section__filter-bar">
                            <Row gutter={[30, 20]}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <InputSearch valueDefault={queryParams.get('keyword') || ''} onSearch={handleSearch} />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <FilterStatus filterStatusOptions={filterStatusOptions} handleChangeStatus={handleFilterStatus} valueDefault={queryParams.get('status') || ''} />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect={`${queryParams.get('sortKey') || "position"}-${queryParams.get('sortValue') || "desc"}`} />
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col xs={24}>
                                <div className="section__table">
                                    <Table rowSelection={rowSelection} columns={columns} dataSource={categories} rowKey="_id" pagination={false} />
                                </div>

                                <div className="course__card">
                                    <Row gutter={[20, 20]}>
                                        {categories && (
                                            categories.map(category => (
                                                <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} key={category._id}>
                                                    <Card
                                                        actions={[
                                                            <Checkbox
                                                                checked={selectedRowKeys.includes(category._id)}
                                                                onChange={() => handleCheck(category._id)}
                                                            >
                                                            </Checkbox>,
                                                            <InputNumber min={1} defaultValue={category.position} onChange={(value) => { handleChangePosition(category._id, value) }} />,
                                                            permissions.includes("category_edit") ? (
                                                                <ChangeStatus status={category.status} onReload={handleReload} changeStatus={(option) => changeStatusCategory(category._id, option)} />
                                                            ) : (
                                                                category.status === "active" ? (
                                                                    <Tag color='success'>Hoạt động</Tag>
                                                                ) : (
                                                                    <Tag color='error'>Dừng hoạt động</Tag>
                                                                )
                                                            )
                                                        ]}
                                                        hoverable
                                                        type="inner"
                                                        cover={
                                                            <Image
                                                                alt={category.title}
                                                                src={category.thumbnail}
                                                                className="category__card-image"
                                                            />
                                                        }
                                                        extra={
                                                            <>
                                                                <Row style={{ marginTop: "5px", marginBottom: "5px" }} gutter={[10, 10]} justify={"end"}>
                                                                    {permissions.includes("category_edit") && (
                                                                        <Col>
                                                                            <Link to={`/admin/category/edit/${category._id}`}>
                                                                                <Button color="primary" variant="filled" style={{ marginLeft: "5px" }}>Chỉnh sửa</Button>
                                                                            </Link>
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("category_delete") && (
                                                                        <Col>
                                                                            <Delete id={category._id} onReload={handleReload} functionDelete={deleteCategory} textConfirm={"Bạn có muốn xóa danh mục này không?"} />
                                                                        </Col>
                                                                    )}
                                                                </Row>
                                                            </>
                                                        }
                                                        className="category__card-item"
                                                    >
                                                        <Meta
                                                            title={category.title}
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
                                <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalCategory} pageSize={limit} />
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </>
    );
};

export default Category;