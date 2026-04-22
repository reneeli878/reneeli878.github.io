<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(60,130,191,0.16),transparent_24%),linear-gradient(180deg,#f8fbfe_0%,#f3f8fc_58%,#edf5fb_100%)] text-slate-800">
    <header class="sticky top-0 z-50 border-b border-white/40 bg-white/72 backdrop-blur-xl">
      <div class="mx-auto flex min-h-[68px] w-[min(1120px,calc(100%-28px))] items-center justify-between gap-4 py-2 max-sm:w-[min(100%-16px,1120px)]">
        <div class="flex items-center gap-3">
          <div class="grid h-11 w-[74px] place-items-center rounded-2xl bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(31,77,117)] text-[13px] font-black tracking-[0.04em] text-white shadow-[0_12px_24px_rgba(60,130,191,0.24)] max-sm:h-10 max-sm:w-[62px] max-sm:text-[11px]">
            LUFTQI
          </div>
          <div>
            <strong class="block text-[17px] font-black leading-none max-sm:text-[15px]">打卡系統</strong>
            <small class="text-xs font-bold tracking-[0.03em] text-slate-500 max-sm:hidden">Attendance Portal</small>
          </div>
        </div>

        <button class="inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(45,101,149)] px-5 text-sm font-extrabold text-white shadow-[0_10px_20px_rgba(60,130,191,0.24)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(60,130,191,0.28)] max-sm:min-h-[38px] max-sm:px-4 max-sm:text-[13px]">
          立即打卡
        </button>
      </div>
    </header>

    <main>
      <section class="py-4 max-sm:py-3">
        <div class="mx-auto w-[min(1120px,calc(100%-28px))] max-sm:w-[min(100%-16px,1120px)]">
          <div class="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <button
              v-for="item in actionButtons"
              :key="item.key"
              @click="handleAction(item.key)"
              :disabled="isSubmitting || !isActionAllowed(item.key)"
              class="group rounded-[22px] border border-white/70 bg-white/88 px-3 py-4 text-center shadow-[0_14px_26px_rgba(25,55,90,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_34px_rgba(25,55,90,0.1)] disabled:cursor-not-allowed disabled:opacity-60 max-sm:min-h-[106px]"
            >
              <div class="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgba(60,130,191,0.14),rgba(60,130,191,0.06))] text-[18px] text-[rgb(31,77,117)] transition group-hover:scale-105">
                {{ item.icon }}
              </div>
              <h4 class="text-[15px] font-bold text-slate-800 max-sm:text-[14px]">{{ item.label }}</h4>
              <span class="mt-1 block text-xs text-slate-500">{{ isSubmitting ? '送出中...' : item.sub }}</span>
            </button>
          </div>

          <div class="grid items-start gap-3 lg:grid-cols-[0.95fr_1.05fr]">
            <section class="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_16px_30px_rgba(25,55,90,0.08)] max-sm:rounded-[20px] max-sm:p-3.5">
              <div class="mb-3 flex items-center justify-between gap-3">
                <h3 class="text-[16px] font-black text-slate-800">打卡紀錄（最近 5 筆）</h3>
                <small class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">即時資料</small>
              </div>

              <div class="grid gap-2.5">
                <div
                  v-for="record in recentRecords"
                  :key="record.id"
                  class="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-[linear-gradient(180deg,#fcfdff_0%,#f8fbfe_100%)] px-3 py-3 transition hover:border-slate-300 max-sm:gap-2"
                >
                  <div class="min-w-0">
                    <strong class="block text-[14px] font-bold text-slate-800 max-sm:text-[13px]">{{ record.time }} {{ record.action }}</strong>
                    <span class="mt-1 block text-xs leading-5 text-slate-500">{{ record.name }} ・ 距離公司 {{ record.distance }}</span>
                  </div>
                  <div class="shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold" :class="record.badgeClass">
                    {{ record.action }}
                  </div>
                </div>
              </div>
            </section>

            <aside class="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_16px_30px_rgba(25,55,90,0.08)] max-sm:rounded-[20px] max-sm:p-3.5">
              <div class="mb-3 flex items-center justify-between gap-3">
                <h2 class="text-[16px] font-black text-slate-800">今日出勤儀表板</h2>
                <div class="rounded-full bg-green-100 px-2.5 py-1 text-sm font-black text-green-600">●</div>
              </div>

              <div class="rounded-[22px] border border-[rgba(60,130,191,0.14)] bg-[linear-gradient(135deg,rgba(60,130,191,0.13),rgba(60,130,191,0.03))] p-4 max-sm:p-3.5">
                <div class="text-xs font-bold tracking-[0.02em] text-slate-500">目前時間</div>
                <div class="mt-1 text-[clamp(1.85rem,4vw,2.5rem)] font-black leading-none tracking-[-0.06em] text-[rgb(31,77,117)]">
                  {{ clock }}
                </div>
                <div class="mt-1.5 text-xs text-slate-500">{{ dateText }}</div>
              </div>

              <div class="mt-3 grid grid-cols-[auto_1fr] items-center gap-3 rounded-[18px] border border-slate-200/90 bg-[linear-gradient(180deg,#fcfdff_0%,#f8fbfe_100%)] p-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(31,77,117)] text-[18px] font-black text-white shadow-[0_10px_18px_rgba(60,130,191,0.22)]">
                  {{ user.avatar }}
                </div>
                <div>
                  <strong class="block text-[14px] font-bold text-slate-800">{{ user.name }}</strong>
                  <span class="block text-xs leading-5 text-slate-500">{{ user.dept }}</span>
                  <span class="block text-xs leading-5 text-slate-500 max-sm:hidden">{{ user.lineId }}</span>
                </div>
              </div>

              <div class="mt-3 grid gap-2 sm:grid-cols-2">
                <div class="rounded-2xl border border-slate-200/90 bg-white px-3 py-3 shadow-[0_6px_14px_rgba(25,55,90,0.04)]">
                  <b class="mb-1 block text-[15px] font-black text-[rgb(31,77,117)]">{{ dashboard.status }}</b>
                  <span class="text-xs font-bold text-slate-500">目前狀態</span>
                </div>
                <div class="rounded-2xl border border-slate-200/90 bg-white px-3 py-3 shadow-[0_6px_14px_rgba(25,55,90,0.04)]">
                  <b class="mb-1 block text-[15px] font-black text-[rgb(31,77,117)]">{{ dashboard.distance }}</b>
                  <span class="text-xs font-bold text-slate-500">距離公司</span>
                </div>
              </div>

              <div class="mt-3 rounded-[18px] border border-slate-200/90 bg-[linear-gradient(180deg,#fcfdff_0%,#f8fbfe_100%)] p-3">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <strong class="text-[14px] font-bold text-slate-800">GPS 打卡測試</strong>
                  <span class="inline-block h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]"></span>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <div class="rounded-xl border border-slate-200 bg-white p-2.5">
                    <small class="mb-1 block text-[11px] font-bold text-slate-500">精確度</small>
                    <b class="block text-xs font-bold text-[rgb(31,77,117)]">{{ gps.accuracy }}</b>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-white p-2.5">
                    <small class="mb-1 block text-[11px] font-bold text-slate-500">範圍判定</small>
                    <b class="block text-xs font-bold text-[rgb(31,77,117)]">{{ gps.range }}</b>
                  </div>
                </div>

                <div class="mt-2 text-xs leading-5 text-slate-500">{{ gps.message }}</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="pb-5 max-sm:pb-4">
        <div class="mx-auto w-[min(1120px,calc(100%-28px))] max-sm:w-[min(100%-16px,1120px)]">
          <section class="rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_16px_30px_rgba(25,55,90,0.08)] max-sm:rounded-[20px] max-sm:p-3.5">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h3 class="text-[16px] font-black text-slate-800">其他功能</h3>
            </div>

            <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <a
                v-for="item in quickLinks"
                :key="item.title"
                :href="item.href"
                class="group rounded-[22px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f9fcff_100%)] p-4 text-center shadow-[0_12px_24px_rgba(25,55,90,0.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(25,55,90,0.1)] max-sm:min-h-[112px] max-sm:p-3.5"
              >
                <div class="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgba(60,130,191,0.14),rgba(60,130,191,0.06))] text-[18px] text-[rgb(31,77,117)] transition group-hover:scale-105">
                  {{ item.icon }}
                </div>
                <h3 class="text-[15px] font-bold text-slate-800 max-sm:text-[14px]">{{ item.title }}</h3>
                <p class="mt-1 text-xs text-slate-500">{{ item.desc }}</p>
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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
  { icon: '📝', title: '補打卡申請', desc: '異常補登', href: '#' },
  { icon: '🌴', title: '請假申請', desc: '假單流程', href: '#' },
  { icon: '📅', title: '出勤查詢', desc: '完整記錄', href: 'attendance.html' },
  { icon: '🛠️', title: '管理後台', desc: '系統管理', href: '#' }
]

const now = ref(new Date())
const isSubmitting = ref(false)
let timer = null
let workTimer = null

const clock = computed(() => now.value.toLocaleTimeString('zh-TW', { hour12: false }))
const dateText = computed(() => {
  const d = now.value
  const date = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
  const week = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][d.getDay()]
  return `${date} ${week}`
})

const user = ref({
  avatar: '員',
  name: '未登入',
  dept: '部門：營運管理部',
  lineId: '員工編號：--'
})

const dashboard = ref({
  status: '未打卡',
  distance: '-- m'
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
    ...dashboard.value,
    status: `已上班 ${hours} 小時 ${mins} 分`
  }
}
function isActionAllowed(actionKey) {
  const current = latestAction.value

  if (current === '未打卡') {
    return actionKey === 'clockin'
  }

  if (current === '已上班') {
    return actionKey === 'clockout' || actionKey === 'goout'
  }

  if (current === '外出中') {
    return actionKey === 'back'
  }

  if (current === '返回公司') {
    return actionKey === 'clockout' || actionKey === 'goout'
  }

  if (current === '已下班') {
    return false
  }

  return true
}

function getActionSubtext(item) {
  return isActionAllowed(item.key) ? item.sub : '目前不可用'
}
async function initLiff() {
  try {
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
      lineId: `LINE ID：${profile.userId.slice(0, 8)}...`
    }
  } catch (error) {
    console.error('LIFF 初始化失敗:', error)
    gps.value = {
      ...gps.value,
      message: `LIFF 初始化失敗：${error.message}`
    }
  }
}

async function sendAttendanceToGAS(payload) {
  const response = await fetch(GAS_WEB_APP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  })

  return await response.json()
}

async function fetchRecentRecords() {
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=recent`)
    const result = await response.json()

    if (!result.ok || !Array.isArray(result.records)) {
      throw new Error(result.message || '讀取失敗')
    }

    if (result.records.length === 0) {
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
  latestClockInTime.value = null
  latestAction.value = '未打卡'
  dashboard.value = {
    ...dashboard.value,
    status: '未打卡',
    distance: '-- m'
  }
  return
}

    const latestRecord = result.records[0]
    latestAction.value = latestRecord.action || '未打卡'

    if (latestRecord.action === '已上班') {
      latestClockInTime.value = latestRecord.timestamp
      updateWorkingDuration()
    } else {
      latestClockInTime.value = null
      dashboard.value = {
        ...dashboard.value,
        status: latestRecord.action || '未打卡'
      }
    }

    dashboard.value = {
      ...dashboard.value,
      distance:
        latestRecord.distance !== '' && latestRecord.distance !== undefined
          ? `${latestRecord.distance} m`
          : '-- m'
    }

    recentRecords.value = result.records.map((record, index) => ({
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

  gps.value = {
    ...gps.value,
    accuracy: '--',
    range: '定位失敗',
    message: messageMap[error.code] || '定位失敗，請稍後再試。'
  }

  dashboard.value = {
    ...dashboard.value,
    status: '定位失敗',
    distance: '-- m'
  }

  isSubmitting.value = false
}

async function updateGpsDisplay(position, actionLabel) {
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

  dashboard.value = {
    ...dashboard.value,
    distance: `${Math.round(distance)} m`
  }

  if (!isInRange) {
    dashboard.value = {
      ...dashboard.value,
      status: '位置異常'
    }
    isSubmitting.value = false
    return
  }

  try {
    if (!window.liff || !window.liff.isLoggedIn()) {
      throw new Error('尚未登入 LINE')
    }

    const profile = await window.liff.getProfile()

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
gps.value = {
  ...gps.value,
  message: `${actionLabel} 打卡成功 ✅`
}

dashboard.value = {
  ...dashboard.value,
  status: actionLabel
}

await fetchRecentRecords()
  } catch (error) {
    console.error('送出打卡失敗:', error)
    gps.value = {
      ...gps.value,
      message: `送出失敗：${error.message}`
    }
  } finally {
    isSubmitting.value = false
  }
}

function handleAction(type) {
  if (!isActionAllowed(type) || isSubmitting.value) {
    return
  }

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
    return
  }

  isSubmitting.value = true
  gpsStatus.value = 'idle'
  gps.value = {
    ...gps.value,
    range: '定位中',
    message: 'GPS 定位中，請稍候...'
  }

  navigator.geolocation.getCurrentPosition(
    (position) => updateGpsDisplay(position, actionMap[type] || '打卡完成'),
    handleGpsError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)

  workTimer = window.setInterval(() => {
    updateWorkingDuration()
  }, 60000)

  initLiff()
  fetchRecentRecords()
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
  if (workTimer) window.clearInterval(workTimer)
})
</script>
