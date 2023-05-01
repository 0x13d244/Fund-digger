import request from '../utils/request.js';

const BASE_URL = 'https://fundf10.eastmoney.com/FundArchivesDatas.aspx';
const NO_DATA_PLACEHOLDER = '---';

const parseAnnualReturns = function (response) {
    const values = response.match(/([\-\d\.]+%|\-+)(?=<\/td>)/g);
    const years = response.match(/\d+(?=年)/g) ?? [];
    const result = [];

    years.forEach((year, index) => {
        const value = values[index];
        if (value !== NO_DATA_PLACEHOLDER) {
            result.push([year, value]);
        }
    });

    return result;
};

const parseStageReturns = function (response) {
    const result = {};
    const pattern = /<li class='title'>(\S+)<\/li><li [^>]+>([\-\d\.]+%|\-+)<\/li>/g;
    let matched = pattern.exec(response);

    while (matched) {
        const [full, title, value] = matched;

        if (value !== NO_DATA_PLACEHOLDER) {
            result[title] = value;
        }

        matched = pattern.exec(response);
    }

    return result;
};

const getAnnualReturns = async function (code, options = {}) {
    const params = {
        type: 'yearzf',
        code: code,
        rt: Math.random()
    };
    const url = `${BASE_URL}?${new URLSearchParams(params)}`;
    const referrer = `https://fundf10.eastmoney.com/jndzf_${code}.html`;
    const response = await request(url, { referrer }).then(res => res.text());
    const result = parseAnnualReturns(response);

    if (options.reverse) {
        result.reverse();
    }

    return result;
};

const getStageReturns = async function (code) {
    const params = {
        type: 'jdzf',
        code: code,
        rt: Math.random()
    };
    const url = `${BASE_URL}?${new URLSearchParams(params)}`;
    const referrer = `https://fundf10.eastmoney.com/jdzf_${code}.html`;
    const response = await request(url, { referrer }).then(res => res.text());
    const result = parseStageReturns(response);

    return result;
};

export { getAnnualReturns, getStageReturns };