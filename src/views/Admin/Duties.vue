<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      :clearOption="true"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في الوظائف "
      addBtnTitle="إضافة وظيفة"
    />

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template v-if="isAdmin()" v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
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
      :data="Duty"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "Duties",

  mounted() {
    this.init();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Duty: {
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
        value: "Duty",
        searchValue: "Duty",
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
        table: "Duty",
        text: "Duty",
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
    async handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = ["ID"],
        multi = [];
      where = this.mapToQuery(where, likes, multi);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Duty",
          where,
          include: [
            {
              model: "Weapon"
            }
          ]
        });
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
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },

    async actionAdd() {
      this.$set(this, "item", {});
      this.$set(this, "showAddDialog", true);
    },

    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Duty", {
        ...item,
        isEdit: true,
        isDeleted: item.isDeleted ? true : false
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        let Dutys = await this.api("global/get_all", {
          table: "Duty",
          where: {}
        });
        saveItem = await this.api(
          !this.Duty.DutyID ? `global/create_one` : `global/update_one`,
          {
            table: "Duty",
            where: this.Duty.DutyID
              ? {
                  DutyID: this.Duty.DutyID
                }
              : {
                  ...this.Duty,
                  DutyID: Dutys.data.length + 3
                },
            update: {
              ...this.Duty
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.handleSearch(this.search);
          this, "showAddDialog", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
      } catch (error) {
        this.handleError(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
      }
    }
  }
};
</script>
