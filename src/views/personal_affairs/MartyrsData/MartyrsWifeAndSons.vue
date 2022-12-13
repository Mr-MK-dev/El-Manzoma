<template>
  <div>
    <v-dialog
      persistent
      v-model="Internals.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="Internals.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <add-children ref="internals" :parentFilters="true"></add-children>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-card-title>
      <v-btn @click="actionAdd" large outlined color="primary">
        إضافة بيان زوجه واطفال
      </v-btn>
    </v-card-title>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الزوجات'"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="transparent" @click="deleteItem(item)">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.editChildren="{ item }"
        ><v-chip class="transparent">
          <v-btn
            icon
            @click="
              Internals.model = true;
              getInternals(item);
            "
            color="primary"
          >
            <v-icon>mdi-eye</v-icon>
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
      :data="martyr"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
import lodash from "lodash";
import AddChildren from "@/views/personal_affairs/MartyrsData/addChildren";

export default {
  name: "WifesAndSons",
  props: {
    id: {
      type: String,
      default: "0"
    },
    militaryType: {
      type: String,
      default: "0"
    },
    Kind: {
      type: String,
      default: "0"
    }
  },
  components: {
    AddChildren,
    childrenInternals: () =>
      import("@/views/personal_affairs/MartyrsData/addChildren")
  },
  data: () => ({
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    martyr: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "البيانات الاساسية",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "إضافة أبناء",
          value: "editChildren",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "اسم الزوجة",
          value: "WifeName",
          searchValue: "WifeName",
          type: "text",
          sortable: true,
          required:true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الحالة الاجتماعية",
          value: "SocialState",
          searchValue: "SocialState",
          type: "select",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الرقم القومي",
          value: "WifeNationalID",
          searchValue: "WifeNationalID",
          type: "text",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "العنوان",
          value: "WifeAddress",
          searchValue: "WifeAddress",
          type: "text",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "الهاتف",
          value: "WifeTele",
          searchValue: "WifeTele",
          type: "text",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        }
      ],
      
      items: [],
      printer: []

    },
    selects: {
        SocialState: {
          data: [
          {
            text: "أرملة",
            value: "أرملة"
          },
          {
            text: "مطلقة",
            value: "مطلقة"
          },
          {
            text: "متزوجة",
            value: "متزوجة"
          },
        ],
        }},
  }),

  mounted() {
    this.findItems({ ID: this.id });
  },
  methods: {
    async getInternals(item) {
      if (this.$refs.internals) {
        this.$refs.internals.children = item;
        this.$set(this.$refs.internals, "children", item);
        await this.$refs.internals.findItems({ MomID: [item.ID_KEY] });
      } else {
        window.setTimeout(async () => {
          await this.getInternals(item);
        }, 1000);
      }
    },

    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID", "Name"],
        multi = [],
        date = ["DateOfDeath"];

      where = this.mapToQuery(where, likes, multi, date);
      this.api("global/get_all", {
        table: "Wives",
        where
      })
        .then(async x => {
          let data = x.data,
            printer = {
              data: [
                ...data.map(ele => ({
                  ...ele
                }))
              ],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              )
            };

          let group = await lodash.groupBy(data, ele => ele.WifeName);
          this.$set(
            this.mainTable,
            "items",
            Object.values(group).map(ele => ele[0])
          );
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      saveItem = await this.api(
        `global/${this.martyr.isEdit ? "update_one" : "create_one"}`,
        {
          table: "Wives",
          where: !this.martyr.isEdit
            ? {
                ...this.martyr,
                ID: this.id,
                MilitaryType: this.militaryType,
                Kind: this.Kind
              }
            : {
                ID_KEY: this.martyr.ID_KEY
              },
          update: { ...this.martyr, ID: this.id }
        }
      );

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems({ ID: this.id });
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this, "martyr", {});

      this.$set(this, "martyr", { isEdit: false });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "martyr", {
        ...item,
        isEdit: true
      });
    },
    actionEditCHildren(item) {
      this.$set(this.editChildren, "model", true);
      this.$set(this, "martyr", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "Wives",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findItems({ ID: this.id });
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>

<style></style>
