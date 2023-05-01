import request from '../utils/request.js';

const aggregate = function (list) {
    const yearly = new Map();
    const result = [];

    list.forEach(([date, value]) => {
        const [year] = date.split('-');
        const total = yearly.get(year) || 0;
        yearly.set(year, total + parseFloat(value));
    });

    Array.from(yearly.entries()).forEach(([year, total]) => {
        result.push([year, total.toFixed(4)]);
    });

    return result;
};

const parse = function (response) {
    const result = [];
    const pattern = /<td>([\d\-]{10})<\/td><td>每份派现金(\d\.\d{4})元<\/td>/g;
    let matched = pattern.exec(response);

    while (matched) {
        const [full, date, value] = matched;
        result.push([date, value]);
        matched = pattern.exec(response);
    }

    return result;
};

const getDividends = async function (code, options = {}) {
    const url = `https://fundf10.eastmoney.com/fhsp_${code}.html`;
    const response = await request(url).then(res => res.text());
    let result = parse(response);

    if (options.yearly) {
        result = aggregate(result);
    }
    if (options.reverse) {
        result.reverse();
    }

    return result;
};

export { getDividends };