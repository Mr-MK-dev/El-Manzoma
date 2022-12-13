<template>
  <div>
    <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'يومية عددية بتمامات ضباط القيادة'"
        :isExcel="true"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "FullOfficersDaily",

  components: {},

  mounted() {
    this.init();
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

    listType: "all",
    searchLoading: false,
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    },
    mainTable: {
      headers: [
        {
          text: "الشعبة",
          value: "Branch",
          searchValue: "Branch",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "عامل",
          value: "Workers",
          searchValue: "Workers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          parent: "قوة ضباط القيادة",
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "إحتياط",
          value: "Spare",
          searchValue: "Spare",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          parent: "قوة ضباط القيادة",
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "شرفي",
          value: "Honor",
          searchValue: "Honor",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          parent: "قوة ضباط القيادة",
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تعاقد ش.ض",
          value: "Contract",
          searchValue: "Contract",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "إجمالي",
          value: "Total",
          searchValue: "Total",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },


      ],
      items: [],
      printer: {},
      printedData: {}
    },

    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);

      const vacations = await this.api("global/get_all", {
        table: "Vacations"
      });
      const missions = await this.api("global/get_all", {
        table: "Missions"
      });
      const courses = await this.api("global/get_all", {
        table: "Courses"
      });

      const officerCourses = await this.api("global/get_all", {
        table: "OfficerCourses"
      });

      const officerMissions = await this.api("global/get_all", {
        table: "OfficerMissions"
      });

      const officerVacations = await this.api("global/get_all", {
        table: "OfficerVacations"
      });


      let groupedVacations = lodash.groupBy(officerVacations.data , ele=>ele.VacationID)
      let groupedMissions = lodash.groupBy(officerMissions.data , ele=>ele.MissionID)
      let groupedCourses = lodash.groupBy(officerCourses.data , ele=>ele.CourseID)

      this.$set(this.mainTable, "headers", [...this.mainTable.headers, ...missions.data.map(ele => ({
        text: ele.Name,
        value: `mission${ele.ID_KEY.toString()}`,
        searchValue: `mission${ele.ID_KEY.toString()}`,
        sortable: true,
        type: "text",
        parent:"مأموريات",
        inSearch: true,
        inTable: true,
        inModel: false,
        readonly: true,
        sort: 1
      })) , ...vacations.data.map(ele => ({
        text: ele.Name,
        value: `vacation${ele.ID_KEY.toString()}`,
        searchValue: `vacation${ele.ID_KEY.toString()}`,
        sortable: true,
        type: "text",
        parent:"أجازات",
        inSearch: true,
        inTable: true,
        inModel: false,
        readonly: true,
        sort: 1
      })) ,
        ...courses.data.map(ele => ({
        text: ele.Name,
        value: `course${ele.ID_KEY.toString()}`,
        searchValue: `course${ele.ID_KEY.toString()}`,
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        parent:"فرق /دورة",
        inModel: false,
        readonly: true,
        sort: 1
      })) ,
        {
          text: "إجمالي الخارج",
          value: "totalExternals",
          searchValue: "totalExternals",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الموجود",
          value: "totalExistence",
          searchValue: "totalExistence",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
      ])


      let where = {
            ...filters
          },
          likes = [],
          multi = [];

      where = this.mapToQuery(where, likes, multi);
    let officers = await  this.api("global/get_all", {
        table: "MilitaryManagementOfficers",
        include: [
          {
            model: "Branches"
          }
        ]
      });

            let data = officers.data.map(ele => ({
              ...ele
            }));
            let GroupedOfficers = lodash.groupBy(data, ele => ele.BranchID);
            let d = Object.keys(GroupedOfficers).map(key => ({
              BranchID: key,
              Branch: GroupedOfficers[key][0].Branch.Name,
              Workers: GroupedOfficers[key].filter(ele =>
                  ele.OfficerCategory.includes("عامل")
              ).length,
              Spare: GroupedOfficers[key].filter(ele =>
                  ele.OfficerCategory.includes("إحتياط")
              ).length,
              Honor: GroupedOfficers[key].filter(ele =>
                  ele.OfficerCategory.includes("شرف")
              ).length,
              Contract: GroupedOfficers[key].filter(ele =>
                  ele.OfficerCategory.includes("تعاقد ش.ض")
              ).length,
              Total: GroupedOfficers[key].length
            }));




            for (let i = 0 ; i<d.length ; i++){
             let externals = 0;
              for (let j = 0 ; j < courses.data.length ; j++){
                if(groupedCourses[courses.data[j].ID_KEY]){
                  externals += groupedCourses[courses.data[j].ID_KEY].filter(
                      ele => (ele.CourseID == courses.data[j].ID_KEY && GroupedOfficers[d[i].BranchID].map(ele=>ele.ID).includes(ele.ID))
                  ).length;

                  d[i] = {...d[i],
                      [`course${courses.data[j].ID_KEY}`]:
                    groupedCourses[courses.data[j].ID_KEY].filter(
                        ele => (ele.CourseID == courses.data[j].ID_KEY && GroupedOfficers[d[i].BranchID].map(ele=>ele.ID).includes(ele.ID))
                    ).length
                  }
                }else {
                  d[i] = {...d[i] ,
                    [`course${courses.data[j].ID_KEY}`]:0
                  }
                }
              }
              for (let k = 0 ; k<vacations.data.length ; k++){
                if(groupedVacations[vacations.data[k].ID_KEY]){
                  externals+=groupedVacations[vacations.data[k].ID_KEY].filter(
                      ele => (ele.VacationID == vacations.data[k].ID_KEY && GroupedOfficers[d[i].BranchID].map(ele=>ele.ID).includes(ele.ID))
                  ).length;
                  d[i] = {...d[i] ,
                    [`vacation${vacations.data[k].ID_KEY}`]:
                    groupedVacations[vacations.data[k].ID_KEY].filter(
                        ele => (ele.VacationID == vacations.data[k].ID_KEY && GroupedOfficers[d[i].BranchID].map(ele=>ele.ID).includes(ele.ID))
                    ).length
                  }
                }
                else {
                  d[i] = {...d[i] ,
                    [`vacation${vacations.data[k].ID_KEY}`]:0
                  }
                }

              }

              for (let l = 0 ; l<missions.data.length ; l++){
                if(groupedMissions[missions.data[l].ID_KEY]){
                  externals+= groupedMissions[missions.data[l].ID_KEY].filter(
                      ele => (ele.MissionID == missions.data[l].ID_KEY && GroupedOfficers[d[i].BranchID].map(ele=>ele.ID).includes(ele.ID))
                  ).length;
                  d[i] = {...d[i] ,
                    [`mission${missions.data[l].ID_KEY}`]:
                    groupedMissions[missions.data[l].ID_KEY].filter(
                        ele => (ele.MissionID == missions.data[l].ID_KEY && GroupedOfficers[d[i].BranchID].map(ele=>ele.ID).includes(ele.ID))
                    ).length
                  }
                }else{
                  d[i] = {...d[i] ,
                    [`mission${missions.data[l].ID_KEY}`]:0
                  }
                }

              }

              d[i] = {
                ...d[i],
                totalExternals :externals,
                totalExistence :d[i].Total -externals
              }

            }





             d.push({
              Branch: "الأجمالي",
              Workers: lodash.sumBy(d, ele => ele.Workers),
              Spare: lodash.sumBy(d, ele => ele.Spare),
              Honor: lodash.sumBy(d, ele => ele.Honor),
              Contract: lodash.sumBy(d, ele => ele.Contract),
              Total: lodash.sumBy(d, ele => ele.Total)
            });


      let externals = 0;
      for (let j = 0 ; j<courses.data.length ; j++){

        if(groupedCourses[courses.data[j].ID_KEY]){
          externals += groupedCourses[courses.data[j].ID_KEY].filter(
              ele => (ele.CourseID == courses.data[j].ID_KEY)
          ).length;
          d[d.length-1] = {...d[d.length-1] ,
            [`course${courses.data[j].ID_KEY}`]:
            groupedCourses[courses.data[j].ID_KEY].filter(
                ele => (ele.CourseID == courses.data[j].ID_KEY)
            ).length
          }
        }
        else {
          d[d.length-1] = {...d[d.length-1] ,
            [`course${courses.data[j].ID_KEY}`]:0
          }
        }

      }
      for (let k = 0 ; k<vacations.data.length ; k++){
        if(groupedVacations[ vacations.data[k].ID_KEY]){

          externals+=groupedVacations[ vacations.data[k].ID_KEY].filter(
              ele => (ele.VacationID == vacations.data[k].ID_KEY)
          ).length;
          d[d.length-1] = {...d[d.length-1] ,
            [`vacation${vacations.data[k].ID_KEY}`]:
            groupedVacations[ vacations.data[k].ID_KEY].filter(
                ele => (ele.VacationID == vacations.data[k].ID_KEY)
            ).length
          }
        }
        else {
          d[d.length-1] = {...d[d.length-1] ,
            [`vacation${vacations.data[k].ID_KEY}`]:0
          }
        }
      }

      for (let l = 0 ; l<missions.data.length ; l++){
        if (groupedMissions[missions.data[l].ID_KEY]){

          externals+= groupedMissions[missions.data[l].ID_KEY].filter(
              ele => (ele.MissionID == missions.data[l].ID_KEY )
          ).length;
          d[d.length-1] = {...d[d.length-1] ,
            [`mission${missions.data[l].ID_KEY}`]:
            groupedMissions[missions.data[l].ID_KEY].filter(
                ele => (ele.MissionID == missions.data[l].ID_KEY )
            ).length
          }
        }
        else {
          d[d.length-1] = {...d[d.length-1] ,
            [`mission${missions.data[l].ID_KEY}`]:0
          }
        }
      }

      d[d.length-1] = {
        ...d[d.length-1],
        totalExternals :externals,
        totalExistence :d[d.length-1].Total -externals
      }


      console.log("Data is " , d);


            this.$set(this.mainTable, "items", d);
            this.$set(this.mainTable, "printer", {
              cons: [...d],
              excelKey: "cons",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable),
              hasParent:true
            });

    }
  }
};
</script>
