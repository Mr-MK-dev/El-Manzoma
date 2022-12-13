<template>
  <div>
    <v-card-title>
      {{ title }}
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة جهاز
      </v-btn>
    </v-card-title>

    <table-bulider :headers="headers" :items="items" :title="''">
      <template v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="red"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="اجهزة الاشارة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="signalWeapon"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
export default {
  name: "signal_weapon_management",

  async mounted() {
    this.init();
    await this.handleSearch({});
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    signalWeapon: {},
    items: [],
    headers: [
      {
        text: "",
        value: "editor",
        searchValue: "editor",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "نوع الجهاز",
        value: "SignalWeaponType.Name",
        searchValue: "TypeID",
        sortable: true,
        type: "select",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "اسم الجهاز",
        value: "Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      }
    ],
    selects: {
      TypeID: {
        table: "SignalWeaponTypes",
        text: "Name",
        value: "ID_KEY"
      }
    }
  }),

  methods: {
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "signalWeapon", { ...item, isEdit: true });
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          try {
            await this.api(`global/delete_all`, {
              table: "SignalWeapons",
              where: {
                ID_KEY: item.ID_KEY
              }
            });
            this.handleSearch();
          } catch (error) {
            this.showError(`تعذر حذف لانها مرتبطة ب بيانات اخري`);
          }
        }
      });
    },
    handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = [],
        multi = [];
      where = this.mapToQuery(where, likes, multi);

      this.api("global/get_all", {
        table: "SignalWeapons",
        include: [
          {
            model: "SignalWeaponTypes"
          }
        ],
        where
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele
            })),
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inSearch)
            };

          this.$set(this, "items", data);
          this.$set(this, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async actionAdd() {
      this.$set(this, "showAddDialog", true);
      this.signalWeapon = {};
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.signalWeapon.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "SignalWeapons",
            where: this.signalWeapon.ID_KEY
              ? {
                  ID_KEY: this.signalWeapon.ID_KEY
                }
              : {
                  ...this.signalWeapon
                },
            update: {
              ...this.signalWeapon
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.handleSearch(this.search);
          this.showAddDialog = false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "loading", false);

        this.$set(this, "signalWeapon", {});
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
      }
    }
  }
};
</script>
