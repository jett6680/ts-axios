import { isObject } from './utils'

export function transformRequest(data: any): any {
    if (isObject(data)) {
        return JSON.stringify(data)
    }
    return data
}

/**
 * 将字符串的data转换成json对象
 * @param data
 */
export function transformResponse(data: any): any {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch (e) {
            //
        }
    }
    return data
}
