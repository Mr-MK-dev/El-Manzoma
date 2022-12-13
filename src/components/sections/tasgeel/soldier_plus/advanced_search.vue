<template>
  <div>
    <search-conscriptes
      v-if="params.section == 'conscriptes'"
    ></search-conscriptes>
  </div>
</template>

<script>
let loadView = function(name) {
  return function(resolve) {
    require([
      `@/components/sections/tasgeel/soldier_plus/advanced_search/${name}.vue`
    ], resolve);
  };
};
export default {
  name: "advanced_search",
  mounted() {
    if (!this.current_section) {
      // this.$set(this, "current_id", this.params.section);
    }
  },
  components: {
    SearchConscriptes: loadView("conscriptes")
  },
  watch: {
    "params.section"(v) {
      if (v) {
        this.$set(this, "current_section", v);
      }
    }
  },
  data: () => ({
    current_section: "",
    componentName: "soldiers_plus"
  }),
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  }
};
</script>
