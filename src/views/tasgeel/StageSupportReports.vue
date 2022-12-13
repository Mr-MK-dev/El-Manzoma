<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :loading="searchLoading"
      @on-search="findAllStageSupports"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم "
      :addButton="true"
      addBtnTitle="إمداد لمرحلة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'الإمداد'"
      :printer="mainTable.printer"
    >
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteStageSupport(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="stageSupport"
      :selects="selects"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("@/Constant").default;
export default {
  name: "StageSupportReports",
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
    searchLoading: false,
    stageSupport: {},
    mainTable: {
      headers: [
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: false,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المرحلة التجنيدية",
          value: "RecuStage",
          searchValue: "RecuStage",
          type: "select",
          inTable: false,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: false
        },
        {
          text: "العدد المقرر إستلامه",
          value: "ShouldHave",
          searchValue: "ShouldHave",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "ما تم إستلامه بالفعل",
          value: "AlreadyHave",
          searchValue: "AlreadyHave",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      RecuStage: {
        table: "RecStages",
        text: "Name",
        value: "Name"
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
    async "stageSupport.WeaponID"(weaponID) {
      try {
        const result = await this.api("global/get_all", {
          where: this.cleanObject({
            RecuStage: this.stageSupport.RecuStage,
            WeaponID: weaponID,
            Status: "بالخدمة"
          }),
          table: "Soldier"
        });
        this.$set(this.stageSupport, "AlreadyHave", result.data.length);
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
    }
  },
  methods: {
    async findAllStageSupports(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
          ...filters
        },
        likes = ["RecuStage"],
        multi = [];

      try {
        const result = await this.api("global/get_all", {
          where: this.mapToQuery(where, likes, multi),

          table: "StageSupportReports",
          include: [
            {
              model: "Weapon"
            }
          ]
        });
        this.$set(this.mainTable, "items", result.data);
        this.$set(this.mainTable, "printer", {
          data: result.data,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.stageSupport.isEdit ? `global/create_one` : `global/update_one`,
          {
            table: "StageSupportReports",
            where: !this.stageSupport.isEdit
              ? this.stageSupport
              : {
                  ID_KEY: this.stageSupport.ID_KEY
                },
            update: this.stageSupport
          }
        );
        if (saveItem && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllStageSupports({});
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
      this.$set(this, "stageSupport", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "stageSupport", {
        ...item,
        isEdit: true
      });
    },

    async deleteStageSupport(item) {
      this.$set(this.del, "loading", true);

      // here will create all attached units with null
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "StageSupportReports",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findAllStageSupports({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
