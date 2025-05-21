import { Tag, message } from "antd";

function ChangeStatus(props) {
    const { status, onReload, changeStatus } = props;

    const handleChangeStatus = async (statusChange) => {
        const result = await changeStatus({ status: statusChange });
        if (result.code === 200) {
            onReload();
            message.success(result.message);
        } else {
            message.error(result.message);
        }
    };

    const tagStatus = () => {
        if (status === "active") {
            return <Tag color='success' onClick={() => handleChangeStatus("inactive")}>Hoạt động</Tag>
        } else {
            return <Tag color='error' onClick={() => handleChangeStatus("active")}>Dừng hoạt động</Tag>
        }
    }

    return (
        <>
            {tagStatus()}
        </>
    );
};

export default ChangeStatus;