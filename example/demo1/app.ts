import axios from "../../src";
//
// axios({
//     method:'get',
//     url:'/demo1/test',
//     params:{
//         value:['bar','foo']
//     }
// })
// axios({
//     method:'get',
//     url:'/demo1/test',
//     params:{
//         value:'ceshi'
//     }
// })
// axios({
//     method:'get',
//     url:'/demo1/test',
//     params:{
//         value:{
//             name:1,
//             age:2
//         }
//     }
// })
// axios({
//     method:'get',
//     url:'/demo1/test/#id',
//     params:{
//         value:{
//             name:1,
//             age:2
//         }
//     }
// })
//
// axios({
//     method:'get',
//     url:'/demo1/test?id=2',
//     params:{
//         value:{
//             name:1,
//             age:2
//         }
//     }
// })
//
// axios({
//     method:'get',
//     url:'/demo1/test/#id',
//     params:{
//         value:'#@. :'
//     }
// })

axios({
    method:'post',
    url:'/demo1/post',
    headers:{
        'content-type':'application/json',
        'Accept':'/TEST'
    },
    data:{
        a:1,
        b:2,
        c:['a','b','c']
    }
}).then(res => {
    console.log(res)
})

const arr = new Int32Array([21,31]);

axios({
    method:'post',
    url:'/demo1/post-arr',
    responseType:'json',
    data:arr
}).then(res => {
    console.log(res)
})
