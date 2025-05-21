import { Button, Col, Form, Input, InputNumber, message, Row, Select, Switch, Upload } from "antd";
import { Editor } from '@tinymce/tinymce-react';
import "./Course.scss";
import { useEffect, useRef, useState } from "react";
import { checkImage } from "../../../helper/checkImage";
import { PlusOutlined } from "@ant-design/icons";
import { editCourse, getCategories, getDetailCourse } from "../../../services/admin/courseSevice";
import { Link, useParams } from "react-router-dom";
import { processThumbnail } from "../../../helper/processThumnail";
import { useSelector } from "react-redux";

function EditCourse() {
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [course, setCourse] = useState({});
    const params = useParams();
    const [originalThumbnail, setOriginalThumbnail] = useState(null);
    const [category, setCategory] = useState([]);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const { permissions } = useSelector((state) => state.authAdminReducer);

    const fetchAPI = async () => {
        const result = await getDetailCourse(params.courseId);
        setCourse(result.course);
        setOriginalThumbnail(result.course.thumbnail);
    };

    const fetchCategoryAPI = async () => {
        const result = await getCategories();
        setCategory(result.categories);
    };

    const handleReload = () => {
        setReload(!reload);
    }

    useEffect(() => {
        fetchAPI();
    }, [reload]);

    useEffect(() => {
        fetchCategoryAPI();
    }, []);

    const categoryOpitons = [
        {
            value: "",
            label: "-- Danh mục --",
        },
        ...category.map(item => ({
            value: item._id,
            label: `-- ${item.title} --`
        }))
    ];

    useEffect(() => {
        const formInitialValues = async () => {
            if (Object.keys(course).length > 0) {
                if (course.status === "active") {
                    course.status = true;
                } else if (course.status === "inactive") {
                    course.status = false;
                };

                form.setFieldsValue({
                    title: course.title || "",
                    toggle: course.toggle,
                    status: course.status,
                    type: course.type || "free",
                    position: course.position || "",
                    thumbnail: await processThumbnail(course.thumbnail),
                    categoryId: course.categoryId || ""
                });
            };
        };
        formInitialValues();
    }, [course]);

    const typeOptions = [
        {
            value: "free",
            label: "-- Miễn phí --"
        },
        {
            value: "premium",
            label: "-- Premium --"
        }
    ];

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
        const result = await editCourse(params.courseId, formData);
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
            {permissions.includes("courses_edit") ? (
                <div className="course__edit">
                    <div className="container-admin">
                        <div className="header-page">
                            <Row gutter={30} justify="space-between" align="middle">
                                <Col md={12}>
                                    <h3 className="title-page">
                                        Chỉnh sửa khóa học
                                    </h3>
                                </Col>

                                {permissions.includes("coures_view") && (
                                    <Col flex="none">
                                        <Link to={'/admin/courses'}>
                                            <Button color="primary" variant="outlined">Danh sách khóa học</Button>
                                        </Link>
                                    </Col>
                                )}
                            </Row>
                        </div>

                        <Row>
                            <Col xs={24}>
                                <Form
                                    form={form}
                                    className="course__form"
                                    layout="vertical"
                                    size="large"
                                    onFinish={handleSubmit}
                                >
                                    <Form.Item
                                        label="Tiêu đề khóa học"
                                        name="title"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Tiêu đề khóa học không được bỏ trống!"
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Danh mục khóa học"
                                        name="categoryId"
                                    >
                                        <Select options={categoryOpitons} />
                                    </Form.Item>

                                    <div className="course__desc">
                                        <label className="course__label-desc">Mô tả khóa học</label>
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
                                            initialValue={course.description || ""}
                                        />
                                    </div>

                                    <Row>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                                            <Form.Item
                                                label="Khóa học"
                                                name="toggle"
                                            >
                                                <Switch
                                                    checkedChildren="Mở"
                                                    unCheckedChildren="Đóng"
                                                />
                                            </Form.Item>
                                        </Col>

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
                                                label="Loại khóa học"
                                                name="type"
                                            >
                                                <Select options={typeOptions} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        label="Vị trí"
                                        name="position"
                                    >
                                        <InputNumber min={1} placeholder="Tự động tăng" className="course__position" />
                                    </Form.Item>

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
                <div>Không được cấp quyền chỉnh sửa khóa học</div>
            )}
        </>
    );
};

export default EditCourse;