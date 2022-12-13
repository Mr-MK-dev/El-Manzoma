<template>
  <div>
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
          <!-- <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="red"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn> -->
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات الوحدة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Unit"
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
    Unit: {
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
        text: "اسم الوحدة",
        value: "Unit",
        searchValue: "Unit",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "لها تعبئة",
        value: "hasPackagingText",
        searchValue: "hasPackaging",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "كود التعبئة",
        value: "TaabeaaCode",
        searchValue: "TaabeaaCode",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {
      DirectionforFeaat: {
        text: "text",
        value: "text",
        data: constants.DirectionforFeaat.data
      },
      hasPackaging: {
        text: "text",
        value: "value",
        data: [
          {
            text: "نعم",
            value: 1
          },
          {
            text: "لا",
            value: 0
          }
        ]
      },
      Category: {
        text: "text",
        value: "text",
        data: ["ساحلي", "مجموعة مخابرات", "بري"]
      },
      isHardWork: {
        text: "text",
        value: "value",
        data: [
          {
            text: "نعم",
            value: 1
          },
          {
            text: "لا",
            value: 0
          }
        ]
      },
      minimumDegree: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      maximumDegree: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      extraProfitType: {
        text: "text",
        value: "value",
        data: [
          {
            text: "متوسط",
            value: "1"
          },
          {
            text: "عالي",
            value: "2"
          },
          {
            text: "لا",
            value: "0"
          }
        ]
      },

      Directionforunit: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      GeneralDirection: {
        text: "text",
        value: "text",
        data: constants.GeneralDirection.data
      },
      statue: {
        data: [
          {
            text: "بالخدمة",
            value: "بالخدمة"
          },
          {
            text: "ملغاه",
            value: "ملغاه"
          }
        ]
      },
      SupplyLayer: {
        data: [
          {
            text: "الشريحة الاولي",
            value: "1"
          },
          {
            text: "الشريحة الثانية",
            value: "2"
          },
          {
            text: "الشريحتين",
            value: "1-2"
          }
        ]
      }
    }
  }),

  methods: {
    handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...data
        },
        likes = ["ID"],
        multi = [];
      where = this.mapToQuery(where, likes, multi);

      this.api("global/get_all", {
        table: "Unit",
        where
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
      this.$set(this, "Unit", {
        ...item,
        isEdit: true
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        let units = await this.api("global/get_all", {
          table: "Unit",
          where: {}
        });
        saveItem = await this.api(
          !this.Unit.UnitID ? `global/create_one` : `global/update_one`,
          {
            table: "Unit",
            where: this.Unit.UnitID
              ? {
                  UnitID: this.Unit.UnitID
                }
              : {
                  ...this.Unit,
                  UnitID: units.data.length + 3
                },
            update: {
              ...this.Unit
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
