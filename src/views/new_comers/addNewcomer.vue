<template>
  <div tabindex="0" class="no-focus">
    <template v-for="(group, i) in groups">
      <v-card
        v-if="filterItemsForType(group.items).length > 0"
        class="mb-8"
        :key="i"
      >
        <v-card-title
          class="primary white--text"
          v-text="group.title"
        ></v-card-title>
        <v-card-subtitle v-text="group.desc"></v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(item, ii) in filterItemsForType(group.items)">
              <v-col
                v-if="(isEnhaa && item.forEnhaa) || !isEnhaa"
                :key="ii"
                cols="6"
                lg="4"
                xl="3"
              >
                <v-text-field
                  v-model="conscripte[item.model]"
                  v-if="!item.type || ['text', 'date'].includes(item.type)"
                  :type="item.type == 'date' ? 'date' : 'text'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :counter="item.counter"
                  filled
                  :loading="
                    item.model == 'ID' && findingConscripte ? true : false
                  "
                  @keyup.enter="findConscripte()"
                  :readonly="item.readonly"
                ></v-text-field>
                <trible-num
                  v-else-if="item.type == 'tribleNum'"
                  :model="conscripte[item.model]"
                  @updateValue="updateValue"
                >
                </trible-num>

                <v-file-input
                  v-model="conscripte[item.model]"
                  v-if="item.type == 'file'"
                  :label="item.label"
                  accept="image/png, image/jpeg, image/bmp, image/jpg"
                  prepend-icon="mdi-camera"
                  show-size
                  truncate-length="14"
                ></v-file-input>
                <v-textarea
                  v-model="conscripte[item.model]"
                  v-else-if="item.type == 'textarea'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :counter="item.counter"
                  filled
                  :readonly="item.readonly"
                  :disabled="item.readOnly"
                ></v-textarea>
                <v-autocomplete
                  v-model="conscripte[item.model]"
                  :loading="
                    selects &&
                    selects[item.model] &&
                    selects[item.model].loading
                      ? selects[item.model].loading
                      : false
                  "
                  :readonly="item.readonly"
                  v-else-if="item.type == 'select'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :items="
                    selects && selects[item.model] && selects[item.model].data
                      ? selects[item.model].data
                      : []
                  "
                  :item-text="
                    selects && selects[item.model] && selects[item.model].text
                      ? selects[item.model].text
                      : 'text'
                  "
                  :item-value="
                    selects && selects[item.model] && selects[item.model].value
                      ? selects[item.model].value
                      : 'value'
                  "
                  filled
                  :error-messages="
                    selects && selects[item.model] && selects[item.model].error
                      ? selects[item.model].error
                      : ''
                  "
                  :disabled="item.readOnly"
                ></v-autocomplete>
                <v-combobox
                  v-model="conscripte[item.model]"
                  :error-messages="
                    selects && selects[item.model] && selects[item.model].error
                      ? selects[item.model].error
                      : ''
                  "
                  :loading="
                    selects &&
                    selects[item.model] &&
                    selects[item.model].loading
                      ? selects[item.model].loading
                      : false
                  "
                  :readonly="item.readonly"
                  v-else-if="item.type == 'combobox'"
                  :label="item.label"
                  :hide-details="!item.hint && !item.counter"
                  :persistent-hint="item.hint || item.counter ? true : false"
                  :items="
                    selects && selects[item.model] && selects[item.model].data
                      ? selects[item.model].data
                      : []
                  "
                  :item-text="
                    selects && selects[item.model] && selects[item.model].text
                      ? selects[item.model].text
                      : 'text'
                  "
                  :item-value="
                    selects && selects[item.model] && selects[item.model].value
                      ? selects[item.model].value
                      : 'value'
                  "
                  filled
                ></v-combobox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <v-btn
      style="position: fixed; top: 10px; left: 400px; z-index: 999"
      class="px-4"
      large
      color="primary"
      @click="addConscripte()"
    >
      <v-icon class="me-3">mdi-plus</v-icon>
      ?????? ??????????
    </v-btn>
    <v-dialog persistent scrollable max-width="200" v-model="loading">
      <v-card height="150">
        <v-layout align-center align-content-center justify-center fill-height>
          <div>
            <div>
              <v-progress-circular
                indeterminate
                color="primary"
                size="65"
              ></v-progress-circular>
            </div>
            <div class="mt-6">
              ???????? ??????????????
            </div>
          </div>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { thisExpression } from "@babel/types";

const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "add_conscripte",
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == "add_conscripte"
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    findingConscripte: false,
    conscripte: {
      Type: constants.serviceTypesMap.solider,
      DutyID: 0,
      Status: "?????????? ??????????????",
      SoldierLevel: "????????",
      SoldierCategory: "????"
    },
    isEnhaa: false,
    groups: [
      {
        title: "???????????? ??????????????",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "ID",
            label: "?????????? ??????????????",
            type: "text",
            counter: 13,
            forEnhaa: true
          },
          {
            model: "Name",
            label: "?????????? ????????????",
            type: "text",
            forEnhaa: true
          },
          {
            model: "TripleNo",
            label: "?????????? ??????????????",
            type: "tribleNum"
          },
          {
            model: "KnowledgeLevel",
            label: "????????????",
            type: "select"
          },
          {
            model: "College",
            label: "???????????? ",
            type: "select"
          },
          {
            model: "Specialization",
            label: "???????????? ",
            type: "select"
          },
          {
            model: "Job",
            label: "???????????? ",
            type: "text"
          },
          {
            model: "RecuTreat",
            label: "???????????????? ??????????????????",
            type: "select"
          },
          {
            model: "Address",
            label: "?????????????? ????????????",
            type: "textarea"
          },
          {
            model: "RelevantTELE",
            label: "?????? ?????????? ??????????????",
            type: "text",
            counter: 11
          },
          {
            model: "BloodType",
            label: "?????????? ????????",
            type: "select"
          },

          {
            model: "Religion",
            label: "??????????????",
            type: "select"
          },

          {
            model: "IdentityNo",
            label: "?????????? ????????????",
            type: "text",
            counter: 14
          }

          // {
          //   model: "SoldierStatus",
          //   label: "?????? ??????????????",
          //   type: "select",
          //   forEnhaa: true,
          //   readonly: true
          // },
          // {
          //   model: "RatebState",
          //   label: "?????? ??????????????",
          //   type: "select",
          //   readonly: true
          // },
          //
          // {
          //   model: "EndingCause",
          //   label: "???????????? ??????????????",
          //   readonly: true,
          //
          //   type: "text"
          // },
          // { model: "Namat",
          //   label: "???????????? ??????????????",
          //   type: "text" },

          // {
          //   model: "MissingTime",
          //   label: "?????? ??????????????",
          //   type: "text"
          // },
        ]
      },
      {
        title: "???????????? ?????????????? ????????",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "Status",
            label: "???????? ??????????",
            type: "select",
            readOnly: true
          },
          {
            model: "RecuStage",
            label: "?????????????? ??????????????????",
            type: "select"
          },
          {
            model: "Type",
            label: "?????? ????????????",
            type: "select",
            readOnly: true
          },
          {
            model: "SoldierLevel",
            label: "????????????",
            type: "select",
            readOnly: true
          },
          {
            model: "SoldierCategory",
            label: "??????????",
            type: "select",
            readOnly: true
          }
        ]
      },
      {
        title: "???????????? ?????????????? ????????????",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "IndexNo",
            label: "?????? ?????????? ",
            type: "text"
          },

          {
            model: "CentreID",
            label: "????????????",
            type: "select"
          },
          {
            model: "Direction",
            label: " ??????????????",
            type: "select"
          },
          {
            model: "SoldierTELE",
            label: "?????? ????????????????",
            type: "text",
            counter: 11,
            forEnhaa: true
          }
        ]
      },

      {
        title: "???????? ????????????",
        desc: "",
        items: [
          {
            model: "WeaponID",
            label: "????????????",
            type: "select"
          },
          {
            model: "UnitID",
            label: "????????????",
            type: "select"
          },

          {
            model: "Markez_Tadreb",
            label: " ???????? ??????????????",
            type: "text",
            readonly: true
          },
          {
            model: "DutyID",
            label: " ???????????? ???????????? ????????",
            type: "select",
            readonly: true
          }
        ]
      },
      {
        title: "???????????? ??????????",
        desc: "",
        items: [
          {
            model: "BirthDate",
            label: "?????????? ??????????????",
            type: "date"
          },

          {
            model: "CityID",
            label: "????????????????",
            type: "select"
          },

          {
            model: "image",
            label: "???????????? ?????????????? ",
            type: "file"
          },
          {
            model: "Notes",
            label: "?????????????? ????????",
            type: "textarea",
            forEnhaa: true
          }
        ]
      },
      {
        title: "???????????? ????????????",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "RecuStartDate",
            label: "?????????? ??????????????",
            type: "select",
            forEnhaa: true
          },
          {
            model: "RecuEndDate",
            label: "?????????? ??????????????",
            type: "date"
          },
          {
            model: "ArrivalDate",
            label: " ?????????? ???????????? ?????????? ??????????????",
            type: "date"
          },
          {
            model: "RecuRegion",
            label: "?????????? ??????????????",
            type: "select"
          }
        ]
      }
    ],
    selects: {
      SoldierLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      CurrentJobID: {
        table: "Jobs",
        text: "Name",
        value: "ID_KEY"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      RecuTreat: {
        text: "text",
        value: "text",
        data: constants.RecuTreat.data
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      DriverLevel: {
        text: "text",
        value: "text",
        data: constants.DriverLevel.data
      },
      BloodType: {
        text: "text",
        value: "text",
        data: constants.BloodType.data
      },
      RecuRegion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      RecuStartDate: {
        table: "RecuStartDates",
        text: "RecuDate",
        value: "RecuDate"
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Treatment: {
        text: "text",
        value: "text",
        data: constants.Treatment.data
      },
      SoldierStatus: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.endReason
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      College: {
        text: "text",
        value: "text",
        data: constants.College.data
      },
      Direction: {
        text: "Direction",
        value: "Direction",
        table: "Direction"
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      Duties: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      ServiceType: {
        text: "text",
        value: "text",
        data: constants.serviceTypes
      },
      Type: {
        text: "text",
        value: "text",
        data: [{ text: "???????? ????????" }, { text: "????????" }]
      },
      ServiceStyle: {
        text: "text",
        value: "text",
        data: constants.ServiceStyle
      },

      MortabatDuties: {
        table: "MortabatDuties",
        text: "Specialization",
        value: "Specialization"
      },

      MartialStatus: {
        text: "text",
        value: "text",
        data: constants.matrialStatus.data
      },
      Specialization: {
        table: "Specialization",
        text: "Specialization",
        value: "Specialization"
      }
    },
    loading: false
  }),
  watch: {
    "conscripte.ID"(v) {
      if (v.length == 14 || v.length < 13) return;

      const levels = {
        1: "????????????",
        2: "????????",
        8: "?????? ????????????",
        0: "????????"
      };
      const RecuRegionID = parseInt(v.charAt(4)) - 1;
      const LevelID = parseInt(v.charAt(5));
      const WeaponID = parseInt(v.substr(6, 2));

      this.conscripte.RecuRegion = constants.RecuRegion.data[RecuRegionID].text;
      this.conscripte.KnowledgeLevel = levels[LevelID];
      this.conscripte.IndexNo =
        v.substring(4, 6) + v.substring(8, 10) + v.substring(11, 13);
      this.conscripte.WeaponID = WeaponID || 0;
      this.$set(
        this.conscripte,
        "Markez_Tadreb",
        this.selects.WeaponID.data.find(ele => ele.WeaponID == WeaponID)
          ?.Markez_Tadreb || ""
      );
      this.checkDirection();
      this.checkCity();
    },
    "conscripte.IdentityNo"(v) {
      if (v.length == 14) {
        this.$set(this.conscripte, "BirthDate", this.nationalIdToDate(v));
      }
    },
    "conscripte.RecuStage"(v) {
      this.calculateRecuEndDate();
      this.fetchAvailableStartDates();
    },
    "conscripte.UnitID"(v) {
      this.checkDuties();
    },
    "conscripte.WeaponID"(v) {
      this.checkDuties();
    },
    "conscripte.RecuTreat"(v) {
      this.calculateRecuEndDate();
    },
    "conscripte.KnowledgeLevel"(v) {
      this.calculateRecuEndDate();
      this.fetchAvailableStartDates();
    },
    "conscripte.RecuStartDate"(v) {
      this.conscripte.RecuStartDate = v;
    },
    "conscripte.CentreID"() {
      let Centre = this.selects.CentreID.data.find(
        ele => ele.CentreID == this.conscripte.CentreID
      );
      let City = this.selects.CityID.data.find(
        ele => ele.CityID == Centre.CityID
      );
      this.conscripte.CityID = City.CityID;
      this.checkDirection();
      this.checkCity();
    }
  },
  methods: {
    checkDirection() {
      console.log(this.conscripte.KnowledgeLevel, this.conscripte.CityID);
      if (this.conscripte.KnowledgeLevel && this.conscripte.CityID) {
        this.conscripte.Direction = this.selects.Direction.data.find(
          direction => {
            return (
              direction.KnowledgeLevel == this.conscripte.KnowledgeLevel &&
              direction.City == this.conscripte.CityID
            );
          }
        )?.Direction;
      }
    },
    checkCity() {
      if (this.conscripte.RecuRegion && this.conscripte.CityID) {
        let res = this.selects.Direction.data.find(
          ele =>
            ele.KnowledgeLevel == this.conscripte.KnowledgeLevel &&
            this.conscripte.CityID == ele.City
        );
        if (!res) {
          this.showError(
            "?????? ?????????? ?????????????? ?????????? ?????????? ?????? ?????????? ?? ???????? ??????????????"
          );
          this.conscripte.CityID = null;
          this.conscripte.CentreID = null;
        }
      }
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          // obj.attrs = [text, value];
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              if (table === "Unit")
                this.$set(
                  this.selects[key],
                  "data",
                  x.data.filter(ele => ele.statue == "??????????????")
                );
              else if (table === "Duty")
                this.$set(
                  this.selects[key],
                  "data",
                  x.data.filter(ele => !ele.isDeleted)
                );
              else this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              this.handleError(error);
              this.$set(
                this.selects[key],
                "error",
                "?????? ?????? ?????????? ?????????????? ???????????? ???? ?????????? ????????????????"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        }
      });
    },
    calculateRecuEndDate() {
      if (
        this.conscripte.RecuStage &&
        this.conscripte.RecuTreat &&
        this.conscripte.KnowledgeLevel
      ) {
        let incrementInYear = 0;
        let incrementInMonth = 0;
        if (this.conscripte.KnowledgeLevel == "????????????")
          incrementInYear = incrementInYear + 2;
        if (this.conscripte.KnowledgeLevel == "????????")
          incrementInYear = incrementInYear + 1;
        if (this.conscripte.KnowledgeLevel == "?????? ????????????")
          incrementInYear = incrementInYear + 1;
        if (this.conscripte.KnowledgeLevel == "????????")
          incrementInYear = incrementInYear + 3;

        if (this.conscripte.RecuStage.split("-")[0] == "????????????")
          incrementInMonth = incrementInMonth + 3;
        if (this.conscripte.RecuStage.split("-")[0] == "??????????????")
          incrementInMonth = incrementInMonth + 6;
        if (this.conscripte.RecuStage.split("-")[0] == "??????????????")
          incrementInMonth = incrementInMonth + 9;
        if (this.conscripte.RecuStage.split("-")[0] == "??????????????")
          incrementInMonth = incrementInMonth + 12;

        if (this.conscripte.KnowledgeLevel == "?????? ????????????")
          incrementInMonth = incrementInMonth + 6;

        if (this.conscripte.RecuTreat == "?????? ?????? ?????????? ??????????")
          incrementInMonth = incrementInMonth + 2;

        if (incrementInMonth > 12) {
          incrementInMonth = incrementInMonth - 12;
          incrementInYear = incrementInYear + 1;
        }

        let year =
          parseInt(this.conscripte.RecuStage.split("-")[1], 10) +
          incrementInYear;
        let month = 0 + incrementInMonth;

        this.conscripte.RecuEndDate = `${year}-${
          month < 10 ? "0" + month : month
        }-01`;
      }
    },
    updateValue(v) {
      this.conscripte.TripleNo = v;
      let splittedValue = v.split("-");
      if (v.split("-").length == 3) {
        this.$set(
          this.conscripte,
          "CentreID",
          this.selects.CentreID.data.find(
            ele => ele.CentreID == splittedValue[1]
          )?.CentreID || 0
        );
        this.$set(
          this.conscripte,
          "CityID",
          this.selects.CityID.data.find(
            ele =>
              ele.CityID ==
                this.selects.CentreID.data.find(
                  ele => ele.CentreID == splittedValue[1]
                )?.CityID || 0
          )?.CityID || 0
        );
      }
    },
    async fetchAvailableStartDates() {
      if (this.conscripte.RecuStage && this.conscripte.KnowledgeLevel) {
        let data = await this.api("global/get_all", {
          table: "RecuStartDates",
          where: {
            KnowledgeLevel: this.conscripte.KnowledgeLevel,
            RecuStage: this.conscripte.RecuStage
          }
        });
        if (data.data.length > 0) {
          this.selects.RecuStartDate.data = data.data;
          this.conscripte.RecuStartDate = data.data[0].RecuDate;
        }
      }
    },

    checkDuties() {
      if (this.conscripte.WeaponID && this.conscripte.UnitID) {
        this.groups[1].items[3].readonly = false;
        const allowedDuties = this.selects.MortabatDuties.data.filter(mEle => {
          const soldierWeapon = this.selects.WeaponID.data.find(
            ele => ele.WeaponID == this.conscripte.WeaponID
          );
          const eleWeapon = this.selects.WeaponID.data.find(
            ele => ele.WeaponID == mEle.WeaponID
          );

          return (
            mEle.UnitID === this.conscripte.UnitID &&
            soldierWeapon?.Weapon === eleWeapon?.Weapon
          );
        });

        this.selects.DutyID.data = this.selects.Duties.data.filter(
          ele =>
            allowedDuties.find(allowed => allowed.DutyID == ele.DutyID) ||
            ele.Duty == "?????????? ?????? ???????????? ???? ????????????"
        );
      } else {
        this.groups[1].items[3].readonly = true;
      }
    },
    toBase64: file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      }),
    async addConscripte() {
      this.$set(this, "loading", true);
      try {
        let conscripte = { ...this.conscripte };
        Object.keys(conscripte).forEach(key => {
          let val = conscripte[key];
          if (val == undefined) {
            conscripte[key] = null;
          }
        });

        if (conscripte.image) {
          conscripte.image = conscripte.image.path;
        }
        if (conscripte.UnitID == null) {
          conscripte.UnitID = 0;
        }
        if (conscripte.DutyID == null) {
          conscripte.DutyID = 0;
        }

        if (!conscripte.ID) {
          this.showError("???? ???????? ???? ???????????? ?????????? ??????????????");
          this.$set(this, "loading", false);
          return;
        }
        if (!conscripte.Name || conscripte.Name.trim().length == 0) {
          this.showError("???? ???????? ???? ???????????? ?????? ??????????");
          this.$set(this, "loading", false);
          return;
        }

        if (
          this.conscripte.Type === constants.serviceTypesMap.solider &&
          !conscripte.RecuEndDate
        ) {
          this.showError("???? ???????? ???? ???????????? ?????????? ??????????????");
          this.$set(this, "loading", false);
          return;
        }

        if (
          this.conscripte.Type === constants.serviceTypesMap.solider &&
          !conscripte.RecuStartDate
        ) {
          this.showError("???? ???????? ???? ???????????? ?????????? ?????????? ??????????????");
          this.$set(this, "loading", false);
          return;
        }

        if (
          this.conscripte.Type === constants.serviceTypesMap.solider &&
          !conscripte.RecuStage
        ) {
          this.showError("???? ???????? ???? ???????????? ?????????????? ????????????????");
          this.$set(this, "loading", false);
          return;
        }
        let isExists = false,
          exists = await this.api("global/get_one", {
            table: "Soldier",
            where: {
              ID: conscripte.ID
            }
          });
        if (exists && exists.ok && exists.data && exists.data.ID) {
          isExists = true;
        }
        if (isExists) {
          let addCon = await this.api("global/update_one", {
            table: "Soldier",
            where: {
              ID: conscripte.ID
            },
            update: conscripte
          });
          if (addCon && addCon.ok) {
            this.showSuccess("???? ?????????? ?????????? ??????????");
            this.deleteRouteByName("add_conscripte");
          } else {
            this.showError("???????? ?????????? ?????????? ???? ?????????? ????????????????");
          }
          this.$set(this, "loading", false);
          return;
        }
        let addCon = await this.api("global/create_one", {
          table: "Soldier",
          where: conscripte
        });

        if (addCon && addCon.ok) {
          this.showSuccess("???? ?????????? ?????????? ??????????");
        } else {
          this.showError("???????? ?????????? ?????????? ???? ?????????? ????????????????");
        }

        this.conscripte = {
          RecuStage: this.conscripte.RecuStage,
          SoldierCategory: this.conscripte.SoldierCategory,
          SoldierLevel: this.conscripte.SoldierLevel,
          Status: this.conscripte.Status,
          RecuStartDate: this.conscripte.RecuStartDate,
          ArrivalDate: this.conscripte.ArrivalDate,
          DutyID: 0,
          UnitID: 0,
          Type: conscripte.Type
        };
      } catch (error) {
        console.log(error);
      } finally {
        this.$set(this, "loading", false);
      }
    },
    filterItemsForType(items) {
      let ratebCoulmns = [
        "FileNo",
        "RatebCategory",
        "RatebLevel",
        "Directionforunit",
        "RatebState",
        "ServiceStyle",
        "SatrtingSarefRateb",
        "VolunteeringDate",
        "OlderindNo",
        "Qualification",
        "Namat",
        "Taskeen",
        "TahtElTawze3",
        "Dof3aNum",
        "JobBefore",
        "UnitJob",
        "MartialStatus",
        "NumOfChilds",
        "UnitJoinDate",
        "RatebCategoryFari"
      ];

      let soliderCoulmns = [
        "IndexNo",
        "SoldierCategory",
        "SoldierLevel",
        "RecuRegion",
        "RecuStartDate",
        "RecuStage",
        "RecuTreat",
        "MissingTime",
        "RecuEndDate",
        "SoldierStatus",
        "EndingCause",
        "College",
        "Specialization",
        "Job",
        "Direction",
        "Directionforunit",
        "ArrivalDate",
        "Alhaq",
        "TahtEltawze3",
        "BrotherID",
        "ServiceType",
        "GHA",
        "DriverLevel",
        "Treatment",
        "Markez_Tadreb"
      ];
      return this.conscripte.Type == constants.serviceTypesMap.solider
        ? items.filter(ele => ratebCoulmns.indexOf(ele.model) == -1)
        : items.filter(ele => soliderCoulmns.indexOf(ele.model) == -1);
    }
  }
};
</script>
