import { Button, Col, Form, Input, InputNumber, message, Row, Select, Switch } from "antd";
import "./Lesson.scss";
import { Link, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { createLessonText } from "../../../services/admin/lessonSevice";
import { useSelector } from "react-redux";

function CreateLesson() {
    const [form] = Form.useForm();
    const params = useParams();
    const sectionId = params.sectionId;
    const courseId = params.courseId;
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { permissions } = useSelector((state) => state.authAdminReducer);

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

        if (editorRef.current.getContent()) {
            data.content = editorRef.current.getContent();
        } else {
            data.content = "";
        };

        const result = await createLessonText(sectionId, data);

        if (result.code === 200) {
            message.success(result.message);
            form.resetFields();
            editorRef.current.setContent("");
        } else {
            message.error(result.message);
        };
        setLoading(false);
    };

    return (
        <>
            {permissions.includes("lessons_create") ? (
                <div className="lesson">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="lesson__title">
                                        Thêm bài học
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
                                        />
                                    </div>

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
                                        <Button loading={loading} style={{ backgroundColor: '#20d489', color: '#fff' }} htmlType="submit" >Thêm bài học</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền thêm bài học</div>
            )}
        </>
    );
};

export default CreateLesson;