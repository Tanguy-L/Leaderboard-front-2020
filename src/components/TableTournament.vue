<template>
  <v-data-table
    hide-default-footer
    :headers="tournamentHeaders"
    :items="tournamentData"
    class="elevation-4 pt-4 custom-css-table"
  >
    <template v-slot:header="{ props: { headers } }">
      <thead>
        <tr>
          <th :key="header.key" v-for="header in headers">
            <v-img
              v-if="header.image"
              max-width="80px"
              :src="header.image"
              aspect-ratio="1"
              contain
            />
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot:top>
      <h3 style="font-family: 'Spartan' !important;" class="text-h4">Qui qu'a perdu ?</h3>
    </template>
    <template v-slot:item.calories="{ item }">
      <v-chip :color="getColor(item.calories)" dark>{{ item.calories }}</v-chip>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.name">
          <td style="text-align:left;">{{ item.team }}</td>
          <td style="text-align:left;" v-for="game in keyGames" :key="game.id">
            <v-chip :color="getColor(item[game.text])" dark>{{ item[game.text] }}</v-chip>
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
/* eslint-disable import/no-dynamic-require */

export default {
  props: {
    tournamentHeaders: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tournamentData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      desserts: [
        {
          team: 'Team 1',
          CSGO: 'Victoire',
          DOD: 'Victoire',
          Trackmania: 24,
        },
        {
          team: 'Team 2',
          CSGO: 'Défaite',
          DOD: 9.0,
          Trackmania: 37,
        },
        {
          team: 'Team 3',
          CSGO: 'Egalité',
          DOD: 16.0,
          Trackmania: 23,
        },
        {
          team: 'Team 4',
          CSGO: 'Egalité',
          DOD: 3.7,
          Trackmania: 67,
        },
      ],
    };
  },
  computed: {
    keyGames() {
      const { tournamentHeaders } = this;
      tournamentHeaders.shift();
      return tournamentHeaders.map((e, index) => {
        return {
          id: index,
          text: e.text,
        };
      });
    },
  },
  methods: {
    getColor(calories) {
      if (calories === 'Défaite') return 'red';
      if (calories === 'Egalité') return 'orange';
      return 'green';
    },
  },
};
</script>
<style lang="scss">
.custom-css-table {
  background-color: #8ec5fc;
  background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
  color: black;
}
</style>
