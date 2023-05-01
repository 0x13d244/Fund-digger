// 获取净值列表中指定日期的净值
import { getNetAssetValue } from "../index.js";

const code = '050027';
const options = {
    start: '2024-12-01',
    end: '2024-12-31',
    reverse: true
};
const dates = [
    '2024-12-10',
    '2024-12-12',
    '2024-12-14',
    '2024-12-16',
    '2024-12-18',
    '2024-12-20'
];

const list = await getNetAssetValue(code, options);
const result = list.filter(([date]) => {
    return dates.includes(date);
})

console.log(result.map(row => row.join('\t')).join('\n'));
