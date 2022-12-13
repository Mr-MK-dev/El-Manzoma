<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في النياشين والانواط"
      addBtnTitle="إضافة الي النياشين والانواط"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'النياشين والانواط'"
    >
      <template v-slot:item.SoilderID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoilderID}`"
          @click.right="copyText(item.SoilderID)"
        >
          {{ item.SoilderID }}
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
      :data="Neshan"
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
  name: "Neshan",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    Neshan: {},
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
          value: "SoilderID",
          searchValue: "SoilderID",
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
          text: "النيشان",
          value: "Noot",
          searchValue: "Noot",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "السبب",
          value: "Ression",
          searchValue: "Ression",
          sortable: true,
          type: "textarea",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "رقم بند الاوامر",
          value: "Orderid",
          searchValue: "Orderid",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "التاريخ",
          value: "Date",
          searchValue: "Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "textarea",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "NeshanUp",
    selects: {
      Neshan_Text: {
        data: constants.grads
      },
      Neshan: {
        data: constants.ratebNeshans
      }
    }
  }),
  watch: {
    "Neshan.SoilderID"(newValue) {
      this.findOne(newValue);
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
              table: "Neshan",
              where: {
                ID: item.ID
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
      if (!this.Neshan.Name) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(
          `global/${this.Neshan.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Neshan",
            where: !this.Neshan.isEdit
              ? this.Neshan
              : {
                  ID: this.Neshan.ID
                },
            update: this.Neshan
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
            this.$set(this.Neshan, "Name", x.data.Name);
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
        likes = ["id"],
        multi = [],
        dates = ["Date"];
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Neshan",
          include: [{ model: "Rateb" }],
          where: this.mapToQuery(where, likes, multi, dates)
        });
        let data = x.data,
          printer = {
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
      this.$set(this, "Neshan", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "Neshan", {
        ...item,
        isEdit: true
      });
      this.findOne(item.SoilderID);
    }
  }
};
</script>
