<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الفرق"
      addBtnTitle="إضافة فرقه"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الفرق'"
    >
      <template v-slot:item.id="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.id}`"
          @click.right="copyText(item.id)"
        >
          {{ item.id }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="traineeship"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "traineeship",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    traineeship: {},
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الرقم العسكري",
          value: "id",
          searchValue: "id",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
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
          readOnly: true,
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
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "المسلسل",
          value: "count",
          searchValue: "count",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "إسم الفرقة",
          value: "TraineeShip.Name",
          searchValue: "TraineeShipID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,
          required: false,
          sort: 1
        },
        {
          text: "الحالة",
          value: "state",
          searchValue: "state",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "التقدير",
          value: "grade",
          searchValue: "grade",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "النسبة",
          value: "degree",
          searchValue: "degree",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "مكان الدورة",
          value: "place",
          searchValue: "place",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "من تاريخ",
          value: "date_from",
          searchValue: "date_from",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الى تاريخ",
          value: "date_to",
          searchValue: "date_to",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    search: {},
    componentName: "traineeship",
    selects: {
      TraineeShipID: {
        table: "TraineeShip",
        value: "TraineeShipID",
        text: "Name"
      },
      RatebLevel: {
        table: "Rateb",
        value: "RatebLevel",
        text: "RatebLevel"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      grade: {
        value: "text",
        text: "text",
        data: ["ممتاز", "جيد جدا", "جيد", "مقبول", "ضغيف", "ضغيف جدا"]
      },
      state: {
        value: "text",
        text: "text",
        data: ["قصر", "مضى"]
      }
    }
  }),
  watch: {
    "traineeship.id"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "RatebTraineeShip",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({});
        }
      });
    },
    async saveItem(edirableFromTableItem) {
      if (!this.traineeship.Name) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }
      this.addJobLikeTraineeShip();
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.traineeship.isEdit ? "update_one" : "create_one"}`,
          {
            table: "RatebTraineeShip",
            where: !this.traineeship.isEdit
              ? this.traineeship
              : {
                  ID_KEY: this.traineeship.ID_KEY
                },
            update: this.traineeship
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems(this.search);
          this.$set(this.createdObject, "model", false);
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
        this.$set(this, "traineeship", {});
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },

    async addJobLikeTraineeShip() {
      let traineeShip = this.selects.TraineeShipID.data.find(
        ele => ele.TraineeShipID == this.traineeship.TraineeShipID
      );
      try {
        let x = await this.api("global/get_one", {
          table: "Jobs",
          where: { Name: traineeShip.Name }
        });
        x = x.data;
        if (x) {
          await this.api("global/create_one", {
            table: "PreviousJobs",
            where: {
              RatebID: this.traineeship.id,
              JobID: x.ID_KEY
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    findOne(id) {
      if (id?.length > 10) {
        this.$set(this.createdObject, "loading", true);

        this.api("global/get_one", {
          table: "Rateb",
          where: { id },
          include: [{ model: "Unit" }]
        })
          .then(x => {
            this.$set(this.traineeship, "Name", x.data.Name);
            this.$set(this.traineeship, "RatebLevel", x.data.RatebLevel);
            this.$set(this.traineeship, "UnitID", x.data.Unit.Unit);
          })
          .catch(error => {})
          .finally(() => {
            this.$set(this.createdObject, "loading", false);
          });
      }
    },
    findItems(filters) {
      this.search = { ...filters };
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      console.log(filters);
      let where = {
          ...filters
        },
        likes = ["Name"],
        multi = ["TraineeShipID"],
        dates = ["date_to", "date_from"];
      where.UnitID = null;
      console.log(where);
      this.api("global/get_all", {
        table: "RatebTraineeShip",
        include: [
          {
            model: "Rateb",
            include: [{ model: "Unit" }]
          },
          { model: "TraineeShip" }
        ],
        where: this.cleanObject(this.mapToQuery(where, likes, multi, dates))
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionAdd() {
      this.$set(this.traineeship, "isEdit", false);
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.findOne(item.id);
      this.$set(this.createdObject, "model", true);
      this.$set(this, "traineeship", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
