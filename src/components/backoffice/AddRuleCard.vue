<template>
  <v-card class="d-flex pa-2">
    <v-form style="width: 100%" v-model="form_valid">
    <v-row>
      <v-col class="d-flex">
        <span class="mr-3">Win:</span>
        <v-text-field
          :rules="dumbRules"
          dense
          v-model="form_ruleWin"
          required
        ></v-text-field>
      </v-col>
      <v-col class="d-flex">
        <span class="mr-3">Lost:</span>
        <v-text-field
          :rules="dumbRules"
          dense
          v-model="form_ruleLost"
          required
        ></v-text-field>
      </v-col>
      <v-col class="d-flex">
        <span class="mr-3">Equality:</span>
        <v-text-field
          :rules="dumbRules"
          dense
          v-model="form_ruleEquality"
          required
        ></v-text-field>
      </v-col>
      <v-col class="d-flex align-self-center justify-end">
        <v-btn color="success darken-1" class="mr-4" :disabled="!form_valid" @click="sendForm()">Valider</v-btn>
      </v-col>
    </v-row>
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
      form_ruleWin: '',
      form_ruleLost: '',
      form_ruleEquality: '',
      dumbRules: [v => !!v || 'Ce champs est requis'],
    };
  },
  methods: {
    async sendForm() {
      const api = 'http://localhost:3000';
      await axios.post(`${api}/rules`, {
        win: this.form_ruleWin,
        lost: this.form_ruleLost,
        equality: this.form_ruleEquality
      })
      await this.$emit('update');
    },
  },
  computed: {
    ...mapActions({
      updateSnack: 'updateSnackBar',
    }),
  },
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
</style>