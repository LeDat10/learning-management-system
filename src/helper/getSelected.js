export const getSelected = (positions, selectedRowKeys) => {
    const selected = selectedRowKeys.map(key => {
        const position = positions[key];
        return `${key}-${position}`;
    });
    return selected;
};