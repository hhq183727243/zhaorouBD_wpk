import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件

vue_cpnt(Vue);

function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 

init_list_app({
    data: {
        goods_id: getQueryString('goods_id'),
        navigation : 'goods'
    },
    sortField: 'displayIndex',//默认排序
    listUrl: '/api/get_friendpop_list',
    listData: {
        goods_id (){
            return getQueryString('goods_id');
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