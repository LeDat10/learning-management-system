import { Button, Card, Checkbox, Col, Image, Pagination, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { deleteTrashCourse, getTrashCourse, restoreMultiCourse, restoreTrashCourse } from "../../../services/admin/courseSevice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Delete from "../../../Components/Delete";
import Restore from "../../../Components/Restore";
import ChangeMulti from "../../../Components/ChangeMulti";
import InputSearch from "../../../Components/InputSearch";
import Sort from "../../../Components/Sort";
import { useQueryParams } from "../../../hooks/useQueryParams";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

const { Meta } = Card;

function TrashCourse() {
    const [courses, setCourses] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalCourse, setTotalCourse] = useState(1);
    const limit = 5;
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async (params = {}) => {
        const result = await getTrashCourse(params);
        setCourses(result.courses);
        setTotalCourse(result.totalCourse);
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || '';
        const sortValue = queryParams.get('sortValue') || '';
        const keyword = queryParams.get('keyword') || '';
        const page = queryParams.get('page') || 1;
        fetchAPI({
            sortKey,
            sortValue,
            keyword,
            limit,
            page
        });
    }, [reload, location.search]);

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
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Row gutter={[10, 10]}>
                        {permissions.includes("courses_restore") && (
                            <Col>
                                <Restore id={record._id} onReload={handleReload} functionRestore={restoreTrashCourse} />
                            </Col>
                        )}

                        {permissions.includes("courses_delete-permanently") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={deleteTrashCourse} textConfirm={"Bạn có muốn xóa khóa học này vĩnh viễn không?"} />
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
        ...(permissions.includes("courses_restore") ? [{
            value: 'restore',
            label: "-- Khôi phục --"
        }] : []),
        ...(permissions.includes("courses_delete-permanently") ? [{
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
            {permissions.includes("courses_trash") ? (
                <div className="course__trash">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row justify="space-between" align="middle" gutter={[20, 20]}>
                                <Col md={12}>
                                    <h3 className="course__title">
                                        Thùng rác
                                    </h3>
                                </Col>

                                <Col flex="none">
                                    <Row gutter={[10, 10]}>
                                        <Col flex="none">
                                            <div className="course__change-multi">
                                                <ChangeMulti
                                                    changeMultiOption={changeMultiOption}
                                                    onReload={handleReload}
                                                    selectedRowKeys={selectedRowKeys}
                                                    rowKeysEmpty={setRowKeysEmpty}
                                                    changeMulti={restoreMultiCourse}
                                                />
                                            </div>
                                        </Col>

                                        {permissions.includes('courses_view') && (
                                            <Col flex="none">
                                                <Link to={'/admin/courses'}>
                                                    <Button color="primary" variant="outlined">Danh sách khóa học</Button>
                                                </Link>
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
                                    <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect={`${queryParams.get('sortKey') || "title"}-${queryParams.get('sortValue') || "asc"}`} />
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
                                                            </Checkbox>
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
                                                                <Row gutter={[10, 10]}>
                                                                    {permissions.includes("courses_restore") && (
                                                                        <Col>
                                                                            <Restore id={course._id} onReload={handleReload} functionRestore={restoreTrashCourse} />
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("courses_delete-permanently") && (
                                                                        <Col>
                                                                            <Delete id={course._id} onReload={handleReload} functionDelete={deleteTrashCourse} textConfirm={"Bạn có muốn xóa khóa học này vĩnh viễn không?"} />
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
            ) : (
                <div>Không được cấp quyền xem thùng rác</div>
            )}
        </>
    );
};

export default TrashCourse;