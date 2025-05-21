import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { editCategory, getDetailCategory } from "../../../services/admin/categoryService";
import { processThumbnail } from "../../../helper/processThumnail";
import { Editor } from '@tinymce/tinymce-react';
import { Button, Col, Form, Input, InputNumber, message, Row, Switch, Upload } from "antd";
import { checkImage } from "../../../helper/checkImage";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";


function EditCategory() {
    const params = useParams();
    const categoryId = params.categoryId;
    const [category, setCategory] = useState({});
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [originalThumbnail, setOriginalThumbnail] = useState(null);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailCategory(categoryId);
        setCategory(result.category);
        setOriginalThumbnail(result.category.thumbnail);

    };

    const handleReload = () => {
        setReload(!reload);
    }

    useEffect(() => {
        fetchAPI();
    }, [reload]);

    useEffect(() => {
        const formInitialValues = async () => {
            if (Object.keys(category).length > 0) {
                if (category.status === "active") {
                    category.status = true;
                } else if (category.status === "inactive") {
                    category.status = false;
                };

                form.setFieldsValue({
                    title: category.title || "",
                    status: category.status,
                    position: category.position || "",
                    thumbnail: await processThumbnail(category.thumbnail)
                });
            };
        };
        formInitialValues();
    }, [category]);

    const handleSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        for (const key in data) {
            if (key === "thumbnail") {
                const newFile = data[key]?.[0];
                if (!newFile) {
                    // Người dùng đã xóa ảnh (fileList rỗng) → gửi thumbnail = ""
                    formData.append("thumbnail", "");
                } else {
                    if (newFile.url === originalThumbnail) {
                        // Không thay đổi ảnh → không append gì
                        continue;
                    }

                    if (newFile.originFileObj) {
                        // Người dùng chọn ảnh mới → gửi file
                        formData.append("thumbnail", newFile.originFileObj);
                    }
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
        const result = await editCategory(categoryId, formData);
        if (result.code === 200) {
            message.success(result.message);
            handleReload();
        } else {
            message.error(result.message);
        };
        setLoading(false);
    };

    return (
        <>
            {permissions.includes("category_edit") ? (
                <div className="category">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="category__title">
                                        Chỉnh sửa danh mục
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
                                    onFinish={handleSubmit}
                                >
                                    <Form.Item
                                        label="Tiêu đề danh mục"
                                        name="title"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Tiêu đề danh mục không được bỏ trống!"
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
                                                responsive: true,
                                            }}
                                            initialValue={category.description || ""}
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
                                        <Button loading={loading} style={{ backgroundColor: '#20d489', color: '#fff' }} htmlType="submit" >Chỉnh sửa</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            ) : (
                <div>Không được cấp quyền chỉnh sửa danh mục</div>
            )}
        </>
    );
};

export default EditCategory;