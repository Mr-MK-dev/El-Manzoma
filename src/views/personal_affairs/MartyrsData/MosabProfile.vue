<template>
  <div tabindex="0" class="no-focus profile">
    <template v-for="(group, i) in groups">
      <v-card class="mb-8" :key="i">
        <print-conscripte-profile
          class="me-3"
          :conscripte="conscripte"
        ></print-conscripte-profile>
        <v-card-title
          class="primary white--text"
          v-text="group.title"
        ></v-card-title>
        <v-card-subtitle v-text="group.desc"></v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(item, ii) in group.items">
              <v-col
                v-if="(isEnhaa && item.forEnhaa) || !isEnhaa"
                :key="ii"
                cols="6"
                lg="3"
                xl="3"
              >
                <v-text-field
                  v-model="conscripte[item.model]"
                  :label="item.label"
                  filled
                  v-if="item.type == 'text'"
                  disabled
                  outlined
                ></v-text-field>

                <v-textarea
                  v-model="conscripte[item.model]"
                  :label="item.label"
                  filled
                  v-if="item.type == 'note'"
                  outlined
                ></v-textarea>

                <v-card v-if="item.type == 'image'">
                  <v-card-title class="text-h6">
                    {{ item.label }}
                  </v-card-title>
                  <v-img
                    v-if="conscripte[item.model]"
                    :lazy-src="conscripte[item.model]"
                    max-height="200"
                    @click="OpenImageDialog()"
                    contain
                    max-width="150"
                    :src="conscripte[item.model]"
                  ></v-img>

                  <v-icon
                    v-if="!conscripte[item.model]"
                    @click="OpenImageDialog()"
                    large
                    color="orange darken-2"
                  >
                    mdi-arrow-up-bold-box-outline
                  </v-icon>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <v-dialog
      v-model="imageOptions.model"
      persistent
      scrollable
      max-width="450"
    >
      <v-card>
        <v-card-title>
          رفع الصورة
          <v-spacer></v-spacer>
          <v-btn icon @click="imageOptions.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>
            <v-file-input
              class="mb-3"
              type="file"
              prepend-icon=""
              label="الصورة"
              hint="من فضلك قم بتحديد مسار الصورة"
              persistent-hint
              filled
              v-model="imageOptions.path"
            ></v-file-input>
          </div>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="px-6"
            v-text="'عودة'"
            outlined
            @click="imageOptions.model = false"
            large
          ></v-btn>
          <v-btn
            color="primary"
            class="px-6"
            v-text="'حفظ الصورة'"
            @click="UpdateImage()"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.profile .v-input__slot {
  background: none !important;
}
.profile .v-label {
  color: #000 !important;
  font-size: 14px !important;
}
.profile
  .theme--light.v-text-field--outlined:not(.v-input--is-focused).v-input--is-disabled
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: var(--v-primary-base) !important;
}

.theme--light.v-input input,
.theme--light.v-input textarea {
  color: rgba(0, 0, 0, 0.87) !important ;
}

.profile .v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
</style>
<script>
const getBase64 = file =>
  new Promise(function(resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject("Error: ", error);
  });

const constants = require("../../../Constant").default;
const _ = require("lodash");
export default {
  name: "Profile",
  components: {
    PrintConscripteProfile: () =>
      import("@/views/personal_affairs/MartyrsData/martyrsPrinter.vue")
  },
  props: {
    id: {
      type: String,
      default: "0"
    }
  },
  async mounted() {
    await this.findItems();
  },
  data: () => ({
    imageOptions: {
      model: false,
      path: null
    },
    findingConscripte: false,
    conscripte: {
      conscriptionDate: null,
      unitID: null
    },
    isEnhaa: false,
    groups: [
      {
        title: "البيانات الأساسية",
        desc: "",
        forEnhaa: true,
        items: [
          {
            model: "Image",
            label: "الصورة الشخصية",
            type: "image"
          },

          {
            model: "ID",
            label: "الرقم العسكري",
            type: "text",
            readonly: true
          },
          // {
          //   model: "RecuStartDate",
          //   label: "تاريخ التجنيد",
          //   type: "text",
          //   readonly: true
          // },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text",
            readonly: true
          },

          {
            model: "UnitName",
            label: "الوحدة",
            type: "text",
            readonly: true
          },

          {
            model: "DateOfIncident",
            label: "تاريخ الاصابة",
            type: "text"
          },
          {
            model: "ReasonOrder",
            label: "قرار السببية",
            type: "text"
          },
          {
            model: "DisabilityRatio",
            label: "نسبة العجز",
            type: "text"
          },
          {
            model: "InjuredStatusDescription",
            label: "بيان حالة الإصابة",
            type: "text"
          },
          {
            model: "InjuryCategory",
            label: "تصنيف الغصابة",
            type: "text"
          },
          {
            model: "LastRecoveryOrder",
            label: "قرار الشفاء النهائي",
            type: "text"
          },
          {
            model: "MedicalCouncilOrder",
            label: "قرار المجلس الطبي",
            type: "text"
          },
          {
            model: "PatientCondition",
            label: "حالة المصاب",
            type: "text"
          },
          {
            model: "Type",
            label: "توع المجند",
            type: "text"
          },

          {
            model: "Level",
            label: "الدرجة",
            type: "text",
            readonly: true
          },

          {
            model: "KnowledgeLevel",
            label: "المؤهل",
            type: "text",
            readonly: true
          },

          {
            model: "direction",
            label: " الاتجاه",
            type: "text",
            readonly: true
          },
          {
            model: "WeaponName",
            label: "السلاح",
            type: "text",
            readonly: true
          },

          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            readonly: true
          },

          { model: "MartialStatus", label: "الحالة الاجتماعية", type: "text" },
          {
            model: "Religion",
            label: "الديانة",
            type: "text",
            counter: 11,
            readonly: true
          },
          {
            model: "PhoneNumber",
            label: "رقم التليفون",
            type: "text",
            readonly: true
          },
          {
            model: "Address",
            label: "العنوان المدني",
            type: "text",
            readonly: true
          },
          {
            model: "IncidentSummary",
            label: "ملخص الواقعة",
            type: "note",
            readonly: true
          }
        ]
      }
    ],

    loading: false
  }),
  watch: {},

  methods: {
    OpenImageDialog() {
      console.log("open Image Dialog");
      this.$set(this, "imageOptions", { model: true });
    },
    UpdateImage() {
      getBase64(this.imageOptions.path)
        .then(result => {
          this.updateImageApi(result);
        })
        .catch(e => console.log(e));
    },
    async updateImageApi(image) {
      await this.api("global/update_one", {
        table: "MartyrsAndInjuredAndDeath",
        where: { ID: this.id },
        update: { Image: image }
      });
      this.conscripte.Image = image;
      this.$set(this.imageOptions, "model", false);
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      let where = {
        Kind: "مصاب",
        ID: this.id
      };
      this.api("global/get_one", {
        table: "MartyrsAndInjuredAndDeath",
        where: where,
        include: [
          {
            model: "Wars"
          }
        ]
      })
        .then(async x => {
          let injured = await this.fetchDataBaseOnType(
            this.id,
            x.data.Type == "مجند"
              ? "Soldier"
              : x.data.Type == "ضابط"
              ? "Officer"
              : "Rateb",
            "Injured"
          );
          let FinancialDues = await this.api(`global/get_all`, {
            table: "FinancialDues",
            where: {
              ID: this.id
            }
          });
          let ParentsAndBrothers = await this.api(`global/get_all`, {
            table: "ParentsAndBrothers",
            where: {
              ID: this.id
            }
          });
          let Kids = await this.api(`global/get_all`, {
            table: "Kids",
            include: [
              {
                model: "Wives",
                where: {
                  ID: this.id
                }
              }
            ]
          });
          let parentObject = {
            fatherName:
              ParentsAndBrothers.data.find(ele => ele?.RelevantType == "الوالد")
                ?.RelevantName || "",
            motherName:
              ParentsAndBrothers.data.find(
                ele => ele?.RelevantType == "الوالدة"
              )?.RelevantName || "",
            fatherAddress:
              ParentsAndBrothers.data.find(
                ele => ele?.RelevantType == "الوالدة"
              )?.Address || "",
            motherAddress:
              ParentsAndBrothers.data.find(
                ele => ele?.RelevantType == "الوالدة"
              )?.Address || "",
            fatherPhone:
              ParentsAndBrothers.data.find(
                ele => ele?.RelevantType == "الوالدة"
              )?.tele || "",
            motherPhone:
              ParentsAndBrothers.data.find(
                ele => ele?.RelevantType == "الوالدة"
              )?.tele || "",
            fatherStatus:
              ParentsAndBrothers.data.find(
                ele => ele?.RelevantType == "الوالدة"
              )?.Status || "",
            motherStatus:
              ParentsAndBrothers.data.find(
                ele => ele?.RelevantType == "الوالدة"
              )?.Status || ""
          };
          console.log("Injured", injured);
          let data = {
            ...x.data,
            ...injured.Injured,
            ...parentObject,
            UnitName: injured.Injured.Unit.Unit,
            WeaponName: injured.Injured.Weapon.Weapon,
            Direction: injured.Injured.Unit.Directionforunit,
            WeaponName: injured.Injured.Weapon.Weapon,
            PrivateInsuranceFund:
              FinancialDues.data[0].PrivateInsuranceFund || "",
            InsuranceAndPensions:
              FinancialDues.data[0].InsuranceAndPensions || "",
            SupplementaryFund: FinancialDues.data[0].SupplementaryFund || "",
            MedicalInsurance: FinancialDues.data[0].MedicalInsurance
              ? "تم الاستخراج"
              : "لم يتم الاستخراج",

            Dcount: Kids.data.filter(ele => ele.KidType == "انثى").length,
            Scount: Kids.data.filter(ele => ele.KidType == "ذكر").length
          };
          console.log("XXX", data);

          this.$set(this, "conscripte", {
            ...data,
            Image:
              data.Image && data.Image.length
                ? data.Image
                : (
                    await this.api("global/load-image", {
                      path: constants.imagePath + data.ID + ".png"
                    })
                  ).data
          });
          console.log("consc", this.conscripte);
          // this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
