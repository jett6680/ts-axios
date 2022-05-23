import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parserHeaders } from '../helpers/headers'
import { createAxiosError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/utils'
import cookie from '../helpers/cookie'

export default function xhr<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
    return new Promise((resolve, reject) => {
        const {
            data = null,
            method = 'get',
            url,
            headers = {},
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfHeaderName,
            xsrfCookieName,
            onDownloadProcess,
            onUploadProcess,
            auth,
            validateStatus
        } = config

        // 创建一个请求
        const request = new XMLHttpRequest()
        // 打开一个请求
        request.open(method.toUpperCase(), url!, true)
        configureRequest()
        addEvent()
        processHeader()
        processCancel()
        // 发送
        request.send(data)

        function configureRequest(): void {
            // 当withCredentials=true的时候，当跨域请求的时候携带被请求域的cookies
            if (withCredentials) {
                request.withCredentials = withCredentials
            }

            if (isFormData(data)) {
                delete headers['Content-Type']
            }

            if (responseType) {
                request.responseType = responseType
            }
            if (timeout) {
                request.timeout = timeout
            }
        }

        function addEvent(): void {
            /**
             * 网络错误
             */
            request.onerror = function handleError() {
                reject(createAxiosError('Network Error !', config, null, request))
            }

            if (onDownloadProcess) {
                request.onprogress = onDownloadProcess
            }

            if (onUploadProcess) {
                request.upload.onprogress = onUploadProcess
            }

            /**
             * 超时错误
             */
            request.ontimeout = function handleTimeout() {
                reject(
                    createAxiosError(
                        `Network time out at ${timeout}`,
                        config,
                        'ECONNABORTED',
                        request
                    )
                )
            }

            request.onreadystatechange = function handleStateChang() {
                if (request.readyState !== 4) {
                    return
                }
                if (request.status === 0) {
                    return
                }
                // 响应头
                const responseHeader = parserHeaders(request.getAllResponseHeaders())
                const responseData =
                    responseType !== 'text' ? request.response : request.responseText
                const response: AxiosResponse = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeader,
                    config,
                    request
                }

                handleResponse(response)
            }
        }

        function processHeader(): void {
            /**
             * 添加请求头
             */
            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const cookieValue = cookie.read(xsrfCookieName)
                if (cookieValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = cookieValue
                }
            }

            if (auth) {
                headers['Authorization'] = 'Basic' + btoa(`${auth.username}:${auth.password}`)
            }

            /**
             * 设置请求头
             */
            Object.keys(headers).forEach(name => {
                // 如果data没传此时有content-type,则删除此content-type
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }
            })
        }

        function processCancel(): void {
            // 如果配置了cancelToken 当调用resolve后则执行此代码取消axios请求
            if (cancelToken) {
                cancelToken.promise
                    .then(reason => {
                        request.abort()
                        reject(reason)
                    })
                    // tslint:disable-next-line:no-empty
                    .catch(() => {})
            }
        }

        function handleResponse(response: AxiosResponse): void {
            // 没传递这个自定义合法状态码或者符合要求则resolve
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response)
            } else {
                reject(
                    createAxiosError(
                        `Request fail width status code ${response.status}`,
                        config,
                        null,
                        request,
                        response
                    )
                )
            }
        }
    })
}
