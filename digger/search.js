import searchMorningstar from '../data/morningstar.js';
import request from '../utils/request.js';

const BASE_URL = 'https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx';

const ETF_NAME_PATTERN = /\u0028QDII-ETF\u0029|ETF(\u0028QDII\u0029)?$/;
const ETF_CODE_PATTERN = /^(159|51[0-35-8]|520|530|551|56[0-3]|58[89])/;
const LOF_CODE_PATTERN = /^(16|501|502|506)/;
const SHARE_TYPE_PATTERN = /(?<![A-Z])[A-Z]\b/g;

const filter = function (list, tags, expected = true) {
    return list.filter(({ code, name }) => {
        const isETF = ETF_CODE_PATTERN.test(code);
        const isLOF = LOF_CODE_PATTERN.test(code);
        const shareTypes = name.match(SHARE_TYPE_PATTERN) ?? ['A'];

        return tags.every(tag => {
            let state;

            switch (tag) {
                case '场内':
                    state = isETF || isLOF;
                    break;
                case '场外':
                    state = !isETF;
                    break;
                case 'ETF':
                    state = isETF;
                    break;
                case 'LOF':
                    state = isLOF;
                    break;
                default:
                    if (/^[A-Z]$/.test(tag)) {
                        state = shareTypes.includes(tag);
                    } else {
                        state = name.includes(tag);
                    }
            }

            return state === expected;
        });
    });
};

const convert = function (list) {
    return list.map(item => {
        return {
            code: item.CODE,
            name: item.NAME
        };
    });
};

const getPagedData = async function (keyword, pageindex) {
    const params = {
        m: 1,
        key: keyword,
        pageindex: pageindex,
        pagesize: 1000,
        _: Date.now()
    };
    const url = `${BASE_URL}?${new URLSearchParams(params)}`;
    const response = await request(url).then(res => res.json());
    const result = response?.Datas ?? [];

    return result;
};

const searchEastmoney = async function (keyword) {
    const cache = [];
    let pageindex = 0;

    while (true) {
        const item = await getPagedData(keyword, pageindex);

        if (item.length === 0) {
            break;
        }

        cache.push(...item);
        pageindex += 1;
    }

    return convert(cache);
};

const search = async function (keyword, options = {}) {
    const { include = [], exclude = [] } = options;
    let result;

    if (options.morningstar) {
        result = searchMorningstar(keyword);
    } else {
        result = await searchEastmoney(keyword);
    }

    result = filter(result, ['后端', ...exclude], false);
    result = filter(result, include, true);

    return result;
};

export default search;