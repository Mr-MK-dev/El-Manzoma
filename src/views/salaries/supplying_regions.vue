<template>
  <div>
    <v-btn
      v-if="hasEditAccess()"
      @click="actionAdd()"
      large
      outlined
      color="primary"
    >
      إضافة جهة إمداد
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'جهات الإمداد'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip color="transparent">
          {{ item.FollowRigionName }}
        </v-chip>
      </template>
      <!-- <template v-if="isAdmin() || hasEditAccess()" v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteRigion(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template> -->
    </table-bulider>
    <editor-dialog-bulider
      title="جهة الإمداد"
      :open="createdObject.model"
      @on-close="createdObject.model = false"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="weapon"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>
<script>
export default {
  name: "SupplyingRegions",
  mounted() {
    this.findAllRegions();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    weapon: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: true,
          type: "checkbox",
          inTable: false,
          inModel: false,
          sort: 1
        },
        {
          text: "رقم جهة الإمداد",
          value: "WeaponID",
          searchValue: "WeaponID",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        },
        {
          text: "جهة الإمداد",
          value: "Weapon",
          searchValue: "Weapon",
          type: "text",
          inTable: true,
          required: true,
          inModel: true
        },
        {
          text: "مركز التدريب",
          value: "Markez_Tadreb",
          searchValue: "Markez_Tadreb",
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
    async findAllRegions() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api("global/get_all", {
          table: "Weapon"
        });
        this.$set(this.mainTable, "items", result.data);
      } catch (e) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "weapon", {
        ...item,
        isEdit: true
      });
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.weapon.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Weapon",
            where: !this.weapon.isEdit
              ? this.weapon
              : {
                  WeaponID: this.weapon.WeaponID
                },
            update: this.weapon
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllRegions();
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
      this.$set(this, "weapon", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
    // async deleteRigion(item) {
    //   this.$set(this.del, "loading", true);
    //   let soldiers = await this.api("global/get_all", {
    //     table: "followersolider",
    //     where: { followplace: item.FollowRigionID }
    //   });
    //   if (soldiers.data.length != 0) {
    //     this.showError("هذا المكان مرتبط بجنود ");
    //     return;
    //   }
    //   let { id, type } = this.del,
    //     delItem = await this.api("global/delete_all", {
    //       table: "FollowingRigion",
    //       where: {
    //         FollowRigionID: item.FollowRigionID
    //       }
    //     });
    //   if (delItem && delItem.ok && delItem.data) {
    //     this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
    //     this.$set(this.del, "model", false);
    //     this.$set(this.del, "id", "");
    //     this.$set(this.del, "type", false);
    //     this.findAllRegions();
    //   } else {
    //     this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
    //   }
    //   this.$set(this.del, "loading", false);
    // }
  }
};
</script>
