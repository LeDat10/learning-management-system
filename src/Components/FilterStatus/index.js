import { Select } from 'antd';
import './FilterStatus.scss';

function FilterStatus(props) {
    const { filterStatusOptions, handleChangeStatus, valueDefault } = props;

    return (
        <>
            <div className='filter-status'>
                <Select
                    className='filter-status__select'
                    options={filterStatusOptions}
                    defaultValue={valueDefault}
                    onChange={handleChangeStatus}
                    size='large'
                />
            </div>
        </>
    );
};

export default FilterStatus;