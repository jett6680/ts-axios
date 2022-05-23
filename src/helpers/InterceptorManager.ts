import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T = any> {
    resolved: ResolvedFn<T>
    rejected?: RejectedFn
}

export default class InterceptorManager<T> {
    private interceptors: Array<Interceptor<T> | null>

    constructor() {
        this.interceptors = []
    }

    // 调用添加拦截器
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })

        return this.interceptors.length - 1
    }

    // 便利当前拦截器已经添加的函数
    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        this.interceptors.forEach(inter => {
            if (inter !== null) {
                fn(inter)
            }
        })
    }

    // 删除当前不需要执行的拦截器
    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}
