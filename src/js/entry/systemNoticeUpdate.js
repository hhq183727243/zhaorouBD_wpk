import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import tool from '../tool.js';//工具包
import ajax from '../server';
const weui = require('../lib/weui.min.js');

vue_cpnt(Vue);

new Vue({
    el: '#mainApp',
    data: {
        navigation : 'system_notice',
        id: '',
        entity: {
            title: '',
            content: '',
            is_publish: 0
        }
    },
    computed: {
        
    },
    methods: {
        getDetail: function(){
            ajax.getJSON(`/api/get_system_notice_detail?id=${this.id}`,(res) => {
                for(let key in this.entity){
                    this.entity[key] = res.data.entity[key];
                }

                this.entity.image = !this.entity.image ? [] : this.entity.image.split('#');
            });
        },
        
        //更新状态
        submitForm: function(){
            this.validate(['entity.title','entity.content'],() => {
                window.load = weui.loading('提交中...');

                //更新
                if(this.id != ''){
                    this.entity.id = this.id;

                    ajax.postJSON('/api/upd_system_notice',this.entity,(res) => {
                        window.location.href = '/page/systemNoticeDetail.html?id=' + this.id;
                    });
                }else{
                    ajax.postJSON('/api/add_system_notice',this.entity,(res) => {
                        window.location.href = '/page/systemNoticeDetail.html?id=' + res.data;
                    });
                }
            });
        }
    },
    mounted: function(){
        this.$nextTick(() => {
            let id = tool.getQueryString('id');

            if(id != undefined){
                this.id = id;
                this.getDetail();
            }
        })
    }
});