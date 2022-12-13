<template>
  <div>
    <v-card-title>
      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة فرد إحتياط الى التعبئة
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'وعاء التعبئة'"
      :isExcel="true"
    >

      <template v-slot:item.Soldier.SecurityExcludedFromPackaging="{ item }">
        <v-chip :color="item.Soldier.SecurityExcludedFromPackaging == 1 ? 'success' : 'error'">
          {{ item.Soldier.SecurityExcludedFromPackaging ==1 ? "نعم" : "لا" }}
        </v-chip>
      </template>

      <template v-slot:item.deleteFromList="{ item }">
        <v-chip icon color="transparent" @click="actionDelete(item)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-chip>
      </template>
      <template v-slot:item.editUnit="{ item }">
        <v-chip icon color="transparent" @click="actionEditUnit(item)">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-chip>
      </template>
      <template v-slot:item.SoldierID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoldierID}`"
          @click.right="copyText(item.SoldierID)"
        >
          {{ item.SoldierID }}
        </v-chip>
      </template>
      <template v-slot:item.toPlans="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
            class="mx-auto"
            @click="addToOrganizationPlan(item)"
            large
            outlined
            color="primary"
          >
            إضافة الي خطة رئيس الهيئة 1
          </v-btn>
        </div>
      </template>
      <template v-slot:item.toCompletePlan="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
            class="mx-auto"
            @click="addToCompletePlan(item)"
            large
            outlined
            color="primary"
          >
            إضافة الي خطة الاستكمال
          </v-btn>
        </div>
      </template>
      <template v-slot:item.toCompensationLossPlan="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
            class="mx-auto"
            @click="addToCompensationLossPlan(item)"
            large
            outlined
            color="primary"
          >
            إضافة الي خطة إستغواض الخسائر
          </v-btn>
        </div>
      </template>
    </table-bulider>
    <table-bulider
      :headers="removeTable.headers"
      :printer="removeTable.printer"
      :items="removeTable.items"
      :title="'المشطوبين'"
      :isExcel="true"
    >
      <template v-slot:item.Soldier.SecurityExcludedFromPackaging="{ item }">
      <v-chip :color="item.Soldier.SecurityExcludedFromPackaging == 1 ? 'success' : 'error'">
        {{ item.Soldier.SecurityExcludedFromPackaging ==1 ? "نعم" : "لا" }}
      </v-chip>
    </template>
      <template v-slot:item.retunToList="{ item }">
        <v-chip icon color="transparent" @click="actionReturnToList(item)">
          <v-icon color="success">mdi-upload</v-icon>
        </v-chip>
      </template>
      <template v-slot:item.SoldierID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoldierID}`"
          @click.right="copyText(item.SoldierID)"
        >
          {{ item.SoldierID }}
        </v-chip>
      </template>
    </table-bulider>
    <v-card>
      <div style="display: flex; flex-basis: auto;">
        <v-btn class="mx-auto" @click="actionRemoveAll()" large color="primary">
          تاكيد الشطب
        </v-btn>
      </div>
    </v-card>
    <table-bulider
      :headers="organizationPlanTable.headers"
      :printer="organizationPlanTable.printer"
      :items="organizationPlanTable.items"
      :title="'خطة رئيس الهيئة 1'"
      :isExcel="true"
    >
      <template v-slot:item.Soldier.SecurityExcludedFromPackaging="{ item }">
        <v-chip :color="item.Soldier.SecurityExcludedFromPackaging == 1 ? 'success' : 'error'">
          {{ item.Soldier.SecurityExcludedFromPackaging ==1 ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.retunToList="{ item }">
        <v-chip icon color="transparent" @click="actionReturnToList(item)">
          <v-icon color="success">mdi-upload</v-icon>
        </v-chip>
      </template>
      <template v-slot:item.SoldierID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoldierID}`"
          @click.right="copyText(item.SoldierID)"
        >
          {{ item.SoldierID }}
        </v-chip>
      </template>
    </table-bulider>
    <v-card>
      <div style="display: flex; flex-basis: auto;">
        <v-btn
          class="mx-auto"
          @click="actionِAddToOrganizationPlan()"
          large
          color="primary"
        >
          تاكيد إضافة الي خطة رئيس الهيئة 1
        </v-btn>
      </div>
    </v-card>
    <table-bulider
      :headers="completePlanTable.headers"
      :printer="completePlanTable.printer"
      :items="completePlanTable.items"
      :title="'خطة الاستكمال'"
      :isExcel="true"
    >
      <template v-slot:item.Soldier.SecurityExcludedFromPackaging="{ item }">
        <v-chip :color="item.Soldier.SecurityExcludedFromPackaging == 1 ? 'success' : 'error'">
          {{ item.Soldier.SecurityExcludedFromPackaging ==1 ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.retunToList="{ item }">
        <v-chip icon color="transparent" @click="actionReturnToList(item)">
          <v-icon color="success">mdi-upload</v-icon>
        </v-chip>
      </template>
      <template v-slot:item.SoldierID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoldierID}`"
          @click.right="copyText(item.SoldierID)"
        >
          {{ item.SoldierID }}
        </v-chip>
      </template>
    </table-bulider>
    <v-card>
      <div style="display: flex; flex-basis: auto;">
        <v-btn
          class="mx-auto"
          @click="actionِAddToCompletePlan()"
          large
          color="primary"
        >
          تاكيد إضافة الي خطة الاستكمال
        </v-btn>
      </div>
    </v-card>

    <editor-dialog-bulider
      :title="'تعديل وحدة التعبئة'"
      :open="createdObject.model"
      :fields="mainTable.headers"
      :selects="selects"
      :data="unit"
      @on-submit="updatePackagedUnit()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="'إضافة الى مجموعة إستعواض خسائر'"
      :open="lossObject.model"
      :fields="lossEditor.headers"
      :selects="selects"
      :data="loss"
      @on-submit="SaveLossGroup()"
      @on-close="lossObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="'إضافة فرد للتعبئة'"
      :open="TypeObject.model"
      :fields="KindEditor.headers"
      :selects="selects"
      :data="preEditor"
      @on-submit="CompleteEditorData()"
      @on-close="TypeObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="'إضافة فرد للمنظومة'"
      :open="addSoldierEditor.model"
      :fields="addSoldierEditor.headers"
      :selects="selects"
      :data="addSoldierEditor.addedSoldier"
      @on-submit="createSoldier()"
      @on-close="addSoldierEditor.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "unitDetails",

  components: {},

  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },

  mounted() {
    this.initWithoutChecking();
    this.findItems({});
  },
  watch: {
    "addSoldierEditor.addedSoldier.ID"(v) {
      if (v.length == 14) return;

      const levels = {
        1: "متوسطه",
        2: "عليا",
        8: "فوق متوسطة",
        0: "عادة"
      };
      const RecuRegionID = parseInt(v.charAt(4)) - 1;
      const LevelID = parseInt(v.charAt(5));
      const WeaponID = parseInt(v.substr(6, 2));

      this.conscripte.RecuRegion = constants.RecuRegion.data[RecuRegionID].text;
      this.addSoldierEditor.addedSoldier.KnowledgeLevel = levels[LevelID];
      this.conscripte.IndexNo =
        v.substring(4, 6) + v.substring(8, 10) + v.substring(11, 13);
      this.checkDirection();
      if (WeaponID) {
        this.conscripte.WeaponID = WeaponID;
      }
      this.$set(
        this.conscripte,
        "Markez_Tadreb",
        this.selects.WeaponID.data.find(ele => ele.WeaponID == WeaponID)
          ?.Markez_Tadreb || ""
      );
    }
  },
  data: () => ({
    showRemoveDialog: false,
    showUpdatDialog: false,
    removemodel: {},
    removedItem: {},
    updateRemovedItem: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    lossObject: {
      model: false,
      loading: false
    },
    loss: {},
    unit: {},
    KindEditor: {
      headers: [
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
    lossEditor: {
      headers: [
        {
          text: "المجموعة",
          value: "LossGroupID",
          searchValue: "LossGroupID",
          sortable: true,
          type: "select",
          inModel: true,
          required: true,
          sort: 1
        }
      ]
    },

    addSoldierEditor: {
      model: false,
      addedSoldier: {},
      headers: [
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
          readOnly: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الفئة",
          value: "SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ التجنيد",
          value: "RecuStartDate",
          searchValue: "RecuStartDate",
          sortable: true,
          type: "date",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: false,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "date",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "منطقة التجنيد",
          value: "RecuRegion",
          searchValue: "RecuRegionText",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "KnowledgeLevel",
          searchValue: "CityID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المركز",
          value: "KnowledgeLevel",
          searchValue: "CentreID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        }
      ]
    },
    preEditor: {},
    TypeObject: {
      model: false,
      item: {}
    },
    listType: "all",
    searchLoading: false,
    selects: {
      UnitID: {
        ignoreStatus: true,
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      PackagedUnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit",
        ignoreStatus: true
      },
      LossGroupID: {
        table: "LossGroups",
        value: "ID_KEY",
        text: "Name"
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      RecuRegionText: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      }
    },
    mainTable: {
      headers: [
        {
          text: "شطب من الوعاء",
          value: "deleteFromList",
          searchValue: "deleteFromList",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تعديل وحدة التعبئة",
          value: "editUnit",
          searchValue: "editUnit",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "SoldierID",
          searchValue: "SoldierID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "Soldier.City.City",
          searchValue: "CityID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "وحدة التعبئة",
          value: "Unit.Unit",
          searchValue: "PackagedUnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Soldier.SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "Soldier.RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }, {
          text: "مستبعد أمنيا",
          value: "Soldier.SecurityExcludedFromPackaging",
          searchValue: "SecurityExcludedFromPackaging",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "",
          value: "toPlans",
          searchValue: "toPlans",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "",
          value: "toCompletePlan",
          searchValue: "toCompletePlan",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "",
          value: "toCompensationLossPlan",
          searchValue: "toCompensationLossPlan",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    removeTable: {
      headers: [
        {
          text: "إستعادة من الشطب",
          value: "retunToList",
          searchValue: "retunToList",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "SoldierID",
          searchValue: "SoldierID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "وحدة التعبئة",
          value: "Unit.Unit",
          searchValue: "PackagedUnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Soldier.SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "مستبعد أمنيا",
          value: "Soldier.SecurityExcludedFromPackaging",
          searchValue: "SecurityExcludedFromPackaging",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "Soldier.RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    showAddDialog: false,
    addLoading: false,
    addModel: {},
    organizationPlanTable: {
      headers: [
        {
          text: "إستعادة من خطة رئيس الهيئة",
          value: "retunToList",
          searchValue: "retunToList",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "SoldierID",
          searchValue: "SoldierID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "وحدة التعبئة",
          value: "Unit.Unit",
          searchValue: "PackagedUnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Soldier.SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "Soldier.RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "مستبعد أمنيا",
          value: "Soldier.SecurityExcludedFromPackaging",
          searchValue: "SecurityExcludedFromPackaging",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    completePlanTable: {
      headers: [
        {
          text: "إستعادة من خطة الاستكمال",
          value: "retunToList",
          searchValue: "retunToList",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "SoldierID",
          searchValue: "SoldierID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "وحدة التعبئة",
          value: "Unit.Unit",
          searchValue: "PackagedUnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Soldier.SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "Soldier.RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "مستبعد أمنيا",
          value: "Soldier.SecurityExcludedFromPackaging",
          searchValue: "SecurityExcludedFromPackaging",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
      ],
      items: [],
      printer: {},
      printedData: {}
    }
  }),

  methods: {
    actionEditUnit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "unit", {
        ...item,
        isEdit: true
      });
    },
    addToCompensationLossPlan(item) {
      this.$set(this.lossObject, "model", true);
      this.$set(this, "loss", {
        ...item
      });
    },
    async updatePackagedUnit(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/update_one`, {
          table: "PackageCandidates",
          where: {
            ID_KEY: this.unit.ID_KEY
          },
          update: {
            PackagedUnitID: this.unit.PackagedUnitID
          }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.$set(this.createdObject, "model", false);
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
    async SaveLossGroup(edirableFromTableItem) {
      this.$set(this.lossObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/create_one`, {
          table: "CompensationLossCandidates",
          where: {
            ...this.loss
          }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");

          await this.api("global/delete_all", {
            table: "PackageCandidates",
            where: {
              ID_KEY: this.loss.PackageID
            }
          });
          this.$set(
            this.mainTable,
            "items",
            this.mainTable.items.filter(ele => ele.ID_KEY != this.loss.ID_KEY)
          );
          this.$set(this.lossObject, "model", false);
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.lossObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.lossObject, "loading", false);
      }
    },
    async actionDelete(item) {
      this.removeTable.items.push(item);
      this.$set(
        this.mainTable,
        "items",
        this.mainTable.items.filter(ele => ele.ID_KEY != item.ID_KEY)
      );
      console.log("mt", this.mainTable.items);
    },
    async addToOrganizationPlan(item) {
      this.organizationPlanTable.items.push(item);
      this.$set(
        this.mainTable,
        "items",
        this.mainTable.items.filter(ele => ele.ID_KEY != item.ID_KEY)
      );
      console.log("mt", this.mainTable.items);
    },
    async addToCompletePlan(item) {
      this.completePlanTable.items.push(item);
      this.$set(
        this.mainTable,
        "items",
        this.mainTable.items.filter(ele => ele.ID_KEY != item.ID_KEY)
      );
      console.log("mt", this.mainTable.items);
    },
    async actionReturnToList(item) {
      this.mainTable.items.push(item);
      this.$set(
        this.removeTable,
        "items",
        this.removeTable.items.filter(ele => ele.ID_KEY != item.ID_KEY)
      );
      this.$set(
        this.organizationPlanTable,
        "items",
        this.organizationPlanTable.items.filter(
          ele => ele.ID_KEY != item.ID_KEY
        )
      );
      this.$set(
        this.completePlanTable,
        "items",
        this.completePlanTable.items.filter(ele => ele.ID_KEY != item.ID_KEY)
      );
      console.log("mt", this.mainTable.items);
    },

    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "PackageCandidates",
        include: [
          {
            model: "Unit"
          },
          {
            model: "Soldier",
            include: [
              {
                model: "Unit"
              },
              {
                model: "City"
              }
            ]
          }
        ],
        where:
          this.$route.params.PackagedUnitID != "0"
            ? this.cleanObject({
                PackageID: this.$route.params.id,
                PackagedUnitID: this.$route.params.PackagedUnitID
              })
            : this.cleanObject({
                PackageID: this.$route.params.id
              })
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async actionRemoveAll() {
      let finish;
      let saveItem;
      this.$confirm(`هل انت متأكد من شطب الموجودين في جدول الشطب`, {
        title: ``
      }).then(async res => {
        if (res) {
          for (const ele of this.removeTable.items) {
            let candidate = {
              PackageID: ele.PackageID,
              SoldierID: ele.SoldierID
            };

            await this.api("global/create_one", {
              table: "RemovedPackageCandidates",
              where: candidate
            });

            await this.api("global/delete_all", {
              table: "PackageCandidates",
              where: {
                ID_KEY: ele.ID_KEY
              }
            });
          }
          this.showSuccess("تم الشطب بنجاح");
          this.$set(this.removeTable, "items", []);
        }
      });
    },
    async actionِAddToOrganizationPlan() {
      this.$confirm(`هل انت متأكد من وضع الموجودين في خطة رئيس الهيئة `, {
        title: ``
      }).then(async res => {
        if (res) {
          for (const ele of this.organizationPlanTable.items) {
            let candidate = {
              PackageID: ele.PackageID,
              SoldierID: ele.SoldierID,
              PackagedUnitID: ele.PackagedUnitID
            };

            await this.api("global/create_one", {
              table: "OrganizationPlanCandidates",
              where: candidate
            });

            await this.api("global/delete_all", {
              table: "PackageCandidates",
              where: {
                ID_KEY: ele.ID_KEY
              }
            });
          }
          this.showSuccess("تم الاضافة لخطة رئيس الهيئة 1 بنجاح");
          this.$set(this.organizationPlanTable, "items", []);
        }
      });
    },
    async actionِAddToCompletePlan() {
      this.$confirm(`هل انت متأكد من وضع الموجودين في خطة رئيس الهيئة `, {
        title: ``
      }).then(async res => {
        if (res) {
          for (const ele of this.completePlanTable.items) {
            let candidate = {
              PackageID: ele.PackageID,
              SoldierID: ele.SoldierID,
              PackagedUnitID: ele.PackagedUnitID
            };

            await this.api("global/create_one", {
              table: "CompletePlanCandidates",
              where: candidate
            });

            await this.api("global/delete_all", {
              table: "PackageCandidates",
              where: {
                ID_KEY: ele.ID_KEY
              }
            });
          }
          this.showSuccess("تم الاضافة لخطة الاستكمال بنجاح");
          this.$set(this.completePlanTable, "items", []);
        }
      });
    },
    CompleteEditorData() {
      this.$set(this.TypeObject, "model", false);
      this.findSoldier(this.preEditor.ID);
    },
    async findSoldier(ID) {
      if (ID.length > 10) {
        this.$set(this.createdObject, "loading", true);

        let soldier = await this.api("global/get_one", {
          table: "Soldier",
          where: { ID }
        });
        if (soldier.data) {
          console.log("Existent Soldier");
          // to add direcct to the plan
          if (soldier.data.Status == "بالخدمة") {
            this.showError("هذا الفرد بالخدمة لا يمكن اضافته لخطة التعبئة");
          }else if (soldier.data.SecurityExcludedFromPackaging) {
            this.showError("هذا الفرد مستبعد أمنيا لا يمكن اضافته لخطة التعبئة");
          } else {
            await this.addSoldierToPlan();
          }
        } else {
          console.log("Not Existent Soldier");

          // to open add soldier dialog
          this.$confirm(`هذا الجندي غير مضاف للمنظومة هل ترغب باضافته ؟`, {
            title: ``
          }).then(async res => {
            if (res) {
              this.$set(this.addSoldierEditor, "addedSoldier", {
                ID: this.preEditor.ID
              });
              this.$set(this.addSoldierEditor, "model", true);
            }
          });
        }
      }
    },
    actionAdd() {
      this.$set(this, "preEditor", {});
      this.$set(this.TypeObject, "model", true);
    },
    async createSoldier() {
      let createSoldier = await this.api("global/create_one", {
        table: "Soldier",
        where: {
          ID: this.addSoldierEditor.addedSoldier.ID,
          Name: this.addSoldierEditor.addedSoldier.Name,
          UnitID: this.addSoldierEditor.addedSoldier.UnitID,
          Status: "منتهى خدمته",
          SoldierStatus: "نقل على الإحتياط",
          WeaponID: 52,
          SoldierCategory: this.addSoldierEditor.addedSoldier.SoldierCategory,
          RecuEndDate: this.addSoldierEditor.addedSoldier.RecuEndDate,
          RecuStartDate: this.addSoldierEditor.addedSoldier.RecuStartDate,
          RecuRegion: this.addSoldierEditor.addedSoldier.RecuRegionText,
          CityID: this.addSoldierEditor.addedSoldier.CityID,
          CentreID: this.addSoldierEditor.addedSoldier.CentreID,
          KnowledgeLevel: this.addSoldierEditor.addedSoldier.KnowledgeLevel
        }
      });
      if (createSoldier.data) {
        this.$set(this.addSoldierEditor, "model", false);
        await this.addSoldierToPlan();
      }
    },
    async addSoldierToPlan() {
      let addToAddPlan = await this.api("global/create_one", {
        table: "AddPackageCandidates",
        where: {
          PackageID: this.$route.params.id,
          PackagedUnitID: this.$route.params.PackagedUnitID,
          SoldierID: this.preEditor.ID
        }
      });

      let addToCandidates = await this.api("global/create_one", {
        table: "PackageCandidates",
        where: {
          PackageID: this.$route.params.id,
          PackagedUnitID: this.$route.params.PackagedUnitID,
          SoldierID: this.preEditor.ID
        }
      });

      if (addToAddPlan.data && addToCandidates.data) {
        this.showSuccess("تم بنجاح");
        this.addSoldierToTable(this.preEditor.ID);
      }
    },
    async addSoldierToTable(ID) {
      let addedSoldier = await this.api("global/get_all", {
        table: "PackageCandidates",
        include: [
          {
            model: "Unit"
          },
          {
            model: "Soldier",
            include: [
              {
                model: "Unit"
              },
              {
                model: "City"
              }
            ]
          }
        ],
        where: {
          PackageID: this.$route.params.id,
          PackagedUnitID: this.$route.params.PackagedUnitID,
          SoldierID: ID
        }
      });
      if (addedSoldier.data) {
        this.mainTable.items.push(addedSoldier.data[0]);
      }
    }
  }
};
</script>
