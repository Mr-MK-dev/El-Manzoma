<template>
  <div>
    <v-btn
      v-if="!showSearch"
      class="mx-auto"
      @click="actionAdd()"
      large
      outlined
      color="primary"
    >
      إضافة بيان إستعواض خسائر
    </v-btn>
    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.details="{ item }">
        <v-chip color="primary" @click="toLossCompensationDetails(item)">
          {{ "التفاصيل" }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="تقرير إستعواض الخسائر"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="loss"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("@/Constant").default;

export default {
  name: "packagingUnits",

  mounted() {
    this.initWithoutChecking();
    this.handleSearch();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    loss: {
      isConfirmed: false
    },
    items: [],
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
        text: "الوحدة",
        value: "LossGroup.Name",
        searchValue: "LossGroupID",
        sortable: true,
        type: "select",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "مرتب حرب /عدد المجموعات",
        value: "moratabWar",
        searchValue: "moratabWar",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "نسبة خسائر السلاح (30%)",
        value: "lossPercentage",
        searchValue: "lossPercentage",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "نسبة لاتعود",
        value: "nonRerturned",
        searchValue: "nonRerturned",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "نسبة التخلفات",
        value: "AbsencePercentage",
        searchValue: "AbsencePercentage",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "مطلوب",
        value: "Ordered",
        searchValue: "Ordered",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "معين",
        value: "Placed",
        searchValue: "Placed",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "نسبة المطلوب / معين",
        value: "PlacedPerOrdered",
        searchValue: "PlacedPerOrdered",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "التفاصيل",
        value: "details",
        searchValue: "details",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      }
    ],
    selects: {
      DirectionforFeaat: {
        text: "text",
        value: "text",
        data: constants.DirectionforFeaat.data
      },
      LossGroupID: {
        table: "LossGroups",
        value: "ID_KEY",
        text: "Name"
      }
    }
  }),

  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "lossCompensation",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.handleSearch(this.search);
        }
      });
    },

    async actionAdd() {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "loss", {
        isEdit: false
      });
    },
    toLossCompensationDetails(item) {
      this.$router.push(
        `/CompensationPlanDetails/${item.PackagePlanID}/${item.LossGroupID}`
      );
    },
    handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      this.api("global/get_all", {
        table: "lossCompensation",
        include: [
          {
            model: "LossGroups"
          },
          {
            model: "PackagePlan"
          }
        ],
        where: { PackagePlanID: this.$route.params.id }
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              hasPackagingText: ele.hasPackaging ? "نعم" : "لا"
            })),
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inSearch)
            };

          this.$set(this, "items", data);
          this.$set(this, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "loss", {
        ...item,
        isEdit: true
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.loss.UnitID ? `global/create_one` : `global/update_one`,
          {
            table: "lossCompensation",
            where: this.loss.ID_KEY
              ? {
                  ID_KEY: this.loss.ID_KEY
                }
              : {
                  ...this.loss,
                  PackagePlanID: this.$route.params.id
                },
            update: {
              ...this.loss
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.handleSearch(this.search);
          this, "showAddDialog", false;
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
    }
  }
};
</script>
