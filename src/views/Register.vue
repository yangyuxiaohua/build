<template>
    <div id="registerWrapper">
         <div class="registerHeader">
             <span class="registerHeaderTit">建设工程消防验收</span>
            <el-divider direction="vertical"></el-divider>
             <span>单位注册</span>
         </div>
          <div class="registerContainer">
              <p class="promptText">
                  提示：业务办理将使用该注册信息，您需要确保填写的信息真实无误！
              </p>
              <div class="registerInfoBox">
                  <div class="unitInfo">
                       <el-divider content-position="left">单位信息 </el-divider>
                       
                  </div>
                  <div class="accountInfo">
                      <el-divider content-position="left">账号信息   </el-divider>
                  </div>
              </div>
          </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="less" scoped>
#registerWrapper{
    width: 100%;
    height: 100%;
    
    .registerHeader{
        width: 100%;
        height: 80px;
        line-height: 80px;
          background-color: #000;
          color: #fff;
          padding: 0 60px;
          .registerHeaderTit{
              font-size: 24px;
          }
          .el-divider{
              margin: 0 12px;
          }
    }
    .registerContainer{
        padding: 0 30px;
        .promptText{
            font-size: 12px;
            line-height: 80px;
        }
        .el-divider{
            .el-divider__text{
            // margin: 0 12px;
                left: 0;
            }
        }
        .registerInfoBox{
            display: flex;
            justify-content: space-around;
            font-size: 16   px;
            .unitInfo{
              width: 50%;
              padding: 0 20px;
            }
            .accountInfo{
                width: 50%;
              padding: 0 20px;
                
            }
        }
    }
}
</style>