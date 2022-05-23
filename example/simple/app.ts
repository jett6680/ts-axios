import axios from '../../src'
axios({
    url:'/simple/get',
    method:'get',
    params:{
        a:1,
        b:2
    }
})
