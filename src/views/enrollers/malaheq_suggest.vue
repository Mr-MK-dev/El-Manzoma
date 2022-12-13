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
    <search-bulider
      :fields="followingSuggestTabel.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      :search="search"
      title="مقترح ملاحق المرحلة"
      addBtnTitle="إضافة مقترح الحاق"
    />

    <v-card>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          v-if="followingSuggestTabel.items.length > 0"
          @click="getDuplicates()"
          large
          color="primary"
          v-text="'عرض التكرار'"
        ></v-btn>
        <v-btn
          class="px-6"
          v-if="followingSuggestTabel.items.length > 0 && isAdmin()"
          @click="showExclusion()"
          large
          color="primary"
          v-text="'عرض المستبعد'"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog persistent v-model="DuplicatationsTable.isDisplayed" scrollable>
      <v-card>
        <v-btn @click="DuplicatationsTable.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <table-bulider
          :headers="DuplicatationsTable.headers"
          :printer="DuplicatationsTable.printer"
          :items="DuplicatationsTable.items"
          :title="'الملحقات للمكررة للنفس الشخص'"
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
          <template v-slot:item.isRecommendedText="{ item }">
            <v-chip :color="item.isRecommended == 1 ? 'success' : 'error'">
              {{ item.isRecommended ? "نعم" : "لا" }}
            </v-chip>
          </template>
          <template v-slot:item.isSelectedText="{ item }">
            <v-chip :color="item.isSelected == 1 ? 'success' : 'error'">
              {{ item.isSelected ? "نعم" : "لا" }}
            </v-chip>
          </template>

          <template v-slot:item.AcceptanceText="{ item }">
            <v-chip
              @click="changeStatus(item)"
              :color="item.Acceptance == true ? 'success' : 'gray'"
            >
              {{
                item.Acceptance == true ? "تمت الموافقة" : "في انتظار الموافقة"
              }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-chip class="transparent" :disabled="!isAdmin()">
              <v-btn icon @click="actionEdit(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
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

    <table-bulider
      :headers="followingSuggestTabel.headers"
      :printer="followingSuggestTabel.printer"
      :items="followingSuggestTabel.items"
      :title="'مقترح الملاحق'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>
      <template v-slot:item.ToEnrollers="{ item }">
        <v-chip
          :color="item.isEnrolledColor"
          icon
          @click="createEnroller(item)"
        >
          <v-icon>mdi-account-plus</v-icon>
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
      <template v-slot:item.isRecommendedText="{ item }">
        <v-chip :color="item.isRecommended == 1 ? 'success' : 'error'">
          {{ item.isRecommended ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.isSelectedText="{ item }">
        <v-chip :color="item.isSelected == 1 ? 'success' : 'error'">
          {{ item.isSelected ? "نعم" : "لا" }}
        </v-chip>
      </template>

      <template v-slot:item.AcceptanceText="{ item }">
        <v-chip
          @click="changeStatus(item)"
          :color="item.Acceptance == true ? 'success' : 'gray'"
        >
          {{ item.Acceptance == true ? "تمت الموافقة" : "في انتظار الموافقة" }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
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
          <template v-slot:item.ID="{ item }">
            <v-chip
              color="transparent"
              :to="`/soldiers_plus/${item.ID}`"
              @click.right="copyText(item.ID)"
            >
              {{ item.ID }}
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
          <template v-slot:item.isRecommendedText="{ item }">
            <v-chip :color="item.isRecommended == 1 ? 'success' : 'error'">
              {{ item.isRecommended ? "نعم" : "لا" }}
            </v-chip>
          </template>
          <template v-slot:item.isSelectedText="{ item }">
            <v-chip :color="item.isSelected == 1 ? 'success' : 'error'">
              {{ item.isSelected ? "نعم" : "لا" }}
            </v-chip>
          </template>

          <template v-slot:item.AcceptanceText="{ item }">
            <v-chip
              @click="changeStatus(item)"
              :color="item.Acceptance == true ? 'success' : 'gray'"
            >
              {{
                item.Acceptance == true ? "تمت الموافقة" : "في انتظار الموافقة"
              }}
            </v-chip>
          </template>
          <template v-slot:item.actionsStart="{ item }">
            <v-chip color="transparent">
              <v-btn icon @click="actionEdit(item)" color="primary">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <!-- <v-btn
                v-if="hasDeleteAccess()"
                icon
                @click="actionDelete(item)"
                color="error"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn> -->
            </v-chip>
          </template>
        </table-bulider>
      </v-card>
    </v-dialog>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="followingSuggestTabel.headers"
      :selects="selects"
      :data="followingSuggest"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "followingSuggest",
  props: {
    parentFilters: {
      type: Boolean,
      default: () => {}
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    followingSuggest: {},
    groupedValue: [],
    removedItem: {},
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
    isRemovedData: {},
    subjectLimit: 10,
    createdObject: {
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
    ExclusionTable: {},
    Exclusions: [],
    ExclusionsPrinter: {},

    searchLoading: false,
    previousWorkPlaceID: 0,
    DuplicatationsTable: {},
    showRemoveDialog: false,

    followingSuggestTabel: {
      headers: [
        {
          text: "",
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
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
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
          readOnly: true,
          sort: 1
        },
        {
          text: "مرحلة الإقتراح",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          multiple: true,
          notMultipleInModel: true,
          required: true,
          sort: 5
        },
        {
          text: "الرقم الثلاثي",
          value: "tripleNo",
          searchValue: "tripleNo",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: false,
          sort: 1
        },
        {
          text: "المستوى الثقافي",
          value: "Soldier.KnowledgeLevel",
          searchValue: "Soldier.KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 2
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 2
        },
        {
          text: "الإتجاه",
          value: "Soldier.Unit.Directionforunit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: false,
          sort: 2
        },

        {
          text: "التصنيف",
          value: "followerwork.wokel7aq",
          searchValue: "wokel7aq",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 2
        },
        {
          text: "مكان العمل",
          value: "followerwork.workplace",
          searchValue: "WorkPlaceID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          required: true,
          inModel: true
        },
        {
          text: "توصية",
          value: "isRecommendedText",
          searchValue: "isRecommended",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: true,
          readonly: false,
          sort: 1
        },
        {
          text: "إنتقاء",
          value: "isSelectedText",
          searchValue: "isSelected",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: true,
          readonly: false,
          sort: 1
        },
        {
          text: "الموصي",
          value: "FollowingRecommender",
          searchValue: "FollowingRecommender",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 4
        },
        {
          text: "الأمر بالإلحاق",
          value: "FollowingOrder",
          searchValue: "FollowingOrder",
          sortable: true,
          type: "select",
          required: true,
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 3
        },
        {
          text: "درجة الأهمية",
          value: "DegreeOfImportance",
          searchValue: "DegreeOfImportance",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 3
        },
        {
          text: "الوظيفة المخصصة",
          value: "DemandedJob",
          searchValue: "DemandedJob",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 3
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
          text: "تمت الموافقة",
          value: "AcceptanceText",
          searchValue: "Acceptance",
          sortable: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 5
        },
        {
          text: "إضافة عالملحقين",
          value: "ToEnrollers",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 5
        }
      ],
      items: [],
      printer: {}
    },

    followingSuggestStatsTabel: {
      isDisplayed: false,
      headers: [
        {
          text: "جهة الالتحاق",
          value: "FollowRigionName",
          sortable: true,
          inTable: true,
          sort: 2
        },
        {
          text: "المصدق عليه",
          value: "totalAccpted",
          sortable: true,
          inTable: true,
          sort: 1
        },
        {
          text: "المصدق عليه",
          value: "totalPending",
          sortable: true,
          inTable: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    unitFollowingSuggestStatsTabel: {
      isDisplayed: false,
      headers: [
        {
          text: "الوحدة",
          value: "Unit",
          sortable: true,
          inTable: true,
          sort: 2
        },
        {
          text: "جهة الالتحاق",
          value: "FollowRigion",
          sortable: true,
          inTable: true,
          sort: 2
        },
        {
          text: "العدد الملحق",
          value: "TotalFollowers",
          sortable: true,
          inTable: true,
          sort: 2
        }
      ],
      items: [],
      printer: {}
    },

    componentName: "createdObject",
    selects: {
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
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
      wokel7aq: {
        table: "followerwork",
        value: "wokel7aq",
        text: "wokel7aq"
      },
      WorkPlaceID: {
        table: "followerwork",
        value: "idwork",
        text: "workplace"
      },
      allWorkplace: {
        table: "followerwork",
        value: "idwork",
        text: "workplace"
      },

      FollowingRecommender: {
        text: "text",
        value: "text",
        data: constants.FollowingRecommender.data
      },
      FollowingOrder: {
        table: "EnrollersCertificators",
        text: "Name",
        value: "Name"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      DegreeOfImportance: {
        text: "text",
        value: "text",
        data: ["هام", "هام جداً", "هام للغاية"]
      }
    },
    printer: {}
  }),
  watch: {
    async "followingSuggest.wokel7aq"(newValue) {
      this.selects.WorkPlaceID.data = this.selects.allWorkplace.data.filter(
        ele => ele.wokel7aq == newValue
      );
    },
    "followingSuggest.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
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
                table: "Followers",
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
                table: "Followers",
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
    },
    getDuplicates() {
      let result = [],
        groupdata = lodash.groupBy(
          this.followingSuggestTabel.items,
          ele => ele.ID
        );

      let colors = [
        "accent",
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
        ...this.followingSuggestTabel,
        isDisplayed: true
      };
      let data = result,
        printer = {
          cons: [
            ...data.map(ele => ({
              ...ele,
              Name: ele.Name || ele.Soldier?.Name,
              tripleNo: ele.tripleNo || ele.Soldier?.tripleNo
            }))
          ],
          excelKey: "cons",
          excelHeaders: this.DuplicatationsTable.headers.filter(f => f.inTable)
        };

      this.$set(this.DuplicatationsTable, "items", data);
      this.$set(this.DuplicatationsTable, "printer", printer);
    },
    showExclusion() {
      this.ExclusionTable = {
        ...this.followingSuggestTabel,
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

    actionRemove(item) {
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Soldier",
          where: { id }
        })
          .then(x => {
            this.$set(this.followingSuggest, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", false);
      let saveItem;
      try {
        let findAvailableSlots = await this.api("global/get_one", {
          table: "enrollersPlanList",
          where: {
            RecuStage: this.followingSuggest.RecuStage
          },
          include: [{ model: "enrollersPlanDetails" }]
        });
        let selectedPlace = findAvailableSlots?.data?.enrollersPlanDetails?.filter(
          ele => ele.WorkPlaceID == this.followingSuggest.WorkPlaceID
        );

        if (!selectedPlace) {
          this.showError("هذا المكان غير مدرج بالخطة");
          return;
        }

        console.log("accepted");

        saveItem = await this.api(
          `global/${
            this.followingSuggest.isEdit ? "update_one" : "create_one"
          }`,
          {
            table: "Followers",
            where: !this.followingSuggest.isEdit
              ? this.followingSuggest
              : {
                  ID_KEY: this.followingSuggest.ID_KEY
                },
            update: this.followingSuggest
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          if (this.followingSuggest.isEdit) {
            console.log("previous", this.previousWorkPlaceID);

            let updateSlots = await this.api("global/update_one", {
              table: "enrollersPlanDetails",
              where: {
                EnrollersPlanID: findAvailableSlots?.data?.ID_KEY,
                WorkPlaceID: this.previousWorkPlaceID
              },
              update: {
                AvailableSlots:
                  findAvailableSlots?.data?.enrollersPlanDetails.filter(
                    ele => ele.WorkPlaceID == this.previousWorkPlaceID
                  )[0].AvailableSlots + 1
              }
            });
          }
          if (selectedPlace) {
            let updateSlots = await this.api("global/update_one", {
              table: "enrollersPlanDetails",
              where: {
                EnrollersPlanID: findAvailableSlots?.data?.ID_KEY,
                WorkPlaceID: this.followingSuggest.WorkPlaceID
              },
              update: {
                AvailableSlots: selectedPlace[0]?.AvailableSlots - 1
              }
            });
          }

          this.showSuccess("تم حفظ ");
          this.findItems(this.search);

          this.createdObject, "model", false;
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
    async createEnroller(item) {
      if (item.isEnrolled) {
        this.showError("هذا المقترح تم الحاقه بالفعل");
        return;
      }
      if (!item.Acceptance) {
        this.showError("لا يتم التفعيل الا بعد موافقة رئيس الفرع");
        return;
      }
      let saveItem;
      try {
        saveItem = await this.api(`global/create_one`, {
          table: "followersolider",
          where: {
            ID: item.ID,
            Orderoffolwer: item.FollowingOrder,
            Recommender: item.FollowingRecommender,
            workplace: item.WorkPlaceID,
            notes: item.Notes,
            TarekhElhak: new Date(),
            isRecommended: item.isRecommended,
            isSelected: item.isSelected,
            FollowerDuty: item.DemandedJob,
            isEnrolled: true
          }
        });
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم الالحاق");
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
      } catch (err) {
        console.log("err", err);
      } finally {
        this.findItems(this.search);
      }
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters,
          RecuStage: filters.RecuStage,
          UnitID: null,
          WeaponID: null
        },
        likes = ["ID", "Name"],
        multi = [];

      this.$set(this, "search", where);

      let enrollers = await this.api("global/get_all", {
        table: "followersolider",
        where: {
          isEnrolled: true
        }
      });
      const enrolledIDs = enrollers.data.map(ele => ele.ID);

      this.api("global/get_all", {
        table: "Followers",
        where: this.mapToQuery(where, likes, multi),
        include: [
          {
            model: "followerwork"
          },
          {
            model: "Soldier",
            where: this.cleanObject({
              UnitID: filters.UnitID,
              WeaponID: filters.WeaponID
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ]
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              isEnrolled: enrolledIDs.includes(ele.ID),
              isEnrolledColor: enrolledIDs.includes(ele.ID)
                ? "success"
                : "gray",
              Name: ele.Name || ele.Soldier?.Name,
              isSelectedText: ele.isSelected ? "نعم" : "لا",
              isRecommendedText: ele.isRecommended ? "نعم" : "لا",
              tripleNo: ele.tripleNo || ele.Soldier?.TripleNo,
              AcceptanceText: ele.Acceptance
                ? "تمت الموافقه"
                : "لم تتم الموافقة",
              Exclusion: ele.Exclusion,
              ExclusionText: ele.Exclusion
                ? "تم الإستبعاد"
                : "لم يتم الإستبعاد",
              colorExclusion: ele.Exclusion ? "error" : "gray"
            })),
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.followingSuggestTabel.headers.filter(
                f => f.inSearch
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
            excelHeaders: this.followingSuggestTabel.headers.filter(
              f => f.inTable
            )
          });
          this.$set(this.followingSuggestTabel, "items", data);
          this.$set(this.followingSuggestTabel, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    // calculateStatsWithFollowRigion() {
    //   this.$set(this.followingSuggestStatsTabel, "isDisplayed", true);
    //   const groupdWithFollowRigionName = _.groupBy(
    //     this.followingSuggestTabel.items,
    //     "FollowingRigion.FollowRigionName"
    //   );

    //   this.$set(
    //     this.followingSuggestStatsTabel,
    //     "items",
    //     Object.keys(groupdWithFollowRigionName).map(key => ({
    //       FollowRigionName: key,
    //       totalAccpted: groupdWithFollowRigionName[key].filter(
    //         ele => ele.Acceptance
    //       ).length,
    //       totalPending: groupdWithFollowRigionName[key].filter(
    //         ele => !ele.Acceptance
    //       ).length
    //     }))
    //   );
    //   this.$set(this.followingSuggestStatsTabel, "printer", {
    //     data: this.followingSuggestStatsTabel.items,
    //     excelKey: "data",
    //     excelHeaders: this.followingSuggestStatsTabel.headers.filter(
    //       f => f.inTable
    //     )
    //   });
    // },
    // calculateStatsWithUnit() {
    //   this.$set(this.unitFollowingSuggestStatsTabel, "isDisplayed", true);
    //   const groupdWithUnit = _.groupBy(
    //     this.followingSuggestTabel.items,
    //     "Soldier.Unit.Unit"
    //   );
    //   this.$set(
    //     this.unitFollowingSuggestStatsTabel,
    //     "items",
    //     _.flatten(
    //       Object.keys(groupdWithUnit).map(key => {
    //         const groupdWithFollowRigion = _.groupBy(
    //           groupdWithUnit[key],
    //           "FollowingRigion.FollowRigionName"
    //         );

    //         return Object.keys(groupdWithFollowRigion).map(FollowRigion => ({
    //           Unit: key,
    //           FollowRigion,
    //           TotalFollowers: groupdWithFollowRigion[FollowRigion].length
    //         }));
    //       })
    //     )
    //   );
    //   this.$set(this.unitFollowingSuggestStatsTabel, "printer", {
    //     data: this.unitFollowingSuggestStatsTabel.items,
    //     excelKey: "data",
    //     excelHeaders: this.unitFollowingSuggestStatsTabel.headers.filter(
    //       f => f.inTable
    //     )
    //   });
    // },
    // findSolider() {
    //   let search = this.search;
    //   this.api("global/get_one", {
    //     table: "Soldier",
    //     search: {
    //       ID: this.search.ID
    //     }
    //   }).then(x => {
    //     this.$set(this.followingSuggest, "Name", x.data.Name);
    //   });
    // },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          let findAvailableSlots = await this.api("global/get_one", {
            table: "enrollersPlanList",
            where: {
              RecuStage: item.RecuStage
            },
            include: [{ model: "enrollersPlanDetails" }]
          });

          let selectedPlace = findAvailableSlots.data.enrollersPlanDetails.filter(
            ele => ele.WorkPlaceID == item.WorkPlaceID
          );

          let updateSlots = await this.api("global/update_one", {
            table: "enrollersPlanDetails",
            where: {
              EnrollersPlanID: findAvailableSlots.data.ID_KEY,
              WorkPlaceID: item.WorkPlaceID
            },
            update: {
              AvailableSlots:
                findAvailableSlots.data.enrollersPlanDetails.filter(
                  ele => ele.WorkPlaceID == item.WorkPlaceID
                )[0].AvailableSlots + 1
            }
          });

          await this.api(`global/delete_all`, {
            table: "Followers",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems(this.search);
        }
      });
    },
    actionAdd() {
      this.$set(this.followingSuggest, "isEdit", false);
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this, "previousWorkPlaceID", item.WorkPlaceID);
      console.log("HI1", this.previousWorkPlaceID);
      console.log("HI1", item.WorkPlaceID);

      this.findOne(item.ID);
      this.$set(this.createdObject, "model", true);
      this.$set(this, "followingSuggest", {
        ...item,
        isEdit: true,
        wokel7aq: item.followerwork.wokel7aq
      });
    },
    changeStatus(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/update_one`, {
            table: "Followers",
            where: {
              ID_KEY: item.ID_KEY
            },
            update: {
              Acceptance: !item.Acceptance ?? true
            }
          });
          this.findItems(this.search);
        }
      });
    }
  }
};
</script>
