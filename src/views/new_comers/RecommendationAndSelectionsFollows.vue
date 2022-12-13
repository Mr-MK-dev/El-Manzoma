<template>
  <div class="SMRE">
    <search-bulider
      :addButton="false"
      :fields="headers"
      :selects="selects"
      :clearOption="true"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في توصيات الانتقاءات "
    />

    <v-card>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          @click="perpareOfficerLatter()"
          large
          color="primary"
          v-text="' ارسال مكاتبة لتوصيات الترشيح المطلوبة'"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="officeLatterTable.isDisplayed">
      <table-bulider
        :headers="headers"
        :printer="officeLatterTable.printer"
        :items="officeLatterTable.items"
        :title="'التوصيات التي جاهزة لطباعة مكاتبة'"
        :wordFile="'/new_commers/OfficedRecommandationLatter'"
        @fileIsOpened="handelOfficerFileIsOpened()"
      >
        <template v-slot:item.isCertificated="{ item }">
          <v-chip @click="actionCertificatie(item)" :color="item.color">
            {{ item.Certification }}
          </v-chip>
        </template>
        <template v-slot:item.officerLatterHasSent="{ item }">
          <v-chip :color="item.officerLatterHasSent ? 'success' : 'gray'">
            {{ item.officerLatterHasSentText }}
          </v-chip>
        </template>
        <template v-slot:item.weaponLatterHasSent="{ item }">
          <v-chip :color="item.weaponLatterHasSent ? 'success' : 'gray'">
            {{ item.weaponLatterHasSentText }}
          </v-chip>
        </template>
      </table-bulider>
    </v-dialog>

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
          <!-- <v-btn
            icon
            v-if="isAdmin()"
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn> -->
        </v-chip>
      </template>
      <template v-slot:item.isCertificated="{ item }">
        <v-chip @click="actionCertificatie(item)" :color="item.color">
          {{ item.Certification }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="إضافة توصية"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Recommandation"
      @on-submit="saveItem()"
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
  name: "RecommendationAndSelectionsEdit",

  mounted() {
    this.init();
  },
  watch: {
    "Recommandation.WeaponRecommendation"(v) {
      this.Recommandation.weaponRecommendations_1 = v;
    }
  },
  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Recommandation: {
      isCertificated: false
    },
    officeLatterTable: {
      isDisplayed: false,
      items: [],
      printer: {}
    },
    printer: {},
    items: [],
    headers: [
      {
        text: "المرحلة التجنيدية",
        value: "RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
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
        inModel: false,
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
        inModel: false,
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
        inModel: false,
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
        inModel: false,
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
        inModel: false,
        sort: 1
      },
      {
        text: "الموصي",
        value: "Recommender",
        searchValue: "Recommender",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "ملاحظات طبية ",
        value: "Notes",
        searchValue: "Notes",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "الترشيح",
        value: "OfficerStatus",
        searchValue: "OfficerStatus",
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
        inModel: false,
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
        text: " نتيجة (الانتقاء)",
        value: "WeaponResult",
        searchValue: "WeaponResult",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: " نتيجة (الدرجة)",
        value: "OfficerSoldierResult",
        searchValue: "OfficerSoldierResult",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: false,
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
      WeaponResult: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
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
      OfficerStatus: {
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
    perpareOfficerLatter() {
      this.officeLatterTable.items = this.items;
      this.officeLatterTable.printer = {
        data: this.officeLatterTable.items.map((ele, index) => ({
          ...ele,
          index: index + 1
        })),
        excelKey: "data",
        excelHeaders: this.headers.filter(f => f.inTable)
      };
      this.officeLatterTable.isDisplayed = true;
    },
    handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...data,
          ...(data.advancedQuery || {}),
          advancedQuery: null,
          isCertificated: true,
          OfficerSoldierResult: "ظابط"
          // OfficerSoldierRecommendation: "جندي"
        },
        likes = ["ID"],
        multi = [];
      where = this.mapToQuery(where, likes, multi);

      this.api("global/get_all", {
        table: "RecommendationAndSelections",
        where,
        include: []
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              Certification: ele.isCertificated
                ? "تم التصديق"
                : "في انتظار  التصديق",
              color: ele.isCertificated ? "success" : "gray"
            })),
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inTable)
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
      if (item.OfficerSoldierRecommendation)
        this.headers.find(
          ele => ele.text == "OfficerSoldierRecommendation"
        ).inModel = true;
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Recommandation", { ...item, isEdit: true });
    },

    actionCertificatie(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (!item.isCertificated) {
              await this.api(`global/update_one`, {
                table: "RecommendationAndSelections",
                where: {
                  tripleNo: item.tripleNo
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

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
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
            .weaponRecommendations_2 || ""}/${this.Recommandation
            .weaponRecommendations_3 || ""}`
        };
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
                  ...this.Recommandation
                },
            update: {
              ...this.Recommandation
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.handleSearch(this.search);
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
