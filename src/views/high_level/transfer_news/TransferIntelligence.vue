<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في تنقلات المخابرات"
      addBtnTitle="إضافة تنقل للمخابرات"
      :addButton="isAdmin()"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :isExcel="true"
      :title="'تنقلات المخابرات'"
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
        <v-chip color="transparent" v-if="isAdmin()">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.isCertifiedText="{ item }">
        <v-chip
          :disabled="!isAdmin()"
          @click="actionisCertified(item)"
          :color="item.colorisCertified"
        >
          {{ item.isCertifiedText }}
        </v-chip>
      </template>
      <template v-slot:item.isHiddenText="{ item }">
        <v-chip
          :disabled="!isAdmin()"
          @click="actionisHidden(item)"
          :color="item.colorisHidden"
        >
          {{ item.isHiddenText }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات تنقلات المخابرات"
      :open="showAddDialog"
      :selects="selects"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="mainTable.headers"
      :data="intelligence"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "TransferIntelligence",

  mounted() {
    this.init();
  },
  watch: {
    "intelligence.RatebID"(newValue) {
      this.findOne(newValue);
    }
  },

  data: () => ({
    loading: false,
    searchAgain: {},
    search: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    showAddDialog: false,
    intelligence: {},
    showSearch: true,
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
          inSearch: true,
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
          text: "الوحدة الحالية",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
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
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "أسم الموصي",
          value: "RecommenderName",
          searchValue: "RecommenderName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ التوصية",
          value: "dateOfRecommendation",
          searchValue: "dateOfRecommendation",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نوع الإنتقال",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
        // {
        //   text: "التصديق",
        //   value: "isCertifiedText",
        //   searchValue: "isCertified",
        //   sortable: true,
        //   type: "select",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   sort: 1
        // },
        // {
        //   text: "إخفاء",
        //   value: "isHiddenText",
        //   searchValue: "isHidden",
        //   sortable: true,
        //   type: "select",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   forAdmin: true,
        //   sort: 1
        // }
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
      Type: {
        text: "text",
        value: "text",
        data: ["إنتداب", "خارج المجموعة", "إنتقال"]
      }
    }
  }),

  methods: {
    findOne(id) {
      if (id.length > 10) {
        this.$set(this, "loading", true);

        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.intelligence, "Name", x.data.Name);
            this.$set(this.intelligence, "UnitID", x.data.UnitID);
            this.$set(this.intelligence, "RatebCategory", x.data.RatebCategory);
          })
          .catch(error => {})
          .finally(() => {
            this.$set(this, "loading", false);
          });
      }
    },
    async actionAdd() {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "intelligence", {
        TransferListID: this.intelligence.TransferListID,
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async actionEdit(item) {
      this.findOne(item.RatebID);

      this.$set(this, "showAddDialog", true);

      this.$set(this, "intelligence", { ...item, isEdit: true });
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "TransferIntelligence",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({
            TransferListID: this.intelligence.TransferListID
          });
        }
      });
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      console.log(filters);
      this.api("global/get_all", {
        table: "TransferIntelligence",
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              UnitID: filters?.UnitID,
              ID: filters?.RatebID
            }),
            include: [{ model: "Unit" }]
          },
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: filters?.TransferListID,
          RecommendedUnitID: filters?.RecommendedUnitID
        })
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele,
            isCertified: ele.isCertified,
            isCertifiedText: ele.isCertified
              ? "تم التصديق"
              : "في أنتظار التصديق",
            colorisCertified: ele.isCertified ? "success" : "gray",
            isHidden: ele.isHidden,
            isHiddenText: ele.isHidden ? "تم الإخفاء" : "لم يتم إخفاءه",
            colorisHidden: ele.isHidden ? "warning" : "gray"
          }));
          if (!this.isAdmin()) {
            data = data.filter(ele => ele.isCertified && !ele.isHidden);
          }

          let printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };
          console.log(data);
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
    async checkIsAvalible() {
      let there = await this.api("global/get_one", {
        table: "TransferCandidates",
        where: {
          TransferListID: this.intelligence.TransferListID,
          RatebID: this.intelligence.RatebID
        }
      });
      return there;
    },
    async saveItem() {
      let there = await this.checkIsAvalible();
      if (!there.data && this.intelligence.isEdit == false) {
        this.showError("هذا الفرد غير موجود بالنشرة");
        return;
      }
      let hasPrevOne = await this.api("global/get_one", {
        table: "TransferIntelligence",
        where: {
          TransferListID: this.intelligence.TransferListID,
          RatebID: this.intelligence.RatebID
        }
      });

      if (hasPrevOne.data && this.intelligence.isEdit == false) {
        this.showError("هذا الفرد مضاف له تنقل من قبل");
        return;
      }
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.intelligence.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "TransferIntelligence",
            where: this.intelligence.ID_KEY
              ? {
                  ID_KEY: this.intelligence.ID_KEY
                }
              : {
                  ...this.intelligence
                },
            update: {
              ...this.intelligence
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.intelligence = {};
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
    actionisCertified(item) {
      if (!this.isAdmin()) {
        this.showError("يجب ان يصدق رئيس الفرع");

        return;
      }

      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.isCertified) {
              await this.api(`global/update_one`, {
                table: "TransferIntelligence",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isCertified: false
                }
              });
            } else if (!item.isCertified) {
              await this.api(`global/update_one`, {
                table: "TransferIntelligence",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isCertified: true
                }
              });
            }
            this.findItems(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    actionisHidden(item) {
      if (!this.isAdmin()) {
        this.showError("يجب ان يتم الإخفاء من رئيس الفرع");

        return;
      }

      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.isHidden) {
              await this.api(`global/update_one`, {
                table: "TransferIntelligence",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isHidden: false
                }
              });
            } else if (!item.isHidden) {
              await this.api(`global/update_one`, {
                table: "TransferIntelligence",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isHidden: true
                }
              });
            }
            this.findItems(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  // }
};
</script>
