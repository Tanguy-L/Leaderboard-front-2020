<template>
  <v-app id="app">
    <v-app-bar app color="light-blue accent-2" dark>
      <v-row>
        <v-col cols="5">
          <v-img height="55px" width="240px" src="../public/img/plgCamion.png" />
        </v-col>
      </v-row>
      <v-toolbar-title class="text-h3" style="font-family:'Staatliches' !important;">PLG LAN 2020</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height container-app align-start" fluid>
        <v-alert v-if="errors.length" type="error">
          <div v-for="(error, index) of errors" :key="index">
            <p>{{ error }}</p>
          </div>
        </v-alert>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      errors: [],
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: '../public/img/index.jpg';
}
.block-container-header {
  width: 50%;
  height: 100%;
}

.font-title {
  font-family: 'Staatliches' !important;
}

.font-sub-title {
  font-family: 'Spartan' !important;
}

.block-container-basic {
  width: 20%;
  height: 100%;
  clip-path: polygon(0% 0, 100% 0%, 90% 100%, 0% 100%);
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
