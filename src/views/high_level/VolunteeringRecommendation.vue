<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        :selects="selects"
        @on-search="findItems"
        @on-add="actionAdd()"
        :clearOption="true"
        title="بحث متقدم في توصيات التطوع"
        addBtnTitle="إضافة توصية تطوع"
    />
    <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'توصيات التطوع'"
    >
      <template v-slot:item.actions="{ item }">
        <v-chip color="transparent">
          <v-btn
              v-if="hasEditAccess()"
              icon
              @click="actionEdit(item)"
              color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
              v-if="hasDeleteAccess()"
              icon
              color="transparent"
              @click="deleteItem(item)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.IsVerified="{ item }">
        <v-chip
            :color="item.IsVerified ? 'success' : 'error'"
        >
          {{ item.IsVerified ? "تم التصديق" : "لم يتم التصديق" }}
        </v-chip>
      </template>

      <template v-slot:item.FieldValue1="{ item }">
        <v-chip
            :color="item.FieldValue1 ? 'success' : 'error'"
        >
          {{ item.FieldValue1 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue2="{ item }">
        <v-chip
            :color="item.FieldValue2 ? 'success' : 'error'"
        >
          {{ item.FieldValue2 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue3="{ item }">
        <v-chip
            :color="item.FieldValue3 ? 'success' : 'error'"
        >
          {{ item.FieldValue3 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue4="{ item }">
        <v-chip
            :color="item.FieldValue4 ? 'success' : 'error'"
        >
          {{ item.FieldValue4 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue5="{ item }">
        <v-chip
            :color="item.FieldValue5 ? 'success' : 'error'"
        >
          {{ item.FieldValue5 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue6="{ item }">
        <v-chip
            :color="item.FieldValue6 ? 'success' : 'error'"
        >
          {{ item.FieldValue6 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue7="{ item }">
        <v-chip
            :color="item.FieldValue7 ? 'success' : 'error'"
        >
          {{ item.FieldValue7 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue8="{ item }">
        <v-chip
            :color="item.FieldValue8 ? 'success' : 'error'"
        >
          {{ item.FieldValue8 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue9="{ item }">
        <v-chip
            :color="item.FieldValue9 ? 'success' : 'error'"
        >
          {{ item.FieldValue9 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue10="{ item }">
        <v-chip
            :color="item.FieldValue10 ? 'success' : 'error'"
        >
          {{ item.FieldValue10 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue11="{ item }">
        <v-chip
            :color="item.FieldValue11 ? 'success' : 'error'"
        >
          {{ item.FieldValue11 ? "مضى" : "قصر" }}
        </v-chip>
      </template>
      <template v-slot:item.FieldValue12="{ item }">
        <v-chip
            :color="item.FieldValue12 ? 'success' : 'error'"
        >
          {{ item.FieldValue12 ? "مضى" : "قصر" }}
        </v-chip>
      </template>

    </table-bulider>
    <editor-dialog-bulider
        :title="'إضافة توصية تطوع'"
        :open="createdObject.model"
        :loading="createdObject.loading"
        :fields="mainTable.headers"
        :selects="selects"
        :data="recommendation"
        @on-submit="saveItem()"
        @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash")
export default {
  name: "VolunteeringRecommendation",
  mounted() {
    this.findItems({});
    this.init();
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
    recommendation: {},
    search: {},
    searchLoading: false,
    constHeaders :[
      {
        text: "",
        value: "actions",
        searchValue: "actions",
        sortable: true,
        type: "checkbox",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "الاسم",
        value: "name",
        searchValue: "name",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },

      {
        text: "الرقم الثلاثي",
        value: "thirdnumber",
        searchValue: "thirdnumber",
        sortable: true,
        type: "tribleNum",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "منطقة التجنيد",
        value: "RecRegion",
        searchValue: "RecRegion",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "اسم الموصي",
        value: "RecommenderName",
        searchValue: "RecommenderName",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "اسم الموصي الفرعي",
        value: "SecondRecommenderName",
        searchValue: "SecondRecommenderName",
        type: "text",
        sortable: true,
        inTable: true,
        inModel: true,
        inSearch: true,
        sort: 1
      },
      {
        text: "تم التصديق",
        value: "IsVerified",
        searchValue: "IsVerified",
        sortable: true,
        type: "select",
        inTable: true,
        inSearch: true,
        inModel: true,
        sort: 1
      },
      {
        text: " اسم المصدق",
        value: "Certificator",
        searchValue: "Certificator",
        type: "select",
        sortable: true,
        inTable: true,
        inSearch: true,
        inModel: true
      },
      {
        text: "مستمر",
        value: "Continued",
        searchValue: "Continued",
        type: "select",
        sortable: false,
        inTable: false,
        inSearch: true,
        inModel: false
      },
    ],
    mainTable: {
      headers: [],
      items: [],
      printer: []
    },
    selects: {
      IsVerified: {
        text: "text",
        value: "value",
        data: [
          {
            text: "تم التصديق",
            value: true
          },
          {
            text: "لم يتم التصديق",
            value: false
          }
        ]
      },
      RecRegion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      Certificator: {
        table: "Certificators",
        text: "Name",
        value: "Name"
      },
      Continued: {
        text: "text",
        value: "value",
        data:[
          {
            text :"مستمر ",
            value:true
          },
          {
            text :"قصر ",
            value:false
          },
        ]
      },
    }
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
            ...filters,
            Continued:""
          },
          likes = ["name"],
          multi = [],
          date = [];






      where = this.mapToQuery(where, likes, multi, date);
      try {
        const result = await this.api("global/get_all", {
          table: "VolunteeringRecommendation",
          where: where,
          include: [
            {model: "VolunteersProcedures"}
          ]
        });


        let groupedData = lodash.groupBy(result.data, ele => ele.ID_KEY)


        console.log("Volunteers", groupedData);

        let items = [];
        let addedHeaders = [];
        Object.keys(groupedData).forEach(key => {

              let candidate = {...groupedData[key][0]};

              for (let i = 0; i < groupedData[key].length; i++) {
                if(addedHeaders.find(ele=>ele.text == groupedData[key][i].VolunteersProcedures.FieldName) == null) {
                  addedHeaders.push({
                    text: groupedData[key][i].VolunteersProcedures.FieldName,
                    value: `FieldValue${i+1}`,
                    searchValue: `FieldValue${i+1}`,
                    sortable: true,
                    type: "checkbox",
                    inTable: true,
                    inSearch: false,
                    inModel: true,
                    sort: 1
                  });

                }

                candidate = {
                  ...candidate,
                  [`FieldValue${i+1}`]: groupedData[key][i].VolunteersProcedures.FieldValue
                }
              }
              items.push(candidate)
            }
        )





        console.log("Items" , items)
        this.$set(this.mainTable, "items", items);

        if(items.length==0){


          let followedFields = await this.api("global/get_all", {
            table: "VolunteeringTimePlan",
            where: {
              IsFollowed: true
            }
          });
          for (let i =0 ; i < followedFields.data.length ; i++){
            addedHeaders.push({
              text: followedFields.data[i].title,
              value: `FieldValue${i+1}`,
              searchValue: `FieldValue${i+1}`,
              sortable: true,
              type: "checkbox",
              inTable: true,
              inSearch: false,
              inModel: true,
              sort: 1
            });
          }
        }




        this.$set(this.mainTable, "headers", [
          ...this.constHeaders,
          ...addedHeaders
        ])
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      console.log("REEECC", this.recommendation)
      let saveItem;
      try {
        let followedFields = await this.api("global/get_all", {
          table: "VolunteeringTimePlan",
          where: {
            IsFollowed: true
          }

        });


        if(this.recommendation.isEdit){
          await this.api("global/delete_all" ,{
            table :"VolunteersProcedures",
            where :{
              VolunteerID:this.recommendation.ID_KEY
            }
          });
        }

        //
        // let i =1;
        // for (const field of followedFields.data) {
        //   this.$set(this ,"recommendation" , {
        //     ...this.recommendation,
        //     [`FiledID${i}`] : followedFields.data[i].ID_KEY
        //   } );
        //   i++;
        // }


        saveItem = await this.api(
            !this.recommendation.isEdit ? `global/create_one` : `global/update_one`,
            {
              table: "VolunteeringRecommendation",
              where: !this.recommendation.isEdit
                  ? this.recommendation
                  : {
                    ID_KEY: this.recommendation.ID_KEY
                  },
              update: this.recommendation
            }
        );

        if (saveItem && saveItem.data && saveItem.ok) {

          let data = await this.api("global/get_all", {
            table: "VolunteeringRecommendation",
          });


          if(this.recommendation.isEdit){
            for (let i = 0 ;  i< followedFields.data.length ; i++) {

              await this.api("global/create_one", {
                table: "VolunteersProcedures",
                where: {
                  VolunteerID:this.recommendation.ID_KEY,
                  FieldName: followedFields.data[i].title,
                  FieldValue: this.recommendation[`FieldValue${i+1}`],
                  FieldID: followedFields.data[i].ID_KEY
                }
              });
            }
          }
          else{
            for (let i = 0 ;  i< followedFields.data.length ; i++) {

              await this.api("global/create_one", {
                table: "VolunteersProcedures",
                where: {
                  VolunteerID: data.data[data.data.length- 1].ID_KEY,
                  FieldName: followedFields.data[i].title,
                  FieldValue: this.recommendation[`FieldValue${i+1}`],
                  FieldID: followedFields.data[i].ID_KEY
                }
              });
            }

          }



          this.showSuccess("تم حفظ ");
          await this.findItems({});

          // this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "loading", false);
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    actionAdd() {
      this.$set(this, "recommendation", {});

      this.$set(this, "recommendation", {isEdit: false});

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "recommendation", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);

      await this.api("global/delete_all", {
        table: "VolunteersProcedures",
        where: {
          VolunteerID: item.ID_KEY
        }
      });

      let delItem = await this.api("global/delete_all", {
        table: "VolunteeringRecommendation",
        where: {
          ID_KEY: item.ID_KEY
        }
      });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم حذف التوصية`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.findItems({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    },

  },

};
</script>
