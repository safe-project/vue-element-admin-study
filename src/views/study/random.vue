<template>
    <div class="random">
        <el-button type='primary' size="mini" @click="makeRandom">点击生成09-18之间的随机数</el-button>{{random}}
    </div>
</template>

<script>
    /*引组件 import userList from '@/view/userList.vue'*/
    /*引接口 import {getUserInfo} from "@/api/userConfig.js"*/
    /*引vuex import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'"*/
    export default {
        name: 'Random',
        data(){
            return {
               random:'0',
            }
        },
        computed:{
            
        },
        props: {
            
        },
        components: {
            
        },
        methods:{
          randomNum(minNum,maxNum){ 
				    switch(arguments.length){ 
				        case 1: 
				        	let random1 = parseInt(Math.random()*minNum+1,10);
				          return  random1.toString();
				        break; 
				        case 2:
				        	let random2 = parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
				        	if (random2<10) {
				        		return '0' + random2;
				        	}else{
				            return random2.toString();
				        	}
				        break; 
				            default: 
				                return '0'; 
				            break; 
				    } 
					},
					makeRandom(){
						this.random = this.randomNum(9,18).concat(this.randomNum(0,59));
					} 
        },
        created(){
           this.random = this.randomNum(9,18).concat(this.randomNum(0,59));
        },
        mounted(){
            
        },
        watch: {
            '$route'(to,from){
                
            }
        }
    }
</script>

<style scoped lang="less">
    .random{
    	padding: 20px;
    }
</style>
    