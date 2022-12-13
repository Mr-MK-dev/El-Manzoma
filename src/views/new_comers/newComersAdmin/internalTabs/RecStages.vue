<template>
  <div>
    <v-btn
      v-if="isAdmin() || hasEditAccess()"
      @click="actionAdd()"
      large
      outlined
      color="primary"
    >
      إضافة مرحلة تجنيد
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'مراحل التجنيد'"
    >
      <template v-if="hasDeleteAccess()" v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteStage(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <!--        <v-btn icon @click="actionEdit(item)" color="primary">-->
        <!--         <v-icon>mdi-pencil</v-icon>-->
        <!--        </v-btn>-->
      </template>
    </table-bulider>
    <!-- popup to add a reference -->
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="stages"
      :selects="selects"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
export default {
  name: "RecStages",
  mounted() {
    this.fetchAllStages();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    stages: {},
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
          text: "اسم المرحلة",
          value: "Name",
          searchValue: "Name",
          type: "text",
          inTable: true,
          inModel: false
        },
        {
          text: "رقم المرحلة",
          value: "text",
          searchValue: "Levels",
          type: "select",
          inTable: false,
          required: true,
          inModel: true
        },
        {
          text: "سنة المرحلة",
          value: "Year",
          searchValue: "Year",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        }
      ],
      items: []
    },
    selects: {
      Levels: {
        text: "text",
        value: "text",
        data: ["الاولي", "الثانية", "الثالثة", "الرابعة"]
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
    async fetchAllStages() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "RecStages"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "stages", {
        ...item,
        isEdit: true
      });
    },
    async saveItem(edirableFromTableItem) {
      if (
        this.mainTable.items.find(
          ele => ele.Name == this.stages.Levels + "-" + this.stages.Year
        )
      ) {
        this.showError("هذه الدفعة مضافة بالفعل");
      } else {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        try {
          saveItem = await this.api(
            `global/${this.stages.isEdit ? "update_one" : "create_one"}`,
            {
              table: "RecStages",
              where: !this.stages.isEdit
                ? {
                    Year: this.stages.Year,
                    Name: this.stages.Levels + "-" + this.stages.Year
                  }
                : {
                    ID: this.stages.ID
                  },
              update: this.stages
            }
          );
          if (saveItem && saveItem.data && saveItem.ok) {
            this.showSuccess("تم حفظ ");
            this.fetchAllStages();
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
      }
    },

    actionAdd() {
      this.$set(this, "stages", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    async deleteStage(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "RecStages",
          where: {
            ID: item.ID
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.fetchAllStages();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
