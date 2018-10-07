import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import tool from '../tool.js';//工具包
import ajax from '../server';
const Upload = require('../hhq-upload.js');

vue_cpnt(Vue);

new Vue({
    el: '#mainApp',
    data: {
        navigation : 'user',
        id: '',
        parentEntity: null,
        entity: {
            headimgurl: 'img/headimage.jpg',
            parent_unionid: 0,
            nickname: '',
            id: '',
            telephone: '',
            password: '',
            pid: '',
            tao_session: '',
            score: 0
        }
    },
    computed: {
        
    },
    methods: {
        //上传图片
        handleFileChange: function(e){
            var that = this;

            that.entity.headimgurl = 'img/loading.gif';

            Upload.triggerUpload(e.target.files);

            Upload.config.success = function(res){
                that.entity.headimgurl = res.data;
            };
        },
        getDetail: function(){
            ajax.getJSON(`/api/get_user_detail?id=${this.id}`,(res) => {
                for(let key in this.entity){
                    this.entity[key] = res.data.entity[key];
                }
            });
        },
        getParentDetail (unionid){
            ajax.getJSON(`/api/get_user_detail?unionid=${unionid}`,(res) => {
                this.parentEntity = res.data.entity;
            });
        },
        //更新状态
        submitForm: function(){
            this.entity.id = this.id;

            if(!!this.entity.id){
                ajax.postJSON('/api/upd_user',this.entity,(res) => {
                    history.go(-1);
                });
            }else{
                //添加子账号
                ajax.postJSON('/api/add_account',this.entity,(res) => {
                    location.href = '/page/userList.html?parent_unionid=' + this.entity.parent_unionid;
                });
            }
        }
    },
    mounted: function(){
        this.$nextTick(() => {
            let id = tool.getQueryString('id');
            let parent_unionid = tool.getQueryString('parent_unionid');

            if(id != undefined){
                this.id = id;
                this.getDetail();
            }

            //添加子账号
            if(parent_unionid != undefined){
                this.entity.parent_unionid = parent_unionid;

                this.getParentDetail(parent_unionid);
            }
        })
    }
});