import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/'
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'
import xhr from './xhr'

function dispatchRequest<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    throwIfCancellationRequested(config)
    processConfig(config)
    return xhr(config).then(res => {
        return transformResponseData(res)
    })
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.headers = processHeaders(config.headers, config.data)
    config.data = transform(transformRequest(config.data), config.headers, config.transformRequest)
    config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
    let { url, params, paramsSerializer, baseUrl } = config
    if (baseUrl && !isAbsoluteURL(url!)) {
        url = combineURL(baseUrl, url)
    }
    return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(response: AxiosResponse): any {
    response.data = transform(
        transformResponse(response.data),
        response.headers,
        response.config.transformResponse
    )
    return response
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}

export default dispatchRequest
