<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-title>
      {{ title }}

      <v-spacer />

      <v-btn
        v-if="addButton && hasEditAccess()"
        @click="$emit('on-add')"
        large
        outlined
        color="primary"
      >
        {{ addBtnTitle }}
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text v-if="fields != null">
      <v-row>
        <template
          v-for="(f, i) in fields
            .filter(f => f.inSearch)
            .filter(ele => (ele.forAdmin && isAdmin()) || !ele.forAdmin)
            .filter(ele => (ele.adminOnly && isAdmin()) || !ele.adminOnly)"
        >
          <v-col
            v-if="f.type === 'title'"
            :key="i"
            class="py-0 mt-3 mb-3"
            cols="12"
          >
            <v-spacer>
              <v-card>
                <v-card-title class="primary white--text">
                  {{ f.searchTitle }}
                </v-card-title>
              </v-card>
            </v-spacer>
          </v-col>
          <v-col
            v-if="f.type !== 'date' && f.type !== 'title'"
            :key="i"
            class="py-0 mt-3 mb-3"
            cols="6"
            lg="4"
          >
            <v-text-field
              v-if="!f.type || f.type == 'text'"
              filled
              :label="f.text"
              v-model="search[f.searchValue]"
              :hide-details="!f.hint"
              :persistent-hint="f.hint"
              @keypress.enter="$emit('on-search', search)"
            />
            <trible-num
              v-else-if="f.type == 'tribleNum'"
              :model="search[f.searchValue]"
              @updateValue="updateValue"
            >
            </trible-num>
            <v-row class="py-0 my-0" v-else-if="f.type == 'select'">
              <v-col
                v-if="f.multiple"
                @click="selectAll(f)"
                cols="1"
                class="py-3 my-1"
              >
                <v-icon
                  style="cursor: pointer;"
                  v-if="f.type == 'select'"
                  v-icon
                  class="me-3"
                  >mdi-select-all</v-icon
                >
              </v-col>

              <v-col v-if="selects[f.searchValue]" cols="11" class="py-0 my-0">
                <v-autocomplete
                  v-if="f.type == 'select'"
                  :label="f.text"
                  :hint="f.hint"
                  v-model="search[f.searchValue]"
                  :items="
                    selects[f.searchValue] ? selects[f.searchValue].data : []
                  "
                  :multiple="f.multiple"
                  :item-value="
                    selects[f.searchValue] ? selects[f.searchValue].value : ''
                  "
                  :item-text="
                    selects[f.searchValue] ? selects[f.searchValue].text : ''
                  "
                  filled
                  :error-messages="
                    selects[f.searchValue] ? selects[f.searchValue].error : ''
                  "
                  :append-icon="
                    selects[f.searchValue] && selects[f.searchValue].error
                      ? 'mdi-refresh'
                      : 'mdi-chevron-down'
                  "
                  @click:append="
                    selects[f.searchValue] && selects[f.searchValue].error
                      ? init(f.searchValue)
                      : () => {}
                  "
                  :hide-details="f.hint ? false : true"
                  :persistent-hint="f.hint ? true : false"
                  :loading="
                    (selects[f.searchValue] &&
                      selects[f.searchValue].loading) ||
                      f.loading
                  "
                  clearable
                >
                  <template
                    v-if="
                      search[f.searchValue] && search[f.searchValue].length > 10
                    "
                    v-slot:selection="{ item, index }"
                  >
                    <v-chip v-if="index === 0">
                      <span>{{ item.text }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ search[f.searchValue].length - 1 }} اخري)
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-textarea
              v-else-if="f.type == 'textarea'"
              filled
              :label="f.text"
              v-model="search[f.searchValue]"
              :hide-details="!f.hint"
              :persistent-hint="f.hint"
              auto-grow
              rows="1"
            />

            <v-checkbox
              v-else-if="f.type == 'checkbox'"
              :label="f.text"
              v-model="search[f.searchValue]"
            >
            </v-checkbox>
          </v-col>

          <v-col
            class="py-0 mt-3 mb-3"
            cols="8"
            :key="i + '_date'"
            v-else-if="f.type == 'date'"
          >
            <v-row v-if="search[f.searchValue]">
              <v-col cols="6">
                <v-text-field
                  filled
                  type="date"
                  :label="f.text + ' (من)'"
                  v-model="search[f.searchValue][0]"
                  :hide-details="!f.hint"
                  :persistent-hint="f.hint"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  filled
                  :label="f.text + ' (الى)'"
                  type="date"
                  v-model="search[f.searchValue][1]"
                  :hide-details="!f.hint"
                  :persistent-hint="f.hint"
                />
              </v-col>
            </v-row>
          </v-col>
        </template>
      </v-row>
    </v-card-text>

    <v-divider />

    <v-card-actions v-if="searchButton" class="px-4 py-4">
      <v-btn v-if="searchButton"
        class="px-6"
        @click="$emit('on-search', search)"
        large
        color="primary"
        v-text="'بحث'"
      />
      <v-btn
        v-if="clearOption"
        class="px-6"
        @click="clearSearch"
        large
        color="primary"
        v-text="'بحث جديد'"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CustomSearch",

  data: () => ({
    // search: {}
  }),

  emits: ["on-search", "on-add"],

  props: {
    title: {
      type: String,
      default: "بحث متقدم"
    },
    addBtnTitle: {
      type: String,
      default: "إضافة"
    },
    loading: {
      type: Boolean,
      default: false
    },
    clearOption: {
      type: Boolean,
      default: false
    },
    addButton: {
      type: Boolean,
      default: true
    },
    searchButton: {
      type: Boolean,
      default: true
    },
    fields: {
      type: Array,
      default: () => []
    },
    search: {
      type: Object,
      default: () => {}
    },
    selects: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    if (!this.search) this.search = {};
    this.initDates();
  },
  methods: {
    clearSearch() {
      this.search = {};
      this.initDates();
    },
    updateValue(v) {
      this.search[
        this.fields.find(ele => ele.type === "tribleNum").searchValue
      ] = v;
    },
    selectAll(f) {
      this.$set(
        this.search,
        f.searchValue,
        this.selects[f.searchValue].data
          .map(ele => ele[this.selects[f.searchValue].value] || null)
          .filter(ele => ele)
      );
    },
    initDates() {
      let dates = this.fields
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        if (!this.search[d] && !this.search.length)
          this.$set(this.search, d, []);
      });
    }
  }
};
</script>
