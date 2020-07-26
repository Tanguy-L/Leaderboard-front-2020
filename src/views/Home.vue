<template>
  <v-row>
    <v-col cols="12">
      <Podium />
    </v-col>
    <v-col cols="12">
      <h2 class="text-h3 mb-6" style="font-family:'Spartan' !important;">Les matchs joués</h2>
      <v-row v-for="line in linesForCards" :key="line.id">
        <v-col v-for="match in line.matches" :key="match.id" cols="3">
          <GameCard :match="match" :teams="teams" :games="games" :rules="rules" />
        </v-col>
      </v-row>
    </v-col>
    <v-row>
      <v-col cols="10" offset="1">
        <h2 class="text-h3 mb-6" style="font-family:'Spartan' !important;">Qui qu'a perdu ?</h2>
        <TableTournament :tournamentData="teamsScoreByGame" :tournamentHeaders="tournamentHeaders" />
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
// @ is an alias to /src
// eslint-disable-next-line import/no-unresolved
/* eslint-disable import/no-dynamic-require */
import TableTournament from '@/components/TableTournament.vue';
import Podium from '@/components/Podium.vue';
import GameCard from '@/components/GameCard.vue';
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    TableTournament,
    Podium,
    GameCard,
  },
  data() {
    return {
      matchs: [],
      teams: [],
      games: [],
      rules: [],
      matchsResult: [],
    };
  },
  methods: {
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
          rules,
          matchsResult: await Promise.all(results),
        };
      } catch (error) {
        return error;
      }
    },
  },
  computed: {
    playedMatches() {
      const { matchsResult, matchs } = this;
      const matchsWithResult = matchs.map((match, index) => {
        const find = matchsResult[index];
        const newMatch = match;
        newMatch.result = find;
        return newMatch;
      });

      const matchesResultsWithWinner = matchsWithResult.filter((match) => {
        const { result } = match;
        if (result.score && result.score !== '') {
          const check = result.score.some((e) => e.is_winner);
          if (check) {
            return true;
          }
        }

        return false;
      });

      return matchesResultsWithWinner;
    },
    nonPlayedMatches() {
      const { matchsResult, matchs } = this;
      const matchsWithResult = matchs.map((match, index) => {
        const find = matchsResult[index];
        const newMatch = match;
        newMatch.result = find;
        return newMatch;
      });

      const matchesResultsWitoutWinner = matchsWithResult.filter((match) => {
        const { result } = match;
        if (result.score === '') {
          return true;
        }

        return false;
      });

      return matchesResultsWitoutWinner;
    },
    linesForCards() {
      const { nonPlayedMatches } = this;

      const lines = [];

      const { length } = nonPlayedMatches;

      const chunk = 4;
      let i;
      let j;
      let id = 0;
      for (i = 0, j = length; i < j; i += chunk) {
        lines.push({
          id,
          matches: nonPlayedMatches.slice(i, i + chunk),
        });
        id += 1;
      }

      return lines;
    },
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
      this.teams = response.teams;
      this.games = response.games;
      this.matchs = response.matchs;
      this.rules = response.rules;
      this.matchsResult = response.matchsResult;
    });
  },
};
</script>
