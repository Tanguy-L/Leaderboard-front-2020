<template>
  <v-card class="game-card--wrapper">
    <v-img
      :src="require(`@/assets/${gameImage}`) || null"
      gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,0.9)"
      class="align-end white--text font-title"
      height="200px"
      v-if="edit.menu == 'delete' || !edit.isEdited"
    >
      <!-- LINE SCORE -->
      <v-row class="text-h2 font-weight-black" v-if="!!match.score">
        <v-col cols="5">{{ match.score[0].score }}</v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">{{ match.score[1].score }}</v-col>
      </v-row>

      <!-- LINE TEAMS -->
      <v-row class="text-h5 mb-3" v-if="!!match.score">
        <v-col cols="5" :style="{ color: getTeamData(match.score[0].team).color }">{{
          getTeamData(match.score[0].team).name
        }}</v-col>
        <v-col cols="2" class="text-h5">VS</v-col>
        <v-col cols="5" :style="{ color: getTeamData(match.score[1].team).color }">{{
          getTeamData(match.score[1].team).name
        }}</v-col>
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
            :items="teams"
            item-text="name"
            item-value="id"
            label="Equipe 1"
            v-model="form_firstTeam"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-checkbox
            v-model="form_firstTeamWins"
            input-value="form_firstTeamWins"
            label="A  gagné"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-autocomplete
            :items="teams"
            item-text="name"
            item-value="id"
            label="Equipe 2"
            v-model="form_secondTeam"
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-checkbox
            v-model="form_secondTeamWins"
            input-value="form_secondTeamWins"
            label="A gagné"
          ></v-checkbox>
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
            :items="games"
            item-text="name"
            item-value="id"
            label="Jeux"
            v-model="settings.matchGame"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-autocomplete
            :items="mappedRules"
            item-text="name"
            item-value="id"
            label="Règles"
            v-model="settings.matchRule"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <p>Début du match :</p>
        </v-col>
        <v-col cols="3">
          <v-select :items="hours" label="HH" v-model="settings.matchStart.hour"></v-select>
        </v-col>
        <v-col cols="3">
          <v-select :items="minutes" label="MM" v-model="settings.matchStart.minutes"></v-select>
        </v-col>
      </v-row>
    </v-form>

    <!-- AFFICHAGE INFOS MATCH -->
    <v-container class="d-flex justify-space-between text-left" fluid>
      <v-card-text class="ml-4">
        <v-list-item v-if="!edit.isEdited">
          <v-list-item-content>
            <v-list-item-title>Commence à: {{ formatedDate(match.start_at) }}</v-list-item-title>
            <v-list-item-subtitle v-if="rules[match.rule]">
              W: {{ ruleByMatch.win }} | L: {{ ruleByMatch.lost }} | Eq:
              {{ ruleByMatch.equality }}
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
      <v-card-actions class="mr-2" v-if="stateUser.isAdmin">
        <div v-if="!edit.isEdited">
          <v-btn color="primary" icon>
            <v-icon @click.native="editMatch('participants')">mdi-scoreboard</v-icon>
          </v-btn>
          <v-btn color="primary" icon>
            <v-icon @click.native="editMatch('settings')">mdi-cog</v-icon>
          </v-btn>
          <v-btn color="error" icon>
            <v-icon @click.native="editMatch('delete')">mdi-delete</v-icon>
          </v-btn>
        </div>
        <div class="d-flex justify-end" v-else>
          <v-btn color="error" icon @click.native="editMatch()">
            <v-icon>mdi-close-thick</v-icon>
          </v-btn>
          <v-btn color="success" icon @click.native="sendForm()">
            <v-icon>mdi-check-bold</v-icon>
          </v-btn>
        </div>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

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
    api: 'http://localhost:3000',
    form_firstTeam: '',
    form_firstTeamWins: '',
    form_secondTeam: '',
    form_secondTeamWins: '',
    settings: {
      matchGame: '',
      matchStart: {
        hour: '',
        minutes: '',
      },
      matchRule: '',
    },
  }),
  computed: {
    ...mapGetters({
      stateUser: 'stateUser',
    }),
    ruleByMatch() {
      const { rules, match } = this;
      return rules[match.rule - 1];
    },
    mappedRules() {
      return this.rules.map(rule => ({
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
    gameImage() {
      return this.games.find(game => game.id === this.match.game).image;
    },
  },
  methods: {
    ...mapActions({
      updateSnack: 'updateSnackBar',
    }),
    async testError() {
      try {
        await axios.post('http://localhost:3000/matches/2/participants');
      } catch (error) {
        console.error(error);
        this.showError(error);
      }
    },
    editMatch(menu = null) {
      this.edit.isEdited = !!menu;
      this.edit.menu = this.edit.isEdited ? menu : null;
    },
    formatedDate(date) {
      const d = new Date(date);
      return `${d.getHours()}:${d.getMinutes()}`;
    },
    getTeamData(teamId) {
      return this.teams.find(team => team.id === teamId);
    },
    sendForm() {
      switch (this.edit.menu) {
        case 'participants':
          this.sendParticipantsForm();
          break;
        case 'settings':
          this.sendSettingsForm();
          break;
        case 'delete':
          this.sendDeleteForm();
          break;
        default:
          break;
      }
    },
    async sendDeleteForm() {
      const api = await 'http://localhost:3000';
      const { match, participants } = this;
      try {
        const reqParticipants = participants.map(participant => {
          return axios.delete(`${api}/matches/${match.id}/participants/${participant.team_id}`);
        });

        await Promise.all(reqParticipants);
        await axios.delete(`${api}/matches/${match.id}`);
        await this.confirmUpdate();
      } catch (error) {
        this.showError(error);
        console.error(error);
      }
    },
    async sendSettingsForm() {
      const { settings, match } = this;
      const api = await 'http://localhost:3000';

      try {
        await axios.put(`${api}/matches/${match.id}`, {
          game: settings.matchGame,
          rule: settings.matchRule,
          start_at: settings.matchStart.hour,
          end_at: settings.matchStart.minutes,
        });
        await this.$emit('update');
      } catch (error) {
        this.showError(error);
        console.error(error);
      }
    },
    async showError(error) {
      await this.updateSnack({
        snackbar: true,
        text: error.message,
        color: 'error darken-1',
      });
    },
    async confirmUpdate() {
      await this.updateSnack({
        snackbar: true,
        text: 'Match mis à jour !',
        color: 'success darken-1',
      });
      await this.$emit('update');
      await this.editMatch();
    },
    async sendParticipantsForm() {
      const api = await 'http://localhost:3000';
      const { match, participants } = this;

      const reqParticipants = participants.map(participant => {
        return axios.delete(`${api}/matches/${match.id}/participants/${participant.team_id}`);
      });

      await Promise.all(reqParticipants);

      const teamsBody = { teams: [this.form_firstTeam, this.form_secondTeam] };
      const winnersBody = { winners: [] };
      if (this.form_firstTeamWins) winnersBody.winners.push(this.form_firstTeam);
      if (this.form_secondTeamWins) winnersBody.winners.push(this.form_secondTeam);

      try {
        await axios.post(`${api}/matches/${match.id}/participants`, teamsBody);
        await axios.post(`${api}/matches/${match.id}/result`, winnersBody);
        await axios.put(`${api}/matches/${match.id}`, {
          start_at: match.start_at,
          end_at: this.form_matchEnded ? Date.now() : null,
          game: match.game,
          rule: match.rule,
        });
        await this.confirmUpdate();
      } catch (error) {
        this.showError(error);
        console.error(error);
      }
    },
  },
  mounted() {
    const { api } = this;
    const { score, start_at: startAt, end_at: endAt, game, rule, id } = this.match;
    console.log(id);

    axios.get(`${api}/matches/${id}/participants`).then(response => {
      this.participants = response.data;
    });

    if (!!score && !!score[0] && !!score[0].team) {
      this.form_firstTeam = score[0].team;
      this.form_firstTeamWins = score[0].is_winner;
    }
    if (!!score && !!score[1] && !!score[1].team) {
      this.form_secondTeam = score[1].team;
      this.form_secondTeamWins = score[1].is_winner;
    }
    const startDate = new Date(startAt);
    this.settings.matchStart.hour = startDate.getHours();
    this.settings.matchStart.minutes = startDate.getMinutes();
    this.form_matchEnded = endAt;
    this.settings.matchGame = game;
    this.settings.matchRule = rule;
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
