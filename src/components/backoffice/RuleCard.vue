<template>
  <v-card class="d-flex pa-2">
    <v-row>
      <v-col class="d-flex">
        <span class="mr-3">Win:</span>
        <v-text-field
          :rules="dumbRules"
          dense
          v-model="form_ruleWin"
          required
          v-if="edit.menu == 'settings'"
        ></v-text-field>
        <span v-else>{{ rule.win }}</span>
      </v-col>
      <v-col class="d-flex">
        <span class="mr-3">Lost:</span>
        <v-text-field
          :rules="dumbRules"
          dense
          v-model="form_ruleLost"
          required
          v-if="edit.menu == 'settings'"
        ></v-text-field>
        <span v-else>{{ rule.lost }}</span>
      </v-col>
      <v-col class="d-flex">
        <span class="mr-3">Equality:</span>
        <v-text-field
          :rules="dumbRules"
          dense
          v-model="form_ruleEquality"
          required
          v-if="edit.menu == 'settings'"
        ></v-text-field>
        <span v-else>{{ rule.equality }}</span>
      </v-col>
    </v-row>
    <v-card-actions class="mr-2">
      <v-spacer></v-spacer>
      <div class="d-flex justify-end" v-if="!edit.isEdited">
        <v-btn color="primary" icon>
          <v-icon @click.native="editMenu('settings')">mdi-cog</v-icon>
        </v-btn>
        <v-btn color="error" icon>
          <v-icon @click.native="editMenu('delete')">mdi-delete</v-icon>
        </v-btn>
      </div>
      <div class="d-flex justify-end" v-else>
        <v-btn color="error" icon @click.native="editMenu()">
          <v-icon>mdi-close-thick</v-icon>
        </v-btn>
        <v-btn color="success" icon @click.native="sendForm()">
          <v-icon>mdi-check-bold</v-icon>
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  props: {
    rule: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      edit: {
        isEdited: false,
        menu: null,
      },
      form_ruleWin: '',
      form_ruleLost: '',
      form_ruleEquality: '',
      dumbRules: [v => !!v || 'Ce champs est requis'],
    };
  },
  methods: {
    editMenu(menu = null) {
      this.edit.isEdited = !!menu;
      this.edit.menu = menu;
    },
    async sendForm() {
      switch (this.edit.menu) {
        case 'settings':
          await this.sendSettingsForm();
          break;
        case 'delete':
          await this.sendDeleteForm();
          break;
        default:
          break;
      }
      await this.$emit('update');
      await this.editMenu();
    },
    sendSettingsForm() {
      const api = 'http://localhost:3000';
      axios
        .put(`${api}/rules/${this.rule.id}`, {
          win: this.form_ruleWin,
          lost: this.form_ruleLost,
          equality: this.form_ruleEquality,
        })
        .catch(async err => {
          console.log(err);
          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          // !!!!!!!!!! HELP ME !!!!!!!!!!
          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          // await this.updateSnack({
          //   snackbar: true,
          //   text: err.message,
          //   color: 'error darken-1',
          // });
        });
    },
    sendDeleteForm() {
      const api = 'http://localhost:3000';
      axios.delete(`${api}/rules/${this.rule.id}`).catch(async err => {
        console.log(err);
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // !!!!!!!!!! HELP ME !!!!!!!!!!
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // await this.updateSnack({
        //   snackbar: true,
        //   text: err.message,
        //   color: 'error darken-1',
        // });
      });
    },
  },
  computed: {
    ...mapActions({
      updateSnack: 'updateSnackBar',
    }),
  },
  mounted() {
    this.form_ruleWin = this.rule.win;
    this.form_ruleLost = this.rule.lost;
    this.form_ruleEquality = this.rule.equality;
  }
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
</style>