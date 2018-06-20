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
				<li class="active">列表</li>
			</ul><!-- .breadcrumb -->
		</div>

		<div class="page-content" id="mainApp" v-cloak>
			<div class="page-header">
				<h1>列表
					<a class="btn btn-success" :href="'production/add.html?navigation=' + navigation">添加商品</a>
				</h1>
				<div class="nav-search pull-right" id="nav-search">
					<form class="form-search">
						<span class="input-icon">
							<input type="text" placeholder="Search ..." class="nav-search-input" v-model="keyword" autocomplete="off">
							<i class="icon-search nav-search-icon"></i>
						</span>
						<button type="button" class="btn btn-sm btn-info" @click="getSearchResult(1)">搜索</button>
					</form>
				</div>
			</div>

			<table class="table table-striped table-bordered table-hover dataTable">
				<thead>
					<tr role="row">
						<th class="center sorting_disabled" style="width: 74px;">
							<label>
								<input type="checkbox" class="ace">
								<span class="lbl"></span>
							</label>
						</th>

						<th :class="getSortClass('displayIndex')" @click="changeSort('displayIndex')">排序</th>
						<th>标题</th>
						<th :class="getSortClass('secondType')" @click="changeSort('secondType')">商品所属</th>
						<th :class="getSortClass('thirdType')" @click="changeSort('thirdType')">品牌</th>
						<th :class="getSortClass('module')" @click="changeSort('module')">材质</th>
						<th :class="getSortClass('collectionNumber')" @click="changeSort('collectionNumber')">收藏次数</th>
						<th :class="getSortClass('readNumber')" @click="changeSort('readNumber')">浏览次数</th>
						<th :class="getSortClass('status')" @click="changeSort('status')">状态</th>
						<th :class="getSortClass('datetime')" @click="changeSort('datetime')">上传时间</th>
						<th>操作</th>
					</tr>
				</thead>
				
				<tbody role="alert" aria-live="polite" aria-relevant="all">
					<tr v-for="(item,index) in list" :key="item">
						<td class="center">
							<label>
								<input type="checkbox" class="ace">
								<span class="lbl"></span>
							</label>
						</td>

						<td>{{item.displayIndex}}</td>
						<td><a :href="'production/detail.html?navigation=' + navigation + '&id=' + item.id">{{item.name}}</a></td>
						<td>{{item.secondType}}</td>
						<td>{{item.thirdType}}</td>
						<td>{{item.module}}</td>
						<td>{{item.collectionNumber}}</td>
						<td>{{item.readNumber}}</td>
						<td>
							<span v-if="item.status == 1" class="label label-success">已发布</span>
							<span v-if="item.status == 0" class="label label-danger">未发布</span>
						</td>

						<td>{{item.datetime | dataFilter}}</td>

						<td>
							<a class="green" :href="'production/update.html?navigation=' + navigation + '&id=' + item.id">
								<i class="icon-pencil bigger-130"></i>编辑
							</a>
							
							<a class="info" href="javascript:void(0);" @click="updateStatus(item.id,!item.status,index)">
								<i class="icon-edit bigger-130"></i>{{item.status == 1 ? '取消发布' : '发布'}}
							</a>

							<a class="red" href="javascript:void(0);" @click="deleteEntity(item.id,index)">
								<i class="icon-trash bigger-130"></i>删除
							</a>
						</td>
					</tr>
				</tbody>
			</table>
			<p v-if="list.length == 0">暂未添加任何数据</p>

			<page-cpt :pages="pageCount" :current="pageChosen" v-on:switch="switchPage"></page-cpt>
		</div>
	</div>

	<%@include file="../common/footer.jsp"%>
</body>

<script>
	$(function(){
		var app = initListApp({
			navigation : '${navigation}',
			sortField: 'displayIndex',//默认排序
			listUrl: 'production/list.do',
			listData: {
				sellerId: '${sessionScope.defaultSeller.id}',
				column1: 'production'
			},
			searchUrl: 'production/list_keyword.do',
			searchData: {
				sellerId: '${sessionScope.defaultSeller.id}',
				column1: 'production'
			},
			updateStatusUrl: 'production/update_status.do',
			deleteUrl: 'production/delete.do'
		});
	});
</script>
</html>
