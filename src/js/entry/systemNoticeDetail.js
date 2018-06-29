import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import tool from '../tool.js';//工具包
import ajax from '../server';

vue_cpnt(Vue);

new Vue({
    el: '#mainApp',
    data: {
        navigation: 'system_notice',
        id: '',
        entity: {

        }
    },
    methods: {
        getDetail: function(){
            ajax.getJSON(`/api/get_system_notice_detail?id=${this.id}`,(res) => {
                this.entity = res.data.entity;
            });
        }
    },
    mounted: function(){
        this.$nextTick(() => {
            let id = tool.getQueryString('id');

            if(id == parseInt(id)){
                this.id = parseInt(id);
                this.getDetail();
            }else{
                window.location.href = '/page/404.html'
            }
        })
    }
});