<template>
  <div>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'أماكن العمل'">
    </table-bulider>

  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "AdditionsWorkPlacesFollowersDaily",

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
    searchLoading: false,
    loading: false,
    showFillDialog: false,
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
          text: "مكان العمل",
          value: "WorkPlacesAddition.followerwork.workplace",
          searchValue: "WorkPlacesAddition.followerwork.workplace",
          sortable: true,
          type: "text",
          inSearch: true,
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
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Level",
          searchValue: "Level",
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
          required: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "Unit",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          required: true,
          sort: 1
        },
        {
          text: "الموصي",
          value: "Follower.Recommender",
          searchValue: "Recommender",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          required: true,
          sort: 1
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    }
  }),

  methods: {


    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      this.api("global/get_all", {
        table: "AdditionsWorkPlacesFollowers",
        include :[
          {
            model :"WorkPlacesAdditions",
            include :[
              {
                model:"followerwork"
              }
            ]
          }
        ]
      })
        .then(async x => {
          let data = x.data.map(ele => ({
            ...ele
          }));
          let returnedItems = [];
          for (const element of data) {
            var e = await this.api("sections/tasgeel/search/enrollers", {
              search: {
                ID: element.ID,
                Type: ["مجند", "راتب عالى"]
              }
            });
            console.log("Follower" , e);
            var follower = e.data[0];

            returnedItems.push({
              ...element,
              Follower:follower,
              Unit: follower?.Soldier?.Unit?.Unit || follower?.Rateb?.Unit?.Unit,
              Level: follower?.Soldier?.SoldierLevel || follower?.Rateb?.RatebLevel,
              Name: follower?.Soldier?.Name || follower?.Rateb?.Name,
              Status: follower?.Soldier?.Status || follower?.Rateb?.Status,
            });
          }

        returnedItems = lodash.sortBy(returnedItems , ele=>ele.WorkPlaceAdditionsID);

          console.log(returnedItems)
          this.$set(this.mainTable, "items", returnedItems);
          this.$set(this.mainTable , "printer" , {
            cons: [...returnedItems],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          })
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
