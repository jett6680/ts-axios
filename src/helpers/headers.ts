import { deepMerge, isObject } from './utils'
import { METHOD } from '../types'
import { methodsNoData, methodWithData } from '../defaults'

/**
 * 将headers的大小写转换成一至 example ->  content-type => Content-Type
 * @param headers
 * @param normalizedName
 */
function normalizeHeaders(headers: any, normalizedName: string): void {
    if (!headers) {
        return
    }
    Object.keys(headers).forEach(name => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name]
            delete headers[name]
        }
    })
}

export function processHeaders(headers: any, data: any): any {
    normalizeHeaders(headers, 'Content-Type')

    if (isObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json; charset=utf-8'
        }
    }

    return headers
}

/**
 * 解析headers字符串成对象
 * @param headers
 */
export function parserHeaders(headers: string): any {
    const result = Object.create(null)
    if (!headers) {
        return headers
    }
    headers.split(/\r\n/).forEach(line => {
        let [key, value] = line.split(':')
        key = key.trim().toLowerCase()
        if (!key) {
            return
        }
        if (value) {
            value = value.trim()
        }
        result[key] = value
    })

    return result
}

/**
 * 将请求头扁平化，去除get，post，common....等属性将里面的值拿到headers上面
 * @param headers
 * @param method
 */
export function flattenHeaders(headers: any, method: METHOD): any {
    if (!headers) {
        return headers
    }

    headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

    const methodsToDelete = ['common'].concat(methodWithData).concat(methodsNoData)

    methodsToDelete.forEach(key => {
        delete headers[key]
    })

    return headers
}
