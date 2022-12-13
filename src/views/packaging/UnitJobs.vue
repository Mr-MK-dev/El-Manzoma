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
      إضافة وظيفة
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الوظائف'"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="actionDelete(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="jobs"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
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
  name: "UnitJobs",
  props: {},
  mounted() {
    this.init();
    this.findItems({});
  },
  data: () => ({
    jobs: {},
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
          text: "الوظيفة",
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
          text: "مرتب حرب المجند",
          value: "moratab",
          searchValue: "moratab",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الموجود فعلي مجند",
          value: "SoldierNumber",
          searchValue: "SoldierNumber",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "مرتب التعبئة",
          value: "moratabPackaging",
          searchValue: "moratabPackaging",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نسبة التخلفات",
          value: "BehindPrecentage",
          searchValue: "BehindPrecentage",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "إجمالي المطلوب",
          value: "TotalMatlob",
          searchValue: "TotalMatlob",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "المعين بالخطة",
          value: "Available",
          searchValue: "Available",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {}
  }),
  watch: {
    "jobs.BehindPrecentage"() {
      this.jobs.TotalMatlob =
        +this.jobs.moratabPackaging + +this.jobs.BehindPrecentage;
    }
  },
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            await this.api(`global/delete_all`, {
              table: "JobPackagingDaily",
              where: {
                ID_KEY: item.ID_KEY
              }
            });
            await this.findItems({});
          }
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        this.$set(this.jobs, "PackagePlanID", this.$route.params.id);
        this.$set(this.jobs, "UnitID", this.$route.params.PackagedUnitID);
        this.$set(this.jobs, "DailyType", this.$route.params.DailyType);
        saveItem = await this.api(
          `global/${this.jobs.isEdit ? "update_one" : "create_one"}`,
          {
            table: "JobPackagingDaily",
            where: !this.jobs.isEdit
              ? this.jobs
              : {
                  ID_KEY: this.jobs.ID_KEY
                },
            update: this.jobs
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.jobs, "Name", x.data.Name);
          })
          .catch(error => {
            this.handleError(error);
          })
          .finally(() => {});
      }
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["id"];
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "JobPackagingDaily",
          where: {
            UnitID: this.$route.params.PackagedUnitID,
            PackagePlanID: this.$route.params.id,
            DailyType: this.$route.params.DailyType
          }
        });
        let data = x.data;
        data.push({
          JobName: "الأجمالي",
          moratab: lodash.sumBy(data, ele => ele.moratab),
          SoldierNumber: lodash.sumBy(data, ele => ele.SoldierNumber),
          moratabPackaging: lodash.sumBy(data, ele => ele.moratabPackaging),
          BehindPrecentage: lodash.sumBy(data, ele => ele.BehindPrecentage),
          TotalMatlob: lodash.sumBy(data, ele => ele.TotalMatlob),
          Available: lodash.sumBy(data, ele => ele.Available)
        });
        let printer = {
          data: [...data],
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        };

        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    actionAdd() {
      this.$set(this, "jobs", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "jobs", {
        ...item,
        isEdit: true
      });
      this.findOne(item.SoilderID);
    }
  }
};
</script>
