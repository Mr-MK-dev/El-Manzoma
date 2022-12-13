<template>
  <div>
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
    <div>
      <search-bulider
        :fields="recommandationsTable.headers"
        :selects="selects"
        @on-search="findItems"
        @on-add="actionAdd"
        :clearOption="true"
        title="بحث متقدم فالتوصيات"
        addBtnTitle="إضافة توصية جديده"
      />
      <v-card>
        <v-card-actions class="px-4 py-4">
          <v-btn
            class="px-6"
            v-if="CertificationTable.items.length > 0"
            @click="getCertificates()"
            large
            color="primary"
            v-text="'عرض المختارين للتصديق'"
          ></v-btn>
          <v-btn
            class="px-6"
            v-if="recommandationsTable.items.length > 0"
            @click="getDuplicates()"
            large
            color="primary"
            v-text="'عرض التكرار'"
          ></v-btn>

          <v-btn
            class="px-6"
            v-if="recommandationsTable.items.length > 0 && isAdmin()"
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
            @click="pullDateFromSelections()"
            large
            color="primary"
            v-text="'استدعاء البيانات من الانتقاءات'"
          ></v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="mt-8">
        <table-bulider
          :headers="recommandationsTable.headers"
          :printer="recommandationsTable.printer"
          :items="recommandationsTable.items"
          :wordFile="'/e7tyat/all'"
          @fileIsOpened="handelFileIsOpened()"
          :title="'التوصيات'"
        >
          <template v-slot:item.ID="{ item }">
            <v-chip
              color="transparentrecommandationsTable"
              :to="`/soldiers_plus/${item.ID}`"
              @click.right="copyText(item.ID)"
            >
              {{ item.ID }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-chip
              v-if="isAdmin() || hasEditAccess() || checkIsValid"
              class="transparent"
            >
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

          <template v-if="isAdmin()" v-slot:item.Author="{ item }">
            {{ item.user.realName }}
          </template>

          <template v-slot:item.ToCertification="{ item }">
            <v-chip
              icon
              :disabled="!isAdmin()"
              @click="actionAddtoCertificateTable(item)"
              :color="item.color"
            >
              <v-icon>mdi-account-plus</v-icon>
            </v-chip>
          </template>
          <template v-slot:item.AddUnit="{ item }">
            <v-chip
              icon
              :disabled="!$store.state.currentUser.canEdit"
              @click="actionAddFinalUnit(item)"
            >
              <v-icon>mdi-account-plus</v-icon>
            </v-chip>
          </template>
          <template v-slot:item.CertificationText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionCertificatie(item)"
              :color="item.color"
            >
              {{ item.CertificationText }}
            </v-chip>
          </template>
          <template v-slot:item.ExclusionText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionRemove(item)"
              :color="item.colorExclusion"
            >
              {{ item.ExclusionText }}
            </v-chip>
          </template>
          <template v-slot:item.isUnitFollowText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionisUnitFollow(item)"
              :color="item.colorisUnitFollow"
            >
              {{ item.isUnitFollowText }}
            </v-chip>
          </template>
        </table-bulider>
      </v-card>

      <v-dialog persistent v-model="CertificationTable.isDisplayed" scrollable>
        <v-card>
          <v-card-actions class="px-4 py-4">
            <v-btn
              class="px-6"
              @click="CertifyAll()"
              large
              color="primary"
              v-text="'تاكيد التصديق'"
            ></v-btn>
          </v-card-actions>
          <v-btn @click="CertificationTable.isDisplayed = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <table-bulider
            :headers="CertificationTable.headers"
            :printer="CertificationTable.printer"
            :items="CertificationTable.items"
            :title="'المختار تصديقهم'"
          >
            <template v-slot:item.ID="{ item }">
              <v-chip
                :color="item.color"
                :to="`/soldiers_plus/${item.ID}`"
                @click.right="copyText(item.ID)"
              >
                {{ item.ID }}
              </v-chip>
            </template>
            <template v-slot:item.removeFromTable="{ item }">
              <v-chip
                icon
                color="transparent"
                @click="actionRemoveFromTable(item)"
              >
                <v-icon color="error">mdi-upload</v-icon>
              </v-chip>
            </template>
          </table-bulider>
        </v-card>
      </v-dialog>
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
            <template v-slot:item.ID="{ item }">
              <v-chip
                :color="item.color"
                :to="`/soldiers_plus/${item.ID}`"
                @click.right="copyText(item.ID)"
              >
                {{ item.ID }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-chip class="transparent" :disabled="!isAdmin()">
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
                {{ item.CertificationText }}
              </v-chip>
            </template>
            <template v-slot:item.ExclusionText="{ item }">
              <v-chip
                :disabled="!isAdmin()"
                @click="actionRemove(item)"
                :color="item.colorExclusion"
              >
                {{ item.ExclusionText }}
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
            <template v-slot:item.ID="{ item }">
              <v-chip
                :color="item.color"
                :to="`/soldiers_plus/${item.ID}`"
                @click.right="copyText(item.ID)"
              >
                {{ item.ID }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }" :disabled="!isAdmin()">
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
                {{ item.CertificationText }}
              </v-chip>
            </template>
            <template v-slot:item.ExclusionText="{ item }">
              <v-chip
                :disabled="!isAdmin()"
                @click="actionExclusion(item)"
                :color="item.colorExclusion"
              >
                {{ item.ExclusionText }}
              </v-chip>
            </template>
          </table-bulider>
        </v-card>
      </v-dialog>
      <editor-dialog-bulider
        :title="''"
        :open="createdObject.model"
        :loading="searchLoading"
        :fields="recommandationsTable.headers"
        :selects="selects"
        :data="Recommandation"
        @on-submit="saveItem()"
        @trible-num-changed="checkTribleNum()"
        @updateValue="checkCenter()"
        @on-close="createdObject.model = false"
      >
      </editor-dialog-bulider>
      <editor-dialog-bulider
        :title="''"
        :open="addUnitObject.model"
        :loading="searchLoading"
        :fields="addUnitHeaders"
        :selects="selects"
        :data="addunit"
        @on-submit="saveUnit()"
        @on-close="addUnitObject.model = false"
      >
      </editor-dialog-bulider>
    </div>
  </div>
</template>

<style>
body .v-application .v-chip.no-chip {
  display: flex !important;
}
.v-data-table-header th .v-chip--label {
  width: 150px;
}
.v-data-table-header th .v-chip--label :nth-child(3) {
  width: 235px !important;
}
.v-data-table-header th .v-chip--label :nth-child(6) {
  width: 235px !important;
}
</style>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "recommandations",
  mounted() {
    this.init();
    // this.checkIsValidFromSystemControl();
  },
  data: () => ({
    showRemoveDialog: false,
    removedItem: {},
    addunit: {},
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

    search: {},
    Certificator: [],
    passwordDialog: {
      password: "",
      model: true,
      passwordRules: [v => !!v || "يجب إدخال كلمة السر"]
    },
    valid: true,

    Recommandation: {},
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    addUnitObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {},
    searchLoading: false,
    addUnitHeaders: [
      {
        text: "الرقم العسكري",
        value: "ID",
        searchValue: "ID",
        sortable: true,
        type: "text",
        inSearch: true,
        readOnly: true,
        required: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الاسم",
        value: "Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        readOnly: false,
        sort: 1
      },
      {
        text: "الوحدة",
        value: "Unit.Unit",
        searchValue: "FinalUnitID",
        sortable: true,
        type: "select",
        required: true,
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 2
      }
    ],
    recommandationsTable: {
      headers: [
        {
          text: "",
          value: "actions",
          searchValue: "actions",
          sortable: false,
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 0
        },
        {
          text: "إضافة الوحدة النهائية",
          value: "AddUnit",
          searchValue: "AddUnit",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 5
        },
        {
          text: "إضافة الي جدول التصديق",
          value: "ToCertification",
          searchValue: "ToCertification",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 5
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          readOnly: false,
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
          required: true,
          inModel: true,
          readOnly: false,
          sort: 1
        },
        {
          text: "الموصي",
          value: "Recommender",
          searchValue: "Recommender",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 4
        },
        {
          text: "الفئة",
          value: "Category",
          searchValue: "Category",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,

          sort: 4
        },
        {
          text: "الموصي الفرعي",
          value: "SecondRecommender",
          searchValue: "SecondRecommender",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 4
        },
        {
          text: "المصدق",
          value: "Certificator",
          searchValue: "Certificator",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          required: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,

          sort: 3
        },
        {
          text: "حالة التصديق",
          value: "CertificationText",
          searchValue: "Certification",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 5
        },

        {
          text: "حالة الإستبعاد",
          value: "ExclusionText",
          searchValue: "Exclusion",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          forAdmin: true,
          sort: 5
        },
        {
          text: "متابعة الوحدة",
          value: "isUnitFollowText",
          searchValue: "isUnitFollow",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          forAdmin: true,
          sort: 5
        },

        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,

          sort: 2
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
          text: "المحافظة",
          value: "City.City",
          searchValue: "CityID",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: false,
          inTable: false,
          inModel: false,
          required: false,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "Government",
          searchValue: "Government",
          sortable: true,
          type: "text",
          inSearch: true,
          multiple: false,
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
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          required: false,
          inTable: true,
          inModel: true,
          sort: 5
        },
        {
          text: "الرغبة الاولى",
          value: "firstDesire",
          searchValue: "firstDesire",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 2
        },
        {
          text: "الرغبة الثانيه",
          value: "secondDesire",
          searchValue: "secondDesire",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 2
        },
        {
          text: "الرغبة الثالثه",
          value: "thirdDesire",
          searchValue: "thirdDesire",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 2
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          multiple: true,
          notMultipleInModel: true,

          sort: 5
        },
        {
          text: "النتيجة النهائية للوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "FinalUnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          required: false,
          multiple: false,
          notMultipleInModel: false,
          readOnly: true,
          sort: 5
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
      items: [],
      printer: {}
    },
    CertificationTable: {
      isDisplayed: false,
      headers: [
        {
          text: "",
          value: "actions",
          searchValue: "actions",
          sortable: false,
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 0
        },
        {
          text: "حذف من الجدول",
          value: "removeFromTable",
          searchValue: "removeFromTable",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          readOnly: false,
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
          required: true,
          inModel: true,
          readOnly: false,
          sort: 1
        },
        {
          text: "الموصي",
          value: "Recommender",
          searchValue: "Recommender",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 4
        },
        {
          text: "الفئة",
          value: "Category",
          searchValue: "Category",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,

          sort: 4
        },
        {
          text: "الموصي الفرعي",
          value: "SecondRecommender",
          searchValue: "SecondRecommender",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 4
        },
        {
          text: "المصدق",
          value: "Certificator",
          searchValue: "Certificator",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          required: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,

          sort: 3
        },
        {
          text: "متابعة الوحدة",
          value: "isUnitFollowText",
          searchValue: "isUnitFollow",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          forAdmin: true,
          sort: 5
        },

        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,

          sort: 2
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
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          required: false,
          inTable: true,
          inModel: true,
          sort: 5
        },
        {
          text: "الرغبة الاولى",
          value: "firstDesire",
          searchValue: "firstDesire",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 2
        },
        {
          text: "الرغبة الثانيه",
          value: "secondDesire",
          searchValue: "secondDesire",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 2
        },
        {
          text: "الرغبة الثالثه",
          value: "thirdDesire",
          searchValue: "thirdDesire",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 2
        },
        {
          text: "النتيجة النهائية للوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "FinalUnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          required: false,
          multiple: false,
          notMultipleInModel: false,
          readOnly: true,
          sort: 5
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
      items: [],
      printer: {}
    },
    DuplicatationsTable: {},
    Exclusions: [],
    ExclusionsPrinter: {},

    componentName: "recommandations",
    selects: {
      Certification: {
        data: [
          {
            text: "تم التصديق",
            value: true
          },
          {
            text: "لم يتم التصديق",
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
            text: "لم يتم الإستبعاد",
            value: false
          },
          {
            text: "الكل",
            value: null
          }
        ]
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      FinalUnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      FinalResult: {
        table: "Unit",
        value: "Unit",
        text: "Unit"
      },
      CityID: {
        table: "City",
        value: "CityID",
        text: "City"
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      Certificator: {
        table: "Certificators",
        text: "Name",
        value: "Name"
      },
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
      College: {
        table: "Colleges",
        text: "Name",
        value: "Name"
      },
      RecuRigion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      DegreeOfImportance: {
        text: "text",
        value: "text",
        data: ["هام", "هام جداً"]
      }
    },
    ExclusionTable: {},
    checkIsValid: 0
  }),
  watch: {
    "Recommandation.UnitID"(v) {
      if (v == 0) {
        this.recommandationsTable.headers.find(
          ele => ele.value == "Notes"
        ).required = true;
      } else {
        this.recommandationsTable.headers.find(
          ele => ele.value == "Notes"
        ).required = false;
      }
    },
    "Recommandation.ID"(v) {
      if (v.length == 13) {
        this.findSolider({ ID: v });
      }
    }
  },
  methods: {
    async checkIsValidFromSystemControl() {
      let x = await this.api("global/get_one", {
        table: "SystemRules",
        where: { Key: "Recommendations" }
      });
      let data = x.data;
      console.log(data);
      return !data.Value;
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
    actionRemove(item) {
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    showExclusion() {
      this.ExclusionTable = {
        ...this.recommandationsTable,
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
      this.$set(this.ExclusionTable, "printer", this.ExclusionsPrinter);
    },
    getCertificates() {
      this.CertificationTable.isDisplayed = true;
    },
    getDuplicates() {
      let result = [],
        groupdata = lodash.groupBy(
          this.recommandationsTable.items,
          ele => ele.tripleNo
        );

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
        ...this.recommandationsTable,
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
              CertificationText: ele.isCertificated
                ? "تم التصديق"
                : "في انتظار  التصديق",
              Author: this.$store.state.currentUser,
              color: ele.isCertificated ? "success" : "gray",
              Exclusion: ele.isExclusion
                ? "تم الإستبعاد"
                : "في انتظار  الإستبعاد",
              ExclusionText: ele.isExclusion
                ? "تم الإستبعاد"
                : "في انتظار  الإستبعاد",
              colorExclusion: ele.isExclusion ? "error" : "gray",
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
    GetCityID(tripleNo) {
      let splittedValue = tripleNo.split("-")[1];

      let CityID =
        this.selects.CityID.data.find(
          ele =>
            ele.CityID ==
              this.selects.CentreID.data.find(
                ele => ele.CentreID == splittedValue
              )?.CityID || 0
        )?.CityID || 0;
      return CityID;
    },
    actionRemoveFromTable(item) {
      this.$set(
        this.CertificationTable,
        "items",
        this.CertificationTable.items.filter(ele => ele.ID_KEY != item.ID_KEY)
      );
    },
    async pullDateFromSelections() {
      this.searchLoading = true;
      let where = {
        isCertificated: true,
        Exclusion: false,
        WeaponResult: {
          $ne: null
        }
      };

      let data = await this.api("global/get_all", {
        table: "RecommendationAndSelections",
        where,
        include: []
      });
      data = data.data.filter(
        ele => ele.WeaponResult.includes("قوات حرس الحدود") && ele.willContinuo
      );
      data.forEach(element => {
        delete element.ID_KEY;
        this.api("global/get_one", {
          table: "Recommendations",
          where: {
            TripleNo: element.tripleNo
          },
          include: []
        }).then(ele => {
          if (!ele.data) {
            this.api("global/create_one", {
              table: "Recommendations",
              where: {
                ...element,
                TripleNo: element.tripleNo,
                Recommander: element.Recommender
              }
            });
          }
        });
      });
      setTimeout(() => {
        this.searchLoading = false;
        this.showSuccess("تم الاستدعاء بنجاح ");
      }, 2000);
    },

    getAllCertificators() {
      this.Certificator = this.api("global/get_one", {
        table: "Certificators",
        where
      });
    },
    handelFileIsOpened() {
      // console.log('xx');
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Recommendations",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({});
        }
      });
    },
    checkTribleNum() {
      if (this.Recommandation.tripleNo) {
        this.findSolider({
          TripleNo: this.Recommandation.tripleNo
        });
      }
    },
    async checkValidCertification(item) {
      let inValid = await this.api(`global/get_all`, {
        table: "Recommendations",
        where: {
          tripleNo: item.tripleNo,
          Certification: true,
          ID_KEY: {
            $ne: item.ID_KEY
          }
        }
      });
      console.log("inValid", inValid);
      if (inValid.data.length) {
        return false;
      } else {
        return true;
      }
    },
    async checkValidExclusion(item) {
      let inValid = await this.api(`global/get_all`, {
        table: "Recommendations",
        where: {
          tripleNo: item.tripleNo,
          Exclusion: true,
          ID_KEY: {
            $ne: item.ID_KEY
          }
        }
      });
      if (inValid.data.length) {
        return false;
      } else {
        return true;
      }
    },

    findSolider(where) {
      this.api("global/get_one", {
        table: "Soldier",
        where
      })
        .then(x => {
          if (x.data) {
            this.$set(this.Recommandation, "Name", x.data.Name);
            this.$set(this.Recommandation, "ID", x.data.ID);
            this.$set(this.Recommandation, "RecuStage", x.data.RecuStage);
            this.$set(this.Recommandation, "tripleNo", x.data.TripleNo);
            this.$set(this.Recommandation, "RecuRigion", x.data.RecuRegion);
            this.$set(
              this.Recommandation,
              "KnowledgeLevel",
              x.data.KnowledgeLevel
            );
            this.$set(this.Recommandation, "College", x.data.College);
            this.$set(
              this.Recommandation,
              "Specialization",
              x.data.Specialization
            );
          } else {
            this.showError("هذا الفرد غير مسجل لدينا");
          }
        })
        .catch(error => {})
        .finally(() => {});
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        if (this.Recommandation.isEdit) {
          saveItem = await this.api(`global/update_one`, {
            table: "Recommendations",
            where: {
              ID_KEY: this.Recommandation.ID_KEY
            },
            update: {
              ...this.Recommandation,
              CityID: this.GetCityID(this.Recommandation.tripleNo),
              ID_KEY: undefined,
              Certification:
                this.Recommandation.color != "success" ? false : true,
              Exclusion:
                this.Recommandation.colorExclusion != "error" ? false : true,
              isUnitFollow:
                this.Recommandation.colorisUnitFollow != "success"
                  ? false
                  : true
            }
          });
        } else {
          this.Recommandation.DateAdded = new Date().toISOString().slice(0, 10);
          saveItem = await this.api(`global/create_one`, {
            table: "Recommendations",
            where: {
              ...this.Recommandation,
              CityID: this.GetCityID(this.Recommandation.tripleNo),
              UserId: this.$store.state.currentUser.userId
            }
          });
        }

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({ RecuStage: [this.Recommandation.RecuStage] });
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
    async saveUnit(edirableFromTableItem) {
      if (!this.addunit.ID) {
        this.showError("لا يوجد رقم عسكري لهذه التوصيه");
        return;
      }
      let saveItem;
      try {
        saveItem = await this.api(`global/update_one`, {
          table: "Soldier",
          where: {
            ID: this.addunit.ID
          },
          update: {
            UnitID: this.addunit.FinalUnitID
          }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({ RecuStage: [this.search.RecuStage] });
          this.$set(this.addUnitObject, "model", false);
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.addUnitObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.addUnitObject, "loading", false);
      }
    },
    actionAddtoCertificateTable(item) {
      if (item.Certification) {
        this.showError("هذا الفرد مصدق بالفعل");
      } else if (this.CertificationTable.items.includes(item)) {
        this.showError("هذا الفرد موجود فالجدول بالفعل");
      } else {
        this.CertificationTable.items.push(item);
      }
    },
    actionAddFinalUnit(item) {
      this.$set(this.addUnitObject, "model", true);
      this.$set(this, "addunit", item);
    },
    async findItems(filters) {
      if (!this.isAdmin()) {
        if (
          // only new comers admin can see certified reccpmendations
          this.$store.state.currentUser.section.includes("new_comers_admin")
        ) {
          filters = {
            ...filters,
            $or: [
              { UserId: this.$store.state.currentUser.userId },
              {
                Certification: 1
              }
            ]
          };
        } else {
          filters = {
            ...filters,
            UserId: this.$store.state.currentUser.userId
          };
        }
      }
      if (!filters.RecuStage) {
        return this.showError("يرجى إختيار المرحلة");
      }

      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.search = filters;
      let where = {
          ...filters
        },
        likes = ["ID", "Recommender"],
        multi = [
          "College",
          "KnowledgeLevel",
          "RecuRigion",
          "UnitID",
          "Certificator",
          "Category",
          "RecuStage"
        ],
        dates = ["DateAdded"];

      this.api("global/get_all", {
        table: "Recommendations",
        include: [
          {
            model: "Unit"
          },
          {
            model: "City"
          },
          {
            model: "users"
          },
          {
            model: "Soldier",
            include: [
              {
                model: "City"
              },
              {
                model: "Unit"
              }
            ]
          }
        ],
        where: this.mapToQuery(where, likes, multi, dates)
      })
        .then(async x => {
          let data = x.data.map(ele => ({
              ...ele,
              FinalUnitID: ele.Soldier.UnitID,
              Name: ele.Soldier?.Name || ele.Name,
              tripleNo: ele.tripleNo || ele.Soldier?.TripleNo,
              Certification: ele.Certification,
              CertificationText: ele.Certification
                ? "تمت الموافقة"
                : "في انتظار الموافقة",
              Author: ele.user.realName,
              color: ele.Certification ? "success" : "gray",
              Exclusion: ele.Exclusion,
              ExclusionText: ele.Exclusion
                ? "تم الإستبعاد"
                : "لم يتم الإستبعاد",
              colorExclusion: ele.Exclusion ? "error" : "gray",
              isUnitFollow: ele.isUnitFollow,
              isUnitFollowText: ele.isUnitFollow
                ? "تم متابعة الوحدة"
                : "لم يتم متابعة الوحدة",
              colorisUnitFollow: ele.isUnitFollow ? "success" : "gray",
              RecuStage: ele.RecuStage || ele.Soldier?.RecuStage
            })),
            printer = {
              cons: [...data.filter(e => !e.Exclusion)],
              excelKey: "cons",
              excelHeaders: this.recommandationsTable.headers.filter(
                f => f.inTable
              )
            };
          this.$set(
            this,
            "Exclusions",
            data.filter(e => e.Exclusion)
          );

          this.$set(this, "ExclusionsPrinter", {
            cons: [...data.filter(e => e.Exclusion)],
            excelKey: "cons",
            excelHeaders: this.recommandationsTable.headers.filter(
              f => f.inTable
            )
          });
          console.log("data", data);
          this.$set(
            this.recommandationsTable,
            "items",
            data.filter(e => !e.Exclusion)
          );
          this.$set(this.CertificationTable, "items", []);
          this.$set(this.recommandationsTable, "printer", printer);
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
      this.$set(this, "Recommandation", {});
      this.$set(this.createdObject, "model", true);
    },
    async actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "Recommandation", {
        ...item,
        isEdit: true
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
            if (item.Certification) {
              await this.api(`global/update_one`, {
                table: "Recommendations",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  Certification: false
                }
              });
            } else if (!item.Certification) {
              let validity = await this.checkValidCertification(item);
              console.log("validity", validity);

              if (!validity) {
                this.showError("هذا الرقم الثلاثي مصدق من قبل");
                return;
              }

              await this.api(`global/update_one`, {
                table: "Recommendations",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  Certification: true
                }
              });
            }
            this.findItems(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    CertifyAll() {
      if (!this.isAdmin()) {
        this.showError("يجب ان يصدق رئيس الفرع");
        return;
      }

      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            for (let i = 0; i < this.CertificationTable.items.length; i++) {
              if (!this.CertificationTable.items[i].Certification) {
                let validity = await this.checkValidCertification(
                  this.CertificationTable.items[i]
                );

                if (!validity) {
                  this.showError("توجد ارقام ثلاثية مصدقة من قبل");
                  return;
                }

                await this.api(`global/update_one`, {
                  table: "Recommendations",
                  where: {
                    ID_KEY: this.CertificationTable.items[i].ID_KEY
                  },
                  update: {
                    Certification: true
                  }
                });
              }
            }
            this.findItems(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    actionisUnitFollow(item) {
      console.log(item);
      if (!this.isAdmin()) {
        this.showError("يجب ان يصدق رئيس الفرع");

        return;
      }
      if (item.CertificationText != "في انتظار الموافقة") {
        this.showError("لا يمكن متابعة الوحدة الخاصة به لانه تم التصديق عليه");

        return;
      }

      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.isUnitFollow) {
              await this.api(`global/update_one`, {
                table: "Recommendations",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isUnitFollow: false
                }
              });
            } else if (!item.isUnitFollow) {
              let validity = await this.checkValidCertification(item);

              if (!validity) {
                this.showError("هذا الرقم الثلاثي مصدق من قبل");
                return;
              }

              await this.api(`global/update_one`, {
                table: "Recommendations",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isUnitFollow: true
                }
              });
            }
            await this.findItems(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    actionExclusion(item) {
      if (!this.isAdmin()) {
        this.showError("يجب ان يقوم رئيس الفرع بالاستبعاد");
        return;
      }
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.Exclusion) {
              await this.api(`global/update_one`, {
                table: "Recommendations",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  Exclusion: false
                }
              });
              this.$set(this, "showRemoveDialog", false);
            } else if (!item.Exclusion) {
              await this.api(`global/update_one`, {
                table: "Recommendations",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  Exclusion: true,
                  ExclusionNotes: this.removedItem.ExclusionNotes
                }
              });
            }
            this.findItems(this.search);
            this.$set(this, "showRemoveDialog", false);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
