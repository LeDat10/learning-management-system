import { Button, message } from "antd";
import { useState } from "react";


function Restore(props) {
    const { id, onReload, functionRestore } = props;
    const [loading, setLoading] = useState(false);

    const handleRestore = async () => {
        setLoading(true);
        const result = await functionRestore(id);
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
            <Button loading={loading} color="primary" variant="filled" style={{ marginLeft: "5px" }} onClick={handleRestore}>Khôi phục</Button>
        </>
    );
};

export default Restore;