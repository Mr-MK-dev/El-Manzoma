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
    <custom-search
      :fields="headers"
      :selects="selects"
      :clearOption="true"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في توصيات الإدارات "
      addBtnTitle="إضافة توصية"
    />
    <v-card>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          v-if="items.length > 0"
          @click="getDuplicates()"
          large
          color="primary"
          v-text="'عرض التكرار'"
        ></v-btn>

        <v-btn
          class="px-6"
          v-if="items.length > 0 && isAdmin"
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

        <v-btn
          class="px-6"
          @click="perpareLatter()"
          large
          color="primary"
          v-text="'ارسال مكاتبة'"
        ></v-btn>
      </v-card-actions>
    </v-card>

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
      <template v-slot:item.isConfirmedText="{ item }">
        <v-chip
          :disabled="!isAdmin()"
          @click="actionCertificatie(item)"
          :color="item.color"
        >
          {{ item.isConfirmedText }}
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
      <template v-slot:item.latterHasSentText="{ item }">
        <v-chip
            @click="switchLetterSent(item)"
            :color="item.latterHasSentColor">
          {{ item.latterHasSentText }}
        </v-chip>
      </template>
      <template v-if="isAdmin()" v-slot:item.Author="{ item }">
        {{ item.user.realName }}
      </template>
    </table-bulider>

    <v-dialog v-model="latterTable.isDisplayed">
      <table-bulider
        :headers="headers"
        :printer="latterTable.printer"
        :items="latterTable.items"
        :title="'التوصيات التي جاهزة لطباعة مكاتبة'"
        :wordFile="'/new_commers/SMRecommandationLatter'"
        @fileIsOpened="handelFileIsOpened()"
      >
        <template v-slot:item.isConfirmedText="{ item }">
          <v-chip
            :disabled="!isAdmin()"
            @click="actionCertificatie(item)"
            :color="item.color"
          >
            {{ item.isConfirmedText }}
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
        <template v-slot:item.latterHasSentText="{ item }">
          <v-chip :color="item.latterHasSentColor">
            {{ item.latterHasSentText }}
          </v-chip>
        </template>
      </table-bulider>
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
          <template v-slot:item.TripleNo="{ item }">
            <v-chip :color="item.color">
              {{ item.TripleNo }}
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
              <v-btn icon @click="actionDelete(item)" color="error">
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-chip>
          </template>
          <template v-slot:item.isConfirmedText="{ item }">
            <v-chip
              @click="actionCertificatie(item)"
              :disabled="!isAdmin()"
              :color="item.isConfirmed ? 'success' : 'gray'"
            >
              {{ item.isConfirmedText }}
            </v-chip>
          </template>
          <template v-slot:item.ExclusionText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionRemove(item)"
              :color="item.Exclusion ? 'error' : 'gray'"
            >
              {{ item.ExclusionText }}
            </v-chip>
          </template>

          <template v-slot:item.latterHasSentText="{ item }">
            <v-chip
                @click="switchLetterSent(item)"
                :color="item.latterHasSentColor">
              {{ item.latterHasSentText }}
            </v-chip>
          </template>
          <template v-if="isAdmin()" v-slot:item.Author="{ item }">
            {{ item.user.realName }}
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

          <template v-slot:item.editor="{ item }">
            <v-chip class="transparent">
              <v-btn icon @click="actionEdit(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-chip>
          </template>

          <template v-slot:item.isConfirmedText="{ item }">
            <v-chip
              :disabled="!isAdmin()"
              @click="actionCertificatie(item)"
              :color="item.color"
            >
              {{ item.isConfirmedText }}
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

    <custom-dialog
      title="إضافة توصية"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Recommandation"
      @on-submit="saveItem()"
      @updateValue="checkCenter()"
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

  name: "SMRecommandations",

  mounted() {
    this.init();
  },
  watch: {
    "Recommandation.KnowledgeLevel"(v) {
      this.selects.College.data = this.selects.allColleges.data.filter(
        ele => ele.KnowledgeLevel == v
      );
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

    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Recommandation: {
      isConfirmed: false,
      Exclusion: false
    },
    items: [],
    latterTable: {
      items: [],
      isDisplayed: false,
      headers: []
    },

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
        text: "الرقم العسكري",
        value: "ID",
        searchValue: "ID",
        sortable: true,
        type: "text",
        inSearch: false,
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
        inSearch: false,
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
        multiple: true,
        notMultipleInModel: true,

        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تم التصديق ؟",
        value: "isConfirmedText",
        searchValue: "isConfirmed",
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
        text: "المحافظة",
        value: "Government",
        searchValue: "Government",
        sortable: true,
        type: "text",
        inSearch: true,
        multiple: false,
        notMultipleInModel: true,

        inTable: true,
        inModel: true,
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
        text: "السلاح الحالي",
        value: "Weapon.Weapon",
        searchValue: "RecentWeapon",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الوحدة الموصي بها",
        value: "UnitName",
        searchValue: "UnitName",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
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

        sort: 3
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
        text: "تم ارسال مكاتبة ؟",
        value: "latterHasSentText",
        searchValue: "latterHasSent",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "ملاحظات",
        value: "Notes",
        searchValue: "Notes",
        sortable: true,
        type: "textarea",
        inSearch: true,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "المرحلة التجنيدية",
        value: "RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        type: "select",
        inSearch: true,
        notMultipleInModel: true,
        multiple: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "النتيجة النهائية",
        value: "FinalResult",
        searchValue: "FinalResult",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
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
    Exclusions: [],
    ExclusionTable: {},

    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Category: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      Certificator: {
        table: "Certificators",
        text: "Name",
        value: "Name"
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
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
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
      RecentWeapon: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      DegreeOfImportance: {
        text: "text",
        value: "text",
        data: ["هام", "هام جداً"]
      },
      isConfirmed: {
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
      }
    },
    printer: {}
  }),

  methods: {
    async checkIsValidFromSystemControl() {
      let x = await this.api("global/get_one", {
        table: "SystemRules",
        where: { Key: "SMRecommendations" }
      });
      let data = x.data;
      console.log(data);
      return !data.Value;
    },
    actionRemove(item) {
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    async checkCenter() {
      if (this.Recommandation.TripleNo?.split("-")[1]) {
        let center = await this.apiSilent("global/queryRunners", {
          query: `SELECT City  from City c join Centre c2 on c2.CityID  = c.CityID  WHERE c2.CentreID  = ${
            this.Recommandation.TripleNo?.split("-")[1]
          }`
        });
        if (center.data[0] && center.data[0].City) {
          this.$set(this.Recommandation, "Government", center.data[0].City);
        }
      }
    },
    getDuplicates() {
      let result = [],
        groupdata = lodash.groupBy(this.items, ele => ele.TripleNo);

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
        headers: this.headers,
        items: this.items,
        printer: this.printer,
        isDisplayed: true
      };
      let data = result,
        printer = {
          cons: [
            ...data.map(ele => ({
              ...ele,
              Certification: ele.isConfirmed
                ? "تم التصديق"
                : "في انتظار  التصديق",
              color: ele.isConfirmed ? "success" : "gray",
              ExclusionText: ele.Exclusion
                ? "تم الإستبعاد"
                : "في انتظار إستبعاده",
              colorExclusion: ele.Exclusion ? "success" : "gray",
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

    handelFileIsOpened() {
      this.$confirm(`هل تم ارسال المكاتبة ؟ `, {
        title: ``
      })
        .then(async res => {
          if (res) {
            //
            await this.api(`global/queryRunners`, {
              query: `UPDATE [dbo].[SMRecommandations] SET [latterHasSent]=1 WHERE [latterHasSent] = 0 or [latterHasSent] is NULL  AND [isConfirmed] = 1`
            });
          }
          this.latterTable.isDisplayed = false;
          this.handleSearch(this.search);
        })
        .catch(e => {
          console.log(e);
        });
    },
    perpareLatter() {
      this.latterTable.items = this.items.filter(
        ele => !ele.latterHasSent && ele.isConfirmed
      );
      this.latterTable.isDisplayed = true;
      this.latterTable.printer = {
        data: this.latterTable.items.map((ele, index) => ({
          ...ele,
          index: index + 1,
          RecentWeapon: ele.Weapon?.Weapon
        })),
        RecuStage: this.latterTable.items[0].RecuStage,
        excelKey: "data",
        excelHeaders: this.headers.filter(f => f.inSearch)
      };
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
                isConfirmed: 1
              }
            ]
          };
        } else {
          data = { ...data, UserId: this.$store.state.currentUser.userId };
        }
      }
      if (!data.RecuStage) {
        return this.showError("يرجى إختيار المرحلة");
      }
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = ["ID", "FinalResult"],
        multi = [
          "Certificator",
          "Category",
          "College",
          "KnowledgeLevel",
          "RecuStage"
        ],
        dates = ["DateAdded"];
      where = this.mapToQuery(where, likes, multi, dates);
      console.log("where", where);
      this.api("global/get_all", {
        table: "SMRecommandations",
        where,
        include: [
          {
            model: "Weapon"
          },
          {
            model: "users"
          }
        ]
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele,
            Certification: ele.isConfirmed
              ? "تمت الموافقة"
              : "في انتظار الموافقة",

            isConfirmedText: ele.isConfirmed
              ? "تمت الموافقة"
              : "في انتظار الموافقة",
            color: ele.isConfirmed ? "success" : "gray",

            ExclusionText: ele.Exclusion
              ? "تمت الإستبعاد"
              : "في انتظار الإستبعاد",

            isUnitFollow: ele.isUnitFollow,
            isUnitFollowText: ele.isUnitFollow
              ? "تم متابعة الوحدة"
              : "لم يتم متابعة الوحدة",
            colorisUnitFollow: ele.isUnitFollow ? "success" : "gray",
            Author: ele.user.realName,
            colorExclusion: ele.Exclusion ? "error" : "gray",

            latterHasSentColor: ele.latterHasSent ? "success" : "gray",
            latterHasSentText: ele.latterHasSent
              ? "تمت ارسال المكاتبة"
              : "في انتظار الارسال"
          }));

          this.$set(
            this,
            "Exclusions",
            data.filter(e => e.Exclusion)
          );

          this.$set(
            this,
            "items",
            data.filter(e => !e.Exclusion)
          );

          let printer = {
            cons: [...data.filter(e => !e.Exclusion)],
            excelKey: "cons",
            excelHeaders: this.headers.filter(f => f.inTable)
          };
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
    actionisUnitFollow(item) {
      console.log(item);
      if (!this.isAdmin()) {
        this.showError("يجب ان يصدق رئيس الفرع");

        return;
      }
      if (item.isConfirmed != false) {
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
                table: "SMRecommandations",
                where: {
                  IDKey: item.IDKey
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
                table: "SMRecommandations",
                where: {
                  IDKey: item.IDKey
                },
                update: {
                  isUnitFollow: true
                }
              });
            }
            await this.handleSearch(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    switchLetterSent(item){
      console.log("ASASAS" , item);
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
          .then(async res => {
            if (res) {
                await this.api(`global/update_one`, {
                  table: "SMRecommandations",
                  where: {
                    IDKey: item.IDKey
                  },
                  update: {
                    latterHasSent: !item.latterHasSent
                  }
                });
              this.handleSearch(this.search);
            }
          })
          .catch(e => {
            console.log(e);
          });

    },
    showExclusion() {
      this.ExclusionTable = {
        headers: this.headers,
        items: this.items,
        printer: this.printer,
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

    async actionAdd() {
      if (!this.isAdmin() && (await this.checkIsValidFromSystemControl())) {
        return this.showError("تم إنتهاء المدة المحددة لإضافة وتعديل توصية");
      }
      this.$set(this, "Recommandation", {});
      this.$set(this, "item", {});
      this.$set(this, "showAddDialog", true);
    },

    async pullDateFromSelections() {
      this.searchLoading = true;
      let where = {
        isCertificated: true,
        Exclusion: false,
        WeaponResult: {
          $not: null
        }
      };

      let data = await this.api("global/get_all", {
        table: "RecommendationAndSelections",
        where,
        include: []
      });
      data = data.data.filter(
        ele => !ele.WeaponResult.includes("قوات حرس الحدود") && ele.willContinuo
      );
      data.forEach(element => {
        this.api("global/get_one", {
          table: "SMRecommandations",
          where: {
            TripleNo: element.tripleNo
          },
          include: []
        }).then(ele => {
          if (!ele.data) {
            this.api("global/create_one", {
              table: "SMRecommandations",
              where: {
                ...element,
                IDKey: null,
                TripleNo: element.tripleNo,
                Recommander: element.Recommender,
                RecentWeapon: this.selects.WeaponID.data.find(
                  w => w.Weapon == element.WeaponResult
                )?.WeaponID
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

    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Recommandation", { ...item, isEdit: true });
    },
    async checkValidCertification(item) {
      let inValid = await this.api(`global/get_all`, {
        table: "SMRecommandations",
        where: {
          TripleNo: item.TripleNo,
          isConfirmed: true,
          IDKey: {
            $ne: item.IDKey
          }
        }
      });
      if (inValid.data.length) {
        return false;
      } else {
        return true;
      }
    },
    async checkValidExclusion(item) {
      let inValid = await this.api(`global/get_all`, {
        table: "SMRecommandations",
        where: {
          TripleNo: item.TripleNo,
          Exclusion: true,
          IDKey: {
            $ne: item.IDKey
          }
        }
      });
      if (inValid.data.length) {
        return false;
      } else {
        return true;
      }
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
            if (item.isConfirmed) {
              await this.api(`global/update_one`, {
                table: "SMRecommandations",
                where: {
                  IDKey: item.IDKey
                },
                update: {
                  isConfirmed: false
                }
              });
            } else if (!item.isConfirmed) {
              let validity = await this.checkValidCertification(item);

              if (!validity) {
                this.showError("هذا الرقم الثلاثي مصدق من قبل");
                return;
              }

              await this.api(`global/update_one`, {
                table: "SMRecommandations",
                where: {
                  IDKey: item.IDKey
                },
                update: {
                  isConfirmed: true
                }
              });
            }
            this.handleSearch(this.search);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    actionExclusion(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.Exclusion) {
              await this.api(`global/update_one`, {
                table: "SMRecommandations",
                where: {
                  IDKey: item.IDKey
                },
                update: {
                  Exclusion: false
                }
              });
              this.$set(this, "showRemoveDialog", false);
            } else if (!item.Exclusion) {
              await this.api(`global/update_one`, {
                table: "SMRecommandations",
                where: {
                  IDKey: item.IDKey
                },
                update: {
                  Exclusion: true,
                  ExclusionNotes: this.removedItem.ExclusionNotes
                }
              });
            }
            this.handleSearch(this.search);
            this.$set(this, "showRemoveDialog", false);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "SMRecommandations",
            where: {
              IDKey: item.IDKey
            }
          });
          this.handleSearch({ RecuStage: [this.Recommandation.RecuStage] });
        }
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        if (!this.Recommandation.DateAdded)
          this.Recommandation.DateAdded = new Date().toISOString().slice(0, 10);

        saveItem = await this.api(
          !this.Recommandation.IDKey
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "SMRecommandations",
            where: this.Recommandation.IDKey
              ? {
                  IDKey: this.Recommandation.IDKey
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
          this.$set(this, "showAddDialog", false);
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
