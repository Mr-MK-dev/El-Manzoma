<template>
  <div>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider
        :headers="honors.headers"
        :items="honors.items"
        :title="'التكريمات'"
      >
      </table-bulider>
    </v-card>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider
        :headers="hajj.headers"
        :items="hajj.items"
        :title="'الحج و العمرة'"
      >
      </table-bulider>
    </v-card>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider
        :headers="jobs.headers"
        :items="jobs.items"
        :title="'الوظائف'"
      >
      </table-bulider>
    </v-card>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider
        :headers="publicity.headers"
        :items="publicity.items"
        :title="'اعلان شهيد'"
      >
      </table-bulider>
    </v-card>
  </div>
</template>

<script>
const constants = require("@/Constant").default;

export default {
  name: "basic-profile-honors",
  props: {
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  async mounted() {
    await this.findItems();
  },
  methods: {
    async findItems() {
      this.api("global/get_all", {
        table: "Honors",
        where: {
          ID: this.conscripte.ID
        }
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
              excelHeaders: this.honors.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          this.$set(this.honors, "items", data);
          this.$set(this.honors, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
      this.api("global/get_all", {
        table: "Employment",
        where: {
          ID: this.conscripte.ID
        }
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
              excelHeaders: this.jobs.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          this.$set(this.jobs, "items", data);
          this.$set(this.jobs, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
      this.api("global/get_all", {
        table: "Hajj",
        where: {
          ID: this.conscripte.ID
        }
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
              excelHeaders: this.hajj.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          this.$set(this.hajj, "items", data);
          this.$set(this.hajj, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
      this.api("global/get_all", {
        table: "PublicName",
        where: {
          ID: this.conscripte.ID
        }
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
              excelHeaders: this.publicity.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          this.$set(this.publicity, "items", data);
          this.$set(this.publicity, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    honors: {
      headers: [
        {
          text: "مكان التكريم",
          value: "HonorPlace",
          searchValue: "HonorPlace",
          type: "text",
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "التكريم",
          value: "Honor",
          searchValue: "Honor",
          type: "text",
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "المستفيد",
          value: "grantee",
          searchValue: "grantee",
          type: "select",
          required: true,
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الاسم",
          value: "granteeName",
          searchValue: "granteeName",
          type: "text",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "مكان التكريم",
          value: "HonorPlace",
          searchValue: "HonorPlace",
          type: "text",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "تاريخ التكريم",
          value: "Date",
          searchValue: "Date",
          type: "date",
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
    hajj: {
      headers: [
        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          type: "select",
          required: true,
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "المستفيد",
          value: "grantee",
          searchValue: "grantee",
          type: "select",
          required: true,
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الاسم",
          value: "granteeName",
          searchValue: "granteeName",
          type: "text",
          sortable: true,
          required: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "التاريخ",
          value: "Date",
          searchValue: "Date",
          type: "date",
          sortable: true,
          required: true,
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
    jobs: {
      headers: [
        {
          text: "الاوراق",
          value: "PapersExist",
          searchValue: "PapersExist",
          type: "select",
          required: true,
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "حالة التوظيف",
          value: "EmploymentState",
          searchValue: "EmploymentState",
          type: "select",
          required: true,
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "المستفيد",
          value: "grantee",
          searchValue: "grantee",
          type: "select",
          required: true,
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الاسم",
          value: "granteeName",
          searchValue: "granteeName",
          type: "text",
          sortable: true,
          required: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "المكان",
          value: "WorkPlace",
          searchValue: "WorkPlace",
          type: "text",
          sortable: true,
          required: true,
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
    publicity: {
      headers: [
        {
          text: "إطلاق",
          value: "PublicName",
          searchValue: "PublicName",
          type: "text",
          required: true,
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "إسم المكان",
          value: "PrevPublicName",
          searchValue: "PrevPublicName",
          type: "text",
          required: true,
          sortable: true,
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
    search: "",
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    }
  })
};
</script>
