<template>
  <div>
    <editor-dialog-bulider
      title="بيانات فترة المطلوبة للنشرة"
      :open="showFillDialog"
      @on-close="showFillDialog = false"
      :loading="loading"
      :fields="addOptions"
      :data="FillOption"
      @on-submit="reFllRenewData()"
    />
    <editor-dialog-bulider />
    <search-bulider
      :fields="mainTable.headers"
      @on-search="findItems"
      @on-add="actionAdd()"
      v-if="!id"
      :clearOption="true"
      title="بحث متقدم في نشرات التجديدات"
      addBtnTitle="إضافة الي النشرات"
    />
    <!--    <v-btn :loading="loading" @on-submit="fillRenewData()" />-->
    <!--    <v-btn />-->

    <v-card-title v-if="id">
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة نشرة تجديدات
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'نشرة التجديدات'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="hasDeleteAccess()">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.firstRenewList="{ item }">
        <v-chip
          v-if="!item.isFilled"
          icon
          color="primary"
          @click="actionFillData(item)"
        >
          <v-icon>mdi-arrow-up-bold-box-outline</v-icon>
        </v-chip>
        <v-btn
          v-if="item.isFilled"
          icon
          color="primary"
          @click="actionRouteToDetails(item, 'التجديد الأول')"
        >
          نشرة التجديد الأول
        </v-btn>
      </template>
      <template v-slot:item.secondRenewList="{ item }">
        <v-btn
          v-if="item.isFilled"
          icon
          color="primary"
          @click="actionRouteToDetails(item, 'التجديد الثاني')"
        >
          نشرة التجديد الثاني
        </v-btn>
      </template>
      <template v-slot:item.reFillRenewList="{ item }">
        <v-btn icon color="primary" @click="actionFillData(item)">
          مراجعة المرشحين
        </v-btn>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة نشرة تجديدات'"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :data="RenewNew"
      :selects="selects"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
import lodash from "lodash";
import { forEach } from "../../../server-sequelize/seeders/Nationalities";
export default {
  name: "RenewNew",

  mounted() {
    this.init();
    this.selects.YearStart.data = _.range(2020, 3000, 1);
  },

  data: () => ({
    addOptions: [
      {
        text: "عدد السنوات المطلوبة للتجديد الأول",
        value: "FirstRenewTime",
        searchValue: "FirstRenewTime",
        sortable: false,
        type: "text",
        inSearch: false,
        inTable: false,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "عدد السنوات المطلوبة للتجديد الثاني",
        value: "SecondRenewTime",
        searchValue: "SecondRenewTime",
        sortable: false,
        type: "text",
        inSearch: false,
        inTable: false,
        inModel: true,
        required: true,
        sort: 2
      }
    ],

    RenewNew: {},
    FillOption: {},

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
    punishmentType: [],

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
          text: "تاريخ النشرة",
          value: "DateOfRenewList",
          searchValue: "DateOfRenewList",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: false,
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
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "firstRenewList",
          searchValue: "firstRenewList",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "secondRenewList",
          searchValue: "secondRenewList",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "reFillRenewList",
          searchValue: "reFillRenewList",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "معاد النشرة",
          value: "TimeStart",
          searchValue: "TimeStart",
          sortable: false,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "سنة النشرة",
          value: "YearStart",
          searchValue: "YearStart",
          sortable: false,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    selects: {
      TimeStart: {
        text: "text",
        value: "text",
        data: ["07-01", "01-01"]
      },
      YearStart: {
        text: "text",
        value: "text"
      }
    }
  }),
  methods: {
    async actionDelete(item) {
      console.log();

      this.$confirm(
        `هل انت متاكد من حذف جميع البيانات التي تخص نشرة الأنتقالات`,
        {
          title: ``
        }
      ).then(async res => {
        if (res) {
          let deleteitem = await this.api(`global/delete_all`, {
            table: "OutOfRenew",
            where: {
              RenewListID: item.ID_KEY
            }
          });

          await this.api(`global/delete_all`, {
            table: "OtherRenewCandidates",
            where: {
              RenewListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "RenewAddPlans",
            where: {
              RenewListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "RenewCandidates",
            where: {
              RenewListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "RenewRemovePlans",
            where: {
              RenewListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "RenewList",
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
        this.RenewNew.DateOfRenewList =
          this.RenewNew.TimeStart + "-" + this.RenewNew.YearStart;
        this.$set(
          this.RenewNew,
          "Name",
          " نشرة بتاريخ " + this.RenewNew.DateOfRenewList
        );
        console.log("RenewNew", this.RenewNew);
        saveItem = await this.api(
          `global/${this.RenewNew.isEdit ? "update_one" : "create_one"}`,
          {
            table: "RenewList",
            where: !this.RenewNew.isEdit
              ? this.RenewNew
              : {
                  ID_KEY: this.RenewNew.ID_KEY
                },
            update: this.RenewNew
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.$set(this.createdObject, "model", false);
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
    async reFllRenewData(RenewList) {
      try {
        let candidatesData = await this.api("global/get_all", {
          table: "RenewCandidates",
          where: {
            RenewListID: this.RenewNew.ID_KEY
          }
        });
        candidatesData = candidatesData.data.map(ele => ({ ...ele }));
        await this.api("global/delete_all", {
          table: "RenewCandidates",
          where: {
            RenewListID: this.RenewNew.ID_KEY
          }
        });
        await this.api("global/delete_all", {
          table: "OutOfRenew",
          where: {
            RenewListID: this.RenewNew.ID_KEY
          }
        });

        await this.fillRenewData();

        for (let i = 0; i < candidatesData.length; i++) {
          let finishUpdateData = await this.api("global/update_one", {
            table: "RenewCandidates",
            where: {
              RatebID: candidatesData[i].RatebID,
              RenewListID: this.RenewNew.ID_KEY
            },
            update: {
              isAgree: candidatesData[i].isAgree,
              isHasRecommendation: candidatesData[i].isHasRecommendation,
              MedicalSituation: candidatesData[i].MedicalSituation,
              Requirements: candidatesData[i].Requirements
            }
          });
        }
      } catch (e) {
        this.handleError(e);
      }
    },
    async fillRenewData() {
      this.$set(this, "loading", true);
      let finishFirstRenew;
      let finishSecondRenew;

      let punishmentType = await this.api("global/get_all", {
        table: "PunishmentTypes"
      });
      this.$set(this, "punishmentType", punishmentType.data);
      await this.api("global/get_all", {
        table: "Rateb",
        include: [{ model: "RatebPunishments" }],
        where: {
          Status: "بالخدمة"
        }
      })
        .then(async x => {
          let group = Object.values(
            lodash.groupBy(x.data, cand => cand.ID)
          ).map(ele => ({
            ...ele[0],
            RatebPunishments: ele.map(ele => ele.RatebPunishments)
          }));

          let candidates = group.map(ele => {
            console.log(
              ele,
              ele.FirstRenewDateTo == null
                ? Math.floor(
                    (new Date(this.RenewNew.DateOfRenewList) -
                      new Date(ele.SatrtingSarefRateb)) /
                      (1000 * 60 * 60 * 24)
                  ) - 1825
                : Math.floor(
                    (new Date(this.RenewNew.DateOfRenewList) -
                      new Date(ele.FirstRenewDateTo)) /
                      (1000 * 60 * 60 * 24)
                  ) - 1825,
              this.calculateLostPeriod(ele, ele.FirstRenewDateTo)
            );
            return {
              ...ele,
              SatrtingSarefRateb: new Date(ele.SatrtingSarefRateb),
              SatrtingSarefRatebYears:
                (new Date(this.RenewNew.DateOfRenewList) -
                  new Date(ele.SatrtingSarefRateb)) /
                31536000000,
              FirstRenewDateTo:
                ele.FirstRenewDateTo && new Date(ele.FirstRenewDateTo),
              FirstRenewDateToYears:
                (new Date(this.RenewNew.DateOfRenewList) -
                  new Date(ele.FirstRenewDateTo)) /
                31536000000,
              lostPeriod: this.calculateLostPeriod(ele, ele.FirstRenewDateTo),
              armor:
                ele.FirstRenewDateTo == null
                  ? Math.floor(
                      (new Date(this.RenewNew.DateOfRenewList) -
                        new Date(ele.SatrtingSarefRateb)) /
                        (1000 * 60 * 60 * 24)
                    ) - 1825
                  : Math.floor(
                      (new Date(this.RenewNew.DateOfRenewList) -
                        new Date(ele.FirstRenewDateTo)) /
                        (1000 * 60 * 60 * 24)
                    ) - 1825,
              OutOfRenewReasons: []
            };
          });
          this.insertOtherRenewCandidates(candidates);
          candidates = candidates.filter(
            ele =>
              (ele.RatebCategory?.includes("صف") && ele.WeaponID == 52) ||
              ele.RatebCategory?.includes("كاتب عسكرى") ||
              ele.RatebCategory?.includes("سائق عجل")
          );
          let firstRenewCandidates = candidates.filter(
            ele =>
              ele.FirstRenewDateTo == null &&
              ele.SatrtingSarefRatebYears >= this.FillOption.FirstRenewTime
          );
          for (let i = 0; i < firstRenewCandidates.length; i++) {
            if (this.punishmentTypeCrimeFilter(firstRenewCandidates[i])) {
              firstRenewCandidates[i].OutOfRenewReasons.push(
                "لديه جريمة من عقوبات المانعة للتجنيد"
              );
            }
            if (this.honorCrimeFilter(firstRenewCandidates[i])) {
              firstRenewCandidates[i].OutOfRenewReasons.push(
                "لديه جريمة مخلة بالشرف"
              );
            }
            if (this.hardCrimesFilter(firstRenewCandidates[i])) {
              firstRenewCandidates[i].OutOfRenewReasons.push(
                "لديه عقوبات شديدة عددها أكثر من ضعف عدد سنين خدمته"
              );
            }
            if (this.lostPeriodFilter(firstRenewCandidates[i])) {
              firstRenewCandidates[i].OutOfRenewReasons.push(
                "المدة الفاقدة له أكثر من مدة الإحتياط الخاصة به"
              );
            }
            if (this.courtFilter(firstRenewCandidates[i])) {
              firstRenewCandidates[i].OutOfRenewReasons.push(
                "عليه محكمة عقوبتها أكثر من 6 أشهر"
              );
            }
            if (this.specifiHardCrimesFilter(firstRenewCandidates[i], 10)) {
              firstRenewCandidates[i].OutOfRenewReasons.push(
                "لديه جرائم من المتعارف عليها أكثر من العدد المسموح"
              );
            }
          }
          let firstAccepted = firstRenewCandidates.filter(
            ele => ele.OutOfRenewReasons.length === 0
          );

          let rejectedFirst = firstRenewCandidates.filter(
            ele => ele.OutOfRenewReasons.length !== 0
          );
          await this.insertOutOfRenewCandidates(
            rejectedFirst,
            this.RenewNew,
            "التجديد الأول"
          );
          let secondRenewCandidates = candidates.filter(
            ele =>
              ele.FirstRenewDateTo != null &&
              ele.SecondRenewDateTo == null &&
              ele.FirstRenewDateToYears >= this.FillOption.SecondRenewTime
          );
          for (let i = 0; i < secondRenewCandidates.length; i++) {
            if (this.punishmentTypeCrimeFilter(secondRenewCandidates[i])) {
              secondRenewCandidates[i].OutOfRenewReasons.push(
                "لديه جريمة من عقوبات المانعة للتجنيد"
              );
            }
            if (this.honorCrimeFilter(secondRenewCandidates[i])) {
              secondRenewCandidates[i].OutOfRenewReasons.push(
                "لديه جريمة مخلة بالشرف"
              );
            }
            if (this.hardCrimesFilter(secondRenewCandidates[i])) {
              secondRenewCandidates[i].OutOfRenewReasons.push(
                "لديه عقوبات شديدة عددها أكثر من ضعف عدد سنين خدمته"
              );
            }
            if (this.courtFilter(secondRenewCandidates[i])) {
              secondRenewCandidates[i].OutOfRenewReasons.push(
                "عليه محكمة عقوبتها أكثر من 6 أشهر"
              );
            }
            if (this.specifiHardCrimesFilter(secondRenewCandidates[i], 18)) {
              secondRenewCandidates[i].OutOfRenewReasons.push(
                "لديه جرائم من المتعارف عليها أكثر من العدد المسموح"
              );
            }

            if (this.lostPeriodFilter(secondRenewCandidates[i])) {
              secondRenewCandidates[i].OutOfRenewReasons.push(
                "المدة الفاقدة له أكثر من مدة الإحتياط الخاصة به"
              );
            }
          }
          let secondAccepted = secondRenewCandidates.filter(
            ele => ele.OutOfRenewReasons.length === 0
          );
          let rejectedSecond = secondRenewCandidates.filter(
            ele => ele.OutOfRenewReasons.length !== 0
          );
          // console.log("rejectedSecond", rejectedSecond);
          await this.insertOutOfRenewCandidates(
            rejectedSecond,
            this.RenewNew,
            "التجديد الثاني"
          );
          for (let i = 0; i < firstAccepted.length; i++) {
            let candidate = {
              RenewListID: this.RenewNew.ID_KEY,
              RatebID: firstAccepted[i].ID,
              RenewType: "التجديد الأول"
            };
            finishFirstRenew = await this.api("global/create_one", {
              table: "RenewCandidates",
              where: candidate
            });
          }
          for (let i = 0; i < secondAccepted.length; i++) {
            let candidate = {
              RenewListID: this.RenewNew.ID_KEY,
              RatebID: secondAccepted[i].ID,
              RenewType: "التجديد الثاني"
            };
            finishSecondRenew = await this.api("global/create_one", {
              table: "RenewCandidates",
              where: candidate
            });
          }
          await this.api("global/update_one", {
            table: "RenewList",
            where: { ID_KEY: this.RenewNew.ID_KEY },
            update: { isFilled: true }
          });
          this.$set(this, "loading", false);
          this.$set(this, "showFillDialog", false);
          this.showSuccess("تم اضافة المختارين ");
          this.findItems({});
        })
        .catch(error => {
          this.showError("تعذر حفظ  في قاعدة البيانات");

          console.log("error", error);
        })
        .finally(() => {
          this.$set(this, "loading", false);
          this.$set(this, "showFillDialog", false);
        });
    },
    insertOtherRenewCandidates(candidates) {
      let otherRenewCandidates = lodash.reject(
        candidates,
        ele =>
          (ele.RatebCategory?.includes("صف") && ele.WeaponID == 52) ||
          ele.RatebCategory?.includes("كاتب عسكرى") ||
          ele.RatebCategory?.includes("سائق عجل")
      );

      let firstRenewCandidates = otherRenewCandidates.filter(ele => {
        return (
          ele.FirstRenewDateTo == null &&
          ele.SatrtingSarefRatebYears >= this.FillOption.FirstRenewTime
        );
      });

      for (let i = 0; i < firstRenewCandidates.length; i++) {
        let candidate = {
          RenewListID: this.RenewNew.ID_KEY,
          RatebID: firstRenewCandidates[i].ID,
          RenewType: "التجديد الأول"
        };
        let otherFirstRenew = this.api("global/create_one", {
          table: "OtherRenewCandidates",
          where: candidate
        });
      }
      let secondRenewCandidates = otherRenewCandidates.filter(ele => {
        return (
          ele.FirstRenewDateTo != null &&
          ele.SecondRenewDateTo == null &&
          ele.FirstRenewDateToYears >= this.FillOption.SecondRenewTime
        );
      });

      for (let i = 0; i < secondRenewCandidates.length; i++) {
        let candidate = {
          RenewListID: this.RenewNew.ID_KEY,
          RatebID: secondRenewCandidates[i].ID,
          RenewType: "التجديد الثاني"
        };
        let otherFirstRenew = this.api("global/create_one", {
          table: "OtherRenewCandidates",
          where: candidate
        });
      }
    },
    async insertOutOfRenewCandidates(rejected, renewListID, renewType) {
      // console.log(rejected);
      for (let i = 0; i < rejected.length; i++) {
        let candidate = {
          RenewListID: renewListID.ID_KEY,
          RatebID: rejected[i].ID,
          Reasons: rejected[i].OutOfRenewReasons.join(" - "),
          RenewType: renewType
        };
        let rejectedDone = await this.api("global/create_one", {
          table: "OutOfRenew",
          where: candidate
        });
      }
    },
    calculateLostPeriod(candidate, FirstRenewDate) {
      let lostPeriod = 0;
      if (FirstRenewDate == null) {
        if (candidate.RatebPunishments) {
          candidate.RatebPunishments.forEach(pen =>
            (pen?.crimeText?.includes("غياب") && pen.periodInDays > 5) ||
            pen?.kind?.includes("حبس") ||
            pen?.type?.includes("محكم")
              ? (lostPeriod += pen.periodInDays)
              : 0
          );
        }
      } else {
        if (candidate.RatebPunishments) {
          candidate.RatebPunishments.filter(
            ele => new Date(ele.orderDate) > new Date(FirstRenewDate)
          ).forEach(pen =>
            (pen?.crimeText?.includes("غياب") && pen.periodInDays > 5) ||
            pen?.kind?.includes("حبس") ||
            pen?.type?.includes("محكم")
              ? (lostPeriod += pen.periodInDays)
              : 0
          );
        }
      }

      return lostPeriod;
    },
    specifiHardCrimesFilter(candidate, numberAllowed) {
      if (
        candidate.RatebPunishments?.filter(
          pen =>
            pen.crimeText?.includes("همال") ||
            pen.crimeText?.includes("سلوك") ||
            pen.crimeText?.includes("غياب") ||
            pen.crimeText?.includes("طاع") ||
            pen.crimeText?.includes("تحدث") ||
            pen.crimeText?.includes("فقد عهد") ||
            pen.crimeText?.includes("خدمة وحراسة") ||
            pen.crimeText?.includes("خدمه وحراسه")
        ).length >= numberAllowed
      ) {
        return true;
      } else {
        return false;
      }
    },

    courtFilter(candidate) {
      let court = candidate.RatebPunishments?.filter(pen =>
        pen.type?.includes("محكم")
      );

      let totalDays = lodash.sumBy(court, ele => ele.periodInDays);
      if (totalDays > 180) {
        return true;
      } else {
        return false;
      }
    },

    lostPeriodFilter(candidate) {
      if (candidate.lostPeriod > candidate.armor) {
        return true;
      } else {
        return false;
      }
    },

    hardCrimesFilter(candidate) {
      let filter = candidate.RatebPunishments?.filter(
        pen =>
          pen.kind?.includes("حبس") ||
          (pen.kind?.includes("حجز مع القطع") && pen.periodInDays >= 15)
      );
      if (filter.length > candidate.SatrtingSarefRatebYears * 2) {
        return true;
      } else {
        return false;
      }
    },

    honorCrimeFilter(candidate) {
      if (
        candidate.RatebPunishments?.find(
          pen =>
            pen.crimeText?.includes("زور") ||
            pen.crimeText?.includes("ختلاس") ||
            pen.crimeText?.includes("زنا") ||
            pen.crimeText?.includes("سرق") ||
            pen.crimeText?.includes("مخلة بالشرف") ||
            pen.crimeText?.includes("مخله بالشرف")
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    punishmentTypeCrimeFilter(candidate) {
      // console.log("Crimes", candidate.RatebPunishments);
      // console.log("punishmentType", this.punishmentType);
      for (const crime of candidate.RatebPunishments) {
        if (
          this.punishmentType.filter(
            ele =>
              ele.Type == crime.kind &&
              (ele.periodInDays == null ||
                ele.periodInDays == crime.periodInDays) &&
              ele.isRenewBlocked
          ).length > 0
        ) {
          return true;
        }
      }
      return false;
    },

    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID_KEY"],
        dates = ["DateOfRenewList"],
        multi = [];

      where = this.mapToQuery(where, likes, multi, dates);
      this.api("global/get_all", {
        table: "RenewList"
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));
          this.$set(this.mainTable, "items", data);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async actionAdd() {
      this.$set(this, "RenewNew", {
        isEdit: false
      });
      if (this.id) {
        await this.findOne(this.id);
      }
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    async actionFillData(item) {
      this.$set(this, "showFillDialog", true);
      this.$set(this, "RenewNew", {
        ...item
      });
    },
    actionRouteToDetails(item, type) {
      this.$router.push(`/RenewListDetails/${item.ID_KEY}/${type}`);
    }
  }
};
</script>

<style scoped></style>
