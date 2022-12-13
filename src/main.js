import "whatwg-fetch";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueLocalStorage from "vue-localstorage";
import adapter from "webrtc-adapter";
import axios from "axios";
import VueAxios from "vue-axios";
window.adapter = adapter;
Vue.use(VueLocalStorage, {
  name: "ls",
  bind: true
});
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
let
    servers = {
  local: "127.0.0.1",
  remote: "192.9.201.77",
  home: "192.168.1.5",
  hostednetwork: "192.168.137.1",
  moqadem: "192.9.201.30",
  hotspot: "169.254.219.1",
  nozom: "192.9.201.15",
  moqadm: "192.168.1.62"
},
  serverLink = `http://192.168.1.62:8082`;
Vue.mixin({
  data: () => ({
    serverLink
  })
});
let socket = io(serverLink);
Vue.use(VueSocketIOExt, socket);
// import WebRTC from "vue-webrtc";
// Vue.use(WebRTC);
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@openfonts/cairo_arabic";
import "@mdi/font/css/materialdesignicons.css";

import { mask } from "vue-the-mask"; // Note: I have modified this module core in 'node_modules' folder.
Vue.directive("mask", mask);

// Vue moment gives us a human readable time ago like " 3 minutes ago "
Vue.use(require("vue-moment"));

// Custom scrollbar
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";

Vue.component("vue-custom-scrollbar", vueCustomScrollbar);

// Charts
import VueApexCharts from "vue-apexcharts";
Vue.component("apexChart", VueApexCharts);

// App fab for each page
Vue.component("app-fab", () => import("@/components/global/app-fab.vue"));

// Military Advanced Printer and Table
Vue.component("military-printer", () =>
  import("@/components/items/military_printer/index.vue")
);
Vue.component("printer-menu", () =>
  import("@/components/items/military_printer/printer-menu.vue")
);
Vue.component("military-table", () =>
  import("@/components/items/military_table/index.vue")
);

// Table Header Groups && Filters
Vue.component("table-header-groups", () =>
  import("@/components/global/table/header-groups.vue")
);

Vue.component("trible-num", () =>
    import("@/components/items/TribleNum.vue"));

Vue.component("table-header-filters", () =>
  import("@/components/global/table/header-filters.vue")
);
Vue.component("table-bulider", () =>
  import("@/components/global/table/table-bulider.vue")
);
Vue.component("analytical-table-bulider", () =>
  import("@/components/global/table/analytical-table-bulider.vue")
);

Vue.component("search-bulider", () =>
  import("@/components/shared/CustomSearch.vue")
);

Vue.component("editor-dialog-bulider", () =>
  import("@/components/shared/CustomDialog.vue")
);
Vue.component("info-dialog-bulider", () =>
  import("@/components/shared/InfoDialog.vue")
);
Vue.component("soldier-search", () =>
  import("@/components/shared/SoldierSearch.vue")
);
Vue.component("rateb-search", () =>
  import("@/components/shared/RatebSearch.vue")
);
// Vue.component("table-header-filters-old", () =>
//   import("@/components/global/table/header-filters-old.vue")
// );
Vue.component("table-footer-filters", () =>
  import("@/components/global/table/footer-filters.vue")
);

// Scrollbar
Vue.component("perfect-scrollbar", () => import("vue-perfect-scrollbar"));

// dynamic-links like Facebook and Social Apps
Vue.component("dynamic-link", () => import("@/components/items/dynamic-link"));

// Import Custom Sass (SCSS)
import "@/scss/main.scss";

// Mixins
import "@/mixin/index.js";

// Server Mixins
import "@/server-sequelize/sender";

// upload mixins
import "@/plugins/upload.js";

Vue.config.productionTip = false;

let { ipcRenderer } = window.require("electron");

Vue.use(VueAxios, axios);

let app;
if (!app) {
  app = new Vue({
    async created() {
      let colours = await this.api("global/get_all", { table: "Colours" });

      colours.data.map(
        ele => (this.$vuetify.theme.themes.light[ele.Name] = ele.hex)
      );
      this.api("server/is-webwin-opened", { noAsync: true })
        .then(({ data: isWebwinOpened }) => {
          this.$store.commit("setWebwinOpened", isWebwinOpened);
          if (isWebwinOpened) {
            this.$router.push("/websites");
          }
          let ls_user = this.$ls.get("currentUser"),
            user = ls_user ? JSON.parse(ls_user) : null;
          if (user) {
            this.api("tables/users/sign_in", {
              username: user.username,
              password: user.password
            })
              .then(record => {
                let data = record.data;
                if (record.ok && data && data.isVisible) {
                  // console.log("I'm here logging")
                  this.$set(this.$store.state, "currentUser", record.data);
                  // this.fetchUnseenMsgs();
                  //   this.$router.push("/InternalFollowup");
                  //
                  // if(!record.data.isAdmin){
                  // }
                }
                this.hidePreloader();
              })
              .catch(error => {
                console.log("data", error);

                this.hidePreloader();
                this.showError(error);
              });
          } else {
            this.hidePreloader();
          }
        })
        .catch(error => {
          console.log(error);
          this.hidePreloader();
        })
        .finally(async () => {
          /**
           * -----------------------------------
           * Turn on Firewall and add some rules
           * -----------------------------------
           */
          // let x = await this.api("server/firewall");
        });
    },

    async mounted() {
      let current_server = await this.api("server/name", { noAsync: true });

      setInterval(async () => {
        if (this.$store.state && this.$store.state.currentUser) {
          let user = await this.apiSilent("global/get_one", {
            table: "users",
            where: {
              userId: this.$store.state.currentUser.userId
            }
          });
          if (user.data.forceClose && !user.data.isAdmin) {
            // let user = await this.api("global/update_one", {
            //   table: "users",
            //   where: {
            //     userId: this.$store.state.currentUser.userId
            //   },
            //   update: {
            //     forceClose: false
            //   }
            // });

            ipcRenderer.send("force-close");
          }
        } else {
          this.counter++;
          console.log(this.counter);
          if (this.counter > 5) {
            ipcRenderer.send("force-close");
          }
        }
      }, 60 * 1000);
      this.$set(this.$store.state, "current_server", current_server.data);
    },
    methods: {
      newMessage(data) {
        console.log("data", data);
      },
      recievedMsg(msg) {
        console.log("data", msg);
      }
    },
    sockets: {
      recievedMsg(msg) {
        if (
          msg.user2 == this.$store.state.currentUser.userId &&
          !this.isCurrentRoute("messenger")
        ) {
          this.showNewMessage(msg.otherUserName + " لديك رسالة جديدة من ");
        }
        console.log("data", msg);
      }
    },
    data: {
      // themes,
      counter: 0
    },
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
}
window.appVue = app;
window.onunload = e => {
  var isSaved = localStorage.getItem("saveLogin");
  if (!isSaved || isSaved == "false") {
    localStorage.removeItem("currentUser");
  }
};
