<template>
  <q-page class="bg-white q-pa-sm">
    <q-card flat bordered class="q-my-sm">
      <q-card-section horizontal>
        <q-card-section class="full-width">
          <div class="text-h6">Source Text</div>
          <q-select
            filled
            v-model="data.source.language"
            :options="options"
            emit-value
            map-options
            label="Language"
          />
          <q-card flat bordered class="q-my-sm">
              <q-card-section  class="q-py-none" >
                <q-input
                  v-model="data.source.text"
                  borderless
                  type="textarea"
                  debounce="500"
                  @update:model-value="translate()"
                />
              </q-card-section>
              <q-card-actions>
                  <q-btn round dense flat icon="content_copy"  @click="copyText(data.source.text)" />
              </q-card-actions>
          </q-card>
        </q-card-section>
        <q-card-section  class="full-width">
          <div class="text-h6">Target text</div>
          <q-select
            filled
            v-model="data.target.language"
            :options="options"
            label="Language"
            emit-value
            map-options
          />
          <q-card flat class="q-my-sm border-none bg-grey-2">
              <q-card-section  class="q-py-none">
                  <q-input
                    v-model="data.target.text"
                    readonly
                    borderless
                    type="textarea"
                    :loading="loadingState"
                  >
                  </q-input>
              </q-card-section>
              <q-card-actions>
                  <q-btn round dense flat icon="content_copy" @click="copyText(data.target.text)"/>
              </q-card-actions>
          </q-card>

        </q-card-section>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { api } from '../services/index'
import { watch, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const loadingState = ref(false)

const options = [
  {
    label: 'Qirimtatar',
    value: 'qirimtatar'
  },
  {
    label: 'Русский',
    value: 'russian'
  },
  {
    label: 'English',
    value: 'english'
  },
  {
    label: 'French',
    value: 'french'
  }

]

const data = ref({
  source: {
    id: 0,
    text: '',
    language: 'english'
  },
  target: {
    id: 0,
    text: '',
    language: 'french'
  }
})

const translate = async function () {
  loadingState.value = true
  const sentencePairResponse = await api.translator.translate({ text: data.value.source.text, target_lang: data.value.target.language, level: 'char' })
  if (sentencePairResponse.error) {
    data.value = {}
    return
  }
  loadingState.value = false
  data.value.target.text = sentencePairResponse.translated
}
const copyText = async function (mytext) {
  try {
    await navigator.clipboard.writeText(mytext)
    showNotif(true)
  } catch {
    showNotif(false)
  }
}

const showNotif = function (success) {
  if (success) {
    $q.notify({
      message: 'Copied.',
      color: 'success'
    })
  } else {
    $q.notify({
      message: 'Can\'t copy.',
      color: 'negative'
    })
  }
}

watch(() => data.value.source.language, async (currentValue, oldValue) => {
  if (data.value.source.language === data.value.target.language) {
    data.value.target.language = oldValue
  }
})
</script>
