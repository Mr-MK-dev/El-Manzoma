<template>
  <div class="Weapons_Dailes">
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      :clearOption="true"
      :addButton="false"
    />
    <v-card>
      <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :loading="searchLoading"
        :title="'نتائج اليومية عددية للادارات'"
      >
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header">
            <tr>
              <th
                v-for="item in mainTable.headers.filter(ele => ele.inTable)"
                :key="item.parent + item.text.length"
                colspan="1"
                class="text-center parent-header"
              >
                {{ item.parent }}
              </th>
            </tr>
            <tr>
              <th
                v-for="item in mainTable.headers.filter(ele => ele.inTable)"
                :key="item.text + item.text.length * 3"
                colspan="1"
                class="text-center parent-header"
              >
                {{ item.text }}
              </th>
            </tr>
          </thead>
        </template>
      </table-bulider>
    </v-card>
  </div>
</template>

<style></style>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

const basicHeaders = [
  {
    text: "الادارة",
    value: "Weapon",
    sortable: true,
    inTable: true,
    inSearch: false,
    multiple: true,
    sort: 1
  },
  {
    text: "تاريخ التسريح",
    value: "RecuEndDate",
    searchValue: "RecuEndDate",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  }
];

export default {
  name: "Weapons_Dailes",
  props: {},
  async  mounted() {
    this.init();
    this.selects.RecuEndDate.data =await this.fetchAvailableServiceEndDates();
  },
  data: () => ({
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        ...basicHeaders,
        ...[
          {
            text: "راتب عالي ",
            value: "moratb.high",
            sortable: true,
            parent: "مرتب",
            inTable: true,
            sort: 1
          },
          {
            text: "مجند",
            value: "moratb.gondy",
            sortable: true,
            parent: "مرتب",
            inTable: true,
            sort: 1
          },
          {
            text: "راتب عالي",
            value: "siasa.high",
            sortable: true,
            type: "text",
            parent: "سياسة",
            inTable: true,
            sort: 1
          },
          {
            text: "مجند",
            value: "siasa.gondy",
            sortable: true,
            type: "text",
            parent: "سياسة",
            inTable: true,
            sort: 1
          },
          {
            text: "راتب عالي",
            value: "mawgod.high",
            sortable: true,
            type: "text",
            parent: "موجود",
            inTable: true,
            sort: 1
          },
          {
            text: "جندي",
            value: "mawgod.gondy",
            sortable: true,
            type: "text",
            parent: "موجود",
            inTable: true,
            sort: 1
          },
          {
            text: "x",
            value: "firstReleased",
            sortable: true,
            type: "select",
            parent: "المسرحين",
            inTable: true,
            sort: 1
          },
          {
            text: "y",
            value: "secondReleased",
            sortable: true,
            type: "select",
            parent: "المسرحين",
            inTable: true,
            sort: 1
          },
          {
            text: "z",
            value: "thirdReleased",
            sortable: true,
            type: "select",
            parent: "المسرحين",
            inTable: true,
            sort: 1
          },
          {
            text: "الاجمالي",
            value: "totalReleased",
            sortable: true,
            type: "select",
            parent: "المسرحين",

            inTable: true,
            sort: 1
          }
        ]
      ],
      items: [],
      printer: {}
    },
    componentName: "WeaponsDailes",
    selects: {
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      }
    }
  }),
  watch: {
    "search.RecuEndDate"(newValue) {
      if (newValue.length > 3) {
        this.showError("لا يمكنك اختيار اكثرر من 3 دفع تسريح");
        this.search.RecuEndDate.pop();
      }
      const firstReleaseFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "firstReleased"
      );
      const secondReleaseFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "secondReleased"
      );
      const thirdReleaseFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "thirdReleased"
      );
      if (newValue.length > 2) {
        this.mainTable.headers[firstReleaseFeildIndex].text =
          newValue[0] ?? "x";
        this.mainTable.headers[secondReleaseFeildIndex].text =
          newValue[1] ?? "y";
        this.mainTable.headers[thirdReleaseFeildIndex].text =
          newValue[2] ?? "z";
      }
    }
  },
  methods: {
    async findItems(filters) {
      console.log(this.search);
      if (this.search.RecuEndDate.length < 3) {
        this.showError("من فضلك قم باختيار 3 دفع تسريح المقبلة");
        return;
      }
      this.$set(this, "search", filters);
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        let weapons = await this.api("global/get_all", {
          table: "Weapon"
        });

        let items = [];
        for (const weapon of weapons.data) {
          const soliders = await this.api("global/get_all", {
            table: "Soldier",
            where: {
              WeaponID: weapon.WeaponID,
              Status: `بالخدمة`
            }
          });

          const rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              WeaponID: weapon.WeaponID,
              Status: `بالخدمة`
            }
          });

          const mortabs = await this.api("global/get_all", {
            table: "MortabatDuties",
            where: {
              WeaponID: weapon.WeaponID
            }
          });

          items.push({
            ...weapon,
            moratb: {
              high: lodash.sumBy(
                mortabs.data.filter(ele => ele.ServiceType === "راتب عالى"),
                ele => ele.Moratab
              ),
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  ele =>
                    ele.ServiceType === "مجند" ||
                    ele.ServiceType === "رع / مجند"
                ),
                ele => ele.Moratab
              )
            },
            siasa: {
              high: lodash.sumBy(
                mortabs.data.filter(ele => ele.ServiceType === "راتب عالى"),
                ele => ele.Siasa
              ),
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  ele =>
                    ele.ServiceType === "مجند" ||
                    ele.ServiceType === "رع / مجند"
                ),
                ele => ele.Siasa
              )
            },
            mawgod: {
              high: rateb.data.length,
              gondy: soliders.data.length
            },
            firstReleased: soliders.data.filter(
              ele => ele.RecuEndDate == this.search.RecuEndDate[0]
            ).length,
            secondReleased: soliders.data.filter(
              ele => ele.RecuEndDate == this.search.RecuEndDate[1]
            ).length,
            thirdReleased: soliders.data.filter(
              ele => ele.RecuEndDate == this.search.RecuEndDate[2]
            ).length,
            totalReleased: soliders.data.filter(ele =>
              this.search.RecuEndDate.includes(ele.RecuEndDate)
            ).length
          });
        }
        items.push({
          Weapon: "الاجمالي",
          moratb: {
            high: lodash.sumBy(items, ele => ele.moratb.high),
            gondy: lodash.sumBy(items, ele => ele.moratb.gondy)
          },
          siasa: {
            high: lodash.sumBy(items, ele => ele.siasa.high),
            gondy: lodash.sumBy(items, ele => ele.siasa.gondy)
          },
          mawgod: {
            high: lodash.sumBy(items, ele => ele.mawgod.high),
            gondy: lodash.sumBy(items, ele => ele.mawgod.gondy)
          },
          firstReleased: lodash.sumBy(items, ele => ele.firstReleased),
          secondReleased: lodash.sumBy(items, ele => ele.secondReleased),
          thirdReleased: lodash.sumBy(items, ele => ele.thirdReleased),
          totalReleased: lodash.sumBy(items, ele => ele.totalReleased)
        });
        this.$set(this, "searchLoading", false);
        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: items,
          excelKey: "data",
          hasParent: true,
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
    }
  }
};
</script>
