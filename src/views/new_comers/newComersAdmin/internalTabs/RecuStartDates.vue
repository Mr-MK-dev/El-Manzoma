<template>
  <div>
    <v-btn
      v-if="isAdmin() || hasEditAccess()"
      @click="actionAdd()"
      large
      outlined
      color="primary"
    >
      إضافة تاريخ تجنيد جديد
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'تواريخ التجنيد'"
    >
      <template v-slot:item.edit="{ item }">
        <v-chip
          v-if="hasDeleteAccess()"
          color="transparent"
          @click="deleteSector(item)"
        >
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn
          v-if="hasEditAccess()"
          icon
          @click="actionEdit(item)"
          color="primary"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="recuStartDate"
      :selects="selects"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../../../Constant").default;
export default {
  name: "RecuStartDates",
  async mounted() {
    await this.init();
    this.findAllStartDates();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    recuStartDate: {},
    searchLoading: false,

    mainTable: {
      headers: [
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          inTable: true,
          inModel: true,
          sortable: true,
          required: true,
          inSearch: true
        },
        {
          text: "المرحلة التجنيدية",
          value: "RecuStage",
          searchValue: "RecuStage",
          type: "select",
          inTable: true,
          inModel: true,
          sortable: true,
          required: true,
          inSearch: true
        },
        {
          text: "التاريخ",
          value: "RecuDate",
          searchValue: "RecuDate",
          type: "date",
          inTable: true,
          inModel: true,
          sortable: true,
          required: true,
          inSearch: true
        }

        // {
        //   text: "الحالة",
        //   value: "Status",
        //   searchValue: "Status",
        //   sortable: true,
        //   type: "checkbox",
        //   inSearch: true,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // }
      ],
      items: []
    },
    selects: {
      KnowledgeLevel: {
        value: "text",
        text: "text",
        data: constants.KnowledgeLevel.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
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
    async findAllStartDates() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "RecuStartDates"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      this.$set(this.recuStartDate, "Status", 1);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.recuStartDate.ID_KEY
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "RecuStartDates",
            where: !this.recuStartDate.ID_KEY
              ? this.recuStartDate
              : {
                  ID_KEY: this.recuStartDate.ID_KEY
                },
            update: this.recuStartDate
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllStartDates();
          this.init();
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

    actionAdd() {
      this.$set(this, "recuStartDate", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "recuStartDate", {
        ...item,
        isEdit: true,
        UnitID: this.selects.UnitID.data
          .filter(ele => ele.SectorID === item.ID_KEY)
          .map(ele => ele.UnitID)
      });
    },

    async deleteSector(item) {
      this.$set(this.del, "loading", true);

      // here will create all attached units with null

      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "RecuStartDates",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findAllStartDates();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
