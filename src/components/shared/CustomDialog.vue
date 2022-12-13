<template>
  <v-dialog persistent v-model="open" scrollable max-width="1000">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>
          {{ title }}

          <v-spacer />

          <v-btn @click="$emit('on-close')" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="fields != null">
          <v-row>
            <template
              v-for="(f, i) in fields
                .filter(f => f.inModel)
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
                      {{ f.text }}
                    </v-card-title>
                  </v-card>
                </v-spacer>
              </v-col>
              <v-col v-if="f.type!=='title'" :cols="f.cols ? f.cols : '4'" :key="i">
                <v-text-field
                  v-if="!f.type || ['text', 'date'].includes(f.type)"
                  filled
                  :type="f.type == 'date' ? 'date' : 'text'"
                  :label="
                    f.required != null
                      ? f.required
                        ? f.text + `( مطلوب )`
                        : f.text
                      : f.text
                  "
                  v-model="data[f.searchValue]"
                  :hide-details="!f.hint"
                  :persistent-hint="f.hint"
                  :readonly="f.readOnly"
                  :disabled="f.readOnly"
                  @keypress.enter="validate"
                  :required="f.required != null ? f.required : false"
                  :rules="f.required ? [v => !!v || 'يجب ادخال ${f.text}'] : []"
                />
                <v-text-field
                  v-if="!f.type || ['password'].includes(f.type)"
                  filled
                  :type="'password'"
                  :label="
                    f.required != null
                      ? f.required
                        ? f.text + `( مطلوب )`
                        : f.text
                      : f.text
                  "
                  v-model="data[f.searchValue]"
                  :hide-details="!f.hint"
                  :persistent-hint="f.hint"
                  :readonly="f.readOnly"
                  :disabled="f.readOnly"
                  @keypress.enter="validate"
                  :required="f.required != null ? f.required : false"
                  :rules="f.required ? [v => !!v || 'يجب ادخال ${f.text}'] : []"
                />

                <trible-num
                  v-else-if="f.type == 'tribleNum'"
                  :model="data[f.searchValue]"
                  @updateValue="updateValue"
                  @emitKeyDown="emitKeyDown"
                  :required="f.required != null ? f.required : false"
                  :rules="f.required ? [v => !!v || 'يجب ادخال ${f.text}'] : []"
                >
                </trible-num>

                <v-autocomplete
                  v-else-if="f.type == 'select'"
                  filled
                  :label="
                    f.required != null
                      ? f.required
                        ? f.text + `( مطلوب )`
                        : f.text
                      : f.text
                  "
                  :multiple="f.multiple && !f.notMultipleInModel"
                  :readonly="f.readOnly"
                  :disabled="f.readOnly"
                  v-model="data[f.searchValue]"
                  :hide-details="!f.hint"
                  :persistent-hint="f.hint"
                  :items="
                    selects[f.searchValue] ? selects[f.searchValue].data : []
                  "
                  :item-value="
                    selects[f.searchValue]
                      ? selects[f.searchValue].value
                      : 'value'
                  "
                  :item-text="
                    selects[f.searchValue]
                      ? selects[f.searchValue].text
                      : 'text'
                  "
                  :required="f.required != null ? f.required : false"
                  :rules="
                    f.required
                      ? [
                          v =>
                            f.multiple
                              ? !!(v && v.length)
                              : !!v || 'يجب اختيار ${f.text}'
                        ]
                      : []
                  "
                />

                <v-textarea
                  v-else-if="f.type == 'textarea'"
                  filled
                  :label="
                    f.required != null
                      ? f.required
                        ? f.text + `( مطلوب )`
                        : f.text
                      : f.text
                  "
                  v-model="data[f.searchValue]"
                  :hide-details="!f.hint"
                  :persistent-hint="f.hint"
                  auto-grow
                  :readonly="f.readOnly"
                  :disabled="f.readOnly"
                  rows="1"
                  :required="f.required != null ? f.required : false"
                  :rules="f.required ? [v => !!v || 'يجب ادخال ${f.text}'] : []"
                />
                <v-file-input
                  v-else-if="f.type == 'file'"
                  clearable
                  filled
                  :label="
                    f.required != null
                      ? f.required
                        ? f.text + `( مطلوب )`
                        : f.text
                      : f.text
                  "
                  persistent-hint
                  v-model="data[f.searchValue]"
                  :required="f.required != null ? f.required : false"
                  :rules="
                    f.required ? [v => !!v || `يجب اختيار ${f.text}`] : []
                  "
                ></v-file-input>

                <v-file-input
                  v-else-if="f.type == 'files'"
                  clearable
                  filled
                  multiple
                  :label="
                    f.required != null
                      ? f.required
                        ? f.text + `( مطلوب )`
                        : f.text
                      : f.text
                  "
                  persistent-hint
                  v-model="data[f.searchValue]"
                  :required="f.required != null ? f.required : false"
                  :rules="
                    f.required ? [v => !!v || `يجب اختيار ${f.text}`] : []
                  "
                ></v-file-input>

                <v-checkbox
                  v-else-if="f.type == 'checkbox'"
                  :label="
                    f.required != null
                      ? f.required
                        ? f.text + `( مطلوب )`
                        : f.text
                      : f.text
                  "
                  v-model="data[f.searchValue]"
                  :required="f.required != null ? f.required : false"
                  :rules="
                    f.required ? [v => !!v || `يجب اختيار ${f.text}`] : []
                  "
                >
                </v-checkbox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-spacer />

          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="$emit('on-close')"
            v-text="'رجوع'"
          />

          <v-btn
            :disabled="!valid"
            color="primary"
            large
            class="px-6"
            @click="validate(data)"
            v-text="'حفظ '"
          />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: "CustomDialog",

  data: () => ({
    valid: true
  }),

  emits: ["on-close", "on-submit", "trible-num-changed"],

  methods: {
    async validate() {
      await this.$refs.form.validate();

      if (this.valid) {
        this.$emit("on-submit", this.data);
      }
    },
    updateValue(v) {
      this.data[
        this.fields.find(ele => ele.type === "tribleNum").searchValue
      ] = v;
      this.$emit("updateValue", v);
    },
    emitKeyDown() {
      this.$emit("trible-num-changed");
    }
  },

  props: {
    title: {
      type: String,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array,
      default: () => []
    },
    selects: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
