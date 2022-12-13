<template>
  <div>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="swap.headers"
      :selects="selects"
      :data="createdObject.item"
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
          <v-btn icon @click="showData(item)" color="primary">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </v-chip>

        <!-- <v-chip class="transparent">
          <v-btn icon @click="deleteDate(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip> -->

        <v-chip class="transparent">
          <v-btn @click="view(item)" color="transparent">
            الاحصائيات
          </v-btn>
        </v-chip>
      </template>
      v-if="selectedTime"
    </table-bulider>

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
    this.getSnaShoots();
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
          text: "الوحدة",
          value: "NewUnitID",
          searchValue: "NewUnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
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
        value: "OldUnit.Unit",
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
        value: "OldUnit.Directionforunit",
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
      TransferList: {
        table: "TransferList",
        text: "Name",
        value: "TransferListID"
      },
      NewUnitID: {
        table: "Unit",
        text: "Unit",
        value: "UnitID"
      }
    },
    timeTable: {
      headers: [
        {
          text: "اسم الحفظ",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "اسم النشرة",
          value: "TransferList.Name",
          searchValue: "TransferList.Name",
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
    async getSnaShoots() {
      let data = await this.api("global/queryRunners", {
        query: `
        SELECT TransferListID,Name FROM TransferAllocationSnapshot group by TransferListID , Name ;
        `
      });
      this.timeTable.items = data.data.map(ele => ({
        TransferList: this.selects.TransferList.data.find(
          i => i.ID_KEY == ele.TransferListID
        ),
        ...ele
      }));
    },
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
    view(item) {
      this.$router.push(
        `/TransferAllocationStats/${item.TransferListID}/${item.Name}`
      );
    },

    async showData(item) {
      console.log(item);
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.$set(this, "currentItems", []);
      this.selectedItem = item;

      let transferList = await this.api("global/get_one", {
        table: "TransferList",
        where: {
          ID_KEY: item.TransferListID
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
            TransferListID: item.TransferListID,
            Name: item.Name
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
          })),
          printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.headers.filter(f => f.inTable)
          };
        this.$set(this, "items", data);
        this.$set(this, "printer", printer);
      } catch (error) {
        console.log(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(`global/update_one`, {
          table: "TransferAllocationSnapshot",
          where: { ID_KEY: this.createdObject.item.ID_KEY },
          update: { TransferedUnitID: this.createdObject.item.NewUnitID }
        });
        if (saveItem && saveItem.data && saveItem.ok) {
          this.currentItems = [];
          await this.showData({ ...this.selectedItem });

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
      this.$set(this.createdObject, "item", {
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
    }
  }
};
</script>
