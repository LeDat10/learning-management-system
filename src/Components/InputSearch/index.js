import { Input } from "antd";
const {Search} = Input;

function InputSearch(props) {
    const {valueDefault, onSearch} = props;
    return (
        <>
            <div className="search">
                <Search 
                    placeholder="Tìm kiếm..."
                    allowClear
                    enterButton
                    onSearch={onSearch}
                    defaultValue={valueDefault}
                    size="large"
                />
            </div>
        </>
    );
};

export default InputSearch;