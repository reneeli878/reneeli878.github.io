<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(60,130,191,0.12),transparent_28%),linear-gradient(180deg,#f8fbfe_0%,#f3f8fc_60%,#eef5fb_100%)] text-slate-800"
  >
    <header
      class="sticky top-0 z-50 border-b border-[rgba(219,231,241,0.86)] bg-white/82 backdrop-blur-[14px]"
    >
      <div
        class="mx-auto flex min-h-[66px] w-[min(1120px,calc(100%-28px))] items-center justify-between gap-3 max-[920px]:w-[min(100%-22px,1120px)] max-sm:min-h-[60px] max-sm:w-[min(100%-16px,1120px)]"
      >
        <div class="flex items-center gap-2.5 font-extrabold">
          <RouterLink
            to="/"
            class="grid h-10 w-[70px] place-items-center rounded-[14px] bg-gradient-to-br from-[rgb(60,130,191)] to-[rgb(31,77,117)] text-white shadow-[0_10px_20px_rgba(60,130,191,0.22)] max-sm:h-9 max-sm:w-9 max-sm:rounded-xl"
          >
            <span class="text-[11px] font-black tracking-[0.03em] max-sm:hidden"
              >LUFTQI</span
            >
            <span class="hidden text-sm font-black max-sm:block">L</span>
          </RouterLink>
          <div>
            <strong class="block text-base leading-none max-sm:text-[15px]"
              >出勤查詢</strong
            >
            <small class="text-[0.78rem] font-bold text-slate-500 max-sm:hidden"
              >My Attendance</small
            >
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
      <div
        class="mx-auto w-[min(1120px,calc(100%-28px))] max-[920px]:w-[min(100%-22px,1120px)] max-sm:w-[min(100%-16px,1120px)]"
      >
        <section
          class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5"
        >
          <div class="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500"
                >開始日期</label
              >
              <input
                v-model="startDate"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              />
            </div>
            <div>
              <label class="mb-1 block text-[0.78rem] font-bold text-slate-500"
                >結束日期</label
              >
              <input
                v-model="endDate"
                type="date"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[0.92rem] outline-none focus:border-sky-300"
              />
            </div>
            <button
              @click="fetchAttendance"
              :disabled="loading"
              class="rounded-xl bg-[rgb(60,130,191)] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_16px_rgba(60,130,191,0.18)] disabled:opacity-50"
            >
              {{ loading ? "查詢中..." : "查詢" }}
            </button>
          </div>
        </section>

        <section class="mt-3 grid gap-3 md:grid-cols-3">
          <div
            class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]"
          >
            <div class="text-[0.78rem] font-bold text-slate-500">本月總工時</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">
              {{ summary.totalWorkHours }}
            </div>
          </div>
          <div
            class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]"
          >
            <div class="text-[0.78rem] font-bold text-slate-500">出勤天數</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">
              {{ summary.attendanceDays }}
            </div>
          </div>
          <div
            class="rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)]"
          >
            <div class="text-[0.78rem] font-bold text-slate-500">打卡異常</div>
            <div class="mt-2 text-[1.5rem] font-black text-[rgb(31,77,117)]">
              {{ summary.abnormalCount }}
            </div>
          </div>
        </section>

        <section
          class="mt-3 rounded-[20px] border border-[rgba(219,231,241,0.96)] bg-white/92 p-4 shadow-[0_12px_24px_rgba(25,55,90,0.08)] max-sm:rounded-[18px] max-sm:p-3.5"
        >
          <div class="mb-3 flex items-center justify-between gap-2.5">
            <h2 class="m-0 text-[1rem] font-bold">個人出勤明細</h2>
          </div>

          <div
            v-if="errorMessage"
            class="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600"
          >
            {{ errorMessage }}
          </div>

          <div
            v-if="!records.length && !loading"
            class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500"
          >
            目前沒有符合條件的出勤資料。
          </div>

          <div class="grid gap-2.5">
  <div
    v-for="day in dailyRows"
    :key="day.date"
    class="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-[#fbfdff] px-3 py-3"
  >
    <div class="min-w-0 flex-1">
      <strong class="block text-[0.9rem] font-bold text-slate-800">
        {{ day.dateText }}
      </strong>

      <div class="mt-1 text-[0.8rem] leading-[1.55] text-slate-500">
        上班：{{ day.clockInTime }} ・ 下班：{{ day.clockOutTime }}
      </div>

      <div class="mt-1 text-[0.8rem] leading-[1.55] text-slate-500">
        工時：{{ day.workHoursText }}
      </div>

      <div
        v-if="day.note"
        class="mt-1 text-[0.78rem] font-bold text-amber-600"
      >
        {{ day.note }}
      </div>
    </div>

    <div
      class="min-w-[88px] whitespace-nowrap rounded-full px-[10px] py-[6px] text-center text-[0.75rem] font-extrabold shadow-sm"
      :class="day.badgeClass"
    >
      {{ day.statusText }}
    </div>
  </div>
</div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import {
  GAS_WEB_APP_URL,
  LIFF_ID,
  DEV_MODE
} from '@/config'

const loading = ref(false);
const errorMessage = ref("");
const records = ref([]);
const startDate = ref("");
const endDate = ref("");

const user = ref({
  name: "未登入",
  userId: "DEV-MODE-USER",
});

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function getMonthStartString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

startDate.value = getMonthStartString();
endDate.value = getTodayString();

function getDateKey(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function normalizeToMinute(dateValue) {
  const d = new Date(dateValue);
  d.setSeconds(0, 0);
  return d;
}

function roundClockIn(dateValue) {
  const d = normalizeToMinute(dateValue)
  const mins = d.getMinutes()

  if (mins === 0 || mins === 30) return d

  if (mins < 30) {
    d.setMinutes(30)
  } else {
    d.setHours(d.getHours() + 1)
    d.setMinutes(0)
  }

  return d
}

function roundClockOut(dateValue) {
  const d = normalizeToMinute(dateValue)
  const mins = d.getMinutes()

  if (mins < 30) {
    d.setMinutes(0)
  } else {
    d.setMinutes(30)
  }

  return d
}

function roundToHalfHour(dateValue) {
  const d = normalizeToMinute(dateValue);
  const mins = d.getMinutes();

  if (mins < 15) {
    d.setMinutes(0);
  } else if (mins < 45) {
    d.setMinutes(30);
  } else {
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
  }

  return d;
}

function addHours(dateValue, hours) {
  const d = new Date(dateValue);
  d.setHours(d.getHours() + hours);
  return d;
}

function formatDateOnly(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "--";

  const week = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"][d.getDay()];
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")} ${week}`;
}

function formatTimeOnly(dateString) {
  const date = normalizeToMinute(dateString);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatMinutes(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return "0 小時 0 分";

  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);

  return `${hours} 小時 ${mins} 分`;
}

function isClockInAction(action) {
  return String(action || "").includes("上班");
}

function isClockOutAction(action) {
  return String(action || "").includes("下班");
}

function getRecordSourceText(record) {
  const source = String(record?.source || "").trim();

  if (source.includes("補打卡")) return "補打卡";
  if (source.includes("GPS")) return "GPS打卡";

  return "";
}

function calculateOverlapMinutes(startA, endA, startB, endB) {
  const start = Math.max(startA.getTime(), startB.getTime());
  const end = Math.min(endA.getTime(), endB.getTime());

  return Math.max(0, (end - start) / 1000 / 60);
}

function getDateTimeByTime(dateString, timeText) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  const [hour, minute] = String(timeText || "00:00").split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute || 0, 0);
}

function calculateWorkMinutesByShiftRule(date, clockInTime, clockOutTime) {
  if (!clockInTime || !clockOutTime) return 0;

  const shiftStart = roundClockIn(clockInTime);
  const shiftEnd = addHours(shiftStart, 9);
  const roundedOut = roundClockOut(clockOutTime);

  if (
    Number.isNaN(shiftStart.getTime()) ||
    Number.isNaN(roundedOut.getTime()) ||
    roundedOut <= shiftStart
  ) {
    return 0;
  }

  if (roundedOut >= shiftEnd) {
    return 8 * 60;
  }

  let minutes = (roundedOut - shiftStart) / 1000 / 60;

  const lunchStart = getDateTimeByTime(date, "12:00");
  const lunchEnd = getDateTimeByTime(date, "13:00");

  minutes -= calculateOverlapMinutes(shiftStart, roundedOut, lunchStart, lunchEnd);

  return Math.max(0, minutes);
}

function getShiftInfo(clockInTime) {
  if (!clockInTime) {
    return {
      shiftStart: null,
      shiftEnd: null,
      shiftStartText: "--",
      shiftEndText: "--",
    };
  }

  const shiftStart = roundClockIn(clockInTime);
  const shiftEnd = addHours(shiftStart, 9);

  return {
    shiftStart,
    shiftEnd,
    shiftStartText: formatTimeOnly(shiftStart),
    shiftEndText: formatTimeOnly(shiftEnd),
  };
}

const dailyRows = computed(() => {
  const byDate = {};
  const todayKey = getTodayString();

  records.value.forEach((record) => {
    const key = getDateKey(record.timestamp);
    if (!key) return;

    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(record);
  });

  return Object.entries(byDate)
    .map(([date, dayRecords]) => {
      const sorted = [...dayRecords].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      const firstIn = sorted.find((r) => isClockInAction(r.action));
      const lastOut = [...sorted].reverse().find((r) => isClockOutAction(r.action));

      const isToday = date === todayKey;

      let statusText = "出勤完成";
      let badgeClass = "bg-green-100 text-green-600";
      let note = "";
      let workMinutes = 0;

      const clockInSource = firstIn ? getRecordSourceText(firstIn) : "";
      const clockOutSource = lastOut ? getRecordSourceText(lastOut) : "";

      const shiftInfo = getShiftInfo(firstIn?.timestamp);

      if (firstIn && lastOut) {
        workMinutes = calculateWorkMinutesByShiftRule(date, firstIn.timestamp, lastOut.timestamp);

        const sourceNotes = [];

    

        if (clockInSource === "補打卡") sourceNotes.push("🛠 上班補卡");
        if (clockOutSource === "補打卡") sourceNotes.push("🛠 下班補卡");

        note = sourceNotes.join("，");
      } else if (isToday && firstIn && !lastOut) {
        const now = new Date();
        const shiftEnd = shiftInfo.shiftEnd;

        if (shiftEnd && now >= shiftEnd) {
          workMinutes = 8 * 60;
        } else {
          const diff = (normalizeToMinute(now) - roundToHalfHour(firstIn.timestamp)) / 1000 / 60;
          workMinutes = Math.max(0, Math.min(diff, 8 * 60));
        }

        statusText = "今日出勤中";
        badgeClass = "bg-blue-100 text-blue-700";
        note = `今天還沒下班，預計 ${shiftInfo.shiftEndText} 下班`;
      } else if (!firstIn && lastOut) {
        statusText = "缺少上班卡";
        badgeClass = "bg-red-100 text-red-600";
        note = "忘記打上班卡囉";
      } else if (firstIn && !lastOut) {
        statusText = "缺少下班卡";
        badgeClass = "bg-amber-100 text-amber-700";
        note = `忘記打下班卡囉`;
      } else {
        statusText = "資料異常";
        badgeClass = "bg-red-100 text-red-600";
        note = "這天沒有完整上下班紀錄";
      }

      return {
        date,
        dateText: formatDateOnly(sorted[0]?.timestamp),
        clockInTime: firstIn ? formatTimeOnly(firstIn.timestamp) : "--",
        clockOutTime: lastOut ? formatTimeOnly(lastOut.timestamp) : "--",
        shiftStartTime: shiftInfo.shiftStartText,
        shiftEndTime: shiftInfo.shiftEndText,
        workMinutes,
        workHoursText: formatMinutes(workMinutes),
        statusText,
        badgeClass,
        note,
        isAbnormal:
          statusText === "缺少上班卡" ||
          statusText === "缺少下班卡" ||
          statusText === "資料異常",
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const summary = computed(() => {
  const totalMinutes = dailyRows.value.reduce((sum, day) => {
    return sum + day.workMinutes;
  }, 0);

  const attendanceDays = dailyRows.value.filter((day) => {
    return day.clockInTime !== "--";
  }).length;

  const abnormalCount = dailyRows.value.filter((day) => day.isAbnormal).length;

  return {
    totalWorkHours: formatMinutes(totalMinutes),
    attendanceDays: `${attendanceDays} 天`,
    abnormalCount: `${abnormalCount} 天`,
  };
});

async function initLiff() {
  if (DEV_MODE) {
    user.value = {
      name: "測試使用者",
      userId: "DEV-MODE-USER",
    };
    return;
  }

  if (!window.liff) throw new Error("LIFF SDK 未載入");

  await window.liff.init({ liffId: LIFF_ID });

  if (!window.liff.isLoggedIn()) {
    window.liff.login();
    return;
  }

  const profile = await window.liff.getProfile();

  user.value = {
    name: profile.displayName || "已登入使用者",
    userId: profile.userId,
  };
}

async function fetchAttendance() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const params = new URLSearchParams({
      action: "myRecords",
      userId: user.value.userId,
      startDate: startDate.value,
      endDate: endDate.value,
    });

    const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`);
    const result = await response.json();

    if (!result.ok || !Array.isArray(result.records)) {
      throw new Error(result.message || "讀取失敗");
    }

    records.value = result.records;
  } catch (error) {
    errorMessage.value = error.message || "查詢失敗";
    records.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    await initLiff();
    await fetchAttendance();
  } catch (error) {
    errorMessage.value = error.message || "初始化失敗";
  }
});
</script>