<template>
  <v-snackbar
    v-model="open"
    color="white"
    :class="`${color}--text`"
    :timeout="timeout"
    top
  >
    <v-icon :color="color">{{ icon }}</v-icon>
    {{ mes }}
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  props: {
    icon: { type: String, default: "mdi-home" },
    color: { type: String, default: "red" },
    open: { type: Boolean, default: true },
    mes: { type: String, default: "123" },
    timeout: { type: Number, default: 2000 },
  },
  methods: {
    info(mes) {},
    error(mes) {},
    warning(mes) {},
    success(mes) {},
  },
};
</script>

<style lang="scss">
.v-snack {
  .v-snack__content {
    justify-content: flex-start;
    i {
      margin-right: 10px;
    }
  }
}
</style>
