<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html lang="en">
<head>
	<base href="<%=basePath%>" />
	<meta charset="UTF-8">
	<title>后台管理系统</title>
	<meta name="keywords" content="" />
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- basic -->
	
	<%@include file="../common/link.jsp"%>
</head>

<body>
	<%@include file="../common/header.jsp"%>
	<%@include file="../common/leftNav.jsp"%>

	<div class="mian">
		<div class="breadcrumbs" id="breadcrumbs">
			<ul class="breadcrumb">
				<li>
					<i class="icon-picture home-icon"></i>
					<a href="production/list.html?navigation=production">商品管理</a>
				</li>
				<li class="active">新增/更新</li>
			</ul><!-- .breadcrumb -->
		</div>

		<div class="page-content" id="mainApp" v-cloak>
			<div class="page-header">
				<h1>{{id.length > 0 ? '更新信息' : '添加'}}</h1>
			</div>
			
			<div class="row">
				<div class="col-xs-12 col-sm-3 center">
					<upload-cover-cpt :picture="entity.picture" @upload="handleFileChange"></upload-cover-cpt>
				</div>

				<div class="col-sm-9">
					<div class="profile-user-info profile-user-info-striped">
						<input-cpt label="序号" v-model="entity.displayIndex"></input-cpt>
						<input-cpt label="标题" :rq="true" v-model="entity.name"></input-cpt>
						<input-cpt label="原价" type="number" :rq="true" v-model="entity.price"></input-cpt>
						
						<div class="profile-info-row">
							<div class="profile-info-name">优惠方式</div>
							<div class="profile-info-value">
								<select v-model="entity.discountType">
									<option value="0">无</option>
									<option value="1">优惠价</option>
									<option value="2">打折</option>
								</select>
							</div>
						</div>

						<input-cpt v-if="entity.discountType == 1" label="优惠价" type="number" :rq="true" v-model="entity.discountPrice"></input-cpt>

						<input-cpt v-if="entity.discountType == 2" label="折数" type="number" :rq="true" v-model="entity.discount"></input-cpt>

						<input-cpt label="库存" type="number" :rq="true" v-model="entity.remainderNumber"></input-cpt>

						<!-- <input-cpt label="数量" :rq="true" v-model="entity.location"></input-cpt> -->

						<select-cpt label="母婴专区" v-model="entity.secondType" :options="leiXing"></select-cpt>
						<select-cpt :label="dynamicLabel" v-model="entity.thirdType" :options="mingCheng"></select-cpt>
						<select-cpt label="品牌" v-model="entity.tag" :options="pinPai"></select-cpt>
						<select-cpt label="材质" v-model="entity.module" :options="caiZhi"></select-cpt>
						<select-cpt label="包装" v-model="entity.childModule" :options="baoZhuang"></select-cpt>

						<div class="profile-info-row">
							<div class="profile-info-name">是否首页显示</div>
							<div class="profile-info-value clearfix">
								<select class="pull-left" v-model="entity.type">
									<option value="homeProduct">是</option>
									<option value="">否</option>
								</select>
							</div>
						</div>

						<div class="profile-info-row">
							<div class="profile-info-name">是否发布</div>
							<div class="profile-info-value">
								<select v-model="entity.status">
									<option value="1">是</option>
									<option value="0">否</option>
								</select>
							</div>
						</div>

						<div class="profile-info-row">
							<div class="profile-info-name">商品详细</div>
							<div class="profile-info-value">
								<script id="container" name="content" type="text/plain"></script>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="form-actions">
				<button class="btn btn-info" type="button" @click="submitForm">保存</button>
			</div>
		</div>
	</div>

	<%@include file="../common/footer.jsp"%>
</body>
<!-- 配置文件 -->
<script type="text/javascript" src="js/ueditor/ueditor.config.js"></script>
<!-- 编辑器源码文件 -->
<script type="text/javascript" src="js/ueditor/ueditor.all.js"></script>

<script>
	$(function(){
		app = new Vue({
			el: '#mainApp',
			data: {
				id: '${id}',
				navigation: '${navigation}',
				dynamicLabel: '商品具名',
				entity: {
					column1: 'production',//用来标记所属分类，是产品还是banner
					sellerId: '${sessionScope.defaultSeller.id}',
					discountType: 0,//打折方式
					discountPrice: 0,//折后价
					picture: '',
					id: '${id}',
					type: '',//是否首页展示
					secondType: '',//所属分类
					status: 1
				},
				leiXing: [],
				mingCheng: [],
				pinPai: [],
				caiZhi: [],
				baoZhuang: []
			},
			watch: {
				'entity.secondType': function(e){
					this.dynamicLabel = e;
					this.getDictionary(e,'mingCheng');
				}
			},
			computed: {
				discountPrice: function () {
					var price = parseFloat(this.entity.price,10),
						discount = parseFloat(this.entity.discount,10);

					if(this.entity.discountType == 1){
						return this.entity.discountPrice;
					}else{
						if(!isNaN(price) && !isNaN(discount)){
							return Math.floor(price * discount / 10 * 100)/100;
						}else{
							return 0;
						}
					}
				}
			},
			methods: {
				handleFileChange: function(e){
					var that = this;

					that.entity.picture = 'images/loading.gif';

					Upload.triggerUpload(e.target.files,{
						relatedTable: 'Production'
					});

					Upload.config.success = function(res){
						that.entity.picture = res.data.data;
					};				
				},

				//字典数据获取
				getDictionary: function(type,key){
					ajax.postJSON('dictionary/list_type.do',{
						type: type,
						pageChosen: -1,
						pageTotal: -1
					},(res) => {
						this[key] = res.data.list;
					});
				},

				getDetail: function(){
					ajax.postJSON('production/detail.do',{
						id: this.id
					},(res) => {
						var entity = res.data.data;

						entity.picture = entity.picture || this.entity.picture;
						this.entity = entity;

						setTimeout(()=>{
							this.ue.setContent(this.entity.synopsis);
						},500);
					});
				},

				//更新
				submitForm: function(){
					this.validate(['entity.picture','entity.name'],() => {
						this.entity.synopsis = this.ue.getContent();

						this.entity.discountPrice = this.discountPrice; 

						if(this.id.length > 0){
							//更新
							ajax.postJSON('production/update.do',this.entity,(res) => {
								history.go(-1);
							});
						}else{
							//新增
							ajax.postJSON('production/add.do',this.entity,(res) => {
								weui.confirm('添加成功，是否继续添加？',function(){
									location.reload();
								},function(){
									history.go(-1);
								})
							});
						}
					});
				}
			},
			mounted: function(){
				this.$nextTick(() => {
					this.ue = UE.getEditor('container',{relatedTable: 'Production'});

					//加载字典数据
					this.getDictionary('母婴专区','leiXing');
					this.getDictionary('品牌','pinPai');
					this.getDictionary('材质','caiZhi');
					this.getDictionary('包装','baoZhuang');

					if(this.id != ''){
						//获取详细
						setTimeout(()=> {
							this.getDetail(this.id);
						},1000)
					}
				})
			}
		});
	});
</script>
</html>
