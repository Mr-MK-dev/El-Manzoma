<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      إضافة مستوى اعلى
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'الأماكن القيادية'"
    >
      <template v-slot:item.edit="{ item }">
        <!-- <v-chip color="transparent" @click="deleteRigion(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip> -->
        <v-btn
          v-if="hasEditAccess()"
          icon
          @click="actionEdit(item)"
          color="primary"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.State="{ item }">
        <v-chip :color="item.State == 1 ? 'success' : 'error'">
          {{ item.State ? "بالخدمة" : "ملغاه" }}
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="commands"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
export default {
  name: "CommandRegions",
  mounted() {
    this.findAllRigions();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    commands: {},
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
          text: "المستويات العليا",
          value: "Name",
          searchValue: "Name",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        },
        {
          text: "الحالة",
          value: "State",
          searchValue: "State",
          sortable: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
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
    async findAllRigions() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "CommandRegions"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "commands", {
        ...item,
        isEdit: true
      });
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.commands.isEdit ? "update_one" : "create_one"}`,
          {
            table: "CommandRegions",
            where: !this.commands.isEdit
              ? this.commands
              : {
                  ID_KEY: this.commands.ID_KEY
                },
            update: this.commands
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllRigions();
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
      this.$set(this, "commands", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
    // async deleteRigion(item) {
    //   this.$set(this.del, "loading", true);
    //   let soldiers = await this.api("global/get_all", {
    //     table: "CommandRegions",
    //     where: { ID_KEY: item.ID_KEY }
    //   });
    //   if (soldiers.data.length != 0) {
    //     this.showError("هذا المكان مرتبط بجنود ");
    //     return;
    //   }
    //   let { id, type } = this.del,
    //     delItem = await this.api("global/delete_all", {
    //       table: "CommandRegions",
    //       where: {
    //         ID_KEY: item.ID_KEY
    //       }
    //     });
    //   if (delItem && delItem.ok && delItem.data) {
    //     this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
    //     this.$set(this.del, "model", false);
    //     this.$set(this.del, "id", "");
    //     this.$set(this.del, "type", false);
    //     this.findAllRigions();
    //   } else {
    //     this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
    //   }
    //   this.$set(this.del, "loading", false);
    // }
  }
};
</script>
