import { AxiosRequestConfig } from './types'

/**
 * 默认的配置
 */
const defaults: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    transformRequest: [
        function(data: any): any {
            return data
        }
    ],
    transformResponse: [
        function(data: any): any {
            return data
        }
    ],

    validateStatus(status: number): boolean {
        return status >= 200 && status < 300
    }
}

export const methodsNoData = ['delete', 'get', 'head', 'options']
methodsNoData.forEach(method => {
    defaults.headers[method] = {}
})

export const methodWithData = ['post', 'put', 'patch']
// 添加请求头
methodWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults
