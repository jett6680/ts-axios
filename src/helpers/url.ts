import { isDate, isObject, isURLSearchParams } from './utils'

interface URLOrigin {
    host: string
    protocol: string
}

// 将参数编码，特殊字符替换回来
function encode(val: string): string {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
}
/**
 * @params url 请求的url
 * @params params 请求携带的参数
 * @return 返回一个 url?xxx=yyy的url
 */
export function buildURL(
    url: string,
    params?: any,
    paramsSerializer?: (val: any) => string
): string {
    if (!params) {
        return url
    }

    let serializedParams
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params)
    } else if (isURLSearchParams(params)) {
        serializedParams = params.toString()
    } else {
        const parts: string[] = []

        Object.keys(params).forEach(key => {
            // 获取当前遍历的对象的值
            const value = params[key]
            if (value === null || typeof value === 'undefined') {
                return
            }

            let values = []
            if (Array.isArray(value)) {
                values = value
                key += '[]'
            } else {
                values = [value]
            }

            // 遍历当前的值，对值的类型坐判断，可为date类型和object类型

            values.forEach(val => {
                if (isDate(val)) {
                    val = val.toISOString()
                } else if (isObject(val)) {
                    val = JSON.stringify(val)
                }
                parts.push(`${encode(key)}=${encode(val)}`)
            })
        })

        serializedParams = parts.join('&')
    }

    if (serializedParams) {
        const markIndex = url.indexOf('#')
        if (markIndex !== -1) {
            url = url.slice(0, markIndex)
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }

    return url
}

const urlParsingNode = document.createElement('a')
const currentURLOrigin = resolveURL(window.location.href)
/**
 * 创建一个a标签来快速解析传递进去的url的协议和主机名
 * @param url
 */
function resolveURL(url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url)
    const { host, protocol } = urlParsingNode
    return {
        host,
        protocol
    }
}

/**
 * 判断请求的url和当前域是否同源
 * @param requestURL
 */
export function isURLSameOrigin(requestURL: string): boolean {
    const parserRequestOrigin = resolveURL(requestURL)
    return (
        currentURLOrigin.protocol === parserRequestOrigin.protocol &&
        currentURLOrigin.host === parserRequestOrigin.host
    )
}

export function isAbsoluteURL(url: string): boolean {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL
}
