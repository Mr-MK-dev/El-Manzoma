<template>
  <div>
    <!-- <search-bulider
      :fields="mainTable.headers"
      @on-search="findItems"
      @on-add="actionAdd()"
      v-if="!id"
      :clearOption="true"
      title="بحث متقدم في حطط التعبئة"
      addBtnTitle="إضافة خطة تعبئة"
    /> -->
    <!-- <editor-dialog-bulider
      title="بيانات فترة المطلوبة للنشرة"
      :open="showFillDialog"
      @on-close="showFillDialog = false"
      :loading="loading"
      :fields="addOptions"
      :data="FillOption"
      @on-submit="fillTransferData()"
    />
    <editor-dialog-bulider /> -->

    <v-btn @click="actionAdd()" large outlined color="primary">
      اضافة خطة تعبئة
    </v-btn>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'خطط التعبئة'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="hasDeleteAccess()">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.fillTransferList="{ item }">
        <div style="display: flex; flex-basis: auto;">
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
        </div>
      </template>
      <template v-slot:item.routes="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
            class="mx-auto"
            @click="lossCompensationReport(item)"
            large
            outlined
            color="primary"
          >
            خطة إستعواض الخسائر
          </v-btn>
        </div>
      </template>
      <template v-slot:item.fillCompletePlan="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
            class="mx-auto"
            @click="
              item.isCompletePlanFilled == 1
                ? actionRouteToCompletePlan(item)
                : actionFillCompletePlan(item)
            "
            large
            outlined
            color="primary"
          >
            {{
              !item.isCompletePlanFilled
                ? `اضافة الوحدات لخطة الاستكمال`
                : `عرض خطة الاستكمال`
            }}
          </v-btn>
        </div>
      </template>
      <template v-slot:item.fillOrganizationPlan="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
            class="mx-auto"
            @click="
              item.isOrganizationPlanFilled == 1
                ? actionRouteToOrganizationPlan(item)
                : actionFillOrganizationPlan(item)
            "
            large
            outlined
            color="primary"
          >
            {{
              !item.isOrganizationPlanFilled
                ? `اضافة الوحدات لخطة رئيس الهيئة`
                : `عرض خطة رئيس الهيئة`
            }}
          </v-btn>
        </div>
      </template>
      <template v-slot:item.fillDatePlan="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
            class="mx-auto"
            @click="
              item.isDateFilled == 1
                ? actionRouteToDatesPlan(item)
                : actionFillDatesPlan(item)
            "
            large
            outlined
            color="primary"
          >
            {{
              !item.isDateFilled ? `اضافة تواريخ التسريح` : `عرض تواريخ التسريح`
            }}
          </v-btn>
        </div>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة نشرة تنقلات'"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :data="packageplan"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "packagePlan",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.findItems({});
  },
  data: () => ({
    packageplan: {},
    FillOption: {},

    NotesObject: {
      model: false,
      loading: false
    },
    notes: {},

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
    // addOptions: [
    //   {
    //     text: "عدد السنوات المطلوبة",
    //     value: "TimeStart",
    //     searchValue: "TimeStart",
    //     sortable: false,
    //     type: "text",
    //     inSearch: false,
    //     inTable: false,
    //     inModel: true,
    //     sort: 1
    //   },
    //   {
    //     text: "عدد السنوات المطلوبة بعد درجة مساعد اول",
    //     value: "TimeFirstSergant",
    //     searchValue: "TimeFirstSergant",
    //     sortable: false,
    //     type: "text",
    //     inSearch: false,
    //     inTable: false,
    //     inModel: true,
    //     sort: 1
    //   }
    // ],

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
          text: "تاريخ التسريح من",
          value: "recuEndDateFrom",
          searchValue: "recuEndDateFrom",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح إلى",
          value: "recuEndDateTo",
          searchValue: "recuEndDateTo",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
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
          text: "",
          value: "fillTransferList",
          searchValue: "fillTransferList",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "routes",
          searchValue: "routes",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "خطة الاسكمال",
          value: "fillCompletePlan",
          searchValue: "fillCompletePlan",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "خطة رئيس الهيئة رقم 1",
          value: "fillOrganizationPlan",
          searchValue: "fillOrganizationPlan",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تواريخ تسريح المرحلة",
          value: "fillDatePlan",
          searchValue: "fillDatePlan",
          sortable: true,
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
    }
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من حذف جميع البيانات التي تخص خطة التعبئة`, {
        title: ``
      }).then(async res => {
        if (res) {
          let deleteitem = await this.api(`global/delete_all`, {
            table: "CompensationLossCandidates",
            where: {
              PackageID: item.ID_KEY
            }
          });

          await this.api(`global/delete_all`, {
            table: "CompletePlanCandidates",
            where: {
              PackageID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "OrganizationPlanCandidates",
            where: {
              PackageID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "AddPackageCandidates",
            where: {
              PackageID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "RemovedPackageCandidates",
            where: {
              PackageID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "lossCompensation",
            where: {
              PackagePlanID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "CompletePlanUnit",
            where: {
              PackagePlanID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "CompletePlanUnit",
            where: {
              PackagePlanID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "PackagePlanDates",
            where: {
              PackagePlanID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "PackagePlan",
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
      });
    },

    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.packageplan.isEdit ? "update_one" : "create_one"}`,
          {
            table: "PackagePlan",
            where: !this.packageplan.isEdit
              ? this.packageplan
              : {
                  ID_KEY: this.packageplan.ID_KEY
                },
            update: this.packageplan
          }
        );

        console.log("SAVED UNIT", saveItem);

        // if(!this.packageplan.isEdit){
        //   await  this.api("global/create_one" , {
        //     table :'PackagePlanDates',
        //     where :{
        //       PackagePlanID:
        //     }
        //   })
        // }

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
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    lossCompensationReport(item) {
      this.$router.push(`/LossCompensation/${item.ID_KEY}`);
    },

    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID_KEY"],
        dates = ["DateOfTransferList"],
        multi = [];

      where = this.mapToQuery(where, likes, multi, dates);
      this.api("global/get_all", {
        table: "PackagePlan"
      })
        .then(x => {
          this.$set(this.mainTable, "items", x.data);
        })
        .catch(error => {
          console.log("error", error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async actionAdd() {
      this.$set(this, "packageplan", {
        isEdit: false
      });
      if (this.id) {
        await this.findOne(this.id);
      }
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    async actionFillData(item) {
      let finish;
      try {
        let PackageSoldiers = await this.api("global/get_all", {
          table: "Soldier",
          include: [
            {
              model: "Unit",
              where: {
                hasPackaging: true
              }
            }
          ],
          where: {
            $and: [
              {
                RecuEndDate: {
                  $gte: this.formatDate(item.recuEndDateFrom)
                }
              },
              {
                RecuEndDate: {
                  $lte: this.formatDate(item.recuEndDateTo)
                }
              }
            ]
            // Status: "منتهى خدمته",
            // SoldierStatus: "نقل على الإحتياط",
            // WeaponID: 52
          }
        });

        PackageSoldiers = PackageSoldiers.data.filter(
          ele =>
            ele.Status == "منتهى خدمته" &&
            ele.SoldierStatus == "نقل على الإحتياط"
        );
        if (!PackageSoldiers.length) {
          this.showError("لايوجد وحدات لها تعبئة");
          return;
        }
        console.log("packageSoldier", PackageSoldiers);

        for (let i = 0; i < PackageSoldiers.length; i++) {
          finish = await this.api("global/create_one", {
            table: "PackageCandidates",
            where: {
              SoldierID: PackageSoldiers[i].ID,
              PackageID: item.ID_KEY,
              PackagedUnitID: PackageSoldiers[i].UnitID
            }
          });
        }
        if (finish) {
          await this.api("global/update_one", {
            table: "PackagePlan",
            where: { ID_KEY: item.ID_KEY },
            update: { isFilled: true }
          });
          // this.$set(this, "loading", false);
          // this.$set(this, "showFillDialog", false);
          this.showSuccess("تم إضافة بيانات الخطه");
          await this.findItems({});
        } else {
          // this.$set(this, "loading", false);
          // this.$set(this, "showFillDialog", false);

          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
      } catch (error) {
        console.log("error", error);
        this.handleError(error);
      }
    },
    actionRouteToDetails(item) {
      this.$router.push(`/PackageCandidates/${item.ID_KEY}`);
    },
    async actionFillCompletePlan(item) {
      let savedUnits = await this.api("global/get_all", {
        table: "Unit",
        where: {
          statue: "بالخدمة",
          hasPackaging: true
        }
      });

      await Promise.all(
        savedUnits.data.map(ele => {
          return this.api("global/create_one", {
            table: "CompletePlanUnit",
            where: {
              PackagePlanID: item.ID_KEY,
              UnitID: ele.UnitID
            }
          });
        })
      );

      await this.api("global/update_one", {
        table: "PackagePlan",
        where: {
          ID_KEY: item.ID_KEY
        },
        update: {
          isCompletePlanFilled: true
        }
      });

      this.showSuccess("تم بنجاح");
      this.findItems({});
    },
    actionRouteToCompletePlan(item) {
      this.$router.push(`/CompletePackagePlan/${item.ID_KEY}`);
    },
    async actionFillOrganizationPlan(item) {
      let savedUnits = await this.api("global/get_all", {
        table: "Unit",
        where: {
          statue: "بالخدمة",
          hasPackaging: true
        }
      });

      await Promise.all(
        savedUnits.data.map(ele => {
          return this.api("global/create_one", {
            table: "OrganizationPlanUnit",
            where: {
              PackagePlanID: item.ID_KEY,
              UnitID: ele.UnitID
            }
          });
        })
      );

      await this.api("global/update_one", {
        table: "PackagePlan",
        where: {
          ID_KEY: item.ID_KEY
        },
        update: {
          isOrganizationPlanFilled: true
        }
      });

      this.showSuccess("تم بنجاح");
      this.findItems({});
    },
    actionRouteToOrganizationPlan(item) {
      this.$router.push(`/OrganizationPackagePlan/${item.ID_KEY}`);
    },
    async actionFillDatesPlan(item) {
      await this.api("global/create_one", {
        table: "PackagePlanDates",
        where: {
          PackagePlanID: item.ID_KEY,
          FirstDateName: "1",
          SecondDateName: "2",
          ThirdDateName: "3",
          FourthDateName: "4",
          FifthDateName: "5",
          SixthDateName: "6",
          SeventhDateName: "7",
          EighthDateName: "8",
          NinthDateName: "9"
        }
      });
      await this.api("global/update_one", {
        table: "PackagePlan",
        where: {
          ID_KEY: item.ID_KEY
        },
        update: {
          isDateFilled: true
        }
      });

      this.showSuccess("تم بنجاح");
      this.findItems({});
    },

    actionRouteToDatesPlan(item) {
      this.$router.push(`/PackagePlanDates/${item.ID_KEY}`);
    }
  }
};
</script>
