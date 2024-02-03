const { array } = require('@hapi/joi');
const _ = require('lodash');


const pgFormatDate = () => {
    return new Date(Date.now() + (1000 * 60 * (-(new Date()).getTimezoneOffset()))).toISOString().replace('T', ' ').replace('Z', '');
}


const responseHandler = (data) => {
    if (Array.isArray(data)) {
        return data.map(v => responseHandler(v));
    } else if (data != null && data.constructor === Object) {
        return Object.keys(data).reduce(
            (result, key) => ({
                ...result,
                [_.camelCase(key)]: responseHandler(data[key]),
            }),
            {},
        );
    }
    return data;
};


module.exports = {
    pgFormatDate, responseHandler
}