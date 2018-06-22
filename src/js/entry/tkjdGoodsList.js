/***
 * 淘客基地接口数据管理
*/

import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件

vue_cpnt(Vue);

init_list_app({
    sortField: 'displayIndex',//默认排序
    listUrl: '/api/get_tkjd_goods_list',
    listData: {
        type (){
            return this.classifyList[this.currentIndex].type || 'classify';
        },
        cid (){
            return this.classifyList[this.currentIndex].cid;
        }
    },
    type: 0,
    data: {
        navigation : 'tkjd_goods',
        cid: 0,
        currentIndex: 0,
        classifyList: [{
                cid: 0,
                type: 'www_lingquan',
                name: '全部',
            },{
                cid: 0,
                type: 'jhs',
                name: '聚划算'
            },{
                cid: 0,
                type: 'tqg',
                name: '淘抢购'
            },{
                cid: 0,
                type: 'dapai',
                name: '大牌推荐'
            },{
                cid: 1,
                name: '女装',
            }, {
                cid: 2,
                name: '男装',
            }, {
                cid: 3,
                name: '内衣',
            }, {
                cid: 4,
                name: '母婴',
            }, {
                cid: 5,
                name: '美妆',
            }, {
                cid: 6,
                name: '居家',
            }, {
                cid: 7,
                name: '鞋包配饰',
            }, {
                cid: 8,
                name: '美食',
            }, {
                cid: 9,
                name: '文体车品',
            }, {
                cid: 10,
                name: '数码家电',
            }, {
                cid: 11,
                name: '运动户外',
            }, {
                cid: 12,
                name: '其他',
            }
        ]
    },
    methods: {
        changeType: function(item,index){
            this.currentIndex = index;
            this.cid = item.cid;
            
			this.getList(1);
		}
    },
    searchUrl: 'production/list_keyword.do',
    searchData: {
        sellerId: '${sessionScope.defaultSeller.id}',
        column1: 'production'
    },
    updateStatusUrl: '/api/upd_friendpop_status',
    deleteUrl: '/api/del_friendpop'
},Vue);