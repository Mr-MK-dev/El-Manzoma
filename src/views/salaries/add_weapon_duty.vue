<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'إضافة وظائف لجهات الإمداد'"
    >
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
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="weaponduty"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "addWeaponDuty",
  mounted() {
    this.init();
    this.getWeapons();
  },
  data: () => ({
    weaponduty: {},
    search: {},
    searchLoading: false,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    mainTable: {
      printer: {},
      selected: [],
      search: "",
      headers: [
        {
          text: "جهة الإمداد",
          value: "Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوظائف",
          value: "Duty.Duty",
          searchValue: "DutyID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        }
      ],
      items: [],
      printer: {}
    },

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
      }
    }
  }),
  watch: {},
  methods: {
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      await this.dutyExist();
      console.log(this.dutyExist());
      if (await this.dutyExist()) {
        this.showError("هذه الوظيفة موجوده بالفعل مع جهة الامداد");
        return;
      }
      try {
        saveItem = await this.api("global/create_one", {
          table: "WeaponDutyPivot",
          where: {
            WeaponID: this.weaponduty.WeaponID,
            DutyID: this.weaponduty.DutyID
          }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");

          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");

        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "weaponduty", {
        ...item
      });
    },
    async dutyExist() {
      let data = await this.api("global/get_one", {
        table: "WeaponDutyPivot",
        where: {
          WeaponID: this.weaponduty.WeaponID,
          DutyID: this.weaponduty.DutyID
        }
      });
      if (data && data.data && data.ok) {
        console.log("data", data);
        return true;
      } else {
        return false;
      }
    },
    getWeapons() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.api("global/get_all", {
        table: "Weapon"
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
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
