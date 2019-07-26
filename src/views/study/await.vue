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
  </div>
</template>

<script>

export default {
  name: 'Await',
  data: function() {
    return {
      phoneNum: '12345',
      faceList: ['20元', '30元', '50元']
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
  	}
  }
}
</script>

<style scoped>

</style>
