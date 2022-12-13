<template>
  <div style="position: relative; display: inline-block;">
    <v-menu :disabled="disabled" transition="slide-y-transition">
      <template v-slot:activator="{ on }">
        <v-btn
          :dark="dark"
          :disabled="disabled"
          :icon="!fab && !btnText"
          :fab="fab && !btnText"
          :small="(fab && !btnText) || small"
          :large="large"
          :outlined="outlined"
          :x-large="xLarge"
          :color="color ? color : !fab ? 'default' : 'primary'"
          :class="`${!fab ? '' : 'me-2'} ${btnClass}`"
          v-on="on"
        >
          <v-icon>mdi-printer</v-icon>
          <span v-if="btnText" class="ms-2">
            {{ btnText }}
          </span>
        </v-btn>
      </template>
      <v-list>
        <template v-for="(m, i) in menu">
          <!-- m.function == 'printPDF' || -->
          <v-list-item
            :disabled="
              (m.function == 'printExcel' &&
                (!data.excelKey ||
                  !data[data.excelKey] ||
                  !data.excelHeaders)) ||
                (m.function == 'printWord' && !wordFile)
            "
            @click="runFun(m.function)"
            :key="i"
          >
            <v-list-item-avatar>
              <v-icon v-text="m.icon"></v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="m.title"></v-list-item-title>
              <v-list-item-subtitle v-text="m.desc"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
    <v-dialog persistent v-model="model" scrollable max-width="450">
      <v-card>
        <v-card-title>
          تحميل ملف {{ filetype }}
          <v-spacer></v-spacer>
          <v-btn icon @click="closeMe()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div v-if="loading" class="text-center">
            <v-progress-linear indeterminate></v-progress-linear>
          </div>
          <div v-else>
            <div>
              <v-icon
                :color="
                  fileLocation.file && fileLocation.folder ? 'primary' : 'error'
                "
                class="me-2"
                >mdi-{{
                  fileLocation.file && fileLocation.folder
                    ? "check-bold"
                    : "close"
                }}</v-icon
              >
              {{
                fileLocation.file && fileLocation.folder
                  ? "تم تجهيز الملف."
                  : "تعذر تحميل الملف."
              }}
            </div>
            <div v-if="!fileLocation.file && !fileLocation.folder && fileError">
              {{ fileError }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions
          v-if="!loading && fileLocation.file && fileLocation.folder"
          class="px-4"
        >
          <v-btn
            color="primary"
            text
            large
            class="px-6"
            v-text="'عودة'"
            @click="closeMe()"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            v-text="'فتح الملف'"
            @click="showFileLocation()"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            v-text="'عرض المسار'"
            @click="showFileLocation(true)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "printer-menu",
  emits: ["fileIsOpened"],
  props: {
    fab: {
      type: Boolean,
      default: true
    },
    wordFile: {
      type: String,
      default: () => ""
    },
    isExcel: {
      type: Boolean,
      default: () => false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    xLarge: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ""
    },
    btnText: {
      type: String,
      default: ""
    },
    btnClass: {
      type: String,
      default: ""
    },
    data: {
      type: Object || Array,
      default: () => ({})
    },
    dark: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: true
    },
    query: {
      type: String,
      default: ""
    },
    // path: {
    //   type: String,
    //   default: ""
    // },
    filename: {
      type: String,
      default: ""
    },
    excelKey: {
      type: String,
      default: "data"
    }
  },
  data: () => ({
    model: false,
    loading: false,
    filetype: "",
    fileLocation: {},
    fileError: "",
    menu: [
      {
        title: "طباعة يومية",
        desc: "تحميل ملف بصيغة docx/xlsx يمكن التعديل عليه وطباعته.",
        icon: "mdi-microsoft-word",
        function: "printWord"
      },
      {
        title: "طباعة Excel",
        desc: "تحميل ملف بصيغة xlsx يمكن التعديل عليه وطباعته.",
        icon: "mdi-microsoft-excel",
        function: "printExcel"
      }
    ]
  }),
  methods: {
    runFun(fun) {
      return this[fun]();
    },
    async showFileLocation(openFolder = false) {
      let fileLocation = this.fileLocation;
      await this.api("server/open-item", {
        path: openFolder ? fileLocation.folder : fileLocation.file
      });
      this.$emit("fileIsOpened");
    },
    closeMe() {
      this.$set(this, "model", false);
      this.$set(this, "loading", false);
      this.$set(this, "filetype", "");
    },
    getFilename() {
      return this.filename && this.filename.length > 0
        ? this.filename
        : `${new Date()
            .toISOString()
            .substr(0, 10)}--Time--${new Date().getTime()}`;
    },
    printWord(isPDF = false) {
      this.$set(this, "model", true);
      this.$set(this, "loading", true);
      this.$set(this, "filetype", isPDF ? "PDF" : "Word");
      let filename = this.getFilename();
      this.api(`printer/word/reports`, {
        query: this.wordFile,
        data: this.data,
        filename,
        isPDF,
        isExcel: this.isExcel
      })
        .then(x => {
          this.$set(this, "fileLocation", x.data);
          this.$set(this, "fileError", "");
        })
        .catch(error => {
          this.$set(this, "fileLocation", {});
          this.$set(this, "fileError", error.data);
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    },
    printExcel() {
      this.$set(this, "model", true);
      this.$set(this, "loading", true);
      this.$set(this, "filetype", "Excel");
      let filename = this.getFilename();
      if (
        this.data.excelKey &&
        this.data[this.data.excelKey] &&
        this.data.excelHeaders
      ) {
        let newData = [];
        this.data[this.data.excelKey].forEach((row, i) => {
          let newRow = {};
          this.data.excelHeaders.forEach((header, ii) => {
            if (header && header.value && header.value.includes(".")) {
              let distroy = header.value.split("."),
                val = row;
              distroy.forEach(v => {
                if (val[v] === 0) val[v] = "0";
                val = val[v] ? val[v] : val;
              });
              if (val) {
                if (typeof val == "object" && Array.isArray(val)) {
                  val = val.join(" - ");
                }

                newRow[header.value] = val;
              }
            } else {
              let val = row[header.value];
              if (typeof val == "object" && Array.isArray(val)) {
                val = val.join(" - ");
              }
              newRow[header.value] = val;
            }
            if (
              ["string", "number"].indexOf(typeof newRow[header.value]) == -1
            ) {
              newRow[header.value] = "_";
            }
            newRow[header.value] = newRow[header.value];
            // let arbic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
            //   english = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            // english.forEach((ele, index) => {
            //   newRow[header.value] = newRow[header.value].replaceAll(
            //     ele,
            //     arbic[index]
            //   );
            // });
          });
          newData.push(newRow);
        });
        let headerObj = {};
        let headers = [];
        this.data.excelHeaders.forEach(ele => {
          headerObj[ele.value] = ele.text || " ";
        });
        if (this.data.hasParent) {
          let parentHeaderObj = {};
          this.data.excelHeaders.forEach(ele => {
            parentHeaderObj[ele.value] = ele.parent || " ";
          });
          headers.push(parentHeaderObj);
        }
        headers.push(headerObj);
        this.api(`printer/excel/index`, {
          query: this.query,
          data: [...headers, ...newData],
          filename,
          excelHeaders: this.data.excelHeaders.map(h => h.value),
          headerRows: [this.data.excelHeaders.map(h => h.text)]
        })
          .then(x => {
            this.$set(this, "fileLocation", x.data);
            this.$set(this, "fileError", "");
          })
          .catch(error => {
            console.log(error);
            this.$set(this, "fileLocation", {});
            this.$set(this, "fileError", error.data);
          })
          .finally(() => {
            this.$set(this, "loading", false);
          });
      } else {
        this.$set(this, "loading", false);
        this.$set(this, "fileLocation", {});
        this.$set(this, "fileError", "ليس له طباعة Excel");
      }
    },
    printPDF() {
      this.printWord(true);
    }
  }
};
</script>
