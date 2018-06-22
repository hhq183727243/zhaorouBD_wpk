//Vue 注册全局过滤器，全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面  

//import Vue from "Vue";
const ajax = require('./server.js');
const weui = require('./lib/weui.min.js');

//时间格式化工具
Date.prototype.format = function(format){
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
	};
	
	if(/(y+)/.test(format)){
		format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	
	for(var k in o){
		if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}
	return format;
};

//全局组件，因此注册组件的vue应该可以实例化app的vue是同一个
module.exports = function(Vue){
	Vue.filter('dataFilter', function(value) {   
		if(!value){
			return '';
		}
		return (new Date(value.replace(/-/g,'/'))).format('yyyy-MM-dd hh:mm');  
	});

	Vue.filter('imgFilter', function(value) {   
		if(value == undefined || value == '' || value == null || value.indexOf('http') > -1){
			return value;
		}

		if(location.origin.indexOf(':3002') > -1){
			return location.origin + '/' + value;
		}else{
			return location.origin + ':3002/' + value;
		}		
	});

	Vue.prototype.validate = function(fields,success){
		var len = fields.length;

		for(var i = 0;i < len; i++){
			var keys = fields[i].split('.'),
				val = this;

			keys.forEach((it,idx) => {
				val = val[it]
			});

			if(val == undefined || val == ''){
				if(fields[i].indexOf('picture') > -1){
					weui.alert('请上传封面图');
				}else{
					weui.alert('星号必填项不能为空');
				}
				
				return false;
			}
		}

		if(typeof success == 'function') success();

		return true;
	};

	Vue.component('header-cpt',{
		template: `<div class="navbar navbar-default" id="navbar">
			<div class="navbar-container" id="navbar-container">
				<div class="navbar-header pull-left">
					<a href="#" class="navbar-brand">
						<small>
							<i class="icon-leaf"></i>找肉APP后台管理系统
						</small>
					</a><!-- /.brand -->
				</div><!-- /.navbar-header -->
				<div class="navbar-header pull-right" role="navigation">
					<ul class="nav ace-nav">
						<li class="purple" v-if="countUnreadBulletin > 0">
							<a data-toggle="dropdown" class="dropdown-toggle" href="bulletin/list.html?navigation=bulletin">
								<i class="icon-bell-alt icon-animated-bell"></i>
								<span class="badge badge-important">{{countUnreadBulletin}}</span>
							</a>
						</li>
		
						<li class="light-blue" :class="{open: toggleMenu}">
							<a class="dropdown-toggle" @click="toggleMenuTap">
								<img class="nav-user-photo" height="40" width="40" src="../img/avatar.png">
								<span class="user-info">
									<small>欢迎您</small>{{user.username}}
								</span>
								<i class="icon-caret-down"></i>
							</a>
		
							<ul class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
								<li>
									<a href="javascript:void(0);" @click="updPassword">
										<i class="icon-lock"></i>修改密码
									</a>
								</li>
		
								<li class="divider"></li>
								<li>
									<a href="javascript:void(0);" @click="logout">
										<i class="icon-off"></i>退出登录
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</div>`,
		data (){
			return {
				toggleMenu: false,
				user: {},
				countUnreadBulletin: 0
			}
		},
		methods: {
			//退出登录
			logout: function(){
				ajax.getJSON('/api/logout',(res) => {
					localStorage.removeItem('admin');
					location.href = '/page/login.html';
				});
			},
			toggleMenuTap: function(){
				this.toggleMenu = !this.toggleMenu;
			},
			//获取未读消息数
			updPassword: function(){
				weui.confirm('<div id="tempApp"><input type="password" maxlength="20" v-model="password" placeholder="password"/></div>',() => {
					if(layerApp.password == ''){
						weui.alert('密码不能为空');
					}else{
						ajax.postJSON('/api/upd_password',{
							password: layerApp.password
						},(res) => {
							weui.toast('修改成功',1500);
							layerApp = null;
						});
					}
				},() => {},{title: '修改密码'});

				var layerApp = new Vue({
					el: '#tempApp',
					data: {
						password: ''
					}
				})
			},
			initUserDetail: function(){
				var userStr = localStorage.getItem('admin');

				if(!!userStr){
					try{
						this.user = JSON.parse(userStr);
					}catch(e){
						console.log('字符串转json失败');
					}
				}
			}
		},
		mounted: function(){
			this.$nextTick(() => {
				this.initUserDetail();
			})
		}
	});

	Vue.component('leftnav-cpt',{
		props: ['navigation'],
		template: `<div class="sidebar">
			<ul class="nav nav-list">
				<li :class="{'active': navigation == 'dtk_goods'}">
					<a href="/page/dtkGoodsList.html">
						<i class="icon-bookmark"></i>
						<span class="menu-text">实时榜单文案管理</span>
					</a>
				</li>
				<li :class="{'active': navigation == 'tkjd_goods'}">
					<a href="/page/tkjdGoodsList.html">
						<i class="icon-bookmark"></i>
						<span class="menu-text">整站商品文案管理</span>
					</a>
				</li>
				<li :class="{'active': navigation == 'user'}">
					<a href="/page/userList.html">
						<i class="icon-user"></i>
						<span class="menu-text">用户管理</span>
					</a>
				</li>
			</ul>
		</div>`,
		data (){
			return {

			}
		},
		methods: {
			toggleSubmenu: function(section){
				this.navigation = section;
			}
		}
	});

	Vue.component('address-cpt',{
		props : ['value'],
		template: '<div>' + 
			'<input type="hidden" :value="value"/>' +
			'<select v-model="province" @change="changeValue($event.target.value,1)">' + 
				'<option v-for="item in provinceList" :value="item.name">{{item.name}}</option>' +
			'</select>' +
			'<select v-model="city" @change="changeValue($event.target.value,2)">' + 
				'<option v-for="item in cityList" :value="item.name">{{item.name}}</option>' +
			'</select>' +
			'<select v-model="district" @change="changeValue($event.target.value,3)">' + 
				'<option v-for="item in districtList" :value="item.name">{{item.name}}</option>' +
			'</select>' +
		'</div>',
		data: function(){
			return {
				provinceList: [],
				cityList: [],
				districtList: [],
				region: [],
				province: '',
				city: '',
				district: ''
			}
		},
		watch: {
			value: function(region){
				this.region = region;

				this.getListData(1);
			}
		},
		methods: {
			changeValue: function (value,flag) {
				// 通过 input 事件带出数值
				//this.$emit('input',value);
				if(flag == 1){
					this.getCityList(this.getId(this.provinceList ,value));

					this.region = [value,'',''];
				}else if(flag == 2){
					this.getDistrictList(this.getId(this.cityList ,value));

					this.region = [this.region[0],value,''];
				}else{
					this.region = [this.region[0],this.region[1],value];

					this.$emit('selected',this.region);
				}
			},
			getId: function(arr,value){
				var id = '';
				arr.forEach((item,index) => {
					if(item.name == value){
						id = item.id;
					}
				});

				return id;
			},
			getListData: function (parentId) {
				ajax.postJSON('dictionary/list_location_superior.do', { id: parentId }, (res) => {
					this.provinceList = res.data.list;
					this.province = this.region[0];
					this.region[0] = this.province;

					var id = this.getId(this.provinceList,this.region[0]) || this.provinceList[0].id;

					this.getCityList(id)
				});
			},
			getCityList: function(parentId){
				ajax.postJSON('dictionary/list_location_superior.do', { id: parentId }, (res) => {
					this.cityList= res.data.list;
					this.city = this.region[1] || this.cityList[0].name;
					this.region[1] = this.city;

					var id = this.getId(this.cityList,this.region[1]) || this.cityList[0].id;

					this.getDistrictList(id)
				});
			},
			getDistrictList: function(parentId){
				ajax.postJSON('dictionary/list_location_superior.do', { id: parentId }, (res) => {
					this.districtList= res.data.list;
					this.district = this.region[2] || this.districtList[0].name;
					this.region[2] = this.district;

					this.$emit('selected',this.region);
				});
			}
		},
		mounted: function(){
			this.$nextTick(() => {
				//获取省
				//this.getListData(1);
			})
		}
	});

	//分页组件
	Vue.component('page-cpt',{
		props : ['pages','current'],
		template : '<div class="text-center" v-if="pages > 0">' +
			'<ul class="pagination">' + 
				'<li :class="{disabled : current === 1}"><a @click="changePage(1)" :href="href">首页</a></li>' +
				'<li :class="{disabled : current === 1}"><a @click="changePage(current - 1)" :href="href">上一页</a></li>' +
				'<template v-for="n in pages > 10 ? 10 : pages">' +
				'<li v-if="current > 5 &&　current <= pages - 5"><a @click="changePage(n + current - 5)" :class="{current_page : current === n + current - 5}" :href="href">{{n + current - 5}}</a></li>' +
				'<li v-if="current > 5 &&　current > pages - 5"><a @click="changePage(n + pages - 10)" :class="{current_page : current === n + pages - 10}" :href="href">{{n + pages - 10}}</a></li>' +
				'<li v-if="current <= 5"><a @click="changePage(n)" :class="{current_page : current === n}" :href="href">{{n}}</a></li>' +
				'</template>'+

				'<li :class="{disabled : current === pages}"><a @click="changePage(current + 1)" :href="href">下一页</a></li>' +
				'<li :class="{disabled : current === pages}"><a @click="changePage(pages)" :href="href">末页</a></li>' +
				'<li class="disabled"><a :href="href">共{{current}}/{{pages}}页</a></li>' +
			'</ul>' +
		'</div>',
		
		methods : {
			//跳转页面
			changePage : function(cPage){
				if(cPage < 1 || cPage > this.pages){
					return;
				}
				
				//this.current = cPage;
				var a = this.$emit('switch',cPage);
			}
		},
		data : function(){
			return { 
				href : 'javascript:void(0);',
				//current : this.pageChosen
			};
		}
	});

	Vue.component('input-cpt',{
		props: {
			label: {required: true},
			value: {},
			type: { default: 'text'},
			//是否必填
			rq: {
				type: Boolean,
				default: false
			},
			max: { 
				type: Number,
				default: 100
			},
		},
		template: '<div class="profile-info-row">' +
			'<div class="profile-info-name"><span v-if="rq" class="required">*</span>{{label}}</div>' +
			'<div class="profile-info-value">' +
				'<textarea v-if="type == \'textarea\'" :maxLength="max" :value="value" v-on:input="updateValue($event.target.value)" :placeholder="\'请输入\' + label"></textarea>' +
				'<input v-else :type="type" :maxLength="max" ref="input" :value="value" v-on:input="updateValue($event.target.value)" :placeholder="\'请输入\' + label">' +
			'</div>' +
		'</div>',
		methods: {
			updateValue: function (value) {
				// 通过 input 事件带出数值
				this.$emit('input',value)
			}
		}
	});

	Vue.component('select-cpt',{
		props: {
			label: {required: true},
			value: {},
			options: Array,
			//是否必选
			rq: {
				type: Boolean,
				default: false
			},
			isobj: { default: true}
		},
		computed: {
			myOptions: function () {
				return this.options;
			},
			initVal: function(){
				return this.value;
			}
		},
		template: '<div class="profile-info-row">' +
			'<div class="profile-info-name"><span v-if="rq" class="required">*</span>{{label}}</div>' +
			'<div class="profile-info-value">' +
				'<select :value="value" v-on:change="updateValue($event.target.value)">' +
					'<option disabled value="">{{"请选择" + label}}</option>' +
					'<option v-for="item in myOptions" :value="isobj ? item.name : item">{{isobj ? item.name : item}}</option>' +
				'</select>' +
				'<span v-if="isobj"><a class="ml10" @click="addDictionary">新增选项</a></span>' +
			'</div>' +
		'</div>',
		methods: {
			updateValue: function (value) {
				// 通过 change 事件带出数值
				this.$emit('input',value)
			},
			addDictionary: function(){
				weui.confirm('<div id="tempApp"><input type="text" maxlength="20" v-model="name"/></div>',() => {
					if(layerApp.name == ''){
						weui.alert('分类名不能为空');
					}else{
						ajax.postJSON('dictionary/add.do',{
							type: this.label,
							name: layerApp.name
						},(res) => {
							weui.toast('添加成功',1000);
							this.myOptions.push(res.data.data);
							layerApp = null;
						});
					}
				},() => {},{title: '添加数据'});

				var layerApp = new Vue({
					el: '#tempApp',
					data: {
						name: ''
					}
				})
			}
		}
	});

	Vue.component('info-cpt',{
		props: ['label','info'],
		template: '<div class="profile-info-row">' +
			'<div class="profile-info-name">{{label}}</div>' +
			'<div v-if="info == 0" class="profile-info-value">0</div>' +
			'<div v-else class="profile-info-value" v-html="info || \'未填写\'"></div>' +
		'</div>'
	})


	//上传封面组件
	Vue.component('upload-cover-cpt',{
		props: {
			picture: {},
			btnText: {
				default: '上传图片'
			}
		},
		template: '<div>' +
			'<span class="profile-picture">' +
				'<img width="180" class="editable img-responsive" :src="picture || defaultPicture">' +
			'</span>' +
			'<div><a class="btn btn-info btn-upload">{{btnText}}<input @change="handleFileChange" type="file" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/></a></div>' +
		'</div>',
		data: function(){
			return {
				defaultPicture: 'images/default.jpg'
			}
		},
		methods: {
			handleFileChange: function (value) {
				// 通过 input 事件带出数值
				this.$emit('upload',value);
			}
		}
	})
};
