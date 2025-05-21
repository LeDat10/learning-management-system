import { Button, Col, Form, Input, InputNumber, message, Row, Switch } from "antd";
import "./Section.scss";
import { Link, useParams } from "react-router-dom";
import { createSection } from "../../../services/admin/sectionSevice";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

function CreateSection() {
    const [form] = Form.useForm();
    const params = useParams();
    const courseId = params.courseId;
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const handleSubmit = async (data) => {
        if (data.status) {
            data.status = "active";
        } else {
            data.status = "inactive";
        }

        if (editorRef.current.getContent()) {
            data.description = editorRef.current.getContent();
        } else {
            data.description = "";
        };
        setLoading(true);
        const result = await createSection(courseId, data);
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
            {permissions.includes("sections_create") ? (
                <div className="section">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="section__title">
                                        Thêm chương khóa học
                                    </h3>
                                </Col>

                                <Col flex="none">
                                    <Link to={`/admin/${courseId}/sections`}>
                                        <Button color="primary" variant="outlined">
                                            Danh sách chương
                                        </Button>
                                    </Link>
                                </Col>
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
                                        status: true,
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

                                    <div className="section__desc">
                                        <label className="section__label-desc">Mô tả chương</label>
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
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
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

                                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                            <Form.Item
                                                label="Vị trí"
                                                name="position"
                                            >
                                                <InputNumber min={1} placeholder="Tự động tăng" className="section__position" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item>
                                        <Button loading={loading} style={{ backgroundColor: '#20d489', color: '#fff' }} htmlType="submit" >Thêm chương</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền thêm chương</div>
            )}
        </>
    );
};

export default CreateSection;