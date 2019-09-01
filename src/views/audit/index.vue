<template>
    <div class="audit">
        审计页面--{{id}}
    </div>
</template>

<script>
    /*引组件 import userList from '@/view/userList.vue'*/
    /*引接口 import {getUserInfo} from "@/api/userConfig.js"*/
    /*引vuex import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'"*/
    export default {
        name: 'Audit',
        data(){
            return {
                id:this.$route.query.id
            }
        },
        computed:{
            
        },
        props: {
            
        },
        components: {
            
        },
        methods:{
            
        },
        created(){
            
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
    
</style>
    