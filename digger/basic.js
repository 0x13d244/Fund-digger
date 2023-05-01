import request from '../utils/request.js';

const DEFAULT_VALUE = '';

const patterns = {
    '基金简称': /<title>(\S+)(?=\u0028\d{6}\u0029)/,
    '基金规模': />规模\D+([\d\.]+)亿/,
    '成立日期': /成 立 日\D+([\d\-]{10})<\/td>/,
    '跟踪误差': /跟踪误差\D+([\d\.]+%)<\/td>/,
    '分红次数': /总计分红<[^>]+>\s*(\d+)<\/a>/,
};

const getBasicInfo = async function (code) {
    const url = `https://fund.eastmoney.com/${code}.html?spm=search`;
    const response = await request(url).then(res => res.text());
    const result = { '基金代码': code };

    Object.entries(patterns).forEach(([name, pattern]) => {
        result[name] = response.match(pattern)?.[1] ?? DEFAULT_VALUE;
    });

    return result;
};

export { getBasicInfo };