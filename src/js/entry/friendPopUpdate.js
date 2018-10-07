import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import init_list_app from '../vue-list.js';//引入全局组件
import tool from '../tool.js';//工具包
import ajax from '../server';
const weui = require('../lib/weui.min.js');
const Upload = require('../hhq-upload.js');

vue_cpnt(Vue);

new Vue({
    el: '#mainApp',
    data: {
        navigation : tool.getQueryString('type') + '_goods',
        id: '',
        goods_id: '',
        entity: {
            key_id: tool.getQueryString('key_id'),
            type: tool.getQueryString('type'),
            id: '',
            goods_id: '',
            content: '',
            market_image: 'img/default.jpg',
            image: []
        }
    },
    computed: {
        
    },
    methods: {
        //上传图片
        handleFileChange: function(e){
            var that = this;

            that.entity.market_image = '../img/loading.gif';

            Upload.triggerUpload(e.target.files);

            Upload.config.success = function(res){
                that.entity.market_image = res.data;
            };
        },
        //删除图片
        uploadAttachment: function(e){
            var that = this;

            Upload.triggerUpload(e.target.files);

            Upload.config.success = function(res){
                that.entity.image.push(res.data);
            };
        },
        deleteAttachment: function(index){
            this.entity.image.splice(index,1);
        },
        getDetail: function(){
            ajax.getJSON(`/api/get_friendpop_detail?id=${this.id}`,(res) => {
                for(let key in this.entity){
                    this.entity[key] = res.data.entity[key];
                }

                this.entity.image = !this.entity.image ? [] : this.entity.image.split('#');
            });
        },
        
        //更新状态
        submitForm: function(){
            this.validate(['entity.content','entity.market_image','entity.image'],() => {
                window.load = weui.loading('提交中...');

                //更新
                if(this.id != ''){
                    ajax.postJSON('/api/upd_friendpop',this.entity,(res) => {
                        history.go(-1);
                    });
                }else{
                    this.entity.goods_id = this.goods_id;
                    
                    ajax.postJSON('/api/add_friendpop',this.entity,(res) => {
                        history.go(-1);
                    });
                }
            });
        }
    },
    mounted: function(){
        this.$nextTick(() => {
            let id = tool.getQueryString('id');
            let goods_id = tool.getQueryString('goods_id');

            if(id != undefined){
                this.id = id;
                this.getDetail();
            }

            if(goods_id != undefined){
                this.goods_id = goods_id;
            }
        })
    }
});