import { Button, Col, InputNumber, Row, Table, Image, Select, Card, Checkbox, Pagination, Tag } from "antd";
import { RedoOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { changeMultiCourse, changeStatusCourse, changeToggleCourse, deleteCourse, getCategories, getCourse } from "../../../services/admin/courseSevice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ChangeStatus from "../../../Components/ChangeStatus";
import ChangeToggle from "../../../Components/ChangeToggle";
import InputSearch from "../../../Components/InputSearch";
import FilterStatus from "../../../Components/FilterStatus";
import Sort from "../../../Components/Sort";
import { getSelected } from "../../../helper/getSelected";
import ChangeMulti from "../../../Components/ChangeMulti";
import Delete from "../../../Components/Delete";
import { useQueryParams } from "../../../hooks/useQueryParams";
import parse from "html-react-parser";
import { useSelector } from 'react-redux';

const { Meta } = Card;

function Course() {
    const [courses, setCourses] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [positions, setPositions] = useState({});
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [categoryOpitons, setCategoryOptions] = useState([]);
    const [totalCourse, setTotalCourse] = useState(1);
    const limit = 5;
    const { permissions } = useSelector((state) => state.authAdminReducer);

    console.log(permissions);

    const fetchAPI = async (params = {}) => {

        const result = await getCourse(params);
        if (result.code === 200) {
            setCourses(result.courses);
            setTotalCourse(result.totalCourse);
        }
    };

    const fetchCategoryAPI = async () => {
        const result = await getCategories();
        if (result.code === 200) {
            setCategory(result.categories);
        }
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || 'position';
        const sortValue = queryParams.get('sortValue') || 'desc';
        const keyword = queryParams.get('keyword') || '';
        const status = queryParams.get('status') || '';
        const category = queryParams.get('category') || '';
        const page = queryParams.get('page') || 1;

        fetchAPI({
            sortKey: sortKey,
            sortValue: sortValue,
            keyword: keyword,
            status: status,
            category: category,
            page: page,
            limit: limit
        });
    }, [reload, location.search]);

    useEffect(() => {
        fetchCategoryAPI();
    }, []);

    useEffect(() => {
        setCategoryOptions([
            { value: "", label: "-- Danh mục --" },
            ...category.map(item => ({
                value: item._id,
                label: `-- ${item.title} --`
            }))
        ]);
    }, [category]);

    const handleReload = () => {
        setReload(!reload);
    };

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
            title: "Khóa học",
            dataIndex: "toggle",
            key: "toggle",
            render: (value, record) => (
                permissions.includes("courses_edit") ? (
                    <ChangeToggle toggle={value} id={record._id} onReload={handleReload} changeToggle={changeToggleCourse} />
                ) : (
                    value === true ? (
                        <Tag color='success'>Mở</Tag>
                    ) : (
                        <Tag color='error'>Đóng</Tag>
                    )
                )
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => (
                permissions.includes("courses_edit") ? (
                    <ChangeStatus status={value} onReload={handleReload} changeStatus={(option) => changeStatusCourse(record._id, option)} />
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
                        {permissions.includes("courses_edit") && (
                            <Col>
                                <Link to={`/admin/courses/edit/${record._id}`}>
                                    <Button color="primary" variant="filled">Chỉnh sửa</Button>
                                </Link>
                            </Col>
                        )}

                        {permissions.includes("sections_view") && (
                            <Col>
                                <Link to={`/admin/${record._id}/sections`}>
                                    <Button color="purple" variant="filled">Chương</Button>
                                </Link>
                            </Col>
                        )}

                        {permissions.includes("courses_delete") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteCourse} textConfirm={"Bạn có muốn xóa khóa học này không?"} />
                            </Col>
                        )}
                    </Row>
                </>
            )
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
            value: 'toggle-on',
            label: "-- Mở khóa học --"
        },
        {
            value: 'toggle-off',
            label: "-- Đóng khóa học --"
        },
        {
            value: 'delete-all',
            label: "-- Xóa tất cả --"
        }
    ];

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

    const handleChangePosition = (key, value) => {
        setPositions(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const setRowKeysEmpty = () => {
        setSelectedRowKeys([]);
    };

    const handleChangeCategory = (value) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('category', value);
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
            {permissions.includes("courses_view") && (
                <div className="course">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row justify="space-between" align="middle" gutter={[20, 20]}>
                                <Col md={12}>
                                    <h3 className="title-page">
                                        Danh sách khóa học
                                    </h3>
                                </Col>

                                <Col flex="none">
                                    <Row gutter={[10, 10]}>
                                        {permissions.includes("courses_edit") && (
                                            <Col flex="none">
                                                <div className="course__change-multi">
                                                    <ChangeMulti
                                                        changeMultiOption={changeMultiOption}
                                                        onReload={handleReload}
                                                        selectedRowKeys={selectedRowKeys}
                                                        getSelected={getSelected}
                                                        rowKeysEmpty={setRowKeysEmpty}
                                                        changeMulti={changeMultiCourse}
                                                        positions={positions}
                                                        textConfirm="Bạn có chắc muốn xóa những khóa học này?"
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                        {permissions.includes("courses_create") && (
                                            <Col>
                                                <Link to={'/admin/courses/create'}>
                                                    <Button color="primary" variant="outlined">Thêm khóa học</Button>
                                                </Link>
                                            </Col>
                                        )}

                                        {permissions.includes("courses_trash") && (
                                            <Col flex="none">
                                                <Link to={'/admin/courses/trash'}><Button icon={<RedoOutlined />} color="purple" variant="outlined">Khôi phục</Button></Link>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <div className="course__filter-bar">
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

                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <Select style={{ width: "100%" }} size="large" options={categoryOpitons} onChange={handleChangeCategory} defaultValue={queryParams.get('category') || ''} />
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col span={24}>
                                <div className="course__table">
                                    <Table rowSelection={rowSelection} columns={columns} dataSource={courses} rowKey="_id" pagination={false} />
                                </div>

                                <div className="course__card">
                                    <Row gutter={[20, 20]}>
                                        {courses && (
                                            courses.map(course => (
                                                <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} key={course._id}>
                                                    <Card
                                                        actions={[
                                                            <Checkbox
                                                                checked={selectedRowKeys.includes(course._id)}
                                                                onChange={() => handleCheck(course._id)}
                                                            >
                                                            </Checkbox>,
                                                            <InputNumber min={1} defaultValue={course.position} onChange={(value) => { handleChangePosition(course._id, value) }} />,
                                                            permissions.includes("courses_edit") && (
                                                                <ChangeStatus status={course.status} onReload={handleReload} changeStatus={(option) => changeStatusCourse(course._id, option)} />
                                                            )
                                                        ]}
                                                        hoverable
                                                        type="inner"
                                                        cover={
                                                            <Image
                                                                alt={course.title}
                                                                src={course.thumbnail}
                                                                className="course__card-image"
                                                            />
                                                        }
                                                        extra={
                                                            <>
                                                                <Row style={{ marginTop: "5px", marginBottom: "5px" }} gutter={[10, 10]} justify={"end"}>
                                                                    {permissions.includes("courses_edit") && (
                                                                        <Col>
                                                                            <Link to={`/admin/courses/edit/${course._id}`}>
                                                                                <Button color="primary" variant="filled">Chỉnh sửa</Button>
                                                                            </Link>
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("sections_view") && (
                                                                        <Col>
                                                                            <Link to={`/admin/${course._id}/sections`}>
                                                                                <Button color="purple" variant="filled">Chương</Button>
                                                                            </Link>
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("courses_delete") && (
                                                                        <Col>
                                                                            <Delete id={course._id} onReload={handleReload} functionDelete={deleteCourse} textConfirm={"Bạn có muốn xóa khóa học này không?"} />
                                                                        </Col>
                                                                    )}
                                                                </Row>
                                                            </>
                                                        }
                                                        className="course__card-item"
                                                    >
                                                        <Meta
                                                            title={course.title}
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
                                <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalCourse} pageSize={limit} />
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </>
    );
};

export default Course;