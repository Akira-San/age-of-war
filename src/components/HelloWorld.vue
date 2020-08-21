<template>
  <v-container>
    <v-sheet class="mx-auto" elevation="8" max-width="820">
      <v-slide-group
        v-model="model"
        class="pa-1"
        transition="scroll-x-reverse-transition"
      >
        <v-slide-item v-for="(troop, index) in myTroops" :key="index">
          <v-fab-transition>
            <v-card
              color="amber lighten-5"
              :class="`elevation-${activeTroops.indexOf(index) >= 0 ? 12 : 2}`"
              class="ma-2 pa-2"
              height="200"
              width="100"
              :ripple="false"
              @click="troopSelect(index)"
            >
              <v-row
                class="fill-height d-flex pa-2 flex-column justify-space-around align-center"
              >
                <v-icon
                  v-for="item in troop.num"
                  :key="item"
                  :color="troop.color"
                  v-text="troop.icon"
                  :size="activeTroops.indexOf(index) >= 0 ? 35 : 25"
                ></v-icon>
              </v-row>
            </v-card>
          </v-fab-transition>
        </v-slide-item>
      </v-slide-group>
      <v-btn
        :loading="loading"
        :disabled="loading || myTroopsNum <= 1"
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
          <div
            v-for="(castle, index) in castles"
            :key="index"
            class="pa-2 castle"
          >
            <v-item>
              <v-hover>
                <template v-slot="{ hover }">
                  <v-card
                    :color="castle.color"
                    class="elevation-12"
                    :class="`elevation-${hover ? 12 : 2}`"
                    height="200"
                    width="200"
                  >
                    <v-img
                      src="../assets/streamline-icon-landmark-japan-castle-l2@140x140.png"
                    >
                      <div class="castle_info">
                        <h1 class="ma-1 text-center">{{ castle.score }}</h1>
                        <h3 class="ma-1 text-center">{{ castle.name }}</h3>
                      </div>
                      <div class="castle_btns">
                        <div
                          class="castle_btns_row"
                          v-for="(items, index) in castle.troopsNeeded"
                          :key="index"
                        >
                          <div
                            v-for="(item, index) in items"
                            :key="index"
                            v-ripple
                            :class="[
                              'castle_btn elevation-2',
                              { ' big': item.match(/\d/) },
                            ]"
                          >
                            <v-icon
                              size="40"
                              v-if="item.match(/^\d/)"
                              color="indigo darken-3 "
                              >{{ "mdi-numeric-" + item[0] }}</v-icon
                            >
                            <v-icon
                              :color="
                                troopsNeededShow(item)
                                  ? troopsNeededShow(item).color
                                  : ''
                              "
                              >{{
                                troopsNeededShow(item)
                                  ? troopsNeededShow(item).icon
                                  : ""
                              }}</v-icon
                            >
                          </div>
                        </div>
                      </div>
                    </v-img>
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
    loading: false,
    myTroops: [],
    activeTroops: [],
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
    castleTypes: [
      {
        id: 0,
        name: "北野城",
        type: "kitano",
        score: 3,
        color: "purple lighten-5",
        img: "../assets/streamline-icon-landmark-japan-castle-l2@140x140.png",
        troopsNeeded: [["general"], ["cavalry", "archer"], ["6warrior"]],
      },
      {
        id: 0,
        name: "熊本城",
        type: "kumamoto",
        score: 4,
        color: "green lighten-5",
        img: "../assets/streamline-icon-landmark-japan-castle-l2@140x140.png",
        troopsNeeded: [["general", "general"], ["archer"], ["cavalry"]],
      },
      {
        id: 0,
        name: "名古屋城",
        type: "naguya",
        score: 2,
        color: "red lighten-5",
        img: "../assets/streamline-icon-landmark-japan-castle-l2@140x140.png",
        troopsNeeded: [["cavalry", "cavalry"], ["5warrior"], ["2warrior"]],
      },
    ],
  }),
  computed: {
    troopsNeededShow() {
      return function(item) {
        let q = item.replace(/\d+/, "");
        return this.troopTypes.filter(p => p.type == q)[0];
      };
    },
  },
  methods: {
    troopsGenerator() {
      this.loading = true;
      this.myTroopsNum--;
      this.myTroops.length = 0;
      let count = 0;
      this.activeTroops.length = 0;

      let generator = setInterval(() => {
        this.myTroops.push(this.troopTypes[Math.floor(Math.random() * 6)]);
        count++;
        if (count >= this.myTroopsNum) {
          clearInterval(generator);
          this.loading = false;
          this.canUpdate = false;
        }
      }, 300);
    },
    troopSelect(res) {
      if (this.activeTroops.indexOf(res) >= 0)
        this.activeTroops.splice(this.activeTroops.indexOf(res), 1);
      else this.activeTroops.push(res);
      console.log(this.activeTroops);
    },
  },
  mounted() {
    this.loading = true;
    this.myTroops.length = 0;
    let count = 0;
    this.activeTroops.length = 0;

    let generator = setInterval(() => {
      this.myTroops.push(this.troopTypes[Math.floor(Math.random() * 6)]);
      count++;
      if (count >= this.myTroopsNum) {
        clearInterval(generator);
        this.loading = false;
        this.canUpdate = false;
      }
    }, 200);

    [...this.castles] = this.castleTypes;
  },
};
</script>

<style scoped lang="scss">
.castle {
  position: relative;
}
.castle_info {
  position: absolute;
  bottom: 0;
  z-index: 1;
}
.castle_btns {
  position: absolute;
  z-index: 2;
  right: 0;
  top: 0;
}
.castle_btns_row {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: flex-end;
  z-index: 3;
}
.castle_btn {
  width: 50px;
  height: 50px;
  background: #fff8e1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border: 2px solid #8d6e63;
  cursor: pointer;
  margin: 8px 8px 0 0;
  &.big {
    width: 108px;
    padding-right: 4px;
  }
}
.back_icon {
  position: absolute;
  bottom: 0;
  width: 100%;
}
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
