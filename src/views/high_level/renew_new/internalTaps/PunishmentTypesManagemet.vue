<template>
  <div>
    <v-card-title>
      {{ title }}

      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة انواع للعقوبات
      </v-btn>
    </v-card-title>

    <table-bulider :headers="headers" :items="items" :title="''">
      <template v-if="hasEditAccess()" v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
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
      title="بيانات وظائف الراتب العالي"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="PunishmentType"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
export default {
  name: "PunishmentTypesManagement",

  async mounted() {
    this.init();
    await this.handleSearch({});
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    PunishmentType: {},
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
        text: "النوع",
        value: "Type",
        searchValue: "Type",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "المدة بالأيام",
        value: "periodInDays",
        searchValue: "periodInDays",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        required: false,
        inModel: true,
        sort: 1
      },
      {
        text: "درجة العقوبة",
        value: "Difficulties",
        searchValue: "Difficulties",
        sortable: true,
        type: "select",
        inSearch: false,
        multiple: false,
        inTable: true,
        required: true,
        inModel: true,
        sort: 1
      },
      {
        text: "مانع التجديد",
        value: "isRenewBlockedText",
        searchValue: "isRenewBlocked",
        sortable: true,
        type: "select",
        inSearch: false,
        multiple: false,
        inTable: true,
        required: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {
      Difficulties: {
        value: "value",
        text: "text",
        data: [
          {
            value: 1,
            text: "شديدة"
          },
          {
            value: 2,
            text: "بسيطة"
          }
        ]
      },
      isRenewBlocked: {
        value: "value",
        text: "text",
        data: [
          {
            value: true,
            text: "تمنع من  التجديد"
          },
          {
            value: false,
            text: "لا تمنع من التجديد"
          }
        ]
      }
    }
  }),

  methods: {
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "PunishmentType", { ...item, isEdit: true });
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "PunishmentTypes",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.handleSearch();
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
        table: "PunishmentTypes",
        where
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              isRenewBlockedText: ele.isRenewBlocked
                ? "يمنع من التجديد"
                : "لا يمنع من التجديد",
              Difficulties:
                ele.Difficulties === 1
                  ? "شديدة"
                  : "بسيطة"
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
      this.PunishmentType = {};
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.PunishmentType.ID_KEY
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "PunishmentTypes",
            where: this.PunishmentType.ID_KEY
              ? {
                  ID_KEY: this.PunishmentType.ID_KEY
                }
              : {
                  ...this.PunishmentType
                },
            update: {
              ...this.PunishmentType
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

        this.$set(this, "PunishmentType", {});
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
