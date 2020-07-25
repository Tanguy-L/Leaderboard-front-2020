<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    class="elevation-1"
  >
  <template v-slot:header="{ props: { headers } }">
    <thead>
      <tr>
        <th :key="header.key" v-for="header in headers">
          <v-img max-width="50px" :src="header.image" aspect-ratio="1" contain></v-img>
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
  </v-data-table>
</template>

<script>
  export default {
    data () {
      return {
        headers: [
          {
            text: 'Equipe',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Jeux 1', value: 'calories', image: "https://pngimg.com/uploads/counter_strike/counter_strike_PNG78.png" },
          { text: 'Jeux 2', value: 'fat' },
          { text: 'Jeux 3', value: 'carbs' },
          { text: 'Score', value: 'carbs' },
        ],
        desserts: [
          {
            name: 'Team 1',
            calories: "Victoire",
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Team 2',
            calories: "Défaite",
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Team 3',
            calories: "Egalité",
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Team 4',
            calories: "Egalité",
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },
        ],
      }
    },
    methods: {
      getColor (calories) {
        if (calories === "Défaite") return 'red'
        if (calories === "Egalité") return 'orange'
        return 'green'
      },
    },
  }
</script>
<style>

</style>
