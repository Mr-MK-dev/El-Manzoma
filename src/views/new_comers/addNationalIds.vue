<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      :addButton="false"
      title="مستجدين المرحلة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :hasSort="true"
      :items="mainTable.items"
      :loading="searchLoading"
      :title="''"
    >
      <template v-slot:item.actions="{ item }">
        <v-chip class="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
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
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="Soldier"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "AddNationalIdsReview",
  mounted() {
    this.init();
  },
  data: () => ({
    search: {},
    Soldier: {},
    searchLoading: false,
    mainTable: {
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
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          readOnly: true,

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
          readOnly: true,
          sort: 1
        },
        {
          text: "رقم السجل",
          value: "IndexNo",
          searchValue: "IndexNo",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "تاريخ الوصول",
          value: "ArrivalDate",
          searchValue: "ArrivalDate",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: false,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Status",
          searchValue: "Status",
          sortable: true,
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوظيفة",
          value: "Duty.Duty",
          searchValue: "DutyID",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "منطقة التجنيد",
          value: "RecuRegion",
          searchValue: "RecuRegion",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "المهنة",
          value: "Job",
          searchValue: "Job",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: false,
          sort: 1
        },

        {
          text: "رقم الثلاثي",
          value: "TripleNo",
          searchValue: "TripleNo",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الرقم القومي",
          value: "IdentityNo",
          searchValue: "IdentityNo",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          readOnly: false,
          required: true,
          inModel: true
        },
        {
          model: "BirthDate",
          label: "تاريخ الميلاد",
          type: "date",
          sortable: false,
          inTable: false,
          inSearch: false,
          readOnly: false,
          inModel: false
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true,
          readOnly: true
        }
      ],
      items: [],
      printer: []
    },
    hasUnit: false,
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
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      General_Direction: {
        table: "Unit",
        value: "General_Direction",
        text: "General_Direction"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      isPrinted: {
        text: "text",
        value: "value",
        data: [
          {
            value: false,
            text: "لا"
          },
          {
            value: true,
            text: "نعم"
          },
          {
            value: undefined,
            text: "الكل"
          }
        ]
      }
    },
    createdObject: {
      model: false
    }
  }),
  watch: {
    "Soldier.IdentityNo"(v) {
      if (v.length == 14) {
        console.log("asdasdasdasdasdasd", v);
        this.$set(this.Soldier, "BirthDate", this.nationalIdToDate(v));
      }
    }
  },
  methods: {
    handelFileIsOpened() {
      this.$confirm(`هل تم الطباعة ؟ `, {
        title: ``
      })
        .then(async res => {
          if (res) {
            //
            await this.api(`global/queryRunners`, {
              query: `UPDATE [dbo].[Soldier] SET [isPrinted]=1 WHERE ID in (${this.mainTable.items
                .map(ele => `N'${ele.ID}'`)
                .join(",")})`
            });
          }
          this.findItems(this.search);
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    initDates() {
      let dates = this.mainTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    async saveItem() {
      this.$set(this.createdObject, "loading", true);
      try {
        const saveItem = await this.api(`global/update_one`, {
          table: "Soldier",
          where: {
            ID: this.Soldier.ID
          },
          update: this.Soldier
        });
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.createdObject, "model", false;
          this.findItems(this.search);
          this.Soldier = {};
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "loading", false);

        this.$set(this.createdObject, "model", false);
      } catch (e) {
        this.handleError(e);
      }
    },
    actionEdit(item) {
      this.Soldier = item;
      this.hasUnit = item.UnitID;
      this.createdObject.model = true;
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.search = filters;
      if (!this.search.RecuStage) {
        this.showError("يجب اختيار المرحلة اولا");
        return;
      }
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Soldier",
          where: this.cleanObject({
            RecuStage: filters.RecuStage,
            RecuRegion: filters.RecuRegion,
            UnitID: filters.UnitID,
            KnowledgeLevel: filters.KnowledgeLevel,
            isPrinted: filters.isPrinted
          }),
          include: [
            {
              model: "Unit",
              where: this.cleanObject({
                General_Direction: filters.General_Direction
              })
            },
            {
              model: "Duty"
            }
          ]
        });
        let data = x.data,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(
              f => f.inTable && f.text.length
            )
          };
        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
