/***
 * 大淘客接口数据管理
*/
import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件
const ajax = require('../server.js');
const weui = require('../lib/weui.min.js');

vue_cpnt(Vue);

init_list_app({
    sortField: 'displayIndex',//默认排序
    listUrl: '/api/get_dtk_goods_list',
    listData: {
        type: 0,
        cid (){
            return this.cid;
        }
    },
    type: 0,
    data: {
        navigation : 'dtk_goods',
        cid: 0,
        currentIndex: 0,
        classifyList: [{
                cid: 0,
                name: '全部',
            }, {
                cid: 1,
                name: '女装',
            }, {
                cid: 9,
                name: '男装',
            }, {
                cid: 5,
                name: '鞋品',
            }, {
                cid: 11,
                name: '箱包',
            }, {
                cid: 2,
                name: '母婴',
            }, {
                cid: 3,
                name: '美妆',
            }, {
                cid: 10,
                name: '内衣',
            }, {
                cid: 12,
                name: '配饰',
            }, {
                cid: 6,
                name: '美食',
            }, {
                cid: 8,
                name: '数码家电',
            }, {
                cid: 4,
                name: '居家日用',
            }, {
                cid: 14,
                name: '家装家纺',
            }, {
                cid: 7,
                name: '文娱车品',
            }, {
                cid: 13,
                name: '户外运动',
            }
        ]
    },
    methods: {
        changeType: function(item,index){
            this.currentIndex = index;
            this.cid = item.cid;
            
			this.getList(1);
        },
        deleteEntity: function(item,index){
			weui.confirm('确认屏蔽？',()=> {
				ajax.getJSON('/api/del_dtk_goods?id=' + item.GoodsID,(res) => {
					weui.toast('操作成功',1000);

                    item.is_delete = 1
				});
			});
        },
        cancelDeleteEntity (item,index){
            ajax.getJSON('/api/cancel_del_dtk_goods?id=' + item.GoodsID,(res) => {
                weui.toast('操作成功',1000);

                item.is_delete = 0
            });
        }
    },
    deleteUrl: '/api/del_dtk_goods'
},Vue);