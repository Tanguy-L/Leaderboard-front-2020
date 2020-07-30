<template>
  <v-app id="app">
    <v-app-bar v-if="this.$route.name !== 'Connexion'" app color="light-blue accent-2 " dark>
      <v-row>
        <v-col cols="3">
          <v-img height="55px" width="240px" src="../public/img/plgCamion.png" />
        </v-col>
      </v-row>
      <v-toolbar-title class="text-h3" style="font-family:'Staatliches' !important;">PLG LAN 2020</v-toolbar-title>
    </v-app-bar>
    <!-- 
    <v-dialog v-model="dialog" max-width="450">
      <v-card class="px-12">
        <v-container></v-container>
      </v-card>
    </v-dialog>-->

    <v-main class="pb-12">
      <v-container class="fill-height container-app align-start" fluid>
        <v-alert v-if="errors.length" type="error">
          <div v-for="(error, index) of errors" :key="index">
            <p>{{ error }}</p>
          </div>
        </v-alert>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-snackbar v-model="snack" :color="snackbar.snackColor" :timeout="timeout">
      {{ snackbar.snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="
            updateSnackBar({
              snackbar: value,
              text: '',
              color: '',
            })
          "
        >Close</v-btn>
      </template>
    </v-snackbar>

    <v-footer
      fixed
      height="25"
      padless
      color="light-blue darken-4"
      class="font-weight-medium d-flex justify-space-between align-center px-2 elevation-3"
    >
      <p
        class="white--text body-2 ma-0"
        style="font-family:'Spartan' !important;"
      >Crée par Moustique et Trobibot</p>
      <p
        class="white--text body-2 ma-0"
        style="font-family:'Spartan' !important;"
      >{{ displayUserStatus }}</p>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      timeout: 2000,
      errors: [],
    };
  },
  methods: {
    ...mapActions({
      updateSnackBar: 'updateSnackBar',
    }),
  },
  computed: {
    ...mapGetters({
      stateUser: 'stateUser',
      snackbar: 'snackbar',
    }),
    snack: {
      get() {
        return this.snackbar.snackbar;
      },
      set(value) {
        this.updateSnackBar({
          snackbar: value,
          text: '',
          color: '',
        });
      },
    },
    displayUserStatus() {
      const status = this.stateUser;
      if (status.isAdmin && status.isConnected) {
        return 'Vous êtes admin et connecté';
      }
      if (status.isConnected) {
        return 'Vous êtes connecté';
      }
      return "T'es pas co";
    },
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
