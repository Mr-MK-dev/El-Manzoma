<template>
  <div>
    <custom-search
      :fields="headers"
      :selects="selects"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في إنتقاءات الجنود"
      addBtnTitle="إضافة إنتقاء"
    />

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template
        v-if="isAdmin() || hasEditAccess()"
        v-slot:item.editor="{ item }"
      >
        <v-chip class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="isAdmin()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.WeaponIDs="{ item }">
        <span>
          {{
            mapWeaponIDs(
              item.WeaponIDs.push ? item.WeaponIDs : [item.WeaponIDs]
            )
          }}
        </span>
      </template>

      <template v-slot:item.SelectedWeapon="{ item }">
        <span>
          {{ mapWeaponIDs([item.SelectedWeapon]) }}
        </span>
      </template>
    </table-bulider>

    <custom-dialog
      title="إضافة إنتقاء"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Selection"
      @on-submit="saveItem()"
    />
  </div>
</template>

<script>
import CustomSearch from "../../../components/shared/CustomSearch.vue";
import CustomTable from "../../../components/shared/CustomTable.vue";
import CustomDialog from "../../../components/shared/CustomDialog.vue";
const lodash = require("lodash");
const constants = require("../../../Constant").default;

export default {
  components: { CustomSearch, CustomTable, CustomDialog },

  name: "Soldiers",

  mounted() {
    this.init();
  },

  data: () => ({
    loading: false,
    searchLoading: false,
    showAddDialog: false,
    Selection: {},
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
        text: "الاسم",
        value: "Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الرقم الثلاثي",
        value: "TripleNo",
        searchValue: "TripleNo",
        sortable: true,
        type: "tribleNum",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "المرحلة التجنيدية",
        value: "RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        type: "select",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "المنطقة",
        value: "RecuRigion",
        searchValue: "RecuRigion",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "المؤهل",
        value: "KnowledgeLevel",
        searchValue: "KnowledgeLevel",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الاسلحة الموصي بها",
        value: "WeaponIDs",
        searchValue: "WeaponIDs",
        sortable: true,
        multiple: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الموصي",
        value: "Recommander",
        searchValue: "Recommander",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "السلاح المختار",
        value: "SelectedWeapon",
        searchValue: "SelectedWeapon",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },

      RecuRigion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Treatment: {
        text: "text",
        value: "text",
        data: constants.Treatment.data
      },
      WeaponIDs: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      SelectedWeapon: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      }
    }
  }),

  methods: {
    handleSearch(data) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = ["ID"],
        multi = ["WeaponIDs"];
      where = this.mapToQuery(where, likes, multi);

      this.api("global/get_all", {
        table: "Selections",
        where
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              WeaponIDs: JSON.parse(ele.WeaponIDs)
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
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async actionAdd() {
      this.$set(this, "item", {});
      this.$set(this, "showAddDialog", true);
    },

    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Selection", { ...item, isEdit: true });
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Selections",
            where: {
              IDKey: item.IDKey
            }
          });
          this.handleSearch({});
        }
      });
    },
    mapWeaponIDs(ids) {
      return ids
        .map(
          ele =>
            this.selects.WeaponIDs.data.find(we => we.WeaponID == ele)?.Weapon
        )
        .join(" , ");
    },
    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.Selection.isEdit ? `global/create_one` : `global/update_one`,
          {
            table: "Selections",
            where: this.Selection.IDKey
              ? {
                  IDKey: this.Selection.IDKey
                }
              : {
                  ...this.Selection,
                  WeaponIDs: JSON.stringify(this.Selection.WeaponIDs)
                },
            update: {
              ...this.Selection,
              WeaponIDs: JSON.stringify(this.Selection.WeaponIDs)
            }
          }
        );

        if (
          this.Selection.IDKey &&
          this.Selection.SelectedWeapon &&
          this.Selection.WeaponIDs.indexOf(this.Selection.SelectedWeapon) === -1
        ) {
          console.log(this.Selection);
          await this.api(`global/create_one`, {
            table: "NotMatchedWeapon",
            where: {
              ...this.Selection,
              WeaponIDs: JSON.stringify(this.Selection.WeaponIDs),
              IDKey: null
            }
          });
        }

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.handleSearch();
          this, "showAddDialog", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
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
