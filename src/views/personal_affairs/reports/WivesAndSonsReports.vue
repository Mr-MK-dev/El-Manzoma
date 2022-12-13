<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        :selects="selects"
        @on-search="findItems"
        :clearOption="true"
        title="بحث متقدم في الاقارب"
    />

    <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'الاقارب'"
    >
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
const lodash = require("lodash");
export default {
  name: "WivesAndSonsReports",
  mounted() {
    this.init();
  },
  data: () => ({
    groupedItems: [],
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
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "النوع",
          value: "MilitaryType",
          searchValue: "MilitaryType",
          sortable: true,
          type: "select",
          inTable: false,
          inSearch: true,
          inModel: true,
          multiple: true,
          required: true,
          sort: 1
        },
        {
          text: "الرتبة",
          value: "Level",
          searchValue: "Level",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الحالة",
          value: "Kind",
          searchValue: "Kind",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
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
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: " الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          type: "select",
          multiple: true,
          sortable: true,
          inTable: true,
          inSearch: true,
          required: false,
          inModel: false
        },

        {
          text: "اسم الزوجة",
          value: "WifeName",
          searchValue: "WifeName",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "أسماء الأبناء",
          value: "kidsNames",
          searchValue: "kidsNames",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "هاتف الزوجة",
          value: "WifeTele",
          searchValue: "WifeTele",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: " الحالة الاجتماعية",
          value: "MartialStatus",
          searchValue: "MartialStatus",
          type: "select",
          multiple: true,
          sortable: true,
          inTable: true,
          inSearch: true,
          required: false,
          inModel: false
        },
        {
          text: "عنوان الزوجة",
          value: "WifeAddress",
          searchValue: "WifeAddress",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "أسم الوالد",
          value: "fatherName",
          searchValue: "fatherName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "عوان الوالد",
          value: "fatherAddress",
          searchValue: "fatherAddress",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "أسم الوالدة",
          value: "motherName",
          searchValue: "motherName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "رقم هاتف الوالد",
          value: "parentPhone",
          searchValue: "parentPhone",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Level: {
        text: "text",
        value: "text",
        data: [
          ...constants.ratebLevels,
          ...constants.SoldierLevel.data,
          ...constants.OfficerLevels.data
        ]
      },
      MilitaryType: {
        text: "text",
        value: "text",
        data: [...constants.militaryTypes]
      },
      MartialStatus: {
        text: "text",
        value: "text",
        data: constants.matrialStatus.data
      },
    }
  }),

  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
            ...filters,
            UnitID: "",
            Name: ""
          },
          likes = ["ID"],
          multi = ["MilitaryType"],
          date = ["Date"];

      where = this.mapToQuery(where, likes, multi, date);
      let data = await this.api("global/get_all", {
        table: "Wives",
        where: where,
        include: [
          {
            model: "Kids"
          }
        ]
      });

      let parents = await this.api("global/get_all", {
        table: "ParentsAndBrothers"
      });

      let groupedData = lodash.groupBy(data.data, ele => ele.ID);
      let groupedParents = lodash.groupBy(parents.data, ele => ele.ID);


      console.log("grouped Data", groupedData);
      console.log("grouped Parents", groupedParents);
      let items = [];
      for (const ele of Object.keys(groupedData)) {
        console.log("eleee", groupedData[ele]);
        var martyr = await this.fetchDataBaseOnType(
            groupedData[ele][0].ID,
            groupedData[ele][0].MilitaryType == "مجند"
                ? "Soldier"
                : groupedData[ele][0].MilitaryType == "ضابط"
                    ? "Officer"
                    : "Rateb",
            "Martyr"
        );
        let kids = [];
        let kidsNamesAndAges = "";
        // let fatherName = "";
        // let motherName = "";
        for (const mom of groupedData[ele]) {
          kids.push(mom.Kids);
          kidsNamesAndAges += mom.Kids
              ? mom.Kids?.KidName +
              `(${this.calculateAge(
                  this.nationalIdToDate(mom.Kids?.KidNationalID)
              )} سنة)` +
              "\n"
              : " ";
        }

        items.push({
          ...groupedData[ele][0],
          ...martyr.Martyr,
          Kids: kids,
          kidsNames: kidsNamesAndAges,
          fatherName: groupedParents[ele]!=null ? groupedParents[ele].find(el => el.RelevantType == "الوالد") != null ? groupedParents[ele].find(el => el.RelevantType == "الوالد").RelevantName : "" :"",
          fatherAddress: groupedParents[ele]!=null ?groupedParents[ele].find(el => el.RelevantType == "الوالد") != null ? groupedParents[ele].find(el => el.RelevantType == "الوالد").Address : "" :"",
          motherName:groupedParents[ele]!=null ? groupedParents[ele].find(el => el.RelevantType == "الوالدة") != null ? groupedParents[ele].find(el => el.RelevantType == "الوالد").Address : "" :"",
          parentPhone:groupedParents[ele]!=null ?  groupedParents[ele][0].tele : "",

        });
      }


      for (const ele of Object.keys(groupedParents)) {
        console.log("asdasd", groupedData[ele]);
        if(!items.map(el=>el.ID).includes(ele)){
          var martyrData = await this.fetchDataBaseOnType(
              ele,
              groupedParents[ele][0].MilitaryType == "مجند"
                  ? "Soldier"
                  : groupedParents[ele][0].MilitaryType == "ضابط"
                      ? "Officer"
                      : "Rateb",
              "Martyr"
          );
        }
        let kids = [];
        let kidsNamesAndAges = "";
        // let fatherName = "";
        // let motherName = "";

        items.push({
          ...groupedParents[ele][0],
          ...martyrData.Martyr,
          Kids: kids,
          kidsNames: kidsNamesAndAges,
          fatherName: groupedParents[ele]!=null ? groupedParents[ele].find(el => el.RelevantType == "الوالد") != null ? groupedParents[ele].find(el => el.RelevantType == "الوالد").RelevantName : "" :"",
          fatherAddress: groupedParents[ele]!=null ?groupedParents[ele].find(el => el.RelevantType == "الوالد") != null ? groupedParents[ele].find(el => el.RelevantType == "الوالد").Address : "" :"",
          motherName:groupedParents[ele]!=null ? groupedParents[ele].find(el => el.RelevantType == "الوالدة") != null ? groupedParents[ele].find(el => el.RelevantType == "الوالد").Address : "" :"",
          parentPhone:groupedParents[ele]!=null ?  groupedParents[ele][0].tele : "",

        });
      }


      console.log("Items", items);
      if (filters.UnitID != null && filters.UnitID.length > 0) {
        items = items.filter(ele => filters.UnitID.includes(ele.UnitID));
      }






      if (filters.Name && filters.Name != "") {
        items = items.filter(ele => ele.Name?.includes(filters.Name));
      }
      let printer = {
        data: [
          ...items.map(ele => ({
            ...ele
          }))
        ],
        excelKey: "data",
        excelHeaders: this.mainTable.headers.filter(
            f => f.inTable && f.text.length
        )
      };
      this.$set(this.mainTable, "items", items);
      this.$set(this.mainTable, "printer", printer);
    }
  }
};
</script>
