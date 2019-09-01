<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->

		<el-button @click="link(1)">点击1</el-button>
		<el-button @click="link(2)">点击2</el-button>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'roles'
  //   ])
  // },
  computed: {
  	// 取store里面的state的时候这么取
    ...mapState({
      roles: state => state.user.roles,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      // visitedViews: state => state.tagsView.visitedViews,
    }),
    // 这个对象是为了判断siderbar是打开还是关闭的，暂时不关注
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods:{
  	link(id){
  		let routeData = this.$router.resolve({ path: '/audit',query:{id:id}});
  		window.open(routeData.href, '_blank');

  	// 	this.$router.push({
   //       path: '/audit/index',
   //       query:{
   //             id:id,
   //        }
			// })
  	}
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
