import { AxiosTransformer } from '../types'

/**
 * 若fns是一个函数，则需要返回处理后的data，
 * 若fns是一个数组，则函数的最后一个必须有返回值
 * @param data
 * @param headers
 * @param fns 函数或者函数数组
 */
export default function transform(
    data: any,
    headers?: any,
    fns?: AxiosTransformer | AxiosTransformer[]
): any {
    if (!fns) {
        return data
    }

    if (!Array.isArray(fns)) {
        fns = [fns]
    }

    fns.forEach(fn => {
        data = fn(data, headers)
    })

    return data
}
