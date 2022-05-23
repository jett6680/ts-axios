import { AxiosRequestConfig } from '../types'
import { deepMerge, isObject } from '../helpers/utils'

const strats = Object.create(null)

function defaultStrat(val1: any, val2?: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
        return val2
    }
}

function deepMergeStrat(val1: any, val2: any): any {
    if (isObject(val2)) {
        return deepMerge(val1, val2)
    } else if (typeof val2 !== 'undefined') {
        return val2
    } else if (isObject(val1)) {
        return deepMerge(val1)
    } else {
        return val1
    }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
    strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
    strats[key] = deepMergeStrat
})

export default function mergeConfig(
    config1: AxiosRequestConfig,
    config2?: AxiosRequestConfig
): AxiosRequestConfig {
    if (!config2) {
        config2 = {}
    }

    // 定义一个要返回的对象
    const config = Object.create(null)

    for (let key in config2) {
        mergeField(key)
    }

    // 处理config1上有的但是config2上没有的合并到config上
    for (let key in config1) {
        if (!config2[key]) {
            mergeField(key)
        }
    }

    function mergeField(key: string): any {
        const strat = strats[key] || defaultStrat
        config[key] = strat(config1[key], config2![key])
    }

    return config
}
