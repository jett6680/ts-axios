import { AxiosPromise, AxiosRequestConfig, AxiosResponse, RejectedFn, ResolvedFn } from '../types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from '../helpers/InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
    // @ts-ignore
    resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

/**
 * axios 类
 */
export default class Axios {
    interceptors: Interceptors
    defaults: AxiosRequestConfig // 默认配置

    constructor(initConfig: AxiosRequestConfig) {
        // 初始化
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }

        this.defaults = initConfig
    }

    request<T = any>(url: any, config?: any): AxiosPromise<T> {
        if (typeof url === 'string') {
            if (!config) {
                config = {}
            }
            config.url = url
        } else {
            config = url
        }
        config = mergeConfig(this.defaults, config)
        config.method = config.method.toLowerCase()

        /**
         * 定义一个链式调用的数组，
         * 存放的是use添加进来的拦截器调用函数，request后进先执行
         * response先进先执行
         * 执行函数在中间被执行
         */
        const chain: PromiseChain<any>[] = [
            {
                resolved: dispatchRequest,
                rejected: undefined
            }
        ]

        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })

        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve(config)

        while (chain.length) {
            // @ts-ignore
            const { resolved, rejected } = chain.shift()
            promise = promise.then(resolved, rejected)
        }

        return promise
    }

    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this._requestWithoutData('get', url, config)
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this._requestWithoutData('delete', url, config)
    }

    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this._requestWithoutData('options', url, config)
    }

    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this._requestWithoutData('head', url, config)
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this._requestWithData('put', url, data, config)
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this._requestWithData('post', url, data, config)
    }

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
        return this._requestWithData('patch', url, data, config)
    }

    _requestWithoutData<T = any>(
        method: string,
        url: string,
        config?: AxiosRequestConfig
    ): AxiosPromise<T> {
        return dispatchRequest(
            Object.assign(config || {}, {
                method,
                url
            })
        )
    }

    _requestWithData<T = any>(
        method: string,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): AxiosPromise<T> {
        return dispatchRequest(
            Object.assign(config || {}, {
                method,
                url,
                data
            })
        )
    }

    getUri(config?: AxiosRequestConfig): string {
        config = mergeConfig(this.defaults, config)
        return transformURL(config)
    }
}
