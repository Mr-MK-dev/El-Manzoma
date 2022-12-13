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
          <punishment-types-managemet></punishment-types-managemet>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import PunishmentTypesManagemet from "@/views/high_level/renew_new/internalTaps/PunishmentTypesManagemet";

const constants = require("@/Constant").default;
export default {
  name: "RenewAdminIndex",
  components: {
    punishmentTypesManagemet: PunishmentTypesManagemet
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
        title: "أنواع العقوبات",
        id: "punishmentTypesManagemet"
      }
    ]
  })
};
</script>
