<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center">
                <v-img
                    alt="Vuetify Logo"
                    class="shrink mr-2"
                    contain
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                    transition="scale-transition"
                    width="40"
                />

                <v-img
                    alt="Vuetify Name"
                    class="shrink mt-1 hidden-sm-and-down"
                    contain
                    min-width="100"
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
                    width="100"
                />
            </div>

            <v-spacer></v-spacer>
            <v-btn target="_blank" href="https://github.com/Akira-San/age-of-war" text class="mr-4">
                <span class="mr-2">GitHub</span>
                <v-icon>mdi-github</v-icon>
            </v-btn>

            <v-btn to="/" text>
                <span class="mr-2">Home</span>
                <v-icon>mdi-home</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'App',

    components: {},

    data: () => ({
        //
    }),

    created() {
        this.$nextTick(() => {
            // 禁用右键
            // document.oncontextmenu = new Function("event.returnValue=false");
            // 禁用选择
            document.onselectstart = new Function('event.returnValue=false');
        });
    },
};
</script>

<style lang="scss">
main {
    background: #f5ebe1;
}
</style>
