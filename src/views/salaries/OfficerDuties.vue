<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      :clearOption="true"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في وظائف الضباط "
      addBtnTitle="إضافة وظيفة"
    />

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.isDeleted="{ item }">
        <v-chip :color="item.isDeleted ? 'error' : 'success'">
          {{ item.isDeletedText }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات الوظيفة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="OfficerDuty"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "OfficerDuties",

  mounted() {
    this.init();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    OfficerDuty: {
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
        text: "الوظيفة",
        value: "OfficerDuty",
        searchValue: "OfficerDuty",
        sortable: true,
        type: "text",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "جهة الإمداد",
        value: "Weapon.Weapon",
        searchValue: "WeaponID",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "حالة الوظيفة",
        value: "isDeleted",
        searchValue: "isDeleted",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {
      DutyID: {
        table: "OfficerDuty",
        text: "OfficerDuty",
        value: "DutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      isDeleted: {
        data: [
          {
            text: "متاحة",
            value: false
          },
          {
            text: "ملغاه",
            value: true
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
      let where = { ...data },
        likes = ["ID"],
        multi = [];
      where = this.mapToQuery(where, likes, multi);

      this.api("global/get_all", {
        table: "OfficerDuty",
        where,
        include: [
          {
            model: "Weapon"
          }
        ]
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              isDeletedText: ele.isDeleted ? "ملغاة" : "متاحة"
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
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async actionAdd() {
      this.$set(this, "item", {});
      this.$set(this, "showAddDialog", true);
    },

    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "OfficerDuty", {
        ...item,
        isEdit: true,
        isDeleted: item.isDeleted ? true : false
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        let OfficerDutys = await this.api("global/get_all", {
          table: "OfficerDuty",
          where: {}
        });
        saveItem = await this.api(
          !this.OfficerDuty.OfficerDutyID
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "OfficerDuty",
            where: this.OfficerDuty.OfficerDutyID
              ? {
                  OfficerDutyID: this.OfficerDuty.OfficerDutyID
                }
              : {
                  ...this.OfficerDuty,
                  OfficerDutyID: OfficerDutys.data.length + 3
                },
            update: {
              ...this.OfficerDuty
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
