import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件
import tool from '../tool.js';//工具包

vue_cpnt(Vue);

init_list_app({
    data: {
        type: tool.getQueryString('type'),
        goods_id: tool.getQueryString('goods_id'),
        navigation : tool.getQueryString('type') + '_goods'
    },
    sortField: 'displayIndex',//默认排序
    listUrl: '/api/get_friendpop_list',
    listData: {
        goods_id (){
            return tool.getQueryString('goods_id');
        }
    },
    searchUrl: 'production/list_keyword.do',
    searchData: {
        sellerId: '${sessionScope.defaultSeller.id}',
        column1: 'production'
    },
    updateStatusUrl: '/api/upd_friendpop_status',
    updateStatusCallback (field){
        if(field == 'is_adopt'){
            window.location.reload();
        }
    },
    deleteUrl: '/api/del_friendpop'
},Vue);