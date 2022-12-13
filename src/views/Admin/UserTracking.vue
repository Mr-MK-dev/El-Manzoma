<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      :addButton="false"
      title="بحث متقدم في تتبع المستخدمين"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'التتبعات'"
    >
      <template v-slot:item.whereCondition="{ item }">
        <div>
          <v-chip color="transparent">
            <v-btn @click="openTextDialog(item)" icon small depressed>
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </div>
      </template>
      <template v-slot:item.changes="{ item }">
        <div>
          <v-chip color="transparent">
            <v-btn @click="openChangesDialog(item)" icon small depressed>
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </div>
      </template>
      <template v-slot:item.beforeChange="{ item }">
        <div>
          <v-chip color="transparent">
            <v-btn @click="openBeforeChangesDialog(item)" icon small depressed>
              <v-icon>
                mdi-window-open
              </v-icon>
            </v-btn>
          </v-chip>
        </div>
      </template>
    </table-bulider>

    <v-dialog scrollable v-model="textDialog.model" max-width="650">
      <v-card>
        <v-card-title class="text-h5">
          {{ textDialog.title }}
        </v-card-title>

        <v-card-text>
          <v-list-item v-for="item in textDialog.text" :key="item.key">
            <v-list-item-content>
              <v-list-item-title
                >{{ item.key }} : {{ item.value }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog scrollable v-model="changesDialog.model" max-width="650">
      <v-card>
        <v-card-title class="text-h5">
          {{ changesDialog.title }}
        </v-card-title>

        <v-card-text>
          <v-list-item v-for="item in changesDialog.text" :key="item.key">
            <v-list-item-content>
              <v-list-item-title
                >{{ item.key }} : {{ item.value }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog scrollable v-model="beforeChangesDialog.model" max-width="650">
      <v-card>
        <v-card-title class="text-h5">
          {{ beforeChangesDialog.title }}
        </v-card-title>

        <v-card-text>
          <v-list-item v-for="item in beforeChangesDialog.text" :key="item.key">
            <v-list-item-content>
              <v-list-item-title
                >{{ item.key }} : {{ item.value }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const tableFields = require("../../tableFields").default;

export default {
  name: "UserTracking",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "اسم المستخدم",
          value: "user.realName",
          searchValue: "userId",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الحدث",
          value: "queryMethod",
          searchValue: "queryMethod",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الجدول المعدل عليه",
          value: "tableName",
          searchValue: "tableName",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تاريخ الحدث",
          value: "transactionDate",
          searchValue: "transactionDate",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الرسالة",
          value: "message",
          searchValue: "message",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "قبل التغيير",
          value: "beforeChange",
          searchValue: "beforeChange",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "التغييرات",
          value: "changes",
          searchValue: "changes",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "بيانات اضافية",
          value: "whereCondition",
          searchValue: "whereCondition",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    textDialog: {
      model: false,
      text: ""
    },
    changesDialog: {
      model: false,
      text: ""
    },
    beforeChangesDialog: {
      model: false,
      text: ""
    },
    componentName: "LevelUp",
    selects: {
      userId: {
        table: "users",
        value: "userId",
        text: "realName"
      }
    }
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["id", "message"],
        multi = [],
        dates = ["transactionDate"];
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "userTracking",
          include: [{ model: "users" }],
          where: this.mapToQuery(where, likes, multi, dates)
        });

        let data = x.data.map(ele => ({
            ...ele,
            transactionDate: `
              اليوم : ${
                new Date(ele.transactionDate).toISOString().split("T")[0]
              }
              الساعة : ${
                new Date(ele.transactionDate)
                  .toISOString()
                  .split("T")[1]
                  .split(".")[0]
              }
              `
          })),
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        console.log("before", data);
        data.forEach(element => {
          Object.keys(tableFields.General).forEach(key => {
            element.changes = element?.changes?.replaceAll(
              key,
              tableFields.General[key]
            );
          });
          Object.keys(tableFields.General).forEach(key => {
            element.beforeChange = element?.beforeChange?.replaceAll(
              key,
              tableFields.General[key]
            );
          });
        });
        console.log("afggt", data);

        // data.map(ele => ele.changes.replace([tableFields[ele.tableName]]));
        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    openTextDialog(item) {
      let obj = JSON.parse(item.whereCondition);
      this.$set(this.textDialog, "model", true);
      this.$set(
        this.textDialog,
        "text",
        Object.keys(obj).map(key => ({
          key,
          value: obj[key]
        }))
      );
    },
    openChangesDialog(item) {
      let obj = JSON.parse(item.changes);
      this.$set(this.changesDialog, "model", true);
      this.$set(
        this.changesDialog,
        "text",
        Object.keys(obj).map(key => ({
          key,
          value: obj[key]
        }))
      );
    },
    openBeforeChangesDialog(item) {
      let obj = JSON.parse(item.beforeChange);
      this.$set(this.beforeChangesDialog, "model", true);
      this.$set(
        this.beforeChangesDialog,
        "text",
        Object.keys(obj).map(key => ({
          key,
          value: obj[key]
        }))
      );
    }
  }
};
</script>
