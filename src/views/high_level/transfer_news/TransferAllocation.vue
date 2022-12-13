<template>
  <div>
    <v-btn
      v-if="!this.$route.params.type"
      @click="actionDelete()"
      :loading="searchLoading"
      :selects="selects"
      large
      outlined
      color="primary"
    >
      مسح التوزيعة
    </v-btn>
    <v-btn
      v-if="!this.$route.params.type"
      @click="SaveSnapShoot.model = true"
      :loading="searchLoading"
      :selects="selects"
      large
      outlined
      color="primary"
    >
      حفظ التوزيعة
    </v-btn>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="swap.headers"
      :selects="selects"
      :data="secondOne"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="SaveSnapShoot.model"
      :loading="searchLoading"
      :fields="SaveSnapShoot.headers"
      :selects="selects"
      :data="SaveSnapShoot.data"
      @on-close="SaveSnapShoot.model = false"
      @on-submit="saveSnapShootItem()"
    >
    </editor-dialog-bulider>
    <v-dialog
      persistent
      v-model="Internals.model"
      scrollable
      width="500"
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
    <!-- 
    <table-bulider
      :title="'تواريخ التوزيع'"
      :headers="timeTable.headers"
      :items="timeTable.items"
      :printer="timeTable.printer"
      :height="400"
      :hideSelection="true"
    >
      <template v-slot:item.action="{ item }">
        <v-chip class="transparent">
          <v-btn icon @click="showDate(item)" color="primary">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </v-chip>

        <v-chip class="transparent">
          <v-btn icon @click="deleteDate(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      v-if="selectedTime"

    </table-bulider> -->
    <v-container class="grey lighten-5" v-if="!this.$route.params.type">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card
            class="pa-2"
            outlined
            tile
            :color="this.totals.SafMo5abrat ? 'success' : 'gray'"
            >صف مخابرات :
            {{ totals.SafMo5abrat ? "تم التوزيع" : "لم يتم التوزيع" }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card
            class="pa-2"
            outlined
            tile
            :color="this.totals.Saf ? 'success' : 'gray'"
            >صف حدود :
            {{ totals.Saf ? "تم التوزيع" : "لم يتم التوزيع" }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card
            class="pa-2"
            outlined
            tile
            :color="this.totals.Sa2ekMo5abrat ? 'success' : 'gray'"
            >سائق مخابرات :
            {{ totals.Sa2ekMo5abrat ? "تم التوزيع" : "لم يتم التوزيع" }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card
            class="pa-2"
            outlined
            tile
            :color="this.totals.Sa2ek ? 'success' : 'gray'"
            >سائق حدود :
            {{ totals.Sa2ek ? "تم التوزيع" : "لم يتم التوزيع" }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card
            class="pa-2"
            outlined
            tile
            :color="this.totals.KatebMo5abrat ? 'success' : 'gray'"
            >كاتب مخابرات :
            {{ totals.KatebMo5abrat ? "تم التوزيع" : "لم يتم التوزيع" }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card
            class="pa-2"
            outlined
            tile
            :color="this.totals.Kateb ? 'success' : 'gray'"
            >كاتب حدود :
            {{ totals.Kateb ? "تم التوزيع" : "لم يتم التوزيع" }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <table-bulider
      :title="transferList.Name"
      :headers="headers"
      :items="items"
      :printer="printer"
      :isExcel="true"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
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
            <v-icon>mdi-eye</v-icon>
          </v-btn>
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

      <template v-slot:item.preUnits="{ item }">
        <v-chip
          v-for="(unit, i) in item.Rateb.preuints.filter(ele => ele.Unit)"
          :key="i"
        >
          {{ unit.Unit.ShortenName || unit.Unit.Unit }}
        </v-chip>
      </template>

      <template v-slot:item.preDirections="{ item }">
        <v-chip
          v-for="(unit, i) in item.Rateb.preuints.filter(ele => ele.Unit)"
          :key="i"
        >
          {{ unit.Unit.Directionforunit }}
        </v-chip>
      </template>

      <template v-slot:item.DecisionNotes="{ item }">
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="(item, i) in item.DecisionNotes.split(' - - ')"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title=" بيانات التوزيعة  "
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="transferallocation"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
export default {
  name: "TransferAllocation",

  mounted() {
    this.init();
    this.handleSearch();
  },

  components: {
    PreviousJobsInternals: () =>
      import(
        "@/components/sections/tasgeel/soldier_plus/soldier_profile/basic_profile/cards/PreviousJobs.vue"
      )
  },

  watch: {
    "secondOne.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  data: () => ({
    totals: {
      SafMo5abrat: false,
      Saf: false,
      Sa2ekMo5abrat: false,
      Sa2ek: false,
      KatebMo5abrat: false,
      Kateb: false
    },
    swap: {
      headers: [
        {
          text: "الرقم العسكري المراد التبديل معه",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الأسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        }
      ]
    },
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    SaveSnapShoot: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      data: {},
      headers: [
        {
          text: "الأسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ]
    },
    firstOne: {},
    secondOne: {},
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    transferallocation: {},
    items: [],
    currentItems: [],
    printer: [],
    headers: [
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
        text: "الأسم",
        value: "Rateb.Name",
        searchValue: "RatebID",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الفئة",
        value: "Rateb.RatebCategory",
        searchValue: "RatebCategory",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الدرجة",
        value: "Rateb.RatebLevel",
        searchValue: "RatebLevel",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الوحدات السابقة",
        value: "preUnits",
        searchValue: "preUnits",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الإتجاهات السابقة",
        value: "preDirections",
        searchValue: "preDirections",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الوحدة السابقة",
        value: "Rateb.Unit.Unit",
        searchValue: "UnitID",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },

      {
        text: "الوظيفة بالوحدة السابقة ",
        value: "Rateb.Job.Name",
        searchValue: "",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: " اتجاه الوحدة السابقة",
        value: "Rateb.Unit.Directionforunit",
        searchValue: "UnitID",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: " حالة الوحدة السابقة",
        value: "oldRatebIsHardWork",
        searchValue: "UnitID",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الوحدة التي تم نقله إليها",
        value: "Unit.Unit",
        searchValue: "TransferedUnitID",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: " اتجاه الوحدة التي تم نقله إليها",
        value: "Unit.Directionforunit",
        searchValue: "UnitID",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: " حالة الوحدة التي تم نقله إليها",
        value: "newUnitIsHardWork",
        searchValue: "UnitID",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "ملاحظات عملية النقل",
        value: "DecisionNotes",
        searchValue: "DecisionNotes",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {
      ID: {
        table: "TransferAllocation",
        text: "RatebID",
        value: "RatebID"
      }
    },
    timeTable: {
      headers: [
        {
          text: "تاريخ التوزيع",
          value: "date",
          searchValue: "date",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "",
          value: "action",
          searchValue: "action",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: []
    },
    selectedTime: null,
    transferList: {
      Name: ""
    }
  }),

  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "TransferAllocation",
            where: {
              TransferListID: this.$route.params.id
            }
          });
          await this.handleSearch({});
        }
      });
    },

    async saveItem(edirableFromTableItem) {
      try {
        let second = this.items.find(ele => ele.RatebID == this.secondOne.ID);
        let first = this.firstOne;
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(`global/update_one`, {
          table: "TransferAllocation",
          where: { ID_KEY: first.ID_KEY },
          update: { TransferedUnitID: second.TransferedUnitID }
        });
        await this.api(`global/update_one`, {
          table: "TransferAllocation",
          where: { ID_KEY: second.ID_KEY },
          update: { TransferedUnitID: first.TransferedUnitID }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          await this.handleSearch();
          this.currentItems = [];
          this.showDate({ date: this.selectedTime });

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

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "firstOne", {
        ...item,
        isEdit: true
      });
    },

    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.secondOne, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
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
    showDate(item) {
      this.selectedTime = item.date;
      this.$set(
        this,
        "currentItems",
        this.items.filter(ele => ele.createdAt == item.date)
      );
      this.selects.ID.data = this.currentItems;

      this.showSuccess("تم");
    },
    async handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.$set(this, "currentItems", []);

      let transferList = await this.api("global/get_one", {
        table: "TransferList",
        where: {
          ID_KEY: this.$route.params.id
        }
      });
      this.transferList = transferList.data;
      try {
        let x = await this.api("global/get_all_grouped", {
          table: "TransferAllocation",
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
            TransferListID: this.$route.params.id
          }
        });
        let data = x.data
            .filter(ele => {
              return this.$route.params.type
                ? ele.Rateb.RatebCategory.includes(this.$route.params.type) &&
                    (this.$route.params.listType == 2
                      ? (ele.Unit.Category || "").includes("مجموعة مخابرات")
                      : !(ele.Unit.Category || "").includes("مجموعة مخابرات"))
                : true;
            })
            .map(ele => ({
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
                : "وحدة ليست شاقة"
            })),
          printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.headers.filter(f => f.inTable)
          };
        console.log("data", data);
        this.totals.SafMo5abrat =
          data.filter(
            ele =>
              ele.Unit.Unit.includes("مخابرات") &&
              ele.Rateb.RatebCategory.includes("صف")
          ).length > 0
            ? true
            : false;
        this.totals.Saf =
          data.filter(
            ele =>
              !ele.Unit.Unit.includes("مخابرات") &&
              ele.Rateb.RatebCategory.includes("صف")
          ).length > 0
            ? true
            : false;
        this.totals.Sa2ekMo5abrat =
          data.filter(
            ele =>
              ele.Unit.Unit.includes("مخابرات") &&
              ele.Rateb.RatebCategory.includes("سائق")
          ).length > 0
            ? true
            : false;
        this.totals.Sa2ek =
          data.filter(
            ele =>
              !ele.Unit.Unit.includes("مخابرات") &&
              ele.Rateb.RatebCategory.includes("سائق")
          ).length > 0
            ? true
            : false;
        this.totals.KatebMo5abrat =
          data.filter(
            ele =>
              ele.Unit.Unit.includes("مخابرات") &&
              ele.Rateb.RatebCategory.includes("كاتب")
          ).length > 0
            ? true
            : false;
        this.totals.Kateb =
          data.filter(
            ele =>
              !ele.Unit.Unit.includes("مخابرات") &&
              ele.Rateb.RatebCategory.includes("كاتب")
          ).length > 0
            ? true
            : false;
        // this.timeTable.items = Object.keys(
        //   lodash.groupBy(data, ele => ele.createdAt)
        // ).map(ele => ({ date: ele }));

        this.$set(this, "items", data);
        this.$set(this, "printer", printer);
      } catch (error) {
        console.log(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async deleteDate(item) {
      try {
        await this.api("global/queryRunners", {
          query: `
            delete FROM TransferAllocation WHERE  ID_KEY in (SELECT ID_KEY from TransferAllocation t join Rateb r on t.RatebID = r.ID where r.RatebCategory like N'%${this.$route.params.type}%' and t.TransferListID = ${this.$route.params.id} and t.createdAt = N'${item.date}' )
            `
        });
        this.selectedTime = null;
        await this.findItems();
        this.showSuccess("تم الحذف بنجاح");
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
    },
    async saveSnapShootItem() {
      try {
        await Promise.all(
          this.items.map(async ele => {
            await this.api("global/create_one", {
              table: "TransferAllocationSnapshot",
              where: {
                ...ele,
                ID_KEY: null,
                OldUnitID: ele.Rateb.UnitID,
                Name: this.SaveSnapShoot.data.Name
              }
            });
          })
        );
        this.showSuccess("تم الاضافة بنجاح");
        this.SaveSnapShoot.model = false;
      } catch (error) {
        this.handleError(error);
      }
    }
  }
};
</script>
