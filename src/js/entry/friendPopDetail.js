import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件
import tool from '../tool.js';//工具包
import ajax from '../server';
const weui = require('../lib/weui.min.js');

vue_cpnt(Vue);

new Vue({
    el: '#mainApp',
    data: {
        type: tool.getQueryString('type'),
        navigation: tool.getQueryString('type') + '_goods',
        id: '',
        entity: {

        }
    },
    computed: {
        discountPrice: function () {
            var price = parseFloat(this.entity.price,10),
                discount = parseFloat(this.entity.discount,10);

            if(!isNaN(price) && !isNaN(discount)){
                return Math.floor(price * discount / 10 * 100)/100;
            }else{
                return 0;
            }
        }
    },
    methods: {
        getDetail: function(){
            ajax.getJSON(`/api/get_friendpop_detail?id=${this.id}`,(res) => {
                this.entity = res.data.entity;

                this.entity.image = !this.entity.image ? [] : this.entity.image.split('#');
            });
        },
       //更新状态
        updateStatus: function(id,field,val,index){
            val = val ? 1 : 0;

            ajax.postJSON('/api/upd_friendpop_status',{
                id: id,
                field: field,
                val: val
            },(res) => {
                weui.toast('操作成功',1000);

                if(field == 'status'){
                    this.entity.status = val;
                }else{
                    this.entity.status = 1;
                    this.entity.is_adopt = val;
                }
            });
        },
    },
    mounted: function(){
        this.$nextTick(() => {
            let id = tool.getQueryString('id');
            this.id = id;
            this.getDetail();
        })
    }
});