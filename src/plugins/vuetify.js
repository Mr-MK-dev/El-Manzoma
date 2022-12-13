import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import ar from "@/langs/ar";
import en from "@/langs/en";
import VuetifyConfirm from "vuetify-confirm";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    dark: false,
    themes: {
      light: {
        primary: window.isFullApp === "true" ? "#cfcfcf" : "#14a74c",
        sidenav: window.isFullApp === "true" ? "#424242" : "#14a74c",
        sidenavgradient_1: "#cfcfcf",
        sidenavgradient_2: "#424242",
        accent: "#82B1FF",
        secondary: "#424242",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        white: "#FFFFFF",
        girly: "#F764b2"
      },
      dark: {
        primary: window.isFullApp === "true" ? "#00b0f0" : "#1acf5f", // #FFFF00 - #ff6c07
        sidenav: window.isFullApp === "true" ? "#00b0f0" : "#1acf5f",
        secondary: "#CACACA",
        // anchor: "#FFFF00",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        // Editions
        white: "#FFFFFF", // 000000
        girly: "#F764b2",
        black: "#000000"
      }
    }
  },
  lang: {
    locales: { ar, en },
    current: "ar"
  },
  rtl: true,
  icons: {
    iconfont: "mdi"
  }
});

Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: "موافق",
  buttonFalseText: "رجوع",
  color: "success",
  icon: "warning",
  title: "Warning",
  width: 350,
  property: "$confirm"
});

export default vuetify;
