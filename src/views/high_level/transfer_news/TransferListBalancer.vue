<template>
  <div>
    <v-btn
      @click="actionAdd()"
      :loading="searchLoading"
      :selects="selects"
      large
      outlined
      color="primary"
    >
      إضافة وحدة على الميزان
    </v-btn>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            الدعم : {{ totals.Supply }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            السحب : {{ totals.deduction }}
          </v-card>
        </v-col>

        <v-col v-if="$route.params.type == 1" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            انتداب الي المجموعة : {{ totals.in }}
          </v-card>
        </v-col>
        <v-col v-if="$route.params.type == 1" :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            خارج المجموعة : {{ totals.out }}
          </v-card>
        </v-col>

        <v-col v-if="$route.params.type == 1" :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            اجمالي السحب : {{ totals.all }}
          </v-card>
        </v-col>

        <v-col v-if="$route.params.type == 1" :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            اجمالي المخابرات : {{ totals.allIntelligence }}
          </v-card>
        </v-col>

        <!-- <v-col v-if="$route.params.type == 1" :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            اجمالي السحب : {{ totals.deduction + totals.out }}
          </v-card>
        </v-col>

        <v-col v-if="$route.params.type == 1" :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            اجمالي الدعم : {{ totals.deduction + totals.in }}
          </v-card>
        </v-col> -->
        <v-col v-if="$route.params.type == 2" :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            الميزان : {{ totals.Supply - totals.deduction }}
          </v-card>
        </v-col>
        <v-col v-if="$route.params.type == 1" :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            الميزان :
            {{ totals.Supply - totals.deduction - totals.out + totals.in }}
          </v-card>
        </v-col>

        <!-- <v-col v-if="$route.params.type == 1" :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            اجمالي الميزان :
            {{
              totals.all -
                totals.Supply +
                totals.out -
                totals.in -
                totals.allIntelligence
            }}
          </v-card>
        </v-col> -->
      </v-row>
    </v-container>

    <div
      class="cont"
      style="
    display: flex;
    justify-content: center;
"
    >
      <div
        style="display: inline-block;width: 9%;position: relative;top: 170px;"
      >
        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item
              style="marign = 15px"
              v-for="(item, i) in itemsNames"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.value"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>

      <div style="display: inline-block; width : 88%">
        <table-bulider
          :headers="mainTable.headers"
          :printer="mainTable.printer"
          :hideSelection="true"
          :items="mainTable.items"
          :height="1200"
          :isExcel="true"
          :title="' ميزان النشرة لفئة ' + this.$route.params.category"
        >
          <template v-slot:header="{ props }">
            <thead class="v-data-table-header" style="background-color:#fff ;">
              <tr>
                <th
                  style="
    background-color: #fff !important;"
                  v-for="item in mainTable.headers.filter(ele => ele.inTable)"
                  :key="item.text + item.text.length * 3"
                  colspan="1"
                  class="text-center parent-header"
                >
                  {{ item.text }}
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-xs-right pa-4">
                {{ item.type }}
              </td>
              <template v-for="unit in units">
                <td :key="unit + item[unit]" class="text-xs-right pa-4">
                  <v-chip :color="item.color" @click="handelChange(item, unit)">
                    {{ item[unit] }}
                  </v-chip>
                </td>
              </template>
            </tr>
          </template>
        </table-bulider>
      </div>
    </div>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="balancer"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="addUnitObject.model"
      :loading="addUnitObject.loading"
      :fields="addUnitTable.headers"
      :selects="selects"
      :data="addBalancer"
      @on-submit="addUnit()"
      @on-close="addUnitObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<style>
.cont .v-list-item {
  margin: 25px 0;
}
</style>

<script>
const lodash = require("lodash");
const constants = require("../../../Constant").default;

export default {
  name: "TransferListBalancer",
  watch: {
    $route() {
      // TODO: react to navigation event.
      // params cotains the current route parameters
      console.log("asdasdasdas", "asdalsdhd");
    }
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },

  mounted() {
    this.init();
    this.findItems({});
    console.log(this.$route.params.category);
  },
  data: () => ({
    balancer: {},
    addBalancer: {},
    itemsNames: [],
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    addUnitObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    totals: {
      deduction: 0,
      Supply: 0
    },
    listType: "all",
    searchLoading: false,
    selects: {
      RatebLevel: {
        data: constants.ratebLevels
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      RatebCategory: constants.SoldierCategory
    },
    mainTable: {
      headers: [],
      items: [],
      printer: {},
      printedData: {}
    },
    addUnitTable: {
      headers: [
        {
          text: "الوحدة",
          value: "UnitID",
          searchValue: "UnitID",
          sortable: false,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    units: [],
    addData: [
      {
        text: "الرقم العسكري",
        value: "RatebID",
        searchValue: "RatebID",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الاسم",
        value: "Rateb.Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        readonly: true,
        sort: 1
      }
    ],
    blanceItems: [],
    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),

  methods: {
    actionAdd() {
      this.$set(this.addUnitObject, "model", true);
      this.selects.UnitID.data = this.selects.UnitID.data.filter(ele => {
        return !this.mainTable.headers.find(h => h.text === ele.Unit);
      });
      this.$set(this, "addBalancer", {});
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "balancer", {
        ...item,
        isEdit: true
      });
    },
    async addUnit() {
      this.$set(this.addUnitObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/create_one`, {
          table: "TransferListBalancer",
          where: this.cleanObject({
            TransferListID: this.$route.params.id,
            Category: this.$route.params.category,
            UnitID: this.addBalancer.UnitID
          })
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.$set(this.addUnitObject, "model", false);
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.addUnitObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");

        console.log(error);
      } finally {
        this.$set(this.addUnitObject, "loading", false);
      }
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.balancer.isEdit ? "update_one" : "create_one"}`,
          {
            table: "TransferListBalancer",
            where: !this.balancer.isEdit
              ? this.balancer
              : {
                  ID_KEY: this.balancer.ID_KEY
                },
            update: this.balancer
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");

        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    handelChange(item, unit) {
      if (["الدعم"].indexOf(item.type) > -1) {
        // console.log(
        //   this.blanceItems,
        //   this.blanceItems.find(ele => ele.Unit.Unit == unit)
        // );
        this.actionEdit(this.blanceItems.find(ele => ele.Unit.Unit == unit));
      } else if (["الازالة"].indexOf(item.type) > -1) {
        this.deleteUnit(
          this.blanceItems.find(ele => ele.Unit.Unit == unit).Unit.UnitID
        );
      }
    },
    async deleteUnit(UnitID) {
      this.$confirm(`هل انت متاكد من إزالة الوحدة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "TransferListBalancer",
            where: {
              UnitID: UnitID,
              TransferListID: this.$route.params.id,
              Category: this.$route.params.category
            }
          });
          this.showSuccess("تم الحذف بنجاح");
          this.findItems({});
        }
      });
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "TransferListBalancer",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id,
          Category: this.$route.params.category
        })
      })
        .then(async x => {
          try {
            x.data = x.data.filter(ele =>
              this.$route.params.type == 2
                ? (ele.Unit.Category || "").includes("مجموعة مخابرات")
                : !(ele.Unit.Category || "").includes("مجموعة مخابرات")
            );
            const Mortabat = await this.api("global/get_all", {
              table: "MortabatDuties",
              include: [
                {
                  model: "Unit"
                }
              ],
              where: this.cleanObject({
                Category: this.$route.params.category,
                ServiceType: "راتب عالى",
                WeaponID: this.$route.params.category === "صف" ? 52 : null
              })
            });

            const Ratebs = await this.api("global/get_all", {
              table: "Rateb",
              include: [
                {
                  model: "Unit"
                }
              ],
              where: this.cleanObject({
                Status: "بالخدمة",
                RatebCategory: this.$route.params.category
              })
            });
            const Points = await this.api("global/get_all", {
              table: "Point",

              include: [
                {
                  model: "PointHub",
                  include: [
                    {
                      model: "Unit"
                    }
                  ]
                }
              ]
            });

            console.log("points", Points.data);

            const candidates = await this.api("global/get_all", {
              table: "TransferCandidates",
              include: [
                {
                  model: "Rateb",
                  include: [
                    {
                      model: "Unit"
                    }
                  ]
                }
              ],
              where: this.cleanObject({
                TransferListID: this.$route.params.id
              })
            });
            const enrolledRatebs = await this.api("global/get_all", {
              table: "Followerrateb",
              include: [
                {
                  model: "Rateb",
                  include: [
                    {
                      model: "Unit"
                    }
                  ],
                  where: this.cleanObject({
                    Status: "بالخدمة",
                    RatebCategory: this.$route.params.category
                  })
                }
              ],
              where: this.cleanObject({
                isEnrolled: true
              })
            });

            const toFirstSergant = await this.api("global/get_all", {
              table: "prevlevelup",
              include: [
                {
                  model: "Rateb",
                  include: [
                    {
                      model: "Unit"
                    }
                  ],
                  where: this.cleanObject({
                    Status: "بالخدمة",
                    RatebCategory: this.$route.params.category
                  })
                }
              ]
            });

            console.log(
              "toFirstSergant",
              toFirstSergant.data
                .filter(ele => ele.level == "مساعد ا")
                .filter(
                  ele =>
                    this.calculateTimeDiffernce(
                      ele.date_level,
                      new Date(2022, 10, 1)
                    ) > 4.5
                )
            );

            const RatebTrainingOrders = await this.api("global/get_all", {
              table: "Followerrateb",
              include: [
                {
                  model: "Rateb",
                  include: [
                    {
                      model: "Unit"
                    }
                  ],
                  where: this.cleanObject({
                    Status: "بالخدمة",
                    RatebCategory: this.$route.params.category
                  })
                }
              ],
              where: this.cleanObject({
                isTrainingOrder: true
              })
            });
            const travellers = await this.api("global/get_all", {
              table: "TravalTable",
              include: [
                {
                  model: "Rateb",
                  include: [
                    {
                      model: "Unit"
                    }
                  ],
                  where: this.cleanObject({
                    Status: "بالخدمة",
                    RatebCategory: this.$route.params.category
                  })
                }
              ],
              where: this.cleanObject({
                isDone: false
              })
            });
            console.log("Travellers", travellers);

            let data = await Promise.all(
              x.data.map(ele => {
                let total = Ratebs.data.filter(e => e.UnitID == ele.UnitID)
                  .length;
                let deduction = candidates.data.filter(
                  can =>
                    ele.UnitID === can.Rateb.UnitID &&
                    can.Rateb.RatebCategory.includes(
                      this.$route.params.category
                    )
                ).length;

                let mortab = Mortabat.data
                  .filter(e => e.UnitID == ele.UnitID)
                  .reduce((prev, curr) => prev + curr.Moratab, 0);
                let siasa = Mortabat.data
                  .filter(e => e.UnitID == ele.UnitID)
                  .reduce((prev, curr) => prev + curr.Siasa, 0);

                let TotalAfter = ele.Supply - deduction + total;

                return {
                  deduction,
                  mortab,
                  points: Points.data.filter(
                    e =>
                      e.PointHub.Unit_ID == ele.UnitID && e.isHeadQuarter != 1
                  ).length,
                  total,
                  siasa,
                  TotalAfter,
                  enrollers: enrolledRatebs.data.filter(
                    e => e.Rateb.UnitID == ele.UnitID
                  ).length,
                  trainingOrder: RatebTrainingOrders.data.filter(
                    e => e.Rateb.UnitID == ele.UnitID
                  ).length,
                  upToMosaeed: toFirstSergant.data
                    .filter(ele => ele.level == "مساعد ا")
                    .filter(
                      ele =>
                        this.calculateTimeDiffernce(
                          ele.date_level,
                          this.$route.params.DateOfTransferList
                        ) > this.$route.params.TimeFirstSergant
                    )
                    .filter(e => e.Rateb.UnitID == ele.UnitID).length,
                  travellers: travellers.data.filter(
                    e => e.Rateb.UnitID == ele.UnitID
                  ).length,
                  ...ele,
                  percOnMortab:
                    (mortab ? Math.round((TotalAfter / mortab) * 100) : 0) +
                    "%",
                  percOnSiasa:
                    (siasa ? Math.round((TotalAfter / siasa) * 100) : 0) + "%",
                  deleteUnit: "إزالة الوحدة"
                };
              })
            );

            let TransferIntelligence = await this.api("global/get_all", {
              table: "TransferIntelligence",
              include: [
                {
                  model: "Rateb",
                  include: [
                    {
                      model: "Unit"
                    }
                  ]
                }
              ],
              where: this.cleanObject({
                TransferListID: this.$route.params.id
              })
            });

            // data = data.filter(ele => ele.deduction != 0);
            this.$set(this, "totals", {
              Supply: data.reduce((prev, ele) => prev + ele["Supply"], 0),
              deduction: data.reduce((prev, ele) => prev + ele["deduction"], 0),
              in: TransferIntelligence.data.filter(
                ele =>
                  ele.Type?.includes("إنتداب") &&
                  ele.Rateb.RatebCategory.includes(this.$route.params.category)
              ).length,
              out: TransferIntelligence.data.filter(
                ele =>
                  ele.Type?.includes("خارج") &&
                  ele.Rateb.RatebCategory.includes(this.$route.params.category)
              ).length,
              all: candidates.data.filter(can =>
                can.Rateb.RatebCategory.includes(this.$route.params.category)
              ).length,
              allIntelligence: TransferIntelligence.data.filter(
                ele =>
                  (ele.Type?.includes("إنتقال") ||
                    ele.Type?.includes("إنتداب")) &&
                  ele.Rateb.RatebCategory.includes(this.$route.params.category)
              ).length
            });
            this.blanceItems = data;

            let Units = lodash.uniq(data.map(ele => ele.Unit.Unit));

            this.units = Units;

            this.mainTable.headers = [
              {
                text: "البيان",
                value: "type",
                searchValue: "editor",
                sortable: true,
                type: "text",
                inSearch: false,
                inTable: true,
                inModel: false,
                sort: 1
              },
              {
                text: "الدعم",
                value: "Supply",
                searchValue: "Supply",
                sortable: true,
                type: "text",
                inSearch: false,
                inTable: false,
                inModel: true,
                readonly: true,
                sort: 1
              },
              ...Units.map(ele => ({
                text: ele,
                value: ele,
                searchValue: "mortab",
                sortable: true,
                type: "text",
                inSearch: true,
                inTable: true,
                inModel: false,
                readonly: true,
                sort: 1
              }))
            ];

            let itemsNames = [
              {
                key: "points",
                value: "النقاط",
                color: "primary"
              },
              {
                key: "mortab",
                value: "مرتب",
                color: "primary"
              },
              {
                key: "siasa",
                value: "سياسة",
                color: "secondary"
              },
              {
                key: "total",
                value: "الموجود",
                color: "info"
              },
              {
                key: "deduction",
                value: "سحب",
                color: "error"
              },
              {
                key: "Supply",
                value: "الدعم",
                color: "info"
              },
              {
                key: "enrollers",
                value: "ملحق"
              },
              {
                key: "travellers",
                value: "سفر"
              },
              {
                key: "trainingOrder",
                value: "مهمة تدريبة"
              },
              // {
              //   key: "upToMosaeed",
              //   value: "ترقي مساعد ا"
              // },
              {
                key: "TotalAfter",
                value: "الإجمالي",
                color: "success"
              },
              {
                key: "percOnMortab",
                value: "نسبة/مرتب",
                color: "success"
              },
              {
                key: "percOnSiasa",
                value: "نسبة/سياسة",
                color: "success"
              },
              {
                key: "deleteUnit",
                value: "الازالة",
                color: "error"
              }
            ];

            this.$set(this, "itemsNames", [...itemsNames]);

            // data
            this.$set(
              this.mainTable,
              "items",
              itemsNames.map(ele => {
                let obj = {
                  type: ele.value,
                  color: ele.color ? ele.color : "transparent",
                  UnitID: ele.UnitID
                };
                Units.forEach(unit => {
                  obj[unit] = data.find(d => d.Unit.Unit == unit)[ele.key];
                });

                return obj;
              })
            );
            let printer = {
              data: itemsNames.map(ele => {
                let obj = {
                  type: ele.value,
                  color: ele.color ? ele.color : "transparent",
                  UnitID: ele.UnitID
                };
                Units.forEach(unit => {
                  obj[unit] = data.find(d => d.Unit.Unit == unit)[ele.key];
                });

                return obj;
              }),
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable),
              hasParent: true
            };
            this.$set(this.mainTable, "printer", printer);
          } catch (e) {
            console.log(e);
          }
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
