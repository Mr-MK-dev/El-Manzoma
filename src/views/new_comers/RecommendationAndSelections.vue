<template>
  <div class="SMRE">
    <editor-dialog-bulider
      :title="'عملية الإستبعاد'"
      :open="showRemoveDialog"
      :loading="searchLoading"
      :fields="removeData"
      :data="removedItem"
      @on-close="showRemoveDialog = false"
      @on-submit="actionExclusion(removedItem)"
    >
    </editor-dialog-bulider>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :clearOption="true"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في توصيات الانتقاءات "
      addBtnTitle="إضافة توصية"
    />

    <v-card>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          v-if="mainTable.items.length > 0"
          @click="getDuplicates()"
          large
          color="primary"
          v-text="'عرض التكرار'"
        ></v-btn>

        <v-btn
          class="px-6"
          v-if="mainTable.items.length > 0 && isAdmin()"
          @click="showExclusion()"
          large
          color="primary"
          v-text="'عرض المستبعد'"
        ></v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          @click="perpareWeaponLatter()"
          large
          color="primary"
          v-text="' ارسال مكاتبة للاسحلة المطلوبة'"
        ></v-btn>
        <v-btn
          class="px-6"
          @click="perpareOfficerLatter()"
          large
          color="primary"
          v-text="' ارسال مكاتبة لتوصيات الترشيح المطلوبة'"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="weaponLatterTable.isDisplayed">
      <table-bulider
        :headers="mainTable.headers"
        :printer="weaponLatterTable.printer"
        :items="weaponLatterTable.items"
        :title="'التوصيات التي جاهزة لطباعة مكاتبة'"
        :wordFile="'/new_commers/WeaponRecommandationLatter'"
        @fileIsOpened="handelWeaponFileIsOpened()"
      >
        <template v-slot:item.CertificationText="{ item }">
          <v-chip
            :disabled="!isAdmin()"
            @click="actionCertificatie(item)"
            :color="item.color"
          >
            {{ item.Certification }}
          </v-chip>
        </template>
        <template v-slot:item.ExclusionText="{ item }">
          <v-chip
            :disabled="!isAdmin()"
            @click="actionRemove(item)"
            :color="item.colorExclusion"
          >
            {{ item.isExclusion }}
          </v-chip>
        </template>
        <template v-slot:item.officerLatterHasSentText="{ item }">
          <v-chip :color="item.officerLatterHasSent ? 'success' : 'gray'">
            {{ item.officerLatterHasSentText }}
          </v-chip>
        </template>
        <template v-slot:item.weaponLatterHasSentText="{ item }">
          <v-chip :color="item.weaponLatterHasSent ? 'success' : 'gray'">
            {{ item.weaponLatterHasSentText }}
          </v-chip>
        </template>
      </table-bulider>
    </v-dialog>

    <v-dialog v-model="officeLatterTable.isDisplayed">
      <table-bulider
        :headers="mainTable.headers"
        :printer="officeLatterTable.printer"
        :items="officeLatterTable.items"
        :title="'التوصيات التي جاهزة لطباعة مكاتبة'"
        :wordFile="'/new_commers/OfficedRecommandationLatter'"
        @fileIsOpened="handelOfficerFileIsOpened()"
      >
        <template v-slot:item.CertificationText="{ item }">
          <v-chip
            :disabled="!isAdmin()"
            @click="actionCertificatie(item)"
            :color="item.color"
          >
            {{ item.Certification }}
          </v-chip>
        </template>
        <template v-slot:item.ExclusionText="{ item }">
          <v-chip
            :disabled="!isAdmin()"
            @click="actionRemove(item)"
            :color="item.colorExclusion"
          >
            {{ item.isExclusion }}
          </v-chip>
        </template>
        <template v-slot:item.officerLatterHasSentText="{ item }">
          <v-chip :color="item.officerLatterHasSent ? 'success' : 'gray'">
            {{ item.officerLatterHasSentText }}
          </v-chip>
        </template>
        <template v-slot:item.weaponLatterHasSentText="{ item }">
          <v-chip :color="item.weaponLatterHasSent ? 'success' : 'gray'">
            {{ item.weaponLatterHasSentText }}
          </v-chip>
        </template>
      </table-bulider>
    </v-dialog>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
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
            icon
            v-if="isAdmin()"
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-if="isAdmin()" v-slot:item.Author="{ item }">
        {{ item.user.realName }}
      </template>

      <template v-slot:item.CertificationText="{ item }">
        <v-chip
          :disabled="!isAdmin()"
          @click="actionCertificatie(item)"
          :color="item.color"
        >
          {{ item.Certification }}
        </v-chip>
      </template>
      <template v-slot:item.ExclusionText="{ item }">
        <v-chip
          :disabled="!isAdmin()"
          @click="actionRemove(item)"
          :color="item.colorExclusion"
        >
          {{ item.isExclusion }}
        </v-chip>
      </template>

      <template v-slot:item.willContinuoText="{ item }">
        <v-chip
          :disabled="!isAdmin()"
          @click="actionChangeWillContinuo(item)"
          :color="item.willContinuoColor"
        >
          {{ item.willContinuoText }}
        </v-chip>
      </template>

      <template v-slot:item.officerLatterHasSentText="{ item }">
        <v-chip :color="item.officerLatterHasSent ? 'success' : 'gray'">
          {{ item.officerLatterHasSentText }}
        </v-chip>
      </template>
      <template v-slot:item.weaponLatterHasSentText="{ item }">
        <v-chip :color="item.weaponLatterHasSent ? 'success' : 'gray'">
          {{ item.weaponLatterHasSentText }}
        </v-chip>
      </template>
    </table-bulider>
    <v-dialog persistent v-model="DuplicatationsTable.isDisplayed" scrollable>
      <v-card>
        <v-btn @click="DuplicatationsTable.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <table-bulider
          :headers="DuplicatationsTable.headers"
          :printer="DuplicatationsTable.printer"
          :items="DuplicatationsTable.items"
          :title="'التوصيات للمكررة للنفس الشخص'"
        >
          <template v-slot:item.tripleNo="{ item }">
            <v-chip :color="item.color">
              {{ item.tripleNo }}
            </v-chip>
          </template>

          <template v-slot:item.officerLatterHasSentText="{ item }">
            <v-chip :color="item.officerLatterHasSent ? 'success' : 'gray'">
              {{ item.officerLatterHasSentText }}
            </v-chip>
          </template>
          <template v-slot:item.weaponLatterHasSentText="{ item }">
            <v-chip :color="item.weaponLatterHasSent ? 'success' : 'gray'">
              {{ item.weaponLatterHasSentText }}
            </v-chip>
          </template>
          <template
            v-if="isAdmin() || hasEditAccess()"
            v-slot:item.editor="{ item }"
          >
            <v-chip class="transparent">
              <v-btn icon @click="actionEdit(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                v-if="isAdmin()"
                @click="actionDelete(item)"
                color="error"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-chip>
          </template>
          <template v-if="isAdmin()" v-slot:item.Author="{ item }">
            {{ item.user.realName }}
          </template>
          <template v-slot:item.CertificationText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionCertificatie(item)"
              :color="item.isCertificated ? 'success' : 'gray'"
            >
              {{ item.Certification }}
            </v-chip>
          </template>
          <template v-slot:item.ExclusionText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionRemove(item)"
              :color="item.Exclusion ? 'error' : 'gray'"
            >
              {{ item.isExclusion }}
            </v-chip>
          </template>
        </table-bulider>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="ExclusionTable.isDisplayed" scrollable>
      <v-card>
        <v-btn @click="ExclusionTable.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <table-bulider
          :headers="ExclusionTable.headers"
          :printer="ExclusionTable.printer"
          :items="ExclusionTable.items"
          :title="'قائمة المستبعدين'"
        >
          <template v-slot:item.actions="{ item }" :disabled="!isAdmin()">
            <v-chip class="transparent">
              <v-btn icon @click="actionEdit(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-chip>
          </template>
          <template v-slot:item.ID="{ item }">
            <v-chip
              :color="item.color"
              :to="`/soldiers_plus/${item.ID}`"
              @click.right="copyText(item.ID)"
            >
              {{ item.ID }}
            </v-chip>
          </template>

          <template v-slot:item.editor="{ item }">
            <v-chip class="transparent">
              <v-btn icon @click="actionEdit(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-chip>
          </template>
          <template v-slot:item.CertificationText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionCertificatie(item)"
              :color="item.color"
            >
              {{ item.Certification }}
            </v-chip>
          </template>
          <template v-slot:item.ExclusionText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionExclusion(item)"
              :color="item.colorExclusion"
            >
              {{ item.isExclusion }}
            </v-chip>
          </template>
        </table-bulider>
      </v-card>
    </v-dialog>

    <editor-dialog-bulider
      title="إضافة توصية"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="Recommandation"
      @on-submit="saveItem()"
      @updateValue="checkCenter()"
    />
  </div>
</template>

<style>
.SMRE table > tbody > tr > td:nth-child(13) {
  width: 311px;
  display: flex;
  align-items: center;
}
</style>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "RecommendationAndSelections",

  mounted() {
    this.init();
  },
  watch: {
    "Recommandation.WeaponRecommendation"(v) {
      this.Recommandation.weaponRecommendations_1 = v;
    },
    "Recommandation.KnowledgeLevel"(v) {
      this.selects.College.data = this.selects.allColleges.data.filter(
        ele => ele.KnowledgeLevel == v
      );
    },
    "Recommandation.OfficerSoldierStatus"(v) {
      if (v == "ظابط") {
        this.mainTable.headers.find(
          ele => ele.value == "OfficerSoldierRecommendation"
        ).inModel = true;
      } else {
        this.mainTable.headers.find(
          ele => ele.value == "OfficerSoldierRecommendation"
        ).inModel = false;
      }
    }
  },
  data: () => ({
    showRemoveDialog: false,
    removedItem: {},
    isRemovedData: {},
    removeData: [
      {
        text: "سبب الإستبعاد",
        value: "ExclusionNotes",
        searchValue: "ExclusionNotes",
        sortable: true,
        type: "textarea",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    DuplicatationsTable: {},
    Exclusions: [],
    ExclusionTable: {},

    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Recommandation: {
      isCertificated: false,
      Exclusion: false
    },
    weaponLatterTable: {
      isDisplayed: false,
      items: [],
      printer: {}
    },
    officeLatterTable: {
      isDisplayed: false,
      items: [],
      printer: {}
    },
    mainTable: {
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
          required: true,
          sort: 1
        },
        {
          text: "الرقم الثلاثي",
          value: "tripleNo",
          searchValue: "tripleNo",
          sortable: true,
          type: "tribleNum",
          inSearch: false,
          inTable: true,
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
          inSearch: false,
          inTable: true,
          inModel: true,
          required: false,
          sort: 1
        },

        {
          text: "المنطقة",
          value: "RecuRigion",
          searchValue: "RecuRigion",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          notMultipleInModel: true,

          inTable: true,
          inModel: true,
          required: false,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          notMultipleInModel: true,

          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "Government",
          searchValue: "Government",
          sortable: true,
          type: "text",
          inSearch: false,
          multiple: false,
          inTable: true,
          inModel: true,
          required: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Category",
          searchValue: "Category",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          notMultipleInModel: true,

          inTable: true,
          inModel: true,
          required: false,
          sort: 1
        },
        // {
        //   text: "التخصص",
        //   value: "Specialization",
        //   searchValue: "Specialization",
        //   sortable: true,
        //   type: "select",
        //   inSearch: true,
        //   multiple: false,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // },
        {
          text: "الموصي",
          value: "Recommender",
          searchValue: "Recommender",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "الموصي الفرعي",
          value: "SecondRecommender",
          searchValue: "SecondRecommender",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },

        {
          text: "تم التصديق ؟",
          value: "CertificationText",
          searchValue: "isCertificated",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تم الإستبعاد ؟",
          value: "ExclusionText",
          searchValue: "Exclusion",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          forAdmin: true,
          sort: 1
        },
        {
          text: "المصدق",
          value: "Certificator",
          searchValue: "Certificator",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,
          required: true,

          sort: 3
        },
        {
          text: "ملاحظات طبية ",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الترشيح",
          value: "OfficerSoldierStatus",
          searchValue: "OfficerSoldierStatus",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "المطلوب (الدرجة)",
          value: "OfficerSoldierRecommendation",
          searchValue: "OfficerSoldierRecommendation",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: " المطلوب (السلاح)",
          value: "WeaponRecommendation",
          searchValue: "WeaponRecommendation",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },

        {
          text: "رغية اولي",
          value: "weaponRecommendations",
          searchValue: "weaponRecommendations_1",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "رغبة ثانية",
          value: "weaponRecommendations",
          searchValue: "weaponRecommendations_2",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "رغبة ثالثة",
          value: "weaponRecommendations",
          searchValue: "weaponRecommendations_3",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "الرغبات ",
          value: "weaponRecommendations",
          searchValue: "weaponRecommendations",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: " نتيجة الانتقاء",
          value: "WeaponResult",
          searchValue: "WeaponResult",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "استمرار التوصية بوحدة ؟",
          value: "willContinuoText",
          searchValue: "willContinuoText",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: " نتيجة (الدرجة)",
          value: "OfficerSoldierResult",
          searchValue: "OfficerSoldierResult",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "درجة التوصيه",
          value: "DegreeOfImportance",
          searchValue: "DegreeOfImportance",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 5
        },
        {
          text: "تم ارسال مكاتبة بشان الترشيح؟",
          value: "officerLatterHasSentText",
          searchValue: "officerLatterHasSent",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تم ارسال مكاتبة بشان السلاح ؟",
          value: "weaponLatterHasSentText",
          searchValue: "weaponLatterHasSent",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "ملاحظات عامه",
          value: "GeneralNotes",
          searchValue: "GeneralNotes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المؤهل المدني",
          value: "College",
          searchValue: "College",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          notMultipleInModel: true,

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
          inSearch: true,
          multiple: true,
          notMultipleInModel: true,

          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "",
          value: "Author",
          searchValue: "Author",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 5
        },
        {
          text: "تاريخ الإضافة",
          value: "DateAdded",
          searchValue: "DateAdded",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 5
        }
      ],
      printer: {},
      items: []
    },
    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      RecuRegion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      DegreeOfImportance: {
        text: "text",
        value: "text",
        data: ["هام", "هام جداً"]
      },
      Certificator: {
        table: "Certificators",
        text: "Name",
        value: "Name"
      },
      allColleges: {
        table: "Colleges",
        text: "Name",
        value: "Name"
      },
      College: {
        table: "Colleges",
        text: "Name",
        value: "Name"
      },
      Specialization: {
        table: "Specialization",
        text: "Specialization",
        value: "Specialization"
      },
      RecuRigion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      Category: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      WeaponResult: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      WeaponRecommendation: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
      },
      weaponRecommendations_1: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
      },
      weaponRecommendations_2: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
      },
      weaponRecommendations_3: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
      },
      OfficerSoldierResult: {
        data: constants.SoliderOfficer
      },
      OfficerSoldierRecommendation: {
        data: constants.SoliderOfficer
      },
      OfficerSoldierStatus: {
        data: constants.SoliderOfficer
      },
      isCertificated: {
        data: [
          {
            text: "تم التصديق",
            value: true
          },
          {
            text: "في الانتظار",
            value: false
          },
          {
            text: "الكل",
            value: null
          }
        ]
      },
      Exclusion: {
        data: [
          {
            text: "تم الإستبعاد",
            value: true
          },
          {
            text: "في الانتظار الإستبعاد",
            value: false
          },
          {
            text: "الكل",
            value: null
          }
        ]
      },
      advancedQuery: {
        data: [
          {
            text: "لم تسجل له نتيجة ترشيح",
            value: {
              OfficerSoldierResult: {
                $eq: null
              }
            }
          },
          {
            text: "لم تسجل له نتيجة سلاح",
            value: {
              WeaponResult: {
                $eq: null
              }
            }
          }
        ]
      }
    }
  }),

  methods: {
    async checkIsValidFromSystemControl() {
      let x = await this.api("global/get_one", {
        table: "SystemRules",
        where: { Key: "RecommendationsAndSelections" }
      });
      let data = x.data;
      console.log(data);
      return !data.Value;
    },
    actionRemove(item) {
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    showExclusion() {
      this.ExclusionTable = {
        ...this.mainTable,
        isDisplayed: true
      };

      this.ExclusionTable.headers.push({
        text: "سبب الإستبعاد",
        value: "ExclusionNotes",
        searchValue: "ExclusionNotes",
        sortable: true,
        type: "textarea",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      });
      let data = this.Exclusions;

      this.$set(this.ExclusionTable, "items", data);
    },

    getDuplicates() {
      let result = [],
        groupdata = lodash.groupBy(this.mainTable.items, ele => ele.tripleNo);

      let colors = [
        "accent",
        "secondary",
        "error",
        "info",
        "success",
        "warning",
        "white",
        "girly"
      ];

      Object.keys(groupdata).map((key, index) => {
        if (groupdata[key].length > 1) {
          result = [
            ...result,
            ...groupdata[key].map(ele => ({
              ...ele,
              color: colors[index % colors.length]
            }))
          ];
        }
      });
      this.DuplicatationsTable = {
        ...this.mainTable,
        isDisplayed: true
      };
      let data = result,
        printer = {
          cons: [
            ...data.map(ele => ({
              ...ele,
              Certification: ele.isCertificated
                ? "تم التصديق"
                : "في انتظار  التصديق",
              isCertificated: ele.isCertificated
                ? "تم التصديق"
                : "في انتظار  التصديق",
              color: ele.isCertificated ? "success" : "gray",
              isExclusion: ele.Exclusion
                ? "تم الإستبعاد"
                : "في انتظار  الإستبعاد",
              ExclusionText: ele.Exclusion
                ? "تم الإستبعاد"
                : "في انتظار  الإستبعاد",
              colorExclusion: ele.Exclusion ? "error" : "gray",
              weaponLatterHasSentText: ele.weaponLatterHasSent
                ? "تم الارسال"
                : "في انتظار  الارسال",
              officerLatterHasSentText: ele.officerLatterHasSent
                ? "تم الارسال"
                : "في انتظار  الارسال"
            }))
          ],
          excelKey: "cons",
          excelHeaders: this.DuplicatationsTable.headers.filter(f => f.inTable)
        };

      this.$set(this.DuplicatationsTable, "items", data);
      this.$set(this.DuplicatationsTable, "printer", printer);
    },

    handelWeaponFileIsOpened() {
      this.$confirm(`هل تم ارسال المكاتبة ؟ `, {
        title: ``
      })
        .then(async res => {
          if (res) {
            //
            await this.api(`global/queryRunners`, {
              query: `UPDATE [dbo].[RecommendationAndSelections] SET [weaponLatterHasSent]=1 WHERE [weaponLatterHasSent] = 0 or [weaponLatterHasSent] is NULL  AND [isCertificated] = 1`
            });
          }
          this.weaponLatterTable.isDisplayed = false;
          this.handleSearch(this.search);
        })
        .catch(e => {
          console.log(e);
        });
    },
    handelOfficerFileIsOpened() {
      this.$confirm(`هل تم ارسال المكاتبة ؟ `, {
        title: ``
      })
        .then(async res => {
          if (res) {
            //
            await this.api(`global/queryRunners`, {
              query: `UPDATE [dbo].[RecommendationAndSelections] SET [officerLatterHasSent]=1 WHERE [officerLatterHasSent] = 0 or [officerLatterHasSent] is NULL  AND [isCertificated] = 1`
            });
          }
          this.officeLatterTable.isDisplayed = false;
          this.handleSearch(this.search);
        })
        .catch(e => {
          console.log(e);
        });
    },
    perpareWeaponLatter() {
      this.weaponLatterTable.items = this.mainTable.items.filter(
        ele =>
          ele.isCertificated &&
          !ele.weaponLatterHasSent &&
          ele.WeaponRecommendation
      );
      this.weaponLatterTable.printer = {
        data: this.weaponLatterTable.items.map((ele, index) => ({
          ...ele,
          index: index + 1
        })),
        excelKey: "data",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable)
      };
      this.weaponLatterTable.isDisplayed = true;
    },
    perpareOfficerLatter() {
      this.officeLatterTable.items = this.mainTable.items.filter(
        ele =>
          ele.isCertificated &&
          !ele.officerLatterHasSent &&
          ele.OfficerSoldierRecommendation
      );
      this.officeLatterTable.printer = {
        data: this.officeLatterTable.items.map((ele, index) => ({
          ...ele,
          index: index + 1
        })),
        excelKey: "data",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable)
      };
      this.officeLatterTable.isDisplayed = true;
    },
    handleSearch(data) {
      if (!this.isAdmin()) {
        if (
          this.$store.state.currentUser.section.includes("new_comers_admin")
        ) {
          data = {
            ...data,
            $or: [
              { UserId: this.$store.state.currentUser.userId },
              {
                isCertificated: 1
              }
            ]
          };
        } else {
          data = {
            ...data,
            UserId: this.$store.state.currentUser.userId
          };
        }
      }
      if (!data.RecuStage) {
        return this.showError("يرجى إختيار المرحلة");
      }

      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
          ...data,
          ...(data.advancedQuery || {}),
          advancedQuery: null
        },
        likes = ["ID"],
        multi = [
          "College",
          "Certificator",
          "Category",
          "KnowledgeLevel",
          "RecuRigion",
          "RecuStage"
        ],
        dates = ["DateAdded"];
      where = this.mapToQuery(where, likes, multi, dates);

      this.api("global/get_all", {
        table: "RecommendationAndSelections",
        where,
        include: [
          {
            model: "users"
          }
        ]
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              Certification: ele.isCertificated
                ? "تم التصديق"
                : "في انتظار  التصديق",
              CertificationText: ele.isCertificated
                ? "تم التصديق"
                : "في انتظار  التصديق",
              ExclusionText: ele.Exclusion
                ? "تم الإستبعاد"
                : "في انتظار  الإستبعاد",
              Author: ele.user.realName,
              willContinuoText: ele.willContinuo ? "تم " : " انتظار  التصديق",
              willContinuoColor: ele.willContinuo ? "success" : "gray",
              color: ele.isCertificated ? "success" : "gray",
              isExclusion: ele.Exclusion
                ? "تم الإستبعاد"
                : "في انتظار  الإستبعاد",
              colorExclusion: ele.Exclusion ? "error" : "gray",
              weaponLatterHasSentText: ele.weaponLatterHasSent
                ? "تم الارسال"
                : "في انتظار  الارسال",
              officerLatterHasSentText: ele.officerLatterHasSent
                ? "تم الارسال"
                : "في انتظار  الارسال"
            })),
            printer = {
              cons: [...data.filter(e => !e.Exclusion)],
              excelKey: "cons",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          this.$set(
            this,
            "Exclusions",
            data.filter(e => e.Exclusion)
          );

          this.$set(
            this.mainTable,
            "items",
            data.filter(e => !e.Exclusion)
          );
          this.$set(this.mainTable, "printer", printer);
          if (this.DuplicatationsTable.isDisplayed) {
            this.getDuplicates();
          }
          if (this.ExclusionTable.isDisplayed) {
            this.showExclusion();
          }
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
      if (!this.isAdmin() && (await this.checkIsValidFromSystemControl())) {
        return this.showError("تم إنتهاء المدة المحددة لإضافة وتعديل توصية");
      }
      this.$set(this, "item", {});
      this.$set(this, "Recommandation", { isEdit: false });
      this.$set(this, "showAddDialog", true);
    },

    async actionEdit(item) {
      const needs = item.weaponRecommendations.split("/");
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Recommandation", {
        ...item,
        isEdit: true,
        weaponRecommendations_1: needs[0] || "",
        weaponRecommendations_2: needs[1] || "",
        weaponRecommendations_3: needs[2] || ""
      });
    },

    actionCertificatie(item) {
      if (!this.isAdmin()) {
        this.showError("يجب ان يصدق رئيس الفرع");

        return;
      }

      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (!item.isCertificated) {
              await this.api(`global/update_one`, {
                table: "RecommendationAndSelections",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isCertificated: false
                }
              });
            }

            await this.api(`global/update_one`, {
              table: "RecommendationAndSelections",
              where: {
                ID_KEY: item.ID_KEY
              },
              update: {
                isCertificated: !item.isCertificated
              }
            });
            this.handleSearch(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    actionExclusion(item) {
      if (!this.isAdmin()) {
        this.showError("يجب ان يصدق رئيس الفرع");

        return;
      }

      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (!item.Exclusion) {
              await this.api(`global/update_one`, {
                table: "RecommendationAndSelections",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  Exclusion: false
                }
              });
              this.$set(this, "showRemoveDialog", false);
            }

            await this.api(`global/update_one`, {
              table: "RecommendationAndSelections",
              where: {
                ID_KEY: item.ID_KEY
              },
              update: {
                Exclusion: !item.Exclusion,

                ExclusionNotes: this.removedItem.ExclusionNotes
              }
            });
            this.handleSearch(this.search);
            this.$set(this, "showRemoveDialog", false);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    actionChangeWillContinuo(item) {
      if (!this.isAdmin()) {
        this.showError("يجب ان يصدق رئيس الفرع");

        return;
      }

      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (!item.isCertificated) {
              await this.api(`global/update_one`, {
                table: "RecommendationAndSelections",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  willContinuo: false
                }
              });
            }

            await this.api(`global/update_one`, {
              table: "RecommendationAndSelections",
              where: {
                ID_KEY: item.ID_KEY
              },
              update: {
                willContinuo: !item.willContinuo
              }
            });
            this.handleSearch(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    async checkCenter() {
      if (this.Recommandation.tripleNo?.split("-")[1]) {
        let center = await this.apiSilent("global/queryRunners", {
          query: `SELECT City  from City c join Centre c2 on c2.CityID  = c.CityID  WHERE c2.CentreID  = ${
            this.Recommandation.tripleNo?.split("-")[1]
          }`
        });
        if (center.data[0] && center.data[0].City) {
          this.$set(this.Recommandation, "Government", center.data[0].City);
        }
      }
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد الحذف`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "RecommendationAndSelections",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.handleSearch({});
        }
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        this.Recommandation = {
          ...this.Recommandation,
          weaponRecommendations: `${this.Recommandation
            .weaponRecommendations_1 || ""}/${this.Recommandation
            .weaponRecommendations_2 || "_"}/${this.Recommandation
            .weaponRecommendations_3 || "_"}`
        };
        if (!this.Recommandation.DateAdded)
          this.Recommandation.DateAdded = new Date().toISOString().slice(0, 10);

        saveItem = await this.api(
          !this.Recommandation.ID_KEY
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "RecommendationAndSelections",
            where: this.Recommandation.ID_KEY
              ? {
                  ID_KEY: this.Recommandation.ID_KEY
                }
              : {
                  ...this.Recommandation,
                  UserId: this.$store.state.currentUser.userId
                },
            update: {
              ...this.Recommandation
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.handleSearch({ RecuStage: [this.Recommandation.RecuStage] });
          this.Recommandation = {};
          this.showAddDialog = false;
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
