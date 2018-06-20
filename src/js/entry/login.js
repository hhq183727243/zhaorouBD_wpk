import Vue from "vue";//引入vue
import ajax from '../server.js';//引入ajax封装
import vue_cpnt from '../vue.cpnt.js';//引入全局组件

vue_cpnt(Vue);//初始化后组件，由于该组件是全局组件，因此注册组件的vue应该可以实例化app的vue是同一个

var loginVue = new Vue({
    el: '#loginVue',
    data: {
        username: '',
        password: ''
    },
    methods: {
        onLogin (){
            ajax.postJSON(`/api/login`,{
                username: this.username,
                password: this.password
            },(res) => {
                localStorage.setItem('admin',JSON.stringify(res.data.entity));
                location.href = '/page/dtkGoodsList.html'
            });
        }
    }
});