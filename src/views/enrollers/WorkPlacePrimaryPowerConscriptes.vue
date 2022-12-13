<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="أفراد القوة الأساسية في مكان العمل"
      addBtnTitle="إضافة فرد"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'أفراد القوة الأساسية في مكان العمل'"
    >
      <template v-if="hasEditAccess()" v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="transparent" @click="deleteItem(item)">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة فرد قوة أساسية'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="conscipte"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="'إختيار النوع'"
      :open="TypeObject.model"
      :loading="createdObject.loading"
      :fields="KindEditor.headers"
      :selects="selects"
      :data="preEditor"
      @on-submit="CompleteEditorData()"
      @on-close="TypeObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "WorkPlacePrimaryPowerConscriptes",
  mounted() {
    this.init();
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
    preEditor: {},
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    conscipte: {},
    search: {},
    searchLoading: false,
    TypeObject: {
      model: false,
      item: {}
    },
    KindEditor: {
      headers: [
        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        }
      ]
    },
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
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: false,
          required: true,
          multiple: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Conscripte.Level",
          searchValue: "Level",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: false,
          inModel: false,
          required: true,
          multiple: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Conscripte.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Conscripte.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          multiple: true,
          sort: 1
        },
        {
          text: "السلاح",
          value: "Conscripte.Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "Conscripte.KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: false,
          inModel: true,
          inSearch: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "مكان العمل",
          value: "followerwork.workplace",
          searchValue: "WorkPlaceID",
          type: "text",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
          readOnly: true,
          sort: 1
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Type: {
        text: "text",
        value: "text",
        data: [
          {
            text: "مجند"
          },
          {
            text: "راتب عالي"
          }
        ]
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      Level: {
        text: "text",
        value: "text",
        data: [...constants.SoldierLevel.data]
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      WeaponID: {
        table: "Weapon",
        value: "WeaponID",
        text: "Weapon"
      }
    }
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters,
          UnitID: "",
          WeaponID: "",
          Name: "",
          WorkPlaceID: this.$route.params.id
        },
        likes = ["ID"],
        multi = ["Type"],
        date = [];

      where = this.mapToQuery(where, likes, multi, date);
      console.log("where", where);
      let data = await this.api("global/get_all", {
        table: "WorkPlaceMainPower",
        include:[
          {
            model: "followerwork"
          }
        ],
        where
      });
      console.log("data", data);

      let items = [];
      for (const ele of data.data) {
        var con = await this.fetchDataBaseOnType(
          ele.ID,
          ele.Type == "مجند" ? "Soldier" : "Rateb",
          "Conscripte"
        );
        items.push({
          ...ele,
          ...con
        });
      }
      // this code suposed to filter the fildes after getting for the db
      if (filters.WeaponID != null && filters.WeaponID.length > 0) {
        items = items.filter(ele =>
          filters.WeaponID.includes(ele.Conscripte.WeaponID)
        );
      }
      if (filters.Name && filters.Name != "") {
        items = items.filter(ele => ele.Conscripte.Name.includes(filters.Name));
      } else {
        let ConscripteKeys = Object.keys(items[0].Conscripte);
        let filterKeys = Object.keys(filters);

        let filteredArray = filterKeys.filter(ele =>
          ConscripteKeys.includes(ele)
        );

        for (let i = 0; i < filteredArray.length; i++) {
          items = items.filter(ele =>
            filters?.[`${filteredArray[i]}`]?.includes(
              ele?.Conscripte?.[`${filteredArray[i]}`]
            )
          );
        }
      }
      console.log(items);
      this.$set(this.mainTable, "items", items);
      this.$set(this.mainTable, "printer", {
        data: items,
        excelKey: "data",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable),
        hasParent: true
      });
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      console.log("conscipte", this.conscipte);
      this.$set(this, "conscipte", {
        ...this.conscipte,
        WorkPlaceID: this.$route.params.id
      });
      try {
        saveItem = await this.api(
          `global/${this.conscipte.isEdit ? "update_one" : "create_one"}`,
          {
            table: "WorkPlaceMainPower",
            where: !this.conscipte.isEdit
              ? {
                  ...this.conscipte
                }
              : {
                  ID_KEY: this.conscipte.ID_KEY
                },
            update: {
              ...this.conscipte
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          console.log("SavedItem", saveItem);
          this.showSuccess("تم حفظ ");
          await this.findItems({});
          this.$set(this.createdObject, "model", false);
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
      } catch (error) {
        console.log("error", error);
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this, "conscipte", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "conscipte", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this, "conscipte", {});
      this.$set(this, "conscipte", {
        ...item,
        ...item.Conscripte,
        isEdit: true
      });

      this.$set(this.createdObject, "model", true);
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "WorkPlaceMainPower",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.findItems({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    },

    CompleteEditorData() {
      this.$set(this.TypeObject, "model", false);
      this.$set(this.createdObject, "loading", true);

      if (this.preEditor.Type == "مجند") {
        this.findIDData(this.preEditor.ID, "Soldier");
      } else if (this.preEditor.Type == "راتب عالي") {
        this.findIDData(this.preEditor.ID, "Rateb");
      }
      this.$set(this.conscipte, "ID", this.preEditor.ID);
      this.$set(this.conscipte, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Conscripte");
      this.$set(this.conscipte, "Name", data.Conscripte.Name);
      this.$set(this.conscipte, "UnitID", data.Conscripte.UnitID);
      this.$set(
        this.conscipte,
        "KnowledgeLevel",
        data.Conscripte.KnowledgeLevel
      );
      this.$set(this.conscipte, "Level", data.Conscripte.Level);
      this.$set(this.conscipte, "Address", data.Conscripte.Address);
      this.$set(this.conscipte, "Religion", data.Conscripte.Religion);
      this.$set(this.conscipte, "MartialStatus", data.Conscripte.MartialStatus);
      this.$set(this.conscipte, "PhoneNumber", data.Conscripte.PhoneNumber);
      this.$set(this.conscipte, "IdentityNo", data.Conscripte.IdentityNo);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);
      return data;
    }
  }
};
</script>
