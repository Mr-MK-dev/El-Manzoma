<template>
  <div>
    <search-bulider
      v-if="showSearch"
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الإتماسات"
      addBtnTitle="إضافة إلتماس"
    />

    <v-btn
      v-if="!showSearch"
      class="mx-auto"
      @click="actionAdd()"
      large
      outlined
      color="primary"
    >
      أضافة إلتماس
    </v-btn>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الإلتماسات'"
    >
      <template v-slot:item.RatebID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.RatebID}`"
          @click.right="copyText(item.RatebID)"
        >
          {{ item.RatebID }}
        </v-chip>
      </template>
      <template v-slot:item.editor="{ item }">
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
            color="red"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات إلتماسات"
      :open="showAddDialog"
      :selects="selects"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="mainTable.headers"
      :data="requestmanagement"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "RequestManagement",

  mounted() {
    this.init();
  },
  watch: {
    "requestmanagement.RatebID"(newValue) {
      this.findOne(newValue);
    }
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    showSearch: true,
    requestmanagement: {
      Note: ""
    },
    items: [],
    mainTable: {
      headers: [
        {
          text: "",
          value: "editor",
          searchValue: "editor",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: " نشرات الأنتقال",
          value: "RequestManagement.Transferlist.Name",
          searchValue: "TransferListID",
          sortable: true,
          type: "select",
          required: true,

          inSearch: true,
          inTable: false,
          inModel: true,
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
          text: "الوحدة الحالية",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
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
          text: "الوحدة الموصي الذهاب إليها",
          value: "Unit.Unit",
          searchValue: "RecommendedUnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "ملاحظات",
          value: "Note",
          searchValue: "Note",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تم التصديق عليه",
          value: "isCertified",
          searchValue: "isCertified",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ]
    },
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      RecommendedUnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      TransferListID: {
        table: "TransferList",
        value: "ID_KEY",
        text: "Name"
      },
      isCertified: {
        text: "title",
        value: "value",
        data: [
          { title: "نعم", value: 1 },
          { title: "لا", value: 0 }
        ]
      }
    }
  }),

  methods: {
    async actionAdd() {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "requestmanagement", {
        TransferListID: this.requestmanagement.TransferListID,

        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "requestmanagement", { ...item, isEdit: true });
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Requests",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({
            TransferListID: this.requestmanagement.TransferListID
          });
        }
      });
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      console.log(filters);
      this.api("global/get_all", {
        table: "Requests",
        include: [
          {
            model: "Rateb",
            include: [{ model: "Unit" }]
          },
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: filters.TransferListID
        })
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele,
            isCertified: ele.isCertified ? "نعم" : "لا"
          }));
          console.log(data);
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
    async checkIsAvalible() {
      let there = await this.api("global/get_one", {
        table: "TransferCandidates",
        where: {
          TransferListID: this.requestmanagement.TransferListID,
          RatebID: this.requestmanagement.RatebID
        }
      });
      return there;
    },
    async saveItem() {
      let there = await this.checkIsAvalible();
      if (!there.data && this.requestmanagement.isEdit == false) {
        this.showError("هذا الفرد غير موجود بالنشرة");
        return;
      }
      let hasPrevOne = await this.api("global/get_one", {
        table: "Requests",
        where: {
          TransferListID: this.requestmanagement.TransferListID,
          RatebID: this.requestmanagement.RatebID
        }
      });

      if (hasPrevOne.data && this.requestmanagement.isEdit == false) {
        this.showError("هذا الفرد مضاف له توصية من قبل");
        return;
      }
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.requestmanagement.ID_KEY
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "Requests",
            where: this.requestmanagement.ID_KEY
              ? {
                  ID_KEY: this.requestmanagement.ID_KEY
                }
              : {
                  ...this.requestmanagement
                },
            update: {
              ...this.requestmanagement
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({
            TransferListID: this.requestmanagement.TransferListID
          });
          let tranId = this.requestmanagement.TransferListID;
          this.requestmanagement = {
            Note: ""
          };
          this.$set(this.requestmanagement, "TransferListID", tranId);
          this.showAddDialog = false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
      }
    },
    findOne(id) {
      if (id.length > 10) {
        this.$set(this, "loading", true);

        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.requestmanagement, "Name", x.data.Name);
            this.$set(this.requestmanagement, "UnitID", x.data.UnitID);
          })
          .catch(error => {})
          .finally(() => {
            this.$set(this, "loading", false);
          });
      }
    }
  }
};
</script>
