<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        @on-search="findItems"
        :clearOption="true"
        title="أفراد  مكان العمل"
        addBtnTitle="إضافة فرد"
        :addButton="false"
    />
    <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'أفراد  مكان العمل'"
    >


    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "WorkPlaceAllDataConscriptes",
  mounted() {
    this.findItems({});
  },
  data: () => ({
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    searchLoading: false,
    TypeObject: {
      model: false,
      item: {}
    },

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
          text: "نوع االقوة",
          value: "PowerType",
          searchValue: "PowerType",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: false,
          inModel: false,
          required: true,
          multiple: true,
          sort: 1
        },
        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: false,
          inModel: false,
          required: true,
          multiple: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Conscripte.Level",
          searchValue: "Level",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: false,
          inModel: false,
          required: true,
          multiple: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Conscripte.Name",
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
          text: "الوحدة",
          value: "Conscripte.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          multiple: true,
          sort: 1
        },
        {
          text: "السلاح",
          value: "Conscripte.Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inSearch: false,
          multiple: true,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "Conscripte.KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: false,
          inModel: true,
          inSearch: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "مكان العمل",
          value: "followerwork.workplace",
          searchValue: "WorkPlaceID",
          type: "text",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: false,
          readOnly: true,
          sort: 1
        }
      ],
      items: [],
      printer: []
    },
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let data = await this.api("global/get_all", {
        table: "WorkPlaceMainPower",
        where :{
          WorkPlaceID : this.$route.params.id
        },
        include: [{
          model: "followerwork"
        }],
      });
      let items = [];
      for (const ele of data.data) {
        var con = await this.fetchDataBaseOnType(
            ele.ID,
            ele.Type == "مجند"
                ? "Soldier"
                : "Rateb",
            "Conscripte"
        );
        items.push({
          ...ele,
          PowerType :"قوة اساسية" ,
          ...con
        });
      }

      let followersolider = await this.api("global/get_all", {
        table: "followersolider",
        where :{
          workplace: this.$route.params.id,
          isEnrolled: true,
        },
        include: [{
          model: "followerwork"
        }],
      });

      for (const ele of followersolider.data) {
        var sold = await this.fetchDataBaseOnType(
            ele.ID,
             "Soldier",
            "Conscripte"
        );
        items.push({
          ...ele,
          Type   :"مجند",
          PowerType :"ملحق" ,
          ...sold
        });
      }

      let followerrateb = await this.api("global/get_all", {
        table: "Followerrateb",
        where :{
          workplace : this.$route.params.id,
          isEnrolled :true,
        },
        include: [{
          model: "followerwork"
        }],
      });

      for (const ele of followerrateb.data) {
        var rat = await this.fetchDataBaseOnType(
            ele.ID,
             "Rateb",
            "Conscripte"
        );
        items.push({
          ...ele,
          Type   :"راتب عالي",
          PowerType :"ملحق" ,
          ...rat
        });
      }

      console.log(items);
      this.$set(this.mainTable, "items", items);
      this.$set(this.mainTable, "printer", {
        data: items,
        excelKey: "data",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable),
        hasParent: true
      });
    },
  }
};
</script>
