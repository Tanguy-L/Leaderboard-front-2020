<template>
<v-row>

    <v-row>
      <v-col cols=10 offset="1">
        <TableTournament/>
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
import TableTournament from '@/components/TableTournament.vue';

export default {
  name: 'Home',
  components: {
    TableTournament,
  },
};
</script>
