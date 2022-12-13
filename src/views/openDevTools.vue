<template>
  <div></div>
</template>

<script>
export default {
  name: "home",
  components: {},
  async mounted() {
    await this.apiSilent("server/open-console");
  },
  data: () => ({}),
  methods: {},
  sockets: {}
};
</script>
