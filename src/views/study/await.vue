<!--
完美解释了promise的作用：解决回调地狱！！！
 -->

<template>
  <div class="">
    <h4>await的使用</h4>
    <!-- 输入框区域 -->
    <div style="height:50px">
      <input v-model="phoneNum" type="text" placeholder="请输入电话号码">
      <button @click="getFaceResult">确定</button>
    </div>

    <!-- 充值面值 显示区域 -->
    <div>
      充值面值：
      <span v-for="item in faceList" :key="item">
        {{ item }}
      </span>
    </div>

    <!-- 给胡方写的代码优化 -->
		




  </div>
</template>

<script>

export default {
  name: 'Await',
  data: function() {
    return {
      phoneNum: '12345',
      faceList: ['20元', '30元', '50元'],
      // 维护映射
      typeMapping:{"1":"维护","2":"换装(无偿)","3":"换装(有偿)","4":"加机"},
      repairInfo:[
      	{dealDevice: "50118053016", type: "1", location: "后备箱左侧", message: "自动上线", newDevice: ""},
      	{dealDevice: "50118053016", type: "2", location: "后备箱左侧", message: "自动上线", newDevice: ""},
      	{dealDevice: "50118053016", type: "2", location: "后备箱左侧", message: "自动上线", newDevice: ""},
      	{dealDevice: "50118053016", type: "3", location: "后备箱左侧", message: "自动上线", newDevice: ""},
      	{dealDevice: "50118053016", type: "4", location: "后备箱左侧", message: "自动上线", newDevice: ""},
      ],
    }
  },
  methods: {
    // 点击确定按钮时，获取面值列表
    getFaceResult() {
      this.getLocation(this.phoneNum)
        .then(res => {
          if (res.status === 200 && res.data.success) {
            const province = res.data.obj.province
            const city = res.data.obj.city

            this.getFaceList(province, city)
              .then(res => {
                if (res.status === 200 && res.data.success) {
                  this.faceList = res.data.obj
                }
              })
              .catch(error => {
              	console.log(error)
              })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getFaceResult() {
      try {
        const location = await this.getLocation(this.phoneNum)
        if (location.data.success) {
          const province = location.data.obj.province
          const city = location.data.obj.city
          const result = await this.getFaceList(province, city)
          if (result.data.success) {
            this.faceList = result.data.obj
          }
        }
      } catch (err) {
        console.log(err)
      }
  	},


  	
  	mappingType(){
  		this.repairInfo.forEach((item,index)=>{
	  		item.typeName = this.typeMapping[item.type];
	  	})
  	},
  	message(){
  		this.$message.error('sorry，未请求到数据');
  	}
  },
  created(){
  	console.log(3333);
  	// 你写的三目运算符
  	this.repairInfo.length?this.mappingType():this.message();
  	console.log(this.repairInfo);
  }
}
</script>

<style scoped>

</style>
