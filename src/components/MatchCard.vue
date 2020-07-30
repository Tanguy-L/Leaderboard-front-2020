<template>
  <v-card class="game-card--wrapper">
    <v-img
      :src="require(`@/assets/${gameImage}`) || null"
      gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,0.9)"
      class="align-end white--text font-title"
      height="200px"
      v-if="!edit.isEdited || edit.menu == 'delete'"
    >
      <!-- LINE SCORE -->
      <v-row
        class="text-h2 font-weight-black"
        v-if="match.participants.length > 0 && !! match.participants[0].score"
      >
        <v-col cols="5">{{ match.participants[0].score }}</v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">{{ match.participants[1].score }}</v-col>
      </v-row>

      <!-- LINE TEAMS -->
      <v-row class="text-h5 mb-3" v-if="!!match.participants.length > 0">
        <v-col
          cols="5"
          :style="{ color: getTeamData(match.participants[0].team).color }"
        >{{ getTeamData(match.participants[0].team).name }}</v-col>
        <v-col cols="2" class="text-h5">VS</v-col>
        <v-col
          cols="5"
          :style="{ color: getTeamData(match.participants[1].team).color }"
        >{{ getTeamData(match.participants[1].team).name }}</v-col>
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
      <v-row>
        <v-col cols="12">
          <v-checkbox
            v-model="form_matchEnded"
            input-value="form_matchEnded"
            label="Le match est fini"
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
            label="Game"
            v-model="form_matchGame"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-autocomplete
            :items="mappedRules"
            item-text="name"
            item-value="id"
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
              W: {{ getRuleData(match.rule).win }} | L: {{ getRuleData(match.rule).lost }} | Eq:
              {{ getRuleData(match.rule).equality }}
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
          <v-btn color="error" icon @click.native="editMatch('delete')">
            <v-icon>mdi-delete</v-icon>
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
import { mapActions } from 'vuex';
import axios from 'axios';

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
    form_firstTeam: '',
    form_firstTeamWins: '',
    form_secondTeam: '',
    form_secondTeamWins: '',
    form_matchEnded: '',
    form_matchGame: '',
    form_matchRule: '',
    form_matchStartHour: '',
    form_matchStartMinute: '',
  }),
  computed: {
    amIAdmin: () => true,
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
    getRuleData(ruleId) {
      return this.rules.find(rule => rule.id === ruleId);
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
    async sendParticipantsForm() {
      const api = await 'http://localhost:3000';
      const { match } = this;

      if ( match.participants.length > 0) {
        const reqParticipants = match.participants.map(participant => {
          return axios.delete(
            `${api}/matches/${match.id}/participants/${participant.team}`,
          );
        });
        await Promise.all(reqParticipants);
      }

      const teams = [this.form_firstTeam, this.form_secondTeam];
      const winners = [];
      if (this.form_firstTeamWins) winners.push(this.form_firstTeam);
      if (this.form_secondTeamWins) winners.push(this.form_secondTeam);

      try {
        if (teams.length > 0)
          await axios.post(`${api}/matches/${match.id}/participants`, {
            teams,
          });
        if (winners.length > 0)
          await axios.post(`${api}/matches/${match.id}/result`, { winners });
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
    async sendSettingsForm() {
      const api = 'http://localhost:3000';
      const { match } = this;
      const startDate = new Date();
      startDate.setHours(this.form_matchStartHour);
      startDate.setMinutes(this.form_matchStartMinute);
      try {
        await axios.put(`${api}/matches/${match.id}`, {
          start_at: startDate,
          end_at: match.end_at,
          game: this.form_matchGame,
          rule: this.form_matchRule,
        });
        await this.confirmUpdate();
      } catch (error) {
        this.showError(error);
        console.error(error);
      }
    },
    async sendDeleteForm() {
      const api = 'http://localhost:3000';
      const { match } = this;
      try {
        if (match.participants.length > 0) {
          const reqParticipants = match.participants.map(participant => {
            return axios.delete(
              `${api}/matches/${match.id}/participants/${participant.team}`,
            );
          });
          await Promise.all(reqParticipants);
        }
        await axios.delete(`${api}/matches/${match.id}`);
        await this.confirmUpdate();
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
      await this.editMatch();
      await this.$emit('update');
    },
    ...mapActions({
      updateSnack: 'updateSnackBar',
    }),
  },
  mounted() {
    const {
      participants,
      start_at: startAt,
      end_at: endAt,
      game,
      rule,
    } = this.match;

    if (!!participants && !!participants[0] && !!participants[0].team) {
      this.form_firstTeam = this.getTeamData(participants[0].team).id;
      this.form_firstTeamWins = !!participants[0].is_winner;
    }

    if (!!participants && !!participants[1] && !!participants[1].team) {
      this.form_secondTeam = this.getTeamData(participants[1].team).id;
      this.form_secondTeamWins = !!participants[1].is_winner;
    }

    const startDate = new Date(startAt);
    this.form_matchStartHour = startDate.getHours();
    this.form_matchStartMinute = startDate.getMinutes();
    this.form_matchEnded = endAt;
    this.form_matchGame = game;
    this.form_matchRule = rule;
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