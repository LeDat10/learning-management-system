import { Select } from "antd";
import "./Sort.scss";

function Sort(props) {
    const { sortOptions, handleSort, defaultSelect } = props;

    return (
        <>
            <div className='sort'>
                <Select
                    className="sort__select"
                    options={sortOptions}
                    defaultValue={defaultSelect}
                    onChange={handleSort}
                    size="large"
                />
            </div>
        </>
    );
};

export default Sort;