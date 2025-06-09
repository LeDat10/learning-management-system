import { Button, Card, Checkbox, Col, Form, Input, InputNumber, message, Radio, Row, Select, Space, Switch, DatePicker } from "antd";
import "./Lesson.scss";
import { Link, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { editLessonText, getDetailLessonText } from "../../../services/admin/lessonSevice";
import { useSelector } from "react-redux";
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;


function EditLesson() {
    const [form] = Form.useForm();
    const params = useParams();
    const sectionId = params.sectionId;
    const lessonId = params.lessonId;
    const courseId = params.courseId;
    const editorRef = useRef(null);
    const [lesson, setLesson] = useState({});
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("text");
    const { permissions } = useSelector((state) => state.authAdminReducer);


    const fetchAPI = async () => {
        const result = await getDetailLessonText(sectionId, lessonId);
        setLesson(result.lesson);
        setType(result.lesson.type);
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    useEffect(() => {
        const formInitialValues = async () => {
            if (Object.keys(lesson).length > 0) {
                const formattedStatus = lesson.status === "active" ? true : false;

                // Format lại questions để đảm bảo dữ liệu khớp với Form.List
                const formattedQuestions = (lesson.questions || []).map((q) => ({
                    _id: q._id,
                    content: q.content,
                    questionType: q.questionType,
                    answers: q.answers.map((a) => ({
                        text: a.text,
                        isCorrect: a.isCorrect
                    }))
                }));

                form.setFieldsValue({
                    title: lesson.title || "",
                    status: formattedStatus,
                    position: lesson.position || "",
                    type: lesson.type || "",
                    questions: formattedQuestions,
                    duration: lesson.duration || "",
                    maxAttempts: lesson.maxAttempts || "",
                    time: lesson.startTime && lesson.endTime
                        ? [dayjs(lesson.startTime), dayjs(lesson.endTime)]
                        : [], // dùng cho RangePicker
                });
            }
        };

        formInitialValues();
    }, [lesson]);

    const typeOptions = [
        {
            value: 'text',
            label: "-- Nội dung --"
        },
        {
            value: 'assignment',
            label: "-- Bài tập --",
            disabled: true
        },
        {
            value: 'quiz',
            label: '-- Câu hỏi --',
            disabled: true
        }
    ]

    const handleSubmit = async (data) => {
        setLoading(true);

        if (data.status) {
            data.status = "active";
        } else {
            data.status = "inactive";
        }

        if (type === "text") {
            if (editorRef.current.getContent()) {
                data.content = editorRef.current.getContent();
            } else {
                data.content = "";
            };
        }
        if (data.time) {
            data.startTime = data.time[0].toDate();
            data.endTime = data.time[1].toDate();
            delete data.time;
        }
        const result = await editLessonText(sectionId, lessonId, data);

        if (result.code === 200) {
            message.success(result.message);
        } else {
            message.error(result.message);
        };
        setLoading(false);
    };

    return (
        <>
            {permissions.includes("lessons_edit") ? (
                <div className="lesson">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="lesson__title">
                                        Chỉnh sửa bài học
                                    </h3>
                                </Col>

                                {permissions.includes("lessons_view") && (
                                    <Col flex="none">
                                        <Link to={`/admin/${courseId}/${sectionId}/lessons`}>
                                            <Button color="primary" variant="outlined">
                                                Danh sách bài học
                                            </Button>
                                        </Link>
                                    </Col>
                                )}
                            </Row>
                        </div>

                        <Row>
                            <Col xs={24}>
                                <Form
                                    form={form}
                                    className="section__form"
                                    layout="vertical"
                                    size="large"
                                    initialValues={{
                                        toggle: true,
                                        status: true,
                                        type: "text"
                                    }}
                                    onFinish={handleSubmit}
                                >
                                    <Form.Item
                                        label="Tiêu đề"
                                        name="title"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Tiêu đề không được bỏ trống!"
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    {type === "text" && (
                                        <div className="lesson__desc">
                                            <label className="lesson__label-desc">Nội dung bài học</label>
                                            <Editor
                                                apiKey='vcbgfqutgjbvv0cl9kdsjylyti5d6xq99x8gkrigm9jg62u4'
                                                onInit={(_evt, editor) => editorRef.current = editor}
                                                init={{
                                                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                                    // tinycomments_mode: 'embedded',
                                                    // tinycomments_author: 'Author name',
                                                    // mergetags_list: [
                                                    //     { value: 'First.Name', title: 'First Name' },
                                                    //     { value: 'Email', title: 'Email' },
                                                    // ],
                                                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                                    // file_picker_callback: handlePickerCallback
                                                    responsive: true,
                                                }}
                                                initialValue={lesson.content || ""}
                                            />
                                        </div>
                                    )}

                                    {type === "quiz" && (
                                        <>
                                            <Form.Item
                                                label="Câu hỏi"
                                            >
                                                <Form.List name="questions">
                                                    {(fields, { add, remove }) => (
                                                        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                            {fields.map((field) => (
                                                                <Card
                                                                    key={field.key}
                                                                    title={`Câu ${field.name + 1}`}
                                                                    extra={
                                                                        <CloseOutlined
                                                                            onClick={() => remove(field.name)}
                                                                            style={{ color: 'red', cursor: 'pointer' }}
                                                                        />
                                                                    }
                                                                    className="lesson__quiz"
                                                                >
                                                                    <Form.Item name={[field.name, '_id']} noStyle>
                                                                        <Input type="hidden" />
                                                                    </Form.Item>
                                                                    {/* Nội dung câu hỏi */}
                                                                    <Form.Item
                                                                        label="Nội dung câu hỏi"
                                                                        name={[field.name, 'content']}
                                                                        rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
                                                                    >
                                                                        <Input placeholder="Nhập câu hỏi..." />
                                                                    </Form.Item>

                                                                    {/* Loại câu hỏi */}
                                                                    <Form.Item
                                                                        label="Loại câu hỏi"
                                                                        name={[field.name, 'questionType']}
                                                                        initialValue="single"
                                                                        rules={[{ required: true, message: 'Chọn loại câu hỏi' }]}
                                                                    >
                                                                        <Select>
                                                                            <Select.Option value="single">Chọn 1 đáp án đúng</Select.Option>
                                                                            <Select.Option value="multiple">Chọn nhiều đáp án đúng</Select.Option>
                                                                        </Select>
                                                                    </Form.Item>

                                                                    {/* Câu trả lời */}
                                                                    <Form.Item noStyle shouldUpdate>
                                                                        {({ getFieldValue }) => {
                                                                            const allQuestions = getFieldValue('questions') || [];
                                                                            const questionType = allQuestions[field.name]?.questionType;

                                                                            return (
                                                                                <Form.List name={[field.name, 'answers']}>
                                                                                    {(subFields, { add: addAnswer, remove: removeAnswer }) => (
                                                                                        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                                                                                            {subFields.map((subField, idx) => (
                                                                                                <Space key={subField.key} align="baseline">
                                                                                                    {/* Đáp án đúng - Checkbox hoặc Radio */}
                                                                                                    <Form.Item
                                                                                                        name={[subField.name, 'isCorrect']}
                                                                                                        valuePropName="checked"
                                                                                                        initialValue={false}
                                                                                                        noStyle
                                                                                                    >
                                                                                                        {questionType === 'multiple' ? (
                                                                                                            <Checkbox />
                                                                                                        ) : (
                                                                                                            <Radio
                                                                                                                value={idx}
                                                                                                                onChange={() => {
                                                                                                                    // Cập nhật isCorrect duy nhất là true
                                                                                                                    const questions = getFieldValue('questions');
                                                                                                                    const answers = questions[field.name].answers;
                                                                                                                    answers.forEach((a, i) => (a.isCorrect = i === idx));
                                                                                                                }}
                                                                                                            />
                                                                                                        )}
                                                                                                    </Form.Item>

                                                                                                    {/* Nội dung đáp án */}
                                                                                                    <Form.Item
                                                                                                        name={[subField.name, 'text']}
                                                                                                        rules={[{ required: true, message: 'Nhập đáp án' }]}
                                                                                                        noStyle
                                                                                                    >
                                                                                                        <Input placeholder={`Đáp án ${idx + 1}`} />
                                                                                                    </Form.Item>

                                                                                                    {/* Xoá đáp án */}
                                                                                                    <Button
                                                                                                        style={{ border: '0' }}
                                                                                                        onClick={() => removeAnswer(subField.name)}
                                                                                                        icon={<CloseOutlined />}
                                                                                                    />
                                                                                                </Space>
                                                                                            ))}
                                                                                            <Button type="dashed" onClick={() => addAnswer()} block>
                                                                                                + Thêm đáp án
                                                                                            </Button>
                                                                                        </div>
                                                                                    )}
                                                                                </Form.List>
                                                                            );
                                                                        }}
                                                                    </Form.Item>
                                                                </Card>
                                                            ))}

                                                            <Button type="dashed" onClick={() => add()} block>
                                                                + Thêm câu hỏi
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Form.List>
                                            </Form.Item>

                                            <Row gutter={26}>
                                                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                                                    <Form.Item
                                                        name="time"
                                                        label="Thời gian"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Thời gian không được bỏ trống!"
                                                            }
                                                        ]}
                                                    >
                                                        <RangePicker
                                                            showTime
                                                            format="YYYY/MM/DD HH:mm"
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                                    <Form.Item
                                                        name="duration"
                                                        label="Thời lượng làm bài (phút)"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Thời lượng làm bài không được bỏ trống!"
                                                            }
                                                        ]}
                                                    >
                                                        <InputNumber min={1} />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                                    <Form.Item
                                                        name="maxAttempts"
                                                        label="Số lần làm bài"
                                                    >
                                                        <InputNumber min={1} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </>
                                    )}

                                    <Row>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                                            <Form.Item
                                                label="Trạng thái"
                                                name="status"
                                            >
                                                <Switch
                                                    checkedChildren="Hoạt động"
                                                    unCheckedChildren="Dừng hoạt động"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                                            <Form.Item
                                                label="Loại bài học"
                                                name="type"
                                            >
                                                <Select style={{ width: 'auto' }} options={typeOptions} />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                                            <Form.Item
                                                label="Vị trí"
                                                name="position"
                                            >
                                                <InputNumber min={1} placeholder="Tự động tăng" className="lesson__position" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item>
                                        <Button loading={loading} style={{ backgroundColor: '#20d489', color: '#fff' }} htmlType="submit" >Chỉnh sửa</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền chỉnh sửa bài học</div>
            )}
        </>
    );
};

export default EditLesson;