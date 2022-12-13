<template>
  <div>
    <v-card-title>
      <v-spacer />

      <v-btn
        @click="actionAdd()"
        large
        outlined
        color="primary"
        clearoption="true"
      >
        إضافة مجموعة
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'مجموعات المستخدمين'"
    >
      <template
        v-if="isAdmin() || hasEditAccess()"
        v-slot:item.actionsStart="{ item }"
      >
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="group"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;

export default {
  name: "usersGroups",
  props: {
    hubId: {
      type: Number,
      default: () => 0
    }
  },
  async mounted() {
    this.init();

    await this.findItems();
  },
  data: () => ({
    group: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "اسم المجموعة",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          required: true,
          sort: 5
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "UsersGroups",
    selects: {}
  }),
  watch: {},
  methods: {
    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.group.isEdit ? "update_one" : "create_one"}`,
          {
            table: "UsersGroups",
            where: !this.group.isEdit
              ? this.group
              : {
                  ID_KEY: this.group.ID_KEY
                },
            update: this.group
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.$set(this.createdObject, "model", false);
          this.$set(this, "group", {});
          await this.findItems();
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "UsersGroups"
        });

        let data = x.data,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    actionAdd() {
      this.$set(this, "group", {});
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "group", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
