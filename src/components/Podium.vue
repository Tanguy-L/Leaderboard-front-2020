<template>
  <div>
    <h1 class="text-h3" style="font-family:'Spartan' !important;">Podium</h1>
    <v-col class="d-flex align-end" cols="2" offset="5">
      <div class="d-flex flex-column flex-grow-1">
        <p>Team 2</p>
        <div class="pod-2 podium elevation-3">
          <h4>2</h4>
        </div>
      </div>

      <div class="d-flex flex-column mx-2 flex-grow-1">
        <p>Team 1</p>
        <div class="pod-1 podium elevation-3">
          <h4>1</h4>
          <v-icon color="yellow-darken-3">mdi-trophy-variant-outline</v-icon>
        </div>
      </div>

      <div class="d-flex flex-column flex-grow-1">
        <p>Team 3</p>
        <div class="pod-3 podium elevation-3">
          <h4>3</h4>
        </div>
      </div>

      <!--   <div class="pod-1 flex-grow-1 mx-2 podium elevation-3">
        <h4>1</h4>
      </div>

      <div class="pod-3 flex-grow-1 podium elevation-3">
        <h4>3</h4>
      </div>-->
    </v-col>
  </div>
</template>

<script>
export default {};
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
