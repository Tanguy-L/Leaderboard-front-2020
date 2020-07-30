<template>
  <div>
    <h2 class="text-h3" style="font-family:'Spartan' !important;">Podium</h2>
    <v-col class="d-flex align-end" cols="2" offset="5">
      <div v-if="teamsSorted[1] && teamsSorted[1].team" class="d-flex flex-column flex-grow-1">
        <p>{{ teamsSorted[1].team }}</p>
        <div
          :style="{ backgroundColor: teamsSorted[1].color }"
          class="pod-2 podium elevation-3 white--text"
        >
          <h4>2</h4>
        </div>
        <p class="mt-1">{{ teamsSorted[1].score }} pts</p>
      </div>

      <div v-if="teamsSorted[0] && teamsSorted[0].team" class="d-flex flex-column mx-2 flex-grow-1">
        <p>{{ teamsSorted[0].team }}</p>
        <div
          :style="{ backgroundColor: teamsSorted[0].color }"
          class="pod-1 white--text podium elevation-3"
        >
          <h4>1</h4>
          <v-icon large color="white">mdi-trophy-variant-outline</v-icon>
        </div>
        <p class="mt-1">{{ teamsSorted[0].score }} pts</p>
      </div>

      <div v-if="teamsSorted[2] && teamsSorted[2].team" class="d-flex flex-column flex-grow-1">
        <p>{{ teamsSorted[2].team }}</p>
        <div
          :style="{ backgroundColor: teamsSorted[2].color }"
          class="pod-3 podium elevation-3 white--text"
        >
          <h4>3</h4>
        </div>
        <p class="mt-1">{{ teamsSorted[2].score }} pts</p>
      </div>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    teams: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    teamsSorted() {
      const { teams } = this;
      return teams.sort((a, b) => {
        return b.score - a.score;
      });
    },
  },
};
</script>

<style lang="scss">
.pod-1 {
  height: 120px;
}

.pod-2 {
  height: 80px;
  position: relative;

  .absolute-text-2 {
    position: absolute;
    top: -25px;
    left: auto;
    right: auto;
  }
}

.pod-3 {
  height: 50px;
}
</style>
