<template>
  <div>
    <div>
      <v-container class="grey lighten-5">
        <v-row no-gutters>
          <v-col cols="4">
            <v-layout
              align-center
              align-content-center
              justify-center
              fill-height
            >
              <v-card width="350" height="300" class="text-center mb-1">
                <v-layout
                  align-center
                  align-content-center
                  justify-center
                  fill-height
                >
                  <div>
                    <v-card-text>
                      <v-avatar size="220">
                        <div>
                          <div>
                            <v-btn
                              @click="closeRecommendations()"
                              large
                              outlined
                              color="primary"
                            >
                              إيقاف التوصيات
                            </v-btn>
                            <v-btn
                              @click="openRecommendations()"
                              large
                              outlined
                              color="primary"
                            >
                              تشغيل التوصيات
                            </v-btn>
                          </div>
                        </div>
                      </v-avatar>
                    </v-card-text>
                  </div>
                </v-layout>
              </v-card>
            </v-layout>
          </v-col>
          <v-col cols="4">
            <v-layout
              align-center
              align-content-center
              justify-center
              fill-height
            >
              <v-card width="350" height="300" class="text-center mb-1">
                <v-layout
                  align-center
                  align-content-center
                  justify-center
                  fill-height
                >
                  <div>
                    <v-card-text>
                      <v-avatar size="220">
                        <div>
                          <div>
                            <v-btn
                              @click="closeSMRecommendations()"
                              large
                              outlined
                              color="primary"
                            >
                              إيقاف توصيات الإدارات
                            </v-btn>
                            <v-btn
                              @click="openSMRecommendations()"
                              large
                              outlined
                              color="primary"
                            >
                              تشغيل توصيات الإدارات
                            </v-btn>
                          </div>
                        </div>
                      </v-avatar>
                    </v-card-text>
                  </div>
                </v-layout>
              </v-card>
            </v-layout>
          </v-col>
          <v-col cols="4">
            <v-layout
              align-center
              align-content-center
              justify-center
              fill-height
            >
              <v-card width="350" height="300" class="text-center mb-1">
                <v-layout
                  align-center
                  align-content-center
                  justify-center
                  fill-height
                >
                  <div>
                    <v-card-text>
                      <v-avatar size="220">
                        <div>
                          <div>
                            <v-btn
                              @click="closeRecommendationsAndSelections()"
                              large
                              outlined
                              color="primary"
                            >
                              إيقاف توصيات إنتقاءات
                            </v-btn>
                            <v-btn
                              @click="openRecommendationsAndSelections()"
                              large
                              outlined
                              color="primary"
                            >
                              تشغيل توصيات إنتقاءات
                            </v-btn>
                          </div>
                        </div>
                      </v-avatar>
                    </v-card-text>
                  </div>
                </v-layout>
              </v-card>
            </v-layout>
          </v-col>
          <v-col cols="4">
            <v-layout
              align-center
              align-content-center
              justify-center
              fill-height
            >
              <v-card width="350" height="300" class="text-center mb-1">
                <v-layout
                  align-center
                  align-content-center
                  justify-center
                  fill-height
                >
                  <div>
                    <v-card-text>
                      <v-avatar size="340">
                        <div>
                          <div>
                            <v-btn
                              @click="closeTransferList()"
                              large
                              outlined
                              color="primary"
                            >
                              إيقاف خطة الإضافة والشطب في نشرة الإنتقالات
                            </v-btn>
                            <v-btn
                              @click="openTransferList()"
                              large
                              outlined
                              color="primary"
                            >
                              تشغيل خطة الإضافة والشطب في نشرة الإنتقالات
                            </v-btn>
                          </div>
                        </div>
                      </v-avatar>
                    </v-card-text>
                  </div>
                </v-layout>
              </v-card>
            </v-layout>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemControl",

  methods: {
    async openRecommendations() {
      try {
        await this.api("global/update_one", {
          table: "SystemRules",
          where: { Key: "Recommendations" },
          update: {
            Value: true
          }
        });
        this.showSuccess("تم تشغيل التوصيات");
      } catch (e) {
        this.handleError(e);
        this.showError("تعذر الحفظ في قاعدة البيانات");
      }
    },
    async closeRecommendations() {
      try {
        await this.api("global/update_one", {
          table: "SystemRules",
          where: { Key: "Recommendations" },
          update: {
            Value: false
          }
        });
        this.showSuccess("تم غلق التوصيات");
      } catch (e) {
        this.handleError(e);
        this.showError("تعذر الحفظ في قاعدة البيانات");
      }
    },
    async openSMRecommendations() {
      try {
        await this.api("global/update_one", {
          table: "SystemRules",
          where: { Key: "SMRecommendations" },
          update: {
            Value: true
          }
        });
        this.showSuccess("تم تشغيل التوصيات");
      } catch (e) {
        this.handleError(e);
        this.showError("تعذر الحفظ في قاعدة البيانات");
      }
    },
    async closeSMRecommendations() {
      try {
        await this.api("global/update_one", {
          table: "SystemRules",
          where: { Key: "SMRecommendations" },
          update: {
            Value: false
          }
        });
        this.showSuccess("تم غلق التوصيات");
      } catch (e) {
        this.handleError(e);
        this.showError("تعذر الحفظ في قاعدة البيانات");
      }
    },
    async openRecommendationsAndSelections() {
      try {
        await this.api("global/update_one", {
          table: "SystemRules",
          where: { Key: "RecommendationsAndSelections" },
          update: {
            Value: true
          }
        });
        this.showSuccess("تم تشغيل التوصيات");
      } catch (e) {
        this.handleError(e);
        this.showError("تعذر الحفظ في قاعدة البيانات");
      }
    },
    async closeRecommendationsAndSelections() {
      try {
        await this.api("global/update_one", {
          table: "SystemRules",
          where: { Key: "RecommendationsAndSelections" },
          update: {
            Value: false
          }
        });
        this.showSuccess("تم غلق التوصيات");
      } catch (e) {
        this.handleError(e);
        this.showError("تعذر الحفظ في قاعدة البيانات");
      }
    },
    async openTransferList() {
      try {
        await this.api("global/update_one", {
          table: "SystemRules",
          where: { Key: "TransferList" },
          update: {
            Value: true
          }
        });
        this.showSuccess("تم تشغيل خطة الإضافة والشطب في نشرة الإنتقالات");
      } catch (e) {
        this.handleError(e);
        this.showError("تعذر الحفظ في قاعدة البيانات");
      }
    },
    async closeTransferList() {
      try {
        await this.api("global/update_one", {
          table: "SystemRules",
          where: { Key: "TransferList" },
          update: {
            Value: false
          }
        });
        this.showSuccess("تم غلق خطة الإضافة والشطب في نشرة الإنتقالات");
      } catch (e) {
        this.handleError(e);
        this.showError("تعذر الحفظ في قاعدة البيانات");
      }
    }
  }
};
</script>

<style scoped></style>
