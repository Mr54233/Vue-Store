<template>
	<div>
		<!-- 面包屑区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }"
				>首页</el-breadcrumb-item
			>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/goods' }"
				>商品列表</el-breadcrumb-item
			>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片区域 -->
		<el-card>
			<!-- 消息提示 -->
			<el-alert
				title="添加商品信息"
				type="info"
				center
				show-icon
				:closable="false"
			>
			</el-alert>
			<!-- 步骤条 -->
			<el-steps
				:active="activeIndex * 1"
				finish-status="success"
				process-status="process"
			>
				<el-step title="基本信息" icon="el-icon-edit"></el-step>
				<el-step title="商品参数" icon="el-icon-document"></el-step>
				<el-step
					title="商品属性"
					icon="el-icon-document-copy"
				></el-step>
				<el-step title="商品图片" icon="el-icon-picture"></el-step>
				<el-step title="商品内容" icon="el-icon-reading"></el-step>
				<el-step title="完成" icon="el-icon-circle-check"></el-step>
			</el-steps>
			<!-- 表格 -->
			<el-form
				:model="addForm"
				:rules="addFormRules"
				ref="addFormRef"
				label-width="100px"
				label-position="top"
			>
				<el-tabs
					:tab-position="'left'"
					v-model="activeIndex"
					:before-leave="beforeTabLeave"
					@tab-click="tabClicked"
				>
					<el-tab-pane name="0" label="基本信息">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input
								v-model="addForm.goods_price"
								type="number"
							></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input
								v-model="addForm.goods_weight"
								type="number"
							></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input
								v-model="addForm.goods_number"
								type="number"
							></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader
								v-model="addForm.goods_cat"
								:options="cateList"
								:props="cateProps"
								@change="handleChange"
								clearable
							>
							</el-cascader>
						</el-form-item>
					</el-tab-pane>

					<el-tab-pane name="1" label="商品参数">
						<!-- 渲染表单的 item 项 -->
						<el-form-item
							:label="item.attr_name"
							v-for="item in manyTableData"
							:key="item.attr_id"
						>
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox
									border
									:label="title"
									v-for="(title, index) in item.attr_vals"
									:key="index"
								></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>

					<el-tab-pane name="2" label="商品属性">
						<el-form-item
							:label="item.attr_name"
							v-for="item in onlyTableData"
							:key="item.attr_id"
						>
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane name="3" label="商品图片">
						<!-- action 表示图片要上传到的后台API地址 -->
						<!-- on-preview 点击预览时触发事件 -->
						<!-- list-type 图片展示方式 -->
						<!-- headers 配置请求头 -->
						<el-upload
							:headers="headerObj"
							:action="uploadUrl"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							list-type="picture-card"
							:on-success="uploadSuccess"
						>
							<el-button size="small" type="primary"
								>点击上传</el-button
							>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane name="4" label="商品内容">
						<!-- 富文本编辑器组件 -->
						<quill-editor
							v-model="addForm.goods_introduce"
						></quill-editor>
						<!-- 添加商品按钮 -->
						<el-button type="primary" class="btnAdd" @click="add"
							>添加商品</el-button
						>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>

		<!-- 图片预览 -->
		<el-dialog title="图片预览" :visible.sync="previewVisible" width="40%">
			<img class="previewImg" :src="previewPath" alt="" />
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			addForm: {
				goods_name: "",
				goods_price: null,
				goods_weight: null,
				goods_number: null,
				// 商品所属的分类数组
				goods_cat: [],
				// 图片数组
				pics: [],
				// 商品的详情描述
				goods_introduce: "",
				attrs: [],
			},
			// 表单验证规则对象
			addFormRules: {
				goods_name: [
					{
						required: true,
						message: "请输入商品名称",
						trigger: "blur",
					},
				],
				goods_price: [
					{
						required: true,
						message: "请输入商品价格",
						trigger: "blur",
					},
				],
				goods_weight: [
					{
						required: true,
						message: "请输入商品重量",
						trigger: "blur",
					},
				],
				goods_number: [
					{
						required: true,
						message: "请输入商品数量",
						trigger: "blur",
					},
				],
				goods_cat: [
					{
						required: true,
						message: "请选择商品分类",
						trigger: ["change", "blur"],
					},
				],
			},
			// 所有分类
			cateList: [],
			// 级联选择器的 配置选项
			cateProps: {
				expandTrigger: "hover", // 展开方式 , 默认click 改为hover
				label: "cat_name", //表示看到的是那个属性
				value: "cat_id", //代表选中的是那个值
			},

			// 步骤条的步骤进度
			activeIndex: "0",
		};
	},
	created() {
		this.getCateList();
	},
	methods: {
		// 获取所有商品的分类数据
		async getCateList() {
			const { data: res } = await this.$http.get("categories");
			// console.log(res);
			if (res.meta.status != 200) {
				return this.$message.error(
					"获取商品分类数据失败：" + res.meta.msg
				);
			}

			this.cateList = res.data;
		},
		// 改变打印
		handleChange(value) {
			console.log(value);
		},
	},
};
</script>

<style></style>
