<template>
  <div>
    <v-tabs
      show-arrows
      height="60"
      slider-size="3"
      center-active
      v-model="window"
      :slider-color="windows[window].red ? 'black' : 'primary'"
    >
      <template
        v-for="(w, i) in windows.filter(
          w =>
            !conscripte.typeId ||
            !w.typeId ||
            w.typeId.includes(conscripte.typeId)
        )"
      >
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
          <v-chip
            color="grey lighten-5"
            class="ms-3 grey--text text--darken-4"
            v-if="
              (w.counter && w.counter > 0) ||
                (externals[w.id] &&
                  Array.isArray(externals[w.id]) &&
                  externals[w.id].length > 0)
            "
          >
            {{
              externals[w.id] && Array.isArray(externals[w.id])
                ? externals[w.id].length
                : w.counter
            }}
          </v-chip>
        </v-tab>
      </template>
    </v-tabs>
    <v-divider></v-divider>
    <v-card
      color="transparent"
      tile
      flat
      class="px-0 mx-0"
      :loading="loading || local_loading"
      :disabled="loading || local_loading"
    >
      <v-card-title class="primary--text">
        {{ windows[window].title }}
        <v-spacer></v-spacer>
        <v-card-actions class="pa-0">
          <v-btn
            class="px-4 me-3"
            to="/soldiers_plus"
            color="primary"
            large
            exact
            outlined
          >
            <v-icon class="me-3">mdi-backspace-outline</v-icon>
            عودة للقائمة
          </v-btn>

          <print-conscripte-profile
            class="me-3"
            :conscripte="conscripte"
          ></print-conscripte-profile>
          <v-btn
            v-if="$store.state.currentUser.canEdit"
            class="px-6"
            color="primary"
            large
            @click="Edit()"
          >
            تعديل الفرد
          </v-btn>
        </v-card-actions>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-tabs-items class="transparent" v-model="window">
          <v-tab-item>
            <new-profile :conscripteObJ.sync="conscripte"></new-profile>
          </v-tab-item>
          <v-tab-item>
            <followers-card :conscripte.sync="conscripte"></followers-card>
          </v-tab-item>
          <v-tab-item>
            <basic-profile-honors
              :conscripte.sync="conscripte"
            ></basic-profile-honors>
          </v-tab-item>
          <v-tab-item>
            <preuint-card :conscripte.sync="conscripte"></preuint-card>
          </v-tab-item>
          <v-tab-item>
            <prevlevelup-card :conscripte.sync="conscripte"></prevlevelup-card>
          </v-tab-item>
          <v-tab-item>
            <tahel-card :conscripte.sync="conscripte"></tahel-card>
          </v-tab-item>
          <v-tab-item>
            <traval-card :conscripte.sync="conscripte"></traval-card>
          </v-tab-item>
          <v-tab-item>
            <courts-card :conscripte.sync="conscripte"></courts-card>
          </v-tab-item>
          <v-tab-item>
            <neshans-card :conscripte.sync="conscripte"></neshans-card>
          </v-tab-item>
          <v-tab-item>
            <grades-card :conscripte.sync="conscripte"></grades-card>
          </v-tab-item>
          <v-tab-item>
            <family-card :conscripte.sync="conscripte"></family-card>
          </v-tab-item>
          <v-tab-item>
            <previous-jobs-card
              :conscripte.sync="conscripte"
            ></previous-jobs-card>
          </v-tab-item>
          <v-tab-item>
            <trainee-ship-card
              :conscripte.sync="conscripte"
            ></trainee-ship-card>
          </v-tab-item>
          <v-tab-item>
            <fitting-card :conscripte.sync="conscripte"></fitting-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import BasicProfileHonors from "@/components/sections/tasgeel/soldier_plus/soldier_profile/basic_profile/cards/allhonors";
let loadView = function(name) {
  return function(resolve) {
    require([
      `@/components/sections/tasgeel/soldier_plus/soldier_profile/basic_profile/cards/${name}.vue`
    ], resolve);
  };
};
const constants = require("@/Constant").default;

export default {
  name: "basic-profile",
  components: {
    BasicProfileHonors,
    FollowersCard: loadView("followers"),
    PreuintCard: loadView("preuint"),
    PrevlevelupCard: loadView("prevlevelup"),
    TahelCard: loadView("tahel"),
    TravalCard: loadView("Traval"),
    CourtsCard: loadView("courts"),
    NeshansCard: loadView("neshans"),
    GradesCard: loadView("grades"),
    FamilyCard: loadView("family"),
    PreviousJobsCard: loadView("PreviousJobs"),
    TraineeShipCard: loadView("traineeships"),
    FittingCard: loadView("fitting"),
    NewProfile: () =>
      import(
        "@/components/sections/tasgeel/soldier_plus/soldier_profile/basic_profile/cards/NewProfile"
      ),
    PrintConscripteProfile: () =>
      import("@/components/items/military_printer/conscripte-profile.vue")
  },
  props: {
    demobilizationObj: {
      type: Object,
      default: () => ({})
    },
    soldier_id: {
      type: String,
      default: ""
    },
    conscripte: {
      type: Object,
      default: () => ({})
    },
    externals: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.init();
    if (this.conscripte.Type == constants.serviceTypesMap.highLevel) {
      this.windows = [
        ...this.windows,
        ...[
          {
            title: "الوحدات السابقة",
            id: "PreuintCard"
          },
          {
            title: "الترقيات",
            id: "PrevlevelupCard"
          },
          {
            title: "التأهيلات",
            id: "TahelCard"
          },
          {
            title: "السفريات",
            id: "TravalCard"
          },
          {
            title: "المحاكم والعقوبات",
            id: "CourtsCard"
          },
          {
            title: "الأنواط والنياشين",
            id: "NeshansCard"
          },
          {
            title: "الكفاءة",
            id: "GradesCard"
          },
          {
            title: "الأقارب",
            id: "FamilyCard"
          },
          {
            title: "الخبرات السابقة",
            id: "PreviousJobsCard"
          },
          {
            title: "الفرق",
            id: "TraineeShipCard"
          },

          {
            title: "التناسق",
            id: "FittingCard"
          }
        ]
      ];
    }
  },
  watch: {},
  computed: {
    computed_selects() {
      let selects = this.selects;
      return selects;
    }
  },
  data: () => ({
    local_loading: false,
    print_options: [
      {
        title: "كارت مجند",
        printFunction: "print_card"
      }
    ],
    window: 0,
    windows: [
      {
        title: "الأساسية",
        id: "main"
      },
      {
        title: "الملاحق",
        id: "followers"
      },
      {
        title: "التكريمات",
        id: "BasicProfileHonors"
      }
    ],
    date_dialogs: {},

    selects: {}
  }),

  methods: {
    Edit() {
      this.goThere(
        `/add_conscripte/${this.conscripte.ID}/${this.conscripte.Type}`
      );
    },
    printConscripteProfile() {}
  }
};
</script>
