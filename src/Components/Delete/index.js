import { Button, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./Delelte.scss";
import { useState } from "react";

function Delete(props) {
    const { id, onReload, functionDelete, textConfirm } = props;
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const result = await functionDelete(id);
        if (result.code === 200) {
            onReload();
            message.success(result.message);
        } else {
            message.error(result.message);
        };
        setLoading(false);
    }
    return (
        <>
            <Popconfirm title={textConfirm} onConfirm={handleDelete} okText="Đồng ý" cancelText="Không">
                <Button loading={loading} className="button-delete" color="danger" icon={<DeleteOutlined />} variant="filled">Xóa</Button>
            </Popconfirm>
        </>
    );
};

export default Delete;