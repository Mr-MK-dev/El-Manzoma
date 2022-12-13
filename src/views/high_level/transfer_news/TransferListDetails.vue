<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :addButton="false"
      @on-search="findItems"
      :clearOption="true"
      @on-add="actionAdd()"
      title="بحث متقدم في مرشحين النشرة"
      addBtnTitle="إضافة كفاءة الى راتب العالي"
    />

    <editor-dialog-bulider
      :title="'عملية الشطب'"
      :open="showRemoveDialog"
      :loading="addLoading"
      :fields="removeData"
      :selects="selects"
      :data="removedItem"
      @on-close="showRemoveDialog = false"
      @on-submit="removeFromCandidates()"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="'عملية الشطب'"
      :open="showUpdatDialog"
      :loading="addLoading"
      :fields="removeData"
      :selects="selects"
      :data="updateRemovedItem"
      @on-close="showUpdatDialog = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
    <v-dialog
      persistent
      v-model="Internals.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="Internals.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <previous-jobs-internals
            ref="internals"
            :parentFilters="true"
          ></previous-jobs-internals>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card-title>
      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة راتب عالي الى النشرة
      </v-btn>
      <v-btn
        v-if="isAdmin()"
        class="mx-auto"
        @click="distrbuiteTheList('صف')"
        large
        outlined
        color="primary"
      >
        توزيع الصف
      </v-btn>
      <v-btn
        v-if="isAdmin()"
        class="mx-auto"
        @click="distrbuiteTheList('سائق عجل')"
        large
        outlined
        color="primary"
      >
        توزيع سائق عجل
      </v-btn>
      <v-btn
        v-if="isAdmin()"
        class="mx-auto"
        @click="distrbuiteTheList('كاتب')"
        large
        outlined
        color="primary"
      >
        توزيع الكاتب
      </v-btn>
    </v-card-title>

    <v-tabs show-arrows height="60" slider-size="3" center-active>
      <v-tab
        :active-class="`white--textprimary--text`"
        :class="` ls-0 text-body-1  grey--text`"
        @click="findItems()"
      >
        الموجود في نشرة النقل
      </v-tab>
      <v-tab
        :active-class="`white--textprimary--text`"
        :class="` ls-0 text-body-1  grey--text`"
        @click="findAddedItems()"
      >
        عرض خطة اضافة
      </v-tab>

      <v-tab
        :active-class="`white--textprimary--text`"
        :class="` ls-0 text-body-1  grey--text`"
        @click="findRemovedItems()"
      >
        عرض خطة شطب
      </v-tab>
    </v-tabs>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="
        listType === `all`
          ? 'نشرة الانتقالات'
          : listType === `added`
          ? `خطة الاضافة`
          : `خطة الشطب`
      "
      :isExcel="true"
    >
      <template v-slot:item.editor="{ item }" v-if="listType == `removed`">
        <v-chip icon color="transparent" @click="actionUpdate(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-chip>
      </template>
      <template v-slot:item.RatebID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.RatebID}`"
          @click.right="copyText(item.RatebID)"
        >
          {{ item.RatebID }}
        </v-chip>
      </template>

      <template v-slot:item.PreviousJobsInternals="{ item }">
        <v-chip class="transparent">
          <v-btn
            icon
            @click="
              Internals.model = true;
              getInternals(item);
            "
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.deleteFromList="{ item }">
        <v-chip
          v-if="listType == `all`"
          icon
          color="transparent"
          @click="actionDelete(item)"
        >
          <v-icon color="red">mdi-delete</v-icon>
        </v-chip>
      </template>

      <template v-slot:item.OutOfJob="{ item }">
        <v-chip @click="actionOutOfJob(item)" :color="item.color">
          {{ item.OutOfJobText }}
        </v-chip>
      </template>
      <template v-slot:item.CheckedText="{ item }">
        <v-chip @click="actionChecked(item)" :color="item.colorChecked">
          {{ item.CheckedText }}
        </v-chip>
      </template>
      <template v-if="listType !== `all`" v-slot:item.isChecked="{ item }">
        <v-chip @click="actionIsChecked(item, listType)">
          {{ item.isChecked }}
        </v-chip>
      </template>
    </table-bulider>

    <v-dialog max-width="1000" v-model="unitsJobIssuesModel.model">
      <v-card>
        <v-card-title>
          عدد الوظائف الحرجة الناقصة لكل وحدة

          <v-spacer />

          <v-btn @click="unitsJobIssuesModel.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <table-bulider
          :headers="unitsJobIssuesModel.headers"
          :printer="unitsJobIssuesModel.printer"
          :items="unitsJobIssuesModel.items"
          :isExcel="true"
        >
        </table-bulider>
        <v-spacer />

        <v-card-title>
          <v-btn
            class="mx-auto"
            @click="showLastDistrbuition()"
            large
            outlined
            color="primary"
          >
            عرض التوزيعة
          </v-btn>
        </v-card-title>
      </v-card>
    </v-dialog>

    <editor-dialog-bulider
      :title="''"
      :open="showAddDialog"
      :loading="addLoading"
      :fields="addData"
      :data="addModel"
      :selects="selects"
      @on-close="showAddDialog = false"
      @on-submit="addNewToAddPlan()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../../Constant").default;
const distrbuiteAlog = require("./distrbuiteAlgo").default
  .allocatedTransferedData;
export default {
  name: "TransferListDetails",

  components: {
    PreviousJobsInternals: () =>
      import(
        "@/components/sections/tasgeel/soldier_plus/soldier_profile/basic_profile/cards/PreviousJobs.vue"
      )
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
  },

  data: () => ({
    showRemoveDialog: false,
    showUpdatDialog: false,
    removemodel: {},
    removedItem: {},
    updateRemovedItem: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
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
      NoteNames: {
        table: "TransferListEffects",
        value: "Name",
        text: "Name"
      },
      RatebCategory: constants.SoldierCategory
    },
    mainTable: {
      headers: [
        {
          text: "",
          value: "deleteFromList",
          searchValue: "deleteFromList",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "editor",
          searchValue: "editor",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الخبرات السابقة",
          value: "PreviousJobsInternals",
          searchValue: "PreviousJobsInternals",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "RatebID",
          searchValue: "RatebID",
          sortable: true,
          type: "text",
          inSearch: false,
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
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Rateb.RatebLevel",
          searchValue: "RatebLevel",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Rateb.RatebCategory",
          searchValue: "RatebCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الوظيفة",
          value: "Rateb.Job.Name",
          searchValue: "RatebCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تجاهل الوظيفة",
          value: "OutOfJob",
          searchValue: "OutOfJob",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ الضم",
          value: "Rateb.UnitJoinDate",
          searchValue: "UnitJoinDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "من تم مراجعته",
          value: "CheckedText",
          searchValue: "Checked",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "ملاحظة",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تم التأكيد في الهيئة",
          value: "isChecked",
          searchValue: "isChecked",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
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
      },
      {
        text: "ملاحظات",
        value: "Notes",
        searchValue: "NoteNames",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تم التأكيد في الهيئة",
        value: "isChecked",
        searchValue: "isChecked",
        sortable: true,
        type: "checkbox",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    removeData: [
      {
        text: "ملاحظات",
        value: "Notes",
        searchValue: "NoteNames",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "تم التأكيد في الهيئة",
        value: "isChecked",
        searchValue: "isChecked",
        sortable: true,
        type: "checkbox",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    showAddDialog: false,
    addLoading: false,
    addModel: {},
    unitsJobIssuesModel: {
      printer: {},
      headers: [
        {
          text: "الوحدة",
          value: "UnitName",
          searchValue: "UnitName",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوظيفة ",
          value: "JobName",
          searchValue: "JobName",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },

        {
          text: "العدد الناقص من الوظيفة",
          value: "count",
          searchValue: "count",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      model: false
    }
  }),
  watch: {
    "addModel.RatebID"(newValue) {
      this.findOne(newValue);
    }
  },

  methods: {
    async checkIsValidFromSystemControl() {
      let x = await this.api("global/get_one", {
        table: "SystemRules",
        where: { Key: "TransferList" }
      });
      let data = x.data;
      console.log(data);
      return !data.Value;
    },
    async actionDelete(item) {
      if (!this.isAdmin() && (await this.checkIsValidFromSystemControl())) {
        return this.showError(
          "تم إنتهاء المدة المحددة لإضافة وشطب في نشرة الإنتقالات"
        );
      }
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    actionUpdate(item) {
      this.updateRemovedItem = item;
      this.$set(this, "showUpdatDialog", true);
    },

    async getInternals(item) {
      if (this.$refs.internals && item.RatebID) {
        this.$refs.internals.conscripte.ID = item.RatebID;
        this.$set(this.$refs.internals.prejobs, "RatebID", item.RatebID);

        await this.$refs.internals.findItems({ ID: item.RatebID });
      } else {
        window.setTimeout(async () => {
          await this.getInternals(item);
        }, 1000);
      }
    },

    actionOutOfJob(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            let x = await this.api(`global/update_one`, {
              table: "TransferCandidates",
              where: {
                RatebID: item.RatebID
              },
              update: {
                OutOfJob: !item.OutOfJob ? 1 : 0
              }
            });
            this.findItems();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    actionChecked(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            let x = await this.api(`global/update_one`, {
              table: "TransferCandidates",
              where: {
                RatebID: item.RatebID
              },
              update: {
                Checked: !item.Checked ? 1 : 0
              }
            });
            this.findItems();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    actionIsChecked(item, listType) {
      console.log(item);
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (listType === "added") {
              let x = await this.api(`global/update_one`, {
                table: "AddPlans",
                where: {
                  RatebID: item.RatebID
                },
                update: {
                  isChecked: item.isChecked === "تم التأكيد" ? 0 : 1
                }
              });
              this.findAddedItems();
            } else if (listType === "removed") {
              let x = await this.api(`global/update_one`, {
                table: "RemovePlans",
                where: {
                  RatebID: item.RatebID
                },
                update: {
                  isChecked: item.isChecked === "تم التأكيد" ? 0 : 1
                }
              });
              this.findRemovedItems();
            }
          }
        })
        .catch(e => {
          console.log(e);
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
        table: "TransferCandidates",
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              RatebLevel: where.RatebLevel,
              Name: where.Name,
              UnitID: where.UnitID
            }),
            include: [
              {
                model: "Unit"
              },
              {
                model: "Jobs"
              }
            ]
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      })
        .then(x => {
          let data = x.data
            .map(ele => ({
              ...ele,
              OutOfJobText: ele.OutOfJob ? "نعم" : "لا",
              color: ele.OutOfJob ? "success" : "gray",
              CheckedText: ele.Checked ? "تمت مراجعته" : "لم يتم مراجعته",
              Checked: ele.Checked,
              colorChecked: ele.Checked ? "success" : "gray"
            }))
            .filter(ele =>
              this.$route.params.type == 2
                ? (ele.Rateb.Unit.Category || "").includes("مجموعة مخابرات")
                : !(ele.Rateb.Unit.Category || "").includes("مجموعة مخابرات")
            );

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async perpareCategoryBalancer(category) {
      const balancerData = await this.api("global/get_all", {
        table: "TransferListBalancer",
        include: [],
        where: this.cleanObject({
          TransferListID: this.$route.params.id,
          Category: category
        })
      });

      if (balancerData.data.length === 0) {
        let units = await this.api("global/get_all", {
          table: "Unit",
          where: {
            statue: "بالخدمة"
          }
        });

        units = units.data;
        let perparedData = units.map(unit => {
          return {
            UnitID: unit.UnitID,
            TransferListID: this.$route.params.id,
            Category: category,
            itemsNumber: 0,
            Supply: 0
          };
        });
        await Promise.all(
          perparedData.map(ele =>
            this.api("global/create_one", {
              table: "TransferListBalancer",
              where: ele
            })
          )
        );
      }
      this.$router.push(
        `/TransferListBalancer/${this.$route.params.id}/${category}`
      );
    },
    async distrbuiteTheList(type) {
      const balancerData = await this.api("global/get_all", {
        table: "TransferListBalancer",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id,
          Category: type
        })
      });
      const balancerDataGroupedWithUnit = lodash.groupBy(
        balancerData.data.filter(ele =>
          this.$route.params.type == 2
            ? (ele.Unit.Category || "").includes("مجموعة مخابرات")
            : !(ele.Unit.Category || "").includes("مجموعة مخابرات")
        ),
        ele => ele.UnitID
      );

      let totalSupply = balancerData.data.reduce(
        (prev, cur) => prev + cur.Supply,
        0
      );

      const candidates = await this.api("global/get_all", {
        table: "TransferCandidates",
        include: [
          {
            model: "Rateb",

            where: this.cleanObject({
              RatebCategory: {
                $like: `%${type}%`
              }
            }),
            include: [
              {
                model: "Unit"
              },
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
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });

      const ratebRecommendations = await this.api("global/get_all", {
        table: "RatebRecommendations",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });
      const transferIntelligence = await this.api("global/get_all", {
        table: "TransferIntelligence",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });

      console.log("transferIntelligence", transferIntelligence);
      const requests = await this.api("global/get_all", {
        table: "Requests",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });

      let duducation = 0;
      let forceSoltes = {};
      let perparedCandidates = Object.values(
        lodash.groupBy(
          candidates.data.map(ele => ({
            ...ele.Rateb,
            OutOfJob: ele.OutOfJob
          })),
          ele => ele.ID
        )
      )
        .map(obj => {
          let forceTransfer = transferIntelligence.data.find(
            ele => ele.RatebID == obj[0].ID
          );

          let Category = obj[0].RatebCategory.includes("كاتب")
            ? "كاتب"
            : obj[0].RatebCategory;

          if (forceTransfer) {
            if (!forceSoltes[forceTransfer.RecommendedUnitID + Category]) {
              forceSoltes[forceTransfer.RecommendedUnitID + Category] = 0;
            }
            forceSoltes[forceTransfer.RecommendedUnitID + Category] += 1;
          }

          return {
            ID: obj[0].ID,
            OutOfJob: obj[0].OutOfJob,
            category: Category,
            UnitID: obj[0].UnitID,
            Job: obj[0].Job,
            rateb: {
              ...obj[0],
              RatebCategory: obj[0].RatebCategory.includes("كاتب")
                ? "كاتب"
                : obj[0].RatebCategory
            },
            preuints: obj[0].preuints?.id ? obj.map(ele => ele.preuints) : [],
            recommendation: ratebRecommendations.data.find(
              ele => ele.RatebID == obj[0].ID
            ),
            request: requests.data.find(ele => ele.RatebID == obj[0].ID),
            forceTransfer
          };
        })
        .filter(ele =>
          this.$route.params.type == 2
            ? (ele.rateb.Unit.Category || "").includes("مجموعة مخابرات")
            : !(ele.rateb.Unit.Category || "").includes("مجموعة مخابرات")
        );
      const unitsDetails = await this.api("global/get_all", {
        table: "TransferListUnits",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });
      unitsDetails.data = unitsDetails.data.filter(ele =>
        this.$route.params.type == 2
          ? (ele.Unit.Category || "").includes("مجموعة مخابرات")
          : !(ele.Unit.Category || "").includes("مجموعة مخابرات")
      );
      let unitsPerparedData = Object.keys(balancerDataGroupedWithUnit).map(
        unitID => {
          return {
            unitID,
            unit: balancerDataGroupedWithUnit[unitID][0].Unit,
            isRasisingEfficiency: unitsDetails.data.filter(
              ele => ele.UnitID == unitID
            )[0]?.isRasisingEfficiency,
            MinimumHighRatedRequirement: unitsDetails.data.filter(
              ele => ele.UnitID == unitID
            )[0]?.MinimumHighRatedRequirement,
            MaximumHighRatedRequirement: unitsDetails.data.filter(
              ele => ele.UnitID == unitID
            )[0]?.MaximumHighRatedRequirement,
            NeededHighRateb: unitsDetails.data.filter(
              ele => ele.UnitID == unitID
            )[0]?.NeededHighRateb,
            slots: balancerDataGroupedWithUnit[unitID].map(ele => {
              duducation =
                duducation +
                perparedCandidates.filter(
                  can =>
                    can.UnitID == unitID && can.category.includes(ele.Category)
                ).length;

              return {
                category: ele.Category,
                count: ele.Supply,
                duducation: perparedCandidates.filter(
                  can =>
                    can.UnitID == unitID && can.category.includes(ele.Category)
                ).length
              };
            })
          };
        }
      );

      // console.log(totalSupply, perparedCandidates.length);

      // if (totalSupply != perparedCandidates.length) {
      //   this.showError(
      //     "برجاء التاكد من ان اجمالي الدعم مساوي للسحب عن طريق مراجعة بيانات الميزان"
      //   );
      //   return;
      // }

      let JobBlanacer = await this.api("global/get_all", {
        table: "TransferListJobBlancer",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });

      let support = lodash.flatten(
        JobBlanacer.data
          .filter(ele =>
            this.$route.params.type == 2
              ? (ele.Unit.Category || "").includes("مجموعة مخابرات")
              : !(ele.Unit.Category || "").includes("مجموعة مخابرات")
          )
          .map(ele => ({
            ...ele,
            Details: ele.Details.length ? JSON.parse(ele.Details) : {}
          }))
          .map(ele =>
            ele.Details.support
              ? ele.Details.support.map(s => ({
                  ...s,
                  Unit: ele.Unit
                }))
              : []
          )
      );

      this.showLoadingDialog();

      perparedCandidates = await Promise.all(
        perparedCandidates.map(async ele => {
          let previousJobs = await this.api("global/get_all", {
            table: "PreviousJobs",
            include: [{ model: "Jobs" }],
            where: {
              RatebID: ele.ID
            }
          });
          return {
            ...ele,
            previousJobs: previousJobs.data
          };
        })
      );

      console.log(
        "xxxxxxxxxxxxxxxxxxxxx",
        unitsPerparedData.map(ele => ele),
        perparedCandidates.map(ele => ele),
        support
      );

      let allocated = distrbuiteAlog(
        unitsPerparedData.map(ele => ele),
        perparedCandidates.map(ele => ele),
        support,
        forceSoltes
      );

      console.log("unitsPerparedData", unitsPerparedData);
      console.log("perparedCandidates", perparedCandidates);
      console.log("support", support);
      console.log("allocated", allocated);

      await this.api("global/queryRunners", {
        query: `
        delete FROM TransferAllocation WHERE  ID_KEY in (SELECT ID_KEY from TransferAllocation t join Rateb r on t.RatebID = r.ID join Unit u on u.UnitID = r.UnitID where r.RatebCategory like N'%${type}%' and u.Category ${
          this.$route.params.type == 2 ? "" : "not"
        } like N'%مخابرات%' and t.TransferListID = ${this.$route.params.id} )
        `
      });

      let date = new Date()
        .toISOString()
        .replaceAll("T", " ")
        .replaceAll("Z", "")
        .split(".")[0];

      await Promise.all(
        allocated.finalAllocation.map(ele =>
          this.api("global/create_one", {
            table: "TransferAllocation",
            where: {
              RatebID: ele.RatebID,
              TransferedUnitID: ele.TransferedToUnitId,
              ReasonType: ele.ReasonType,
              ReasonID: ele.ReasonId,
              TransferListID: this.$route.params.id,
              DecisionNotes: ele.DecisionNotes,
              createdAt: date
            }
          })
        )
      );

      this.$router.push(
        `/TransferAllocation/${this.$route.params.id}/${type}/${this.$route.params.type}`
      );
      this.hideLoadingDialog();
    },
    showLastDistrbuition() {
      this.unitsJobIssuesModel.model = false;
      this.$router.push(`/TransferAllocation/${this.$route.params.id}`);
    },
    findAddedItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "added");

      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "AddPlans",
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              RatebLevel: where.RatebLevel,
              Name: where.Name,
              UnitID: where.UnitID
            }),
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
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele,
            isChecked: ele.isChecked ? "تم التأكيد" : "لم يتم التأكيد"
          }));

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    findRemovedItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "removed");

      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "RemovePlans",
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              RatebLevel: where.RatebLevel,
              Name: where.Name,
              UnitID: where.UnitID
            }),
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
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele,
            isChecked: ele.isChecked ? "تم التأكيد" : "لم يتم التأكيد"
          }));

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    findOne(id) {
      this.api("global/get_one", {
        table: "Rateb",
        where: { id }
      })
        .then(x => {
          this.$set(this.addModel, "Name", x.data.Name);
          this.$set(this.addModel, "UnitId", x.data.UnitID);
          this.$set(this.addModel, "RatebCategory", x.data.RatebCategory);
        })
        .catch(error => {})
        .finally(() => {});
    },
    async addNewToAddPlan() {
      if (!this.addModel.Name) {
        this.showError("هذا الفرد غير مسجل لدينا");
      } else {
        if (
          this.mainTable.items.find(ele => ele.RatebID == this.addModel.RatebID)
        ) {
          this.showError("هذا الفرد بالفعل موجود في النشرة");
        } else {
          this.$set(this, "addLoading", true);
          let saveItem;
          let candidate = {
            Notes: this.addModel.Notes,
            TransferListID: this.$route.params.id,
            RatebID: this.addModel.RatebID,
            isChecked: this.addModel.isChecked
          };
          saveItem = await this.api("global/create_one", {
            table: "TransferCandidates",
            where: candidate
          });

          let listBlancer = await this.api("global/get_one", {
            table: "TransferListBalancer",
            where: {
              TransferListID: this.$route.params.id,
              UnitID: this.addModel.UnitId,
              Category: this.addModel.RatebCategory
            }
          });

          console.log(listBlancer);
          if (!listBlancer.data) {
            let listBlancer = await this.api("global/create_one", {
              table: "TransferListBalancer",
              where: {
                TransferListID: this.$route.params.id,
                UnitID: this.addModel.UnitId,
                Supply: 0,
                Category: this.addModel.RatebCategory
              }
            });
          }

          saveItem = await this.api("global/create_one", {
            table: "AddPlans",
            where: candidate
          });
          if (saveItem) {
            this.$set(this, "addLoading", false);
            this.showSuccess("تم الاضافة بنجاح");
            this.$set(this, "addModel", {});
            this.$set(this, "showAddDialog", false);
            this.findItems({});
          } else {
            this.$set(this, "addLoading", false);
            this.showError("حدث خطا اقناء  اضافة البيانات");
            this.$set(this, "showAddDialog", false);
          }
        }
      }
    },
    async removeFromCandidates() {
      console.log(this.removedItem);
      let saveItem;
      if (!this.removedItem.TransferListID) {
        this.showError("هذا الفرد غير مسجل لدينا");
      } else {
        this.$confirm(`هل انت متاكد من انك تريد شطب هذا الفرد`, {
          title: ``
        }).then(async res => {
          if (res) {
            let candidate = {
              TransferListID: this.$route.params.id,
              Notes: this.removedItem.Notes,
              RatebID: this.removedItem.RatebID,
              isChecked: this.removedItem.isChecked
            };

            saveItem = await this.api("global/create_one", {
              table: "RemovePlans",
              where: candidate
            });

            saveItem = await this.api("global/delete_all", {
              table: "TransferCandidates",
              where: {
                ID_KEY: this.removedItem.ID_KEY
              }
            });

            if (saveItem) {
              this.$set(this, "loading", false);
              this.showSuccess("تم الشطب بنجاح");
              this.$set(this, "showRemoveDialog", false);
              this.$set(this, "removedItem", {});
              this.findItems({});
            } else {
              this.$set(this, "loading", false);
              this.showError("حدث خطا اقناء  اضافة البيانات");
              this.$set(this, "showRemoveDialog", false);
            }
          }
        });
      }
    },
    async saveItem() {
      console.log("this.removedItem", this.updateRemovedItem);
      try {
        let saveItem;
        saveItem = await this.api(`global/update_one`, {
          table: "RemovePlans",
          where: { RatebID: this.updateRemovedItem.RatebID },
          update: { Notes: this.updateRemovedItem.NoteNames }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findRemovedItems({});
          this.$set(this, "showUpdatDialog", false);
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this, "showUpdatDialog", false);
      }
    },

    async actionAdd() {
      if (!this.isAdmin() && (await this.checkIsValidFromSystemControl())) {
        return this.showError(
          "تم إنتهاء المدة المحددة لإضافة وشطب في نشرة الإنتقالات"
        );
      }
      this.findItems({});

      this.$set(this, "showAddDialog", true);
    }
  }
};
</script>
