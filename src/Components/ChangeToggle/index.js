import { message, Tag } from "antd";

function ChangeToggle(props) {
    const { toggle, id, onReload, changeToggle } = props;

    const handleChangeToggle = async (toggle) => {
        const result = await changeToggle(id, {
            toggle: toggle
        });
        if(result.code === 200) {
            message.success(result.message);
            onReload();
        } else {
            message.error(result.message);
        };
    };


    return (
        <>
            {toggle ? (
                <Tag color="green" onClick={() => handleChangeToggle(false)}>Mở</Tag>
            ) : (
                <Tag color="volcano" onClick={() => handleChangeToggle(true)}>Đóng</Tag>
            )}
        </>
    );
};

export default ChangeToggle;