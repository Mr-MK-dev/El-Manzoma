<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      :addButton="false"
      title="تراخيص نقل المستجدين"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :hasSort="true"
      @fileIsOpened="handelFileIsOpened()"
      :items="mainTable.items"
      :wordFile="'/new_commers/transportLicense'"
      :title="''"
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
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "newComersTransportLicense",
  mounted() {
    this.init();
  },
  data: () => ({
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
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
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          sort: 1
        },
        {
          text: "تاريخ الوصول",
          value: "ArrivalDate",
          searchValue: "ArrivalDate",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
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
          sort: 1
        },
        {
          text: "تم طباعته من قبل",
          value: "isPrinted",
          searchValue: "isPrinted",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
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
    }
  }),
  watch: {},
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
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.search = filters;
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Soldier",
          where: this.cleanObject({
            RecuStage: filters.RecuStage,
            UnitID: filters.UnitID,
            KnowledgeLevel: filters.KnowledgeLevel,
            isPrinted: filters.isPrinted,
            WeaponID: 52
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
        let data = x.data.map(ele => ({
            ...ele,
            isPrinted: ele.isPrinted ? "نعم" : "لا"
          })),
          printer = {
            data: [
              ...data.map((ele, index) => ({
                ...ele,
                index: index + 1,
                unit: ele?.Unit?.Unit?.replace("(", "")?.replace(")", ""),
                duty: ele.Duty.Duty,
                notes: ele.Notes || ""
              }))
            ],
            unit:
              filters.General_Direction ||
              data[0]?.Unit.Unit.replace("(", "")?.replace(")", "") ||
              "",
            RecuStage: data[0]?.RecuStage || "",
            StageNumber: constants.RecuStage.data.find(
              ele => ele.text == data[0]?.RecuStage.split("-")[0]
            )?.count,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
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
