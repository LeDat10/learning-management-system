import { Button, Col, Form, Input, message, Row } from "antd";
import "./Role.scss";
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { createRole } from "../../../services/admin/roleService";
import { useSelector } from "react-redux";

function CreateRole() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const handleSubmit = async (data) => {
        setLoading(true);

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
        const result = await createRole(data);
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
            {permissions.includes("roles_create") ? (
                <div className="role">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="role__title">
                                        Thêm nhóm quyền
                                    </h3>
                                </Col>

                                {permissions.includes("roles_view") && (
                                    <Col flex="none">
                                        <Link to={`/admin/roles`}>
                                            <Button color="primary" variant="outlined">
                                                Danh sách nhóm quyền
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
                                    className="role__form"
                                    layout="vertical"
                                    size="large"
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

                                    <div className="role__desc">
                                        <label className="role__label-desc">Mô tả nhóm quyền</label>
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

                                    <Form.Item>
                                        <Button loading={loading} style={{ backgroundColor: '#20d489', color: '#fff' }} htmlType="submit" >Thêm nhóm quyền</Button>
                                    </Form.Item>
                                </Form>
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

export default CreateRole;