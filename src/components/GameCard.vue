<template>
  <v-card class="game-card--wrapper">
    <v-img
      :src="
        'https://lh3.googleusercontent.com/proxy/FWeekARtrG23jK8RsaC_NRtt234N7IAH7Q3RwyQ51sMETSvtOHqCSn3WKo3rpQ8t8nNA43_gkMhcpZ_qKeeM3hCO0QjlzJATM0VMnlluK80T9L5SwrwZchDl8RVrpTLO'
      "
      gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.8)"
      class="align-end white--text font-title"
      height="200px"
      v-if="!edit.isEdited"
    >
      <!-- LINE SCORE -->
      <v-row class="text-h4 font-weight-black">
        <v-col cols="5">{{ match.result[0].score }}</v-col>
        <v-col cols="2"></v-col>
        <v-col cols="5">{{ match.result[1].score }}</v-col>
      </v-row>
      <!-- LINE TEAMS -->
      <v-row class="text-h5 mb-3">
        <v-col cols="5" :style="{ color: temp_listTeams[match.result[0].team].color }">
          {{
          temp_listTeams[match.result[0].team].name
          }}
        </v-col>
        <v-col cols="2" class="text-h5">VS</v-col>
        <v-col cols="5" :style="{ color: temp_listTeams[match.result[1].team].color }">
          {{
          temp_listTeams[match.result[1].team].name
          }}
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
          <v-autocomplete :items="mappedTeams" label="Equipe 1" v-model="form_firstTeamName"></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="form_firstTeamWins" label="A gagné"></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-autocomplete :items="mappedTeams" label="Equipe 2" v-model="form_secondTeamName"></v-autocomplete>
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
          <v-autocomplete :items="temp_listGames" label="Game" v-model="form_matchGame"></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-autocomplete :items="mappedRules" label="Rule" v-model="form_matchRule"></v-autocomplete>
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
    <v-card-text>
      <v-list-item v-if="!edit.isEdited">
        <v-list-item-content class="text-left ml-2">
          <v-list-item-title>Commence à: {{ match.start_at }}</v-list-item-title>
          <v-list-item-subtitle>
            W: {{ match.rule.win }} / L: {{ match.rule.lost }} / Eq:
            {{ match.rule.equality }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-else>
        <v-list-item-content class="text-left">
          <v-list-item-title>Edition en cours</v-list-item-title>
          <v-list-item-subtitle>{{ edit.menu }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>

    <!-- BUTTONS -->
    <v-card-actions style="height:100%" v-if="amIAdmin">
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
  </v-card>
</template>

<script>
export default {
  data: () => ({
    temp_listRules: [
      {
        win: 5,
        lost: 1,
        equality: 3,
      },
      {
        win: 7,
        lost: 2,
        equality: 5,
      },
    ],
    temp_listGames: ['Game_1', 'Game_2', 'Game_3'],
    temp_listTeams: [
      {
        name: 'Team_1',
        color: '#FF00FF',
      },
      {
        name: 'Team_2',
        color: '#FFFF00',
      },
      {
        name: 'Team_3',
        color: '#00FFFF',
      },
    ],
    edit: {
      isEdited: false,
      menu: null,
    },
    match: {
      id: 1,
      start_at: '21:30:00',
      rule: 1,
      result: [
        {
          team: 0,
          score: 5,
          is_winner: true,
        },
        {
          team: 2,
          score: 1,
          is_winner: false,
        },
      ],
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
      return this.temp_listRules.map(
        (rule) => `W:${rule.win} / L:${rule.lost} / Eq:${rule.equality}`,
      );
    },
    mappedTeams() {
      return this.temp_listTeams.map((team) => team.name);
    },
    hours: () => {
      return [...Array(24).keys()];
    },
    minutes: () => {
      return [...Array(60).keys()];
    },
  },
  methods: {
    editMatch(menu = null) {
      console.log(menu);

      this.edit.isEdited = !!menu;
      this.edit.menu = this.edit.isEdited ? menu : null;
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

  .v-card__actions {
    .container {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
