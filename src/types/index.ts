export type METHOD =
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'options'
    | 'head'
    | 'patch'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD'
    | 'PATCH'

export interface AxiosRequestConfig {
    url?: string
    method?: METHOD
    params?: any
    data?: any
    headers?: any
    responseType?: XMLHttpRequestResponseType
    timeout?: number
    transformRequest?: AxiosTransformer | AxiosTransformer[]
    transformResponse?: AxiosTransformer | AxiosTransformer[]
    cancelToken?: CancelToken
    withCredentials?: boolean
    xsrfCookieName?: string
    xsrfHeaderName?: string
    onDownloadProcess?: (e: ProgressEvent) => void
    onUploadProcess?: (e: ProgressEvent) => void
    auth?: AxiosBaseWithCredentials
    validateStatus?: (val: number) => boolean
    paramsSerializer?: (val: any) => string // 自定义params解析规则
    baseUrl?: string
    [propName: string]: any
}

/**
 * 返回的接口
 */
export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any
}

export interface AxiosPromise<T> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any
    response?: AxiosResponse
}

export interface Axios {
    defaults: AxiosRequestConfig
    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }
    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
    getUri(config?: AxiosRequestConfig): string
}

export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
    create(config: AxiosRequestConfig): AxiosInstance
    CancelToken: CancelTokenStatic
    Cancel: CancelStatic
    isCancel: (val: any) => boolean
    all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
    spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
    Axios: AxiosClassStatic
}

export interface AxiosClassStatic {
    new (config: AxiosRequestConfig): Axios
}

export interface ResolvedFn<T> {
    (val: T): T | Promise<T>
}

export interface RejectedFn {
    (error: any): any
}

export interface AxiosInterceptorManager<T> {
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
    eject(id: number): void
}

export interface AxiosTransformer {
    (data: any, headers?: any): any
}

// 取消请求执行的回调函数
export interface Canceler {
    (message?: string): void
}

export interface CancelExecutor {
    (canceler: Canceler): void
}

export interface CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel
    throwIfRequested(): void
}

export interface CancelTokenSource {
    token: CancelToken
    cancel: Canceler
}
export interface CancelTokenStatic {
    new (executor: CancelExecutor): CancelToken

    source(): CancelTokenSource
}

export interface Cancel {
    message?: string
}

export interface CancelStatic {
    new (message?: string): Cancel
}

export interface AxiosBaseWithCredentials {
    username: string
    password: string
}
