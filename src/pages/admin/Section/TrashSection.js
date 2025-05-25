import { Button, Card, Col, Pagination, Row, Table, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Delete from "../../../Components/Delete";
import Restore from "../../../Components/Restore";
import ChangeMulti from "../../../Components/ChangeMulti";
import { deleteTrashSection, getTrashSection, restoreMultiSection, restoreTrashSection } from "../../../services/admin/sectionSevice";
import InputSearch from "../../../Components/InputSearch";
import Sort from "../../../Components/Sort";
import { useQueryParams } from "../../../hooks/useQueryParams";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function TrashSection() {
    const [sections, setSections] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const params = useParams();
    const courseId = params.courseId;
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalSection, setTotalSection] = useState(1);
    const limit = 5;
    const { permissions } = useSelector((state) => state.authAdminReducer);


    const fetchAPI = async (courseId, params = {}) => {
        const result = await getTrashSection(courseId, params);
        setSections(result.sections);
        setTotalSection(result.totalSection);
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || '';
        const sortValue = queryParams.get('sortValue') || '';
        const keyword = queryParams.get('keyword') || '';
        const page = queryParams.get('page') || 1;

        fetchAPI(courseId, {
            sortKey: sortKey,
            sortValue: sortValue,
            keyword: keyword,
            page: page,
            limit: limit
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
            title: "Hành động",
            key: "actions",
            render: (value, record) => (
                <>
                    <Row gutter={[10, 10]}>
                        {permissions.includes("sections_restore") && (
                            <Col>
                                <Restore id={record._id} onReload={handleReload} functionRestore={(sectionId) => restoreTrashSection(courseId, sectionId)} />
                            </Col>
                        )}

                        {permissions.includes("sections_delete-permanently") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={(sectionId) => deleteTrashSection(courseId, sectionId)} textConfirm={"Bạn có muốn xóa chương này vĩnh viễn không?"} />
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
        ...(permissions.includes("sections_restore") ? [{
            value: 'restore',
            label: "-- Khôi phục --"
        }] : []),
        ...(permissions.includes("sections_delete-permanently") ? [{
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
            {permissions.includes("sections_trash") ? (
                <div className="section__trash">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row justify="space-between" align="middle" gutter={[20, 20]}>
                                <Col md={12}>
                                    <h3 className="section__title">
                                        Thùng rác
                                    </h3>
                                </Col>

                                <Col flex="none">
                                    <Row gutter={[10, 10]}>
                                        <Col flex="none">
                                            <div className="section__change-multi">
                                                <ChangeMulti
                                                    changeMultiOption={changeMultiOption}
                                                    onReload={handleReload}
                                                    selectedRowKeys={selectedRowKeys}
                                                    rowKeysEmpty={setRowKeysEmpty}
                                                    changeMulti={(option) => restoreMultiSection(courseId, option)}
                                                />
                                            </div>
                                        </Col>

                                        {permissions.includes("sections_view") && (
                                            <Col flex="none">
                                                <Link to={`/admin/${courseId}/sections`}>
                                                    <Button color="primary" variant="outlined">Danh sách chương</Button>
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
                                    <InputSearch onSearch={handleSearch} />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect="title-asc" />
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col span={24}>
                                <div className="course__table">
                                    <Table rowSelection={rowSelection} columns={columns} dataSource={sections} rowKey="_id" pagination={false} />
                                </div>

                                <div className="section__card">
                                    <Row gutter={[20, 20]}>
                                        {sections && (
                                            sections.map(section => (
                                                <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} key={section._id}>
                                                    <Card
                                                        actions={[
                                                            <Checkbox
                                                                checked={selectedRowKeys.includes(section._id)}
                                                                onChange={() => handleCheck(section._id)}
                                                            >
                                                            </Checkbox>,
                                                        ]}
                                                        hoverable
                                                        type="inner"
                                                        extra={
                                                            <>
                                                                <Row style={{ marginTop: "5px", marginBottom: "5px" }} gutter={[10, 10]} justify={"end"}>
                                                                    {permissions.includes("sections_restore") && (
                                                                        <Col>
                                                                            <Restore id={section._id} onReload={handleReload} functionRestore={(sectionId) => restoreTrashSection(courseId, sectionId)} />
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("sections_delete-permanently") && (
                                                                        <Col>
                                                                            <Delete id={section._id} onReload={handleReload} functionDelete={(sectionId) => deleteTrashSection(courseId, sectionId)} textConfirm={"Bạn có muốn xóa chương này vĩnh viễn không?"} />
                                                                        </Col>
                                                                    )}
                                                                </Row>
                                                            </>
                                                        }
                                                        className="course__card-item"
                                                    >
                                                        <div className="course__card-title">
                                                            {section.title}
                                                        </div>
                                                        <div>
                                                            {parse(section.description || "")}
                                                        </div>
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
                                <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalSection} pageSize={limit} />
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

export default TrashSection;