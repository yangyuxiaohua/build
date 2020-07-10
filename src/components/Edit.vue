<template>
    <div class="editWrapper">
        <!-- <el-card> -->
            <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" class="editContent">
            </quill-editor>
        <!-- <el-button @click="save()">保存</el-button> -->
        <!-- </el-card> -->
    </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "Edit",
  components: {
    quillEditor
  },
  data() {
    return {
      content: null,
      editorOption: {}
    };
  },
  methods:{
      save(){
      }
  }
};
</script>

<style lang='less'>
.editWrapper {
  width: 100%;
  height: 100%;
  position: relative;
    .editContent {
      width: 100%;
      height: 200px;
    }
    .el-button{
        position: absolute;
        right: 10px;
        top: 10px;
    }
}
</style>