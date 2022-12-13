<template>
  <div>
    <v-btn
      v-if="isAdmin() || hasEditAccess()"
      @click="actionAdd()"
      large
      outlined
      color="primary"
    >
      إضافة قطاع جديد
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'القطاعات'"
    >
      <template v-if="isAdmin() || hasEditAccess()" v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteSector(item)">
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
      :data="sector"
      :selects="selects"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
export default {
  name: "sector_management",
  async mounted() {
    await this.init();
    await this.findAllSectors();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    sector: {},
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
          text: "اسم القطاع",
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
    async findAllSectors() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "Sectors"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      this.$set(this.sector, "Status", 1);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.sector.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "Sectors",
            where: !this.sector.ID_KEY
              ? this.sector
              : {
                  ID_KEY: this.sector.ID_KEY
                },
            update: this.sector
          }
        );
        if (this.sector.ID_KEY) {
          await this.api(`global/update_one`, {
            table: "Unit",
            where: { SectorID: this.sector.ID_KEY },
            update: { SectorID: null }
          });
        }

        for (let i = 0; i < this.sector.UnitID.length; i++) {
          await this.api(`global/update_one`, {
            table: "Unit",
            where: { UnitID: this.sector.UnitID[i] },
            update: { SectorID: this.sector.ID_KEY }
          });
        }

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findAllSectors();
          this.init();
          this.$set(this.createdObject, "model", false);
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
      this.$set(this, "sector", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "sector", {
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
      await this.api(`global/update_one`, {
        table: "Unit",
        where: { SectorID: item.ID_KEY },
        update: { SectorID: null }
      });

      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "Sectors",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.findAllSectors();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
