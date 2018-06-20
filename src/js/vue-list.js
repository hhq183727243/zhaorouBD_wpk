const ajax = require('./server.js');
const weui = require('./lib/weui.min.js');

module.exports = function(options,Vue){
	let data = {
		load: null,
		type: options.type || '',//筛选列表数据条件
		type2: options.type2 || '',//列表筛选条件，扩展项
		searchStatus: false,
		keyword: '',
		navigation: options.navigation || '',
		page: 1,
		pages: 1,
		pageSize: 20,
		sortField: options.sortField || 'datetime',
		sortType: options.sortType || false,//降序为true，增序为false
		list: []
	};

	let methods = {
		getSortClass: function(sortField){
			if(sortField != this.sortField){
				return {
					'sorting': true
				}
			}else{
				return {
					'sorting_desc': this.sortType,
					'sorting_asc': !this.sortType
				}
			}
		},
		//修改排序
		changeSort: function(sortField){
			if(this.sortField == sortField){
				this.sortType = !this.sortType;
			}else{
				this.sortField = sortField;
				this.sortType = true;
			}
			
			if(this.searchStatus){
				this.getSearchResult(1);
			}else{
				this.getList(1);
			}
		},

		//分页
		switchPage: function(page){
			if(this.searchStatus){
				this.getSearchResult(page);
			}else{
				this.getList(page);
			}
		},
		//搜索
		getSearchResult: function(page){
			var url = options.searchUrl;

			var postData = {
				keyword: this.keyword,
				page: page,
				pageSize: this.pageSize,
				sortField: this.sortField,
				sortType: this.sortType ? 'DESC' : 'ASC',//DESC
				secondSortField: 'datetime',
				secondSortType: 'DESC'//DESC
			};

			if(this.keyword == ''){
				this.getList(1);
				return;
			}

			if(typeof options.searchData == 'object'){
				for(var key in options.listData){
					if(typeof options.listData[key] == 'function'){
						postData[key] = options.listData[key].apply(this);
					}else{
						postData[key] = options.listData[key]
					}
				}
			}
			this.searchStatus = true;

			this.load = weui.loading('加载中...');

			ajax.postJSON(url,postData,(res) => {
				this.page = page;
				this.pages = res.data.pages;
				this.list = res.data.list;

				this.load.hide();
				
				$('.mian').animate({
					scrollTop: 0
				})
			});
		},
		//获取列表
		getList: function(page){
			var postData = {
				page: page,
				type: this.type,
				pageSize: this.pageSize,
				sortField: this.sortField,
				sortType: this.sortType ? 'DESC' : 'ASC',//DESC
				secondSortField: 'datetime',
				secondSortType: 'DESC'//DESC
			};

			if(typeof options.listData == 'object'){
				for(var key in options.listData){
					if(typeof options.listData[key] == 'function'){
						postData[key] = options.listData[key].apply(this);
					}else{
						postData[key] = options.listData[key]
					}
				}
			}

			this.searchStatus = false;

			this.load = weui.loading('加载中...');

			ajax.postJSON(options.listUrl,postData,(res) => {
				this.page = page;
				this.pages = res.data.pages;
				this.list = res.data.list;
				this.load.hide();
				$('.mian').animate({
					scrollTop: 0
				})
			});
		},
		deleteEntity: function(id,index){
			weui.confirm('确认删除？',()=> {
				ajax.getJSON(options.deleteUrl + '?id=' + id,(res) => {
					weui.toast('删除成功',1000);
					this.list.splice(index,1);

					if(typeof options.deleteCallback == 'function') options.deleteCallback.apply(this,[index]);
				});
			});
		},
		//更新状态
		updateStatus: function(id,field,val,index){
			ajax.postJSON(options.updateStatusUrl,{
				id: id,
				field: field,
				val: val ? 1 : 0
			},(res) => {
				weui.toast('操作成功',1000);
				this.list[index][field] = val;

				if(typeof options.updateStatusCallback == 'function') options.updateStatusCallback.apply(this,[field]);
			});
		},
		changeType: function(type){
			this.type = type;
			this.getList(1);
		}
	}

	Object.assign(data,options.data);
	
	Object.assign(methods,options.methods);

	var mainVue = new Vue({
		el: '#mainApp',
		data: data,
		computed: {
		  	test: function(){
			    return {

			    }
		  	}
		},
		methods: methods,

		mounted: function(){
			this.$nextTick(() => {
				this.getList(1);
			})
		}
	});

	return mainVue;
};