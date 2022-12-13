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
          <UnitesWithPointsStats :items.sync="items"></UnitesWithPointsStats>
        </v-tab-item>
        <v-tab-item>
          <units-with-rateb-level :items.sync="items"></units-with-rateb-level>
        </v-tab-item>
        <v-tab-item>
          <comparison-state :items.sync="items"></comparison-state>
        </v-tab-item>
        <v-tab-item>
          <units-with-rateb-category
            :items.sync="items"
          ></units-with-rateb-category>
        </v-tab-item>
        <v-tab-item>
          <units-with-duty :items.sync="items"></units-with-duty>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </div>
</template>

<script>
import UnitesWithPointsStats from "./internalTabs/UnitesWithPointsStats.vue";
import UnitsWithRatebLevel from "./internalTabs/UnitsWithRatebLevel.vue";
import ComparisonState from "./internalTabs/ComparisonState.vue";
import UnitsWithRatebCategory from "./internalTabs/UnitsWithRatebCategory.vue";
import UnitsWithDuty from "./internalTabs/UnitsWithDuty.vue";

export default {
  name: "highLevelAdmin",
  components: {
    UnitesWithPointsStats,
    UnitsWithRatebLevel,
    ComparisonState,
    UnitsWithRatebCategory,
    UnitsWithDuty
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
        title:
          "بيان موقف توزيع الراتب العالى بنشرة التنقلات طبقا لعدد النقاط بكل وحدة",
        id: "UnitesWithPointsStats"
      },
      {
        title: "بيان المدرجين بنشرة تنقلات الراتب العالي بالدرجات",
        id: "UnitsWithRatebLevel"
      },
      {
        title: "بيان المقارنة بنشرة تنقلات الراتب العالي",
        id: "ComparisonState"
      },
      {
        title: "بيان المدرجين بنشرة تنقلات الراتب العالي بالفئات",
        id: "UnitsWithRatebCategory"
      },
      {
        title:
          "بيان المدرجين بنشرة تنقلات الراتب العالي بالواجب المدرب عليه والعمل القائم به",
        id: "UnitsWithDuty"
      }
    ],
    items: [],
    selects: {
      NewUnitID: {
        table: "Unit",
        text: "Unit",
        value: "UnitID"
      }
    }
  }),
  async mounted() {
    await this.init();
    await this.findData();
  },
  methods: {
    async findData() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.$set(this, "currentItems", []);

      let transferList = await this.api("global/get_one", {
        table: "TransferList",
        where: {
          ID_KEY: this.$route.params.ID
        }
      });
      this.transferList = transferList.data;
      try {
        let x = await this.api("global/get_all_grouped", {
          table: "TransferAllocationSnapshot",
          include: [
            {
              model: "Rateb",
              include: [
                { model: "Unit" },
                {
                  model: "Jobs"
                },
                {
                  model: "preuint",
                  include: [
                    {
                      model: "Unit"
                    }
                  ]
                }
              ]
            },
            {
              model: "Unit"
            }
          ],
          where: {
            TransferListID: this.$route.params.ID,
            Name: this.$route.params.Name
          }
        });
        let data = x.data.map(ele => ({
          ...ele,
          preUnits: ele.Rateb.preuints
            .map(e => e.Unit?.Unit)
            .filter(el => el)
            .join(" - "),
          preDirections: ele.Rateb.preuints
            .map(e => e.Unit?.Directionforunit)
            .filter(el => el)
            .join(" - "),
          ReasonType:
            ele.ReasonType == "Recommendation"
              ? "توصية"
              : ele.ReasonType == "PreUnits"
              ? "ليست في وحداته السابقه"
              : "إلتماس",
          oldRatebIsHardWork: ele.Rateb.Unit.isHardWork
            ? "وحدة شاقة"
            : "وحدة ليست شاقة",
          newUnitIsHardWork: ele.Unit.isHardWork
            ? "وحدة شاقة"
            : "وحدة ليست شاقة",
          OldUnit: this.selects.NewUnitID.data.find(
            u => u.UnitID == ele.OldUnitID
          )
        }));
        this.$set(this, "items", data);
      } catch (error) {
        console.log(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
