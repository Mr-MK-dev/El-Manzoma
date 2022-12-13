<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        :selects="selects"
        :loading="searchLoading"
        @on-search="findAccidentOtherLoss"
        :clearOption="true"
        title="بحث متقدم "
        :addButton="true"
        addBtnTitle="إضافة خسائر"
        @on-add="actionAdd()"
    />

    <table-bulider
        :headers="mainTable.headers"
        :items="mainTable.items"
        :title="'الخسائر الأخرى الخاصة بالحادثة'"
        :printer="mainTable.printer"
    >
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="actionDelete(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.IsReturned="{ item }">
        <v-chip
            :color="item.IsReturned == 1 ? 'success' : 'error'"
        >
          {{ item.IsReturned ? "نعم" : "لا" }}
        </v-chip>
      </template>
    </table-bulider>


    <editor-dialog-bulider
        :title="''"
        :open="createdObject.model"
        :loading="createdObject.loading"
        :fields="mainTable.headers"
        :selects="selects"
        :data="otherLoss"
        @on-submit="saveItem()"
        @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../../../Constant").default;
export default {
  name: "OtherLoss",
  mounted() {
    this.init();
    this.findAccidentOtherLoss({});
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    otherLoss:{},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: false,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "نوع الموقف",
          value: "OtherLossType.Name",
          searchValue: "OtherLossTypeID",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: false
        },

        {
          text: "بيانات",
          value: "Name",
          searchValue: "Name",
          type: "text",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "السبب",
          value: "Reason",
          searchValue: "Reason",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "تم العودة",
          value: "IsReturned",
          searchValue: "IsReturned",
          type: "checkbox",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: true
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      OtherLossTypeID: {
        table :"OtherLossTypes",
        text: "Name",
        value: "ID_KEY",
      },
    },
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    }
  }),
  methods: {
    async findAccidentOtherLoss(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
            ...filters,
        AccidentID : this.$route.params.id
          },
          likes = [ "Name"],
          multi = [];
      try {
        const result = await this.api("global/get_all", {
          where: this.mapToQuery(where, likes, multi),

          table: "OtherLoss",
          include: [
            {
              model: "OtherLossTypes"
            }
          ]
        });
        this.$set(this.mainTable, "items", result.data);
        this.$set(this.mainTable, "printer", {
          data: result.data,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", false);
      let saveItem;
      this.$set(this ,"otherLoss" , {...this.otherLoss , AccidentID : this.$route.params.id})
      try {
        saveItem = await this.api(
            `global/${this.otherLoss.isEdit ? "update_one" : "create_one"}`,
            {
              table: "OtherLoss",
              where: !this.otherLoss.isEdit
                  ? this.otherLoss
                  : {
                    ID_KEY: this.otherLoss.ID_KEY
                  },
              update: this.otherLoss
            }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
      await    this.findAccidentOtherLoss({});
      this.$set(this.createdObject  , "model" , false);

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
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من حذف هذه الخسائر ؟`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "OtherLoss",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findAccidentOtherLoss({});
        }
      });
    },
    actionAdd() {
      this.$set(this.otherLoss, "isEdit", false);
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "otherLoss", {
        ...item,
        isEdit: true
      });
    },

  }
};
</script>
