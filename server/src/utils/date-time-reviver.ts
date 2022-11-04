
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export const dateTimeReviver = (key, value) => {
    if (typeof value === 'string' && dateFormat.test(value)) {
        return new Date(value);
    }
    return value;
};
