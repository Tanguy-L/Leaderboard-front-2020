<template>
  <v-card>
    <v-row
      class="align-end justify-center white--text font-title"
      :style="{ backgroundColor: team.color, height: '125px' }"
      v-if="edit.menu == 'delete' || !edit.isEdited"
    >
      <h3>{{ team.name }}</h3>
    </v-row>
    <v-form
      style="border-bottom: 1px solid #757575"
      class="pa-4"
      v-else
    >
      <v-text-field :rules="dumbRules" dense v-model="form_teamName" label="Nom" required></v-text-field>
      <v-text-field :rules="dumbRules" dense v-model="form_teamColor" label="Image" required></v-text-field>
    </v-form>

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
    team: {
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
      form_teamName: '',
      form_teamColor: '',
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
        .put(`${api}/teams/${this.team.id}`, {
          name: this.form_teamName,
          color: this.form_teamColor,
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
      axios.delete(`${api}/teams/${this.team.id}`).catch(async err => {
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
    this.form_teamName = this.team.name;
    this.form_teamColor = this.team.color;
  }
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
</style>