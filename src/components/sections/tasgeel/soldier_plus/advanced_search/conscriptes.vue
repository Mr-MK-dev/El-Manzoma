<template>
  <div>
    <v-card class="mb-6">
      <v-card-title>
        البحث المتقدم عن المجندين
      </v-card-title>
      <v-card-text>
        من فضلك قم بتحديد الخيارات التي تريدها من الأسفل, ثم اضغط على زر البحث
        الأزرق الموجود في أعلى يسار الصفحة. وستظهر لك النتائج في نهاية الصفحة
      </v-card-text>
    </v-card>
    <template v-for="(card, ii) in cards">
      <v-card
        :key="ii"
        class="mb-6"
        :loading="result.loading"
        :disabled="result.loading"
      >
        <v-card-title class="sidenav white--text">
          {{ card.title }}
          <v-btn icon @click="show[ii] = !show[ii]">
            <v-icon>{{
              show[ii] ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(option, i) in card.options">
              <v-col
                v-if="show[ii] && !option.hide"
                cols="4"
                :key="i"
                :v-if="!option.hide"
                v-show="show[ii]"
                :lg="option.type == 'date' ? '8' : '4'"
              >
                <v-checkbox
                  v-if="option.type == 'checkbox'"
                  :label="option.label"
                  v-model="search[option.model]"
                ></v-checkbox>

                <v-text-field
                  v-if="!option.type || option.type == 'text'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-model="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchConscriptes"
                ></v-text-field>
                <v-text-field
                  v-else-if="option.type == 'number'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-mask="'##########'"
                  v-model.number="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchConscriptes"
                ></v-text-field>

                <v-row class="py-0 my-0" v-else-if="option.type == 'select'">
                  <v-col
                    @click="
                      search[option.model] = selects[option.model].data.map(
                        ele => ele[selects[option.model].value] || ele
                      )
                    "
                    cols="1"
                    class="py-3 my-1"
                  >
                    <v-icon
                      style="cursor: pointer;"
                      v-if="option.type == 'select'"
                      v-icon
                      class="me-3"
                      >mdi-select-all</v-icon
                    >
                  </v-col>

                  <v-col cols="11" class="py-0 my-0">
                    <v-autocomplete
                      v-if="option.type == 'select'"
                      :label="option.label"
                      :hint="option.hint"
                      v-model="search[option.model]"
                      :items="selects[option.model].data"
                      :multiple="option.multiple"
                      :item-value="selects[option.model].value"
                      :item-text="selects[option.model].text"
                      filled
                      :error-messages="selects[option.model].error"
                      :append-icon="
                        selects[option.model].error
                          ? 'mdi-refresh'
                          : 'mdi-chevron-down'
                      "
                      @click:append="
                        selects[option.model].error
                          ? init(option.model)
                          : () => {}
                      "
                      :hide-details="option.hint ? false : true"
                      :persistent-hint="option.hint ? true : false"
                      :loading="selects[option.model].loading || option.loading"
                      clearable
                    >
                      <template
                        v-if="
                          search[option.model] &&
                            search[option.model].length > 10
                        "
                        v-slot:selection="{ item, index }"
                      >
                        <v-chip v-if="index === 0">
                          <span>{{ item.text }}</span>
                        </v-chip>
                        <span
                          v-if="index === 1"
                          class="grey--text text-caption"
                        >
                          (+{{ search[option.model].length - 1 }} اخري)
                        </span>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-row class="py-0 my-0" v-else-if="option.type == 'date'">
                  <template v-for="x in ['from', 'to']">
                    <v-col
                      v-if="search[option.model]"
                      cols="6"
                      class="py-0 my-0"
                      :key="x"
                    >
                      <v-text-field
                        v-model="search[option.model][x]"
                        :prepend-inner-icon="option.icon"
                        :hint="option.hint"
                        :persistent-hint="option.hint ? true : false"
                        :hide-details="option.hint ? false : true"
                        :label="
                          `${option.label} ( ${x == 'from' ? 'من' : 'الى'} )`
                        "
                        :error-messages="option.error"
                        filled
                        :clearable="
                          option.range
                            ? false
                            : !option.readonly && !option.disabled
                        "
                        type="date"
                      >
                      </v-text-field>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <!-- <v-card class="mb-6">
      <v-card-actions class="px-4"> -->
    <v-card>
      <v-btn
        class="px-4"
        large
        color="sidenav white--text"
        @click="searchConscriptes"
      >
        <v-icon class="me-3">mdi-magnify</v-icon>
        بحث
      </v-btn>
    </v-card>
    <v-card class="mb-6">
      <v-card-title class="sidenav white--text">
        النتائج
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="result.items.length == 0"
          :query="`tasgeel/search/conscriptes`"
          :data="result.printer"
          :fab="false"
          dark
        ></printer-menu>
      </v-card-title>
    </v-card>
    <v-divider></v-divider>
    <v-card>
      <div style="padding: 35px;">
        <v-row>
          <v-col cols="9">
            <v-autocomplete
              :items="result.headers"
              v-model="headersSelected"
              return-object
              label="إختيارات العرض"
              multiple
              clearable
              deletable-chips
              chips
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="3"
            style="
    display: flex;
    align-items: center;
"
          >
            <v-btn class="px-4" large color="Transpanrent" @click="selectAll">
              إختيار الكل
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-data-table
      height="400"
      :items="result.items"
      :headers="headersSelected"
      fixed-header
      :search="result.search"
      v-model="result.selected"
      multi-sort
      hide-default-header
      ref="mainTable"
    >
      <template v-slot:header="table">
        <table-header-filters
          :items="result.items"
          :currentItems="currentItems"
          @sorted="sortData"
          :key="key"
          :hasSort="true"
          :table="table"
          ref="header"
          :filters="tableFilters"
        ></table-header-filters>
      </template>
      <template v-slot:footer="table">
        <table-footer-filters
          :filters="tableFilters"
          :table="table"
          ref="footer"
        ></table-footer-filters>
      </template>
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="
            `/soldiers_plus/${item.ID}/${
              item.RecuStage
                ? constants.serviceTypesMap.solider
                : constants.serviceTypesMap.highLevel
            }`
          "
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>
      <template v-slot:item.Name="{ item }">
        <v-chip color="transparent" @click.right="copyText(item.Name)">
          {{ item.Name }}
        </v-chip>
      </template>
      <template v-slot:item.actionStart="{ item }">
        <v-chip
          v-if="$store.state.currentUser.canEdit"
          icon
          color="transparent"
          @click="Edit(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
const constants = require("../../../../../Constant").default;
const lodash = require("lodash");
const basicHeaders = [
  {
    text: "",
    value: "actionStart",
    sortable: true
  },
  {
    value: "ID",
    text: "الرقم العسكري",
    sortable: true
  },
  {
    value: "Name",
    text: "الإسم",
    sortable: true
  },
  {
    value: "Unit.Unit",
    dbvalue: "UnitID",
    text: "الوحدة",
    sortable: true
  },
  {
    value: "Weapon.Weapon",
    text: "السلاح",
    sortable: true
  },
  {
    value: "Duty.Duty",
    dbvalue: "DutyID",
    text: "الواجب المدرب عليه",
    sortable: true
  },
  {
    value: "Type",
    dbvalue: "Type",
    text: "نوع الفرد",
    sortable: true
  },
  {
    value: "SoldierStatus",
    dbvalue: "SoldierStatus",
    text: "سبب الانهاء",
    sortable: true
  },
  {
    value: "Status",
    dbvalue: "Status",
    text: "حالة الفرد",
    sortable: true
  },
  {
    value: "SoldierCategory",
    dbvalue: "SoldierCategory",
    text: "الفئة",
    sortable: true
  },
  {
    value: "RecuEndDate",
    dbvalue: "RecuEndDate",
    text: "تاريخ التسريح",
    sortable: true
  },
  {
    value: "DriverLevel",
    dbvalue: "DriverLevel",
    text: "درجة الرخصة",
    type: "select"
  },
  {
    value: "UnitJob",
    dbvalue: "UnitJob",
    text: "العمل في الوحدة",
    type: "text"
  }
];
export default {
  name: "conscriptes",
  async mounted() {
    this.fillKeys();
    await this.init();
    this.search.Type = ["راتب عالى", "مجند"];
    this.selects.RecuEndDate.data = await this.fetchAvailableServiceEndDates();
    this.selects.WeaponID.data = this.selects.WeaponID.data.filter(
      ele => ele.WeaponID != 18
    );
  },
  data: () => ({
    headersSelected: [...basicHeaders],
    componentName: "soldiers_plus",
    tableFilters: {},
    currentItems: [],
    fullDatas: {},
    result: {
      printer: {},
      selected: [],
      search: "",
      items: [],
      headers: [
        {
          value: "Weapon.Weapon",
          text: "السلاح",
          sortable: true
        },

        {
          value: "Unit.Directionforunit",
          text: "التشكيل",
          sortable: true
        },
        {
          value: "IndexNo",
          text: "رقم السجل",
          sortable: true
        },
        {
          value: "City.City",
          dbvalue: "CityID",
          text: "المحافظة",
          sortable: true
        },
        {
          value: "Centre.Centre",
          dbvalue: "CentreID",
          text: "المركز",
          sortable: true
        },
        {
          value: "Duty.Duty",
          dbvalue: "DutyID",
          text: "الواجب المدرب عليه",
          sortable: true
        },
        {
          value: "Job.Name",
          dbvalue: "CurrentJobID",
          text: "العمل الحالي",
          sortable: true
        },
        {
          value: "Type",
          dbvalue: "Type",
          text: "نوع الفرد",
          sortable: true
        },
        {
          value: "SoldierStatus",
          dbvalue: "SoldierStatus",
          text: "حالة الفرد",
          sortable: true
        },
        {
          value: "Status",
          dbvalue: "Status",
          text: "سبب إنهاء الخدمة",
          sortable: true
        },
        {
          value: "SoldierCategory",
          dbvalue: "SoldierCategory",
          text: "الفئة",
          sortable: true
        },
        {
          value: "TripleNo",
          dbvalue: "TripleNo",
          text: "الرقم الثلاثي",
          sortable: true
        },
        {
          model: "RowCategory",
          multiple: false,
          label: "نوع الصف",
          type: "select",
          hide: true
        },
        {
          value: "SoldierLevel",
          dbvalue: "SoldierLevel",
          text: "الدرجة",
          sortable: true
        },
        {
          value: "RecuStartDate",
          text: "تاريخ التجنيد / التطوع",
          sortable: true
        },
        {
          value: "RecuRegion",
          dbvalue: "RecuRegion",
          text: "منطقة التجنيد",
          sortable: true
        },
        {
          value: "KnowledgeLevel",
          dbvalue: "KnowledgeLevel",
          text: "المؤهل",
          sortable: true
        },
        {
          value: "RecuStage",
          dbvalue: "RecuStage",
          text: "المرحلة التجنيدية",
          sortable: true
        },
        {
          value: "RecuTreat",
          dbvalue: "RecuTreat",
          text: "المعاملة التجنيدية",
          sortable: true
        },
        {
          value: "MissingTime",
          dbvalue: "MissingTime",
          text: "مدة الفقد",
          sortable: true
        },
        {
          value: "RecuEndDate",
          dbvalue: "RecuEndDate",
          text: "تاريخ التسريح",
          sortable: true
        },
        {
          value: "EndingCause",
          dbvalue: "EndingCause",
          text: "سبب إنهاء الخدمة",
          sortable: true
        },
        {
          value: "Address",
          dbvalue: "Address",
          text: "العنوان",
          sortable: true
        },
        {
          value: "IdentityNo",
          dbvalue: "IdentityNo",
          text: "الرقم القومي",
          sortable: true
        },
        {
          value: "BirthDate",
          dbvalue: "BirthDate",
          text: "تاريخ الميلاد",
          sortable: true
        },
        {
          value: "College",
          dbvalue: "College",
          text: "الكلية",
          sortable: true
        },
        {
          value: "Specialization",
          dbvalue: "Specialization",
          text: "التخصص",
          sortable: true
        },
        {
          value: "Job",
          dbvalue: "Job",
          text: "المهنة قبل التجنيد",
          sortable: true
        },
        {
          value: "Religion",
          dbvalue: "Religion",
          text: "الديانة",
          sortable: true
        },
        {
          value: "ArrivalDate",
          dbvalue: "ArrivalDate",
          text: "تاريخ الوصول",
          sortable: true
        },
        {
          value: "Notes",
          dbvalue: "Notes",
          text: "الملاحظات",
          sortable: true
        },
        {
          value: "SatrtingSarefRateb",
          dbvalue: "SatrtingSarefRateb",
          text: "تاريخ صرف الراتب العالي",
          sortable: true
        },
        {
          value: "RatebEndDate",
          dbvalue: "RatebEndDate",
          text: "تاريخ إنتهاء الخدمة",
          sortable: true
        },
        {
          value: "VolunteeringDate",
          dbvalue: "VolunteeringDate",
          text: "تاريخ التطوع",
          sortable: true
        },
        {
          value: "SupplyingRigion",
          dbvalue: "SupplyingRigion",
          text: "جهة الإمداد",
          sortable: true
        },
        {
          value: "Taskeen",
          dbvalue: "Taskeen",
          text: "التسكين",
          sortable: true
        },
        {
          value: "OlderindNo",
          dbvalue: "OlderindNo",
          text: "رقم الأقدمية",
          sortable: true
        },
        {
          value: "Dof3aNum",
          dbvalue: "Dof3aNum",
          text: "رقم الدفعة",
          sortable: true
        },
        {
          value: "MartialStatus",
          dbvalue: "MartialStatus",
          text: "الحالة الإجتماعيه",
          sortable: true
        },

        {
          value: "RatebCategoryFari",
          dbvalue: "RatebCategoryFari",
          text: "الفئة الفرعية",
          type: "text"
        },
        {
          value: "FirstRenewDateTo",
          dbvalue: "FirstRenewDateTo",

          text: "تاريخ التجديد الأول",
          type: "text"
        },
        {
          value: "SecondRenewDateTo",
          dbvalue: "SecondRenewDateTo",

          text: "تاريخ التجديد الثاني",
          type: "text"
        },
        {
          value: "UnitJoinDate",
          dbvalue: "UnitJoinDate",

          text: "تاريخ الضم ع الوحدة",
          type: "text"
        },
        {
          value: "isChecked",
          dbvalue: "isChecked",

          text: "تم المراجعه عليه",
          type: "text"
        }
      ]
    },
    show: {
      0: false,
      1: true,
      2: false,
      3: false,
      4: false,
      5: false
    },
    printers: [
      {
        title: "طباعة النتائج Excel",
        desc: "",
        action: "printerExcel"
      }
    ],
    key: 0,

    search: {},
    dialogs: {},
    cards: [
      {
        title: "بيانات اخري",
        options: [
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "text"
          },
          {
            model: "IndexNo",
            label: "رقم السجل ",
            type: "text"
          },
          {
            model: "Direction",
            multiple: true,
            label: " الاتجاه",
            type: "select"
          },
          {
            model: "BirthDate",
            label: "تاريخ الميلاد",
            type: "date"
          },
          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            counter: 14
          },
          {
            model: "CityID",
            multiple: true,
            label: "المحافظة",
            type: "select"
          },
          {
            model: "CentreID",
            multiple: true,
            label: "المركز",
            type: "select"
          },

          {
            model: "BloodType",
            multiple: true,
            label: "فصيلة الدم",
            type: "select"
          }
        ]
      },
      {
        title: "بيانات اساسية",
        options: [
          {
            model: "Name",
            label: "الإسم",
            type: "text"
          },
          {
            model: "UnitID",
            multiple: true,
            label: "الوحدة",
            type: "select"
          },
          {
            model: "Directionforunit",
            multiple: true,
            label: "التشكيل",
            type: "select"
          },
          {
            model: "Collections",
            multiple: false,
            label: "التجميعات القتالية",
            type: "select",
            inModel: false
          },
          {
            model: "SectorID",
            multiple: true,
            label: "القطاع",
            type: "select"
          },
          {
            model: "Type",
            label: "توع المجند",
            type: "select",
            multiple: true
          },
          {
            model: "SoldierLevel",
            multiple: true,
            label: "الدرجة",
            type: "select"
          },
          {
            model: "SoldierStatus",
            multiple: true,
            label: "سبب الانهاء",
            type: "select",
            forEnhaa: true
          },
          {
            model: "Status",
            multiple: true,
            label: "حالة الفرد",
            type: "select",
            forEnhaa: true
          },
          {
            model: "KnowledgeLevel",
            multiple: true,
            label: "المؤهل",
            type: "select"
          },

          {
            model: "RecuRegion",
            multiple: true,
            label: "منطقة التجنيد",
            type: "select"
          },

          {
            model: "SoldierCategory",
            multiple: true,
            label: "الفئة",
            type: "select"
          },
          {
            model: "RowCategory",
            multiple: true,
            label: "تصنيف الصف",
            type: "select"
          },
          {
            model: "RecuTreat",
            multiple: true,
            label: "المعاملة التجنيدية",
            type: "select"
          },
          {
            model: "RecuStage",
            multiple: true,
            label: "المرحلة التجنيدية",
            type: "select"
          },
          {
            model: "RecuEndDate",
            label: "تاريخ التسريح",
            type: "select",
            multiple: true
          },
          {
            model: "WeaponID",
            multiple: true,
            label: "السلاح",
            type: "select"
          },
          {
            model: "DutyID",
            multiple: true,
            label: " الواجب المدرب عليه",
            type: "select"
          },
          {
            model: "Religion",
            multiple: true,
            label: "الديانة",
            type: "select"
          },
          {
            model: "College",
            multiple: true,
            label: "الكلية ",
            type: "select"
          },
          {
            model: "DriverLevel",
            multiple: true,
            label: "درجة الرخصة",
            type: "select"
          },
          {
            model: "ArrivalDate",
            label: " تاريخ الوصول لمركز التدريب",
            type: "date"
          },
          {
            model: "UnitJoinDate",
            label: " تاريخ الضم علي الوحدة",
            type: "date"
          }
        ]
      }
    ],
    constants: constants,
    selects: {
      RecuEndDate: {
        data: []
      },
      RowCategory: {
        data: ["صف حدود", "صف ادارات"]
      },
      Collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      SectorID: {
        table: "Sectors",
        value: "ID_KEY",
        text: "Name"
      },
      SoldierLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      DriverLevel: {
        text: "text",
        value: "text",
        data: constants.DriverLevel.data
      },
      RecuTreat: {
        text: "text",
        value: "text",
        data: constants.RecuTreat.data
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      BloodType: {
        text: "text",
        value: "text",
        data: constants.BloodType.data
      },
      RecuRegion: {
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
      SoldierStatus: {
        text: "Reason",
        value: "Reason",
        table: "EndingReasons"
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      College: {
        table: "Colleges",
        text: "Name",
        value: "Name"
      },
      DirectionforFeaat: {
        table: "Sectors",
        text: "Name",
        value: "Name"
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      CurrentJobID: {
        table: "Jobs",
        text: "Name",
        value: "ID_KEY"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Directionforunit: {
        table: "Unit",
        value: "Directionforunit",
        text: "Directionforunit"
      },
      ServiceType: {
        text: "text",
        value: "text",
        data: constants.serviceTypes
      },
      ServiceStyle: {
        text: "text",
        value: "text",
        data: constants.ServiceStyle
      },
      RatebCategoryFari: {
        text: "text",
        value: "text",
        data: constants.RatebCategoryFari.data
      },
      RatebCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      RatebLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      RatebState: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      MartialStatus: {
        text: "text",
        value: "text",
        data: constants.matrialStatus.data
      },
      Type: {
        text: "text",
        value: "text",
        data: [{ text: "راتب عالى" }, { text: "مجند" }]
      }
    },
    lastSort: "",
    lastOrder: true
  }),
  watch: {
    "search.SoldierCategory"(v) {
      if (v.indexOf("صف") > -1) {
        this.cards[0].options.find(
          option => option.model == "RowCategory"
        ).hide = false;
      } else {
        this.cards[0].options.find(
          option => option.model == "RowCategory"
        ).hide = true;
      }
    }
  },
  methods: {
    async getRecuEndDateOptions() {
      let currentDate = new Date();
      const result = await this.api("global/queryRunners", {
        query: `select count (ID) count ,  RecuEndDate from Soldier where Soldier.Status = N'بالخدمة' or (RecuEndDate > dateadd(year, -1, getdate()) and RecuEndDate < GETDATE())   GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
    },
    sortData(e) {
      this.result.items = lodash.orderBy(
        this.result.items,
        [e.value],
        this.lastOrder ? "asc" : "desc"
      );

      this.lastSort = e.value;
      this.lastOrder = !this.lastOrder;
    },
    async searchConscriptes() {
      this.$set(this, "tableFilters", {});
      this.$set(this.result, "items", []);
      this.$refs.header.removeFilters();
      this.$set(this.result, "loading", true);
      let search = this.search;
      if (search.WeaponID.indexOf(66) > -1) {
        search.WeaponID.push(18);
      }
      if (search.RowCategory.indexOf(this.selects.RowCategory.data[0]) > -1) {
        search.WeaponID.push(52);
      }
      if (search.RowCategory.indexOf(this.selects.RowCategory.data[1]) > -1) {
        search.WeaponID = this.selects.WeaponID.data
          .filter(ele => ele.WeaponID != 52)
          .map(ele => ele.WeaponID);
      }
      if (search.Collections) {
        console.log(search.Collections);
        let data = await this.api("global/get_all", {
          table: "UnitCollectionPivot",
          where: { CollectionId: search.Collections }
        });
        console.log(data);
        // this.$set(this.search, "UnitID", data.data.map(ele => ele.UnitID));
        this.search.UnitID = data.data.map(ele => ele.UnitID);
        // this.search.Collections = {};
        console.log(data.data.map(ele => ele.UnitID));
      }
      this.api("sections/tasgeel/search/conscriptes", {
        search: this.cleanObject({
          ...search,
          RowCategory: [],
          RatebCategory: search.SoldierCategory,
          RatebLevel: search.SoldierLevel,
          VolunteeringDate: search.RecuStartDate,
          RatebState: search.SoldierStatus
        })
      })
        .then(x => {
          console.log("Conscriptes", x.data);
          let fixedData = x.data.map(ele => ({
              ...ele,
              Type: ele.RecuStage ? "مجند" : "راتب عالي",
              Weapon: this.selects.WeaponID.data.find(
                weapon => weapon.WeaponID == ele.WeaponID
              ) ?? {
                Weapon: ""
              },
              Duty: this.selects.DutyID.data.find(
                duty => duty.DutyID == ele.DutyID
              ) ?? {
                Duty: ""
              },
              Job: this.selects.CurrentJobID.data.find(
                job => job.ID_KEY == ele.CurrentJobID
              ) ?? {
                Job: ""
              },
              City: this.selects.CityID.data.find(
                city => city.CityID == ele.CityID
              ) ?? {
                City: ""
              },
              Centre: this.selects.CentreID.data.find(
                centre => centre.CentreID == ele.CentreID
              ) ?? {
                Centre: ""
              },
              SoldierStatus: ele.RecuStage ? ele.SoldierStatus : ele.RatebState,
              SoldierCategory: ele.RecuStage
                ? ele.SoldierCategory
                : ele.RatebCategory,
              SoldierLevel: ele.SoldierLevel
                ? ele.SoldierLevel
                : ele.RatebLevel,
              RecuStartDate: ele.RecuStage
                ? ele.RecuStartDate
                : ele.VolunteeringDate
            })),
            printer = {
              cons: [...fixedData],
              excelKey: "cons",
              excelHeaders: this.headersSelected
            };
          this.$set(this.result, "items", fixedData);
          this.$set(this.result, "printer", printer);
        })
        .catch(error => {
          this.showError(
            "تعذر البحث عن الافراد الرجاء اعادة البحث بسبب مشاكل في الشبكة"
          );
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    Edit(item) {
      this.goThere(`/add_conscripte/${item.ID}/${item.Type}`);
    },
    fillKeys() {
      let options_arr = this.cards.map(c => c.options),
        options = [];
      options_arr.forEach(arr => {
        options = [...options, ...arr];
      });
      options.forEach(option => {
        if (option.type == "date") {
          this.$set(this.search, option.model, {});
        } else if (option.multiple) {
          this.$set(this.search, option.model, []);
        } else {
          this.$set(this.search, option.model, "");
        }
      });
    },
    async goSearch(search) {
      if (
        !this.$route.fullPath.includes(
          "/soldiers_plus/advanced_search/conscriptes/" + JSON.stringify(search)
        )
      ) {
        this.goThere(
          "/soldiers_plus/advanced_search/conscriptes/" + JSON.stringify(search)
        );
      }
    },
    selectAll() {
      this.headersSelected = [...basicHeaders, ...this.result.headers];
    }
  },
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
  }
};
</script>
