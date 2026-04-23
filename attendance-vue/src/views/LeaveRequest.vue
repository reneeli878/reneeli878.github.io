<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(60,130,191,0.12),transparent_28%),linear-gradient(180deg,#f8fbfe_0%,#f3f8fc_60%,#eef5fb_100%)] text-slate-800">
    <header class="sticky top-0 z-50 border-b border-[rgba(219,231,241,0.86)] bg-white/82 backdrop-blur-[14px]">
      <div class="mx-auto flex min-h-[66px] w-[min(1120px,calc(100%-28px))] items-center justify-between gap-3 max-sm:w-[min(100%-16px,1120px)]">
        <div class="flex items-center gap-2.5 font-extrabold">
          <RouterLink
            to="/"
            class="grid h-10 w-[70px] place-items-center rounded-[14px] bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(31,77,117)] text-white shadow-[0_10px_20px_rgba(60,130,191,0.22)] max-sm:h-9 max-sm:w-9"
          >
            <span class="text-[11px] font-black tracking-[0.03em] max-sm:hidden">LUFTQI</span>
            <span class="hidden text-sm font-black max-sm:block">L</span>
          </RouterLink>
          <div>
            <strong class="block text-base leading-none max-sm:text-[15px]">請假申請</strong>
            <small class="text-[0.78rem] font-bold text-slate-500 max-sm:hidden">Leave Request</small>
          </div>
        </div>

        <RouterLink
          to="/"
          class="rounded-full bg-[rgba(60,130,191,0.1)] px-3 py-2 text-xs font-bold text-[rgb(31,77,117)]"
        >
          返回首頁
        </RouterLink>
      </div>
    </header>

    <main class="py-4 max-sm:py-3">
      <div class="mx-auto w-[min(1120px,calc(100%-28px))] max-sm:w-[min(100%-16px,1120px)]">
        <section class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5">
          <div class="mb-4">
            <h2 class="text-[1rem] font-bold">請假資料</h2>
            <p class="mt-1 text-sm text-slate-500">送出後會寫入 Google Sheet，並同步顯示在下方申請紀錄。</p>
          </div>

          <div class="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
            <div><strong>申請人：</strong>{{ currentUser.employeeName || currentUser.name || '未登入' }}</div>
            <div class="mt-1"><strong>員工編號：</strong>{{ currentUser.employeeCode || '--' }}</div>
            <div class="mt-1"><strong>部門職稱：</strong>{{ currentUser.dept || '尚未建檔' }}</div>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">假別</label>
              <select
                v-model="form.leaveType"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              >
                <option value="">請選擇</option>
                <option value="特休">特休</option>
                <option value="補休">補休</option>
                <option value="病假">病假</option>
                <option value="事假">事假</option>
                <option value="無薪假">無薪假</option>
                <option value="婚假">婚假</option>
                <option value="喪假">喪假</option>
                <option value="產假">產假</option>
                <option value="陪產假">陪產假</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">請假單位</label>
              <select
                v-model="form.unit"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              >
                <option value="天">天</option>
                <option value="小時">小時</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">開始日期</label>
              <input
                v-model="form.startDate"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">結束日期</label>
              <input
                v-model="form.endDate"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              />
            </div>

            <div v-if="form.unit === '小時'">
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">開始時間</label>
              <input
                v-model="form.startTime"
                type="time"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              />
            </div>

            <div v-if="form.unit === '小時'">
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">結束時間</label>
              <input
                v-model="form.endTime"
                type="time"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">請假數量</label>
              <input
                v-model.number="form.amount"
                type="number"
                min="0"
                step="0.5"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">選擇主管</label>
              <select
                v-model="form.managerUserId"
                @change="syncManagerName"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              >
                <option value="">請選擇主管</option>
                <option
                  v-for="manager in managers"
                  :key="manager.userId"
                  :value="manager.userId"
                >
                  {{ manager.name }}
                </option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">請假原因</label>
              <textarea
                v-model="form.reason"
                rows="5"
                placeholder="請填寫請假原因"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              ></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">附件上傳（先記錄檔名）</label>
              <input
                type="file"
                @change="handleFileChange"
                class="block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] file:mr-3 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-2 file:text-sm file:font-bold file:text-sky-700"
              />
              <p class="mt-2 text-xs text-slate-500">
                已選檔案：{{ form.attachmentName || '尚未選擇' }}
              </p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
            <div><strong>主管姓名：</strong>{{ form.managerName || '尚未選擇' }}</div>
            <div class="mt-1"><strong>主管 LINE User ID：</strong>{{ form.managerUserId || '尚未選擇' }}</div>
            <div class="mt-1"><strong>申請摘要：</strong>{{ leaveSummary }}</div>
          </div>

          <div class="mt-4 flex gap-2">
            <button
              @click="submitForm"
              :disabled="submitting || loadingUser"
              class="rounded-xl bg-[rgb(60,130,191)] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_16px_rgba(60,130,191,0.18)] disabled:opacity-50"
            >
              {{ submitting ? '送出中...' : '送出申請' }}
            </button>
            <button
              @click="resetForm"
              class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600"
            >
              清除
            </button>
          </div>

          <div v-if="message" class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
            {{ message }}
          </div>
        </section>

        <section class="mt-3 rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5">
          <div class="mb-3 flex items-center justify-between gap-2.5">
            <h2 class="text-[1rem] font-bold">申請紀錄</h2>

            <div class="flex items-center gap-2">
              <button
                @click="recordFilter = 'pending'"
                class="rounded-full px-3 py-1.5 text-[11px] font-bold"
                :class="recordFilter === 'pending'
                  ? 'bg-[rgb(31,77,117)] text-white'
                  : 'bg-slate-100 text-slate-500'"
              >
                未審核
              </button>

              <button
                @click="recordFilter = 'reviewed'"
                class="rounded-full px-3 py-1.5 text-[11px] font-bold"
                :class="recordFilter === 'reviewed'
                  ? 'bg-[rgb(31,77,117)] text-white'
                  : 'bg-slate-100 text-slate-500'"
              >
                已審核
              </button>
            </div>
          </div>

          <div class="mb-3 flex items-center justify-between gap-2 text-xs text-slate-500">
            <span>共 {{ filteredLeaveRecords.length }} 筆</span>
            <button
              @click="fetchLeaveRequests"
              :disabled="loadingRecords"
              class="rounded-full bg-slate-100 px-3 py-1.5 font-bold text-slate-600 disabled:opacity-50"
            >
              {{ loadingRecords ? '更新中...' : '重新整理' }}
            </button>
          </div>

          <div v-if="!filteredLeaveRecords.length" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
            目前此分類沒有請假申請紀錄。
          </div>

          <div v-else class="grid gap-2.5">
            <div
              v-for="record in filteredLeaveRecords"
              :key="record.requestId || record.id"
              class="rounded-xl border border-slate-200 bg-[#fbfdff] px-3 py-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <strong class="text-[0.92rem] font-bold text-slate-800">
                      {{ record.leaveType }}
                    </strong>
                    <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                      {{ record.amount }} {{ record.unit }}
                    </span>
                    <span class="text-[0.78rem] text-slate-400">
                      {{ record.applyDate }}
                    </span>
                  </div>

                  <div class="mt-1 text-[0.82rem] leading-[1.55] text-slate-500">
                    區間：{{ record.startDate }} ~ {{ record.endDate }}
                    <span v-if="record.unit === '小時'">
                      （{{ record.startTime || '--:--' }} ~ {{ record.endTime || '--:--' }}）
                    </span>
                  </div>

                  <div class="mt-1 text-[0.82rem] leading-[1.55] text-slate-500">
                    原因：{{ record.reason }}
                  </div>

                  <div class="mt-1 text-[0.78rem] leading-[1.5] text-slate-400">
                    主管：{{ record.managerName || '未指定' }}
                  </div>

                  <div v-if="record.reviewNote" class="mt-1 text-[0.78rem] leading-[1.5] text-slate-400">
                    審核備註：{{ record.reviewNote }}
                  </div>
                </div>

                <span
                  class="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
                  :class="getStatusClass(record.status)"
                >
                  {{ record.status }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const DEV_MODE = false
const LIFF_ID = '2008602232-c53WoD3q'
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwgC196q1EWvi29XOukqJ9XwFhwCHzudsjwJ7GknhhQnq6kEMs-i_09XRszDPku0Lrx/exec'

const managers = [
  { name: '王主任', userId: 'U_MANAGER_001' },
  { name: '李經理', userId: 'U_MANAGER_002' },
  { name: '陳主管', userId: 'U_MANAGER_003' }
]

const currentUser = ref({
  userId: '',
  name: '',
  employeeName: '',
  employeeCode: '',
  dept: ''
})

const loadingUser = ref(false)
const loadingRecords = ref(false)
const submitting = ref(false)
const message = ref('')
const recordFilter = ref('pending')

const form = reactive({
  leaveType: '',
  unit: '天',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  amount: 1,
  reason: '',
  managerName: '',
  managerUserId: '',
  attachmentFile: null,
  attachmentName: ''
})

const leaveRecords = ref([])

const leaveSummary = computed(() => {
  if (!form.leaveType) return '尚未填寫完整請假資料'

  const dateRange = form.startDate && form.endDate
    ? `${form.startDate} ~ ${form.endDate}`
    : '日期未完整'

  const timeRange = form.unit === '小時'
    ? ` ${form.startTime || '--:--'} ~ ${form.endTime || '--:--'}`
    : ''

  return `${form.leaveType}｜${dateRange}${timeRange}｜${form.amount || 0}${form.unit}`
})

const filteredLeaveRecords = computed(() => {
  if (recordFilter.value === 'pending') {
    return leaveRecords.value.filter(
      (record) => record.status === '待審核'
    )
  }

  return leaveRecords.value.filter(
    (record) =>
      record.status === '已核准' ||
      record.status === '已退回'
  )
})

function syncManagerName() {
  const manager = managers.find((item) => item.userId === form.managerUserId)
  form.managerName = manager ? manager.name : ''
}

function handleFileChange(event) {
  const file = event.target.files?.[0] || null
  form.attachmentFile = file
  form.attachmentName = file ? file.name : ''
}

function getStatusClass(status) {
  if (status === '已核准') return 'bg-green-100 text-green-700'
  if (status === '已退回') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

function resetForm() {
  form.leaveType = ''
  form.unit = '天'
  form.startDate = ''
  form.endDate = ''
  form.startTime = ''
  form.endTime = ''
  form.amount = 1
  form.reason = ''
  form.managerName = ''
  form.managerUserId = ''
  form.attachmentFile = null
  form.attachmentName = ''
}

async function fetchEmployeeProfile(userId) {
  const response = await fetch(
    `${GAS_WEB_APP_URL}?action=getEmployee&userId=${encodeURIComponent(userId)}`
  )
  const result = await response.json()

  if (!result.ok) {
    throw new Error(result.message || '讀取員工資料失敗')
  }

  return result.employee || null
}

async function initLiff() {
  loadingUser.value = true

  try {
    if (DEV_MODE) {
      currentUser.value = {
        userId: 'DEV-MODE-USER',
        name: '測試使用者',
        employeeName: '測試使用者',
        employeeCode: 'A001',
        dept: '營運管理部｜專員'
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
    const employee = await fetchEmployeeProfile(profile.userId)

    const department = employee?.department || ''
    const title = employee?.title || ''
    const deptText = `${department}${department && title ? '｜' : ''}${title}`

    currentUser.value = {
      userId: profile.userId,
      name: profile.displayName || '',
      employeeName: employee?.employeeName || profile.displayName || '',
      employeeCode: employee?.employeeCode || '',
      dept: deptText || '尚未建檔'
    }
  } catch (error) {
    console.error('LIFF 初始化失敗:', error)
    message.value = `LIFF 初始化失敗：${error.message}`
  } finally {
    loadingUser.value = false
  }
}

async function fetchLeaveRequests() {
  if (!currentUser.value.userId) return

  loadingRecords.value = true

  try {
    const response = await fetch(
      `${GAS_WEB_APP_URL}?action=getLeaveRequests&userId=${encodeURIComponent(currentUser.value.userId)}`
    )
    const result = await response.json()

    if (!result.ok || !Array.isArray(result.records)) {
      throw new Error(result.message || '讀取請假申請紀錄失敗')
    }

    leaveRecords.value = result.records
  } catch (error) {
    console.error('讀取請假申請紀錄失敗:', error)
    message.value = error.message || '讀取請假申請紀錄失敗'
    leaveRecords.value = []
  } finally {
    loadingRecords.value = false
  }
}

async function submitForm() {
  if (!form.leaveType || !form.startDate || !form.endDate || !form.reason || !form.amount) {
    message.value = '請先填寫完整的請假資料。'
    return
  }

  if (form.unit === '小時' && (!form.startTime || !form.endTime)) {
    message.value = '請先填寫完整的請假時間。'
    return
  }

  if (!currentUser.value.userId) {
    message.value = '尚未取得登入者資料，請重新整理後再試。'
    return
  }

  submitting.value = true

  try {
    const payload = {
      action: 'saveLeaveRequest',
      userId: currentUser.value.userId,
      employeeCode: currentUser.value.employeeCode,
      employeeName: currentUser.value.employeeName || currentUser.value.name,
      leaveType: form.leaveType,
      unit: form.unit,
      startDate: form.startDate,
      endDate: form.endDate,
      startTime: form.startTime,
      endTime: form.endTime,
      amount: form.amount,
      reason: form.reason,
      managerName: form.managerName,
      managerUserId: form.managerUserId,
      attachmentName: form.attachmentName
    }

    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (!result.ok) {
      throw new Error(result.message || '請假申請送出失敗')
    }

    recordFilter.value = 'pending'
    message.value = '請假申請已送出。'
    resetForm()
    await fetchLeaveRequests()
  } catch (error) {
    console.error('請假申請送出失敗:', error)
    message.value = error.message || '請假申請送出失敗'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await initLiff()
  await fetchLeaveRequests()
})
</script>