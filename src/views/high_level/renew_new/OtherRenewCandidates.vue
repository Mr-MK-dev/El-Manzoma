<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :addButton="true"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في مرشحين التجديد خارج صلاحية النشرة"
      addBtnTitle="إضافة راتب عالي"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'مرشحين التجديد خارج صلاحية النشرة'"
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
      <template v-slot:item.RequirementText="{ item }">
        <v-chip :color="item.RequirementColor">
          {{ item.RequirementText }}
        </v-chip>
      </template>
      <template v-slot:item.isRenewDoneText="{ item }">
        <v-chip :color="item.isRenewDoneColor">
          {{ item.isRenewDoneText }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="otherRenewCandidate"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "OtherRenewCandidates",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    otherRenewCandidate: {},

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
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
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
          inModel: false,
          readonly: true,
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
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "نوع التجديد",
          value: "RenewType",
          searchValue: "RenewType",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نشرة التجديد",
          value: "RenewList.Name",
          searchValue: "RenewListID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تم التجديد",
          value: "isRenewDoneText",
          searchValue: "isRenewDone",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تم إستلام الإجراءات",
          value: "RequirementText",
          searchValue: "Requirement",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      RenewListID: {
        table: "RenewList",
        text: "Name",
        value: "ID_KEY"
      },
      RenewType: {
        data: ["التجديد الثاني", "التجديد الأول"],
        text: "text",
        value: "text"
      }
    }
  }),

  watch: {
    "otherRenewCandidate.RatebID"(newValue) {
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
              table: "OtherRenewCandidates",
              where: {
                ID_KEY: item.ID_KEY
              }
            });
            await this.findItems({ ...this.search });
          }
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    async saveItem(edirableFromTableItem) {
      if (!this.otherRenewCandidate.Name) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(
          `global/${
            this.otherRenewCandidate.isEdit ? "update_one" : "create_one"
          }`,
          {
            table: "OtherRenewCandidates",
            where: !this.otherRenewCandidate.isEdit
              ? this.otherRenewCandidate
              : {
                  ID_KEY: this.otherRenewCandidate.ID_KEY
                },
            update: this.otherRenewCandidate
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems({ ...this.search });
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
            this.$set(this.otherRenewCandidate, "Name", x.data.Name);
          })
          .catch(error => {
            this.handleError(error);
          })
          .finally(() => {});
      }
    },

    actionAdd() {
      this.$set(this, "otherRenewCandidate", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "otherRenewCandidate", {
        ...item,
        isEdit: true
      });
      this.findOne(item.RatebID);
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        ...filters
      };

      this.api("global/get_all", {
        table: "OtherRenewCandidates",
        include: [
          { model: "Rateb", include: [{ model: "Unit" }] },
          { model: "RenewList" }
        ],
        where: this.mapToQuery(where, [], [], [])
      })
        .then(async x => {
          let data = x.data.map(ele => ({
              ...ele,
              RequirementText: ele.Requirement
                ? "تم الإستلام"
                : " لم يتم الإستلام",
              Requirement: ele.RequirementText == "تم الإستلام" ? true : false,
              isRenewDone: ele.isRenewDoneText == "تم التجديد" ? true : false,
              RequirementColor: ele.Requirement ? "success" : "error",
              isRenewDoneText: ele.isRenewDone
                ? "تم التجديد"
                : " لم يتم التجديد",
              isRenewDoneColor: ele.isRenewDone ? "success" : "error"
            })),
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };
          let group = await lodash.groupBy(data, ele => ele.RatebID);
          console.log(group);
          this.$set(
            this.mainTable,
            "items",
            Object.values(group).map(ele => ele[0])
          );

          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
