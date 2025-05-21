import { Button, Col, Form, Input, InputNumber, message, Row, Switch, Upload } from "antd";
import "./Category.scss";
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { checkImage } from "../../../helper/checkImage";
import { PlusOutlined } from "@ant-design/icons";
import { createCategory } from "../../../services/admin/categoryService";
import { useSelector } from "react-redux";

function CreateCategory() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const handleSubmit = async (data) => {
        const formData = new FormData();
        for (const key in data) {
            if (key === "thumbnail") {
                if (data[key]) {
                    formData.append(key, data.thumbnail[0].originFileObj);
                } else {
                    formData.append(key, "");
                }
            } else if (key === "status") {
                if (data[key]) {
                    formData.append("status", "active");
                } else {
                    formData.append("status", "inactive");
                }
            } else if (key === "position") {
                if (data[key]) {
                    formData.append("position", data[key]);
                } else {
                    formData.append("position", "");
                }
            } else {
                formData.append(key, data[key]);
            }
        };

        if (editorRef.current.getContent()) {
            formData.append("description", editorRef.current.getContent());
        } else {
            formData.append("description", "");
        };
        setLoading(true);
        const result = await createCategory(formData);
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
            {permissions.includes("category_create") ? (
                <div className="category">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="category__title">
                                        Thêm danh mục khóa học
                                    </h3>
                                </Col>

                                {permissions.includes("category_view") && (
                                    <Col flex="none">
                                        <Link to={'/admin/category'}>
                                            <Button color="primary" variant="outlined">Danh sách danh mục</Button>
                                        </Link>
                                    </Col>
                                )}
                            </Row>
                        </div>

                        <Row>
                            <Col xs={24}>
                                <Form
                                    form={form}
                                    className="category__form"
                                    layout="vertical"
                                    size="large"
                                    initialValues={{
                                        status: true,
                                        type: "free"
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

                                    <div className="category__desc">
                                        <label className="category__label-desc">Mô tả danh mục</label>
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
                                                <InputNumber min={1} placeholder="Tự động tăng" className="category__position" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item label="Ảnh" name="thumbnail" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList || []}>
                                        <Upload listType="picture-card" maxCount={1} name="thumbnail" accept="image/*" beforeUpload={(file) => checkImage(file, Upload)}>
                                            <button
                                                style={{
                                                    color: 'inherit',
                                                    cursor: 'inherit',
                                                    border: 0,
                                                    background: 'none',
                                                }}
                                                type="button"
                                            >
                                                <PlusOutlined />
                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                    }}
                                                >
                                                    Upload
                                                </div>
                                            </button>
                                        </Upload>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button loading={loading} style={{ backgroundColor: '#20d489', color: '#fff' }} htmlType="submit" >Thêm danh mục</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền thêm danh mục</div>
            )}
        </>
    );
};

export default CreateCategory;