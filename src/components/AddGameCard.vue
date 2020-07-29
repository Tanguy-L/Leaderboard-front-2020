<template>
  <v-card class="game-card--wrapper">
    <v-row class="fill-height flex-column justify-center">
      <h3>Ajouter un match</h3>
    </v-row>
  </v-card>
</template>

<script>
// import axios from 'axios';

export default {};
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
