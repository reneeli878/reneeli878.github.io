<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(60,130,191,0.12),transparent_28%),linear-gradient(180deg,#f8fbfe_0%,#f3f8fc_60%,#eef5fb_100%)] text-slate-800">
    <header class="sticky top-0 z-50 border-b border-[rgba(219,231,241,0.86)] bg-white/82 backdrop-blur-[14px]">
      <div class="mx-auto flex min-h-[66px] w-[min(1120px,calc(100%-28px))] items-center justify-between gap-3 max-[920px]:w-[min(100%-22px,1120px)] max-sm:min-h-[60px] max-sm:w-[min(100%-16px,1120px)]">
        <div class="flex items-center gap-2.5 font-extrabold">
          <RouterLink to="/" class="grid h-10 w-[70px] place-items-center rounded-[14px] bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(31,77,117)] text-white shadow-[0_10px_20px_rgba(60,130,191,0.22)] max-sm:h-9 max-sm:w-9 max-sm:rounded-xl">
            <span class="text-[11px] font-black tracking-[0.03em] max-sm:hidden">LUFTQI</span>
            <span class="hidden text-sm font-black max-sm:block">L</span>
          </RouterLink>
          <div>
            <strong class="block text-base leading-none max-sm:text-[15px]">出勤查詢</strong>
            <small class="text-[0.78rem] font-bold text-slate-500 max-sm:hidden">My Attendance</small>
          </div>
        </div>

        <RouterLink to="/" class="rounded-full bg-[rgba(60,130,191,0.1)] px-3 py-2 text-xs font-bold text-[rgb(31,77,117)]">
          返回首頁
        </RouterLink>
      </div>
    </header>

    <main class="py-4 max-sm:py-3">
      <div class="mx-auto w-[min(1120px,calc(100%-28px))] max-[920px]:w-[min(100%-22px,1120px)] max-sm:w-[min(100%-16px,1120px)]">
        <section class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5">
          <div class="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">開始日期</label>
              <input v-model="startDate" type="date" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
            </div>
            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">結束日期</label>
              <input v-model="endDate" type="date" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
            </div>
            <button @click="fetchAttendance" :disabled="loading" class="rounded-xl bg-[rgb(60,130,191)] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_16px_rgba(60,130,191,0.18)] disabled:opacity-50">
              {{ loading ? '查詢中...' : '查詢' }}
            </button>
          </div>
        </section>

        <section class="mt-3 grid gap-3 md:grid-cols-3">
          <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <div class="text-[0.78rem] font-bold text-slate-500">本月總工時</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">{{ summary.totalWorkHours }}</div>
          </div>
          <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <div class="text-[0.78rem] font-bold text-slate-500">出勤天數</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">{{ summary.attendanceDays }}</div>
          </div>
          <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <div class="text-[0.78rem] font-bold text-slate-500">打卡異常</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">{{ summary.abnormalCount }}</div>
          </div>
        </section>

        <section class="mt-3 rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5">
          <div class="mb-3 flex items-center justify-between gap-2.5">
            <h2 class="m-0 text-[1rem] font-bold">個人出勤明細</h2>
          </div>

          <div v-if="errorMessage" class="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
            {{ errorMessage }}
          </div>

          <div v-if="!records.length && !loading" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
            目前沒有符合條件的出勤資料。
          </div>

          <div class="grid gap-2.5">
            <div v-for="record in records" :key="record.id" class="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-[#fbfdff] px-3 py-3">
              <div class="min-w-0 flex-1">
                <strong class="block text-[0.9rem] font-bold text-slate-800">{{ formatRecordDate(record.timestamp) }}</strong>
                <div class="mt-1 text-[0.8rem] leading-[1.55] text-slate-500">
                  {{ record.name || user.name }} ・ 距離公司 {{ formatDistance(record.distance) }}
                </div>
              </div>
              <div class="min-w-[72px] whitespace-nowrap rounded-full px-[10px] py-[6px] text-center text-[0.75rem] font-extrabold shadow-sm" :class="getBadgeClass(record.action)">
                {{ record.action || '未分類' }}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const DEV_MODE = false
const LIFF_ID = '2008602232-c53WoD3q'
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxX0mNlGEMo8IPgPpaivGWGof1qF2fNsdZrSvrFn7aHNZpB2Io4RlK_cRj78q4Jr2Bx/exec'

const loading = ref(false)
const errorMessage = ref('')
const records = ref([])
const startDate = ref('')
const endDate = ref('')
const user = ref({
  name: '未登入',
  userId: 'DEV-MODE-USER'
})

function getTodayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getMonthStartString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

startDate.value = getMonthStartString()
endDate.value = getTodayString()

function formatRecordDate(dateString) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString || '--'
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

function formatTimeOnly(dateString) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function formatDistance(distance) {
  return distance !== '' && distance !== undefined ? `${distance} m` : '--'
}

function getBadgeClass(action) {
  if (action && action.includes('外出')) return 'bg-amber-100 text-amber-700'
  if (action && action.includes('返回')) return 'bg-sky-100 text-sky-700'
  if (action && action.includes('下班')) return 'bg-green-100 text-green-600'
  return 'bg-green-100 text-green-600'
}

const summary = computed(() => {
  const monthRecords = records.value.filter((record) => {
    const d = new Date(record.timestamp)
    const now = new Date()
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })

  let totalMinutes = 0
  const byDate = {}

  monthRecords.forEach((record) => {
    const d = new Date(record.timestamp)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!byDate[key]) byDate[key] = []
    byDate[key].push(record)
  })

  let abnormalCount = 0

  Object.values(byDate).forEach((dayRecords) => {
    const sorted = dayRecords.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    const firstIn = sorted.find((r) => r.action === '已上班')
    const lastOut = [...sorted].reverse().find((r) => r.action === '已下班')

    if (firstIn && lastOut) {
      const diff = (new Date(lastOut.timestamp) - new Date(firstIn.timestamp)) / 1000 / 60
      if (diff > 0) {
        totalMinutes += diff >= 360 ? diff - 60 : diff
      }
    } else {
      abnormalCount += 1
    }
  })

  const hours = Math.floor(totalMinutes / 60)
  const mins = Math.round(totalMinutes % 60)
  const attendanceDays = Object.keys(byDate).length

  return {
    totalWorkHours: `${hours} 小時 ${mins} 分`,
    attendanceDays: `${attendanceDays} 天`,
    abnormalCount: `${abnormalCount} 筆`
  }
})

async function initLiff() {
  if (DEV_MODE) {
    user.value = {
      name: '測試使用者',
      userId: 'DEV-MODE-USER'
    }
    return
  }

  if (!window.liff) throw new Error('LIFF SDK 未載入')

  await window.liff.init({ liffId: LIFF_ID })

  if (!window.liff.isLoggedIn()) {
    window.liff.login()
    return
  }

  const profile = await window.liff.getProfile()
  user.value = {
    name: profile.displayName || '已登入使用者',
    userId: profile.userId
  }
}

async function fetchAttendance() {
  loading.value = true
  errorMessage.value = ''

  try {
    const params = new URLSearchParams({
      action: 'myRecords',
      userId: user.value.userId,
      startDate: startDate.value,
      endDate: endDate.value
    })

    const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`)
    const result = await response.json()

    if (!result.ok || !Array.isArray(result.records)) {
      throw new Error(result.message || '讀取失敗')
    }

    records.value = result.records
  } catch (error) {
    errorMessage.value = error.message || '查詢失敗'
    records.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await initLiff()
    await fetchAttendance()
  } catch (error) {
    errorMessage.value = error.message || '初始化失敗'
  }
})
</script>
