<template>
  <v-row>
    <v-col cols="12">
      <Podium />
    </v-col>
    <v-row>
      <v-col cols="10" offset="1">
        <TableTournament :tournamentData="teamsScoreByGame" :tournamentHeaders="tournamentHeaders" />
      </v-col>
    </v-row>

    <v-col cols="12">
      <h2>Les matchs</h2>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
// eslint-disable-next-line import/no-unresolved
/* eslint-disable import/no-dynamic-require */
import TableTournament from '@/components/TableTournament.vue';
import Podium from '@/components/Podium.vue';
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    TableTournament,
    Podium,
  },
  data() {
    return {
      matchs: [],
      teams: [],
      games: [],
      matchsResult: [],
    };
  },
  methods: {
    async fetchData() {
      const api = await 'http://localhost:3000';

      const reqMatchs = axios.get(`${api}/matches`);
      const reqTeams = axios.get(`${api}/teams`);
      const reqGames = axios.get(`${api}/games`);
      try {
        const [resMatchs, resTeams, resGames] = await Promise.all([
          reqMatchs,
          reqTeams,
          reqGames,
        ]);

        const teams = resTeams.data;
        const games = resGames.data;
        const matchs = resMatchs.data;

        const results = matchs.map(async (match) => {
          const response = await axios.get(`${api}/matches/${match.id}/result`);
          const game = games.find((gameToFind) => gameToFind.id === match.game);
          const result = { game: game.id, score: response.data };
          return result;
        });

        return {
          matchs,
          teams,
          games,
          matchsResult: await Promise.all(results),
        };
      } catch (error) {
        return error;
      }
    },
  },
  computed: {
    teamsScoreByGame() {
      const { teams, games, matchsResult } = this;

      const test = teams.map((team) => {
        const test2 = games.map((game) => {
          const matchForThisGame = matchsResult.filter(
            (e) => e.game === game.id,
          );

          const filteredByTeam = matchForThisGame.filter((e) => {
            if (e.score && e.score !== '') {
              const find = e.score.some((score) => score.team === team.id);
              if (find) {
                return true;
              }
            }
            return false;
          });

          let scoreTeam = 0;

          filteredByTeam.forEach((results) => {
            console.log(results);
            const score = results.score.find(
              (result) => result.team === team.id,
            );
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

        test2.forEach((game) => {
          result[game.key] = game.value;
        });

        return result;
      });

      return test;
    },
    tournamentHeaders() {
      const { games } = this;
      const matchsParsed = games.map((game) => {
        return {
          text: game.name,
          value: game.name,
          // eslint-disable-next-line global-require
          image: require(`@/assets/${game.image}`) || null,
        };
      });

      console.log(matchsParsed);

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
    this.fetchData().then((response) => {
      console.log('RESPONSE -> ', response);
      this.teams = response.teams;
      this.games = response.games;
      this.matchs = response.matchs;
      this.matchsResult = response.matchsResult;
    });
  },
};
</script>
