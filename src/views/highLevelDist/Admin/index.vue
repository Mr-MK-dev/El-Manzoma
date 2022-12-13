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
          <jobs-management></jobs-management>
        </v-tab-item>
        <v-tab-item>
          <unit-management></unit-management>
        </v-tab-item>
        <v-tab-item>
          <transfer-list-effects></transfer-list-effects>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import JobsManagement from "@/views/highLevelDist/Admin/internalTabs/JobsManagement.vue";
import UnitManagement from "@/views/highLevelDist/Admin/internalTabs/UnitManagement.vue";
import TransferListEffects from "@/views/highLevelDist/Admin/internalTabs/TransferListEffects.vue";

const constants = require("@/Constant").default;
export default {
  name: "highLevelAdmin",
  components: {
    jobsManagement: JobsManagement,
    unitManagement: UnitManagement,
    transferListEffects: TransferListEffects
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
        title: "أضافة وظيفة",
        id: "jobsManagement"
      },
      {
        title: "إدارة الوحدات",
        id: "unitManagement"
      },
      {
        title: "إدارة مؤثرات النشرة",
        id: "transferListEffects"
      }
    ]
  })
};
</script>
