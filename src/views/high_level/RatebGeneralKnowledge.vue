<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في المعلومات العامة عن الراتب العالي"
      addBtnTitle="إضافة معلومة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المعلومات العامة'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>
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
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            color="transparent"
            @click="deleteItem(item)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة معلومة'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="knowledge"
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
  name: "RatebGeneralKnowledge",
  mounted() {
    this.init();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    knowledge: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "جهة الإمداد",
          value: "Rateb.SupplyingRigion",
          searchValue: "SupplyingRigion",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Rateb.RatebLevel",
          searchValue: "RatebLevel",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Rateb.RatebState",
          searchValue: "RatebState",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "شرح المعلومة",
          value: "Description",
          searchValue: "Description",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "درجة أهمية المعلومة",
          value: "LevelOfImportance",
          searchValue: "LevelOfImportance",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: true,
          inModel: true
        },
        {
          text: "تاريخ إضافة المعلومة",
          value: "CreatedDate",
          searchValue: "CreatedDate",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
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
      printer: []
    },
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      SupplyingRigion: {
        table: "Rateb",
        value: "SupplyingRigion",
        text: "SupplyingRigion"
      },
      RatebState: {
        table: "Rateb",
        value: "RatebState",
        text: "RatebState"
      },
      RatebLevel: {
        table: "Rateb",
        value: "RatebLevel",
        text: "RatebLevel"
      },
      LevelOfImportance: {
        text: "text",
        value: "text",
        data: constants.LevelOfImportance.data
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
  watch: {
    "knowledge.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    initDates() {
      let dates = this.mainTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID", "Name"],
        multi = [],
        date = ["CreatedDate"];

      where = this.mapToQuery(where, likes, multi, date);
      this.api("global/get_all", {
        table: "RatebGeneralKnowledge",
        where: this.cleanObject({
          ID: where.ID,
          LevelOfImportance: where.LevelOfImportance,
          CreatedDate: where.CreatedDate
        }),
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              Name: where.Name,
              SupplyingRigion: where.SupplyingRigion,
              RatebLevel: where.RatebLevel,
              RatebState: where.RatebState,
              UnitID: where.UnitID
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ]
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
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    findOne(ID) {
      if (ID.length > 10) {
        this.$set(this.createdObject, "loading", true);
        this.api("global/get_one", {
          table: "Rateb",
          where: { ID }
        })
          .then(x => {
            this.$set(this.knowledge, "Name", x.data.Name);
          })
          .catch(error => {
            this.$set(this.knowledge, "Name", "");
          })
          .finally(() => {
            this.$set(this.createdObject, "loading", false);
          });
      }
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      if (!this.knowledge.isEdit) {
        this.knowledge.CreatedDate = new Date();
      }
      try {
        saveItem = await this.api(
          `global/${this.knowledge.isEdit ? "update_one" : "create_one"}`,
          {
            table: "RatebGeneralKnowledge",
            where: !this.knowledge.isEdit
              ? this.knowledge
              : {
                  RatebGeneralKnowledgeID: this.knowledge
                    .RatebGeneralKnowledgeID
                },
            update: this.knowledge
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "loading", false);
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },

    actionAdd() {
      this.$set(this, "knowledge", { isEdit: false });

      this.$set(this, "knowledge", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.findOne(item.ID);
      this.$set(this.createdObject, "model", true);
      this.$set(this, "knowledge", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "RatebGeneralKnowledge",
          where: {
            RatebGeneralKnowledgeID: item.RatebGeneralKnowledgeID
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findItems({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
