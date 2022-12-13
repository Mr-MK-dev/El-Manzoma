<template>
  <div class="mb-10">
    <v-row>
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title> اختيار وتشغيل العملية</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-autocomplete
                filled
                label="نوع العملية"
                v-model="operation.type"
                :items="operation_types"
                item-text="name"
                item-value="method"
                dense
            ></v-autocomplete>
          </v-card-text>
          <v-card-text class="text-center">
            <v-progress-circular
                size="350"
                color="primary"
                :indeterminate="operation.begin && !operation.perc"
                v-model="operation.perc"
            >
              <div v-if="!operation.begin">
                <div>
                  <v-btn
                      @click="runOperation(operation.type)"
                      icon
                      x-large
                      :disabled="!operation.type"
                      color="primary"
                  >
                    <v-icon>mdi-power</v-icon>
                  </v-btn>
                </div>
              </div>
              <div v-else>
                <div>
                  <v-card-title class="text-h1 d-block" dir="ltr"
                  >{{ operation.perc }} %
                  </v-card-title
                  >
                </div>
              </div>
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title> النتائج</v-card-title>
          <v-divider></v-divider>
          <v-text-field
              v-model.lazy="results.search"
              filled
              dense
              prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-data-table
              height="335"
              :search.sync="results.search"
              :headers="results.headers"
              :items="results.items"
              v-model="results.selected"
              fixed-header
          >
            <template #item.operation_errors="{ item }">
              <div>
                <template v-for="(err, i) in item.operation_errors">
                  <v-chip small :key="i" class="font-weight-bold my-1">
                    {{ err }}
                  </v-chip>
                </template>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <div>
      <child1
          ref="child1"
          @IDScarped="IDScarped"
          :current-unit-id="currentUnitId"
          :currentCons="currentCons"
          :controlOp="controlOp"
          @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child1>
      <child2
          ref="child2"
          @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
          @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child2>
      <child3
          ref="child3"
          @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
          @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child3>
      <child4
          ref="child4"
          @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
          @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child4>
    </div>
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="onePdf.model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف Pdf</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="onePdf.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="onePdf.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="readOnePdf()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="jobFile.model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="jobFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="jobFile.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessJobsFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--    FollowAccident File-->
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="followAccidentFile.model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="followAccidentFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="followAccidentFile.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessFollowAccidentFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    HumanLoss File-->
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="humanLossFile .model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="humanLossFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="humanLossFile.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessHumanLossFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    Accidents File-->
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="accidentsFile.model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="accidentsFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="accidentsFile.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessAccidentsFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    AccidentsReasons File-->
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="accidentReasonsFile.model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="accidentReasonsFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="accidentReasonsFile.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessAccidentsReasonsFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    Martyrs File-->
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="martyrsFile.model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="martyrsFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="martyrsFile.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessMartysFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    Internal Martyrs File-->
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="internalMartyrsFile.model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="internalMartyrsFile.file"
          ></v-file-input>
        </v-card-text>
        <v-card-text>
          <v-text-field
              clearable
              filled
              label="اسم الجدول"
              persistent-hint
              v-model="internalMartyrsFile.tableName"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="internalMartyrsFile.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessInternalMartysFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    Cars file-->
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="carFile.model"
        scrollable
        max-width="500"
        persistent
    >
      <v-card>
        <v-card-title> قم بتحديد ملف excel</v-card-title>
        <v-card-text>
          <v-file-input
              clearable
              filled
              label="الملف"
              persistent-hint
              v-model="carFile.file"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
              class="px-6"
              color="primary"
              outlined
              @click="carFile.model = false"
              large
          >
            عودة
          </v-btn>
          <v-btn class="px-6" color="primary" @click="proccessCarsFile()" large>
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="restore_options.model"
        persistent
        scrollable
        max-width="450"
    >
      <v-card>
        <v-card-title>
          استعادة قاعدة البيانات
          <v-spacer></v-spacer>
          <v-btn
              icon
              @click="restore_options.model = false"
              :disabled="restore_options.begin"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div v-if="restore_options.begin">
            <div class="mb-3">
              <v-progress-linear
                  indeterminate
                  color="primary"
                  rounded
              ></v-progress-linear>
            </div>
            <div>
              من فضلك لا تقم بإغلاق الصفحة أو الخروج منها, أو إغلاق المنظومة
              أثناء استعادة قاعدة البيانات
            </div>
          </div>
          <div
              class="text-center"
              v-else-if="!restore_options.begin && restore_options.done"
          >
            <div class="mb-4">
              <v-icon size="75" color="success"
              >mdi-check-circle-outline
              </v-icon
              >
            </div>
            <div>
              تم استعادة قاعدة البيانات
            </div>
          </div>
          <div v-else>
            <v-file-input
                class="mb-3"
                type="file"
                prepend-icon=""
                label="الملف"
                hint="من فضلك قم بتحديد ملف قاعدة البيانات"
                persistent-hint
                filled
                v-model="restore_options.path"
            ></v-file-input>
            <v-autocomplete
                :items="backup_options.dbs"
                item-text="name"
                item-value="id"
                v-model="restore_options.dbname"
                filled
                persistent-hint
                hint="من فضلك حدد قاعدة البيانات المراد استعادتها"
                label="قاعدة البيانات"
            ></v-autocomplete>
            <div class="mt-4">
              <span class="error--text">
                ملحوظة :
              </span>
              لا تقم أبداً بإغلاق المنظومة أو الخروج من الصفحة أثناء استعادة
              قاعدة البيانات. لإن عملية استعادة قاعدة البيانات تقوم في البداية
              <span class="error-text">بحذف</span> قاعدة البيانات الموجودة
              بالكامل - إن كانت موجودة - ثم تقوم بإضافة قاعدة البيانات الجديدة.
            </div>
          </div>
        </v-card-text>
        <v-card-actions
            v-if="!restore_options.begin || restore_options.done"
            class="px-4"
        >
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              class="px-6"
              v-text="'عودة'"
              outlined
              @click="restore_options.model = false"
              large
          ></v-btn>
          <v-btn
              color="primary"
              class="px-6"
              :disabled="restore_options.begin || restore_options.done"
              v-text="'استعادة'"
              @click="restoreDB(true)"
              large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
        v-if="isCurrentRoute(componentName)"
        v-model="backup_options.model"
        persistent
        scrollable
        max-width="450"
    >
      <v-card>
        <v-card-title>
          نسخ قاعدة البيانات
          <v-spacer></v-spacer>
          <v-btn
              icon
              @click="backup_options.model = false"
              :disabled="backup_options.begin"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div v-if="backup_options.begin">
            <div class="mb-3">
              <v-progress-linear
                  indeterminate
                  color="primary"
                  rounded
              ></v-progress-linear>
            </div>
            <div>
              من فضلك لا تقم بإغلاق الصفحة أو الخروج منها, أو إغلاق المنظومة
              أثناء نسخ قاعدة البيانات
            </div>
          </div>
          <div
              class="text-center"
              v-else-if="!backup_options.begin && backup_options.done"
          >
            <div class="mb-4">
              <v-icon size="75" color="success"
              >mdi-check-circle-outline
              </v-icon
              >
            </div>
            <div>
              تم حفظ قاعدة البيانات
            </div>
          </div>
          <div v-else>
            <v-text-field
                class="mb-3"
                prepend-icon=""
                label="المسار"
                hint="من فضلك حدد المسار للملف المراد حفظه"
                persistent-hint
                filled
                v-model="backup_options.path"
            ></v-text-field>
            <v-autocomplete
                :items="backup_options.dbs"
                item-text="name"
                item-value="id"
                v-model="backup_options.dbname"
                filled
                persistent-hint
                hint="من فضلك حدد قاعدة البيانات المراد نسخها"
                label="قاعدة البيانات"
            ></v-autocomplete>
            <div class="mt-4">
              <span class="error--text">
                ملحوظة :
              </span>
              لا تقم أبداً بإغلاق المنظومة أو الخروج من الصفحة أثناء أخذ نسخة من
              قاعدة البيانات, وإلا لن يتم حفظ البيانات بالكامل في الملف.
            </div>
          </div>
        </v-card-text>
        <v-card-actions
            v-if="!backup_options.begin || backup_options.done"
            class="px-4"
        >
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              class="px-6"
              v-text="'عودة'"
              outlined
              @click="backup_options.model = false"
              large
          ></v-btn>
          <v-btn
              color="primary"
              class="px-6"
              :disabled="backup_options.begin || backup_options.done"
              v-text="'حفظ نسخة'"
              @click="backupDB(true)"
              large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {NonFullScreenPageMode} from "pdf-lib";

("use strict");
const xlsxParser = require("xlsx-parse-json");
const lodash = require("lodash");

export default {
  name: "CompleteFugitiveData",
  components: {
    Child1: () =>
        import("@/components/sections/admin/operations/webChilds/c1.vue"),
    Child2: () =>
        import("@/components/sections/admin/operations/webChilds/c2.vue"),
    Child3: () =>
        import("@/components/sections/admin/operations/webChilds/c3.vue"),
    Child4: () =>
        import("@/components/sections/admin/operations/webChilds/c4.vue")
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
              v => v.name == this.componentName
          ),
          params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },
  data: () => ({
    componentName: "admin_operations",
    onePdf: {},
    controlOp: {
      currentOp: "",
      currentFunc: () => {
      },
      currentParams: [],
      pause: false,
      tryingToPause: false,
      disableOperateBtn: false,
      functions: {}
    },
    currentUnitId: null,
    tableFilters: {},

    onePdf: {
      model: "",
      loading: false
    },
    followAccidentFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    humanLossFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    accidentsFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    accidentReasonsFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    martyrsFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    internalMartyrsFile: {
      model: "",
      tableName: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    carFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    jobFile: {
      model: "",
      loading: false,
      file: NonFullScreenPageMode
    },
    restore_options: {
      model: false,
      done: false,
      begin: false,
      path: null,
      dbname: ""
    },
    backup_options: {
      model: false,
      done: false,
      begin: false,
      path: null,
      dbname: "",
      dbs: [
        {
          name: "قاعدة بيانات فرع الافراد",
          id: "newManzoma"
        }
      ]
    },
    file: null,
    allowChilds: true,
    stopOperationModel: false,
    stopOperationOk: false,
    operation: {
      stopIn: "",
      startIn: "",
      type: "",
      begin: false,
      perc: 0,
      done: 0,
      finish: false,
      errors: 0
    },
    noSavedOperations: ["backupDB", "update1sFromWebUnit"],
    operation_types: [
      {
        name: "إستخراج ملفBackup",
        method: "backupDB"
      },
      {
        name: "إستعادة قاعدة البيانات",
        method: "restoreDB"
      },
      {
        name: "استخراج البيانات من ملف PDF",
        method: "openPdfReader"
      },
      {
        name: "نقل بيانات الادارات التخصيصة",
        method: "migrateSMData"
      },
      // {
      //   name: "استخراج الصور من قاعدة البايانات",
      //   method: "cloneImages"
      // },
      // {
      //   name: "استخراج الصور من قاعدة  البايانات للراتب العالي",
      //   method: "cloneHighImages"
      // },
      {
        name: "تحديث بيانات الراتب العالي من الشبكة العسكرية",
        method: "UpdateFromWeb"
      },
      {
        name: " للاخطاء تحديث بيانات الراتب العالي من الشبكة العسكرية",
        method: "UpdateFailedFromWeb"
      },
      {
        name: " قراءة ملف المركبات",
        method: "readCarsFile"
      },
      {
        name: " قراءة ملف الوظايف",
        method: "readJobsFile"
      },
      {
        name: " قراءة ملف الشهداء والمصابين",
        method: "readMartyrsFile"
      },
      {
        name: " قراءة ملفات الداخلية للشهداء والمصابين",
        method: "readInternalMartyrsFile"
      },
      {
        name: " قراءة ملف أسباب الحوادث",
        method: "readAccidentsReasonsFile"
      },
      {
        name: " قراءة ملف الحوادث",
        method: "readAccidentsFile"
      },
      {
        name: " قراءة ملف الخسائر البشرية",
        method: "readHumanLossFile"
      },
      {
        name: " قراءة ملف متابعة الحوادث",
        method: "readFollowAccidentFile"
      },
      {
        name: "اتلاف قاعدة البيانات",
        method: "damageDataBase"
      }
    ],
    results: {
      search: "",
      items: [],
      headers: [
        {
          text: "المعرف",
          sortable: false,
          value: "ID"
        },
        {
          text: "الحالة",
          sortable: false,
          value: "status"
        }
      ],
      selected: []
    },
    statusColors: {
      error: "error",
      done: "success"
    },
    statusTexts: {
      error: "خطأ",
      done: "اكتمل"
    },
    login_success: false,
    list_test: [],
    list_test_search: "",
    ratebIds: [],
    currentIndex: 0,
    currentCons: []
  }),
  mounted() {
  },
  watch: {
    "operation.done"(done) {
      if (done && done > 0) {
        let all = this.result.items.length;
        this.$set(this.operation, "perc", Math.floor((done * 100) / all));
      }
    }
  },
  sockets: {
    gotUnitsFromWeb(x) {
      if (x.error) {
        this.$set(this, "list_test", x.error);
      }
      this.$set(this, "list_test", x.data);
      this.fixAndAddConscripte(x.data);
    }
  },
  methods: {
    readCarsFile() {
      this.carFile.model = true;
    },
    readMartyrsFile() {
      this.martyrsFile.model = true;
    },
    readAccidentsReasonsFile() {
      this.accidentReasonsFile.model = true;
    },
    readAccidentsFile() {
      this.accidentsFile.model = true;
    },
    readHumanLossFile() {
      this.humanLossFile.model = true;
    },
    readFollowAccidentFile() {
      this.followAccidentFile.model = true;
    },
    readInternalMartyrsFile() {
      this.internalMartyrsFile.model = true;
    },
    readJobsFile() {
      this.$set(this.jobFile, "model", true);
    },
   async damageDataBase() {

      let rateb = await this.api("global/get_all" , {
        table :"Rateb",
        where :{
          Status :'بالخدمة'
        }
      });
     let soldier = await this.api("global/get_all" , {
        table :"Soldier",
       where :{
         Status :'بالخدمة'
       }
     });

     let units= await this.api("global/get_all" , {
       table :"Unit" ,
       where :{
         statue :"بالخدمة",
         UnitID :{
           $gt:0
         }
       }
     })

     let unitIds = units.data.map(ele =>ele.UnitID);

     console.log("UnitIds" ,unitIds );



     for (let i =0 ; i < soldier.data.length ; i++){
       console.log("Shuffled" , this.textShuffle(soldier.data[i].Name))





      await this.api("global/update_one" , {
        table :"Soldier",
        where :{
          ID:soldier.data[i].ID
        },
        update :{
          Name :this.textShuffle(soldier.data[i].Name),
          UnitID :unitIds[Math.floor(Math.random()*unitIds.length)]
        }
      })
     }



     for (let i =0 ; i < rateb.data.length ; i++){
      await this.api("global/update_one" , {
        table :"Rateb",
        where :{
          ID:rateb.data[i].ID,
          UnitID :unitIds[Math.floor(Math.random()*unitIds.length)]
        },
        update :{
          Name :this.textShuffle(rateb.data[i].Name)
        }
      })
     }




    },
    async proccessFollowAccidentFile() {
      const data = await xlsxParser.onFileSelection(this.followAccidentFile.file);
      // accidentid: "3180"
      // healed: "true"
      // id: "35660"
      // lastmotabaa: "2021/12/13"
      // lastrad: "2022/10/24"
      // mahdar: "true"
      // mozakra: "true"
      // noaaha: "true"
      // radhayaa: "true"
      // takrershefa: "true"
      // takrerteby: "true"
      // tasarof: "true"
      for (const ele of data.Sheet1) {
        console.log("ELEMET IS", ele);
        let followDate = ele.lastmotabaa;
        let raddate = ele.lastrad;
        let lastFollowDate ;
        let lastResponseDate ;
        if(followDate!=" " && ele.lastmotabaa!=null){
          let date = new Date(followDate)
          lastFollowDate =this.formatDate(date)
          console.log("Date is " ,lastFollowDate )
        }
        if(raddate !=" " &&ele.lastrad!=null){
          let date = new Date(raddate)
          lastResponseDate = this.formatDate(date)
          console.log("Last Response Date is" , lastResponseDate)
        }


        await this.api("global/update_one" , {
          table : "Accidents",
          where :{
            ID_KEY : ele.accidentid,
          },
          update :{
            isDetailedNote : ele.mozakra =="true",
            isMilitaryPoliceRecord : ele.mahdar =="true",
            isFinalActOfJustice : ele.tasarof =="true",
            isOrganizationReported : ele.radhayaa =="true",
            DateOfLastFollow : lastFollowDate,
            DateOfLastReply : lastResponseDate,
          }
        });
        }






      this.$set(this.followAccidentFile, "model", false);
      this.showSuccess("تم بنجاح");
    },
    async proccessHumanLossFile() {
      const data = await xlsxParser.onFileSelection(this.humanLossFile.file);

      for (const ele of data.Sheet1) {
        console.log("ELEMET IS", ele);
        // accidentid: "3423"
        // id: "2022615200708"
        // idkey: "52743"
        // kind: "إصابة"
        // name: "محمد حلمى العفيفى البيومى"
        // type: "درجات أخرى"

        if (ele.type == "ضباط") {
          await this.api(`global/create_one`, {
            table: "HumanLoss",
            where: {
              AccidentID: ele.accidentid,
              ID: ele.id,
              Name: ele.name,
              Type: "ضابط",
              LossStatus: ele.kind == "إصابة" ? "اصابة" : ele.kind == "وفاة" ? "وفاة" : "استشهاد"
            }
          })
        } else {
          let soldiers = await this.api('global/get_one', {
            table: "Soldier",
            where: {
              ID: ele.id
            }

          });

          if (soldiers.data) {
            await this.api(`global/create_one`, {
              table: "HumanLoss",
              where: {
                AccidentID: ele.accidentid,
                ID: ele.id,
                Name: soldiers.data.Name,
                Type: "مجند",
                LossStatus: ele.kind == "إصابة" ? "اصابة" : ele.kind == "وفاة" ? "وفاة" : "استشهاد"
              }
            });


          }
          else {
            let ratebs = await this.api('global/get_one', {
              table: "Rateb",
              where: {
                ID: ele.id
              }
            });


            if (ratebs.data) {
              await this.api(`global/create_one`, {
                table: "HumanLoss",
                where: {
                  AccidentID: ele.accidentid,
                  ID: ele.id,
                  Name: ratebs.data.Name,
                  Type: "راتب عالي",
                  LossStatus: ele.kind == "إصابة" ? "اصابة" : ele.kind == "وفاة" ? "وفاة" : "استشهاد"
                }
              });

            }

            else {
              console.log("This is not existing" , ele);
            }
          }


        }

      }
      this.$set(this.humanLossFile, "model", false);
      this.showSuccess("تم بنجاح");
    },
    async proccessAccidentsFile() {
      const data = await xlsxParser.onFileSelection(this.accidentsFile.file);
      let dataIndex = 1;

      for (const ele of data.Sheet1) {
        console.log("ELEMET IS", ele);

        if (dataIndex == ele.idkey) {
          await this.api("global/create_one", {
            table: "Accidents",
            where: {
              TypeID: ele.typeid,
              UnitID: ele.unitid,
              DateOfReporting: ele.dateofreporting,
              DateOfAccident: ele.dateofaccident,
              Summary: ele.summary,
              Details: ele.details,
              DecisionMade: ele.decisionmade,
              Reason: "",
              isFollowed: ele.isfollowed == "لا يتابع" ? false : true,
              isNotableAccident: ele.isnotableaccident == "تابع أبرز الحوادث",
            }
          });
          dataIndex++;
        } else {
          let diff = ele.idkey - dataIndex;
          for (let j = 0; j < diff; j++) {
            await this.api("global/create_one", {
              table: "Accidents",
              where: {
                TypeID: 1,
                UnitID: 0,
                DateOfReporting: "01-01-2020",
                DateOfAccident: "01-01-2020",
                Summary: "please delete me daddy",
                Details: "please delete me daddy",
                DecisionMade: "please delete me daddy",
                Reason: "please delete me daddy",
                isFollowed: false,
                isNotableAccident: false,
              }
            });
            dataIndex++;
          }

          await this.api("global/create_one", {
            table: "Accidents",
            where: {
              TypeID: ele.typeid,
              UnitID: ele.unitid,
              DateOfReporting: ele.dateofreporting,
              DateOfAccident: ele.dateofaccident,
              Summary: ele.summary,
              Details: ele.details,
              DecisionMade: ele.decisionmade,
              Reason: "",
              isFollowed: ele.isfollowed == "لا يتابع" ? false : true,
              isNotableAccident: ele.isnotableaccident == "تابع أبرز الحوادث",
            }
          });
          dataIndex++;
        }
      }
      this.$set(this.accidentReasonsFile, "model", false);
      this.showSuccess("تم بنجاح");
    },
    async proccessAccidentsReasonsFile() {
      const data = await xlsxParser.onFileSelection(this.accidentReasonsFile.file);

      for (const ele of data.Sheet1) {
        console.log("ELEMET IS", ele);
        await this.api("global/create_one", {
          table: "accidentTypes",
          where: {
            CategoryID: ele.categoryid,
            Name: ele.name
          }
        });
      }
      this.$set(this.accidentReasonsFile, "model", false);
      this.showSuccess("تم بنجاح");
    },
    async proccessInternalMartysFile() {
      const data = await xlsxParser.onFileSelection(this.internalMartyrsFile.file);

      console.log("Table Name", this.internalMartyrsFile.tableName)


      for (const ele of data.Sheet1) {
        if (ele.ID != null) {
          console.log("Element is ", ele)

          let existMartyr = await this.api('global/get_one', {
            table: "MartyrsAndInjuredAndDeath",
            where: {
              ID: ele.ID
            }
          });

          if (existMartyr.data != null) {

            this.api("global/create_one", {
              table: this.internalMartyrsFile.tableName,
              where: {
                ...ele,
                MilitaryType: existMartyr.data.Type,
                Kind: existMartyr.data.Kind
              }
            });
          }
        }
      }

      this.showSuccess("تم بنجاح");

    },
    async proccessMartysFile() {
      const data = await xlsxParser.onFileSelection(this.martyrsFile.file);
      var existingCount = 0;
      var noExistionCount = 0;
      for (const ele of data.Sheet1) {
        if (ele.ID != null) {
          if (ele.Type.includes("ضابط")) {
            let officer = await this.api("global/get_one", {
              table: "Officers",
              where: {
                ID: ele.ID
              }
            });
            if (officer.data != null) {
              existingCount++;
              await this.checkAndAddinMartyrs(ele);

            } else {
              noExistionCount++;
              let saveItem = await this.api("global/create_one", {
                table: "Officers",
                where: {
                  ID: ele.ID,
                  Name: ele.Name,
                  OfficerLevel: ele.Level,
                  WeaponID: ele.WeaponID,
                  UnitID: ele.UnitID,
                  Status: "منتهي خدمته",
                  Address: ele.Address,
                  PhoneNumber: ele.PhoneNumber,
                  KnowledgeLevel: ele.KnowledgeLevel,
                  Religion: ele.Religion,
                  IdentityNo: ele.NationalID,
                  MartialStatus: ele.MartialStatus
                }
              });

              await this.checkAndAddinMartyrs(ele);
            }


          }
          if (ele.Type.includes("مجند") && ele.ID.length == 13) {
            let soldier = await this.api("global/get_one", {
              table: "Soldier",
              where: {
                ID: ele.ID
              }
            });
            if (soldier.data != null) {
              existingCount++;
              await this.checkAndAddinMartyrs(ele);

            } else {
              noExistionCount++;
              let saveItem = await this.api("global/create_one", {
                table: "Soldier",
                where: {
                  ID: ele.ID,
                  Name: ele.Name,
                  SoldierCategory: "",
                  SoldierLevel: ele.Level,
                  WeaponID: ele.WeaponID,
                  UnitID: ele.UnitID,
                  DutyID: 0,
                  RecuStartDate: ele.DateTagned,
                  KnowledgeLevel: ele.KnowledgeLevel,
                  RecuEndDate: ele.DateTasre7,
                  IdentityNo: ele.NationalID,
                  Address: ele.Address,
                  SoldierTELE: ele.PhoneNumber,
                  Religion: ele.Religion,
                  Status: "منتهي خدمته",
                  MartialStatus: ele.MartialStatus
                }
              });
              await this.checkAndAddinMartyrs(ele);

            }


          }
          if (ele.Type.includes("راتب عالي") && ele.ID.length == 13) {

            let rateb = await this.api("global/get_one", {
              table: "Rateb",
              where: {
                ID: ele.ID
              }
            });
            if (rateb.data != null) {
              existingCount++;
              await this.checkAndAddinMartyrs(ele);

            } else {
              noExistionCount++;
              let saveItem = await this.api("global/create_one", {
                table: "Rateb",
                where: {
                  ID: ele.ID,
                  Name: ele.Name,
                  RatebCategory: "",
                  RatebLevel: ele.Level,
                  WeaponID: ele.WeaponID,
                  UnitID: ele.UnitID,
                  DutyID: 0,
                  VolunteeringDate: ele.DateTagned,
                  IdentityNo: ele.NationalID,
                  Address: ele.Address,
                  SoldierTELE: ele.PhoneNumber,
                  Religion: ele.Religion,
                  Status: "منتهي خدمته",
                  KnowledgeLevel: ele.KnowledgeLevel,
                  MartialStatus: ele.MartialStatus
                }
              });
              await this.checkAndAddinMartyrs(ele);
            }

            // console.log("Rateb IS" , ele);
          }

        }

        if (ele.ID == null || (ele.ID.length != 13 && !ele.Type.includes("ضابط"))) {
          console.log("Missing Data here is", ele)
        }


      }


      console.log("Existing is ", existingCount);
      console.log("No Existing is ", noExistionCount);


    },
    async checkAndAddinMartyrs(ele) {

      // Address: "طوخ - أبو كبير - شرقيه"
      // DateOfDeath: "[NULL]"
      // DateOfInjury: "12/16/18"
      // DateTagned: "1/16/17"
      // DateTasre7: "6/1/19"
      // DisabilityRatio: "15% عجز جزئى "
      // ID: "2017415200909"
      // IncidentSummary: "أثناء تنفيذ مداهمة بمنطقة (أم مفروث) بواسطة مجموعة قتال تشكيل خاص تم تبادل إطلاق النيران بين قوة المداهمة ومجموعة من العناصرالتكفيرية ونتج عنها إنفجار عدد (2) عبوة ناسفه مما أدى إلى إصابته"
      // InjuredStatusDescription: "جروح بالوجه والفك السفلى وكسر بعظمة الانف والرتفه اليمنى للوجه/شرائح ومسامير بالركبة اليمنى"
      // InjuryCategory: "أحداث جارية"
      // Kind: "مصاب"
      // KnowledgeLevel: "متوسطة"
      // LastRecoveryOrder: "شفى بعاهة"
      // Level: "جندي"
      // MartialStatus: "متزوج"
      // MedicalCouncilOrder: "غير لائق"
      // MilitaryStatus: "خارج الخدمة"
      // Motab3a: "غير متابع"
      // Name: "عبدالله الشحات على على شلبى"
      // NationalID: "2.9762E+13"
      // PatientCondition: "على قيد الحياة"
      // PhoneNumber: "01028937065/01100886753"
      // ReasonOrder: "مصاب مادة 31"
      // Religion: "مسلم"
      // Type: "مجند"
      // UnitID: "66"
      // WeaponID: "52"
      // Ya3ol: "لا يعول"


      let existMartyr = await this.api('global/get_one', {
        table: "MartyrsAndInjuredAndDeath",
        where: {
          ID: ele.ID
        }
      });
      if (existMartyr.data != null) {
        console.log("Data", "Data is existing")
      } else {
        let saveItem = await this.api("global/create_one", {
          table: "MartyrsAndInjuredAndDeath",
          where: {
            ID: ele.ID,
            InjuredStatusDescription: ele.InjuredStatusDescription,
            IncidentSummary: ele.IncidentSummary,
            Type: ele.Type,
            Kind: ele.Kind,
            DateOfIncident: ele.Type == "مصاب" ? ele.DateOfInjury : ele.DateOfDeath,
            ReasonOrder: ele.ReasonOrder,
            MedicalCouncilOrder: ele.MedicalCouncilOrder,
            LastRecoveryOrder: ele.LastRecoveryOrder,
            PatientCondition: ele.PatientCondition,
            isSupporter: ele.Ya3ol == "يعول",
            DisabilityRatio: ele.DisabilityRatio,
            isFollowed: ele.Motab3a == "متابع",
            InjuryCategory: ele.InjuryCategory,
          }
        })
      }
    },
    async proccessCarsFile() {
      const data = await xlsxParser.onFileSelection(this.carFile.file);
      console.log(data);

      let types = lodash.uniq(data.data.map(ele => ele.type));
      let unit = lodash.uniq(data.data.map(ele => ele.unit));
      let usages = lodash.uniq(data.data.map(ele => ele.usage));
      let wight = lodash.uniq(data.data.map(ele => ele.wight));
      let colors = lodash.uniq(data.data.map(ele => ele.color));
      let forWhat = lodash.uniq(data.data.map(ele => ele.for));

      await Promise.all(
          colors.map(async ele => {
            let data = await this.api("global/get_one", {
              table: "CarColor",
              where: {
                Name: ele
              }
            });
            if (!data.data) {
              let data = await this.api("global/create_one", {
                table: "CarColor",
                where: {
                  Name: ele
                }
              });
            }
          })
      );

      await Promise.all(
          types.map(async ele => {
            let data = await this.api("global/get_one", {
              table: "CarType",
              where: {
                Name: ele
              }
            });
            if (!data.data) {
              let data = await this.api("global/create_one", {
                table: "CarType",
                where: {
                  Name: ele
                }
              });
            }
          })
      );

      await Promise.all(
          usages.map(async ele => {
            let data = await this.api("global/get_one", {
              table: "CarUsage",
              where: {
                Name: ele
              }
            });
            if (!data.data) {
              let data = await this.api("global/create_one", {
                table: "CarUsage",
                where: {
                  Name: ele
                }
              });
            }
          })
      );

      await Promise.all(
          forWhat.map(async ele => {
            let data = await this.api("global/get_one", {
              table: "CarPreparation",
              where: {
                Name: ele
              }
            });
            if (!data.data) {
              let data = await this.api("global/create_one", {
                table: "CarPreparation",
                where: {
                  Name: ele
                }
              });
            }
          })
      );

      await Promise.all(
          wight.map(async ele => {
            let data = await this.api("global/get_one", {
              table: "CarCargo",
              where: {
                Name: ele
              }
            });
            if (!data.data) {
              let data = await this.api("global/create_one", {
                table: "CarCargo",
                where: {
                  Name: ele
                }
              });
            }
          })
      );
      console.log(data.data);
      let erros = [];
      for (const ele of data.data) {
        let unit = await this.api("global/get_one", {
          table: "Unit",
          where: {
            Unit: ele.unit
          }
        });
        let carCargo = await this.api("global/get_one", {
          table: "CarCargo",
          where: {
            Name: ele.wight
          }
        });

        let carType = await this.api("global/get_one", {
          table: "CarType",
          where: {
            Name: ele.type
          }
        });
        let carUsage = await this.api("global/get_one", {
          table: "CarUsage",
          where: {
            Name: ele.usage
          }
        });
        let carColor = await this.api("global/get_one", {
          table: "CarColor",
          where: {
            Name: ele.color
          }
        });
        let carPreparation = await this.api("global/get_one", {
          table: "CarPreparation",
          where: {
            Name: ele.for
          }
        });
        if (unit.data) {
          try {
            let x = await this.api("global/create_one", {
              table: "UnitsCars",
              where: {
                CarNumber: ele.number,
                ChassetNumber: ele["face number"],
                ReleaseDate: ele.date,
                UnitID: unit.data.UnitID,
                CarColorID: carColor.data.ID_KEY,
                CarTypeID: carType.data.ID_KEY,
                CarUsageID: carUsage.data.ID_KEY,
                CarCargoID: carCargo.data.ID_KEY,
                CarPreparationID: carPreparation.data.ID_KEY,
                Notes: ele.notes,
                Status: ele.status
              }
            });
            console.log("xxxxxx", x);
          } catch (e) {
            console.log("error", e);
          }
        } else {
          erros.push(ele.unit);
        }
        console.log("wrong unit", erros);
      }
      this.showSuccess(`تم بنجاح`);
    },
    async proccessJobsFile() {
      console.log("File is", this.jobFile);
      const data = await xlsxParser.onFileSelection(this.jobFile.file);

      const invalidJobs = [];
      const mappedDutiesIds = {},
          mappedUnitIds = {},
          mappedWeaponIds = {};

      // await Promise.all(
      //     lodash.uniq(data.Sheet1.map(ele => ele.weapon)).map(async ele => {
      //       const Weapon = await this.api("global/get_one", {
      //         table: "Weapon",
      //         where: {
      //           Weapon: {
      //             $like: ele
      //           }
      //         }
      //       });
      //       if (!Weapon.data) {
      //         console.log(ele);
      //       } else {
      //         mappedWeaponIds[ele] = Weapon.data.WeaponID;
      //       }
      //       return ele;
      //     })
      // );

      await Promise.all(
          data.Sheet1.map(async ele => {
            let dutyName = ele.duty;
            const duty = await this.api("global/get_one", {
              table: "Duty",
              where: {
                Duty: dutyName
              }
            });
            if (!duty.data) {
              invalidJobs.push(dutyName);
            } else {
              if (duty.data.WeaponID == null) {
                const update = await this.api("global/update_one", {
                  table: "Duty",
                  where: {
                    Duty: dutyName
                  },
                  update: {
                    WeaponID: ele.weaponid
                  }
                });
              }
              mappedDutiesIds[dutyName] = duty.data.DutyID;
            }
            return ele;
          })
      );
      await Promise.all(
          lodash.uniq(invalidJobs).map(async ele => {
            let dutyName = ele;

            await this.api("global/create_one", {
              table: "Duty",
              where: {
                Duty: dutyName,
                WeaponID: ele.weaponid
              }
            });
            const duty = await this.api("global/get_one", {
              table: "Duty",
              where: {
                Duty: dutyName
              }
            });
            mappedDutiesIds[dutyName] = duty.data?.DutyID;
            return ele;
          })
      );

      // await Promise.all(
      //     lodash.uniq(data.Sheet1.map(ele => ele.unit)).map(async item => {
      //       const unit = await this.api("global/get_one", {
      //         table: "Unit",
      //         where: {
      //           Unit: {
      //             $like: UnitsMapped[item] || item
      //           }
      //         }
      //       });
      //       if (!unit.data) {
      //         //]
      //         console.log(item);
      //       } else {
      //         mappedUnitIds[item] = unit.data.UnitID;
      //       }
      //       return item;
      //     })
      // );

      // console.log("Mapped Units" , mappedUnitIds)

      await Promise.all(
          data.Sheet1.map(async ele => {
            if (ele.weaponid == null || ele.weaponid == "") {
              console.log("Element is", ele);
            }
            console.log("weapon is", ele.weaponid);

            await this.api("global/create_one", {
              table: "MortabatDuties",
              where: {
                UnitID: ele.unitid,
                DutyID: mappedDutiesIds[ele.duty],
                WeaponID: ele.weaponid,
                Category: ele.category,
                Level: ele.degree,
                ServiceType: ele.type,
                Moratab: ele.salary,
                Siasa: ele.policy
              }
            });

            // console.log(ele);

            return ele;
          })
      );
      this.showSuccess(`تم بنجاح`);
    },
    async IDScarped(event) {
      this.currentIndex++;
      this.operation.perc = Math.ceil(
          (this.currentIndex / this.ratebIds.length) * 100
      );

      let id = event.id;
      this.results.items.push({
        ID: event.id,
        status: event.success ? this.statusTexts.done : this.statusTexts.error
      });

      if (event.success) {
        console.log("event", event);
        await this.api(`global/delete_all`, {
          table: "RatebPenalities",
          where: {
            ID: id
          }
        });

        // await Promise.all(
        //   event.conscripte.unitsWithDate.map(ele => {
        //     return this.api(`global/create_one`, {
        //       table: "WebUnits",
        //       where: {
        //         ID: ele.militaryId,
        //         UnitText: ele.unit,
        //         Date: ele.date
        //       }
        //     });
        //   })
        // );

        await Promise.all(
            event.conscripte.penalities.map(ele => {
              let cText = ele.crimeText;
              cText = cText.replaceAll(
                  "الـــوظيــفة : قـــــــائد الوحـــــــــــــدة",
                  " "
              );
              cText = cText.replaceAll(
                  "رتــبة واســـم : مقدم / عماد محمد عبدالعظيم",
                  " "
              );
              cText = cText.replaceAll(
                  "التــــــوقيـــــع )......................................(",
                  " "
              );
              return this.api(`global/create_one`, {
                table: "RatebPenalities",
                where: {
                  ID: id,
                  date: ele.date,
                  crimeText: cText,
                  crimeFromDate: ele.crimeFromDate,
                  crimeToDate: ele.crimeToDate,
                  periodInDays: ele.periodInDays,
                  orderer: ele.orderer,
                  withSalaryCut: ele.withSalaryCut,
                  fromDate: ele.fromDate,
                  toDate: ele.toDate,
                  type: ele.type,
                  kind: ele.kind,
                  orderNumber: ele.orderNumber,
                  orderDate: ele.orderDate,
                  isCourt: ele.isCourt,
                  courtDate: ele.courtDate,
                  courtPlace: ele.courtPlace
                }
              });
            })
        );
        await this.api(`global/update_one`, {
          table: "Rateb",
          where: {
            ID: id
          },
          update: {
            lastScrapingStatus: true
          }
        });
      } else {
        await this.api(`global/update_one`, {
          table: "Rateb",
          where: {
            ID: id
          },
          update: {
            lastScrapingStatus: false
          }
        });
      }
    },
    async UpdateFromWeb() {
      await this.api(`global/update_one`, {
        table: "Rateb",
        where: {
          Status: "بالخدمة"
        },
        update: {
          lastScrapingStatus: true
        }
      });
      let ratebIds = await this.api(`global/queryRunners`, {
        query: `SELECT ID FROM Rateb where Status = N'بالخدمة' `
      });
      this.ratebIds = ratebIds.data.map(ele => ele.ID);
      this.getToken(0);
    },
    async UpdateFailedFromWeb() {
      let ratebIds = await this.api(`global/queryRunners`, {
        query: `SELECT ID FROM Rateb where Status = N'بالخدمة' and lastScrapingStatus = 0 `
      });
      this.ratebIds = ratebIds.data.map(ele => ele.ID);
      console.log(this.ratebIds);
      this.getToken(0);
    },
    getToken(index, asSegelat = false) {
      let xhttp = new XMLHttpRequest(),
          that = this,
          token = "";
      console.log("Getting Token..." + index);

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log("Got Token");

          let html = document.createElement("html");
          html.innerHTML = this.responseText;
          html.hidden = true;
          let token_inputs = html.getElementsByTagName("input");
          if (
              token_inputs["__RequestVerificationToken"] &&
              token_inputs["__RequestVerificationToken"].value
          ) {
            token = token_inputs["__RequestVerificationToken"].value;
            that.login(token, index, asSegelat);
          } else {
            if (asSegelat) {
              that.pushError({
                id: "الشبكة العسكرية",
                type: "ويب",
                errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية"]
              });
            } else {
              that.pushError({
                id: that.result.items[index].unitText,
                type: "وحدة",
                errors: ["تعذر تحميل معرف ارتباط الوحدة"]
              });
            }
          }
        }
      };
      xhttp.timeout = 6000;
      xhttp.onerror = function (error) {
        console.log("Error");
        console.log(error);
        if (!asSegelat) {
          //that.passUnit(index);
          that.pushError({
            id: that.result.items[index].unitText,
            type: "وحدة",
            errors: ["تعذر تحميل معرف ارتباط الوحدة", error]
          });
        } else {
          that.pushError({
            id: "الشبكة العسكرية",
            type: "ويب",
            errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية"]
          });
        }
      };
      xhttp.ontimeout = function (error) {
        console.log("Timeout");
        console.log(error);
        if (asSegelat) {
          that.pushError({
            id: "الشبكة العسكرية",
            type: "ويب",
            errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية عشان الشبكة فصلت"]
          });
        } else {
          that.pushError({
            id: that.result.items[index].unitText,
            type: "وحدة",
            errors: [
              "تعذر تحميل معرف ارتباط الوحدة عشان الشبكة العسكرية فصلت",
              error
            ]
          });
        }
      };
      xhttp.open("get", "http://1.33.1.150/segelat/Home/login/", true);
      xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
      );
      xhttp.send();
    },
    login(token = "", index, asSegelat = false) {
      let xhttp = new XMLHttpRequest(),
          that = this,
          params = [...arguments];
      console.log("Logging-in...", token);

      this.$set(this.operation, "begin", true);
      let {unitText, username, password, unitId} = {
        unitText: "السجلات العسكرية",
        username: "10000053",
        password: "army53",
        unitId: null
      };

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseText.includes("المستخدم الحالي")) {
            console.log("Logged-in", that.$refs);
            that.$refs.child1.setNewForceList(that.ratebIds);
          }
        }
      };
      xhttp.onerror = function (error) {
        console.log("Error");
        console.log(error);
        that.showError(error);
      };
      xhttp.timeout = 5000;
      xhttp.ontimeout = function (error) {
        console.log("Timeout");
        console.log(error);

        console.log(`سيتم إعادة نفس العملية بعد: ${2000 / 1000} ثانية`);
        setTimeout(() => {
          that.login(token, index);
        }, 2000);
      };
      xhttp.open("post", "http://1.33.1.150/segelat/Home/Login", true);
      xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
      );
      xhttp.send(
          `UserName=${username}&Password=${password}&__RequestVerificationToken=${token}`
      );
    },

    async migrateSMData() {
      return;
      const soliders = await this.api("global/get_all", {
        table: "SMSoldier",
        attrs: ["ID"]
      });
      let total = soliders.data.length,
          currentIndex = 0;
      this.operation.begin = true;
      for (const soliderId of soliders.data) {
        try {
          const isSoliderExsit = await this.api("global/get_one", {
            table: "Soldier",
            where: {
              ID: soliderId.ID
            }
          });

          let ele = await this.api("global/get_one", {
            table: "SMSoldier",
            where: {
              ID: soliderId.ID
            }
          });

          ele = ele.data;

          currentIndex++;
          this.operation.perc = Math.ceil((currentIndex / total) * 100);

          const duty = await this.api("global/get_one", {
            table: "Duty",
            where: {
              Duty: ele.Duty
            }
          });

          const newEle = {
            ...ele,
            DutyID: duty ? duty.DutyID : 1,
            KnowledgeLevel: ele.KnowLedgeLevel,
            MissingTime: ele.RecuTreat,
            RelevantTELE: ele.RelecantTELE
          };
          if (!isSoliderExsit.data?.ID) {
            let rs = await this.api("global/create_one", {
              table: "Soldier",
              where: newEle
            });
            console.log("create_one", rs, newEle);
          } else {
            let res = await this.api("global/update_one", {
              table: "Soldier",
              update: newEle,
              where: {
                ID: soliderId.ID
              }
            });
            console.log();
            console.log("update_one", res, newEle);
          }
          this.results.items.push({
            ID: soliderId.ID,
            status: this.statusTexts.done
          });
        } catch (error) {
          console.log(error);
          this.results.items.push({
            ID: soliderId.ID,
            status: this.statusTexts.error
          });
        }
      }
    },
    // async cloneImages() {
    //   const soliders = await this.api("global/get_all", {
    //     table: "Soldier",
    //     attrs: ["ID"],
    //     order: [["ID", "DESC"]]
    //   });
    //   let total = soliders.data.length,
    //     currentIndex = 0;
    //   this.operation.begin = true;
    //   for (const ele of soliders.data) {
    //     try {
    //       currentIndex++;
    //       this.operation.perc = Math.ceil((currentIndex / total) * 100);
    //       let x = await this.api("server/db-img-to-local", {
    //         ID: ele.ID,
    //         table: "Soldier"
    //       });
    //       console.log(x, ele.ID);
    //       if (x.data) {
    //         this.results.items.push({
    //           ID: ele.ID,
    //           status: this.statusTexts.done
    //         });
    //       } else {
    //         throw new Error();
    //       }
    //     } catch (error) {
    //       this.results.items.push({
    //         ID: ele.ID,
    //         status: this.statusTexts.error
    //       });
    //     }
    //   }
    // },
    // async cloneHighImages() {
    //   const soliders = await this.api("global/get_all", {
    //     table: "Rateb",
    //     attrs: ["ID"],
    //     order: [["ID", "DESC"]]
    //   });
    //   let total = soliders.data.length,
    //     currentIndex = 0;
    //   this.operation.begin = true;
    //   for (const ele of soliders.data) {
    //     try {
    //       currentIndex++;
    //       this.operation.perc = Math.ceil((currentIndex / total) * 100);
    //       let x = await this.api("server/db-img-to-local", {
    //         ID: ele.ID,
    //         table: "Rateb"
    //       });
    //       console.log(x, ele.ID);
    //       if (x.data) {
    //         this.results.items.push({
    //           ID: ele.ID,
    //           status: this.statusTexts.done
    //         });
    //       } else {
    //         throw new Error();
    //       }
    //     } catch (error) {
    //       this.results.items.push({
    //         ID: ele.ID,
    //         status: this.statusTexts.error
    //       });
    //     }
    //   }
    // },
    setOperationErrors(operationErrors) {
      for (let i = 0; i < operationErrors.length; i++) {
        operationErrors[i].operation_errors = operationErrors[i].errors.split(
            " --||-- "
        );
      }
      this.$set(this.errors, "items", operationErrors);
    },
    async init() {
      this.addFunctionsToControl();
    },
    addFunctionsToControl() {
      this.$set(this.controlOp.functions, "isStopped", this.isStopped);
      this.$set(
          this.controlOp.functions,
          "repeatCurrentOpAfter",
          this.repeatCurrentOpAfter
      );
    },
    runOperation(method) {
      this[method]();
    },
    openPdfReader() {
      this.$set(this.onePdf, "model", true);
    },
    async readOnePdf() {
      this.$set(this.onePdf, "model", false);

      await this.api("sections/nozom/readOnePdf", {
        file: this.onePdf.file.path
      });
    },
    async restoreDB(saveDB = false) {
      if (saveDB) {
        let {path, dbname} = this.restore_options;
        console.log("path", path.path.split(".")[1]);
        if (!path || !dbname) {
          this.showError("من فضلك قم بتحديد الملف وقاعدة البيانات المطلوبة.");
        } else {
          this.$set(this.restore_options, "done", false);
          this.$set(this.restore_options, "begin", true);
          try {
            if (path.path.split(".")[1] != "bak") {
              this.showError("هذا الملف غير موجود");
              return;
            }
            let restore = await this.api("server/db-restore", {
              dbpath: path.path,
              dbname
            });
            this.$set(this.restore_options, "done", true);
          } catch (e) {
            //
          } finally {
            this.$set(this.restore_options, "begin", false);
          }
        }
      } else {
        this.$set(this.restore_options, "done", false);
        this.$set(this.restore_options, "begin", false);
        this.$set(this.restore_options, "model", true);
      }
    },
    async backupDB(saveDB = false) {
      if (saveDB) {
        let {path, dbname} = this.backup_options;
        if (!path || !dbname) {
          this.showError("من فضلك قم بتحديد المسار وقاعدة البيانات المطلوبة.");
        } else {
          this.$set(this.backup_options, "done", false);
          this.$set(this.backup_options, "begin", true);
          let backup = await this.api("server/db-backup", {
            path: path,
            dbname
          });
          this.$set(this.backup_options, "begin", false);
          this.$set(this.backup_options, "done", true);
        }
      } else {
        this.$set(this.backup_options, "done", false);
        this.$set(this.backup_options, "begin", false);
        this.$set(this.backup_options, "model", true);
      }
    }
  }
};
</script>
