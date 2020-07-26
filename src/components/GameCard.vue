<template>
  <v-card class="game-card--wrapper">
    <v-img
      :src="require(`@/assets/${gameImage}`) || null"
      gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.8)"
      class="align-end white--text font-title"
      height="200px"
      v-if="!edit.isEdited"
    >
      <!-- LINE SCORE -->
      <v-row class="text-h4 font-weight-black" v-if="!!match.score">
        <v-col cols="5">{{ match.score[0].score }}</v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">{{ match.score[1].score }}</v-col>
      </v-row>

      <!-- LINE TEAMS -->
      <v-row class="text-h5 mb-3" v-if="!!match.score">
        <v-col cols="5" :style="{ color: teams[match.score[0].team].color }">
          {{ teams[match.score[0].team].name }}
        </v-col>
        <v-col cols="2" class="text-h5">VS</v-col>
        <v-col cols="5" :style="{ color: teams[match.score[1].team].color }">
          {{ teams[match.score[1].team].name }}
        </v-col>
      </v-row>
    </v-img>

    <!-- PARTICIPANTS MENU -->
    <v-form
      style="height: 200px; border-bottom: 1px solid #757575"
      class="pa-4"
      v-else-if="edit.menu == 'participants'"
    >
      <v-row>
        <v-col cols="7">
          <v-autocomplete
            :items="mappedTeams"
            label="Equipe 1"
            v-model="form_firstTeamName"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="form_firstTeamWins" label="A gagné"></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-autocomplete
            :items="mappedTeams"
            label="Equipe 2"
            v-model="form_secondTeamName"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="form_secondTeamWins" label="A gagné"></v-checkbox>
        </v-col>
      </v-row>
    </v-form>

    <!-- MATCH SETTINGS MENU -->
    <v-form
      style="height: 200px; border-bottom: 1px solid #757575"
      class="pa-4"
      v-else-if="edit.menu == 'settings'"
    >
      <v-row>
        <v-col cols="7">
          <v-autocomplete
            :items="mappedGames"
            label="Game"
            v-model="form_matchGame"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-autocomplete
            :items="mappedRules"
            label="Rule"
            v-model="form_matchRule"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <p>Debut du matche:</p>
        </v-col>
        <v-col cols="3">
          <v-select :items="hours" label="HH" v-model="form_matchStartHour"></v-select>
        </v-col>
        <v-col cols="3">
          <v-select :items="minutes" label="MM" v-model="form_matchStartMinute"></v-select>
        </v-col>
      </v-row>
    </v-form>

    <!-- AFFICHAGE INFOS MATCH -->
    <v-container class="d-flex justify-space-between text-left" fluid>
      <v-card-text class="ml-4">
        <v-list-item v-if="!edit.isEdited">
          <v-list-item-content>
            <v-list-item-title>Commence à: {{ formatedDate(match.start_at) }}</v-list-item-title>
            <v-list-item-subtitle>
              W: {{ rules[match.rule].win }} | L: {{ rules[match.rule].lost }} | Eq:
              {{ rules[match.rule].equality }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else>
          <v-list-item-content>
            <v-list-item-title>Edition en cours</v-list-item-title>
            <v-list-item-subtitle>{{ edit.menu }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <!-- BUTTONS -->
      <v-card-actions class="mr-2" v-if="amIAdmin">
        <div v-if="!edit.isEdited">
          <v-btn color="primary" icon>
            <v-icon @click.native="editMatch('participants')">mdi-scoreboard</v-icon>
          </v-btn>
          <v-btn color="primary" icon>
            <v-icon @click.native="editMatch('settings')">mdi-cog</v-icon>
          </v-btn>
          <v-btn color="error" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
        <div class="d-flex justify-end" v-else>
          <v-btn color="error" icon @click.native="editMatch()">
            <v-icon>mdi-close-thick</v-icon>
          </v-btn>
          <v-btn color="success" icon>
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>
        </div>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      required: true,
    },
    teams: {
      type: Array,
      required: true,
    },
    games: {
      type: Array,
      required: true,
    },
    rules: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    edit: {
      isEdited: false,
      menu: null,
    },
    form_firstTeamName: '',
    form_firstTeamWins: '',
    form_secondTeamName: '',
    form_secondTeamWins: '',
    form_matchGame: '',
    form_matchRule: '',
    form_matchStartHour: '',
    form_matchStartMinute: '',
  }),
  computed: {
    amIAdmin: () => true,
    mappedRules() {
      return this.rules.map(rule => `W:${rule.win} / L:${rule.lost} / Eq:${rule.equality}`);
    },
    mappedTeams() {
      return this.teams.map(team => team.name);
    },
    mappedGames() {
      return this.games.map(game => game.name);
    },
    hours: () => {
      return [...Array(24).keys()];
    },
    minutes: () => {
      return [...Array(60).keys()];
    },
    gameImage() {
      return this.games.find(game => game.id === this.match.game).image;
    },
  },
  methods: {
    editMatch(menu = null) {
      this.edit.isEdited = !!menu;
      this.edit.menu = this.edit.isEdited ? menu : null;
    },
    formatedDate(date) {
      const d = new Date(date);
      return `${d.getHours()}:${d.getMinutes()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.game-card--wrapper {
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
