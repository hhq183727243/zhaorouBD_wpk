import Vue from "vue";//引入vue
import vue_cpnt from '../vue.cpnt.js';//引入全局组件
import tool from '../tool.js';//工具包
import ajax from '../server';
const weui = require('../lib/weui.min.js');
const Upload = require('../hhq-upload.js');
window.jQuery = $;
const datepicker = require('../lib/bootstrap-datetimepicker.min.js');
import '../../assets/css/bootstrap-datetimepicker.min.css';

vue_cpnt(Vue);

new Vue({
    el: '#mainApp',
    data: {
        navigation : 'rou_goods',
        id: null,
        classList: '',
        date: '',
        time: '',
        startTime_hh_mm: '',
        timeList: ['09:00','09:10','09:20','09:30','09:40','09:50','10:00','10:10','10:20','10:30','10:40','10:50','11:00'],
        entity: {
            id: '',
            type: 1,
            cid: '',
            start_time: '',
            goods_url: 'https://detail.tmall.com/item.htm?id=', 
            goods_name: '', 
            yugao_pic: 'img/default.jpg',
            yugao_introd: '',
            price: '',
            price_after_coupons: '',
            rate: '',
            quan_guid_content: '',
            quan_link: 'https://uland.taobao.com/quan/detail?sellerId=3908762108&activityId=',
            price_coupons: '',
            quan_shengyu: '',
            market_pic: 'img/default.jpg',
            pic: 'img/default.jpg',
            zhibo_pic1: 'img/default.jpg',
            zhibo_introd1: '',
            zhibo_pic2: 'img/default.jpg',
            zhibo_introd2: '',
            zhibo_pic3: 'img/default.jpg',
            zhibo_introd3: '',
            zhibo_time: ''
        }

    },
    computed: {
        
    },
    methods: {
        //上传图片
        handleFileChange: function(e,name){
            var that = this;

            that.entity[name] = '../img/loading.gif';
            Upload.triggerUpload(e.target.files);

            Upload.config.success = function(res){
                that.entity[name] = res.data;
            };
        },
        getDetail: function(){
            ajax.getJSON(`/api/get_rou_goods_detail?id=${this.id}`,(res) => {
                for(let key in this.entity){
                    this.entity[key] = res.data.entity[key];
                }

                this.data.val(res.data.entity.zhibo_time.split(' ')[0]);
                this.time = (res.data.entity.zhibo_time.split(' ')[1]);

                $("#startTime").val(res.data.entity.start_time)
            });
        },

        getClassList (){
            ajax.getJSON(`/api/get_class_list`,(res) => {
                this.classList = res.data.list;

                if(this.id != null){
                    this.getDetail();
                }
            });
        },
        
        //更新状态
        submitForm: function(){
            //this.validate(['entity.content','entity.market_image','entity.image'],() => {
                window.load = weui.loading('提交中...');

                if(this.entity.type == 2){
                    this.entity.zhibo_time = $("#zhibo_time").val() + ' ' + this.time;
                }else{
                    this.entity.zhibo_time = null;
                }

                this.entity.start_time = $("#startTime").val();

                //更新
                if(this.id != null){
                    ajax.postJSON('/api/upd_rou_goods',this.entity,(res) => {
                        location.href = `/page/rouGoodsDetail.html?id=${this.id}`;
                    });
                }else{
                    ajax.postJSON('/api/add_rou_goods',this.entity,(res) => {
                        location.href = `/page/rouGoodsDetail.html?id=${res.data.id}`;
                    });
                }
            //});
        }
    },
    mounted: function(){
        this.$nextTick(() => {
            let id = tool.getQueryString('id');
            
            this.getClassList();

            if(id != null){
                this.id = id;
            }

            var today = new Date();

            $("#startTime").datetimepicker({
                format: 'yyyy-mm-dd',
                startDate: new Date(),
                endDate: new Date(today.getTime() + 3600 * 24 * 7 * 1000),
                maxView: 1,
                minView: 0,
                format: 'yyyy-mm-dd hh:ii',
                language: 'zh-CN',
                minuteStep: 10,
                //clearBtn: true,
                autoclose: true,
                todayHighlight: true,
            });

            this.data = $("#zhibo_time").datetimepicker({
                format: 'yyyy-mm-dd',
                startDate: new Date(),
                endDate: new Date(today.getTime() + 3600 * 24 * 7 * 1000),
                maxView: 1,
                minView: 2,
                language: 'zh-CN',
                //clearBtn: true,
                autoclose: true,
                todayHighlight: true,
            });
        })
    }
});

$.fn.datetimepicker.dates['zh-CN'] = {
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    today: "今天",
    suffix: [],
    meridiem: ["上午", "下午"]
};