const DEFAULT_RETRIES = 5;
const DEFAULT_TIMEOUT = 5000; // 5 seconds
const DEFAULT_INTERVAL = 1000; // 1 second
const DEFAULT_STATUS = 503; // Service Unavailable
const DEFAULT_STATUS_TEXT = 'Max retries exceeded';
const DEFAULT_REFERRER = 'https://fund.eastmoney.com/';
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36';

const createDefaultResponse = function (contentType) {
    let body = null;
    const headers = {};

    switch (contentType) {
        case 'application/json':
            body = JSON.stringify({ error: DEFAULT_STATUS_TEXT });
            headers['Content-Type'] = 'application/json';
            break;
        case 'text/html':
            body = `<html><body><h1>${DEFAULT_STATUS_TEXT}</h1></body></html>`;
            headers['Content-Type'] = 'text/html';
            break;
        default:
            body = JSON.stringify({ error: DEFAULT_STATUS_TEXT });
    }

    return new Response(body, {
        status: DEFAULT_STATUS,
        statusText: DEFAULT_STATUS_TEXT,
        headers
    });
};

const request = async function (url, options = {}) {
    const {
        retries = DEFAULT_RETRIES,
        timeout = DEFAULT_TIMEOUT,
        interval = DEFAULT_INTERVAL,
        referrer = DEFAULT_REFERRER,
        headers = {},
        ...rest
    } = options;

    for (let attempt = 1; attempt <= retries; attempt += 1) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'accept': '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'User-Agent': DEFAULT_USER_AGENT,
                    ...headers
                },
                referrer,
                ...rest
            });
            clearTimeout(timer);
            return response;
        } catch (error) {
            console.log(`${error.name}: ${error.message}`);
            clearTimeout(timer);
            if (attempt <= retries) {
                const delay = attempt * interval;
                console.log(`Retrying URL: ${url}, attempt: ${attempt}, delay: ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    console.log(`Max retry limit reached for URL: ${url}`);
    return createDefaultResponse(headers['Content-Type'] || headers['content-type']);
};

export default request;