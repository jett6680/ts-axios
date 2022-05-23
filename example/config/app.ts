import axios, { AxiosTransformer } from '../../src'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 11111;

// axios({
//     url: '/extend/post',
//     method: 'post',
//     data:{
//         a:1
//     },
//     headers: {
//         test: '321'
//     },
//     transformRequest:function(data) {
//         return data;
//     },
//     transformResponse:function(data) {
//         return data;
//     }
// }).then((res) => {
//     console.log(res.data)
// })

const instance = axios.create({
    headers: {
        test: '321'
    },
    transformRequest:function(data) {
        return data;
    },
    transformResponse:function(data) {
        return data;
    }
})

instance({
    url: '/extend/post',
    method: 'post',
    data:{
        a:1
    },
}).then(resp => {
    console.log(resp)
})

const geta = function() {
    return axios.get('/text1')
}
const getb = function() {
    return axios.get('/text2')
}

axios.all([geta(),getb()]).then(axios.spread(function(res1,res2) {
    console.log(res1,res2);
}))
