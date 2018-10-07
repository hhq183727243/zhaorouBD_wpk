import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import tool from '../tool.js';//工具包
import ajax from '../server';

vue_cpnt(Vue);

new Vue({
    el: '#mainApp',
    data: {
        navigation : 'rou_goods',
        rejectLayer: false,
        reject_reason: '',//审核未通过理由
        id: null,
        entity: {

        }
    },
    computed: {
        goods_type (){
            let type = this.entity.type || 0;
            let typeName = ['普通商品','预告肉单','常规肉单'];

            return typeName[parseInt(type) - 1];
        }
    },
    methods: {
        updateField: function(field,val){
            if(field == 'status' && val == 2){
                this.rejectLayer = true;
            }else{
                ajax.postJSON('/api/upd_rou_goods_status',{
                    id: this.id,
                    val,
                    field
                }, res => {
                    location.reload();
                });
            }
        },
        onReject: function(){
            if(this.reject_reason.length == 0){
                alert('请输入拒绝理由');
                return; 
            }
            ajax.postJSON('/api/upd_rou_goods_status',{
                id: this.id,
                field: 'status',
                val: 2,
                reject_reason: this.reject_reason
            }, res => {
                location.reload();
            });
        },
        getDetail: function(){
            ajax.getJSON(`/api/get_rou_goods_detail?id=${this.id}`,(res) => {
                this.entity = res.data.entity;
            });
        }
    },
    mounted: function(){
        this.$nextTick(() => {
            let id = tool.getQueryString('id');
            this.id = id;
            this.getDetail();
        })
    }
});