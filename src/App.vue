<template>
  <div>
    <websites-layout
      v-if="
        $route.fullPath.includes('/websites') && $store.state.isWebwinOpened
      "
    ></websites-layout>
    <main-layout v-else></main-layout>
    <v-overlay :value="updating" opacity="0.9">
      <v-progress-circular
        :rotate="360"
        :size="300"
        :value="loading"
        color="primary"
      >
        <h1>{{ loading / 20 }}</h1>
      </v-progress-circular>

      <h1 style="text-align:center;margin-top:20px">يتم الان تحديث المنظومة</h1>
      <p style="text-align:center;margin-top:20px">برجاء الانتظار</p>
    </v-overlay>
  </div>
</template>

<script>
let { ipcRenderer } = window.require("electron");

export default {
  name: "App",
  components: {
    MainLayout: () => import("@/layouts/main.vue")
  },
  async mounted() {
    this.forceUpdate();
  },
  data: () => ({
    updating: false,
    loading: 100
  }),
  methods: {
    // async forceUpdate() {
    //   setInterval(async () => {
    //     console.log(
    //       "this.$store.state.currentUser",
    //       this.$store.state
    //     );
    //     if (this.$store.state.currentUser) {
    //       let user = await this.api("global/get_one", {
    //         table: "users",
    //         where: {
    //           userId: this.$store.state.currentUser.userId
    //         }
    //       });
    //       console.log(user.data);
    //     }
    //   }, 60 * 1000);
    // }
  }
};
</script>
