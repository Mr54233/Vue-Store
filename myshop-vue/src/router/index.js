import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/Home.vue";
import Users from "../components/user/users.vue";
import Right from "../components/power/right.vue";
import Roles from "../components/power/role.vue";
import GoodsList from "../components/goods/List.vue";
import AddGoods from "../components/goods/AddGoods.vue";
import Categories from "../components/goods/Categories.vue";
import Params from "../components/goods/Params.vue";
import Orders from "../components/orders/order.vue";
import Dataview from "../components/DataView.vue";

Vue.use(VueRouter);

const routes = [
	{ path: "/", redirect: "/login" },
	{ path: "/login", component: Login },
	{
		path: "/home",
		component: Home,
		children: [
			{ path: "/", redirect: "/users" },
			{ path: "/users", component: Users },
			{ path: "/rights", component: Right },
			{ path: "/roles", component: Roles },
			{ path: "/goods", component: GoodsList },
			{ path: "/addGoods", component: AddGoods },
			{ path: "/categories", component: Categories },
			{ path: "/params", component: Params },
			{ path: "/orders", component: Orders },
		],
	},
	{
		path: "/reports",
		component: Dataview,
	},
];

const router = new VueRouter({
	routes,
});

export default router;
