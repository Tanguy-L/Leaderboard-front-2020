<template>
  <v-app id="app">
    <v-app-bar app color="light-blue accent-2 " dark>
      <v-row>
        <v-col cols="3">
          <v-img height="55px" width="240px" src="../public/img/plgCamion.png" />
        </v-col>
      </v-row>
      <v-btn class="mr-6" @click.stop="dialog = true" color="primary">Se connecter</v-btn>
      <v-toolbar-title class="text-h3" style="font-family:'Staatliches' !important;">PLG LAN 2020</v-toolbar-title>
    </v-app-bar>

    <v-dialog v-model="dialog" max-width="450">
      <v-card class="px-12">
        <v-container>
          <v-form ref="form" class="d-flex flex-column" v-model="valid">
            <v-text-field v-model="user.login" :counter="35" label="Login" required></v-text-field>

            <v-text-field v-model="user.password" :counter="35" label="Mot de passe" required></v-text-field>

            <v-btn class="mt-6" color="success" @click="validate">Valider</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

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

    <v-snackbar v-model="snackbar" :timeout="timeout">
      <p>{{ text }}</p>
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
      >{{displayUserStatus}}</p>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      errors: [],
      dialog: false,
      valid: false,
      snackbar: false,
      timeout: 2000,
      text: 'Connexion réussie',
      user: {
        login: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions({
      updateInfosUser: 'updateInfosUser',
    }),
    async validate() {
      const validateForm = this.$refs.form.validate();
      if (validateForm) {
        const { user } = this;

        try {
          const response = await axios.post(
            'http://localhost:3000/users/connect',
            {
              login: user.login,
              password: user.password,
            },
          );

          const responseData = response.data;

          const result = {
            isConnected: false,
            isAdmin: false,
          };

          if (responseData.login) {
            result.isConnected = await true;
          }

          if (responseData.is_admin) {
            result.isAdmin = await true;
          }

          this.dialog = false;
          this.snackbar = true;

          await this.updateInfosUser(result);
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      stateUser: 'stateUser',
    }),
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
