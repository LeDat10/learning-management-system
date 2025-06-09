import { useEffect, useState } from "react";
import { deleteTrashLessonText, getTrashLesson, restoreMultiLessonText, restoreTrashLesson } from "../../../services/admin/lessonSevice";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Checkbox, Col, Form, Pagination, Radio, Row, Tag } from "antd";
import parse from "html-react-parser";
import InputSearch from "../../../Components/InputSearch";
import Sort from "../../../Components/Sort";
import Delete from "../../../Components/Delete";
import Restore from "../../../Components/Restore";
import ChangeMulti from "../../../Components/ChangeMulti";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { useSelector } from "react-redux";

const { Meta } = Card;
function TrashLesson() {
    const [lessons, setLesson] = useState([]);
    const params = useParams();
    const sectionId = params.sectionId;
    const courseId = params.courseId;
    const navigate = useNavigate();
    const [reload, setReload] = useState(false);
    const [checkedLessons, setCheckedLessons] = useState([]);
    const [totalLesson, setTotalLesson] = useState(1);
    const location = useLocation();
    const queryParams = useQueryParams();
    const limit = 5;
    const { permissions } = useSelector((state) => state.authAdminReducer);



    const fetchAPI = async (sectionId, params = {}) => {
        const result = await getTrashLesson(sectionId, params);
        setLesson(result.lessons);
        setTotalLesson(result.totalLesson);
    };

    useEffect(() => {
        const page = queryParams.get('page') || 1;
        const sortKey = queryParams.get('sortKey') || "";
        const sortValue = queryParams.get('sortValue') || "";
        const keyword = queryParams.get('keyword') || "";
        fetchAPI(sectionId, {
            keyword: keyword,
            sortKey: sortKey,
            sortValue: sortValue,
            page: page,
            limit: limit
        });
    }, [reload, location.search]);

    const handleReload = () => {
        setReload(!reload);
    };

    const handleCheck = (id) => {
        setCheckedLessons((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

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
        ...(permissions.includes("lessons_restore") ? [{
            value: 'restore',
            label: "-- Khôi phục --"
        }] : []),
        ...(permissions.includes("lessons_delete-permanently") ? [{
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

    const setRowKeysEmpty = () => {
        setCheckedLessons([]);
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
            {permissions.includes("lessons_trash") ? (
                <div className="lesson">
                    <div className="container-admin">
                        <div className="lesson__header">
                            <Row gutter={[30, 10]} justify="space-between" align="middle">
                                <Col md={12}>
                                    <Row gutter={10} align='middle'>
                                        <Col>
                                            <h3 className="lesson__title">
                                                Danh sách bài học
                                            </h3>
                                        </Col>

                                        {permissions.includes("lessons_view") && (
                                            <Col>
                                                <Link to={`/admin/${courseId}/${sectionId}/lessons`}>
                                                    <Button color="primary" variant="outlined">Danh sách bài học</Button>
                                                </Link>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>

                                <Col flex="none">
                                    <Row gutter={[10, 10]}>
                                        <Col flex="none">
                                            <div className="course__change-multi">
                                                <ChangeMulti
                                                    changeMultiOption={changeMultiOption}
                                                    onReload={handleReload}
                                                    selectedRowKeys={checkedLessons}
                                                    rowKeysEmpty={setRowKeysEmpty}
                                                    changeMulti={(option) => restoreMultiLessonText(sectionId, option)}
                                                    textConfirm="Bạn có chắc muốn xóa vĩnh viễn những bài học này?"
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <div className="lesson__filter-bar">
                            <Row gutter={[30, 20]}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <InputSearch valueDefault={queryParams.get('keyword') || ''} onSearch={handleSearch} />
                                </Col>

                                <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                    <Sort sortOptions={sortOptions} handleSort={handleSort} defaultSelect={`${queryParams.get('sortKey') || "title"}-${queryParams.get('sortValue') || "asc"}`} />
                                </Col>
                            </Row>
                        </div>

                        <div className="lesson__card">
                            <Row gutter={[20, 20]}>
                                {lessons && (
                                    lessons.map(lesson => (
                                        <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} key={lesson._id}>
                                            <Card
                                                actions={[
                                                    <Checkbox
                                                        checked={checkedLessons.includes(lesson._id)}
                                                        onChange={() => handleCheck(lesson._id)}
                                                    >
                                                    </Checkbox>,
                                                ]}
                                                hoverable
                                                type="inner"
                                                style={{ height: "100%" }}
                                                extra={
                                                    <>
                                                        <Row gutter={[10, 10]}>
                                                            {permissions.includes("lessons_restore") && (
                                                                <Col>
                                                                    <Restore id={lesson._id} onReload={handleReload} functionRestore={(lessonId) => restoreTrashLesson(sectionId, lessonId)} />

                                                                </Col>
                                                            )}

                                                            {permissions.includes("lessons_delete-permanently") && (
                                                                <Col>
                                                                    <Delete id={lesson._id} onReload={handleReload} functionDelete={(lessonId) => deleteTrashLessonText(sectionId, lessonId)} textConfirm={"Bạn có muốn xóa vĩnh viễn bài học này không?"} />

                                                                </Col>
                                                            )}
                                                        </Row>

                                                    </>
                                                }
                                            >

                                                <div className="lesson__card-title">
                                                    {lesson.title}
                                                </div>
                                                {lesson.type === "quiz" && (
                                                    // <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="lesson__quiz">
                                                    //     {lesson.questions.map((q, index) => (
                                                    //         <Card key={index} title={`Câu ${index + 1}: ${q.content}`}>
                                                    //             <p>
                                                    //                 <strong>Loại câu hỏi:</strong>{' '}
                                                    //                 {q.questionType === 'multiple' ? (
                                                    //                     <Tag color="blue">Nhiều đáp án đúng</Tag>
                                                    //                 ) : (
                                                    //                     <Tag color="green">Một đáp án đúng</Tag>
                                                    //                 )}
                                                    //             </p>

                                                    //             <List
                                                    //                 dataSource={q.answers}
                                                    //                 renderItem={(a, i) => (
                                                    //                     <List.Item>
                                                    //                         <div>
                                                    //                             {String.fromCharCode(65 + i)}. {a.text}{' '}
                                                    //                             {a.isCorrect && <Tag color="success">Đáp án đúng</Tag>}
                                                    //                         </div>
                                                    //                     </List.Item>
                                                    //                 )}
                                                    //             />
                                                    //         </Card>
                                                    //     ))}
                                                    // </div>
                                                    <Form className="lesson__quiz">
                                                        {lesson.questions.map((question, index) => (
                                                            <Form.Item key={index}>
                                                                <Card
                                                                    title={`Câu ${index + 1}: ${question.content}`}
                                                                >

                                                                    {question.questionType === 'multiple' ? (
                                                                        <>
                                                                            <strong style={{
                                                                                display: "block",
                                                                                width: "100%",
                                                                                marginBottom: "8px"
                                                                            }}>Loại câu hỏi: <Tag color="blue">Nhiều đáp án đúng</Tag></strong>
                                                                            <Checkbox.Group style={{ width: '100%' }}
                                                                                value={
                                                                                    question.answers
                                                                                        .map((answer, index) => (answer.isCorrect ? index : null))
                                                                                        .filter((i) => i !== null)
                                                                                }
                                                                            >
                                                                                {question.answers.map((answer, index) => (
                                                                                    <Checkbox
                                                                                        key={index}
                                                                                        value={index}
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            width: '100%',
                                                                                            marginBottom: 8,
                                                                                        }}
                                                                                    >
                                                                                        <span style={{ flex: 1 }}>
                                                                                            {String.fromCharCode(65 + index)}. {answer.text}
                                                                                        </span>
                                                                                        {answer.isCorrect && <Tag color="success">Đáp án đúng</Tag>}
                                                                                    </Checkbox>
                                                                                ))}
                                                                            </Checkbox.Group>
                                                                        </>

                                                                    ) : (
                                                                        <>
                                                                            <strong style={{
                                                                                display: "block",
                                                                                width: "100%",
                                                                            }}>Loại câu hỏi: <Tag color="green">Một đáp án đúng</Tag></strong>

                                                                            <Radio.Group
                                                                                value={question.answers.findIndex(answer => answer.isCorrect)}
                                                                            >
                                                                                {question.answers.map((answer, index) => (
                                                                                    <Radio key={index} style={{
                                                                                        display: "block",
                                                                                        width: "100%"
                                                                                    }}
                                                                                        value={index}
                                                                                    >
                                                                                        {answer.text}{" "}
                                                                                        {answer.isCorrect && <Tag color="success">Đáp án đúng</Tag>}
                                                                                    </Radio>
                                                                                ))}
                                                                            </Radio.Group>
                                                                        </>
                                                                    )}
                                                                </Card>
                                                            </Form.Item>
                                                        ))}
                                                    </Form>
                                                )}

                                                {lesson.type === "text" && (
                                                    <div>
                                                        {parse(lesson.content || "")}
                                                    </div>
                                                )}
                                            </Card>
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </div>

                        <Row gutter={[20, 20]}>
                            <Col span={24}>
                                <Pagination onChange={handleChangePagination} className="pagination" align="center" defaultCurrent={queryParams.get('page')} total={totalLesson} pageSize={limit} />
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

export default TrashLesson;