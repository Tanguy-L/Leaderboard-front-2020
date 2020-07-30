<template>
  <v-col class="fill-height d-flex" clos="12">
    <v-row class="back-wrapper grid-layout">
      <div>
        <h3>Games</h3>
        <v-row class="small-wrapper grid-layout">
          <game-card v-for="game in games" :key="game.id" :game="game" @update="fetchCall" />
          <add-game-card @update="fetchCall" />
        </v-row>
      </div>
      <div>
        <h3>Rules</h3>
        <rule-card v-for="rule in rules" class="mb-3" :key="rule.id" :rule="rule" @update="fetchCall" />
        <add-rule-card @update="fetchCall" />
      </div>
      <div>
        <h3>Teams</h3>
        <v-row class="small-wrapper grid-layout">
          <team-card v-for="team in teams" class="mb-3" :key="team.id" :team="team" @update="fetchCall" />
          <add-team-card @update="fetchCall" />
        </v-row>
      </div>
    </v-row>
  </v-col>
</template>

<script>
import GameCard from '@/components/backoffice/GameCard.vue';
import AddGameCard from '@/components/backoffice/AddGameCard.vue';
import RuleCard from '@/components/backoffice/RuleCard.vue';
import AddRuleCard from '@/components/backoffice/AddRuleCard.vue';
import TeamCard from '@/components/backoffice/TeamCard.vue';
import AddTeamCard from '@/components/backoffice/AddTeamCardDeSesMort.vue';
import axios from 'axios';

export default {
  components: {
    GameCard,
    RuleCard,
    TeamCard,
    AddGameCard,
    AddRuleCard,
    AddTeamCard
  },
  data() {
    return {
      teams: [],
      games: [],
      rules: [],
      playersNotInTeam: [],
    };
  },
  methods: {
    fetchCall() {
      this.teams = [];
      this.games = [];
      this.rules = [];
      this.playersNotInTeam = [];
      this.fetchData().then(result => {
        this.teams = result.teams;
        this.games = result.games;
        this.rules = result.rules;
        this.playersNotInTeam = result.playersNotInTeam;
      });
    },
    async fetchData() {
      const api = await 'http://localhost:3000';

      const reqTeams = axios.get(`${api}/teams`);
      const reqGames = axios.get(`${api}/games`);
      const reqRules = axios.get(`${api}/rules`);
      const reqPlayersNotInTeam = axios.get(`${api}/players?notInTeam`);

      try {
        const [
          resTeams,
          resGames,
          resRules,
          resPlayersNotInTeam,
        ] = await Promise.all([
          reqTeams,
          reqGames,
          reqRules,
          reqPlayersNotInTeam,
        ]);

        const { data: teams } = resTeams;
        const { data: games } = resGames;
        const { data: rules } = resRules;
        const { data: playersNotInTeam } = resPlayersNotInTeam;

        const mappedTeams = teams.map(async team => {
          const { data: teamPlayers } = await axios.get(
            `${api}/teams/${team.id}/players?extended`,
          );
          return { ...team, players: teamPlayers };
        });

        return {
          games,
          rules,
          teams: await Promise.all(mappedTeams),
          playersNotInTeam,
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
  mounted() {
    this.fetchData().then(result => {
      this.teams = result.teams;
      this.games = result.games;
      this.rules = result.rules;
      this.playersNotInTeam = result.playersNotInTeam;
    });
  },
};
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}

.back-wrapper {
  --min-width: 620px;
  --grid-gap: 64px;
}
.small-wrapper {
  --min-width: 200px;
  --grid-gap: 16px;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--min-width), 1fr));
  grid-gap: var(--grid-gap);
}
</style>
