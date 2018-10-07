import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件
import tool from '../tool.js';//工具包

vue_cpnt(Vue);

init_list_app({
    data: {
        navigation : 'user',
        parent_unionid: tool.getQueryString('parent_unionid') || 0
    },
    sortField: 'displayIndex',//默认排序
    listUrl: '/api/get_user_list',
    listData: {
        parent_unionid (){
            return this.parent_unionid
        }
    },
    methods: {
        changeType: function(item,index){
        
		}
    },
    deleteUrl: '/api/del_account'
},Vue);