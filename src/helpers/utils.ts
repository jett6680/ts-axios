const toString = Object.prototype.toString

/**
 * @params 任意的参数
 * 判断是否是Date类型
 */
export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]'
}

/**
 * @params 任意参数
 * 判断是否是objec类型
 */
export function isObject(val: any): boolean {
    return toString.call(val) === '[object Object]'
}

/**
 * 判断时都是数组
 * @params 任意参数
 */
export function isArray(val: any): boolean {
    return toString.call(val) === '[object Array]'
}

/**
 * 判断是否是FormData
 */
export function isFormData(val: any): boolean {
    return toString.call(val) === '[object FormData]'
}

/**
 * 判断是否是URLSearchParams
 */
export function isURLSearchParams(val: any): val is URLSearchParams {
    return typeof val !== 'undefined' && val instanceof URLSearchParams
}

/**
 * 对象属性的拷贝
 * @param to
 * @param from
 */
export function extend<T, U>(to: T, from: U): T & U {
    for (const key in from) {
        ;(to as T & U)[key] = from[key] as any
    }
    return to as T & U
}

/**
 * 深度合并
 * @param objs
 */
export function deepMerge(...objs: any[]): any {
    const result = Object.create(null)

    objs.forEach(obj => {
        if (obj) {
            Object.keys(obj).forEach(key => {
                const val = obj[key]
                if (isObject(val)) {
                    /**
                     * 如果result包含了key所对应的数据并且是对象，
                     * 则将result[key]和val的进行深度合并
                     */
                    if (isObject(result[key])) {
                        result[key] = deepMerge(result[key], val)
                    } else {
                        result[key] = deepMerge(val)
                    }
                } else {
                    result[key] = val
                }
            })
        }
    })

    return result
}
