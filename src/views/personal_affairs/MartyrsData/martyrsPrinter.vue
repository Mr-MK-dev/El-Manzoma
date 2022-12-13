<template>
  <div class="position-relative display-inline-block">
    <v-btn class="px-6" @click="printPerson()" large outlined color="primary">
      <v-icon class="me-3">mdi-printer</v-icon>
      طباعة بروفايل
    </v-btn>
    <v-dialog scrollable persistent v-model="model" max-width="450">
      <v-card>
        <v-card-title>
          طباعة بروفايل
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <div v-if="loading">
            <div>
              جارِ طباعة البيانات الأساسية
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
      let obj = {
        ...this.conscripte,
        RecuStage: this.conscripte.RecuStage?.replaceAll("-", " "),
        weapon: (this.conscripte.Weapon || {}).Weapon,
        unit: (this.conscripte.Unit || {}).Unit,
        image: (
          await this.api("global/load-image", {
            path: constants.imagePath + this.conscripte.ID + ".png"
          })
        ).data.split("base64,")[1]
      };

      Object.keys(obj).map(key => {
        if (!obj[key]) obj[key] = "";
      });
      console.log(obj);

      this.api(`printer/word/reports`, {
        query: `personal_affairs/${
          obj.Kind == "شهيد"
            ? "martyr"
            : obj.Kind == "وفاة"
            ? "death"
            : "injured"
        }`,
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
