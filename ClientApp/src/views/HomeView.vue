<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import TheWelcome from '@/components/TheWelcome.vue'
import type weatherForecastModel from '@/types/weatherForecastModel'

const httpClient = axios.create({
  baseURL: 'https://localhost:3000/api',
  headers: {
    'Content-type': 'application/json'
  }
})

const items = ref()

onMounted(async () => {
  items.value = await httpClient.get<weatherForecastModel>('/weatherforecast', {
    headers: { Accept: 'application/json' }
  })
})
</script>

<template>
  <main>
    <TheWelcome />

    {{ items }}
  </main>
</template>
