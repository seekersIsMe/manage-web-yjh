<template>
  <div id="app">
    <div class="nav">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :router="true"
      >
        <el-menu-item
          v-for="(item, index) in routeList"
          :key="index"
          :index="item.path"
        >
          <i :class="iconList[index]"></i>
          <span slot="title">
            {{ item.meta.title }}
          </span>
        </el-menu-item>
        <div class="switch" @click="collapse">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
      </el-menu>
    </div>
    <div class="connent">
      <router-view />
    </div>
  </div>
</template>

<script>
const ICONLIST = [
  "el-icon-setting",
  "el-icon-postcard",
  "el-icon-film",
  "el-icon-suitcase",
  "el-icon-tickets",
  "el-icon-document",
  "el-icon-edit-outline"
];
import { otherRoutes } from "./router";
export default {
  name: "App",
  data() {
    return {
      isCollapse: true,
      routeList: otherRoutes,
      iconList: Object.freeze(ICONLIST)
    };
  },
  methods: {
    selectLang(e) {
      console.log(e);
      this.langText = LANG[e];
      this.$bus.$emit("changeLang", e);
      localStorage.setItem("langType", e);
      this.$i18n.locale = e;
    },
    gotoAboutus() {
      if (this.$route.path !== "/aboutUs") {
        this.$router.push({
          path: "/aboutUs"
        });
      }
    },
    collapse() {
      this.isCollapse = !this.isCollapse;
      console.log(this.routeList);
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  display: flex;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100vh;
  }
  .el-menu-vertical-demo {
    height: 100vh;
    position: relative;
    .switch {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      color: white;
      font: 20px;
    }
  }
  .connent{
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
