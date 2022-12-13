<template>
  <v-dialog persistent v-model="open" scrollable max-width="1000">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title>
          {{ title }}

          <v-spacer />

          <v-btn @click="$emit('on-close')" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="fields != null">
          <template
            v-for="(f, i) in fields
              .filter(f => f.infoModel)
              .filter(ele => (ele.forAdmin && isAdmin()) || !ele.forAdmin)
              .filter(ele => (ele.adminOnly && isAdmin()) || !ele.adminOnly)"
          >
            <v-col v-if="f.infoModel" :cols="f.cols ? f.cols : '9'" :key="i">
              <v-row :key="i" class="py-0 mt-3 mb-3">
                <v-spacer>
                  <v-chip color="primary">
                    {{ f.text }}
                  </v-chip>
                </v-spacer>
                <v-chip
                  color="primary"
                  v-if="
                    f.infoModel && typeof data[0][f.searchValue] == `boolean`
                  "
                >
                  {{ `${data[0][f.searchValue] ? "نعم" : "لا"}` }}
                </v-chip>

                <v-chip
                  color="primary"
                  v-if="
                    f.infoModel && typeof data[0][f.searchValue] != `boolean`
                  "
                >
                  {{ `${data[0][f.searchValue]}` }}
                </v-chip>
              </v-row>
            </v-col>
          </template>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "InfoDialog",

  data: () => ({
    valid: true
  }),

  emits: ["on-close"],

  props: {
    title: {
      type: String,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    },

    fields: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  }
};
</script>
