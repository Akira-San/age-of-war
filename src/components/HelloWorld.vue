<template>
  <v-container>
    <v-sheet class="mx-auto" elevation="8" max-width="820">
      <v-slide-group v-model="model" class="pa-1" multiple>
        <v-slide-item
          v-for="(troop, index) in myTroops"
          :key="index"
          v-slot:default="{ active, toggle }"
        >
          <v-card
            :color="'grey lighten-5'"
            :class="`elevation-${active ? 12 : 2}`"
            class="ma-2 pa-2"
            height="200"
            width="100"
            @click="toggle"
          >
            <v-row
              class="fill-height d-flex pa-2 flex-column justify-space-around align-center"
            >
              <v-icon
                v-for="item in troop.num"
                :key="item"
                :color="troop.color"
                v-text="troop.icon"
                :size="active ? 30 : 25"
              ></v-icon>
            </v-row>
          </v-card>
        </v-slide-item>
      </v-slide-group>
      <v-btn
        :loading="loading"
        :disabled="loading"
        color="primary"
        class="ma-2 white--text"
        fab
        @click="troopsGenerator(myTroopsNum)"
      >
        <v-icon>mdi-cards-playing-outline</v-icon>
      </v-btn>
    </v-sheet>
    <v-item-group multiple>
      <v-container>
        <v-row class="d-flex">
          <div v-for="n in 7" :key="n" class="pa-2">
            <v-item v-slot:default="{ active, toggle }">
              <v-hover>
                <template v-slot="{ hover }">
                  <v-card
                    :color="active ? 'primary' : 'white'"
                    class="d-flex align-center elevation-12"
                    :class="`elevation-${hover ? 12 : 2}`"
                    dark
                    height="200"
                    width="200"
                    @click="toggle"
                  >
                    <v-scroll-y-transition>
                      <div
                        v-if="active"
                        class="display-3 flex-grow-1 text-center"
                      >
                        Active
                      </div>
                    </v-scroll-y-transition>
                  </v-card>
                </template>
              </v-hover>
            </v-item>
          </div>
        </v-row>
      </v-container>
    </v-item-group>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    loader: null,
    loading: false,
    myTroops: [],
    myTroopsNum: 7,
    myCastles: [],
    enemyTroops: [],
    enemyCastles: [],
    castles: [],
    model: [],
    troopTypes: [
      {
        id: 0,
        type: "warrior",
        num: 1,
        color: "indigo darken-3",
        icon: "mdi-knife-military",
      },
      {
        id: 1,
        type: "warrior",
        num: 2,
        color: "indigo darken-3",
        icon: "mdi-knife-military",
      },
      {
        id: 2,
        type: "warrior",
        num: 3,
        color: "indigo darken-3",
        icon: "mdi-knife-military",
      },
      {
        id: 3,
        type: "cavalry",
        num: 1,
        color: "green darken-3",
        icon: "mdi-chess-knight",
      },
      {
        id: 4,
        type: "archer",
        num: 1,
        color: "purple darken-3",
        icon: "mdi-pistol",
      },
      {
        id: 5,
        type: "general",
        num: 1,
        color: "red accent-4",
        icon: "mdi-pirate",
      },
    ],
  }),
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
  },
  methods: {
    updateTroops() {},
    troopsGenerator(num) {
      this.loading = true;
      this.myTroops.length = 0;
      let count = 0;

      let generator = setInterval(() => {
        this.myTroops.push(this.troopTypes[Math.floor(Math.random() * 6)]);
        count++;
        if (count >= num) {
          clearInterval(generator);
          this.loading = false;
        }
      }, 300);
    },
  },
  mounted() {
    this.troopsGenerator(this.myTroopsNum);
  },
};
</script>

<style scoped lang="scss">
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
