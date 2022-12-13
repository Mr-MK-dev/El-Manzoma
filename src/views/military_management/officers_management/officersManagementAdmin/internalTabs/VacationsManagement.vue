<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      إضافة أجازة جديدة
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'الأجازات'"
    >
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteType(item)">
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
      :data="vacation"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
export default {
  name: "VacationsManagement",
  mounted() {
    this.findAllTypes();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    vacation: {},
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
          text: "نوع الأجازة",
          value: "Name",
          searchValue: "Name",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        }
      ],
      items: []
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
    async findAllTypes() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "Vacations"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.vacation.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "Vacations",
            where: !this.vacation.ID_KEY
              ? this.vacation
              : {
                  ID_KEY: this.vacation.ID_KEY
                },
            update: this.vacation
          }
        );
        if (saveItem && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllTypes();
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
      this.$set(this, "vacation", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "vacation", {
        ...item,
        isEdit: true
      });
    },

    async deleteType(item) {
      this.$set(this.del, "loading", true);

      // here will create all attached units with null
      try {
        let { id, type } = this.del,
          delItem = await this.api("global/delete_all", {
            table: "Vacations",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
        if (delItem && delItem.ok && delItem.data) {
          this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
          this.$set(this.del, "model", false);
          this.$set(this.del, "id", "");
          this.$set(this.del, "type", false);
          this.findAllTypes();
        } else {
          this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
        }
      } catch (error) {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
