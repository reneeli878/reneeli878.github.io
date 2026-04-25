<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(60,130,191,0.12),transparent_28%),linear-gradient(180deg,#f8fbfe_0%,#f3f8fc_60%,#eef5fb_100%)] text-slate-800">
    <header class="sticky top-0 z-50 border-b border-[rgba(219,231,241,0.86)] bg-white/82 backdrop-blur-[14px]">
      <div class="mx-auto flex min-h-[66px] w-[min(1120px,calc(100%-28px))] items-center justify-between gap-3 max-sm:w-[min(100%-16px,1120px)]">
        <div class="flex items-center gap-2.5 font-extrabold">
          <RouterLink to="/" class="grid h-10 w-[70px] place-items-center rounded-[14px] bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(31,77,117)] text-white shadow-[0_10px_20px_rgba(60,130,191,0.22)] max-sm:h-9 max-sm:w-9">
            <span class="text-[11px] font-black tracking-[0.03em] max-sm:hidden">LUFTQI</span>
            <span class="hidden text-sm font-black max-sm:block">L</span>
          </RouterLink>
          <div>
            <strong class="block text-base leading-none max-sm:text-[15px]">管理後台</strong>
            <small class="text-[0.78rem] font-bold text-slate-500 max-sm:hidden">Admin Console</small>
          </div>
        </div>

        <RouterLink to="/" class="rounded-full bg-[rgba(60,130,191,0.1)] px-3 py-2 text-xs font-bold text-[rgb(31,77,117)]">
          返回首頁
        </RouterLink>
      </div>
    </header>

    <main class="py-4 max-sm:py-3">
      <div class="mx-auto w-[min(1120px,calc(100%-28px))] max-sm:w-[min(100%-16px,1120px)]">
        <section v-if="loadingUser" class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-6 text-center shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
          <div class="text-sm font-bold text-slate-500">權限檢查中...</div>
        </section>

        <section v-else-if="!canAccessAdmin" class="rounded-[20px] border border-red-200 bg-red-50 p-6 text-center shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
          <div class="text-lg font-black text-red-600">沒有管理後台權限</div>
          <p class="mt-2 text-sm text-red-500">目前帳號角色：{{ currentUser.role || 'staff' }}</p>
        </section>

        <div v-else class="space-y-3">
          <section class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 class="m-0 text-[1.05rem] font-black text-slate-800">
                  {{ currentUser.employeeName || currentUser.name }}
                </h1>
                <p class="mt-1 text-sm font-bold text-slate-500">
                  {{ currentUser.dept || '尚未建檔' }} ・ {{ currentUser.role }}
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-1 rounded-[18px] bg-slate-100 p-1 text-xs font-bold">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  type="button"
                  @click="activeTab = tab.key"
                  class="flex min-h-[38px] cursor-pointer items-center justify-center rounded-full px-4 py-2 leading-none whitespace-nowrap transition"
                  :class="activeTab === tab.key ? 'bg-[rgb(31,77,117)] text-white shadow-sm' : 'text-slate-500 hover:bg-white'"
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>
          </section>

          <section v-if="message" class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
            {{ message }}
          </section>

          <section v-if="activeTab === 'employees'" class="grid gap-3">
            <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
              <div class="mb-3 grid gap-3 lg:grid-cols-[1fr_180px_auto] lg:items-end">
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">搜尋員工</label>
                  <input v-model="keyword" type="text" placeholder="姓名、員工編號、部門、職稱" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>

                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">狀態</label>
                  <select v-model="statusFilter" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300">
                    <option value="all">全部</option>
                    <option value="在職">在職</option>
                    <option value="離職">離職</option>
                    <option value="停用">停用</option>
                  </select>
                </div>

                <button
  type="button"
  @click="clearEmployeeSearch"
  class="flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-xl bg-[rgb(60,130,191)] px-4 py-3 text-sm font-bold leading-none text-white shadow-[0_8px_16px_rgba(60,130,191,0.18)]"
>
  清除
</button>
              </div>

              <div class="mb-3 flex items-center justify-between gap-2.5">
                <h2 class="m-0 text-[1rem] font-bold">員工列表</h2>
                <button
  @click="fetchEmployees"
  :disabled="loadingEmployees"
  class="flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-xl bg-[rgb(60,130,191)] px-4 py-3 text-sm font-bold leading-none text-white shadow-[0_8px_16px_rgba(60,130,191,0.18)] disabled:opacity-50"
>
  {{ loadingEmployees ? '更新中...' : '重新整理' }}
</button>
              </div>

              <div v-if="!filteredEmployees.length && !loadingEmployees" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                目前沒有符合條件的員工資料。
              </div>

              <div class="grid gap-2.5">
                <button
                  v-for="employee in filteredEmployees"
                  :key="employee.userId || employee.employeeCode"
                  @click="editEmployee(employee)"
                  class="w-full rounded-xl border border-slate-200 bg-[#fbfdff] px-3 py-3 text-left transition hover:border-slate-300 hover:bg-white"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <strong class="text-[0.95rem] font-bold text-slate-800">{{ employee.employeeName || '未命名員工' }}</strong>
                        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{{ employee.employeeCode || '--' }}</span>
                      </div>
                      <div class="mt-1 text-[0.8rem] leading-[1.55] text-slate-500">
                        {{ formatDeptTitle(employee) || '未填部門職稱' }}
                      </div>
                      <div class="mt-1 text-[0.76rem] leading-[1.5] text-slate-400">
                        到職日：{{ employee.hireDate || '--' }} ・ 角色：{{ employee.role || 'staff' }} ・ 狀態：{{ employee.status || '--' }}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </section>

          <section v-if="activeTab === 'repair'" class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <ReviewBlock
              title="補打卡審核"
              type="repair"
              :records="filteredRepairReviews"
              :filter="reviewFilter"
              :loading="loadingRepairReviews"
              @set-filter="reviewFilter = $event"
              @refresh="fetchRepairReviews"
              :on-review="handleReview"
              @reviewed="applyReviewedRecord"
            />
          </section>

          <section v-if="activeTab === 'leave'" class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <ReviewBlock
  title="假單審核"
  type="leave"
  :records="filteredLeaveReviews"
  :filter="reviewFilter"
  :loading="loadingLeaveReviews"
  :on-review="handleReview"
  @reviewed="applyReviewedRecord"
  @set-filter="reviewFilter = $event"
  @refresh="fetchLeaveReviews"
/>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { GAS_WEB_APP_URL, LIFF_ID, DEV_MODE } from '@/config'

const ReviewBlock = defineComponent({
  props: {
  title: String,
  type: String,
  records: Array,
  filter: String,
  loading: Boolean,
  onReview: Function
},
emits: ['set-filter', 'refresh', 'reviewed'],
  setup(props, { emit }) {
    const notes = ref({})
    const processingId = ref('')
    const successId = ref('')
    const successStatus = ref('')
    const toast = ref('')

    const badgeClass = (status) => {
      if (status === '已核准') return 'bg-green-100 text-green-700'
      if (status === '已退回') return 'bg-red-100 text-red-700'
      return 'bg-amber-100 text-amber-700'
    }

    async function submitReview(record, status) {
  if (processingId.value) return

  const payload = {
    type: props.type,
    requestId: record.requestId,
    status,
    reviewNote: notes.value[record.requestId] || ''
  }

  processingId.value = record.requestId
  successId.value = ''
  successStatus.value = ''
  toast.value = ''

  try {
    const updatedRecord = await props.onReview(payload)

    successId.value = record.requestId
    successStatus.value = status
    toast.value = status === '已核准' ? '已核准申請' : '已退回申請'

    await new Promise(resolve => setTimeout(resolve, 700))

    emit('reviewed', {
      payload,
      record: updatedRecord
    })

    toast.value = ''
    successId.value = ''
    successStatus.value = ''
  } finally {
    processingId.value = ''
  }
}

    const renderSpinner = () => h('span', {
      class: 'mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-white align-[-2px]'
    })

    return () => h('div', [
      toast.value
        ? h('div', {
          class: `mb-3 rounded-xl px-3 py-2 text-sm font-bold shadow-sm ${
            successStatus.value === '已核准'
              ? 'border border-green-200 bg-green-50 text-green-700'
              : 'border border-red-200 bg-red-50 text-red-700'
          }`
        }, toast.value)
        : null,

      h('div', { class: 'mb-3 flex flex-wrap items-center justify-between gap-2.5' }, [
        h('h2', { class: 'm-0 text-[1rem] font-bold' }, props.title),
        h('div', { class: 'flex items-center gap-2' }, [
          h('button', {
            onClick: () => emit('set-filter', 'pending'),
            class: `rounded-full px-3 py-1.5 text-xs font-bold ${
              props.filter === 'pending'
                ? 'bg-[rgb(31,77,117)] text-white'
                : 'bg-slate-100 text-slate-500'
            }`
          }, '未審核'),
          h('button', {
            onClick: () => emit('set-filter', 'reviewed'),
            class: `rounded-full px-3 py-1.5 text-xs font-bold ${
              props.filter === 'reviewed'
                ? 'bg-[rgb(31,77,117)] text-white'
                : 'bg-slate-100 text-slate-500'
            }`
          }, '已審核'),
          h('button', {
            disabled: props.loading,
            onClick: () => emit('refresh'),
            class: 'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-50'
          }, props.loading ? '更新中...' : '重新整理')
        ])
      ]),

      h('div', { class: 'mb-3 text-xs text-slate-500' }, `共 ${props.records?.length || 0} 筆`),

      !props.records?.length
        ? h('div', { class: 'rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500' }, '目前此分類沒有資料。')
        : h('div', { class: 'grid gap-2.5' }, props.records.map((record) => {
          const title = props.type === 'repair'
            ? (record.type || '補打卡申請')
            : (record.leaveType || '請假申請')

          const isProcessing = processingId.value === record.requestId
          const isSuccess = successId.value === record.requestId
          const successClass = successStatus.value === '已核准'
  ? 'border-green-300 bg-green-50/70 translate-x-6 opacity-0 scale-[0.98]'
  : 'border-red-300 bg-red-50/70 translate-x-6 opacity-0 scale-[0.98]'

          return h('div', {
            key: record.requestId,
            class: `rounded-xl border px-3 py-3 transition-all duration-700 ease-out ${
              isSuccess
                ? successClass
                : isProcessing
                  ? 'border-slate-300 bg-slate-50 opacity-70'
                  : 'border-slate-200 bg-[#fbfdff]'
            }`
          }, [
            h('div', { class: 'flex items-start justify-between gap-3' }, [
              h('div', { class: 'min-w-0 flex-1' }, [
                h('div', { class: 'flex flex-wrap items-center gap-2' }, [
                  h('strong', { class: 'text-[0.95rem] font-bold text-slate-800' }, title),
                  h('span', { class: 'text-[0.78rem] text-slate-400' }, record.applyDate || '')
                ]),

                h('div', { class: 'mt-1 text-[0.82rem] leading-[1.55] text-slate-500' }, `申請人：${record.employeeName || '--'}（${record.employeeCode || '--'}）`),

                props.type === 'repair'
                  ? h('div', { class: 'mt-1 text-[0.82rem] leading-[1.55] text-slate-500' }, `補卡日期：${record.targetDate || '--'} ${record.targetTime || ''}`)
                  : h('div', { class: 'mt-1 text-[0.82rem] leading-[1.55] text-slate-500' }, `區間：${record.startDate || '--'} ~ ${record.endDate || '--'}｜${record.amount || '--'} ${record.unit || ''}`),
props.type === 'leave'
  ? h('div', {
    class: `mt-2 rounded-xl px-3 py-2 text-[0.8rem] font-bold ${
      isLeaveBalanceInsufficient(record)
        ? 'bg-red-50 text-red-700 border border-red-200'
        : 'bg-green-50 text-green-700 border border-green-200'
    }`
  }, isLeaveBalanceInsufficient(record)
    ? `⚠️ 餘額不足：${getLeaveBalanceText(record)}`
    : `餘額：${getLeaveBalanceText(record)}`
  )
  : null,
                h('div', { class: 'mt-1 text-[0.82rem] leading-[1.55] text-slate-500' }, `原因：${record.reason || '--'}`),

                record.attachmentUrl
                  ? h('a', {
                    href: record.attachmentUrl,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'mt-2 block overflow-hidden rounded-xl border border-slate-200 bg-white'
                  }, [
                    h('div', { class: 'px-2 py-1 text-[0.75rem] font-bold text-slate-500' }, `附件：${record.attachmentName || '查看附件'}`),
                    h('img', {
                      src: record.attachmentUrl,
                      alt: '附件預覽',
                      class: 'max-h-48 w-full object-contain'
                    })
                  ])
                  : null,

                props.filter === 'reviewed'
                  ? h('div', { class: 'mt-2 rounded-xl bg-slate-50 px-3 py-2 text-[0.8rem] text-slate-500' }, [
                    h('div', `審核時間：${record.reviewTime || '--'}`),
                    h('div', `審核備註：${record.reviewNote || '無'}`)
                  ])
                  : h('div', [
                    h('textarea', {
                      disabled: isProcessing,
                      value: notes.value[record.requestId] || '',
                      onInput: (event) => { notes.value[record.requestId] = event.target.value },
                      placeholder: '審核備註（可空白）',
                      rows: 2,
                      class: 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[0.86rem] outline-none focus:border-sky-300 disabled:opacity-50'
                    }),
                    h('div', { class: 'mt-2 flex gap-2' }, [
                      h('button', {
                        disabled: isProcessing || !!processingId.value,
                        onClick: () => submitReview(record, '已核准'),
                        class: 'rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50'
                      }, [
                        isProcessing ? renderSpinner() : null,
                        isProcessing ? '處理中...' : '核准'
                      ]),
                      h('button', {
                        disabled: isProcessing || !!processingId.value,
                        onClick: () => submitReview(record, '已退回'),
                        class: 'rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50'
                      }, [
                        isProcessing ? renderSpinner() : null,
                        isProcessing ? '處理中...' : '退回'
                      ])
                    ])
                  ])
              ]),
              h('span', {
                class: `whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass(record.status)}`
              }, record.status || '待審核')
            ])
          ])
        }))
    ])
  }
})
const tabs = [
  { key: 'employees', label: '員工管理' },
  { key: 'repair', label: '補打卡審核' },
  { key: 'leave', label: '假單審核' }
]

const activeTab = ref('employees')
const reviewFilter = ref('pending')
const message = ref('')
const loadingUser = ref(false)

const currentUser = ref({
  userId: '',
  name: '',
  employeeName: '',
  employeeCode: '',
  dept: '',
  role: 'staff'
})

const canAccessAdmin = computed(() => {
  return currentUser.value.role === 'manager' || currentUser.value.role === 'admin'
})

const keyword = ref('')
const statusFilter = ref('all')
const employees = ref([])
const loadingEmployees = ref(false)
const savingEmployee = ref(false)
const editingMode = ref('create')

const repairReviews = ref([])
const leaveReviews = ref([])
const loadingRepairReviews = ref(false)
const loadingLeaveReviews = ref(false)

const emptyForm = () => ({
  employeeCode: '',
  userId: '',
  lineName: '',
  employeeName: '',
  department: '',
  title: '',
  hireDate: '',
  status: '在職',
  role: 'staff',
  managerId: ''
})

const form = ref(emptyForm())

const filteredEmployees = computed(() => {
  const q = keyword.value.trim().toLowerCase()

  return employees.value.filter((employee) => {
    const passStatus = statusFilter.value === 'all' || (employee.status || '') === statusFilter.value
    if (!passStatus) return false
    if (!q) return true

    return [
      employee.employeeCode,
      employee.lineName,
      employee.employeeName,
      employee.department,
      employee.title,
      employee.userId
    ].filter(Boolean).join(' ').toLowerCase().includes(q)
  })
})

const filteredRepairReviews = computed(() => {
  if (reviewFilter.value === 'pending') {
    return repairReviews.value.filter((record) => record.status === '待審核')
  }

  return repairReviews.value.filter((record) => record.status === '已核准' || record.status === '已退回')
})

const filteredLeaveReviews = computed(() => {
  if (reviewFilter.value === 'pending') {
    return leaveReviews.value.filter((record) => record.status === '待審核')
  }

  return leaveReviews.value.filter((record) => record.status === '已核准' || record.status === '已退回')
})

function formatDeptTitle(employee) {
  const department = employee.department || ''
  const title = employee.title || ''
  return `${department}${department && title ? '｜' : ''}${title}`
}

function resetForm() {
  form.value = emptyForm()
  editingMode.value = 'create'
}

function clearEmployeeSearch() {
  keyword.value = ''
  statusFilter.value = 'all'
}

function editEmployee(employee) {
  form.value = { ...emptyForm(), ...employee }
  editingMode.value = 'edit'
}

function applyReviewedRecord({ payload, record }) {
  const updatedRecord = {
    ...record,
    status: payload.status,
    reviewNote: payload.reviewNote || record?.reviewNote || '',
    reviewTime: record?.reviewTime || new Date().toLocaleString('zh-TW', { hour12: false })
  }

  if (payload.type === 'repair') {
    repairReviews.value = repairReviews.value.map((item) =>
      item.requestId === payload.requestId
        ? { ...item, ...updatedRecord }
        : item
    )
  } else {
    leaveReviews.value = leaveReviews.value.map((item) =>
      item.requestId === payload.requestId
        ? { ...item, ...updatedRecord }
        : item
    )
  }

  message.value = `已更新為 ${payload.status}`
}

function getLeaveBalanceText(record) {
  const amount = Number(record.amount || 0)

  if (record.leaveType === '特休') {
    const remain = Number(record.annualLeaveDefault || 0) - Number(record.annualLeaveUsed || 0)
    return `特休剩餘 ${remain} 天，核准後剩 ${remain - amount} 天`
  }

  if (record.leaveType === '補休') {
    const remain = Number(record.compOffDefault || 0) - Number(record.compOffUsed || 0)
    return `補休剩餘 ${remain} 小時，核准後剩 ${remain - amount} 小時`
  }

  if (record.leaveType === '病假') {
    return `病假已用 ${record.sickLeaveUsed || 0} 天`
  }

  if (record.leaveType === '事假') {
    return `事假已用 ${record.personalLeaveUsed || 0} 天`
  }

  return `${record.leaveType || '假別'} 已用紀錄：${amount || 0} ${record.unit || ''}`
}

function isLeaveBalanceInsufficient(record) {
  const amount = Number(record.amount || 0)

  if (record.leaveType === '特休') {
    const remain = Number(record.annualLeaveDefault || 0) - Number(record.annualLeaveUsed || 0)
    return amount > remain
  }

  if (record.leaveType === '補休') {
    const remain = Number(record.compOffDefault || 0) - Number(record.compOffUsed || 0)
    return amount > remain
  }

  return false
}

async function fetchEmployeeProfile(userId) {
  const response = await fetch(`${GAS_WEB_APP_URL}?action=getEmployee&userId=${encodeURIComponent(userId)}`)
  const result = await response.json()
  if (!result.ok) throw new Error(result.message || '讀取員工資料失敗')
  return result.employee || null
}

async function initLiff() {
  loadingUser.value = true

  try {
    if (DEV_MODE) {
      currentUser.value = {
        userId: 'DEV-MODE-USER',
        name: '測試使用者',
        employeeName: '測試主管',
        employeeCode: 'A001',
        dept: '營運管理部｜主管',
        role: 'manager'
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
      dept: deptText || '尚未建檔',
      role: employee?.role || 'staff'
    }
  } catch (error) {
    message.value = `權限檢查失敗：${error.message}`
  } finally {
    loadingUser.value = false
  }
}

async function fetchEmployees() {
  loadingEmployees.value = true
  message.value = ''

  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getEmployees`)
    const result = await response.json()

    if (!result.ok || !Array.isArray(result.records)) {
      throw new Error(result.message || '讀取員工資料失敗')
    }

    employees.value = result.records
  } catch (error) {
    message.value = error.message || '讀取員工資料失敗'
    employees.value = []
  } finally {
    loadingEmployees.value = false
  }
}

async function saveEmployee() {
  savingEmployee.value = true
  message.value = ''

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'saveEmployee',
        ...form.value
      })
    })

    const result = await response.json()

    if (!result.ok) throw new Error(result.message || '儲存失敗')

    message.value = '員工資料已儲存。'
    await fetchEmployees()
    resetForm()
  } catch (error) {
    message.value = error.message || '儲存失敗'
  } finally {
    savingEmployee.value = false
  }
}

async function fetchRepairReviews() {
  if (!currentUser.value.userId) return
  loadingRepairReviews.value = true

  try {
    const query = currentUser.value.role === 'admin'
      ? `${GAS_WEB_APP_URL}?action=getRepairRequests`
      : `${GAS_WEB_APP_URL}?action=getRepairRequests&managerUserId=${encodeURIComponent(currentUser.value.userId)}`

    const response = await fetch(query)
    const result = await response.json()

    if (!result.ok || !Array.isArray(result.records)) {
      throw new Error(result.message || '讀取補打卡審核資料失敗')
    }

    repairReviews.value = result.records
  } catch (error) {
    message.value = error.message || '讀取補打卡審核資料失敗'
    repairReviews.value = []
  } finally {
    loadingRepairReviews.value = false
  }
}

async function fetchLeaveReviews() {
  if (!currentUser.value.userId) return
  loadingLeaveReviews.value = true

  try {
    const query = currentUser.value.role === 'admin'
      ? `${GAS_WEB_APP_URL}?action=getLeaveRequests`
      : `${GAS_WEB_APP_URL}?action=getLeaveRequests&managerUserId=${encodeURIComponent(currentUser.value.userId)}`

    const response = await fetch(query)
    const result = await response.json()

    if (!result.ok || !Array.isArray(result.records)) {
      throw new Error(result.message || '讀取假單審核資料失敗')
    }

    leaveReviews.value = result.records
  } catch (error) {
    message.value = error.message || '讀取假單審核資料失敗'
    leaveReviews.value = []
  } finally {
    loadingLeaveReviews.value = false
  }
}

async function handleReview(payload) {
  try {
    const action = payload.type === 'repair'
      ? 'reviewRepairRequest'
      : 'reviewLeaveRequest'

    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action,
        requestId: payload.requestId,
        status: payload.status,
        reviewNote: payload.reviewNote
      })
    })

    const result = await response.json()

    if (!result.ok) {
      throw new Error(result.message || '審核失敗')
    }

    return result.record
  } catch (error) {
    message.value = error.message || '審核失敗'
    throw error
  }
}


onMounted(async () => {
  await initLiff()

  if (canAccessAdmin.value) {
    await Promise.all([
      fetchEmployees(),
      fetchRepairReviews(),
      fetchLeaveReviews()
    ])
  }
})
</script>

<style scoped>
.input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgb(226 232 240);
  background: white;
  padding: 0.75rem;
  font-size: 0.92rem;
  outline: none;
}
</style>