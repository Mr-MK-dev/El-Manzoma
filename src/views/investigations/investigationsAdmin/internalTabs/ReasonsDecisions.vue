<template>
  <div>
    <v-card-title>
      {{ title }}
      <v-spacer />
      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة قرارات السببية
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
      title="بيان قرارات السببية"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="reasonDecision"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
export default {
  name: "ReasonsDecisions",

  async mounted() {
    this.init();
    await this.handleSearch({});
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    reasonDecision: {},
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
        text: "قرار السببية",
        value: "Reason",
        searchValue: "Reason",
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
        text: "نوع السببية",
        value: "Type",
        searchValue: "Type",
        sortable: true,
        type: "select",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      }
    ],
    selects: {
      Type: {
        text: "text",
        value: "text",
        data: [
          {
            text: "شهيد"
          },
          {
            text: "مصاب"
          },
          {
            text: "نسبة عجز"
          },
          {
            text: "وفاة"
          },
          {
            text: "عام"
          }
        ]
      }
    }
  }),

  methods: {
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "reasonDecision", { ...item, isEdit: true });
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من الحذف`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "ReasonsDecisions",
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
        table: "ReasonsDecisions",
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
      this.reasonDecision = {};
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.reasonDecision.ID_KEY
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "ReasonsDecisions",
            where: this.reasonDecision.ID_KEY
              ? {
                  ID_KEY: this.reasonDecision.ID_KEY
                }
              : {
                  ...this.reasonDecision
                },
            update: {
              ...this.reasonDecision
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

        this.$set(this, "reasonDecision", {});
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
