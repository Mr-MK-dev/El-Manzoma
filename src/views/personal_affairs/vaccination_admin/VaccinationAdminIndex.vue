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
          <diseases></diseases>
        </v-tab-item>
        <v-tab-item>
          <vaccines></vaccines>
        </v-tab-item>
        <v-tab-item>
          <Hospitals></Hospitals>
        </v-tab-item>
        <v-tab-item>
          <CertificatesWithRewards></CertificatesWithRewards>
        </v-tab-item>
        <v-tab-item>
          <GradesWithRewards></GradesWithRewards>
        </v-tab-item>
        <v-tab-item>
          <ReasonsDecisions></ReasonsDecisions>
        </v-tab-item>
        <v-tab-item>
          <Wars></Wars>
        </v-tab-item>
        <v-tab-item>
          <SoliderTypesWithRewards></SoliderTypesWithRewards>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import Diseases from "./InternalTabs/Diseases";
import VaccinesVue from "./InternalTabs/Vaccines";
import HospitalManagement from "./InternalTabs/hospital_management";
import CertificatesWithRewards from "@/views/personal_affairs/vaccination_admin/InternalTabs/CertificatesWithRewards";
import GradesWithRewards from "@/views/personal_affairs/vaccination_admin/InternalTabs/GradesWithRewards";
import ReasonsDecisions from "@/views/personal_affairs/vaccination_admin/InternalTabs/ReasonsDecisions";
import Wars from "@/views/personal_affairs/vaccination_admin/InternalTabs/Wars";
import SoliderTypesWithRewards from "@/views/personal_affairs/vaccination_admin/InternalTabs/SoldierTypesWithRewards";

export default {
  name: "vaccinationAdmin",
  components: {
    SoliderTypesWithRewards: SoliderTypesWithRewards,
    Wars: Wars,
    ReasonsDecisions: ReasonsDecisions,
    GradesWithRewards: GradesWithRewards,
    CertificatesWithRewards: CertificatesWithRewards,
    Diseases: Diseases,
    Vaccines: VaccinesVue,
    Hospitals: HospitalManagement
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
        title: "الامراض",
        id: "diseases"
      },
      {
        title: "التطعيمات",
        id: "vaccines"
      },
      {
        title: "ادارة المستشفيات",
        id: "hospital_management"
      },
      {
        title: "ادارة تكريمات الشهادات",
        id: "CertificatesWithRewards"
      },
      {
        title: "ادارة تكريمات الابوين المثاليين",
        id: "GradesWithRewards"
      },
      {
        title: "ادارة قرارات السببية",
        id: "ReasonsDecisions"
      },
      {
        title: "ادارة الحروب",
        id: "Wars"
      },
      {
        title: "ادارة تكريمات الجندي المثالي",
        id: "SoliderTypesWithRewards"
      }
    ]
  })
};
</script>
