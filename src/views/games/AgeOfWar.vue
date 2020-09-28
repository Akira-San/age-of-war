<template>
    <v-container>
        <v-sheet class="mx-auto mb-8 cards" elevation="8" max-width="820">
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
            <div class="btns">
                <v-btn
                    :loading="loading"
                    :disabled="loading || myTroopsNum <= 1 || step > totalStep"
                    color="primary"
                    class="ma-2 white--text"
                    fab
                    @click="troopsGenerator(myTroopsNum--)"
                >
                    <v-icon>mdi-cards-playing-outline</v-icon>
                </v-btn>
                <v-btn
                    :loading="loading"
                    :disabled="loading || step > totalStep"
                    color="error"
                    class="ma-2 white--text"
                    fab
                    @click="stepGenerator()"
                >
                    <v-icon>mdi-arrow-right-bold-outline</v-icon>
                </v-btn>
                <h2 class="float-right ma-5">第{{ step }}步 共{{ totalStep }}步</h2>
            </div>
        </v-sheet>

        <v-sheet class="mx-auto mb-8" elevation="8">
            <h1
                v-if="pubCastles.length <= 0 || step > totalStep"
                class="font-weight-bold display-3 basil--text pa-8"
            >
                游戏结束 共{{ step - 1 }}步 总分:{{ totalScore }}
            </h1>
            <v-slide-group v-else>
                <v-row class="d-flex py-2 px-5">
                    <div
                        class="castles"
                        v-for="(castles, castlesIndex) in pubCastles"
                        :key="castlesIndex"
                    >
                        <div
                            v-for="(castle, castleIndex) in castles.familyCastles"
                            :key="castleIndex"
                            class="pa-2 castle"
                        >
                            <v-slide-item>
                                <v-card
                                    @click="castleSelect(castle.id)"
                                    :color="
                                        castle.id === castleSelected
                                            ? castles.color.split(' ')[0]
                                            : castles.color
                                    "
                                    height="200"
                                    width="200"
                                >
                                    <v-img src="@/assets/castle-default.png">
                                        <div
                                            class="castle_info"
                                            :class="castle.id === castleSelected ? 'active' : ''"
                                        >
                                            <h1 class="ma-1 text-center">{{ castle.score }}</h1>
                                            <h3 class="ma-1 text-center">{{ castle.name }}</h3>
                                        </div>
                                        <div class="castle_btns">
                                            <div
                                                class="castle_btns_row"
                                                v-for="(items, itemsindex) in castle.troopsNeeded"
                                                :key="itemsindex"
                                            >
                                                <div
                                                    :class="['castle_btn', { ok: item.ok }]"
                                                    v-for="(item, index) in items"
                                                    :key="index"
                                                >
                                                    <v-btn
                                                        @click="
                                                            placeTroops(items, castle.troopsNeeded)
                                                        "
                                                        tile
                                                        min-width="0"
                                                        :width="item.num > 1 ? '84' : '36'"
                                                        height="36"
                                                        elevation="2"
                                                        :disabled="castle.id !== castleSelected"
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
                                                                item.ok
                                                                    ? 'white'
                                                                    : findTroopType(item.type).color
                                                            "
                                                            >{{ 'mdi-numeric-' + item.num }}</v-icon
                                                        >
                                                        <v-icon
                                                            :color="
                                                                item.ok
                                                                    ? 'white'
                                                                    : findTroopType(item.type).color
                                                            "
                                                            >{{
                                                                findTroopType(item.type).icon
                                                            }}</v-icon
                                                        >
                                                    </v-btn>
                                                </div>
                                            </div>
                                        </div>
                                    </v-img>
                                </v-card>
                            </v-slide-item>
                        </div>
                    </div>
                </v-row>
            </v-slide-group>
        </v-sheet>

        <v-sheet class="mx-auto mb-8" elevation="8" v-if="myCastles.length > 0">
            <v-slide-group>
                <v-row class="d-flex py-2 px-5">
                    <div
                        class="castles"
                        v-for="(castles, castlesIndex) in myCastles"
                        :key="castlesIndex"
                    >
                        <div
                            v-for="(castle, castleIndex) in castles.familyCastles"
                            :key="castleIndex"
                            class="pa-2 castle"
                        >
                            <v-slide-item>
                                <v-card
                                    :color="
                                        castle.id === castleSelected
                                            ? castles.color.split(' ')[0]
                                            : castles.color
                                    "
                                    height="200"
                                    width="200"
                                >
                                    <v-img src="@/assets/castle-default.png">
                                        <div
                                            class="castle_info"
                                            :class="castle.id === castleSelected ? 'active' : ''"
                                        >
                                            <h1 class="ma-1 text-center">{{ castle.score }}</h1>
                                            <h3 class="ma-1 text-center">{{ castle.name }}</h3>
                                        </div>
                                        <div class="castle_btns">
                                            <div
                                                class="castle_btns_row"
                                                v-for="(items, itemsindex) in castle.troopsNeeded"
                                                :key="itemsindex"
                                            >
                                                <div
                                                    :class="['castle_btn', { ok: item.ok }]"
                                                    v-for="(item, index) in items"
                                                    :key="index"
                                                >
                                                    <v-btn
                                                        tile
                                                        min-width="0"
                                                        :width="item.num > 1 ? '84' : '36'"
                                                        height="36"
                                                        elevation="2"
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
                                                                item.ok
                                                                    ? 'white'
                                                                    : findTroopType(item.type).color
                                                            "
                                                            >{{ 'mdi-numeric-' + item.num }}</v-icon
                                                        >
                                                        <v-icon
                                                            :color="
                                                                item.ok
                                                                    ? 'white'
                                                                    : findTroopType(item.type).color
                                                            "
                                                            >{{
                                                                findTroopType(item.type).icon
                                                            }}</v-icon
                                                        >
                                                    </v-btn>
                                                </div>
                                            </div>
                                        </div>
                                    </v-img>
                                </v-card>
                            </v-slide-item>
                        </div>
                    </div>
                </v-row>
            </v-slide-group>
        </v-sheet>

        <v-snackbar v-model="snackbar" timeout="2000" top color="warning" outlined>
            {{ text }}
            <template v-slot:action="{ attrs }">
                <v-btn color="warning" icon v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
export default {
    name: 'AgeOfWar',
    data: () => ({
        loading: false,
        canCastleSelect: true,
        myTroops: [],
        activeTroops: [],
        myTroopsNum: 7,
        castleSelected: -1,
        totalStep: 0,
        myCastles: [],
        step: 0,
        // enemyTroops: [],
        // enemyCastles: [],
        pubCastles: [],
        placedTroops: [],
        snackbar: false,
        text: '',
        troopTypes: [
            {
                id: 0,
                type: 'warrior',
                num: 1,
                color: 'indigo darken-3',
                icon: 'mdi-knife-military',
            },
            {
                id: 1,
                type: 'warrior',
                num: 2,
                color: 'indigo darken-3',
                icon: 'mdi-knife-military',
            },
            {
                id: 2,
                type: 'warrior',
                num: 3,
                color: 'indigo darken-3',
                icon: 'mdi-knife-military',
            },
            {
                id: 3,
                type: 'cavalry',
                num: 1,
                color: 'green darken-3',
                icon: 'mdi-chess-knight',
            },
            {
                id: 4,
                type: 'archer',
                num: 1,
                color: 'purple darken-3',
                icon: 'mdi-pistol',
            },
            {
                id: 5,
                type: 'general',
                num: 1,
                color: 'red accent-4',
                icon: 'mdi-pirate',
            },
        ],
        castleTypes: [
            {
                family: 'shimazu',
                familyScore: 3,
                color: 'green lighten-5',
                total: 1,
                familyCastles: [
                    {
                        id: 1,
                        name: '熊本城',
                        type: 'kumamoto',
                        score: 3,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [
                                { type: 'general', num: 1 },
                                { type: 'general', num: 1 },
                            ],
                            [{ type: 'archer', num: 1 }],
                            [{ type: 'cavalry', num: 1 }],
                            [{ type: 'warrior', num: 4 }],
                        ],
                    },
                ],
            },
            {
                family: 'chousokabe',
                familyScore: 4,
                color: 'brown lighten-5',
                total: 2,
                familyCastles: [
                    {
                        id: 2,
                        name: '松山城',
                        type: 'matsuyama',
                        score: 2,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [{ type: 'general', num: 1 }],
                            [{ type: 'warrior', num: 4 }],
                            [{ type: 'warrior', num: 4 }],
                        ],
                    },
                    {
                        id: 3,
                        name: '丸龜城',
                        type: 'marugame',
                        score: 1,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [
                                { type: 'general', num: 1 },
                                { type: 'general', num: 1 },
                            ],
                            [{ type: 'cavalry', num: 1 }],
                        ],
                    },
                ],
            },
            {
                family: 'mouri',
                familyScore: 5,
                color: 'red lighten-5',
                total: 2,
                familyCastles: [
                    {
                        id: 4,
                        name: '月山富田城',
                        type: 'gassantoda',
                        score: 2,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [{ type: 'general', num: 1 }],
                            [{ type: 'warrior', num: 8 }],
                        ],
                    },
                    {
                        id: 5,
                        name: '備中松山城',
                        type: 'naguya',
                        score: 2,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [
                                { type: 'cavalry', num: 1 },
                                { type: 'cavalry', num: 1 },
                            ],
                            [{ type: 'warrior', num: 5 }],
                            [{ type: 'warrior', num: 2 }],
                        ],
                    },
                ],
            },
            {
                family: 'uesugi',
                familyScore: 8,
                color: 'purple lighten-5',
                total: 2,
                familyCastles: [
                    {
                        id: 6,
                        name: '春日山城',
                        type: 'kasugayama',
                        score: 4,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [
                                { type: 'archer', num: 1 },
                                { type: 'archer', num: 1 },
                            ],
                            [
                                { type: 'cavalry', num: 1 },
                                { type: 'cavalry', num: 1 },
                            ],
                        ],
                    },
                    {
                        id: 7,
                        name: '北之庄',
                        type: 'kitano',
                        score: 3,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [{ type: 'general', num: 1 }],
                            [
                                { type: 'archer', num: 1 },
                                { type: 'cavalry', num: 1 },
                            ],
                            [{ type: 'warrior', num: 6 }],
                        ],
                    },
                ],
            },
            {
                family: 'tokugawa',
                familyScore: 8,
                color: 'grey lighten-5',
                total: 3,
                familyCastles: [
                    {
                        id: 8,
                        name: '江戶城',
                        type: 'edo',
                        score: 3,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [
                                { type: 'archer', num: 1 },
                                { type: 'cavalry', num: 1 },
                            ],
                            [
                                { type: 'archer', num: 1 },
                                { type: 'cavalry', num: 1 },
                            ],
                            [{ type: 'warrior', num: 3 }],
                        ],
                    },
                    {
                        id: 9,
                        name: '清州城',
                        type: 'kiyosu',
                        score: 2,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [{ type: 'general', num: 1 }],
                            [{ type: 'archer', num: 1 }],
                            [{ type: 'cavalry', num: 1 }],
                            [{ type: 'warrior', num: 3 }],
                        ],
                    },
                    {
                        id: 10,
                        name: '犬山城',
                        type: 'inuyama',
                        score: 1,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [{ type: 'general', num: 1 }],
                            [
                                { type: 'archer', num: 1 },
                                { type: 'archer', num: 1 },
                            ],
                        ],
                    },
                ],
            },
            {
                family: 'oda',
                familyScore: 10,
                color: 'yellow lighten-5',
                total: 4,
                familyCastles: [
                    {
                        id: 11,
                        name: '安土城',
                        type: 'azuchi',
                        score: 3,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [{ type: 'archer', num: 1 }],
                            [
                                { type: 'cavalry', num: 1 },
                                { type: 'cavalry', num: 1 },
                            ],
                            [{ type: 'warrior', num: 5 }],
                        ],
                    },
                    {
                        id: 12,
                        name: '松本城',
                        type: 'matsumoto',
                        score: 2,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [{ type: 'archer', num: 1 }],
                            [{ type: 'archer', num: 1 }],
                            [{ type: 'warrior', num: 7 }],
                        ],
                    },
                    {
                        id: 13,
                        name: '小谷城',
                        type: 'kotani',
                        score: 1,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [[{ type: 'warrior', num: 10 }]],
                    },
                    {
                        id: 14,
                        name: '岐阜城',
                        type: 'gifu',
                        score: 1,
                        img: '../assets/castle-default.png',
                        troopsNeeded: [
                            [{ type: 'general', num: 1 }],
                            [{ type: 'archer', num: 1 }],
                            [{ type: 'cavalry', num: 1 }],
                        ],
                    },
                ],
            },
        ],
    }),
    computed: {
        findTroopType() {
            //根据type找卡牌值
            return function(val) {
                return this.troopTypes.filter((p) => p.type == val)[0];
            };
        },
        totalScore() {
            //计算总分
            let totalScore = 0;
            this.myCastles.map((family) => {
                if (family.familyCastles.length === family.total) totalScore += family.familyScore;
                else {
                    family.familyCastles.map((castle) => {
                        totalScore += castle.score;
                    });
                }
            });
            return totalScore;
        },
    },
    methods: {
        troopsGenerator() {
            //生成卡牌
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
        },
        placeTroops(row, all) {
            //放置卡牌
            let targets = _.cloneDeep(row);
            let temp = [];

            //验证牌库所选牌是否符合条件
            targets.map((target) => {
                for (let i = 0; i < this.activeTroops.length; i++) {
                    if (target.type == this.myTroops[this.activeTroops[i]].type && target.num > 0) {
                        target.num -= this.myTroops[this.activeTroops[i]].num;
                        temp.push(this.activeTroops[i]);
                        this.activeTroops.splice(i, 1);
                        i--;
                    }
                }
            });

            //行符合条件后
            if (targets.every((val) => val.num < 1)) {
                let tempSort = temp.sort((a, b) => b - a);
                row.map((item) => {
                    return (item.ok = true);
                });
                tempSort.map((item) => {
                    this.myTroops.splice(item, 1);
                });
                this.myTroopsNum -= temp.length;

                //城符合条件后，加入我方城池
                if (all.every((items) => items.every((item) => item.ok))) {
                    this.deleteOk(this.pubCastles, this.castleSelected);
                    this.pubCastles.map((family) => {
                        family.familyCastles.map((castle, i) => {
                            if (castle.id == this.castleSelected) {
                                let x = { ...family };
                                family.familyCastles.splice(i, 1);
                                x.familyCastles = [castle];
                                if (this.myCastles.filter((q) => q.family === x.family).length < 1)
                                    return this.myCastles.push(x);
                                else
                                    return this.myCastles.map((p) => {
                                        if (p.family === x.family)
                                            return p.familyCastles.push(castle);
                                    });
                            }
                        });
                    });

                    return this.stepGenerator();
                }
                this.troopsGenerator();
            }

            //复位选择卡牌项
            while (this.activeTroops.length > 0) {
                this.activeTroops.pop();
            }
        },
        castleSelect(id) {
            //城池选择
            if (this.castleSelected < 0 && !this.loading) {
                this.castleSelected = id;
            } else if (this.castleSelected !== id) {
                this.snackbar = true;
                this.text = '选定攻击目标后无法改变';
            }
        },
        stepGenerator(next) {
            //下一步生成
            this.myTroopsNum = 7;
            this.deleteOk(this.pubCastles, this.castleSelected);
            this.castleSelected = -1;
            this.step++;

            this.troopsGenerator();
        },
        deleteOk(obj, deleteId) {
            //删除已成功键值
            obj.map((family) => {
                family.familyCastles.map((castle) => {
                    if (castle.id === deleteId) {
                        castle.troopsNeeded.map((items) => {
                            items.map((item) => {
                                if (item.ok) {
                                    delete item.ok;
                                    return false;
                                }
                            });
                        });
                    }
                });
            });
        },
    },

    created() {
        this.pubCastles = _.cloneDeep(this.castleTypes);
        this.stepGenerator();
        this.totalStep = this.$store.getters.getTotalStep;
    },
};
</script>

<style scoped lang="scss">
body {
    color: #e3dccb;
}
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
.back_icon {
    position: absolute;
    bottom: 0;
    width: 100%;
}
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
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
