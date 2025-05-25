import { Button, Card, Checkbox, Col, InputNumber, Pagination, Row, Table, Tag } from "antd";
import { RedoOutlined } from '@ant-design/icons';
import "./Section.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { changeMultiSection, changeStatusSection, deleteSection, getSection } from "../../../services/admin/sectionSevice";
import { useEffect, useState } from "react";
import ChangeStatus from "../../../Components/ChangeStatus";
import InputSearch from "../../../Components/InputSearch";
import FilterStatus from "../../../Components/FilterStatus";
import Sort from "../../../Components/Sort";
import { getSelected } from "../../../helper/getSelected";
import ChangeMulti from "../../../Components/ChangeMulti";
import Delete from "../../../Components/Delete";
import { useQueryParams } from "../../../hooks/useQueryParams";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Section() {
    const params = useParams();
    const courseId = params.courseId;
    const [sections, setSections] = useState([]);
    const [reload, setReload] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [positions, setPositions] = useState({});
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [totalSection, setTotalSection] = useState(1);
    const limit = 5;
    const { permissions } = useSelector((state) => state.authAdminReducer);


    const fetchAPI = async (id, params = {}) => {
        const result = await getSection(id, params);
        setSections(result.sections);
        setTotalSection(result.totalSection);
    };

    useEffect(() => {
        const sortKey = queryParams.get('sortKey') || 'position';
        const sortValue = queryParams.get('sortValue') || 'desc';
        const keyword = queryParams.get('keyword') || '';
        const status = queryParams.get('status') || '';
        const page = queryParams.get('page') || 1;
        fetchAPI(courseId, {
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
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title"
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
                permissions.includes("sections_edit") ? (
                    <ChangeStatus status={value} onReload={handleReload} changeStatus={(option) => changeStatusSection(courseId, record._id, option)} />
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
                        {permissions.includes("sections_edit") && (
                            <Col>
                                <Link to={`/admin/${courseId}/sections/edit/${record._id}`} >
                                    <Button color="primary" variant="filled">Chỉnh sửa</Button>
                                </Link>
                            </Col>
                        )}

                        {permissions.includes("lessons_view") && (
                            <Col>
                                <Link to={`/admin/${courseId}/${record._id}/lessons`} >
                                    <Button color="purple" variant="filled">Bài học</Button>
                                </Link>
                            </Col>
                        )}

                        {permissions.includes("sections_delete") && (
                            <Col>
                                <Delete id={record._id} onReload={handleReload} functionDelete={(sectionId) => deleteSection(courseId, sectionId)} textConfirm={"Bạn có muốn xóa chương này không?"} />
                            </Col>
                        )}
                    </Row>
                </>
            )
        }
    ];

    const sortOptions = [
        {
            value: "position-asc",
            label: "-- Vị trí tăng dần --"
        },
        {
            value: "position-desc",
            label: "-- Vị trí giảm dần --"
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
            {permissions.includes("sections_view") ? (
                <div className="section">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="section__title">
                                        Danh sách chương
                                    </h3>
                                </Col>

                                <Col flex="none">
                                    <Row gutter={[10, 10]}>
                                        {permissions.includes("sections_edit") && (
                                            <Col flex="none">
                                                <div className="course__change-multi">
                                                    <ChangeMulti
                                                        changeMultiOption={changeMultiOption}
                                                        onReload={handleReload}
                                                        selectedRowKeys={selectedRowKeys}
                                                        getSelected={getSelected}
                                                        rowKeysEmpty={setRowKeysEmpty}
                                                        changeMulti={(option) => changeMultiSection(courseId, option)}
                                                        positions={positions}
                                                        textConfirm="Bạn có chắc muốn xóa những chương này?"
                                                    />
                                                </div>
                                            </Col>
                                        )}

                                        {permissions.includes("sections_create") && (
                                            <Col>
                                                <Link to={`/admin/${courseId}/sections/create`}>
                                                    <Button color="primary" variant="outlined">Thêm chương</Button>
                                                </Link>
                                            </Col>
                                        )}

                                        {permissions.includes("sections_trash") && (
                                            <Col flex="none">
                                                <Link to={`/admin/${courseId}/sections/trash`}><Button icon={<RedoOutlined />} color="purple" variant="outlined">Khôi phục</Button></Link>
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
                                    <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect={`${queryParams.get('sortKey') || "position"}-${queryParams.get('sortValue') || "asc"}`} />
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col xs={24}>
                                <div className="section__table">
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
                                                            <InputNumber min={1} defaultValue={section.position} onChange={(value) => { handleChangePosition(section._id, value) }} />,
                                                            permissions.includes("sections_edit") ? (
                                                                <ChangeStatus status={section.status} onReload={handleReload} changeStatus={(option) => changeStatusSection(courseId, section._id, option)} />
                                                            ) : (
                                                                section.status === "active" ? (
                                                                    <Tag color='success'>Hoạt động</Tag>
                                                                ) : (
                                                                    <Tag color='error'>Dừng hoạt động</Tag>
                                                                )
                                                            )
                                                        ]}
                                                        hoverable
                                                        type="inner"
                                                        extra={
                                                            <>
                                                                <Row style={{ marginTop: "5px", marginBottom: "5px" }} gutter={[10, 10]} justify={"end"}>
                                                                    {permissions.includes("sections_edit") && (
                                                                        <Col>
                                                                            <Link to={`/admin/${courseId}/sections/edit/${section._id}`}>
                                                                                <Button color="primary" variant="filled">Chỉnh sửa</Button>
                                                                            </Link>
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("lessons_view") && (
                                                                        <Col>
                                                                            <Link to={`/admin/${courseId}/${section._id}/lessons`}>
                                                                                <Button color="purple" variant="filled">Bài học</Button>
                                                                            </Link>
                                                                        </Col>
                                                                    )}

                                                                    {permissions.includes("sections_delete") && (
                                                                        <Col>
                                                                            <Delete id={section._id} onReload={handleReload} functionDelete={(sectionId) => deleteSection(courseId, sectionId)} textConfirm={"Bạn có muốn xóa chương này không?"} />
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
                <div>Không được cấp quyền xem bài học</div>
            )}
        </>
    );
};

export default Section;