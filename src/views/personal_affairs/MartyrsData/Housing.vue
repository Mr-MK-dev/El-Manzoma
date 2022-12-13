<template>
  <div>
    <v-card-title>
      <v-btn @click="actionAdd" large outlined color="primary">
        إضافة
      </v-btn>
    </v-card-title>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الإسكان'"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="transparent" @click="deleteItem(item)">
            <v-icon color="error">mdi-delete</v-icon>
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
      :data="martyr"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
export default {
  name: "Housing",
  props: {
    id: {
      type: String,
      default: "0"
    },
    militaryType: {
      type: String,
      default: "0"
    },
    Kind: {
      type: String,
      default: "0"
    }
  },
  data: () => ({
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    martyr: {},
    search: {},
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
          text: "أوراق",
          value: "Papers",
          searchValue: "Papers",
          type: "select",
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "تخصيص",
          value: "Customize",
          searchValue: "Customize",
          type: "select",
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "المستفيد",
          value: "Beneficiary",
          searchValue: "Beneficiary",
          type: "select",
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الإسم",
          value: "BeneficiaryName",
          searchValue: "BeneficiaryName",
          type: "text",
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الهاتف",
          value: "PhoneNumber",
          searchValue: "PhoneNumber",
          type: "text",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "المكان",
          value: "Place",
          searchValue: "Place",
          type: "text",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "textarea",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      Beneficiary: {
        data: ["الوالد", "الوالدة", "أخ", "أخت", "أخت", "زوجة", "أبن", "أبنة"]
      },
      Papers: {
        data: ["تم التقديم", "لم يتم التقديم"]
      },
      Customize: {
        data: ["تم التخصيص", "لم يتم التخصيص"]
      }
    }
  }),

  mounted() {
    this.findItems({ ID: this.id });
  },
  watch: {
    "martyr.grantee"(newValue) {
      this.findFamily(newValue);
    }
  },
  methods: {
    async findFamily(kind) {
      if (kind.includes("الوالد")) {
        let family;
        try {
          family = await this.api("global/get_all", {
            table: "ParentsAndBrothers",
            where: { ID: this.id }
          });
          let data = family.data.filter(ele => ele.RelevantType == kind);
          this.$set(this.martyr, "granteeName", data[0].RelevantName);
        } catch (error) {
          this.handleError(error);
        }
      }
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID", "Name"],
        multi = [],
        date = [];

      where = this.mapToQuery(where, likes, multi, date);
      this.api("global/get_all", {
        table: "Housing",
        where
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [
                ...data.map(ele => ({
                  ...ele
                }))
              ],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      saveItem = await this.api(
        `global/${this.martyr.isEdit ? "update_one" : "create_one"}`,
        {
          table: "Housing",
          where: !this.martyr.isEdit
            ? {
                ...this.martyr,
                ID: this.id,
                MilitaryType: this.militaryType,
                Kind: this.Kind
              }
            : {
                ID_KEY: this.martyr.ID_KEY
              },
          update: { ...this.martyr, ID: this.id }
        }
      );

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems({ ID: this.id });
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this, "martyr", {});

      this.$set(this, "martyr", { isEdit: false });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "martyr", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "Housing",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findItems({ ID: this.id });
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>

<style></style>
