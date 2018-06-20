import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件

vue_cpnt(Vue);

init_list_app({
    data: {
        navigation : 'user'
    },
    sortField: 'displayIndex',//默认排序
    listUrl: '/api/get_user_list',
    methods: {
        changeType: function(item,index){
        
		}
    },
    updateStatusUrl: '/api/upd_friendpop_status',
    deleteUrl: '/api/del_friendpop'
},Vue);