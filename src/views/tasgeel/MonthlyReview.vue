<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      @on-search="findItems"
      @on-add="actionAdd()"
      v-if="!id"
      :clearOption="true"
      title="بحث متقدم في المراجعات الشهرية"
      addBtnTitle="إضافة الي المراجعات الشهرية"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المراجعات الشهرية'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="hasDeleteAccess()">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.fillUnits="{ item }">
        <v-chip
          icon
          color="primary"
          @click="
            item.isFilled == 1
              ? actionRouteToDetails(item)
              : actionFillData(item)
          "
        >
          <v-icon v-if="item.isFilled">mdi-information-variant</v-icon>
          <v-icon v-if="!item.isFilled">mdi-arrow-up-bold-box-outline</v-icon>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة مراجعة شهرية'"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :data="MonthlyReview"
      :selects="selects"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
import lodash from "lodash";
export default {
  name: "MonthlyReview",

  mounted() {
    this.init();
  },

  data: () => ({
    MonthlyReview: {},

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    loading: false,
    showFillDialog: false,

    mainTable: {
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
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ النشرة",
          value: "DateOfMonthlyReview",
          searchValue: "DateOfMonthlyReview",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "fillUnits",
          searchValue: "fillUnits",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    selects: {}
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(
        `هل انت متاكد من حذف جميع البيانات التي تخص المراجعة الشهرية`,
        {
          title: ``
        }
      )
        .then(async res => {
          if (res) {
            let deleteitem = await this.api(`global/delete_all`, {
              table: "OutOfRenew",
              where: {
                RenewListID: item.ID_KEY
              }
            });

            await this.api(`global/delete_all`, {
              table: "OtherRenewCandidates",
              where: {
                RenewListID: item.ID_KEY
              }
            });
            await this.api(`global/delete_all`, {
              table: "RenewAddPlans",
              where: {
                RenewListID: item.ID_KEY
              }
            });
            await this.api(`global/delete_all`, {
              table: "RenewCandidates",
              where: {
                RenewListID: item.ID_KEY
              }
            });
            await this.api(`global/delete_all`, {
              table: "RenewRemovePlans",
              where: {
                RenewListID: item.ID_KEY
              }
            });
            await this.api(`global/delete_all`, {
              table: "RenewList",
              where: {
                ID_KEY: item.ID_KEY
              }
            });

            if (deleteitem.ok) {
              this.findItems({});
            } else {
              console.log("failed");
            }
          }
        })
        .catch(err => {
          this.handleError(err);
        });
    },

    async saveItem(edirableFromTableItem) {
      try {
        let saveItem;
        saveItem = await this.api(
          `global/${this.MonthlyReview.isEdit ? "update_one" : "create_one"}`,
          {
            table: "MonthlyReview",
            where: !this.MonthlyReview.isEdit
              ? this.MonthlyReview
              : {
                  ID_KEY: this.MonthlyReview.ID_KEY
                },
            update: this.MonthlyReview
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems({});
          this.$set(this.createdObject, "model", false);
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
    async actionFillData() {
      console.log(this.MonthlyReview);
      this.$set(this, "loading", true);
      let review;
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Unit",
          where: {
            Status: "بالخدمة"
          }
        });

        let data = x.data;

        for (let i = 0; i < data.length; i++) {
          let units = {
            MonthlyReviewID: this.MonthlyReview.ID_KEY,
            UnitID: data[i].UnitID
          };
          review = await this.api("global/create_one", {
            table: "MonthlyReviewUnits",
            where: units
          });
        }
        await this.api("global/update_one", {
          table: "RenewList",
          where: { ID_KEY: this.RenewNew.ID_KEY },
          update: { isFilled: true }
        });
        this.$set(this, "loading", false);
        this.$set(this, "showFillDialog", false);
        this.showSuccess("تم اضافة المختارين ");
        await this.findItems({});
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");

        console.log("error", error);
      } finally {
        this.$set(this, "loading", false);
        this.$set(this, "showFillDialog", false);
      }
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID_KEY", "Name"],
        dates = ["DateOfMonthlyReview"],
        multi = [];

      where = this.mapToQuery(where, likes, multi, dates);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "MonthlyReview"
        });

        let data = x.data.map(ele => ({
          ...ele
        }));
        this.$set(this.mainTable, "items", data);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async actionAdd() {
      this.$set(this, "MonthlyReview", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionRouteToDetails(item) {
      this.$router.push(`/MonthlyReviewDetails/${item.ID_KEY}`);
    }
  }
};
</script>

<style scoped></style>
