<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الترقيات"
      addBtnTitle="إضافة ترقي"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الترقيات'"
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
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      @on-close="createdObject.model = false"
      :data="level"
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
  name: "LevelUp",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    level: {},
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
          text: "المسلسل",
          value: "count",
          searchValue: "count",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تاريخ اخد الدرجة",
          value: "date_level",
          searchValue: "date_level",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "level",
          searchValue: "level",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "LevelUp",
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      level: {
        table: "Levels",
        text: "Level",
        value: "Level"
      }
    }
  }),
  watch: {
    "level.id"(newValue) {
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
            table: "prevlevelup",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({});
        }
      });
    },
    async saveItem(edirableFromTableItem) {
      if (!this.level.id) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }
      try {
        const prevlevelups = await this.api("global/get_all", {
          table: "prevlevelup",
          where: {
            id: this.level.id
          }
        });
        let NoChangeInDate = prevlevelups.data.find(
          ele => ele.date_level === this.level.date_level
        );
        if (!this.level.isEdit) {
          if (prevlevelups.data.find(ele => ele.level === this.level.level)) {
            return this.showError("لقد حصل هذا الفرد علي تلك الترقية من قبل");
          }
        } else {
          if (
            prevlevelups.data.find(ele => ele.level === this.level.level) &&
            NoChangeInDate
          ) {
            return this.showError("لقد حصل هذا الفرد علي تلك الترقية من قبل");
          }
        }
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(
          `global/${this.level.isEdit ? "update_one" : "create_one"}`,
          {
            table: "prevlevelup",
            where: !this.level.isEdit
              ? { ...this.level, count: prevlevelups.data.length + 1 }
              : {
                  ID_KEY: this.level.ID_KEY
                },
            update: this.level
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.$set(this.createdObject, "model", false);
          this.showSuccess("تم حفظ ");
          this.findItems();
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
    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.level, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },
    findItems(filters) {
      this.mainTable.items = [];
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        multi = [],
        dates = ["date_level"];

      this.api("global/get_all", {
        table: "prevlevelup",
        include: [{ model: "Rateb" }],
        where: this.mapToQuery(where, multi, dates)
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
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionAdd() {
      this.$set(this, "level", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "level", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
