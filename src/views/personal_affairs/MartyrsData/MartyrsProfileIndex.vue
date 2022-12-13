<template>
  <div>
    <profile
      v-if="$route.params.type == 'شهيد'"
      :id.sync="this.$route.params.id"
    ></profile>

    <MosabProfile
      v-if="$route.params.type == 'مصاب'"
      :id.sync="this.$route.params.id"
    ></MosabProfile>
    <DeathProfile
      v-if="$route.params.type == 'وفاة'"
      :id.sync="this.$route.params.id"
    ></DeathProfile>
    <v-tabs
      show-arrows
      height="60"
      slider-size="3"
      center-active
      v-model="window"
      :slider-color="windows[window].red ? 'black' : 'primary'"
    >
      <template v-for="(w, i) in windows.filter(w => w.id)">
        <v-tab
          :disabled="loading || local_loading"
          v-show="!w.removed"
          :active-class="`${w.red ? 'white--text' : 'primary--text'}`"
          :class="
            ` ls-0 text-body-1 ${w.red ? 'error white--text' : 'grey--text'}`
          "
          :key="i"
        >
          {{ w.title }}
          <v-chip color="grey lighten-5" class="ms-3 grey--text text--darken-4">
          </v-chip>
        </v-tab>
      </template>
    </v-tabs>

    <v-divider></v-divider>
    <v-card-text>
      <v-tabs-items class="transparent" v-model="window">
        <v-tab-item>
          <demands
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></demands>
        </v-tab-item>
        <v-tab-item>
          <employment
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></employment>
        </v-tab-item>
        <v-tab-item>
          <hajj
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></hajj>
        </v-tab-item>
        <v-tab-item>
          <honors
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></honors>
        </v-tab-item>
        <v-tab-item>
          <wifes-and-sons
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></wifes-and-sons>
        </v-tab-item>
        <v-tab-item>
          <parents-and-brothers
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></parents-and-brothers>
        </v-tab-item>
        <v-tab-item>
          <housing
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></housing>
        </v-tab-item>
        <v-tab-item>
          <financial-dues
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></financial-dues>
        </v-tab-item>
        <v-tab-item>
          <public-name
            :id.sync="this.$route.params.id"
            :militaryType.sync="this.$route.params.militaryType"
            :Kind.sync="this.$route.params.type"
          ></public-name>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import Profile from "@/views/personal_affairs/MartyrsData/Profile";
import MosabProfile from "@/views/personal_affairs/MartyrsData/MosabProfile";
import DeathProfile from "@/views/personal_affairs/MartyrsData/DeathProfile";

import Demands from "@/views/personal_affairs/MartyrsData/Demands";
import Housing from "@/views/personal_affairs/MartyrsData/Housing";
import Employment from "@/views/personal_affairs/MartyrsData/Employment";
import FinancialDues from "@/views/personal_affairs/MartyrsData/FinancialDues";
import Hajj from "@/views/personal_affairs/MartyrsData/Hajj";
import Honors from "@/views/personal_affairs/MartyrsData/Honors";
import WifesAndSons from "@/views/personal_affairs/MartyrsData/MartyrsWifeAndSons";
import ParentsAndBrothers from "@/views/personal_affairs/MartyrsData/ParentsAndBrothers";
import PublicName from "@/views/personal_affairs/MartyrsData/PublicName";
// let loadView = function(name) {
//   return function(resolve) {
//     require([
//
//       `src/views/personal_affairs/MartyrsData/${name}.vue`
//     ], resolve);
//   };
// };
const constants = require("@/Constant").default;
export default {
  name: "MartyrsProfile",
  components: {
    DeathProfile,
    PublicName,
    ParentsAndBrothers,
    WifesAndSons,
    Housing,
    Honors,
    Hajj,
    FinancialDues,
    Employment,
    Profile,
    Demands,
    MosabProfile
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    //this.init();
    if (this.$route.params.type == "شهيد") {
      this.$set(this, "windows", [
        ...this.windows.push(
          {
            title: "المستحقات",
            id: "FinancialDues"
          },
          {
            title: "اطلاق اسم شهيد",
            id: "PublicName"
          }
        )
      ]);
    }
  },
  data: () => ({
    local_loading: false,
    window: 0,
    windows: [
      {
        title: "التواصل والمطالب",
        id: "Demands"
      },
      {
        title: "التوظيف",
        id: "Employment"
      },
      {
        title: "الحج والعمرة",
        id: "Hajj"
      },
      {
        title: "التكريمات",
        id: "Honors"
      },
      {
        title: "الزوجات والأبناء",
        id: "WifesAndSons"
      },
      {
        title: "الأباء والإخوة",
        id: "ParentsAndBrothers"
      },
      {
        title: "الإسكان",
        id: "Housing"
      }
      // {
      //   title: "اطلاق اسم شهيد",
      //   id: "PublicName"
      // }
    ]
  })
};
</script>
