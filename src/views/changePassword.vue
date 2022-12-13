<template>
  <div>
    <v-btn
      @click="actionAdd()"
      :loading="searchLoading"
      large
      outlined
      color="primary"
    >
      تغيير كلمة المرور
    </v-btn>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :data="changepassword"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
export default {
  name: "changePassword",
  data: () => ({
    changepassword: {},
    subjectLimit: 10,
    createdObject: {
      model: true,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "كلمة المرور الحالية",
          value: "current",
          searchValue: "current",
          sortable: true,
          type: "password",
          inSearch: true,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "كلمة المرور الجديدة",
          value: "new",
          searchValue: "new",
          sortable: true,
          type: "password",
          inSearch: false,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تأكيد كلمة المرور الجديدة",
          value: "confirmation",
          searchValue: "confirmation",
          sortable: true,
          type: "password",
          inSearch: false,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    }
  }),

  methods: {
    actionAdd() {
      this.$set(this, "changepassword", {});
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async saveItem(edirableFromTableItem) {
      if (
        this.changepassword.current != this.$store.state.currentUser.password
      ) {
        return this.showError("كلمة المرور الحالية غير صحيحة");
      }
      if (this.changepassword.new != this.changepassword.confirmation) {
        return this.showError(
          "يرجى كتابة كلمة المرور الجديدة والتأكيد الخاص بها بشكل صحيح"
        );
      }
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/update_one`, {
          table: "users",
          where: { username: this.$store.state.currentUser.username },

          update: { password: this.changepassword.new }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم تغيير كلمة المرور بنجاح ");
          this.$set(this.createdObject, "model", false);
          this.logout();
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
  }
};
</script>

<style scoped></style>
