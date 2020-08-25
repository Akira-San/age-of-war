<template>
  <v-container>
    <v-sheet class="mx-auto" elevation="8" max-width="820">
      <v-slide-group
        multiple
        v-model="activeTroops"
        class="pa-1"
        transition="scroll-x-reverse-transition"
      >
        <v-slide-item
          v-for="(troop, index) in myTroops"
          :key="index"
          v-slot:default="{ active, toggle }"
        >
          <v-fab-transition>
            <v-card
              color="amber lighten-5"
              :class="`elevation-${active ? 12 : 2}`"
              class="ma-2 pa-2"
              height="200"
              width="100"
              :ripple="false"
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
                  :size="active ? 35 : 25"
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
    <v-item-group v-model="castleSelected">
      <v-container>
        <v-row class="d-flex">
          <div
            v-for="(castle, castleIndex) in castles"
            :key="castleIndex"
            class="pa-2 castle"
          >
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                :color="active ? castle.color.split(' ')[0] : castle.color"
                height="200"
                width="200"
              >
                <v-img
                  src="../assets/streamline-icon-landmark-japan-castle-l2@140x140.png"
                >
                  <div
                    class="castle_info"
                    @click="toggle"
                    :class="active ? 'active' : ''"
                  >
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
                        :class="['castle_btn', { ok: item.ok }]"
                        v-for="(item, index) in items"
                        :key="index"
                      >
                        <v-btn
                          @click="placeTroops(items, castle.troopsNeeded)"
                          tile
                          min-width="0"
                          :width="item.num > 1 ? '84' : '36'"
                          height="36"
                          elevation="2"
                          :disabled="castleIndex != castleSelected"
                          :color="
                            item.ok
                              ? findTroopType(item.type).color
                              : 'amber lighten-5'
                          "
                        >
                          <v-icon
                            size="40"
                            v-if="item.num > 1"
                            class="mr-2"
                            :color="
                              item.ok ? 'white' : findTroopType(item.type).color
                            "
                            >{{ "mdi-numeric-" + item.num }}</v-icon
                          >
                          <v-icon
                            :color="
                              item.ok ? 'white' : findTroopType(item.type).color
                            "
                            >{{ findTroopType(item.type).icon }}</v-icon
                          >
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </v-img>
              </v-card>
            </v-item>
          </div>
        </v-row>
      </v-container>
    </v-item-group>
    <v-item-group v-model="myCastleSelected">
      <v-container>
        <v-row class="d-flex">
          <div
            v-for="(castle, castleIndex) in myCastles"
            :key="castleIndex"
            class="pa-2 castle"
          >
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                :color="active ? castle.color.split(' ')[0] : castle.color"
                height="200"
                width="200"
              >
                <v-img
                  src="../assets/streamline-icon-landmark-japan-castle-l2@140x140.png"
                >
                  <div
                    class="castle_info"
                    @click="toggle"
                    :class="active ? 'active' : ''"
                  >
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
                        :class="['castle_btn', { ok: item.ok }]"
                        v-for="(item, index) in items"
                        :key="index"
                      >
                        <v-btn
                          @click="placeTroops(items)"
                          tile
                          min-width="0"
                          :width="item.num > 1 ? '84' : '36'"
                          height="36"
                          elevation="2"
                          :disabled="castleIndex != castleSelected"
                          :color="
                            item.ok
                              ? findTroopType(item.type).color
                              : 'amber lighten-5'
                          "
                        >
                          <v-icon
                            size="40"
                            v-if="item.num > 1"
                            class="mr-2"
                            :color="
                              item.ok ? 'white' : findTroopType(item.type).color
                            "
                            >{{ "mdi-numeric-" + item.num }}</v-icon
                          >
                          <v-icon
                            :color="
                              item.ok ? 'white' : findTroopType(item.type).color
                            "
                            >{{ findTroopType(item.type).icon }}</v-icon
                          >
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </v-img>
              </v-card>
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
    canCastleSelect: true,
    myTroops: [],
    activeTroops: [],
    myTroopsNum: 7,
    castleSelected: -1,
    myCastleSelected: -1,
    myCastles: [],
    // enemyTroops: [],
    // enemyCastles: [],
    castles: [],
    placedTroops: [],
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
        troopsNeeded: [
          [{ type: "general", num: 1 }],
          [
            { type: "cavalry", num: 1 },
            { type: "archer", num: 1 },
          ],
          [{ type: "warrior", num: 6 }],
        ],
      },
      {
        id: 0,
        name: "熊本城",
        type: "kumamoto",
        score: 4,
        color: "green lighten-5",
        img: "../assets/streamline-icon-landmark-japan-castle-l2@140x140.png",
        troopsNeeded: [
          [
            { type: "general", num: 1 },
            { type: "general", num: 1 },
          ],
          [{ type: "archer", num: 1 }],
          [{ type: "cavalry", num: 1 }],
        ],
      },
      {
        id: 0,
        name: "名古屋城",
        type: "naguya",
        score: 2,
        color: "red lighten-5",
        img: "../assets/streamline-icon-landmark-japan-castle-l2@140x140.png",
        troopsNeeded: [
          [
            { type: "cavalry", num: 1 },
            { type: "cavalry", num: 1 },
          ],
          [{ type: "warrior", num: 5 }],
          [{ type: "warrior", num: 2 }],
        ],
      },
    ],
  }),
  computed: {
    findTroopType() {
      return function(val) {
        return this.troopTypes.filter(p => p.type == val)[0];
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
        }
      }, 300);
    },
    placeTroops(row, all) {
      let targets = row.map(o => ({ ...o }));
      let temp = [];
      targets.map(target => {
        for (let i = 0; i < this.activeTroops.length; i++) {
          if (
            target.type == this.myTroops[this.activeTroops[i]].type &&
            target.num > 0
          ) {
            target.num -= this.myTroops[this.activeTroops[i]].num;
            temp.push(this.activeTroops[i]);
            this.activeTroops.splice(i, 1);
            i--;
          }
        }
      });

      if (targets.every(val => val.num < 1)) {
        let tempSort = temp.sort((a, b) => b - a);
        console.log(tempSort);
        row.map(item => {
          return (item.ok = true);
        });
        tempSort.map(item => {
          this.myTroops.splice(item, 1);
        });
        this.myTroopsNum -= temp.length - 1;
        this.troopsGenerator();
      }

      if (all.every(items => items.every(item => item.ok))) {
        this.myCastles.push(this.castles.splice(this.castleSelected, 1));
      }
      while (this.activeTroops.length > 0) {
        this.activeTroops.pop();
      }
    },
    castleSelect(index) {
      if (index === this.castleSelected) return (this.castleSelected = "");
      this.castleSelected = index;
      console.log(this.castleSelected);
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
  cursor: pointer;
  &.active {
    color: #ffffff;
  }
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
  border: 2px solid #8d6e63;
  margin: 8px 8px 0 0;
  background: #ffffff;
  &.ok {
    border: 2px solid #ffc107;
  }
}
.v-btn {
  min-width: 36px;
  width: 36px;
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
