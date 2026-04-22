<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(60,130,191,0.12),transparent_28%),linear-gradient(180deg,#f8fbfe_0%,#f3f8fc_60%,#eef5fb_100%)] text-slate-800">
    <header class="sticky top-0 z-50 border-b border-[rgba(219,231,241,0.86)] bg-white/82 backdrop-blur-[14px]">
      <div class="mx-auto flex min-h-[66px] w-[min(1120px,calc(100%-28px))] items-center justify-between gap-3 max-[920px]:w-[min(100%-22px,1120px)] max-sm:min-h-[60px] max-sm:w-[min(100%-16px,1120px)]">
        <div class="flex items-center gap-2.5 font-extrabold">
          <div class="grid h-10 w-[70px] place-items-center rounded-[14px] bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(31,77,117)] text-white shadow-[0_10px_20px_rgba(60,130,191,0.22)] max-sm:h-9 max-sm:w-9 max-sm:rounded-xl">
            <span class="text-[11px] font-black tracking-[0.03em] max-sm:hidden">LUFTQI</span>
            <span class="hidden text-sm font-black max-sm:block">L</span>
          </div>
          <div>
            <strong class="block text-base leading-none max-sm:text-[15px]">打卡系統</strong>
            <small class="text-[0.78rem] font-bold text-slate-500 max-sm:hidden">Attendance Portal</small>
          </div>
        </div>

        <div class="hidden items-center gap-2 text-xs font-bold text-slate-500 sm:flex">
          <span class="rounded-full bg-[rgba(60,130,191,0.1)] px-3 py-1.5 text-[rgb(31,77,117)]">LINE GPS 打卡</span>
        </div>
      </div>
    </header>

    <main>
      <section class="px-0 py-4 max-sm:py-3">
        <div class="mx-auto w-[min(1120px,calc(100%-28px))] max-[920px]:w-[min(100%-22px,1120px)] max-sm:w-[min(100%-16px,1120px)]">
          <div class="mb-3 grid grid-cols-4 gap-2.5 max-[920px]:grid-cols-2 max-sm:mb-2.5 max-sm:grid-cols-2 max-sm:gap-2.5">
            <button
              v-for="item in actionButtons"
              :key="item.key"
              @click="handleAction(item.key)"
              :disabled="isSubmitting || !isActionAllowed(item.key)"
              class="group relative overflow-hidden rounded-[18px] border border-[rgba(219,231,241,0.96)] bg-white/95 px-2.5 py-3.5 text-center shadow-[0_12px_24px_rgba(25,55,90,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(25,55,90,0.08)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 max-sm:min-h-[108px] max-sm:rounded-[18px] max-sm:px-2.5 max-sm:py-4 active:scale-[0.985]"
            >
              <div class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(60,130,191,0.45),rgba(60,130,191,0))]"></div>
              <div class="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-xl bg-[rgba(60,130,191,0.1)] text-base text-[rgb(31,77,117)] ring-1 ring-[rgba(60,130,191,0.08)] transition group-hover:scale-105 max-sm:h-[42px] max-sm:w-[42px] max-sm:text-base">
                {{ item.icon }}
              </div>
              <h4 class="m-0 text-[0.94rem] font-bold text-center text-slate-800 max-sm:text-[0.94rem]">{{ item.label }}</h4>
              <span class="mt-1.5 block text-center text-[0.8rem] leading-[1.4] text-slate-500 max-sm:text-[0.78rem]">
                {{ isSubmitting ? '送出中...' : getActionSubtext(item) }}
              </span>
            </button>
          </div>

          <div class="grid grid-cols-[0.95fr_1.05fr] items-start gap-3 max-[920px]:grid-cols-1 max-sm:flex max-sm:flex-col max-sm:gap-3">
            <aside class="w-full rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:order-1 max-sm:w-full max-sm:rounded-[18px] max-sm:p-3.5">
              <div class="mb-2.5 flex items-center justify-between gap-2.5">
                <h2 class="m-0 text-[0.98rem] font-bold">今日出勤儀表板</h2>
                <div class="min-w-[28px] rounded-full px-[10px] py-[6px] text-[0.95rem] font-extrabold leading-none" :class="statusPillClass">●</div>
              </div>

              <div class="rounded-[18px] border border-[rgba(60,130,191,0.12)] bg-[linear-gradient(135deg,rgba(60,130,191,0.11),rgba(60,130,191,0.03))] p-3.5">
                <div class="text-[0.8rem] leading-[1.45] text-slate-500 max-sm:text-[0.78rem]">目前時間</div>
                <div class="text-[clamp(1.7rem,4vw,2.25rem)] font-black leading-none tracking-[-0.05em] text-[rgb(31,77,117)] max-sm:text-[2rem]">{{ clock }}</div>
                <div class="mt-1.5 text-[0.8rem] leading-[1.45] text-slate-500 max-sm:text-[0.78rem]">{{ dateText }}</div>
              </div>

              <div class="mt-2.5 grid grid-cols-[auto_1fr] items-center gap-2.5 rounded-[14px] border border-slate-200 bg-[#fbfdff] p-3 max-sm:p-2.5">
                <div class="grid h-[42px] w-[42px] place-items-center rounded-xl bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(31,77,117)] text-base font-black text-white shadow-[0_8px_16px_rgba(60,130,191,0.2)]">
                  {{ user.avatar }}
                </div>
                <div>
                  <strong class="mb-0.5 block text-[0.88rem] font-bold text-slate-800">{{ user.name }}</strong>
                  <span class="block text-[0.8rem] leading-[1.45] text-slate-500 max-sm:text-[0.78rem]">{{ user.dept }}</span>
                  <span class="block text-[0.8rem] leading-[1.45] text-slate-500 max-sm:hidden">{{ user.lineId }}</span>
                </div>
              </div>

              <div class="mt-2.5 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-[0_4px_10px_rgba(25,55,90,0.03)]">
                <b class="mb-1 block text-[0.98rem] text-[rgb(31,77,117)] max-sm:text-base">{{ dashboard.status }}</b>
                <span class="text-[0.75rem] font-bold text-slate-500">目前狀態</span>
              </div>

              <div class="mt-2.5 rounded-[14px] border border-slate-200 bg-[#fbfdff] p-3 max-sm:p-2.5">
                <div class="mb-2 flex items-center justify-between gap-2.5">
                  <strong class="text-[0.88rem] font-bold">GPS 打卡測試</strong>
                  <span class="inline-block h-2.5 w-2.5 rounded-full transition-all duration-300" :class="gpsDotClass"></span>
                </div>
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <div class="rounded-[10px] border border-slate-200 bg-white p-2.5">
                    <small class="mb-1 block text-[0.72rem] text-slate-500">精確度</small>
                    <b class="block break-all text-[0.8rem] text-[rgb(31,77,117)]">{{ gps.accuracy }}</b>
                  </div>
                  <div class="rounded-[10px] border border-slate-200 bg-white p-2.5">
                    <small class="mb-1 block text-[0.72rem] text-slate-500">範圍判定</small>
                    <b class="block break-all text-[0.8rem] text-[rgb(31,77,117)]">{{ gps.range }}</b>
                  </div>
                </div>
                <div class="mt-2 text-[0.8rem] leading-[1.5] text-slate-500 max-sm:text-[0.78rem]">{{ gps.message }}</div>
              </div>
            </aside>

            <section class="w-full rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:order-2 max-sm:w-full max-sm:rounded-[18px] max-sm:p-3.5">
              <div class="mb-2.5 flex items-center justify-between gap-2.5">
                <h3 class="m-0 text-[0.98rem] font-bold">打卡紀錄（最近 5 筆）</h3>
                <small class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">即時資料</small>
              </div>

              <div class="grid gap-2">
                <div
                  v-for="record in recentRecords"
                  :key="record.id"
                  class="flex items-start justify-between gap-2.5 rounded-xl border border-slate-200 bg-[#fbfdff] px-3 py-3 transition hover:border-slate-300 max-sm:items-start max-sm:px-2.5"
                >
                  <div class="min-w-0 flex-1">
                    <strong class="mb-0.5 block text-[0.9rem] font-bold text-slate-800">{{ record.time }}</strong>
                    <span class="text-[0.8rem] leading-[1.55] text-slate-500 max-sm:text-[0.78rem]">{{ record.name }} ・ 距離公司 {{ record.distance }}</span>
                  </div>
                  <div class="min-w-[72px] whitespace-nowrap rounded-full px-[10px] py-[6px] text-center text-[0.75rem] font-extrabold shadow-sm" :class="record.badgeClass">
                    {{ record.action }}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section class="pb-[18px]">
        <div class="mx-auto mt-3 w-[min(1120px,calc(100%-28px))] max-[920px]:w-[min(100%-22px,1120px)] max-sm:mt-2.5 max-sm:w-[min(100%-16px,1120px)]">
          <section class="w-full rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5">
            <div class="mb-2.5 flex items-center justify-between gap-2.5">
              <h3 class="m-0 text-[0.98rem] font-bold">其他功能</h3>
            </div>

            <div class="grid grid-cols-4 gap-2.5 max-[920px]:grid-cols-2 max-sm:grid-cols-2 max-sm:gap-2.5">
              <RouterLink
                v-for="item in quickLinks"
                :key="item.title"
                :to="item.to"
                class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 text-center shadow-[0_12px_24px_rgba(25,55,90,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(25,55,90,0.08)] max-sm:min-h-[110px] max-sm:p-3.5"
              >
                <div class="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-[rgba(60,130,191,0.1)] text-base text-[rgb(31,77,117)] ring-1 ring-[rgba(60,130,191,0.08)] max-sm:h-[42px] max-sm:w-[42px]">
                  {{ item.icon }}
                </div>
                <h3 class="m-0 text-[0.92rem] font-bold text-center text-slate-800 max-sm:text-[0.94rem]">{{ item.title }}</h3>
                <p class="mt-1.5 text-center text-[0.8rem] leading-[1.4] text-slate-500 max-sm:text-[0.78rem]">{{ item.desc }}</p>
              </RouterLink>
            </div>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const DEV_MODE = false
const LIFF_ID = '2008602232-c53WoD3q'
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxSw2YDB2z7BDj_ykkm_qlgwRiyPQxJqX5IpgKuVRBppL9urxMOR38oq_nnSzPlR6LL/exec'

const OFFICE_LOCATION = {
  lat: 24.9585756,
  lng: 121.2461472,
  radius: 150
}

const actionButtons = [
  { key: 'clockin', icon: '🟢', label: '上班打卡', sub: 'Clock In' },
  { key: 'clockout', icon: '🔵', label: '下班打卡', sub: 'Clock Out' },
  { key: 'goout', icon: '🟠', label: '外出打卡', sub: 'Go Out' },
  { key: 'back', icon: '🟣', label: '返回公司', sub: 'Back' }
]

const quickLinks = [
  { icon: '📝', title: '補打卡申請', desc: '異常補登', to: '/' },
  { icon: '🌴', title: '請假申請', desc: '假單流程', to: '/' },
  { icon: '📅', title: '出勤查詢', desc: '完整記錄', to: '/my-attendance' },
  { icon: '🛠️', title: '管理後台', desc: '系統管理', to: '/' }
]

const now = ref(new Date())
const isSubmitting = ref(false)
const gpsStatus = ref('idle')
let timer = null
let workTimer = null

const clock = computed(() => now.value.toLocaleTimeString('zh-TW', { hour12: false }))
const dateText = computed(() => {
  const d = now.value
  const date = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
  const week = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][d.getDay()]
  return `${date} ${week}`
})

const gpsDotClass = computed(() => {
  if (gpsStatus.value === 'success') return 'bg-green-500 shadow-[0_0_0_4px_rgba(22,163,74,0.12)]'
  if (gpsStatus.value === 'danger') return 'bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]'
  return 'bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]'
})

const statusPillClass = computed(() => {
  if (latestAction.value === '已下班') return 'bg-slate-200 text-slate-600'
  if (latestAction.value === '外出中') return 'bg-amber-100 text-amber-700'
  if (latestAction.value === '已上班' || latestAction.value === '返回公司') return 'bg-green-100 text-green-600'
  return 'bg-slate-100 text-slate-500'
})

const user = ref({
  avatar: '員',
  name: '未登入',
  dept: '部門：營運管理部',
  lineId: '員工編號：--',
  userId: ''
})

const dashboard = ref({
  status: '未打卡'
})

const gps = ref({
  accuracy: '--',
  range: '尚未測試',
  message: '按上方任一打卡按鈕後，這裡會顯示 GPS 取點結果與是否在公司範圍內。'
})

const recentRecords = ref([
  {
    id: 1,
    time: '載入中...',
    action: '同步中',
    name: '正在讀取最新打卡紀錄',
    distance: '--',
    badgeClass: 'bg-green-100 text-green-600'
  }
])

const latestClockInTime = ref(null)
const latestAction = ref('未打卡')

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

function getBadgeClass(action) {
  if (action && action.includes('外出')) return 'bg-amber-100 text-amber-700'
  if (action && (action.includes('失敗') || action.includes('異常'))) return 'bg-red-100 text-red-600'
  return 'bg-green-100 text-green-600'
}

function toRadians(value) {
  return value * (Math.PI / 180)
}

function calculateDistanceMeters(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371000
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadius * c
}

function isToday(dateString) {
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return false
  return (
    d.getFullYear() === now.value.getFullYear() &&
    d.getMonth() === now.value.getMonth() &&
    d.getDate() === now.value.getDate()
  )
}

function updateWorkingDuration() {
  if (!latestClockInTime.value || latestAction.value !== '已上班') return
  const start = new Date(latestClockInTime.value)
  if (Number.isNaN(start.getTime())) return

  const diffMs = now.value - start
  if (diffMs < 0) return

  const totalMinutes = Math.floor(diffMs / 1000 / 60)
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  dashboard.value = {
    status: `已上班 ${hours} 小時 ${mins} 分`
  }
}

function isActionAllowed(actionKey) {
  const current = latestAction.value
  if (current === '未打卡') return actionKey === 'clockin'
  if (current === '已上班') return actionKey === 'clockout' || actionKey === 'goout'
  if (current === '外出中') return actionKey === 'back'
  if (current === '返回公司') return actionKey === 'clockout' || actionKey === 'goout'
  if (current === '已下班') return false
  return true
}

function getActionSubtext(item) {
  return isActionAllowed(item.key) ? item.sub : '目前不可用'
}

function applyTodayReset() {
  latestAction.value = '未打卡'
  latestClockInTime.value = null
  dashboard.value = { status: '未打卡' }
}

function updateTodayDashboard(records) {
  const todayRecords = records.filter((record) => isToday(record.timestamp))
  if (!todayRecords.length) {
    applyTodayReset()
    return
  }

  const latestRecord = todayRecords[0]
  latestAction.value = latestRecord.action || '未打卡'

  if (latestRecord.action === '已上班') {
    latestClockInTime.value = latestRecord.timestamp
    updateWorkingDuration()
  } else {
    latestClockInTime.value = null
    dashboard.value = { status: latestRecord.action || '未打卡' }
  }
}

async function initLiff() {
  try {
    if (DEV_MODE) {
      user.value = {
        avatar: '測',
        name: '測試使用者',
        dept: '部門：營運管理部',
        lineId: 'LINE ID：DEV-MODE',
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
    const fullName = profile.displayName || '已登入使用者'

    user.value = {
      ...user.value,
      avatar: fullName.trim().charAt(0) || '員',
      name: fullName,
      lineId: `LINE ID：${profile.userId.slice(0, 8)}...`,
      userId: profile.userId
    }
  } catch (error) {
    console.error('LIFF 初始化失敗:', error)
    gpsStatus.value = 'danger'
    gps.value = {
      ...gps.value,
      message: `LIFF 初始化失敗：${error.message}`
    }
  }
}

async function sendAttendanceToGAS(payload) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    return await response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

async function fetchRecentRecords() {
  try {
    let records = []

    if (user.value.userId) {
      const myResponse = await fetch(
        `${GAS_WEB_APP_URL}?action=myRecords&userId=${encodeURIComponent(user.value.userId)}`
      )
      const myResult = await myResponse.json()
      if (myResult.ok && Array.isArray(myResult.records) && myResult.records.length) {
        records = myResult.records
      }
    }

    if (!records.length) {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=recent`)
      const result = await response.json()
      if (!result.ok || !Array.isArray(result.records)) {
        throw new Error(result.message || '讀取失敗')
      }
      records = result.records
    }

    if (!records.length) {
      recentRecords.value = [
        {
          id: 1,
          time: '目前沒有打卡紀錄',
          action: '空白',
          name: '完成第一筆打卡後，這裡會自動更新',
          distance: '--',
          badgeClass: 'bg-amber-100 text-amber-700'
        }
      ]
      applyTodayReset()
      return
    }

    updateTodayDashboard(records)

    recentRecords.value = records.slice(0, 5).map((record, index) => ({
      id: index + 1,
      time: formatRecordDate(record.timestamp),
      action: record.action || '未分類',
      name: record.name || '未知使用者',
      distance:
        record.distance !== '' && record.distance !== undefined
          ? `${record.distance} m`
          : '--',
      badgeClass: getBadgeClass(record.action || '')
    }))
  } catch (error) {
    console.error('讀取最近紀錄失敗:', error)
    recentRecords.value = [
      {
        id: 1,
        time: '讀取失敗',
        action: '失敗',
        name: error.message,
        distance: '--',
        badgeClass: 'bg-red-100 text-red-600'
      }
    ]
  }
}

function handleGpsError(error) {
  const messageMap = {
    1: '定位權限被拒絕，請先允許位置存取。',
    2: '目前無法取得定位資訊，請確認 GPS 或網路狀態。',
    3: '定位逾時，請到空曠處後再試一次。'
  }

  gpsStatus.value = 'danger'
  gps.value = {
    ...gps.value,
    accuracy: '--',
    range: '定位失敗',
    message: messageMap[error.code] || '定位失敗，請稍後再試。'
  }
  dashboard.value = { status: '定位失敗' }
  isSubmitting.value = false
}

async function updateGpsDisplay(position, actionLabel) {
  try {
    const { latitude, longitude, accuracy } = position.coords
    const distance = calculateDistanceMeters(latitude, longitude, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng)
    const isInRange = distance <= OFFICE_LOCATION.radius

    gps.value = {
      accuracy: `± ${Math.round(accuracy)} m`,
      range: isInRange ? '可打卡' : '超出範圍',
      message: isInRange
        ? 'GPS 驗證成功，資料送出中...'
        : `距離公司 ${Math.round(distance)} 公尺，超出打卡範圍，無法打卡`
    }

    if (!isInRange) {
      gpsStatus.value = 'danger'
      dashboard.value = { status: '位置異常' }
      return
    }

    const actualUserId = DEV_MODE ? 'DEV-MODE-USER' : user.value.userId
    if (!DEV_MODE && (!window.liff || !window.liff.isLoggedIn())) {
      throw new Error('尚未登入 LINE')
    }

    const profile = DEV_MODE
      ? { displayName: user.value.name, userId: actualUserId }
      : await window.liff.getProfile()

    const payload = {
      action: actionLabel,
      name: profile.displayName,
      userId: profile.userId,
      latitude,
      longitude,
      accuracy: Math.round(accuracy),
      distance: Math.round(distance),
      inRange: true
    }

    const result = await sendAttendanceToGAS(payload)
    if (!result.ok) {
      throw new Error(result.message || '寫入失敗')
    }

    latestAction.value = actionLabel
    if (actionLabel === '已上班') {
      latestClockInTime.value = new Date().toISOString()
    } else {
      latestClockInTime.value = null
    }

    gpsStatus.value = 'success'
    gps.value = { ...gps.value, message: `${actionLabel} 打卡成功 ✅` }
    dashboard.value = { status: actionLabel }

    await fetchRecentRecords()
  } catch (error) {
    console.error('送出打卡失敗:', error)
    gpsStatus.value = 'danger'
    gps.value = {
      ...gps.value,
      message: error.name === 'AbortError'
        ? '送出逾時，請再試一次。'
        : `送出失敗：${error.message}`
    }
  } finally {
    isSubmitting.value = false
  }
}

function handleAction(type) {
  if (!isActionAllowed(type) || isSubmitting.value) return

  const actionMap = {
    clockin: '已上班',
    clockout: '已下班',
    goout: '外出中',
    back: '返回公司'
  }

  if (!navigator.geolocation) {
    gpsStatus.value = 'danger'
    gps.value = {
      ...gps.value,
      range: '不支援',
      message: '這個裝置或瀏覽器不支援 GPS 定位。'
    }
    isSubmitting.value = false
    return
  }

  isSubmitting.value = true
  gpsStatus.value = 'idle'
  gps.value = {
    ...gps.value,
    range: '定位中',
    message: 'GPS 定位中，請稍候...'
  }

  const unlockTimer = setTimeout(() => {
    if (isSubmitting.value) {
      isSubmitting.value = false
      gpsStatus.value = 'danger'
      gps.value = {
        ...gps.value,
        range: '逾時',
        message: '定位或送出逾時，請再試一次。'
      }
    }
  }, 20000)

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      clearTimeout(unlockTimer)
      await updateGpsDisplay(position, actionMap[type] || '打卡完成')
    },
    (error) => {
      clearTimeout(unlockTimer)
      handleGpsError(error)
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

onMounted(async () => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)

  workTimer = window.setInterval(() => {
    updateWorkingDuration()
  }, 60000)

  await initLiff()
  await fetchRecentRecords()
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
  if (workTimer) window.clearInterval(workTimer)
})
</script>