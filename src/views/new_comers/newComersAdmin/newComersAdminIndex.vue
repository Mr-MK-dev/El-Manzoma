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
          <situatuin-states></situatuin-states>
        </v-tab-item>
        <v-tab-item>
          <college-management></college-management>
        </v-tab-item>
        <v-tab-item>
          <specializations></specializations>
        </v-tab-item>
        <v-tab-item>
          <rec-stages></rec-stages>
        </v-tab-item>
        <v-tab-item>
          <city-management></city-management>
        </v-tab-item>
        <v-tab-item>
          <direction-management></direction-management>
        </v-tab-item>
        <v-tab-item>
          <centre-management></centre-management>
        </v-tab-item>
        <v-tab-item>
          <effects></effects>
        </v-tab-item>
        <v-tab-item>
          <arrival-to-training-center-dates></arrival-to-training-center-dates>
        </v-tab-item>
        <v-tab-item>
          <recu-start-dates></recu-start-dates>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import Effects from "@/views/new_comers/newComersAdmin/internalTabs/effects";
import ArrivalToTrainingCenterDates from "@/views/new_comers/newComersAdmin/internalTabs/ArrivalToTrainingCenterDates";
import RecuStartDates from "@/views/new_comers/newComersAdmin/internalTabs/RecuStartDates";
let loadView = function(name) {
  return function(resolve) {
    require([
      `@/views/new_comers/newComersAdmin/internalTabs/${name}.vue`
    ], resolve);
  };
};
const constants = require("@/Constant").default;

export default {
  name: "newComersAdmin",
  components: {
    ArrivalToTrainingCenterDates,
    Effects,
    RecuStartDates,
    situatuinStates: loadView("situiationStates"),
    collegeManagement: loadView("colleges_management"),
    specializations: loadView("Specializations"),
    recStages: loadView("RecStages"),
    cityManagement: loadView("city_management"),
    directionManagement: loadView("DirectionManagement"),
    centreManagement: loadView("CentreManagement"),
    effects: loadView("effects"),
    arrivalDates: loadView("ArrivalToTrainingCenterDates")
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // this.init();
  },
  data: () => ({
    local_loading: false,
    window: 0,
    windows: [
      {
        title: "المواقف",
        id: "situatuinStates"
      },
      {
        title: "الكليات",
        id: "collegeManagement"
      },
      {
        title: "التخصصات",
        id: "specializations"
      },
      {
        title: "إدارة مراحل التجنيد",
        id: "recStages"
      },
      {
        title: "إدارة المحافظات ",
        id: "cityManagement"
      },
      {
        title: "إدارة الإتجاهات ",
        id: "directionManagement"
      },
      {
        title: "إدارة المراكز ",
        id: "centreManagement"
      },
      {
        title: "مؤثرات المرحلة",
        id: "effects"
      },
      {
        title: "ادارة تواريخ ترحيل مركز التدريب و الوحدات",
        id: "arrivalDates"
      },
      {
        title: "تواريخ التجنيد",
        id: "recuStartDates"
      }
    ]
  })
};
</script>
