import { useEffect, useState } from "react";
import "./Course.scss";
import { getCourse } from "../../../services/client/courseSevice";
import { Col, Row, Card, Checkbox, Button, Tag, Drawer, Pagination } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import parse from "html-react-parser";
import { BookOutlined, SlidersOutlined } from "@ant-design/icons";
import { getCategory } from "../../../services/client/categorySevice";
import { useQueryParams } from "../../../hooks/useQueryParams";
import InputSearch from "../../../Components/InputSearch";
import Sort from "../../../Components/Sort";

const { Meta } = Card;

function CourseClient() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const queryParams = useQueryParams();
    const location = useLocation();
    const navigate = useNavigate();
    const limit = 5;
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [totalCourse, setTotalCourse] = useState(1);

    const fetchAPI = async () => {
        const sortKey = queryParams.get('sortKey') || 'position';
        const sortValue = queryParams.get('sortValue') || 'desc';
        const keyword = queryParams.get('keyword') || '';
        const status = queryParams.get('status') || '';
        const page = queryParams.get('page') || 1;
        const category = queryParams.get('category') || '';

        const result = await getCourse({
            sortKey: sortKey,
            sortValue: sortValue,
            keyword: keyword,
            status: status,
            page: page,
            limit: limit,
            category: category
        });
        setCourses(result.courses);
        setTotalCourse(result.totalCourse);
    };

    const fetchApiCategory = async () => {
        const result = await getCategory();
        setCategories(result.categories);
    };

    useEffect(() => {
        fetchAPI();
    }, [location.search]);

    useEffect(() => {
        fetchApiCategory();
    }, []);

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

    const sortOptions = [
        {
            value: "title-default",
            label: "-- Mặc định --"
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

    const handleSelectedCategory = (checkedValues) => {
        setSelectedCategories(checkedValues);
    };

    const handleFilterResult = () => {
        const query = selectedCategories.join(",");
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('category', query);
        navigate({
            pathname: location.pathname,
            search: `?${queryParams.toString()}`
        });
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
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
            <div className="course">
                <div className="course__inner-title">
                    <h1 className="course__title">Trang khóa học</h1>
                </div>

                <div className="course__inner-grid">
                    <div className="container">
                        <Row gutter={26}>
                            <Col xl={18} lg={16} md={24} sm={24} xs={24}>
                                <div className="course__search">
                                    <Row gutter={[24, 24]}>
                                        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                                            <InputSearch valueDefault={queryParams.get('keyword') || ''} onSearch={handleSearch} />
                                        </Col>

                                        <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                                            <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect={`${queryParams.get('sortKey') || "title"}-${queryParams.get('sortValue') || "default"}`} />
                                        </Col>

                                        <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                                            <div className="course__filter-drawer">
                                                <Button icon={<SlidersOutlined />} size="large" variant="filled" color="primary" onClick={showDrawer}>
                                                    Bộ lọc
                                                </Button>

                                                <Drawer
                                                    title={"Bộ lọc nâng cao"}
                                                    onClose={onClose}
                                                    open={open}
                                                >
                                                    <Card title={<h4>Danh mục</h4>} style={{ marginBottom: "1.6rem" }}>
                                                        <Checkbox.Group
                                                            onChange={handleSelectedCategory}
                                                            defaultValue={(queryParams.get('category') || "").split(",")}
                                                        >
                                                            <Row gutter={[0, 6]}>
                                                                {categories.map(category => (
                                                                    <Col span={24} key={category._id}>
                                                                        <Checkbox value={category._id}>{category.title}</Checkbox>
                                                                    </Col>
                                                                ))}
                                                            </Row>
                                                        </Checkbox.Group>
                                                    </Card>
                                                    <Button block type="primary" size="large" onClick={handleFilterResult}>Lọc kết quả</Button>
                                                </Drawer>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="course__grid">
                                    <Row gutter={[26, 26]}>
                                        {courses.map(course => (
                                            <Col xl={8} sm={12} xs={24} key={course._id}>
                                                <Card
                                                    hoverable
                                                    cover={
                                                        <img src={course.thumbnail} alt={course.title} />
                                                    }
                                                    actions={[
                                                        <div><BookOutlined /> {course.quantitySection} Bài giảng</div>
                                                    ]}
                                                    style={{ height: "100%" }}
                                                >
                                                    <Meta title={
                                                        <>
                                                            {course.type === "premium" ? (
                                                                <Tag color="purple">
                                                                    Cao cấp
                                                                </Tag>
                                                            ) : (
                                                                <Tag color="cyan" style={{ marginBottom: "10px" }}>
                                                                    Miễn phí
                                                                </Tag>
                                                            )}
                                                            <Link to={`/courses/detail/${course.slug}`}>
                                                                <h5 className="course__title-item">{course.title}</h5>
                                                            </Link>
                                                        </>

                                                    } />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>

                                    <Row gutter={[20, 20]}>
                                        <Col span={24}>
                                            <Pagination style={{ marginTop: "20px" }} onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalCourse} pageSize={limit} />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>

                            <Col xl={6} lg={8}>
                                <div className="course__filter">
                                    <Card title={<h4>Danh mục</h4>} style={{ marginBottom: "1.6rem" }}>
                                        <Checkbox.Group
                                            onChange={handleSelectedCategory}
                                            defaultValue={(queryParams.get('category') || "").split(",")}
                                        >
                                            <Row gutter={[0, 6]}>
                                                {categories.map(category => (
                                                    <Col span={24} key={category._id}>
                                                        <Checkbox value={category._id}>{category.title}</Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Checkbox.Group>
                                    </Card>
                                    <Button block type="primary" size="large" onClick={handleFilterResult}>Lọc kết quả</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div >
        </>
    );
};

export default CourseClient;