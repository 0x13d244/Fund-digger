import search from './digger/search.js';
import { getBasicInfo } from './digger/basic.js';
import { getStageReturns } from './digger/returns.js';
import { getFeeRates } from './digger/fees.js';
import { getHolderStructure } from './digger/holder.js';

const titles = [
    '基金代码', '基金简称', '基金规模', '成立日期', '跟踪误差', '分红次数',
    '今年来', '近1年', '近3年', '近5年',
    '申购费率', '运作费率',
    '机构持有', '个人持有', '内部持有',
];

const detail = async function (code) {
    const handles = [getBasicInfo, getStageReturns, getFeeRates, getHolderStructure];
    const promises = handles.map(handle => handle(code));
    const results = await Promise.all(promises);

    return Object.assign({}, ...results);
};

const dig = async function (keyword, options = {}) {
    const list = await search(keyword, options);
    const total = list.length;
    const result = [titles];

    // To ensure order, do not use the forEach method
    for (let index = 0; index < total; index += 1) {
        const { code, name } = list[index];
        const data = await detail(code);
        const row = titles.map(key => data[key]);

        result.push(row);
        options.hook?.({ index, total, code, name });
    }

    return result;
};

export { dig, search, detail };
export { getNetAssetValue } from './digger/nav.js';