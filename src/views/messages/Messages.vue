<template>
    <div id="messageWrapper">
        <div class="headerWrapper">
            <div class="headerNav">
                <span class="navList" v-for="(item,index) in navList" :key='index' :class="{chosedNav:cindex==item.id}" @click="changeNav(item)">{{item.name}}</span>
            </div>
            <div class="container">
                <router-view></router-view>
            </div>
        </div>

    </div>
</template>
<script>
import {inDexOfStr} from '@/utils/publictool'
export default {
  data() {
    return {
      cindex: 0,
      navList: [{ id: 0, name: "消息提醒",path:'/index/messages/news' }, { id: 1, name: "政策法规",path:'/index/messages/laws' }]
    };
  },
  created() {
      // 刷新保存页面
   if(inDexOfStr(this.$route.path,'news')){
       this.cindex = 0
        this.$router.history.push('/index/messages/news')
   }else{
       this.cindex = 1
       
        this.$router.history.push('/index/messages/laws')
   }
  },
  methods: {
    changeNav(i) {
        this.cindex = i.id
        this.$router.history.push(i.path)
    }
  }
};
</script>

<style lang="less">
#messageWrapper {
  width: 100%;
  height: 100%;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
  position: relative;
  .headerWrapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .headerNav {
      flex: 0 0 50px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      span {
        display: inline-block;
        width: 120px;
        height: 48px;
        line-height: 48px;
        // background-color: #409eff;
        text-align: center;
        color: #409eff;
      }
      span:hover {
        cursor: pointer;
      }
      .chosedNav {
        background-color: #409eff;
        color: #fff;
      }
    }
    .container {
      flex: 1;
      padding: 10px 10px 0 10px;
    }
  }
}
</style>