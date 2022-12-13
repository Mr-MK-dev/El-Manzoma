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
          <car_color_management></car_color_management>
        </v-tab-item>
        <v-tab-item>
          <car_type_management></car_type_management>
        </v-tab-item>

        <v-tab-item>
          <car_cargo_management></car_cargo_management>
        </v-tab-item>

        <v-tab-item>
          <car_preparation_management></car_preparation_management>
        </v-tab-item>

        <v-tab-item>
          <car_usage_management></car_usage_management>
        </v-tab-item>
        <v-tab-item>
          <boats_type_management></boats_type_management>
        </v-tab-item>
        <v-tab-item>
          <signal_weapons_types_management></signal_weapons_types_management>
        </v-tab-item>
        <v-tab-item>
          <signal_weapon_management></signal_weapon_management>
        </v-tab-item>
        <v-tab-item>
          <systems_type_management></systems_type_management>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import Car_color_management from "@/views/arming/armingAdmin/internalTabs/car_color_management";
import Car_type_management from "@/views/arming/armingAdmin/internalTabs/car_type_management";
import Car_cargo_management from "@/views/arming/armingAdmin/internalTabs/car_cargo_management";
import Car_preparation_management from "@/views/arming/armingAdmin/internalTabs/car_preparation_management";
import Car_usage_management from "@/views/arming/armingAdmin/internalTabs/car_usage_management";
import Boats_type_management from "@/views/arming/armingAdmin/internalTabs/boats_type_management";
import Signal_weapons_types_management from "@/views/arming/armingAdmin/internalTabs/signal_weapons_types_management";
import Signal_weapon_management from "@/views/arming/armingAdmin/internalTabs/signal_weapons_management";
import systems_type_management from "@/views/arming/armingAdmin/internalTabs/systems_type_management";

const constants = require("@/Constant").default;
export default {
  name: "armingAdmin",
  components: {
    Signal_weapon_management,
    Signal_weapons_types_management,
    Car_usage_management,
    Car_preparation_management,
    Car_cargo_management,
    Car_type_management,
    Car_color_management,
    Boats_type_management,
    systems_type_management
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
        title: "الوان المركبات",
        id: "car_color_management"
      },
      {
        title: "انواع المركبات",
        id: "car_type_management"
      },
      {
        title: "حمولة المركبات",
        id: "car_cargo_management"
      },
      {
        title: "تجهيزات المركبات",
        id: "car_preparation_management"
      },
      {
        title: "استخدامات المركبات",
        id: "car_usage_management"
      },
      {
        title: "أنواع اللنشات",
        id: "boats_type_management"
      },
      {
        title: "أنواع اجهزة الاشارة",
        id: "signal_weapon_type_management"
      },
      {
        title: "ادارة أجهزة الاشارة",
        id: "signal_weapon_management"
      },
      {
        title: "ادارة المنظومات",
        id: "systems_type_management"
      }
    ]
  })
};
</script>
