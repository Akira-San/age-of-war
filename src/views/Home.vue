<template>
  <v-container>
    <div class="home d-flex flex-column align-center">
      <v-img
        alt="age of war"
        src="../assets/age-of-war.jpg"
        class="mb-4"
      ></v-img>

      <h4 class="mb-4">
        开始玩: <router-link to="/games/age_of_war"> 战国时代</router-link>
      </h4>
      <div class="d-flex align-center">
        <h3>目前规则:&nbsp;</h3>
        <span>规定步数内，获得尽可能多的分数</span>
      </div>
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
};
</script>

<style scoped lang="scss"></style>
