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
            <strong class="block text-base leading-none max-sm:text-[15px]">員工管理</strong>
            <small class="text-[0.78rem] font-bold text-slate-500 max-sm:hidden">Employee Admin</small>
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
          <div class="grid gap-3 lg:grid-cols-[1.2fr_1fr_auto] lg:items-end">
            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">搜尋員工</label>
              <input
                v-model="keyword"
                type="text"
                placeholder="輸入姓名、員工編號、部門或職稱"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              />
            </div>

            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">狀態篩選</label>
              <select v-model="statusFilter" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300">
                <option value="all">全部</option>
                <option value="在職">在職</option>
                <option value="離職">離職</option>
                <option value="停用">停用</option>
              </select>
            </div>

            <button
              @click="startCreate"
              class="rounded-xl bg-[rgb(60,130,191)] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_16px_rgba(60,130,191,0.18)]"
            >
              ＋ 新增員工
            </button>
          </div>
        </section>

        <section class="mt-3 grid gap-3 md:grid-cols-3">
          <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <div class="text-[0.78rem] font-bold text-slate-500">員工總數</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">{{ stats.total }}</div>
          </div>
          <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <div class="text-[0.78rem] font-bold text-slate-500">在職人數</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">{{ stats.active }}</div>
          </div>
          <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]">
            <div class="text-[0.78rem] font-bold text-slate-500">顯示筆數</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">{{ filteredEmployees.length }}</div>
          </div>
        </section>

        <section class="mt-3 grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
          <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5">
            <div class="mb-3 flex items-center justify-between gap-2.5">
              <h2 class="m-0 text-[1rem] font-bold">員工列表</h2>
              <button @click="fetchEmployees" :disabled="loading" class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-50">
                {{ loading ? '更新中...' : '重新整理' }}
              </button>
            </div>

            <div v-if="errorMessage" class="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
              {{ errorMessage }}
            </div>

            <div v-if="!filteredEmployees.length && !loading" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
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
                      到職日：{{ employee.hireDate || '--' }} ・ 狀態：{{ employee.status || '--' }}
                    </div>
                  </div>
                  <span class="rounded-full px-2.5 py-1 text-[11px] font-bold" :class="getStatusClass(employee.status)">
                    {{ employee.status || '未設定' }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5">
            <div class="mb-3 flex items-center justify-between gap-2.5">
              <h2 class="m-0 text-[1rem] font-bold">{{ editingMode === 'create' ? '新增員工' : '編輯員工' }}</h2>
              <button @click="resetForm" class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                清空
              </button>
            </div>

            <div class="grid gap-3">
              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">員工編號</label>
                  <input v-model="form.employeeCode" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">LINE User ID</label>
                  <input v-model="form.userId" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">LINE 顯示名稱</label>
                  <input v-model="form.lineName" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">正式姓名</label>
                  <input v-model="form.employeeName" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">部門</label>
                  <input v-model="form.department" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">職稱</label>
                  <input v-model="form.title" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">到職日</label>
                  <input v-model="form.hireDate" type="date" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">狀態</label>
                  <select v-model="form.status" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300">
                    <option value="在職">在職</option>
                    <option value="離職">離職</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">角色</label>
                  <select v-model="form.role" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300">
                    <option value="staff">staff</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">主管 User ID</label>
                  <input v-model="form.managerId" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300" />
                </div>
              </div>

              <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div class="mb-2 text-[0.82rem] font-bold text-slate-600">假別欄位預留</div>
                <div class="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-[0.75rem] font-bold text-slate-500">特休預設</label>
                    <input v-model.number="form.annualLeaveDefault" type="number" min="0" step="0.5" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[0.9rem] outline-none focus:border-sky-300" />
                  </div>
                  <div>
                    <label class="mb-1 block text-[0.75rem] font-bold text-slate-500">特休已用</label>
                    <input v-model.number="form.annualLeaveUsed" type="number" min="0" step="0.5" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[0.9rem] outline-none focus:border-sky-300" />
                  </div>
                  <div>
                    <label class="mb-1 block text-[0.75rem] font-bold text-slate-500">補休預設</label>
                    <input v-model.number="form.compOffDefault" type="number" min="0" step="0.5" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[0.9rem] outline-none focus:border-sky-300" />
                  </div>
                  <div>
                    <label class="mb-1 block text-[0.75rem] font-bold text-slate-500">補休已用</label>
                    <input v-model.number="form.compOffUsed" type="number" min="0" step="0.5" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[0.9rem] outline-none focus:border-sky-300" />
                  </div>
                </div>
              </div>

              <div>
                <label class="mb-1 block text-[0.78rem] font-bold text-slate-500">備註</label>
                <textarea v-model="form.note" rows="3" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"></textarea>
              </div>

              <button
                @click="saveEmployee"
                :disabled="saving"
                class="rounded-xl bg-[rgb(31,77,117)] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_16px_rgba(31,77,117,0.18)] disabled:opacity-50"
              >
                {{ saving ? '儲存中...' : '儲存員工資料' }}
              </button>
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

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwgC196q1EWvi29XOukqJ9XwFhwCHzudsjwJ7GknhhQnq6kEMs-i_09XRszDPku0Lrx/exec'

const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const keyword = ref('')
const statusFilter = ref('all')
const editingMode = ref('create')
const employees = ref([])

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
  managerId: '',
  annualLeaveDefault: 0,
  annualLeaveUsed: 0,
  compOffDefault: 0,
  compOffUsed: 0,
  sickLeaveUsed: 0,
  personalLeaveUsed: 0,
  unpaidLeaveUsed: 0,
  marriageLeaveUsed: 0,
  funeralLeaveUsed: 0,
  maternityLeaveUsed: 0,
  paternityLeaveUsed: 0,
  note: ''
})

const form = ref(emptyForm())

const filteredEmployees = computed(() => {
  const q = keyword.value.trim().toLowerCase()

  return employees.value.filter((employee) => {
    const passStatus = statusFilter.value === 'all' || (employee.status || '') === statusFilter.value
    if (!passStatus) return false

    if (!q) return true

    const pool = [
      employee.employeeCode,
      employee.lineName,
      employee.employeeName,
      employee.department,
      employee.title,
      employee.userId
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return pool.includes(q)
  })
})

const stats = computed(() => ({
  total: employees.value.length,
  active: employees.value.filter((item) => item.status === '在職').length
}))

function getStatusClass(status) {
  if (status === '在職') return 'bg-green-100 text-green-700'
  if (status === '離職') return 'bg-slate-200 text-slate-600'
  if (status === '停用') return 'bg-amber-100 text-amber-700'
  return 'bg-slate-100 text-slate-500'
}

function formatDeptTitle(employee) {
  const department = employee.department || ''
  const title = employee.title || ''
  return `${department}${department && title ? '｜' : ''}${title}`
}

function resetForm() {
  form.value = emptyForm()
  editingMode.value = 'create'
}

function startCreate() {
  resetForm()
}

function editEmployee(employee) {
  form.value = {
    employeeCode: employee.employeeCode || '',
    userId: employee.userId || '',
    lineName: employee.lineName || '',
    employeeName: employee.employeeName || '',
    department: employee.department || '',
    title: employee.title || '',
    hireDate: employee.hireDate || '',
    status: employee.status || '在職',
    role: employee.role || 'staff',
    managerId: employee.managerId || '',
    annualLeaveDefault: Number(employee.annualLeaveDefault || 0),
    annualLeaveUsed: Number(employee.annualLeaveUsed || 0),
    compOffDefault: Number(employee.compOffDefault || 0),
    compOffUsed: Number(employee.compOffUsed || 0),
    sickLeaveUsed: Number(employee.sickLeaveUsed || 0),
    personalLeaveUsed: Number(employee.personalLeaveUsed || 0),
    unpaidLeaveUsed: Number(employee.unpaidLeaveUsed || 0),
    marriageLeaveUsed: Number(employee.marriageLeaveUsed || 0),
    funeralLeaveUsed: Number(employee.funeralLeaveUsed || 0),
    maternityLeaveUsed: Number(employee.maternityLeaveUsed || 0),
    paternityLeaveUsed: Number(employee.paternityLeaveUsed || 0),
    note: employee.note || ''
  }
  editingMode.value = 'edit'
}

async function fetchEmployees() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getEmployees`)
    const result = await response.json()

    if (!result.ok || !Array.isArray(result.records)) {
      throw new Error(result.message || '讀取員工資料失敗')
    }

    employees.value = result.records
  } catch (error) {
    errorMessage.value = error.message || '讀取失敗'
    employees.value = []
  } finally {
    loading.value = false
  }
}

async function saveEmployee() {
  saving.value = true
  errorMessage.value = ''

  try {
    const payload = {
      action: 'saveEmployee',
      ...form.value
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
      throw new Error(result.message || '儲存失敗')
    }

    await fetchEmployees()
    resetForm()
  } catch (error) {
    errorMessage.value = error.message || '儲存失敗'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchEmployees()
})
</script>
