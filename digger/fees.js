import request from '../utils/request.js';

const DEFAULT_FEE = '';

const parse = function (response) {
    const result = {};
    const feeTypes = ['管理费率', '托管费率', '销售费率'];
    const purchaseFees = response.match(/购买手续费\D+([\d\.]+%)\D*([\d\.]+%)?<\/b>/) ?? [];
    const operationFees = response.match(/\b([\d\.]+%)(?=\uff08每年\uff09)/g) ?? [];
    const totalOperationFees = operationFees.reduce((accumulator, item) => {
        return accumulator + parseFloat(item);
    }, 0);

    result['申购费率'] = purchaseFees[2] ?? purchaseFees[1] ?? DEFAULT_FEE;
    result['运作费率'] = `${totalOperationFees.toFixed(2)}%`;

    feeTypes.forEach((type, index) => {
        result[type] = operationFees[index] ?? DEFAULT_FEE;
    });

    return result;
};

const getFeeRates = async function (code) {
    const url = `https://fundf10.eastmoney.com/jjfl_${code}.html`;
    const response = await request(url).then(res => res.text());
    const result = parse(response);

    return result;
};

export { getFeeRates };