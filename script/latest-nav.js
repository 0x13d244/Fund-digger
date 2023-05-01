// 获取投资组合的最新净值
import { getNetAssetValue } from "../index.js";

const funds = {
    demon: '012773 050027 000216 501018 110020 160119 050025 000834'.split(/\s/),
    mina: '012773 050027 000216 110020 000008 050025 040046'.split(/\s/)
};
let prefix = '';

for (const [owner, list] of Object.entries(funds)) {
    const result = [];

    for (const code of list) {
        const cache = await getNetAssetValue(code);
        const [date, value] = cache[0];
        result.push(value);
    }

    console.log([`${prefix}${owner}`, result.join('\t')].join('\n'));
    prefix = '\n';
}
