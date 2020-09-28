<template>
    <v-container>
        <div class="home d-flex flex-column align-center">
            <v-img alt="age of war" src="../assets/age-of-war.jpg" class="mb-4"></v-img>

            <h4 class="mb-4">
                开始玩： <router-link to="/games/age_of_war"> 战国时代</router-link>
            </h4>
            <div class="d-inline-flex align-center">
                <h3>目前规则：&nbsp;</h3>
                <span> 挑选卡牌，进攻城池；在 </span>
                <v-text-field
                    class="mx-2 mt-4 "
                    label="总步数"
                    autofocus
                    dense
                    style="width:80px;"
                    :rules="[rules.required, rules.number]"
                    maxlength="2"
                    v-model="totalStep"
                    @blur="changeTotalStep()"
                ></v-text-field>
                <span>步内，获得尽可能多的分数。</span>
            </div>
        </div>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            totalStep: 0,
            rules: {
                required: (value) => !!value || '必填项',
                number: (value) => /^[1-9]\d*$/.test(value) || '必须为正整数',
            },
        };
    },
    created() {
        this.totalStep = this.$store.getters.getTotalStep;
    },

    methods: {
        changeTotalStep() {
            this.$store.commit('setTotalStep', this.totalStep);
        },
    },
};
</script>

<style scoped lang="scss"></style>
