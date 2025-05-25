import { useEffect, useState } from "react";
import { getDetailCourse } from "../../../services/client/courseSevice";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Col, Collapse, List, message, Row } from "antd";
import parse from "html-react-parser";
import { FileTextOutlined, QrcodeOutlined, BookOutlined, UserOutlined } from "@ant-design/icons";
import { cancelCourse, registerCourse } from "../../../services/client/enrollmentService";

function DetailCourseClient() {
    const [course, setCourse] = useState({});
    const [itemCollapse, setItemCollapse] = useState([]);
    const params = useParams();
    const slugCourse = params.slugCourse;
    const [reload, setReload] = useState(false);
    const fetchAPI = async () => {
        const result = await getDetailCourse(slugCourse);
        if (result.code === 200) {
            setCourse(result.course);
            setItemCollapse(result.course.sections.map((section, index) => (
                {
                    key: String(index),
                    label: (<b>{section.title}</b>),
                    children: (
                        <List
                            dataSource={section.lessons.map(lesson => lesson.title)}
                            renderItem={item => <List.Item><FileTextOutlined /> {item}</List.Item>}
                        />
                    )
                }
            )))
        };
    };

    const handleReload = () => {
        setReload(!reload);
    }

    useEffect(() => {
        fetchAPI();
    }, [reload]);

    const handleRegisterCourse = async () => {
        const result = await registerCourse({
            courseId: course._id
        });

        if (result.code === 200) {
            message.success(result.message);
            handleReload();
        } else {
            message.error(result.message);
        }
    };

    const handleCancelCourse = async () => {
        const result = await cancelCourse({
            courseId: course._id
        });

        if (result.code === 200) {
            message.success(result.message);
            handleReload();
        } else {
            message.error(result.message);
        }
    };

    console.log(course);
    return (
        <>
            <div className="course__detail">
                <div className="course__header-detail">
                    <div className="container">
                        <div className="course__inner-header">
                            <img className="course__header-image" src={course.thumbnail} alt={course.title} />
                            <h1 className="course__header-title">{course.title}</h1>
                        </div>
                    </div>
                </div>

                <div className="course__content-detail">
                    <div className="container">
                        <div className="course__inner-content">
                            <Row gutter={[26, 26]}>
                                <Col lg={16} md={24} sm={24} xs={24}>
                                    <div className="course__overview">
                                        <Card
                                            title={<div className="course__card-title">Mô tả</div>}
                                            hoverable
                                        >
                                            <div>{parse(course.description || "")}</div>
                                        </Card>
                                    </div>

                                    <div className="course__curriculum">
                                        <Card
                                            title={<div className="course__card-title">Nội dung</div>}
                                            hoverable
                                        >
                                            <Collapse items={itemCollapse} size="large" defaultActiveKey={"0"} />
                                        </Card>
                                    </div>
                                </Col>

                                <Col lg={8} md={24} sm={24} xs={24}>
                                    <div className="course__register">
                                        <Card
                                            title={<div className="course__card-title">Thông tin</div>}
                                            hoverable
                                        >
                                            <div className="course__info">
                                                <div className="course__info-item">
                                                    <span className="course__info-icon"><QrcodeOutlined /></span>
                                                    <span>Mã lớp học: {course.code}</span>
                                                </div>

                                                <div className="course__info-item">
                                                    <span className="course__info-icon"><BookOutlined /></span>
                                                    <span>Chương: {course.totalSections} chương</span>
                                                </div>

                                                <div className="course__info-item">
                                                    <span className="course__info-icon"><UserOutlined /></span>
                                                    <span>Người đăng ký: {course.totalRegisterCourse} người</span>
                                                </div>



                                                {course.isEnrolled ? (
                                                    <>
                                                        <Link to={`/courses/${slugCourse}/play-course/${course._id}/${course?.sections?.[0]?._id}/null`}>
                                                            <Button size="large" style={{ marginBottom: "1rem" }} block type="primary">
                                                                Vào học ngay
                                                            </Button>
                                                        </Link>

                                                        <Button onClick={handleCancelCourse} size="large" block color="default" variant="filled">Hủy đăng ký</Button>
                                                    </>
                                                ) : (
                                                    <Button onClick={handleRegisterCourse} size="large" type="primary" block>Đăng ký ngay</Button>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div >
                </div >

            </div >
        </>
    );
};

export default DetailCourseClient;