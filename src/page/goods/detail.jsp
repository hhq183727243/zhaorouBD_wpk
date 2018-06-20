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
				<li class="active">详细</li>
			</ul><!-- .breadcrumb -->
		</div>

		<div class="page-content" id="mainApp" v-cloak>
			<div class="page-header">
				<h1>详细</h1>
			</div>

			<div class="row">
				<div class="col-xs-12 col-sm-3 center">
					<span class="profile-picture">
						<img width="180" class="editable img-responsive" alt="picture" :src="entity.picture">
					</span>
				</div>

				<div class="col-sm-9">
					<div class="profile-user-info-striped">
						<info-cpt label="标题" :info="entity.name"></info-cpt>
						<info-cpt label="原价" :info="entity.price"></info-cpt>
						
						<div class="profile-info-row">
							<div class="profile-info-name">优惠方式</div>
							<div class="profile-info-value">
								<span v-if="entity.discountType == 0" class="label">无</span>
								<span v-if="entity.discountType == 1" class="label label-success">优惠价</span>
								<span v-if="entity.discountType == 2" class="label label-success">打折</span>
							</div>
						</div>

						<info-cpt v-if="entity.discountType == 1" label="优惠价" :info="entity.discountPrice"></info-cpt>

						<info-cpt v-if="entity.discountType == 2" label="折数" :info="entity.discount"></info-cpt>

						<div class="profile-info-row" v-if="entity.discountType == 2">
							<div class="profile-info-name">折后价</div>
							<div class="profile-info-value">{{discountPrice}}</div>
						</div>

						<info-cpt label="已卖" :info="entity.sellNumber"></info-cpt>
						<info-cpt label="库存" :info="entity.remainderNumber"></info-cpt>

						<info-cpt label="所属分类" :info="entity.secondType"></info-cpt>
						<info-cpt label="商品具名" :info="entity.thirdType"></info-cpt>
						<info-cpt label="品牌" :info="entity.tag"></info-cpt>
						<info-cpt label="材质" :info="entity.module"></info-cpt>
						<info-cpt label="包装" :info="entity.childModule"></info-cpt>
						<info-cpt label="收藏次数" :info="entity.collectionNumber"></info-cpt>
						<info-cpt label="浏览次数" :info="entity.readNumber"></info-cpt>

						<info-cpt label="评论数" :info="entity.evaluationNumber"></info-cpt>
						<info-cpt label="好评数" :info="entity.praiseNumber"></info-cpt>
						<info-cpt label="中评数" :info="entity.notbadNumber"></info-cpt>
						<info-cpt label="差评数" :info="entity.negativeNumber"></info-cpt>

						<div class="profile-info-row">
							<div class="profile-info-name">是否首页显示</div>
							<div class="profile-info-value">
								<span v-if="entity.type == 'homeProduct'" class="label label-success">是</span>
								<span v-else class="label label-danger">否</span>
							</div>
						</div>

						<div class="profile-info-row">
							<div class="profile-info-name">是否发布</div>
							<div class="profile-info-value">
								<span v-if="entity.status == 1" class="label label-success">已发布</span>
								<span v-if="entity.status == 0" class="label label-warn">未发布</span>
							</div>
						</div>

						<info-cpt label="添加时间" :info="entity.datetime"></info-cpt>
						<info-cpt label="简介" :info="entity.synopsis"></info-cpt>

						<div class="profile-info-row">
							<div class="profile-info-name">效果图</div>
							<div class="profile-info-value">
								<!-- <div><a>图集管理</a></div> -->
								<ul class="ace-thumbnails clearfix">
									<li v-for="(item,index) in attachmentList">
										<a class="cboxElement my-thumbnails" :style="'background-image:url(' + item.path + ')'">
											<div class="text">
												<div class="inner">{{item.synopsis}}</div>
											</div>
										</a>
										<div class="tools tools-bottom">
											<a href="javascript:void(0);" @click="showUpdateLayer(item,index)">
												<i class="icon-pencil green"></i>描述
											</a>
											<a href="javascript:void(0);" @click="deleteAttachment(item,index)">
												<i class="icon-trash red"></i>删除
											</a>
										</div>
									</li>
								</ul>
								<div>
									<a class="btn btn-info btn-upload">上传图片
										<input type="file" @change="handleFileChange" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp" multiple />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="form-actions">
				<a class="btn btn-info" :href="'production/update.html?navigation=' + navigation + '&id=' + id">编辑</a>
			</div>
		</div>
	</div>

	<%@include file="../common/footer.jsp"%>
</body>
<script>
	$(function(){
		new Vue({
			el: '#mainApp',
			data: {
				id: '${id}',
				navigation: '${navigation}',
				entity: {},
				attachmentList: []
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
				//上传图片
				handleFileChange: function(e){
					var that = this;

					Upload.config.url = 'attachment/add_attachement.do';
					Upload.config.success = function(res){
						that.attachmentList.push(res.data.data);
					};	

					Upload.triggerUpload(e.target.files,{
						relatedTable: 'Production',
						relatedDataId: this.id
					});
				},
				getDetail: function(){
					ajax.postJSON('production/detail.do',{
						id: this.id
					},(res) => {
						this.entity = res.data.data;
					});
				},
				getAttachmentList: function(){
					ajax.postJSON('attachment/list.do',{
						relatedDataId: this.id,
						relatedTable: 'Production'
					},(res) => {
						this.attachmentList = res.data.list;
					});
				},
				//删除附件
				deleteAttachment: function(item,index){
					ajax.postJSON('attachment/delete.do',{
						id: item.id
					},(res) => {
						weui.toast('已删除',1000)
						this.attachmentList.splice(index,1);
					});
				},
				//编辑附件
				showUpdateLayer: function(item,index){
					var that = this;

					weui.confirm('<div id="tempApp"><input type="text" style="width: 100%" maxlength="20" v-model="synopsis"/></div>',() => {

	                    $.ajax({
	        				url: 'attachment/update_attachement.do',
	        				type: 'post',
	        				data: JSON.stringify([{"id": item.id,"synopsis":layerApp.synopsis}]),		
	        				traditional: true,
	        				dataType:"json",
	        				contentType:'application/json;charset=UTF-8',
	        				success: function(result){
	        			    	if(200 == result.status){
	        			    		weui.toast('修改成功',1000)
	        			    		//that.attachmentList[index].synopsis = layerApp.synopsis;
	        			    		that.$set(that.attachmentList[index],'synopsis',layerApp.synopsis)
	        			    	}else{
	        			    		weui.alert(result.data.info);
	        			    	}
	        			  	}
	        			});
					},()=>{},{title: '编辑图片描述'});

					var layerApp = new Vue({
						el: '#tempApp',
						data: {
							synopsis: item.synopsis
						}
					})
				}
			},
			mounted: function(){
				this.$nextTick(() => {
					this.getDetail();
					this.getAttachmentList();
				})
			}
		});
	});
</script>
</html>
