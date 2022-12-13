<template>
  <div class="position-relative display-inline-block">
    <v-btn class="px-6" @click="printPerson()" large outlined color="primary">
      <v-icon class="me-3">mdi-printer</v-icon>
      طباعة بروفايل الفرد
    </v-btn>
    <v-dialog scrollable persistent v-model="model" max-width="450">
      <v-card>
        <v-card-title>
          طباعة بروفايل فرد
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <div v-if="loading">
            <div>
              جارِ طباعة البيانات الأساسية للفرد
            </div>
            <div>
              <v-progress-linear indeterminate></v-progress-linear>
            </div>
          </div>
          <div v-else>
            <div>
              {{
                success ? "تمت العملية بنجاح" : "عفواً, تعذر طباعة بيانات الفرد"
              }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-4" v-if="!loading">
          <v-btn @click="model = false" text large color="primary">
            إغلاق
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="success"
            @click="openExternal(fileLocation.folder)"
            color="primary"
            outlined
            large
            class="px-6"
          >
            فتح المجلد
          </v-btn>
          <v-btn
            v-if="success"
            @click="openExternal(fileLocation.pdfFile)"
            color="primary"
            large
            class="px-6"
          >
            فتح الملف
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const constants = require("../../../Constant").default;

export default {
  name: "PrintConscripteProfile",
  props: {
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    model: false,
    loading: true,
    success: false,
    fileLocation: {}
  }),
  methods: {
    async printPerson() {
      let punishments = await this.api("global/get_all", {
        table: "RatebPunishments",
        where: this.cleanObject({ ID: this.conscripte.ID })
      });
      console.log("punishment", punishments.data);
      let obj = {
        ...this.conscripte,
        RecuStage: this.conscripte.RecuStage?.replaceAll("-", " "),
        weapon: (this.conscripte.Weapon || {}).Weapon,
        Markez_Tadreb: (this.conscripte.Weapon || {}).Markez_Tadreb,
        unit: (this.conscripte.Unit || {}).Unit,
        duty: (this.conscripte.Duty || {}).Duty,
        centre: (this.conscripte.Centre || {}).Centre,
        city: (this.conscripte.City || {}).City,
        hafza: (this.conscripte.inventoryLevelups || [])[0]?.hafza,
        image: (
          await this.api("global/load-image", {
            path: constants.imagePath + this.conscripte.ID + ".png"
          })
        ).data.split("base64,")[1],
        Grades: this.conscripte.Grades?.map(ele => ({
          From_Date: ele.From_Date || "",
          Grade_Text: ele.Grade_Text || "",
          ID: ele.ID || "",
          Mosdak: ele.Mosdak || "",
          Nesba_Number: ele.Nesba_Number || "",
          Note: ele.Note || "",
          SoliderID: ele.SoliderID || "",
          To_Date: ele.To_Date || "",
          Year: ele.Year
        })),
        tahels: this.conscripte.tahels?.map(ele => ({
          date_from: ele.date_from || "",
          date_to: ele.date_to || "",
          degree: ele.degree || "",
          leavel: ele.leavel || ""
        })),
        punshments: punishments.data.map((ele, index) => ({
          index: index + 1,
          ID: ele.ID || "",
          Summryofcrime: ele.crimeText || "",
          count: ele.count || "",
          dateesta7qaqathar: ele.dateesta7qaqathar || "",
          dateesta7qaqradfa3l: ele.dateesta7qaqradfa3l || "",
          datefa3liathar: ele.datefa3liathar || "",
          datefa3liradfa3l: ele.datefa3liradfa3l || "",
          dateofcrime: ele.crimeToDate || "",
          degreeofpunshment: ele.degreeofpunshment || "",
          durationofdaypunshment: ele.periodInDays || "",
          durationofmonthpunshment: ele.durationofmonthpunshment || "0",
          durationofyearpunshment: ele.durationofyearpunshment || "0",
          fromdateofabsens: ele.fromdateofabsens || "",
          fromdateofpunshment: ele.fromdateofpunshment || "",
          kindofpunshment: ele.kindofpunshment || "",
          notes: ele.notes || "",
          numberofabsensday: ele.numberofabsensday || "",
          numberofabsensmonth: ele.numberofabsensmonth || "",
          numberofabsensyear: ele.numberofabsensyear || "",
          pand: ele.orderNumber || "",
          punshment: ele.type || "",
          responsibleofpunshment: ele.responsibleofpunshment || "",
          todateofabsens: ele.todateofabsens || "",
          todateofpunshment: ele.todateofpunshment || "",
          total_lost_of_punshment_day: ele.total_lost_of_punshment_day || "",
          total_lost_of_punshment_month:
            ele.total_lost_of_punshment_month || "",
          total_lost_of_punshment_year: ele.total_lost_of_punshment_year || "",
          totaloflosctday: ele.totaloflosctday || "",
          totaloflosctmonth: ele.totaloflosctmonth || "",
          totaloflosctyear: ele.totaloflosctyear || ""
        })),
        preuints: this.conscripte.preuints?.map(ele => ({
          con: ele.con || "",
          fromdam: ele.fromdam || "",
          id: ele.id || "",
          todam: ele.todam || "",
          unit: (ele.Unit || "").Unit,
          direction: (ele.Unit || "").Directionforunit
        })),
        prevlevelups: this.conscripte.prevlevelups?.map(ele => ({
          count: ele.count || "",
          date_level: ele.date_level || "",
          id: ele.id || "",
          level: ele.level || ""
        })),
        Neshans: this.conscripte.Neshans?.map(ele => ({
          Date: ele.Date || "",
          ID: ele.ID || "",
          Noot: ele.Noot || "",
          Notes: ele.Notes || "",
          Orderid: ele.Orderid || "",
          Ression: ele.Ression || "",
          SoilderID: ele.SoilderID || ""
        })),
        TravalTables: this.conscripte.TravalTables?.map(ele => ({
          AmanaNum: ele.AmanaNum || "",
          ID: ele.ID || "",
          ID_KEY: ele.ID_KEY || "",
          TravalDateFrom: ele.TravalDateFrom || "",
          TravalDateTo: ele.TravalDateTo || "",
          TravalDistination: ele.TravalDistination || "",
          TravalType: ele.TravalType || "",
          Travalintadab: ele.Travalintadab || ""
        }))
      };
      console.log("consicripte", obj);
      Object.keys(obj).map(key => {
        if (!obj[key]) obj[key] = "";
      });
      console.log(obj);

      this.api(`printer/word/reports`, {
        query: `conscripte/${obj.Type == "مجند" ? "soldier" : "Rateb"}`,
        data: obj,
        filename: `${obj.ID} - ${obj.Name} - ${new Date().getTime()}`,
        isPDF: false
      })
        .then(x => {
          console.log(x);
          this.$set(this, "fileLocation", x.data);
          this.$set(this, "success", true);
          this.$set(this, "model", true);
        })
        .catch(error => {
          this.$set(this, "fileLocation", {});
          this.$set(this, "success", false);
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    }
  }
};
</script>
