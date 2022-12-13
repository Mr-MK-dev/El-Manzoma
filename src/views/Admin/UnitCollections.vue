<template>
  <div>
    <v-btn
      v-if="isAdmin() || hasEditAccess()"
      @click="actionAdd()"
      large
      outlined
      color="primary"
    >
      إضافة تجميع قتالي جديد
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'التجميعات القتالية'"
    >
      <template v-if="isAdmin() || hasEditAccess()" v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteCollection(item)">
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
      :data="collection"
      :selects="selects"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
export default {
  name: "UnitCollections",
  async mounted() {
    await this.init();
    this.findAllCollections();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    collection: {},
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
          text: "اسم التجميع",
          value: "Name",
          searchValue: "Name",
          type: "textarea",
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
    async findAllCollections() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "UnitCollections"
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
      let saveItem;
      try {
        saveItem = await this.api(
          !this.collection.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "UnitCollections",
            where: !this.collection.ID_KEY
              ? this.collection
              : {
                  ID_KEY: this.collection.ID_KEY
                },
            update: this.collection
          }
        );

        if (!this.collection.ID_KEY) {
          let data = await this.api("global/get_all", {
            table: "UnitCollections"
          });
          this.$set(
            this.collection,
            "ID_KEY",
            data.data[data.data.length - 1].ID_KEY
          );
          // console.log(saveItem);
        }

        await this.api(`global/delete_all`, {
          table: "UnitCollectionPivot",
          where: { CollectionId: this.collection.ID_KEY }
        });

        console.log(this.collection.UnitID);
        for (let i = 0; i < this.collection.UnitID.length; i++) {
          try {
            await this.api("global/create_one", {
              table: "UnitCollectionPivot",
              where: {
                CollectionId: this.collection.ID_KEY,
                UnitID: this.collection.UnitID[i]
              },
              update: {
                CollectionId: this.collection.ID_KEY,
                UnitID: this.collection.UnitID[i]
              }
            });
          } catch (e) {
            console.log(e);
          }
        }

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllCollections();
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
      this.$set(this, "collection", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async actionEdit(item) {
      let units = await this.api("global/get_all", {
        table: "UnitCollectionPivot",
        include: [
          {
            model: "Unit"
          }
        ],
        where: { CollectionId: item.ID_KEY }
      });
      console.log(units.data.map(ele => ele.Unit));
      this.$set(
        this.collection,
        "UnitID",
        units.data.map(ele => ele.Unit)
      );
      // this.selects.UnitID = units.data.map(ele=>ele.Unit);

      this.$set(this.createdObject, "model", true);
      this.$set(this, "collection", {
        ...item,
        isEdit: true,
        UnitID: units.data.map(ele => ele.Unit)
      });
    },

    async deleteCollection(item) {
      this.$set(this.del, "loading", true);

      // here will create all attached units with null
      await this.api(`global/delete_all`, {
        table: "UnitCollectionPivot",
        where: { CollectionId: item.ID_KEY }
      });

      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "UnitCollections",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.findAllCollections();
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
