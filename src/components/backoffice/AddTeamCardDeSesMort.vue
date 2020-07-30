<template>
  <v-card>
    <v-form class="pa-4" v-model="form_valid">
      <v-text-field :rules="dumbRules" dense v-model="form_teamName" label="Nom" required></v-text-field>
      <v-text-field :rules="dumbRules" dense v-model="form_teamColor" label="Couleur" required></v-text-field>
      <v-btn color="success darken-1" class="mr-4" :disabled="!form_valid" @click="sendForm()">Valider</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      form_valid: false,
      form_teamName: '',
      form_teamColor: '',
      dumbRules: [v => !!v || 'Ce champs est requis'],
    };
  },
  methods: {
    async sendForm() {
      const api = 'http://localhost:3000';
      await axios.post(`${api}/teams`, {
        name: this.form_teamName,
        color: this.form_teamColor
      })
      await this.$emit('update');
    },
  },
  computed: {
    ...mapActions({
      updateSnack: 'updateSnackBar',
    }),
  }
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
</style>