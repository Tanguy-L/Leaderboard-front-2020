<template>
  <div>
    <header class="header">
      <div class="container-left">
        <div class="container-subtitle">
          <div class="color-box-blue">
            <h1>plg lan 2019</h1>
          </div>
          <div class="color-box-yellow" />
          <div class="color-box-red" />
        </div>
        <h2>Leaderboard</h2>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
  display: inline-block;
  font-size: 32px;
}

.color-box-blue {
  background-color: #0c2a57;
  display: inline-block;
  clip-path: polygon(0% 0, 100% 0%, 90% 100%, 0% 100%);
  padding-left: 10px;
  padding-right: 45px;
  z-index: 5;
  display: flex;
  align-items: center;
}

.color-box-yellow {
  background-color: #f2d937;
  height: 32px;
  width: 30px;
  margin-left: -25px;
  z-index: 10;
  -webkit-clip-path: polygon(10% 0, 100% 0%, 90% 100%, 0% 100%);
  clip-path: polygon(40% 0, 100% 0%, 60% 100%, 0% 100%);
}

.color-box-red {
  background-color: #d23d3d;
  height: 96px;
  width: 30px;
  z-index: 11;
  margin-left: -15px;
  -webkit-clip-path: polygon(10% 0, 100% 0%, 90% 100%, 0% 100%);
  clip-path: polygon(40% 0, 100% 0%, 60% 100%, 0% 100%);
}

.container-subtitle {
  display: flex;
}

.header {
  background-color: rgb(70, 96, 140);
  color: white;
  margin: 0;
  width: 100%;
  height: 48px;
  box-shadow: rgba(0, 0, 0, 0.397) 0px 3px 6px;
}

.container-left {
  width: calc(50% + 144px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
</style>
