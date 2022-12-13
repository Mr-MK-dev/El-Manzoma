<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      @on-search="findItems"
      @on-add="actionAdd()"
      v-if="!id"
      :clearOption="true"
      title="بحث متقدم في نشرات التنقلات"
      addBtnTitle="إضافة الي النشرات"
    />
    <editor-dialog-bulider
      title="بيانات فترة المطلوبة للنشرة"
      :open="showFillDialog"
      @on-close="showFillDialog = false"
      :loading="loading"
      :fields="addOptions"
      :data="FillOption"
      @on-submit="fillTransferData()"
    />
    <editor-dialog-bulider />

    <v-card-title v-if="id">
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة نشرة الانتقالات
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'نشرة التنقلات'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="hasDeleteAccess()">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.fillTransferList="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-chip
            icon
            color="primary"
            @click="
              item.isFilled == 1
                ? actionRouteToDetails(item)
                : actionFillData(item)
            "
          >
            <v-icon v-if="item.isFilled">mdi-information-variant</v-icon>
            <v-icon v-if="!item.isFilled">mdi-arrow-up-bold-box-outline</v-icon>
          </v-chip>

          <v-btn
            class="mx-auto"
            v-if="item.isFilled"
            @click="perpareCategoryBalancer('صف', item)"
            large
            outlined
            color="primary"
          >
            ميزان الصف حدود
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled"
            @click="perpareCategoryBalancer('سائق عجل', item)"
            large
            outlined
            color="primary"
          >
            ميزان سائق عجل
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled"
            @click="perpareCategoryBalancer('كاتب', item)"
            large
            outlined
            color="primary"
          >
            ميزان الكاتب
          </v-btn>

          <v-btn
            class="mx-auto"
            v-if="item.isFilled"
            @click="jobsBlancer(item)"
            large
            outlined
            color="primary"
          >
            ميزان الوظائف الحرجة
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled && isAdmin()"
            @click="showAllLastDistrbuition(item)"
            large
            outlined
            color="primary"
          >
            عرض اخر توزيعة
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled && isAdmin()"
            @click="showLastDistrbuition(item, 'صف')"
            large
            outlined
            color="primary"
          >
            عرض اخر توزيعة للصف
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled && isAdmin()"
            @click="showLastDistrbuition(item, 'سائق عجل')"
            large
            outlined
            color="primary"
          >
            عرض اخر توزيعة لسائق العجل
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled && isAdmin()"
            @click="showLastDistrbuition(item, 'كاتب')"
            large
            outlined
            color="primary"
          >
            عرض اخر توزيعة للكاتب
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled"
            @click="raisingUnitEfficiency(item)"
            large
            outlined
            color="primary"
          >
            ميزان كفائة الوحدات
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled && isAdmin()"
            @click="showAllocationComparison(item)"
            large
            outlined
            color="primary"
          >
            مقارنة التوزيعة
          </v-btn>
          <v-btn
            class="mx-auto"
            v-if="item.isFilled"
            @click="actionAddNote(item)"
            large
            outlined
            color="primary"
          >
            ملاحظات النشرة
          </v-btn>
        </div>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة نشرة تنقلات'"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :data="TransferNew"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="'ملاحظات النشرة'"
      :open="NotesObject.model"
      :loading="NotesObject.loading"
      :fields="NotesHeaders"
      :data="notes"
      @on-close="NotesObject.model = false"
      @on-submit="saveNote()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "TransferNews",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    TransferNew: {},
    FillOption: {},

    NotesObject: {
      model: false,
      loading: false
    },
    notes: {},
    NotesHeaders: [
      {
        text: "ملاحظات النشرة",
        value: "Notes",
        searchValue: "Notes",
        sortable: false,
        type: "textarea",
        inModel: true,
        sort: 1
      }
    ],

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    loading: false,
    showFillDialog: false,
    addOptions: [
      {
        text: "عدد السنوات المطلوبة",
        value: "TimeStart",
        searchValue: "TimeStart",
        sortable: false,
        type: "text",
        inSearch: false,
        inTable: false,
        inModel: true,
        sort: 1
      },
      {
        text: "عدد السنوات المطلوبة بعد درجة مساعد اول",
        value: "TimeFirstSergant",
        searchValue: "TimeFirstSergant",
        sortable: false,
        type: "text",
        inSearch: false,
        inTable: false,
        inModel: true,
        sort: 1
      }
    ],

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
          text: "تاريخ النشرة",
          value: "DateOfTransferList",
          searchValue: "DateOfTransferList",
          sortable: true,
          type: "date",
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
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "fillTransferList",
          searchValue: "fillTransferList",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    }
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(
        `هل انت متاكد من حذف جميع البيانات التي تخص نشرة الأنتقالات`,
        {
          title: ``
        }
      ).then(async res => {
        if (res) {
          let deleteitem = await this.api(`global/delete_all`, {
            table: "Requests",
            where: {
              TransferListID: item.ID_KEY
            }
          });

          await this.api(`global/delete_all`, {
            table: "RatebRecommendations",
            where: {
              TransferListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "TransferListBalancer",
            where: {
              TransferListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "TransferCandidates",
            where: {
              TransferListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "TransferAllocation",
            where: {
              TransferListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "TransferListUnits",
            where: {
              TransferListID: item.ID_KEY
            }
          });
          await this.api(`global/delete_all`, {
            table: "TransferList",
            where: {
              ID_KEY: item.ID_KEY
            }
          });

          if (deleteitem.ok) {
            this.findItems({});
          } else {
            console.log("failed");
          }
        }
      });
    },

    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        this.$set(
          this.TransferNew,
          "Name",
          " نشرة بتاريخ " + this.TransferNew.DateOfTransferList
        );
        saveItem = await this.api(
          `global/${this.TransferNew.isEdit ? "update_one" : "create_one"}`,
          {
            table: "TransferList",
            where: !this.TransferNew.isEdit
              ? this.TransferNew
              : {
                  ID_KEY: this.TransferNew.ID_KEY
                },
            update: this.TransferNew
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
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

    async saveNote() {
      this.$set(this.NotesObject, "loading", true);
      try {
        let saveItem;

        saveItem = await this.api(`global/update_one`, {
          table: "TransferList",
          where: {
            ID_KEY: this.notes.ID_KEY
          },
          update: this.notes
        });
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.NotesObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.NotesObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.NotesObject, "loading", false);
      }
    },
    showLastDistrbuition(item, type) {
      this.$router.push(
        `/TransferAllocation/${item.ID_KEY}/${type}/${item.type}`
      );
    },
    showAllLastDistrbuition(item) {
      this.$router.push(`/TransferAllocation/${item.ID_KEY}`);
    },
    showAllocationComparison(item) {
      this.$router.push(`/AllocationComparison/${item.ID_KEY}/${item.type}`);
    },
    async raisingUnitEfficiency(item) {
      const unitsData = await this.api("global/get_all", {
        table: "TransferListUnits",
        include: [],
        where: this.cleanObject({
          TransferListID: item.ID_KEY
        })
      });

      if (unitsData.data.length === 0) {
        const candidates = await this.api("global/get_all", {
          table: "TransferCandidates",
          include: [
            {
              model: "Rateb",
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ],
          where: this.cleanObject({
            TransferListID: item.ID_KEY
          })
        });

        const groupByUnit = await lodash.groupBy(
          candidates.data,
          ele => ele.Rateb?.UnitID
        );
        let perparedData = Object.keys(groupByUnit).map(UnitID => {
          return {
            UnitID,
            TransferListID: item.ID_KEY
          };
        });
        await Promise.all(
          perparedData.map(ele =>
            this.api("global/create_one", {
              table: "TransferListUnits",
              where: {
                UnitID: ele.UnitID,
                TransferListID: ele.TransferListID
              }
            })
          )
        );
      }
      this.$router.push(`/raisingEfficiency/${item.ID_KEY}/${item.type}`);
    },
    actionAddNote(item) {
      this.$set(this, "notes", { ID_KEY: item.ID_KEY, Notes: item.Notes });
      this.$set(this.NotesObject, "model", true);
    },

    async jobsBlancer(item) {
      // const balancerData = await this.api("global/get_all", {
      //   table: "TransferListBalancer",
      //   include: [
      //     {
      //       model: "Unit"
      //     }
      //   ],
      //   where: this.cleanObject({
      //     TransferListID: item.ID_KEY
      //   })
      // });
      // let totalSupply = balancerData.data.reduce(
      //   (prev, cur) => prev + cur.Supply,
      //   0
      // );

      // const candidates = await this.api("global/get_all", {
      //   table: "TransferCandidates",
      //   where: this.cleanObject({
      //     TransferListID: item.ID_KEY
      //   })
      // });

      // console.log(totalSupply, candidates.data.length);
      // if (totalSupply != candidates.data.length) {
      //   this.showError(
      //     "برجاء التاكد من ان اجمالي الدعم مساوي للسحب عن طريق مراجعة بيانات الميزان"
      //   );
      //   return;
      // }

      this.$router.push(`/TransferListJobBalancer/${item.ID_KEY}/${item.type}`);
    },
    async fillTransferData() {
      this.$set(this, "loading", true);
      let finish;

      this.api("global/get_all", {
        table: "Rateb",
        include: [
          {
            model: "prevlevelup"
          }
        ],
        where: {
          Status: "بالخدمة",
          RatebCategory: {
            $in: ["صف", "كاتب مالى", "سائق عجل", "كاتب عسكرى"]
          }
        }
      })
        .then(async x => {
          console.log("PRE C", x.data);
          let group = Object.values(
            lodash.groupBy(x.data, cand => cand.ID)
          ).map(ele => ({
            ...ele[0],
            prevlevelups: ele.map(ele => ele.prevlevelups)
          }));
          let candidates = group
            .map(ele => {
              return {
                ...ele
              };
            })
            .filter(
              ele =>
                this.calculateTimeDiffernce(
                  ele.UnitJoinDate,
                  this.TransferNew.DateOfTransferList
                ) >= this.FillOption.TimeStart &&
                this.calculateTimeDiffernce(
                  ele.UnitJoinDate,
                  this.TransferNew.DateOfTransferList
                ) <= 50
            )
            .filter(
              ele =>
                !(
                  this.calculateTimeDiffernce(
                    ele.prevlevelups.find(x => x.level == "مساعد ا")
                      ?.date_level,
                    this.TransferNew.DateOfTransferList
                  ) > this.FillOption.TimeFirstSergant
                )
            );

          console.log("candidate", candidates);
          for (let i = 0; i < candidates.length; i++) {
            if (
              candidates[i].RatebCategory.includes("صف") &&
              candidates[i].WeaponID != 52
            ) {
              //
            } else {
              let candidate = {
                TransferListID: this.TransferNew.ID_KEY,
                RatebID: candidates[i].ID
              };
              finish = await this.api("global/create_one", {
                table: "TransferCandidates",
                where: candidate
              });
            }
          }
          if (finish) {
            await this.api("global/update_one", {
              table: "TransferList",
              where: { ID_KEY: this.TransferNew.ID_KEY },
              update: {
                TimeStart: parseInt(this.FillOption.TimeStart),
                TimeFirstSergant: parseInt(this.FillOption.TimeFirstSergant),
                isFilled: true
              }
            });
            this.$set(this, "loading", false);
            this.$set(this, "showFillDialog", false);
            this.showSuccess("تم اضافة المختارين ");
            this.findItems({});
          } else {
            this.$set(this, "loading", false);
            this.$set(this, "showFillDialog", false);

            this.showError("تعذر حفظ  في قاعدة البيانات");
          }
        })
        .catch(error => {})
        .finally(() => {});
    },
    async perpareCategoryBalancer(category, item) {
      const balancerData = await this.api("global/get_all", {
        table: "TransferListBalancer",
        include: [],
        where: this.cleanObject({
          TransferListID: item.ID_KEY,
          Category: category
        })
      });

      if (balancerData.data.length === 0) {
        const candidates = await this.api("global/get_all", {
          table: "TransferCandidates",
          include: [
            {
              model: "Rateb",
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ],
          where: this.cleanObject({
            TransferListID: item.ID_KEY
          })
        });

        const groupByUnit = await lodash.groupBy(
          candidates.data.filter(e => e.Rateb.RatebCategory.includes(category)),
          ele => ele.Rateb?.UnitID
        );
        let perparedData = Object.keys(groupByUnit).map(UnitID => {
          return {
            UnitID,
            TransferListID: item.ID_KEY,
            Category: category,
            itemsNumber: 0,
            Supply: 0
          };
        });
        await Promise.all(
          perparedData.map(ele =>
            this.api("global/create_one", {
              table: "TransferListBalancer",
              where: ele
            })
          )
        );
      }
      this.deleteRouteByName("/TransferListBalancer");
      this.$router.push(
        `/TransferListBalancer/${item.ID_KEY}/${category}/${item.DateOfTransferList}/${item.TimeFirstSergant}/${item.type}`
      );
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID_KEY"],
        dates = ["DateOfTransferList"],
        multi = [];

      where = this.mapToQuery(where, likes, multi, dates);
      this.api("global/get_all", {
        table: "TransferList"
      })
        .then(x => {
          let data = lodash.flatten(
            x.data.map(ele => [
              { ...ele, type: 1 },
              { ...ele, type: 2, Name: ele.Name + " للمخابرات" }
            ])
          );
          this.$set(this.mainTable, "items", data);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async actionAdd() {
      this.$set(this, "TransferNew", {
        isEdit: false
      });
      if (this.id) {
        await this.findOne(this.id);
      }
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    async actionFillData(item) {
      this.$set(this, "showFillDialog", true);
      this.$set(this, "TransferNew", {
        ...item
      });
    },
    actionRouteToDetails(item) {
      this.$router.push(`/TransferListDetails/${item.ID_KEY}/${item.type}`);
    }
  }
};
</script>
