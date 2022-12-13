<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      :clearOption="false"
      :addButton="false"
      :search="search"
      @on-search="data => fetchData(data)"
      title="الوظائف الغير الموجودة في كود التنظيم"
    />



    <v-card-actions class="px-4 py-4">
<!--      <v-btn-->
<!--          class="px-6"-->
<!--          @click="showUnUsedDuties"-->
<!--          large-->
<!--          color="primary"-->
<!--          v-text="'عرض الوظائف الغير مستخدمة'"-->
<!--      />-->


      <v-btn
          class="px-6"
          @click="deleteUnUsedDuties"
          large
          color="primary"
          v-text="'حذف الوظائف الغير مستخدمة'"
      />

    </v-card-actions>


    <table-bulider
        :headers="headers"
        :items="items"
        :loading="searchLoading"
        :title="'عرض وظائف الادارة'"
    >
      <template v-slot:item.ValidDutyID="{ item }">
        <v-autocomplete
            :label="`الوظيفة المراد استبدالها به`"
            :hint="`الوظيفة المراد استبدالها به`"
            v-model=item.ValidDutyID
            :items="
                    selects['ValidDutyID'] ? selects['ValidDutyID'].data : []
                  "
            :multiple="false"
            :item-value="
                    selects['ValidDutyID'] ? selects['ValidDutyID'].value : ''
                  "
            :item-text="
                    selects['ValidDutyID'] ? selects['ValidDutyID'].text : ''
                  "
            filled
            :error-messages="
                    selects['ValidDutyID'] ? selects['ValidDutyID'].error : ''
                  "
            :append-icon="
                    selects['ValidDutyID'] && selects['ValidDutyID'].error
                      ? 'mdi-refresh'
                      : 'mdi-chevron-down'
                  "
            @click:append="
                    selects['ValidDutyID'] && selects['ValidDutyID'].error
                      ? init('ValidDutyID')
                      : () => {}
                  "
            :loading="
                    (selects['ValidDutyID'] &&
                      selects['ValidDutyID'].loading) ||
                     loading
                  "
            clearable
        >
          <template
              v-if="
                      search['ValidDutyID'] && search['ValidDutyID'].length > 10
                    "
              v-slot:selection="{ item, index }"
          >
            <v-chip v-if="index === 0">
              <span>{{ item.text }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ search['ValidDutyID'].length - 1 }} اخري)
                    </span>
          </template>
        </v-autocomplete>

      </template>

    </table-bulider>


    <v-card-actions class="px-4 py-4">
      <v-btn
          class="px-6"
          @click="replaceData"
          large
          color="primary"
          v-text="'استبدال الوظائف '"
      />

    </v-card-actions>

  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "Duties",

  mounted() {
    this.init();
    this.fetchData();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Duty: {
      isConfirmed: false
    },
    items: [],
    headers: [
      {
        text: "جهة الامداد",
        value: "Weapon.Weapon",
        searchValue: "WeaponID",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        required: false,
        sort: 1
      },

      {
        text: "الوظائف الغير موجودة في الكود",
        value: "Duty",
        searchValue: "InValidDutyID",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: true,
        inTable: true,
        inModel: true,
        required: false,
        sort: 1
      },
      {
        text: "الوظائف المراد استبدالها بها",
        value: "ValidDutyID",
        searchValue: "ValidDutyID",
        sortable: true,
        type: "select",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: false,
        sort: 1
      }
    ],
    selects: {
      InValidDutyID: {
        text: "Duty",
        value: "DutyID",
        data: []
      },
      ValidDutyID: {
        text: "Duty",
        value: "DutyID",
        data: []
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
    }
  }),
  methods: {
    async fetchData(data) {

      console.log("Search Data is",data)
      let tanzemDutiesIds = {};
      var x = await this.api("global/get_all", {
        table: "MortabatDuties",
       where :  data !=null ?{
          WeaponID : data.WeaponID
        } : null
      });
      tanzemDutiesIds = lodash.uniq(x.data.map(ele => ele.DutyID));

      console.log("tanzemDuties", tanzemDutiesIds);

      var duties = await this.api("global/get_all", {
        table: "Duty",
        where :  data !=null ?{
          WeaponID : data.WeaponID
        } : null,
        include: [
          {
            model: "Weapon"
          }
        ]
      });

      console.log("all Duties ara ", duties.data);

      var dutiesInMoratbat = duties.data.filter(ele =>
        tanzemDutiesIds.includes(ele.DutyID)
      );
      var dutiesNotInMoratbat = duties.data.filter(
        ele => !tanzemDutiesIds.includes(ele.DutyID)
      );

      console.log("dutiesInMoratbat", dutiesInMoratbat);
      console.log("dutiesNotInMoratbat", dutiesNotInMoratbat);

      this.selects.InValidDutyID.data = dutiesNotInMoratbat;
      this.selects.ValidDutyID.data = dutiesInMoratbat;
      this.$set(this , "items" , dutiesNotInMoratbat);
    },
    async replaceData(data) {
      console.log("items" , this.items);


      for (let i = 0 ; i <this.items.length ; i++){
        if(this.items[i].ValidDutyID !=null){
          let invalidSoldiers = await this.api("global/get_all", {
            table: "Soldier",
            where: {
              DutyID: this.items[i].DutyID
            }
          });

          let invalidRatebs = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              DutyID: this.items[i].DutyID
            }
          });

          for (let j = 0; j < invalidSoldiers.data.length; j++) {
          await  this.api("global/update_one", {
              table: "Soldier",
              where: { ID: invalidSoldiers.data[j].ID },
              update: { DutyID:this.items[i].ValidDutyID }
            });
          }
          for (let j = 0; j < invalidRatebs.data.length; j++) {
          await  this.api("global/update_one", {
              table: "Rateb",
              where: { ID: invalidSoldiers.data[j].ID },
              update: { DutyID: this.items[i].ValidDutyID }
            });
          }
        }
      }
      // console.log(data.ValidDutyID)
      // console.log(data.InValidDutyID)

      //


      //

    },
    // async showUnUsedDuties() {
    //   var duties = await this.api("global/get_all" , {
    //     table : "Duty"
    //   })
    //
    //   console.log("Duties" , duties.data);
    //   var dutiesIds = duties.data.map(ele=>ele.DutyID);
    //
    //   const soliders = await this.api("global/get_all", {
    //     table: "Soldier",
    //   });
    //   const rateb = await this.api("global/get_all", {
    //     table: "Rateb"
    //   });
    //
    //
    //   let usedDuties = lodash.uniq(soliders.data.map(ele =>ele.DutyID).filter(ele=>dutiesIds.includes(ele))).concat(lodash.uniq(rateb.data.filter(ele=>ele!="" && dutiesIds.includes(ele)).map(ele =>parseInt(ele.DutyID))))
    //
    //   console.log("Used Duties" , lodash.uniq(usedDuties))
    //   console.log(" Duties" , dutiesIds)
    //
    //   let notUsedDuties = dutiesIds.filter(ele=>!lodash.uniq(usedDuties).includes(ele));
    //   console.log(" InterSection" , lodash.intersection(usedDuties , notUsedDuties))
    //
    //   console.log(" Union" , lodash.uniq(lodash.union(usedDuties , notUsedDuties)))
    //     notUsedDuties = notUsedDuties.filter(ele=>!this.selects.ValidDutyID.data.map(ele=>ele.DutyID).includes(ele));
    //   console.log("Not Used Duties" , notUsedDuties)
    //
    //   for (let i =0 ; i <notUsedDuties.length ; i++){
    //     await this.api("global/delete_all",{
    //       table :"Duty",
    //       where :{
    //         DutyID :notUsedDuties[i]
    //       }
    //     })
    //
    //
    //   }
    //   this.showSuccess("تم بنجاح") ;
    //   await this.fetchData();// console.log("Not Used Duties" , dutiesIds - usedDuties)
    //
    //
    //
    //
    //
    // },
    async deleteUnUsedDuties() {
      var duties = await this.api("global/get_all" , {
        table : "Duty"
      })

      console.log("Duties" , duties.data);
      var dutiesIds = duties.data.map(ele=>ele.DutyID);

      const soliders = await this.api("global/get_all", {
        table: "Soldier",
      });
      const rateb = await this.api("global/get_all", {
        table: "Rateb"
      });


      let usedDuties = lodash.uniq(soliders.data.map(ele =>ele.DutyID).filter(ele=>dutiesIds.includes(ele))).concat(lodash.uniq(rateb.data.filter(ele=>ele!="" && dutiesIds.includes(ele)).map(ele =>parseInt(ele.DutyID))))

      console.log("Used Duties" , lodash.uniq(usedDuties))
      console.log(" Duties" , dutiesIds)

      let notUsedDuties = dutiesIds.filter(ele=>!lodash.uniq(usedDuties).includes(ele));
      console.log(" InterSection" , lodash.intersection(usedDuties , notUsedDuties))

      console.log(" Union" , lodash.uniq(lodash.union(usedDuties , notUsedDuties)))
        notUsedDuties = notUsedDuties.filter(ele=>!this.selects.ValidDutyID.data.map(ele=>ele.DutyID).includes(ele));
      console.log("Not Used Duties" , notUsedDuties)
      await this.api("global/delete_all",{
        table :"Duty",
        where :{
          DutyID : {
            $in :notUsedDuties
          }
        }
      })
      this.showSuccess("تم بنجاح") ;
      await this.fetchData();// console.log("Not Used Duties" , dutiesIds - usedDuties)





    }
    }

};
</script>
