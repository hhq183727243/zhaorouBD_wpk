/***
 * 大淘客接口数据管理
*/
import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件

vue_cpnt(Vue);

init_list_app({
    sortField: 'displayIndex',//默认排序
    listUrl: '/api/get_rou_goods_list',
    listData: {
        cid (){
            return this.cid;
        },
        status (){
            return this.status;
        }
    },
    type: 0,
    data: {
        navigation : 'rou_goods',
        type: 1,
        cid: 0,
        status: 0,
        currentIndex: 0,
        classifyList: [{
                cid: 0,
                name: '全部',
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
        changeType: function(){
			this.getList(1);
        },
        changeCid: function(item,index){
            this.currentIndex = index;
            this.cid = item.cid;
            
			this.getList(1);
        }
    },
    deleteUrl: '/api/del_rou_goods'
},Vue);