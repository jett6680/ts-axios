// import axios from '../../src/index'
// interface ResponseData<T = any> {
//     code: number
//     result: T
//     message: string
// }
//
// interface User {
//     name: string
//     age: number
// }
//
//
// function getUser<T>() {
//     return axios<ResponseData<T>>('/extend/user').then(res => res.data)
//         .catch(err => console.error(err))
// }
//
//
// async function test() {
//     const user = await getUser<User>()
//     if (user) {
//         console.log(user.result.name)
//     }
// }
//
// test()
// // axios({
// //     url: '/extend/post',
// //     method: 'post',
// //     data: {
// //         msg: 'hi'
// //     }
// // })
// //
// // axios("/extend/post",{
// //     method: 'post',
// //     data: {
// //         msg: 'hi'
// //     }
// // })
//
// // axios.request({
// //     url: '/extend/post',
// //     method: 'post',
// //     data: {
// //         msg: 'hello'
// //     }
// // })
//
// // axios.get('/extend/get')
// //
// // axios.options('/extend/options')
// //
// // axios.delete('/extend/delete')
// //
// // axios.head('/extend/head')
// //
// // axios.post('/extend/post', { msg: 'post' })
// //
// // axios.put('/extend/put', { msg: 'put' })
// //
// // axios.patch('/extend/patch', { msg: 'patch' })
import axios from '../../src/index'

axios.interceptors.request.use(config => {
    config.headers.test += '1'
    return config
})
axios.interceptors.request.use(config => {
    config.headers.test += '2'
    return config
})
axios.interceptors.request.use(config => {
    config.headers.test += '3'
    return config
})

axios.interceptors.response.use(res => {
    res.data += '1'
    return res
})
let interceptor = axios.interceptors.response.use(res => {
    res.data += '2'
    return res
})
axios.interceptors.response.use(res => {
    res.data += '3'
    return res
})

axios.interceptors.response.eject(interceptor)

axios({
    url: '/extend/post',
    method: 'post',
    headers: {
        test: ''
    }
}).then((res) => {
    console.log(res.data)
})
