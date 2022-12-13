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
          <fitting-rule-management></fitting-rule-management>
        </v-tab-item>
        <v-tab-item>
          <trainee-ship></trainee-ship>
        </v-tab-item>
        <!--
        <v-tab-item>
          <add-transfer></add-transfer>
        </v-tab-item>
        <v-tab-item>
          <jobs-management></jobs-management>
        </v-tab-item>
        -->
        <v-tab-item>
          <tahel-courses-management></tahel-courses-management>
        </v-tab-item>

        <v-tab-item>
          <TraineeShipCollection></TraineeShipCollection>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import fittingRuleManagement from "@/views/high_level/highLevelAdmin/internalTabs/FittingRuleManagement";
import traineeShip from "@/views/high_level/highLevelAdmin/internalTabs/TraineeShip";
import addTransfer from "@/views/high_level/highLevelAdmin/internalTabs/AddTransfer";
import JobsManagement from "@/views/high_level/highLevelAdmin/internalTabs/JobsManagement";
import TahelCoursesManagement from "@/views/high_level/highLevelAdmin/internalTabs/TahelCoursesManagement";
import TraineeShipCollection from "@/views/high_level/highLevelAdmin/internalTabs/TraineeShipCollection";

const constants = require("@/Constant").default;
export default {
  name: "highLevelAdmin",
  components: {
    fittingRuleManagement: fittingRuleManagement,
    traineeShip: traineeShip,
    addTransfer: addTransfer,
    jobsManagement: JobsManagement,
    tahelCoursesManagement: TahelCoursesManagement,
    TraineeShipCollection: TraineeShipCollection
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    //this.init();
  },
  data: () => ({
    local_loading: false,
    window: 0,
    windows: [
      {
        title: "إدارة شروط التناسق",
        id: "fittingRuleManagement"
      },
      {
        title: "إدارة الفرق",
        id: "traineeShip"
      },
      // {
      //   title: "أضافة نقل",
      //   id: "addTransfer"
      // },
      // {
      //   title: "أضافة وظيفة",
      //   id: "jobsManagement"
      // },
      {
        title: "أضافة تأهيل",
        id: "tahelCoursesManagement"
      },
      {
        title: "أضافة تجميع فرق",
        id: "TraineeShipCollection"
      }
    ]
  })
};
</script>
