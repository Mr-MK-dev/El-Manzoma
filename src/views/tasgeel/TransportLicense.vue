<template>
  <div>
    <v-dialog
      persistent
      v-model="soliderTable.isDisplayed"
      scrollable
      width="1800"
    >
      <v-card>
        <v-btn @click="closeDialog()" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <table-bulider
          :headers="soliderTable.headers"
          :printer="soliderTable.printer"
          :items="soliderTable.items"
          :title="'الجنود'"
          :wordFile="'/tasgeel/transportLicense'"
        >
        </table-bulider>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      v-model="startAddProccess"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-title>
          <v-btn @click="closeDialog()" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <soldier-search
          :key="`${transportLicense.WeaponID} - ${transportLicense.RecuStage}`"
          @on-select="selectSoldiers"
          :externalFilter="{
            RecuStage: transportLicense.RecuStage,
            WeaponID: transportLicense.WeaponID
          }"
          :isFiltered="true"
        />
      </v-card>
    </v-dialog>
    <search-bulider
      :fields="transportLicenseTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd"
      :clearOption="true"
      title="تراخيص النقل"
      addBtnTitle="إضافة ترخيص النقل"
    />
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="transportLicenseTable.headers"
      :selects="selects"
      :data="transportLicense"
      @on-submit="openChooseDialog()"
      @on-close="closeDialog()"
    >
    </editor-dialog-bulider>
    <table-bulider
      :headers="transportLicenseTable.headers"
      :printer="transportLicenseTable.printer"
      :items="transportLicenseTable.items"
      :title="'تراخيص النقل'"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip @click="openSolidersDialog(item)">
          <v-icon>
            mdi-window-{{ item.procedureShown ? "restore" : "maximize" }}
          </v-icon>
        </v-chip>
      </template>

      <template v-if="hasDeleteAccess()" v-slot:item.actionDelete="{ item }">
        <v-chip color="transparent" @click="deleteLicense(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "TransportLicense",
  async mounted() {
    await this.init();
    await this.fetchAvailableServiceEndDates();
  },
  data: () => ({
    startAddProccess: false,
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    transportLicense: {},
    search: {},
    soliderTable: {
      isDisplayed: false,
      headers: [
        {
          value: "ID",
          text: "الرقم العسكري",
          sortable: true,
          inTable: true
        },
        {
          value: "Name",
          text: "الإسم",
          sortable: true,
          inTable: true
        },
        {
          value: "Weapon.Weapon",
          text: "السلاح",
          sortable: true,
          inTable: true
        },
        {
          value: "Unit.Unit",
          dbvalue: "UnitID",
          text: "الوحدة",
          sortable: true,
          inTable: true
        },
        {
          value: "Duty.Duty",
          dbvalue: "DutyID",
          text: "الوظيفة",
          sortable: true,
          inTable: true
        },
        {
          value: "RecuStartDate",
          text: "تاريخ التجنيد",
          sortable: true,
          inTable: true
        },
        {
          value: "RecuEndDate",
          text: "تاريخ التسريج ",
          sortable: true,
          inTable: true
        }
      ],
      items: [],
      printer: {}
    },
    searchLoading: false,
    transportLicenseTable: {
      headers: [
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          sort: 1
        },

        {
          text: "التاريخ",
          value: "Date",
          searchValue: "Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
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
        },
        {
          text: "",
          value: "actionDelete",
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
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      }
    },

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    }
  }),
  methods: {
    initDates() {
      let dates = this.transportLicenseTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        multi = [],
        date = ["Date"];

      where = this.mapToQuery(where, likes, multi, date);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "TransportLicense",
          where: this.cleanObject({
            ...where
          }),
          include: [
            {
              model: "Weapon"
            }
          ]
        });

        let data = x.data,
          printer = {
            data: [
              ...data.map(ele => ({
                ...ele
              }))
            ],

            excelKey: "data",
            excelHeaders: this.transportLicenseTable.headers.filter(
              f => f.inTable && f.text.length
            )
          };
        this.$set(this.transportLicenseTable, "items", data);
        console.log("items", this.transportLicenseTable.items);
        this.$set(this.transportLicenseTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError("the error", error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async saveItem() {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${
            this.transportLicense.isEdit ? "update_one" : "create_one"
          }`,
          {
            table: "TransportLicense",
            where: !this.transportLicense.isEdit
              ? this.transportLicense
              : {
                  TransportLicenseID: this.transportLicense.TransportLicenseID
                },
            update: this.transportLicense
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems({});
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
    async deleteLicense(item) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        for (let i = 0; i < item.SoldierIDS.split(",").length; i++) {
          console.log(i);
          await this.api("global/update_one", {
            table: "Soldier",
            where: {
              ID: item.SoldierIDS.split(",")[i]
            },
            update: {
              isPrinted: false
            }
          });
        }

        saveItem = await this.api("global/delete_all", {
          table: "TransportLicense",
          where: {
            TransportLicenseID: item.TransportLicenseID
          }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
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
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    closeDialog() {
      this.$set(this.createdObject, "model", false);
      this.$set(this, "transportLicense", {});
      this.$set(this.soliderTable, "isDisplayed", false);
      this.$set(this.soliderTable, "items", []);
      this.$set(this.soliderTable, "printer", {});
      this.$set(this, "startAddProccess", false);
    },
    openChooseDialog() {
      if (
        !this.transportLicense.RecuStage ||
        !this.transportLicense.WeaponID ||
        !this.transportLicense.Date
      ) {
        this.showError(
          "من فضلك قم باختيار السلاح و المرحلة التجنيدية و التاريخ"
        );
      } else {
        this.$set(this.createdObject, "model", false);
        this.$set(this, "startAddProccess", true);
        this.$set(this.soliderTable, "isDisplayed", false);
        this.$set(this.soliderTable, "items", []);
        this.$set(this.soliderTable, "printer", {});
      }
    },
    async selectSoldiers(ChoosenSoldierIDS) {
      console.log("here I log");
      console.log(this.transportLicense);
      console.log(ChoosenSoldierIDS);
      this.$set(this, "startAddProccess", false);
      let IDs = [];
      Object.keys(ChoosenSoldierIDS).forEach(key => {
        IDs.push(ChoosenSoldierIDS[key].ID);
      });
      console.log(IDs);
      this.$set(this.transportLicense, "SoldierIDS", IDs.toString());

      await this.saveItem();

      this.$set(this.createdObject, "model", false);
      this.$set(this, "transportLicense", {});
      this.$set(this.soliderTable, "isDisplayed", false);
      this.$set(this.soliderTable, "items", []);
      this.$set(this.soliderTable, "printer", {});
      this.$set(this, "startAddProccess", false);
    },
    async openSolidersDialog(item) {
      const x = await this.api("global/get_all", {
        table: "Soldier",
        where: {
          ID: {
            $in: item.SoldierIDS.split(",")
          }
        },
        include: [
          {
            model: "Weapon"
          },
          {
            model: "Unit"
          },
          {
            model: "Duty"
          }
        ]
      });
      let data = x.data,
        printer = {
          data: [
            ...data.map((ele, index) => ({
              ...ele,
              index: index + 1,
              unit: ele?.Unit?.Unit?.replace("(", "")?.replace(")", ""),
              duty: ele.Duty.Duty,
              weapon: ele.Weapon.Weapon,
              RecuEndDate: ele.RecuEndDate
            }))
          ],
          RecuStage: item.RecuStage,
          StageNumber: constants.RecuStage.data.find(
            ele => ele.text == item.RecuStage.split("-")[0]
          )?.count,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          weapon: item.Weapon.Weapon,
          excelKey: "data",
          excelHeaders: this.transportLicenseTable.headers.filter(
            f => f.inTable && f.text.length
          )
        };
      this.$set(this.soliderTable, "items", data);
      this.$set(this.soliderTable, "isDisplayed", true);
      this.$set(this.soliderTable, "printer", printer);
    }
  }
};
</script>
