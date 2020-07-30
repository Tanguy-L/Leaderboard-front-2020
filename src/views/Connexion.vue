<template>
  <div class="connexion d-flex justify-start py-6 flex-column elevation-10 align-center">
    <v-form ref="form" class="d-flex pa-4 elevation-6 flex-column form" v-model="valid">
      <h1 class="white--text mb-4 px-4 cyan">Connexion</h1>
      <div class="red elevation-6 mb-4" v-if="error">
        <p class="white--text ma-0 my-2">{{ error }}</p>
      </div>
      <v-text-field
        :rules="dumbRules"
        solo
        v-model="login"
        :counter="35"
        label="Login"
        required
      ></v-text-field>

      <v-text-field
        solo
        v-model="password"
        :rules="dumbRules"
        type="password"
        :counter="35"
        label="Mot de passe"
        required
      ></v-text-field>
      <v-btn class="mt-6" color="success" @click="validate" :disabled="!valid">Valider</v-btn>
      <v-btn color="error" class="mt-4" @click="reset">CLEAR LE FORM</v-btn>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      valid: false,
      text: "Mais t'es qui ?",
      snackbar: false,
      timeout: 2000,
      login: '',
      password: '',
      dumbRules: [
        v => !!v || 'Ce champs est requis',
        v => v.length <= 35 || 'Name must be less than 10 characters',
      ],
      color: '',
      error: '',
    };
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    ...mapActions({
      updateInfosUser: 'updateInfosUser',
    }),
    async validate() {
      const { login, password } = this;

      try {
        const response = await axios.post('http://localhost:3000/users/connect', {
          login,
          password,
        });

        const responseData = response.data;

        const result = {
          isConnected: false,
          isAdmin: false,
        };

        if (responseData.login) {
          result.isConnected = await true;
          this.color = 'test';
          if (responseData.is_admin) {
            result.isAdmin = await true;
          }

          await this.updateInfosUser(result);
          await this.$router.push('/');
        } else {
          this.error = "PTDR, t'es qui ?";
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.form {
  width: 280px;
  background-color: rgb(207, 207, 207);
}

.connexion {
  background-image: url('../assets/background.jpg');
  width: 100%;
  height: 100%;
  margin: auto;
  background-size: cover;
}
</style>
