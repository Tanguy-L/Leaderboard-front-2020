<template>
  <v-card class="game-card--wrapper">
    <v-row class="d-flex flex-column justify-center">
      <h3 class="primary--text mt-4" @click="expand = !expand">Ajouter un match</h3>
      <v-form ref="form" class="pa-2 mt-4 px-6 form-width ma-auto" v-model="valid">
        <v-autocomplete
          :items="mappedRules"
          item-text="name"
          item-value="id"
          label="Rule"
          v-model="matchRule"
          :rules="dumbRules"
        ></v-autocomplete>

        <v-autocomplete
          :items="games"
          item-text="name"
          item-value="id"
          label="Game"
          v-model="matchGame"
          :rules="dumbRules"
        ></v-autocomplete>

        <v-btn color="success darken-1" class="mr-4" :disabled="!valid" @click="submit">Valider</v-btn>
      </v-form>
    </v-row>
  </v-card>
</template>

<script>
import axios from 'axios';
// import axios from 'axios';

export default {
  props: {
    rules: {
      type: Array,
      required: true,
    },
    games: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    valid: false,
    matchRule: '',
    matchGame: '',
    matchHour: '',
    matchMinutes: '',
    dumbRules: [(v) => !!v || v === 0 || 'Ce champs est requis'],
  }),
  computed: {
    mappedRules() {
      return this.rules.map((rule) => ({
        name: `W:${rule.win} / L:${rule.lost} / Eq:${rule.equality}`,
        ...rule,
      }));
    },
    hours: () => {
      return [...Array(24).keys()];
    },
    minutes: () => {
      return [...Array(60).keys()];
    },
  },
  methods: {
    async clearForm() {
      this.matchRule = '';
      this.matchGame = '';
      this.$refs.form.resetValidation();
    },
    async submit() {
      const { matchGame, matchRule } = this;
      const dt = new Date();
      dt.setHours(dt.getHours() + 2);
      try {
        await axios.post('http://localhost:3000/matches', {
          start_at: Date.now(),
          end_at: dt,
          game: matchGame,
          rule: matchRule,
        });
        await this.$emit('update');
        await this.clearForm();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-width {
  width: 100%;
}

.game-card--wrapper {
  max-width: 300px;
  * {
    padding: 0;
    margin: 0;
  }

  .v-form {
    .row {
      & > .col:not(:last-child) {
        margin-right: 8px;
      }
      .col {
        display: flex;
        align-items: center;
      }
    }
  }

  .v-card__text {
    width: auto;
  }
}
</style>
