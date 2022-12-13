<template>
  <div>
    <v-btn
      v-if="isAdmin() || hasEditAccess()"
      @click="actionAdd()"
      large
      outlined
      color="primary"
    >
      إضافة تنظيم خاص جديد
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'التنظيمات الخاصة'"
    >
      <template v-if="isAdmin() || hasEditAccess()" v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteOrganized(item)">
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
      :data="specialUnits"
      :selects="selects"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
export default {
  name: "special_organized_units_management",
  async mounted() {
    await this.init();
    await this.findAllSpecialOrganizedUnits();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    specialUnits: {},
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
          text: "اسم التنظيم الخاص",
          value: "Name",
          searchValue: "Name",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        },
        {
          text: "الوحدات التابعة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: false,
          type: "select",
          inSearch: false,
          multiple: true,
          inTable: false,
          required: true,
          inModel: true
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
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
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
    async findAllSpecialOrganizedUnits() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "SpecialOrganizedUnits"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      this.$set(this.specialUnits, "Status", 1);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.specialUnits.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "SpecialOrganizedUnits",
            where: !this.specialUnits.ID_KEY
              ? this.specialUnits
              : {
                  ID_KEY: this.specialUnits.ID_KEY
                },
            update: this.specialUnits
          }
        );
        //why ?
        if (this.specialUnits.ID_KEY) {
          await this.api(`global/update_one`, {
            table: "Unit",
            where: { SpecialOrganizationID: this.specialUnits.ID_KEY },
            update: { SpecialOrganizationID: null }
          });
        }

        for (let i = 0; i < this.specialUnits.UnitID.length; i++) {
          console.log("unitID[i]", this.specialUnits.UnitID[i]);
          await this.api(`global/update_one`, {
            table: "Unit",
            where: { UnitID: this.specialUnits.UnitID[i] },
            update: { SpecialOrganizationID: this.specialUnits.ID_KEY }
          });
        }

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findAllSpecialOrganizedUnits();
          this.init();
          this.createdObject, "model", false;
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

    actionAdd() {
      this.$set(this, "specialUnits", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async actionEdit(item) {
      let units = await this.api("global/get_all", {
        table: "Unit"
      });
      this.$set(this.createdObject, "model", true);
      this.$set(this, "specialUnits", {
        ...item,
        isEdit: true,
        UnitID: units.data
          .filter(ele => ele.SpecialOrganizationID === item.ID_KEY)
          .map(ele => ele.UnitID)
      });
    },

    async deleteOrganized(item) {
      this.$set(this.del, "loading", true);

      // here will create all attached units with null
      await this.api(`global/update_one`, {
        table: "Unit",
        where: { SpecialOrganizationID: item.ID_KEY },
        update: { SpecialOrganizationID: null }
      });

      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "SpecialOrganizedUnits",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.findAllSpecialOrganizedUnits();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
