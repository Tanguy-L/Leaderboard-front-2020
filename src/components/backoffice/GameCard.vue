<template>
  <v-card>
    <v-img
      :src="require(`@/assets/${game.image}`) || null"
      gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,0.9)"
      class="align-end white--text font-title"
      height="125px"
      v-if="edit.menu == 'delete' || !edit.isEdited"
    >
      <h3>{{ game.name }}</h3>
    </v-img>

    <v-form
      style="height: 125px; border-bottom: 1px solid #757575"
      class="pa-4"
      v-if="edit.menu == 'settings'"
    >
      <v-text-field :rules="dumbRules" dense v-model="form_gameName" label="Nom" required></v-text-field>
      <v-text-field :rules="dumbRules" dense v-model="form_gameImage" label="Image" required></v-text-field>
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
    game: {
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
      form_gameName: '',
      form_gameImage: '',
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
        .put(`${api}/games/${this.game.id}`, {
          name: this.form_gameName,
          image: this.form_gameImage,
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
      axios.delete(`${api}/games/${this.game.id}`).catch(async err => {
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
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
</style>