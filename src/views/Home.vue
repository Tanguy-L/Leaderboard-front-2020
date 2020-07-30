<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12">
        <Podium :teams="teamsWithScore" />
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h2 class="text-h3 mb-6" style="font-family:'Spartan' !important;">Les matchs à jouer</h2>
          </v-col>
        </v-row>
        <v-row class="grid-layout pa-3">
          <match-card
            v-for="match in nonPlayedMatches"
            @update="fetchCall"
            :key="match.id"
            :match="match"
            :teams="teams"
            :games="games"
            :rules="rules"
          />
          <add-match-card @update="fetchCall" :rules="rules" :games="games" />
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row v-if="playedMatches.length > 0">
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h2 class="text-h3 mb-6" style="font-family:'Spartan' !important;">Les matchs joués</h2>
          </v-col>
        </v-row>
        <v-row class="grid-layout pa-3">
          <match-card
            v-for="match in playedMatches"
            @update="fetchCall"
            :key="match.id"
            :match="match"
            :teams="teams"
            :games="games"
            :rules="rules"
          />
        </v-row>
      </v-col>
    </v-row>
    <v-divider v-if="playedMatches.length > 0" />
    <v-row>
      <v-col cols="10" offset="1">
        <h2 class="text-h3 mb-6" style="font-family:'Spartan' !important;">Qui qu'a perdu ?</h2>
        <TableTournament :tournamentData="teamsScoreByGame" :tournamentHeaders="tournamentHeaders" />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
// @ is an alias to /src
// eslint-disable-next-line import/no-unresolved
/* eslint-disable import/no-dynamic-require */
import TableTournament from '@/components/TableTournament.vue';
import Podium from '@/components/Podium.vue';
import MatchCard from '@/components/MatchCard.vue';
import AddMatchCard from '@/components/AddMatchCard.vue';
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    TableTournament,
    Podium,
    MatchCard,
    AddMatchCard,
  },
  data() {
    return {
      matchs: [],
      teams: [],
      games: [],
      rules: [],
    };
  },
  methods: {
    fetchCall() {
      this.teams = [];
      this.games = [];
      this.matchs = [];
      this.rules = [];
      this.fetchData().then(response => {
        this.teams = response.teams;
        this.games = response.games;
        this.matchs = response.matchs;
        this.rules = response.rules;
      });
    },
    async fetchData() {
      const api = await 'http://localhost:3000';

      const reqMatchs = axios.get(`${api}/matches`);
      const reqTeams = axios.get(`${api}/teams`);
      const reqGames = axios.get(`${api}/games`);
      const reqRules = axios.get(`${api}/rules`);
      try {
        const [resMatchs, resTeams, resGames, resRules] = await Promise.all([
          reqMatchs,
          reqTeams,
          reqGames,
          reqRules,
        ]);

        const teams = resTeams.data;
        const games = resGames.data;
        const matchs = resMatchs.data;
        const rules = resRules.data;

        const results = matchs.map(async match => {
          const { data: participants } = await axios.get(
            `${api}/matches/${match.id}/result`,
          );
          return { ...match, participants };
        });

        return {
          teams,
          games,
          rules,
          matchs: await Promise.all(results),
        };
      } catch (error) {
        return error;
      }
    },
  },
  computed: {
    playedMatches() {
      return this.matchs.filter(match => !!match.end_at);
    },
    nonPlayedMatches() {
      return this.matchs.filter(match => !match.end_at);
    },
    teamsWithScore() {
      const { teams, matchs } = this;
      const result = teams.map(team => {
        const filteredByTeam = matchs.filter(match => {
          if (match.score && match.score !== '') {
            const find = match.score.some(score => score.team === team.id);
            if (find) {
              return true;
            }
          }
          return false;
        });

        let scoreTeam = 0;

        filteredByTeam.forEach(results => {
          const score = results.score.find(
            resultTeam => resultTeam.team === team.id,
          );
          scoreTeam += score.score;
        });

        return {
          team: team.name,
          score: scoreTeam,
          color: team.color,
        };
      });
      return result;
    },
    teamsScoreByGame() {
      const { teams, games, matchs } = this;

      const test = teams.map(team => {
        const test2 = games.map(game => {
          const matchForThisGame = matchs.filter(e => e.game === game.id);

          const filteredByTeam = matchForThisGame.filter(e => {
            if (e.score && e.score !== '') {
              const find = e.score.some(score => score.team === team.id);
              if (find) {
                return true;
              }
            }
            return false;
          });

          let scoreTeam = 0;

          filteredByTeam.forEach(results => {
            const score = results.score.find(result => result.team === team.id);
            scoreTeam += score.score;
          });

          return {
            key: game.name,
            value: scoreTeam,
          };
        });

        const result = {
          team: team.name,
        };

        test2.forEach(game => {
          result[game.key] = game.value;
        });

        return result;
      });

      return test;
    },
    tournamentHeaders() {
      const { games } = this;
      const matchsParsed = games.map(game => {
        return {
          text: game.name,
          value: game.name,
          // eslint-disable-next-line global-require
          image: require(`@/assets/${game.image}`) || null,
        };
      });

      matchsParsed.unshift({
        text: 'Equipe',
        align: 'start',
        sortable: false,
        value: 'team',
      });

      return matchsParsed;
    },
  },
  mounted() {
    this.fetchCall();
  },
};
</script>

<style lang="scss" scoped>
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(385px, 1fr));
  grid-gap: 16px;
}

.v-divider {
  margin-top: 36px;
  margin-bottom: 36px;
}
</style>
