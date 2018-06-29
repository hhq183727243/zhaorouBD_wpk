import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件
import tool from '../tool.js';//工具包

vue_cpnt(Vue);

init_list_app({
    data: {
        navigation: 'system_notice'
    },
    sortField: 'displayIndex',//默认排序
    listUrl: '/api/get_system_notice_list',
    updateStatusUrl: '/api/upd_system_notice_status',
    deleteUrl: '/api/del_system_notice'
},Vue);