<template>
  <div>
    <v-card>
      <v-card-title>
        <v-btn
          color="primary"
          large
          class="px-6"
          @click="findItems()"
          v-text="'عرض اليومية '"
        />
      </v-card-title>
    </v-card>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :wordFile="'/tasgeel/newUnitsDailySeparetd'"
      :isExcel="true"
    >
      <template v-slot:item.moratabMawgodPercentage="{ item }">
        <v-chip color="transparent">
          {{ Math.round(item.moratabMawgodPercentage * 100) }}%
        </v-chip>
      </template>
      <!--      <template v-slot:item.siasa="{ item }">-->
      <!--        <v-chip color="transparent">-->
      <!--          {{ Math.round(item.siasa) }}%-->
      <!--        </v-chip>-->
      <!--      </template>-->
    </table-bulider>
  </div>
</template>

<script>
import so from "@/views/dbs/so";

const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const displayTypes = types.displayTypes;

export default {
  name: "AllUnitsMawgodDailySeparated",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    groupedValue: [],
    subjectLimit: 10,
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "Unit",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          multiple: false
        },
        {
          text: "مرتب الجنود",
          searchValue: "gondyMoratab",
          value: "gondyMoratab",
          inTable: true,
          type: "text"
        },
        {
          text: "مرتب الراتب العالي",
          searchValue: "highMoratab",
          value: "highMoratab",
          inTable: true,
          type: "text"
        },
        {
          text: "المرتب",
          searchValue: "moratab",
          value: "moratab",
          inTable: true,
          type: "text"
        },
        {
          text: "مرتب السلم جنود",
          searchValue: "gondySiasa",
          value: "gondySiasa",
          inTable: true,
          type: "text"
        },
        {
          text: "مرتب السلم راتب عالي",
          searchValue: "highSiasa",
          value: "highSiasa",
          inTable: true,
          type: "text"
        },
        {
          text: "مرتب السلم",
          searchValue: "siasa",
          value: "siasa",
          inTable: true,
          type: "text"
        },
        {
          text: "الموجود مجند",
          searchValue: "gondyMawgod",
          value: "gondyMawgod",
          inTable: true,
          type: "text"
        },
        {
          text: "الموجود راتب عالي",
          searchValue: "highMawgod",
          value: "highMawgod",
          inTable: true,
          type: "text"
        },
        {
          text: "الموجود",
          searchValue: "mawgod",
          value: "mawgod",
          inTable: true,
          type: "text"
        },
        {
          text: "النسبة / المرتب",
          searchValue: "moratabMawgodPercentage",
          value: "moratabMawgodPercentage",
          inTable: true,
          type: "text"
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "createdObject"
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      try {
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);

        let values = [];
        let units = await this.api("global/get_all", {
          table: "Unit",
          where: {
            statue: "بالخدمة"
          },
          include: [{ model: "SpecialOrganizedUnits" }]
        });
        const soliders = await this.api("global/get_all", {
          table: "Soldier",
          where: {
            Status: `بالخدمة`
          }
        });
        const rateb = await this.api("global/get_all", {
          table: "Rateb",
          where: {
            Status: `بالخدمة`
          }
        });
        let mortbat = await this.api("global/get_all", {
          table: "MortabatDuties"
        });

        let groupByDirection = lodash.groupBy(
          units.data,
          ele => ele.Directionforunit
        );
        console.log("group by direction", groupByDirection);
        console.log("mortbat", mortbat.data);

        Object.keys(groupByDirection).forEach(element => {
          if (element != "") {
            console.log(element);
            if (element == "جـ 2 ميد" || element == "جـ 3 ميد") {
              values.push(
                groupByDirection[element]
                  .filter(
                    ele =>
                      (ele.DirectionforFeaat == null ||
                        !ele.DirectionforFeaat.includes("مج مخ")) &&
                      ele.SpecialOrganizationID == null
                  )
                  .map(ele =>
                    values.push({
                      Unit:
                        ele.ShortenName != null ? ele.ShortenName : ele.Unit,
                      direction: element,
                      filterDirection: element,
                      gondyMoratab: lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == ele.UnitID && item.ServiceType != "راتب عالى" ),
                        ele => ele.Moratab
                      ), highMoratab: lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == ele.UnitID && item.ServiceType == "راتب عالى"),
                        ele => ele.Moratab
                      ), moratab: lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == ele.UnitID),
                        ele => ele.Moratab
                      ),
                      gondySiasa: lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == ele.UnitID&& item.ServiceType != "راتب عالى" ),
                        ele => ele.Siasa
                      ),
                      highSiasa: lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == ele.UnitID&& item.ServiceType == "راتب عالى"),
                        ele => ele.Siasa
                      ),
                      siasa: lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == ele.UnitID),
                        ele => ele.Siasa
                      ),
                      gondyMawgod :
                      soliders.data.filter(item => item.UnitID == ele.UnitID)
                          .length ,
                      highMawgod :
                      rateb.data.filter(item => item.UnitID == ele.UnitID)
                          .length ,

                      mawgod:
                        soliders.data.filter(item => item.UnitID == ele.UnitID)
                          .length +
                        rateb.data.filter(item => item.UnitID == ele.UnitID)
                          .length,
                      moratabMawgodPercentage: this.InfinityToZero(
                        (soliders.data.filter(item => item.UnitID == ele.UnitID)
                          .length +
                          rateb.data.filter(item => item.UnitID == ele.UnitID)
                            .length) /
                          lodash.sumBy(
                            mortbat.data.filter(
                              item => item.UnitID == ele.UnitID
                            ),
                            ele => ele.Moratab
                          )
                      )
                    })
                  )
              );

              let groupedByFeat = lodash.groupBy(
                groupByDirection[element],
                ele => ele.DirectionforFeaat
              );
              console.log("feat", groupedByFeat);

              Object.keys(groupedByFeat).forEach(key => {
                if (key.includes("مج مخ")) {
                  let totalMoratab = 0;
                  let totalGondyMoratab = 0;
                  let totalHighMoratab = 0;
                  let totalSiasa = 0;
                  let totalGondySiasa = 0;
                  let totalHighSiasa = 0;
                  let totalMawgod = 0;
                  let totalGondyMawgod = 0;
                  let totalHighMawgod = 0;
                  let totalMoratabmawgodPercentage = 0;

                  groupedByFeat[key].forEach(un => {
                    totalMoratab += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID),
                      ele => ele.Moratab
                    );
                    totalGondyMoratab += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID && item.ServiceType != "راتب عالى"),
                      ele => ele.Moratab
                    );
                    totalHighMoratab += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID&& item.ServiceType == "راتب عالى"),
                      ele => ele.Moratab
                    );
                    totalSiasa += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID),
                      ele => ele.Siasa
                    );
                    totalGondySiasa += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID && item.ServiceType != "راتب عالى"),
                      ele => ele.Siasa
                    );
                    totalHighSiasa += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID&& item.ServiceType == "راتب عالى"),
                      ele => ele.Siasa
                    );
                    totalMawgod +=
                      soliders.data.filter(item => item.UnitID == un.UnitID)
                        .length +
                      rateb.data.filter(item => item.UnitID == un.UnitID)
                        .length;
                    totalGondyMawgod +=
                      soliders.data.filter(item => item.UnitID == un.UnitID)
                        .length ;
                    totalHighMawgod +=
                      rateb.data.filter(item => item.UnitID == un.UnitID)
                        .length;
                  });
                  totalMoratabmawgodPercentage = totalMawgod / totalMoratab;

                  values.push({
                    Unit: key,
                    direction: element,
                    filterDirection: element,

                    moratab: totalMoratab,
                    siasa: totalSiasa,
                    mawgod: totalMawgod,

                    gondyMoratab: totalGondyMoratab,
                    gondySiasa: totalGondySiasa,
                    gondyMawgod: totalGondyMawgod,

                    highMoratab: totalHighMoratab,
                    highSiasa: totalHighSiasa,
                    highMawgod: totalHighMawgod,
                    moratabMawgodPercentage: this.InfinityToZero(
                      totalMoratabmawgodPercentage
                    )
                  });
                }
              });

              let groupedBySpeciality = lodash.groupBy(
                groupByDirection[element].filter(
                  ele => ele.SpecialOrganizationID != null
                ),
                ele => ele.SpecialOrganizationID
              );
              console.log("specialtyu", groupedBySpeciality);
              Object.keys(groupedBySpeciality).forEach(spec => {
                if (spec != null) {
                  console.log("I'm here", spec);

                  values.push(
                    groupedBySpeciality[spec].map(ele =>
                      values.push({
                        Unit:
                          ele.ShortenName != null ? ele.ShortenName : ele.Unit,
                        direction: element,
                        filterDirection: element,
                        moratab: lodash.sumBy(
                          mortbat.data.filter(
                            item => item.UnitID == ele.UnitID
                          ),
                          ele => ele.Moratab
                        ),
                        gondyMoratab: lodash.sumBy(
                            mortbat.data.filter(item => item.UnitID == ele.UnitID && item.ServiceType != "راتب عالى" ),
                            ele => ele.Moratab
                        ), highMoratab: lodash.sumBy(
                            mortbat.data.filter(item => item.UnitID == ele.UnitID && item.ServiceType == "راتب عالى"),
                            ele => ele.Moratab
                        ),
                        siasa: lodash.sumBy(
                          mortbat.data.filter(
                            item => item.UnitID == ele.UnitID
                          ),
                          ele => ele.Siasa
                        ),
                        gondySiasa: lodash.sumBy(
                            mortbat.data.filter(item => item.UnitID == ele.UnitID&& item.ServiceType != "راتب عالى" ),
                            ele => ele.Siasa
                        ),
                        highSiasa: lodash.sumBy(
                            mortbat.data.filter(item => item.UnitID == ele.UnitID&& item.ServiceType == "راتب عالى"),
                            ele => ele.Siasa
                        ),
                        mawgod:
                          soliders.data.filter(
                            item => item.UnitID == ele.UnitID
                          ).length +
                          rateb.data.filter(item => item.UnitID == ele.UnitID)
                            .length,
                        gondyMawgod :
                        soliders.data.filter(item => item.UnitID == ele.UnitID)
                            .length ,
                        highMawgod :
                        rateb.data.filter(item => item.UnitID == ele.UnitID)
                            .length ,
                        moratabMawgodPercentage: this.InfinityToZero(
                          (soliders.data.filter(
                            item => item.UnitID == ele.UnitID
                          ).length +
                            rateb.data.filter(item => item.UnitID == ele.UnitID)
                              .length) /
                            lodash.sumBy(
                              mortbat.data.filter(
                                item => item.UnitID == ele.UnitID
                              ),
                              ele => ele.Moratab
                            )
                        )
                      })
                    )
                  );

                  let totalMoratab = 0;
                  let totalGondyMoratab = 0;
                  let totalHighMoratab = 0;
                  let totalSiasa = 0;
                  let totalGondySiasa = 0;
                  let totalHighSiasa = 0;
                  let totalMawgod = 0;
                  let totalGondyMawgod = 0;
                  let totalHighMawgod = 0;
                  let totalMoratabmawgodPercentage = 0;

                  groupedBySpeciality[spec].forEach(un => {
                    totalMoratab += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID),
                      ele => ele.Moratab
                    );
                    totalGondyMoratab += lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == un.UnitID && item.ServiceType != "راتب عالى"),
                        ele => ele.Moratab
                    );
                    totalHighMoratab += lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == un.UnitID&& item.ServiceType == "راتب عالى"),
                        ele => ele.Moratab
                    );
                    totalSiasa += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID),
                      ele => ele.Siasa
                    );
                    totalGondySiasa += lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == un.UnitID && item.ServiceType != "راتب عالى"),
                        ele => ele.Siasa
                    );
                    totalHighSiasa += lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == un.UnitID&& item.ServiceType == "راتب عالى"),
                        ele => ele.Siasa
                    );
                    totalMawgod +=
                      soliders.data.filter(item => item.UnitID == un.UnitID)
                        .length +
                      rateb.data.filter(item => item.UnitID == un.UnitID)
                        .length;
                    totalGondyMawgod +=
                        soliders.data.filter(item => item.UnitID == un.UnitID)
                            .length ;
                    totalHighMawgod +=
                        rateb.data.filter(item => item.UnitID == un.UnitID)
                            .length;
                  });
                  totalMoratabmawgodPercentage = totalMawgod / totalMoratab;
                  values.push({
                    Unit:
                      groupedBySpeciality[spec][0].SpecialOrganizedUnit.Name,
                    filterDirection: element,

                    moratab: totalMoratab,
                    siasa: totalSiasa,
                    mawgod: totalMawgod,

                    gondyMoratab: totalGondyMoratab,
                    gondySiasa: totalGondySiasa,
                    gondyMawgod: totalGondyMawgod,

                    highMoratab: totalHighMoratab,
                    highSiasa: totalHighSiasa,
                    highMawgod: totalHighMawgod,
                    moratabMawgodPercentage: this.InfinityToZero(
                      totalMoratabmawgodPercentage
                    )
                  });
                } else {
                  console.log("I skipped null");
                }
              });
            } else {
              values.push(
                groupByDirection[element]
                  .filter(
                    ele =>
                      (ele.DirectionforFeaat == null ||
                        !ele.DirectionforFeaat.includes("مج مخ")) &&
                      ele.SpecialOrganizationID == null
                  )
                  .map(ele =>
                    values.push({
                      Unit:
                        ele.ShortenName != null ? ele.ShortenName : ele.Unit,
                      direction: element,
                      filterDirection: element,
                      moratab: lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == ele.UnitID),
                        ele => ele.Moratab
                      ),
                      gondyMoratab: lodash.sumBy(
                          mortbat.data.filter(item => item.UnitID == ele.UnitID && item.ServiceType != "راتب عالى" ),
                          ele => ele.Moratab
                      ), highMoratab: lodash.sumBy(
                          mortbat.data.filter(item => item.UnitID == ele.UnitID && item.ServiceType == "راتب عالى"),
                          ele => ele.Moratab
                      ),
                      siasa: lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == ele.UnitID),
                        ele => ele.Siasa
                      ),
                      gondySiasa: lodash.sumBy(
                          mortbat.data.filter(item => item.UnitID == ele.UnitID&& item.ServiceType != "راتب عالى" ),
                          ele => ele.Siasa
                      ),
                      highSiasa: lodash.sumBy(
                          mortbat.data.filter(item => item.UnitID == ele.UnitID&& item.ServiceType == "راتب عالى"),
                          ele => ele.Siasa
                      ),
                      mawgod:
                        soliders.data.filter(item => item.UnitID == ele.UnitID)
                          .length +
                        rateb.data.filter(item => item.UnitID == ele.UnitID)
                          .length,
                      gondyMawgod :
                      soliders.data.filter(item => item.UnitID == ele.UnitID)
                          .length ,
                      highMawgod :
                      rateb.data.filter(item => item.UnitID == ele.UnitID)
                          .length ,
                      moratabMawgodPercentage: this.InfinityToZero(
                        (soliders.data.filter(item => item.UnitID == ele.UnitID)
                          .length +
                          rateb.data.filter(item => item.UnitID == ele.UnitID)
                            .length) /
                          lodash.sumBy(
                            mortbat.data.filter(
                              item => item.UnitID == ele.UnitID
                            ),
                            ele => ele.Moratab
                          )
                      )
                    })
                  )
              );

              let groupedByFeat = lodash.groupBy(
                groupByDirection[element],
                ele => ele.DirectionforFeaat
              );

              Object.keys(groupedByFeat).forEach(key => {
                if (key.includes("مج مخ")) {
                  let totalMoratab = 0;
                  let totalGondyMoratab = 0;
                  let totalHighMoratab = 0;
                  let totalSiasa = 0;
                  let totalGondySiasa = 0;
                  let totalHighSiasa = 0;
                  let totalMawgod = 0;
                  let totalGondyMawgod = 0;
                  let totalHighMawgod = 0;
                  let totalMoratabmawgodPercentage = 0;

                  groupedByFeat[key].forEach(un => {
                    totalMoratab += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID),
                      ele => ele.Moratab
                    );
                    totalGondyMoratab += lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == un.UnitID && item.ServiceType != "راتب عالى"),
                        ele => ele.Moratab
                    );
                    totalHighMoratab += lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == un.UnitID&& item.ServiceType == "راتب عالى"),
                        ele => ele.Moratab
                    );
                    totalSiasa += lodash.sumBy(
                      mortbat.data.filter(item => item.UnitID == un.UnitID),
                      ele => ele.Siasa
                    );
                    totalGondySiasa += lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == un.UnitID && item.ServiceType != "راتب عالى"),
                        ele => ele.Siasa
                    );
                    totalHighSiasa += lodash.sumBy(
                        mortbat.data.filter(item => item.UnitID == un.UnitID&& item.ServiceType == "راتب عالى"),
                        ele => ele.Siasa
                    );
                    totalMawgod +=
                      soliders.data.filter(item => item.UnitID == un.UnitID)
                        .length +
                      rateb.data.filter(item => item.UnitID == un.UnitID)
                        .length;
                    totalGondyMawgod +=
                        soliders.data.filter(item => item.UnitID == un.UnitID)
                            .length ;
                    totalHighMawgod +=
                        rateb.data.filter(item => item.UnitID == un.UnitID)
                            .length;
                  });

                  totalMoratabmawgodPercentage = totalMawgod / totalMoratab;

                  values.push({
                    Unit: key,
                    direction: element,
                    filterDirection: element,
                    moratab: totalMoratab,
                    siasa: totalSiasa,
                    mawgod: totalMawgod,

                    gondyMoratab: totalGondyMoratab,
                    gondySiasa: totalGondySiasa,
                    gondyMawgod: totalGondyMawgod,

                    highMoratab: totalHighMoratab,
                    highSiasa: totalHighSiasa,
                    highMawgod: totalHighMawgod,
                    moratabMawgodPercentage: this.InfinityToZero(
                      totalMoratabmawgodPercentage
                    )
                  });
                }
              });
            }
          } else {
            console.log("i skipped first one");
          }
        });

        let secmid = values.filter(ele => ele.filterDirection == "جـ 2 ميد");
        let thirdmid = values.filter(ele => ele.filterDirection == "جـ 3 ميد");
        let south = values.filter(ele => ele.filterDirection == "جنوبى");
        let west = values.filter(ele => ele.filterDirection == "غربى");
        let north = values.filter(ele => ele.filterDirection == "شمالى");
        let central = values.filter(ele => ele.filterDirection == "مركزى");
        let without = values.filter(
          ele =>
            ele.filterDirection == "بدون" ||
            ele.filterDirection == "قيادة شرق القناة"
        );

        let finalValues = [
          ...secmid,
          ...north,
          ...thirdmid,
          ...west,
          ...south,
          ...central,
          ...without
        ];
        let firstColData = finalValues.slice(0, 30);
        let secondColData = finalValues.slice(30, 60);
        let thirdColData = finalValues.slice(60, finalValues.length);

        console.log("final values", finalValues);
        console.log("firstColData", firstColData);
        console.log("secondColData", secondColData);
        console.log("thirdColData", thirdColData);
        console.log("second", secmid);
        console.log("third", thirdmid);
        console.log("south", south);
        console.log("west", west);
        console.log("north", north);
        console.log("central", central);
        console.log("without", without);

        let secondTotal = {
          moratab: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.moratab
          ),          gondyMoratab: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.gondyMoratab
          ),
          highMoratab: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.highMoratab
          ),
          siasa: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.siasa
          ),
          gondySiasa: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.gondySiasa
          ),
          highSiasa: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.highSiasa
          ),
          mawgod: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.mawgod
          ),  gondyMawgod: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.gondyMawgod
          ),  highMawgod: lodash.sumBy(
            secmid.filter(ele => ele.direction != null),
            el => el.highMawgod
          ),
          moratabMawgodPercentage: this.InfinityToZero(
            lodash.sumBy(
              secmid.filter(ele => ele.direction != null),
              el => el.mawgod
            ) /
              lodash.sumBy(
                secmid.filter(ele => ele.direction != null),
                el => el.moratab
              )
          )
        };
        let thirdTotal = {
          moratab: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.moratab
          ),          gondyMoratab: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.gondyMoratab
          ),
          highMoratab: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.highMoratab
          ),
          siasa: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.siasa
          ),
          gondySiasa: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.gondySiasa
          ),
          highSiasa: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.highSiasa
          ),
          mawgod: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.mawgod
          ),  gondyMawgod: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.gondyMawgod
          ),  highMawgod: lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.highMawgod
          ),
          moratabMawgodPercentage: this.InfinityToZero(
            lodash.sumBy(
              thirdmid.filter(ele => ele.direction != null),
              el => el.mawgod
            ) /
              lodash.sumBy(
                thirdmid.filter(ele => ele.direction != null),
                el => el.moratab
              )
          )
        };
        let northTotal = {
          moratab: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.moratab
          ),          gondyMoratab: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.gondyMoratab
          ),
          highMoratab: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.highMoratab
          ),
          siasa: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.siasa
          ),
          gondySiasa: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.gondySiasa
          ),
          highSiasa: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.highSiasa
          ),
          mawgod: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.mawgod
          ),  gondyMawgod: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.gondyMawgod
          ),  highMawgod: lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.highMawgod
          ),
          moratabMawgodPercentage: this.InfinityToZero(
            lodash.sumBy(
              north.filter(ele => ele.direction != null),
              el => el.mawgod
            ) /
              lodash.sumBy(
                north.filter(ele => ele.direction != null),
                el => el.moratab
              )
          )
        };
        let westTotal = {
          moratab: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.moratab
          ),          gondyMoratab: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.gondyMoratab
          ),
          highMoratab: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.highMoratab
          ),
          siasa: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.siasa
          ),
          gondySiasa: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.gondySiasa
          ),
          highSiasa: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.highSiasa
          ),
          mawgod: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.mawgod
          ),  gondyMawgod: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.gondyMawgod
          ),  highMawgod: lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.highMawgod
          ),
          moratabMawgodPercentage: this.InfinityToZero(
            lodash.sumBy(
              west.filter(ele => ele.direction != null),
              el => el.mawgod
            ) /
              lodash.sumBy(
                west.filter(ele => ele.direction != null),
                el => el.moratab
              )
          )
        };
        let southTotal = {
          moratab: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.moratab
          ),          gondyMoratab: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.gondyMoratab
          ),
          highMoratab: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.highMoratab
          ),
          siasa: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.siasa
          ),
          gondySiasa: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.gondySiasa
          ),
          highSiasa: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.highSiasa
          ),
          mawgod: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.mawgod
          ),  gondyMawgod: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.gondyMawgod
          ),  highMawgod: lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.highMawgod
          ),
          moratabMawgodPercentage: this.InfinityToZero(
            lodash.sumBy(
              south.filter(ele => ele.direction != null),
              el => el.mawgod
            ) /
              lodash.sumBy(
                south.filter(ele => ele.direction != null),
                el => el.moratab
              )
          )
        };
        let centralTotal = {
          moratab: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.moratab
          ),          gondyMoratab: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.gondyMoratab
          ),
          highMoratab: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.highMoratab
          ),
          siasa: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.siasa
          ),
          gondySiasa: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.gondySiasa
          ),
          highSiasa: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.highSiasa
          ),
          mawgod: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.mawgod
          ),  gondyMawgod: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.gondyMawgod
          ),  highMawgod: lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.highMawgod
          ),
          moratabMawgodPercentage: this.InfinityToZero(
            lodash.sumBy(
              central.filter(ele => ele.direction != null),
              el => el.mawgod
            ) /
              lodash.sumBy(
                central.filter(ele => ele.direction != null),
                el => el.moratab
              )
          )
        };
        let withoutTotal = {
          moratab: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.moratab
          ),          gondyMoratab: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.gondyMoratab
          ),
          highMoratab: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.highMoratab
          ),
          siasa: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.siasa
          ),
          gondySiasa: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.gondySiasa
          ),
          highSiasa: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.highSiasa
          ),
          mawgod: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.mawgod
          ),  gondyMawgod: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.gondyMawgod
          ),  highMawgod: lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.highMawgod
          ),
          moratabMawgodPercentage: this.InfinityToZero(
            lodash.sumBy(
              without.filter(ele => ele.direction != null),
              el => el.mawgod
            ) /
              lodash.sumBy(
                without.filter(ele => ele.direction != null),
                el => el.moratab
              )
          )
        };
        let generalTotal = {
          moratab:
            secondTotal.moratab +
            thirdTotal.moratab +
            northTotal.moratab +
            westTotal.moratab +
            southTotal.moratab +
            centralTotal.moratab +
            withoutTotal.moratab,
          gondyMoratab:
            secondTotal.gondyMoratab +
            thirdTotal.gondyMoratab +
            northTotal.gondyMoratab +
            westTotal.gondyMoratab +
            southTotal.gondyMoratab +
            centralTotal.gondyMoratab +
            withoutTotal.gondyMoratab,
          highMoratab:
            secondTotal.highMoratab +
            thirdTotal.highMoratab +
            northTotal.highMoratab +
            westTotal.highMoratab +
            southTotal.highMoratab +
            centralTotal.highMoratab +
            withoutTotal.highMoratab,
          siasa:
            secondTotal.siasa +
            thirdTotal.siasa +
            northTotal.siasa +
            westTotal.siasa +
            southTotal.siasa +
            centralTotal.siasa +
            withoutTotal.siasa,
          gondySiasa:
            secondTotal.gondySiasa +
            thirdTotal.gondySiasa +
            northTotal.gondySiasa +
            westTotal.gondySiasa +
            southTotal.gondySiasa +
            centralTotal.gondySiasa +
            withoutTotal.gondySiasa,
          highSiasa:
            secondTotal.highSiasa +
            thirdTotal.highSiasa +
            northTotal.highSiasa +
            westTotal.highSiasa +
            southTotal.highSiasa +
            centralTotal.highSiasa +
            withoutTotal.highSiasa,
          mawgod:
            secondTotal.mawgod +
            thirdTotal.mawgod +
            northTotal.mawgod +
            westTotal.mawgod +
            southTotal.mawgod +
            centralTotal.mawgod +
            withoutTotal.mawgod,
          gondyMawgod:
            secondTotal.gondyMawgod +
            thirdTotal.gondyMawgod +
            northTotal.gondyMawgod +
            westTotal.gondyMawgod +
            southTotal.gondyMawgod +
            centralTotal.gondyMawgod +
            withoutTotal.gondyMawgod,
          highMawgod:
            secondTotal.highMawgod +
            thirdTotal.highMawgod +
            northTotal.highMawgod +
            westTotal.highMawgod +
            southTotal.highMawgod +
            centralTotal.highMawgod +
            withoutTotal.highMawgod,
          moratabMawgodPercentage: this.InfinityToZero(
            (secondTotal.mawgod +
              thirdTotal.mawgod +
              northTotal.mawgod +
              westTotal.mawgod +
              southTotal.mawgod +
              centralTotal.mawgod +
              withoutTotal.mawgod) /
              (secondTotal.moratab +
                thirdTotal.moratab +
                northTotal.moratab +
                westTotal.moratab +
                southTotal.moratab +
                centralTotal.moratab +
                withoutTotal.moratab)
          )
        };

        console.log("second", secondTotal);
        console.log("third", thirdTotal);
        console.log("south", southTotal);
        console.log("west", westTotal);
        console.log("north", northTotal);
        console.log("central", centralTotal);
        console.log("without", withoutTotal);
        console.log("general", generalTotal);

        // values.push({
        //   Unit:"اجمالي " + element,
        //   filterDirection:element,
        //
        //   moratab : lodash.sumBy(values.filter(ele=>ele.direction == element) ,ele=>ele.moratab ),
        //   siasa : 0,
        //   mawgod : lodash.sumBy(values.filter(ele=>ele.direction == element) ,ele=>ele.mawgod ),
        //   moratabMawgodPercentage :lodash.sumBy(values.filter(ele=>ele.direction == element) ,ele=>ele.moratabMawgodPercentage )
        // })

        let data = finalValues,
          printer = {
            data: [...data],
            firstColData: firstColData,
            secondColData: secondColData,
            thirdColData: thirdColData,
            secmid: secmid,
            thirdmid: thirdmid,
            north: north,
            west: west,
            south: south,
            central: central,
            without: without,
            secondTotal: secondTotal,
            thirdTotal: thirdTotal,
            southTotal: southTotal,
            westTotal: westTotal,
            northTotal: northTotal,
            centralTotal: centralTotal,
            withoutTotal: withoutTotal,
            generalTotal: generalTotal,
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable),
            hasParent: true
          };
        // console.log(values)
        this.$set(this.mainTable, "items", finalValues);
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
