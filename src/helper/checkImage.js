import { message } from "antd";

export const checkImage = (file, Upload) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
        message.error("Chỉ được tải lên tệp hình ảnh!");
        return Upload.LIST_IGNORE;
    }
    return false;
};