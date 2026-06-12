<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useCanvasScale } from './composables/useScale';
import VueOfficeDocx from '@vue-office/docx';
import '@vue-office/docx/lib/index.css';
import {
  User, MessageSquare, Send, Camera, CloudRain, Crosshair,
  ClipboardList, Flag, FlaskConical, Cpu, UploadCloud, Lightbulb, Plane,
  ChevronsRight, ChevronDown, MapPin, Truck, Bot, X, Play, Home, Database
} from 'lucide-vue-next';
import LeafletMap from './components/LeafletMap.vue';
import img04 from '../04.png';

const navItems = [
  { label: "首页", icon: Home },
  { label: "实况监测", icon: Camera },
  { label: "云场预报", icon: CloudRain },
  { label: "跟踪指挥", icon: Crosshair },
  { label: "效果评估", icon: ClipboardList },
  { label: "重大活动", icon: Flag },
  { label: "科学试验", icon: FlaskConical },
  { label: "业务管理", icon: Cpu },
  { label: "决策辅助", icon: Lightbulb },
  { label: "个例库", icon: Database },
];

const { scale } = useCanvasScale(1920, 1080);
const activeNav = ref(0);
const activeSubNav = ref(0);
const subNavItems = ["作业需求", "产品制作", "效果评估", "飞行方案"];
const timeStr = ref("");

const prodSubNavItems = [
  "作业过程预报与作业展望",
  "作业潜力预报与作业计划",
  "作业条件预报与作业预案",
  "监测预警与方案设计"
];
const activeProdSubNav = ref(0);
const isCreatingReport = ref(false);
const isPreviewingReport = ref(false);
const previewReportUrl = ref("");

watch(activeProdSubNav, () => {
  isCreatingReport.value = false;
  isPreviewingReport.value = false;
});

const openPreview = (url: string) => {
  previewReportUrl.value = url;
  isPreviewingReport.value = true;
};

const closePreview = () => {
  isPreviewingReport.value = false;
  previewReportUrl.value = "";
};

const processForecastReports = [
  { id: 1, name: "2026年6月10日天津市人影作业过程预报和作业展望", time: "2026-06-10 10:00:00", operator: "王琪", issuer: "孙亦易" },
  { id: 2, name: "2026年6月10日天津市人影作业过程预报和作业展望", time: "2026-06-10 09:30:00", operator: "王琪", issuer: "孙亦易" },
  { id: 3, name: "2026年6月10日天津市人影作业过程预报和作业展望", time: "2026-06-10 08:15:00", operator: "王琪", issuer: "孙亦易" },
  { id: 4, name: "2026年6月9日天津市人影作业过程预报和作业展望", time: "2026-06-09 16:45:00", operator: "王琪", issuer: "孙亦易" },
  { id: 5, name: "2026年6月9日天津市人影作业过程预报和作业展望", time: "2026-06-09 11:20:00", operator: "王琪", issuer: "孙亦易" }
];

const reqLeftCards = [
  { title: "农业干旱气象综合监测", stats: [{label: "重度缺墒", val: "12%", color: "#ff4747"}, {label: "轻度缺墒", val: "21%", color: "#ffd047"}, {label: "适宜", val: "41%", color: "#47ff88"}, {label: "过湿", val: "26%", color: "#47b2ff"}] },
  { title: "10厘米土壤墒情", stats: [{label: "重度缺墒", val: "12%", color: "#ff4747"}, {label: "轻度缺墒", val: "21%", color: "#ffd047"}, {label: "适宜", val: "41%", color: "#47ff88"}, {label: "过湿", val: "26%", color: "#47b2ff"}] },
  { title: "大中型水库现状", stats: [{label: "重度缺水", val: "12%", color: "#ff4747"}, {label: "轻度缺水", val: "21%", color: "#ffd047"}, {label: "适宜", val: "41%", color: "#47ff88"}, {label: "过湿", val: "26%", color: "#47b2ff"}] }
];

const reqRightCards = [
  { title: "森林火险气象等级预报", stats: [{label: "极高危", val: "12%", color: "#ff4747"}, {label: "高危", val: "21%", color: "#ffd047"}, {label: "中度", val: "41%", color: "#47ff88"}, {label: "低危", val: "26%", color: "#47b2ff"}] },
  { title: "空气污染气象条件预报图", stats: [{label: "重度污染", val: "12%", color: "#ff4747"}, {label: "中度污染", val: "21%", color: "#ffd047"}, {label: "良", val: "41%", color: "#47ff88"}, {label: "优", val: "26%", color: "#47b2ff"}] },
  { title: "湿地保护增雨需求", stats: [{label: "极度需求", val: "12%", color: "#ff4747"}, {label: "重度需求", val: "21%", color: "#ffd047"}, {label: "中度需求", val: "41%", color: "#47ff88"}, {label: "适宜", val: "26%", color: "#47b2ff"}] }
];

const activeSeven = ref(0);
const seventhItems = [
  { label: "过程展望", current: 3, total: 15 },
  { label: "潜力计划", current: 5, total: 20 },
  { label: "条件预案", current: 4, total: 12 },
  { label: "监测预警", current: 8, total: 30 },
  { label: "跟踪指挥", current: 6, total: 10 },
  { label: "信息上报", current: 15, total: 40 },
  { label: "效果评估", current: 2, total: 5 }
];

const tianjinDistricts = ["和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "滨海新区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "宁河区", "静海区", "蓟州区"];
const selectedDistrict = ref("和平区");
const selectedSite = ref("site1");

const isViewingReportDocx = ref(false);

const demandSubNavItemLabels = ["墒情", "气象干旱", "空气污染", "森林火险"];
const activeDemandSubNav = ref(0);

const statsTimeRange = ref("1d");
const operationTypeStats = [
  { label: "飞机", val: 5, color: "#00d0ff" },
  { label: "烟炉", val: 12, color: "#ffd047" },
  { label: "火箭", val: 28, color: "#ff4747" },
  { label: "高炮", val: 45, color: "#2dcc5f" },
  { label: "燃气炮", val: 18, color: "#b870ff" }
];

const groundOpStats = [
  { label: "增雨", val: 62220, percent: 60, color: "#00d0ff" },
  { label: "防雹", val: 51000, percent: 25, color: "#2dcc5f" },
  { label: "其他", val: 16220, percent: 15, color: "#ff9100" }
];

const aircraftOpStats = [
  { label: "增雨", val: 3200, percent: 50, color: "#00d0ff" },
  { label: "探测", val: 1800, percent: 30, color: "#2dcc5f" },
  { label: "其他", val: 1200, percent: 20, color: "#ff9100" }
];

const ammoInventoryStats = [
  { district: "滨海新区", rockets: 128, shells: 540 },
  { district: "蓟州区", rockets: 85, shells: 320 },
  { district: "武清区", rockets: 96, shells: 410 },
  { district: "宝坻区", rockets: 72, shells: 280 },
  { district: "静海区", rockets: 64, shells: 195 },
  { district: "宁河区", rockets: 45, shells: 160 },
  { district: "西青区", rockets: 38, shells: 142 },
  { district: "津南区", rockets: 32, shells: 118 },
  { district: "北辰区", rockets: 25, shells: 95 }
];

const benefitData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  waterAmount: Math.floor(Math.random() * 30) + 10, // 0-50 亿吨
  influenceArea: Math.floor(Math.random() * 1500) + 2500, // 0-5000 万平方公里
  protectionArea: Math.floor(Math.random() * 1000) + 1500 // 0-5000 万平方公里
}));

const demandStats = [
  { 
    title: "海河流域土壤墒情", 
    img: "/01.png",
    stats: [
      { label: "重度缺墒", val: "12", color: "#ff4747" },
      { label: "轻度缺墒", val: "21", color: "#ffd047" },
      { label: "适宜", val: "41", color: "#2dcc5f" },
      { label: "过湿", val: "26", color: "#00d0ff" }
    ]
  },
  { 
    title: "天津市气象干旱", 
    img: "/01.png",
    stats: [
      { label: "特旱", val: "5", color: "#ff4747" },
      { label: "重旱", val: "15", color: "#ffd047" },
      { label: "中旱", val: "30", color: "#2dcc5f" },
      { label: "无旱", val: "50", color: "#00d0ff" }
    ]
  },
  { 
    title: "空气污染扩散条件", 
    img: "/01.png",
    stats: [
      { label: "极差", val: "10", color: "#ff4747" },
      { label: "较差", val: "20", color: "#ffd047" },
      { label: "一般", val: "40", color: "#2dcc5f" },
      { label: "良好", val: "30", color: "#00d0ff" }
    ]
  },
  { 
    title: "森林火险等级", 
    img: "/01.png",
    stats: [
      { label: "极高", val: "8", color: "#ff4747" },
      { label: "较高", val: "18", color: "#ffd047" },
      { label: "中等", val: "45", color: "#2dcc5f" },
      { label: "较低", val: "29", color: "#00d0ff" }
    ]
  }
];

const showFixedPoints = ref(true);
const showMobilePoints = ref(true);
const showPersonnel = ref(true);

const isOperationExpanded = ref(true);
const isProductExpanded = ref(true);

const isAnyOverlayActive = computed(() => {
  return overlayOptions.value.radar || overlayOptions.value.satellite || overlayOptions.value.rainfall;
});

const activeOverlayLabel = computed(() => {
  if (overlayOptions.value.radar) return '雷达回波 (dBZ)';
  if (overlayOptions.value.satellite) return '卫星云图 (TBB)';
  if (overlayOptions.value.rainfall) return '雨量实况 (mm)';
  return '';
});

const timelineSteps = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const selectedTimeIndex = ref(timelineSteps.length - 1);

const overlayOptions = ref({
  satellite: false,
  radar: true,
  rainfall: false,
  flightPath: false
});

const isChatOpen = ref(false);
const isTyping = ref(false);
const userInput = ref("");
const chatMessages = ref([
  { role: 'model', text: '你好！我是系统智能助手。你可以询问我关于人影作业、气象情况或系统操作的问题。' }
]);

const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return;
  
  const userText = userInput.value;
  chatMessages.value.push({ role: 'user', text: userText });
  userInput.value = "";
  isTyping.value = true;

  try {
    const history = chatMessages.value.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, history })
    });

    const data = await response.json();
    if (data.text) {
      chatMessages.value.push({ role: 'model', text: data.text });
    } else {
      chatMessages.value.push({ role: 'model', text: '抱歉，系统暂时无法响应，请稍后再试。' });
    }
  } catch (error) {
    console.error("Chat Error:", error);
    chatMessages.value.push({ role: 'model', text: '网络连接异常，请检查网络设置。' });
  } finally {
    isTyping.value = false;
  }
};

const updateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
  const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const week = weeks[now.getDay()];
  const time = now.toLocaleTimeString('zh-CN', { hour12: false });
  timeStr.value = `${date} ${week} ${time}`;
};

let timer: number;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000) as unknown as number;
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="w-screen h-screen bg-[#02050f] overflow-hidden relative font-sans">
    <div
      class="absolute left-1/2 top-1/2 flex flex-col justify-between overflow-hidden shadow-[0_0_50px_rgba(0,163,255,0.1)] transition-transform ease-out"
      :style="{
        width: '1920px',
        height: '1080px',
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center center',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0c1a3b 0%, #030612 100%)',
        color: '#e0f2fe'
      }"
    >
      <!-- Header -->
      <header v-if="activeNav === 0" class="h-[90px] flex-shrink-0 w-full flex items-start justify-between px-8 pt-4 relative z-10">
        <div class="absolute top-0 left-0 w-full h-[150px] bg-[linear-gradient(to_bottom,rgba(11,33,76,0.8)_0%,transparent_100%)] pointer-events-none" />
        
        <div class="flex flex-col space-y-1 relative z-10 w-[400px]">
          <div class="text-[#a5d8ff] tracking-wide font-light text-lg">{{ timeStr }}</div>
          <div class="text-sm text-[#7aa7d6] flex gap-4">
            <span>值班领导: xx</span>
            <span>主岗: xx</span>
            <span>加强岗: xx</span>
          </div>
        </div>

        <div class="relative z-10 flex-1 flex justify-center -mt-2">
          <h1 class="text-5xl font-bold tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#7dc5ff]" style="text-shadow: 0 4px 10px rgba(0, 163, 255, 0.4)">
            国省一体化平台
          </h1>
        </div>

        <div class="flex items-center space-x-6 relative z-10 text-[17px] text-[#a5d8ff] w-[400px] justify-end pt-1">
          <button class="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
            <User :size="18" />
            <span>登陆用户</span>
          </button>
          <button class="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
            <MessageSquare :size="18" />
            <span>消息</span>
          </button>
          <button class="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
            <Send :size="18" />
            <span>发布</span>
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 flex relative z-10 overflow-hidden w-full h-full" :class="activeNav === 0 ? 'px-8 gap-4 pb-[90px] mt-2' : 'pb-[86px] bg-[#071633]'">
        <!-- Main Dashboard View (Default - Home) -->
        <template v-if="activeNav === 0">
          <section class="w-[503px] flex flex-col gap-5 shrink-0 h-full">
            <div class="card flex-[0.8] flex flex-col p-4">
              <div class="flex justify-between items-center mb-4">
                <div class="text-lg font-medium tracking-wide text-[#5bc0ff]">作业信息统计</div>
                <div class="flex items-center gap-1 relative">
                  <select v-model="statsTimeRange" class="bg-[#0a234a]/60 border border-[#275b8c] text-[#a5d8ff] text-[11px] pl-2 pr-6 py-0.5 rounded outline-none cursor-pointer appearance-none min-w-[80px] shadow-[inset_0_0_5px_rgba(0,208,255,0.1)] hover:border-[#00d0ff]/50 transition-colors">
                    <option value="1d">1天</option>
                    <option value="7d">7天</option>
                    <option value="1m">1个月</option>
                    <option value="6m">半年</option>
                  </select>
                  <ChevronDown class="absolute right-1 text-[#a5d8ff]/60 pointer-events-none" :size="12" />
                </div>
              </div>
              <div class="flex-1 flex items-center justify-between px-1 pb-2">
                <div v-for="(item, idx) in operationTypeStats" :key="idx" class="flex flex-col items-center flex-1 group">
                  <!-- Number on Top -->
                  <span class="text-2xl font-bold font-mono tracking-tight transition-all duration-300 group-hover:scale-110 mb-1" :style="{ color: item.color, textShadow: `0 0 15px ${item.color}60` }">
                    {{ item.val }}
                  </span>

                  <!-- Icon Section with Pedestal Area -->
                  <div class="relative w-20 h-14 flex items-center justify-center mb-1">
                     <!-- Pedestal Glow -->
                     <div class="absolute bottom-1 w-16 h-4 bg-gradient-to-t from-transparent via-current to-transparent opacity-20 rounded-[50%] blur-md transition-all duration-500 group-hover:opacity-40 group-hover:scale-110" :style="{ color: item.color }"></div>
                     <div class="absolute bottom-2 w-12 h-1 bg-current opacity-30 rounded-[50%] blur-[2px]" :style="{ color: item.color }"></div>
                     
                     <!-- Enlarged Floating Icon (03.png) -->
                     <div class="w-11 h-11 relative z-10 transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1" :style="{ 
                       maskImage: 'url(/03.png)', 
                       maskSize: 'contain', 
                       maskRepeat: 'no-repeat', 
                       maskPosition: 'center', 
                       backgroundColor: item.color, 
                       '-webkit-mask-image': 'url(/03.png)', 
                       '-webkit-mask-size': 'contain', 
                       '-webkit-mask-repeat': 'no-repeat', 
                       '-webkit-mask-position': 'center',
                       filter: `drop-shadow(0 0 8px ${item.color})`
                     }"></div>
                  </div>
                  
                  <!-- Label at Bottom -->
                  <span class="text-sm font-medium text-[#a5d8ff] tracking-[0.1em] transition-all duration-300 group-hover:text-white">{{ item.label }}</span>
                </div>
              </div>
            </div>
            <div class="card flex-[0.75] flex flex-col p-4 overflow-hidden">
              <div class="flex-1 flex overflow-hidden">
                <!-- Left: Ground Operation Proportion Chart -->
                <div class="flex-1 flex flex-col pr-2 relative">
                  <div class="text-[14px] font-medium tracking-wide text-[#5bc0ff] mb-2 flex items-center gap-2">
                     <span class="text-[#00d0ff] text-[10px]">▶</span>
                     <span>地面作业比例</span>
                  </div>
                  <div class="flex-1 flex items-center justify-between">
                    <!-- Donut Chart -->
                    <div class="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(0,163,255,0.15)] relative z-10">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#1c3a61" stroke-width="10" opacity="0.3" />
                        <!-- Blue Segment (60%) -->
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#00d0ff" stroke-width="10" 
                                stroke-dasharray="150.8 251.3" 
                                stroke-dashoffset="0" 
                                stroke-linecap="butt" />
                        <!-- Green Segment (25%) -->
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#2dcc5f" stroke-width="10" 
                                stroke-dasharray="62.8 251.3" 
                                stroke-dashoffset="-150.8" 
                                stroke-linecap="butt" />
                        <!-- Orange Segment (15%) -->
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#ff9100" stroke-width="10" 
                                stroke-dasharray="37.7 251.3" 
                                stroke-dashoffset="-213.6" 
                                stroke-linecap="butt" />
                      </svg>
                      <!-- Polylines Overlay -->
                      <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full pointer-events-none z-20">
                         <!-- 60% Blue -->
                         <polyline points="75,25 85,15 95,15" fill="none" stroke="#00d0ff" stroke-width="1" opacity="0.6" />
                         <!-- 25% Green -->
                         <polyline points="25,25 15,15 5,15" fill="none" stroke="#2dcc5f" stroke-width="1" opacity="0.6" />
                         <!-- 15% Orange -->
                         <polyline points="25,75 15,85 5,85" fill="none" stroke="#ff9100" stroke-width="1" opacity="0.6" />
                      </svg>
                      <!-- Percentage Labels -->
                      <div class="absolute inset-0 pointer-events-none text-[8px] font-mono z-30">
                         <div class="absolute top-[8%] right-[-2%] text-[#00d0ff]">60%</div>
                         <div class="absolute top-[8%] left-[-2%] text-[#2dcc5f]">25%</div>
                         <div class="absolute bottom-[8%] left-[-2%] text-[#ff9100]">15%</div>
                      </div>
                      <div class="absolute flex flex-col items-center justify-center">
                        <div class="w-14 h-14 rounded-full bg-[#050b1c] border border-[#275b8c]/30 shadow-[inset_0_0_15px_rgba(45,122,212,0.2)]"></div>
                      </div>
                    </div>
                    <!-- Legend -->
                    <div class="flex flex-col gap-2 flex-1 ml-4 justify-center">
                       <div v-for="item in groundOpStats" :key="item.label" class="flex flex-col group">
                          <div class="flex items-center gap-2">
                            <div class="w-1 h-1 rounded-full" :style="{ backgroundColor: item.color }"></div>
                            <span class="text-[10px] text-[#a5d8ff]/70">{{ item.label }}</span>
                          </div>
                          <span class="text-xs font-bold font-mono text-white pl-3 group-hover:text-[#00d0ff] transition-colors">{{ item.val }}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <!-- Vertical Divider -->
                <div class="w-[1px] h-full bg-gradient-to-b from-transparent via-[#275b8c]/40 to-transparent"></div>

                <!-- Right: Aircraft Operation Proportion Chart -->
                <div class="flex-1 flex flex-col pl-4 relative">
                   <div class="text-[14px] font-medium tracking-wide text-[#5bc0ff] mb-2 flex items-center gap-2">
                      <span class="text-[#00d0ff] text-[10px]">▶</span>
                      <span>飞机作业比例</span>
                   </div>
                   <div class="flex-1 flex items-center justify-between">
                     <!-- Donut Chart -->
                     <div class="relative w-28 h-28 flex items-center justify-center shrink-0">
                       <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(0,163,255,0.15)] relative z-10">
                         <circle cx="50" cy="50" r="40" fill="none" stroke="#1c3a61" stroke-width="10" opacity="0.3" />
                         <!-- Blue Segment (50%) -->
                         <circle cx="50" cy="50" r="40" fill="none" stroke="#00d0ff" stroke-width="10" 
                                 stroke-dasharray="125.7 251.3" 
                                 stroke-dashoffset="0" 
                                 stroke-linecap="butt" />
                         <!-- Green Segment (30%) -->
                         <circle cx="50" cy="50" r="40" fill="none" stroke="#2dcc5f" stroke-width="10" 
                                 stroke-dasharray="75.4 251.3" 
                                 stroke-dashoffset="-125.7" 
                                 stroke-linecap="butt" />
                         <!-- Orange Segment (20%) -->
                         <circle cx="50" cy="50" r="40" fill="none" stroke="#ff9100" stroke-width="10" 
                                 stroke-dasharray="50.2 251.3" 
                                 stroke-dashoffset="-201.1" 
                                 stroke-linecap="butt" />
                       </svg>
                       <!-- Polylines Overlay -->
                       <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full pointer-events-none z-20">
                          <!-- 50% Blue -->
                          <polyline points="80,35 90,25 98,25" fill="none" stroke="#00d0ff" stroke-width="1" opacity="0.6" />
                          <!-- 30% Green -->
                          <polyline points="30,25 20,15 5,15" fill="none" stroke="#2dcc5f" stroke-width="1" opacity="0.6" />
                          <!-- 20% Orange -->
                          <polyline points="25,75 15,85 5,85" fill="none" stroke="#ff9100" stroke-width="1" opacity="0.6" />
                       </svg>
                       <!-- Percentage Labels -->
                       <div class="absolute inset-0 pointer-events-none text-[8px] font-mono z-30">
                          <div class="absolute top-[18%] right-[-4%] text-[#00d0ff]">50%</div>
                          <div class="absolute top-[8%] left-[-2%] text-[#2dcc5f]">30%</div>
                          <div class="absolute bottom-[8%] left-[-2%] text-[#ff9100]">20%</div>
                       </div>
                       <div class="absolute flex flex-col items-center justify-center">
                         <div class="w-14 h-14 rounded-full bg-[#050b1c] border border-[#275b8c]/30 shadow-[inset_0_0_15px_rgba(45,122,212,0.2)]"></div>
                       </div>
                     </div>
                     <!-- Legend -->
                     <div class="flex flex-col gap-2 flex-1 ml-4 justify-center">
                        <div v-for="item in aircraftOpStats" :key="item.label" class="flex flex-col group">
                           <div class="flex items-center gap-2">
                             <div class="w-1 h-1 rounded-full" :style="{ backgroundColor: item.color }"></div>
                             <span class="text-[10px] text-[#a5d8ff]/70">{{ item.label }}</span>
                           </div>
                           <span class="text-xs font-bold font-mono text-white pl-3 group-hover:text-[#00d0ff] transition-colors">{{ item.val }}</span>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
            <div class="card flex-1 flex flex-col p-4 overflow-hidden">
              <div class="text-lg font-medium tracking-wide text-[#5bc0ff] mb-2 flex justify-between items-center">
                <div class="flex items-center gap-2">
                   <div class="w-1 h-4 bg-[#5bc0ff] shadow-[0_0_8px_#5bc0ff]"></div>
                   <span>弹药库存统计</span>
                </div>
                <!-- Legend -->
                <div class="flex gap-4 text-[10px] items-center">
                   <div class="flex items-center gap-1.5">
                      <div class="w-2 h-2 rounded-sm bg-[#ff9100]"></div>
                      <span class="text-[#a5d8ff]/60">火箭弹</span>
                   </div>
                   <div class="flex items-center gap-1.5">
                      <div class="w-2 h-2 rounded-sm bg-[#00d0ff]"></div>
                      <span class="text-[#a5d8ff]/60">高炮炮弹</span>
                   </div>
                </div>
              </div>

              <!-- Vertical Histogram Container -->
              <div class="flex-1 relative mt-4 mb-2 flex flex-col">
                <!-- Y-Axis Grid Lines -->
                <div class="absolute inset-0 flex flex-col justify-between pointer-events-none border-l border-b border-[#1f4770]/40">
                   <div v-for="i in 5" :key="i" class="w-full border-t border-dashed border-[#1f4770]/20 relative">
                      <span class="absolute -left-6 -top-2 text-[9px] font-mono text-[#31577d]">{{ (5-i+1) * 150 }}</span>
                   </div>
                   <div class="w-full relative"><span class="absolute -left-6 -top-2 text-[9px] font-mono text-[#31577d]">0</span></div>
                </div>

                <!-- Bars Area -->
                <div class="flex-1 flex items-end justify-around px-2 relative z-10">
                   <div v-for="item in ammoInventoryStats" :key="item.district" class="flex flex-col items-center flex-1 h-full group">
                      <div class="flex-1 w-full flex items-end justify-center gap-1 px-1">
                         <!-- Rockets Bar -->
                         <div class="relative w-2.5 bg-gradient-to-t from-[#ff9100]/20 via-[#ff9100]/60 to-[#ff9100] rounded-t-sm transition-all duration-1000 ease-out group-hover:brightness-125" 
                              :style="{ height: (item.rockets / 750 * 100) + '%' }">
                            <span class="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-[#ff9100] scale-90 opacity-0 group-hover:opacity-100 transition-opacity">{{ item.rockets }}</span>
                         </div>
                         <!-- Shells Bar -->
                         <div class="relative w-2.5 bg-gradient-to-t from-[#00d0ff]/20 via-[#00d0ff]/60 to-[#00d0ff] rounded-t-sm transition-all duration-1000 ease-out group-hover:brightness-125" 
                              :style="{ height: (item.shells / 750 * 100) + '%' }">
                            <span class="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-[#00d0ff] scale-90 opacity-0 group-hover:opacity-100 transition-opacity">{{ item.shells }}</span>
                         </div>
                      </div>
                      <!-- Label -->
                      <div class="mt-2 text-[10px] text-[#a5d8ff]/60 whitespace-nowrap transform rotate-[-25deg] origin-top-left translate-x-1">{{ item.district }}</div>
                   </div>
                </div>
              </div>
            </div>
            <div class="card flex-1 flex flex-col p-4 overflow-hidden">
              <div class="text-lg font-medium tracking-wide text-[#5bc0ff] mb-2 flex justify-between items-center">
                <div class="flex items-center gap-2">
                   <div class="w-1 h-4 bg-[#5bc0ff] shadow-[0_0_8px_#5bc0ff]"></div>
                   <span>作业效益统计</span>
                </div>
                <!-- Legend -->
                <div class="flex gap-4 text-[10px] items-center">
                   <div class="flex items-center gap-1.5">
                      <div class="w-2.5 h-0.5 bg-[#ff9100]"></div>
                      <span class="text-[#a5d8ff]/70">影响面积</span>
                   </div>
                   <div class="flex items-center gap-1.5">
                      <div class="w-2.5 h-0.5 bg-[#2dcc5f]"></div>
                      <span class="text-[#a5d8ff]/70">保护面积</span>
                   </div>
                   <div class="flex items-center gap-1.5">
                      <div class="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-[#00d0ff]/40 to-[#00d0ff]"></div>
                      <span class="text-[#a5d8ff]/70">增雨量</span>
                   </div>
                </div>
              </div>
              
              <div class="flex-1 relative mt-10 mb-8 mx-2">
                <!-- Dual Axis and Grid -->
                <div class="absolute inset-x-0 inset-y-0 pointer-events-none border-l border-r border-b border-[#1f4770]/50">
                   <!-- Horizontal Grid Lines & Ticks -->
                   <div v-for="i in 6" :key="i" class="absolute w-full border-t border-[#1f4770]/20" :style="{ top: ((i-1) * 20) + '%' }">
                      <!-- Left Axis (Water: 0-50 Unit: 亿吨) -->
                      <div class="absolute -left-12 -top-2 flex items-center">
                        <span class="text-[10px] font-mono text-[#4da8ff] w-8 text-right">{{ (6-i) * 10 }}</span>
                        <div class="w-1 h-[1px] bg-[#1f4770]/50 ml-1"></div>
                      </div>
                      
                      <!-- Right Axis (Area: 0-5000 Unit: 万km²) -->
                      <div class="absolute -right-12 -top-2 flex items-center">
                        <div class="w-1 h-[1px] bg-[#1f4770]/50 mr-1"></div>
                        <span class="text-[10px] font-mono text-[#a5d8ff]/60 w-10 text-left">{{ (6-i) * 1000 }}</span>
                      </div>
                   </div>
                   
                   <!-- Axis Titles -->
                   <div class="absolute -top-7 -left-10 text-[9px] font-medium text-[#5bc0ff]/40 px-1 border-l border-[#5bc0ff]/20">单位: 亿吨</div>
                   <div class="absolute -top-7 -right-11 text-[9px] font-medium text-[#5bc0ff]/40 px-1 border-r border-[#5bc0ff]/20 text-right">单位: 万km²</div>
                </div>

                <!-- Mixed Chart Area -->
                <div class="absolute inset-0 flex items-end justify-between px-0">
                   <!-- Bar Chart: Water Amount -->
                   <div v-for="(item, idx) in benefitData" :key="'bar-'+idx" class="flex-1 flex items-end justify-center h-full group z-10 transition-all duration-300">
                      <div class="w-[40%] max-w-[4px] bg-gradient-to-t from-[#00d0ff]/10 via-[#00d0ff]/50 to-[#00d0ff] rounded-t-[1px] transition-all hover:brightness-150 relative group-hover:w-[60%]" 
                           :style="{ height: (item.waterAmount / 50 * 100) + '%' }">
                         <!-- Tooltip on hover -->
                         <div class="absolute -top-5 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-[#0a234a] border border-[#00d0ff]/30 text-[8px] font-mono text-[#00d0ff] opacity-0 group-hover:opacity-100 whitespace-nowrap rounded shadow-lg z-30 pointer-events-none">
                            {{ item.waterAmount }}
                         </div>
                      </div>
                   </div>
                   
                   <!-- SVG Overlay for continuous data lines -->
                   <svg class="absolute inset-0 w-full h-full pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="inflAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#ff9100" stop-opacity="0.15" />
                          <stop offset="100%" stop-color="#ff9100" stop-opacity="0" />
                        </linearGradient>
                      </defs>
                      
                      <!-- Area Fill for Influence Area -->
                      <path :d="`M 0,${100 - (benefitData[0].influenceArea / 5000 * 100)} ` + benefitData.map((d, i) => `L ${(i / (benefitData.length - 1)) * 100},${100 - (d.influenceArea / 5000 * 100)}`).join(' ') + ` L 100,100 L 0,100 Z`" 
                            fill="url(#inflAreaGrad)" />

                      <!-- Line 1: Influence Area (Orange) -->
                      <path :d="`M 0,${100 - (benefitData[0].influenceArea / 5000 * 100)} ` + benefitData.map((d, i) => `L ${(i / (benefitData.length - 1)) * 100},${100 - (d.influenceArea / 5000 * 100)}`).join(' ')" 
                            fill="none" stroke="#ff9100" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />

                      <!-- Line 2: Protection Area (Green) -->
                      <path :d="`M 0,${100 - (benefitData[0].protectionArea / 5000 * 100)} ` + benefitData.map((d, i) => `L ${(i / (benefitData.length - 1)) * 100},${100 - (d.protectionArea / 5000 * 100)}`).join(' ')" 
                            fill="none" stroke="#2dcc5f" stroke-width="1" stroke-dasharray="2,2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8" />
                   </svg>
                </div>
              </div>
            </div>
          </section>

          <!-- Center Main Area -->
          <section class="flex-1 flex flex-col h-full overflow-hidden">
             <div class="card flex-1 p-0.5 bg-[#050b1c]/80 flex flex-col overflow-hidden relative border border-[#2d7ad4]/30 shadow-[inset_0_0_30px_rgba(45,122,212,0.1)]">
                <div class="w-full h-full relative overflow-hidden rounded-[2px]">
                   <LeafletMap :show-fixed="showFixedPoints" :show-mobile="showMobilePoints" :show-personnel="showPersonnel" :overlays="overlayOptions" />
                   
                   <!-- AI Assistant Icon (Top-Right) -->
                   <button 
                     @click="isChatOpen = !isChatOpen"
                     class="absolute top-6 right-6 w-16 h-16 z-[501] flex items-center justify-center rounded-full bg-[#00d0ff]/30 border-2 border-[#00d0ff] shadow-[0_0_30px_rgba(0,208,255,0.5)] hover:scale-105 hover:bg-[#00d0ff]/40 transition-all cursor-pointer group p-1.5 backdrop-blur-md"
                   >
                     <div class="absolute inset-0 rounded-full animate-pulse bg-[#00d0ff]/20"></div>
                     <div class="w-full h-full rounded-full overflow-hidden bg-white/20 p-0.5 ring-2 ring-[#00d0ff]/50 shadow-[0_0_15px_rgba(0,208,255,0.4)]">
                        <img src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Coby&backgroundColor=b6e3f4" alt="AI Avatar" class="w-full h-full rounded-full object-cover" />
                     </div>
                   </button>

                   <!-- AI Chat Dialog -->
                   <div v-if="isChatOpen" class="absolute top-24 right-6 w-[350px] h-[520px] z-[502] flex flex-col bg-[#050b1c]/95 border border-[#00d0ff]/30 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                      <!-- Chat Header -->
                      <div class="p-4 border-b border-[#00d0ff]/20 flex items-center justify-between bg-gradient-to-r from-[#0a234a] to-transparent">
                         <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-[#00d0ff]/20 flex items-center justify-center border border-[#00d0ff]/40 overflow-hidden">
                               <img src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Coby&backgroundColor=b6e3f4" alt="AI Avatar" class="w-full h-full object-cover" />
                            </div>
                            <span class="text-sm font-bold text-[#a5d8ff] tracking-widest">小影</span>
                         </div>
                         <button @click="isChatOpen = false" class="text-[#a5d8ff]/60 hover:text-white transition-colors">
                           <X :size="18" />
                         </button>
                      </div>

                      <!-- Chat Content -->
                      <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                         <div v-for="(msg, i) in chatMessages" :key="i" class="flex flex-col" :class="msg.role === 'user' ? 'items-end' : 'items-start'">
                            <div class="max-w-[85%] px-3 py-2 rounded-lg text-sm" :class="msg.role === 'user' ? 'bg-[#00d0ff]/20 text-white border border-[#00d0ff]/30 rounded-tr-none' : 'bg-[#1a3a61]/40 text-[#d0e8ff] border border-[#2d7ad4]/30 rounded-tl-none'">
                               {{ msg.text }}
                            </div>
                         </div>
                         <div v-if="isTyping" class="flex items-start">
                            <div class="bg-[#1a3a61]/40 px-3 py-2 rounded-lg rounded-tl-none border border-[#2d7ad4]/30">
                               <div class="flex gap-1">
                                  <div class="w-1.5 h-1.5 bg-[#00d0ff] rounded-full animate-bounce"></div>
                                  <div class="w-1.5 h-1.5 bg-[#00d0ff] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                  <div class="w-1.5 h-1.5 bg-[#00d0ff] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <!-- Chat Input -->
                      <div class="p-4 border-t border-[#00d0ff]/20 bg-[#0a234a]/40">
                         <form @submit.prevent="sendMessage" class="flex gap-2">
                            <input 
                              v-model="userInput" 
                              type="text" 
                              placeholder="请输入您的问题..." 
                              class="flex-1 bg-[#050b1c] border border-[#275b8c] rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00d0ff] transition-colors"
                            />
                            <button 
                              type="submit" 
                              :disabled="!userInput.trim() || isTyping"
                              class="w-10 h-9 flex items-center justify-center rounded bg-[#00d0ff] text-[#050b1c] disabled:opacity-50 disabled:grayscale transition-all hover:brightness-110 active:scale-95 shadow-[0_0_15px_rgba(0,208,255,0.4)]"
                            >
                               <Send :size="18" />
                            </button>
                         </form>
                      </div>
                   </div>

                   <!-- Left Side Map Controls Stack -->
                   <div class="absolute top-6 left-6 flex flex-col gap-4 z-[500]">
                      <!-- Top-Left Map Controls -->
                      <div class="w-[180px] p-4 backdrop-blur-md border border-[#2d7ad4]/30 rounded-sm overflow-hidden" style="background: linear-gradient(135deg, rgba(10, 35, 79, 0.9), rgba(3, 13, 36, 0.9)); box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                         <!-- Header -->
                         <div @click="isOperationExpanded = !isOperationExpanded" class="flex items-center justify-between mb-2 cursor-pointer group/header">
                            <div class="flex items-center gap-2">
                               <div class="w-1.5 h-3 bg-[#5bc0ff] shadow-[0_0_8px_#5bc0ff]"></div>
                               <span class="text-[#a5d8ff] text-[13px] font-bold tracking-wider group-hover/header:text-white transition-colors">作业点类型</span>
                            </div>
                            <ChevronDown :size="14" class="text-[#a5d8ff]/60 transition-transform duration-300" :class="{ '-rotate-90': !isOperationExpanded }" />
                         </div>
                         
                         <div v-show="isOperationExpanded" class="animate-in slide-in-from-top-1 duration-300">
                            <div class="h-[1px] w-full bg-gradient-to-r from-[#2d7ad4]/40 to-transparent mb-3"></div>
                            
                            <!-- Operation Point types -->
                            <div class="mb-4">
                               <div class="flex flex-col gap-3 px-1">
                                  <label class="flex items-center gap-3 cursor-pointer group">
                                     <div class="relative flex items-center justify-center">
                                        <input type="checkbox" v-model="showFixedPoints" class="peer appearance-none w-3.5 h-3.5 border border-[#00d0ff] rounded-sm bg-[#00d0ff]/10 checked:bg-[#00d0ff]/40 transition-all" />
                                        <div class="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[#00d0ff] opacity-0 peer-checked:opacity-100 pointer-events-none">
                                           <div class="w-1.5 h-1.5 bg-[#00d0ff] shadow-[0_0_5px_#00d0ff]"></div>
                                        </div>
                                     </div>
                                     <div class="w-6 h-6 rounded bg-[#00d0ff]/10 border border-[#00d0ff]/30 flex items-center justify-center shadow-[0_0_10px_rgba(0,208,255,0.1)] group-hover:bg-[#00d0ff]/20 transition-colors">
                                        <MapPin :size="14" class="text-[#00d0ff] drop-shadow-[0_0_3px_#00d0ff]" />
                                     </div>
                                     <span class="text-[11px] text-[#a5d8ff] group-hover:text-white transition-colors">固定作业点</span>
                                  </label>
                                  <label class="flex items-center gap-3 cursor-pointer group">
                                     <div class="relative flex items-center justify-center">
                                        <input type="checkbox" v-model="showMobilePoints" class="peer appearance-none w-3.5 h-3.5 border border-[#2dcc5f] rounded-sm bg-[#2dcc5f]/10 checked:bg-[#2dcc5f]/40 transition-all" />
                                        <div class="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[#2dcc5f] opacity-0 peer-checked:opacity-100 pointer-events-none">
                                           <div class="w-1.5 h-1.5 bg-[#2dcc5f] shadow-[0_0_5px_#2dcc5f]"></div>
                                        </div>
                                     </div>
                                     <div class="w-6 h-6 rounded bg-[#2dcc5f]/10 border border-[#2dcc5f]/30 flex items-center justify-center shadow-[0_0_10px_rgba(45,204,95,0.1)] group-hover:bg-[#2dcc5f]/20 transition-colors">
                                        <Truck :size="14" class="text-[#2dcc5f] drop-shadow-[0_0_3px_#2dcc5f]" />
                                     </div>
                                     <span class="text-[11px] text-[#a5d8ff] group-hover:text-white transition-colors">移动作业点</span>
                                  </label>
                               </div>
                            </div>

                            <!-- Equipment selection -->
                            <div class="mb-4">
                               <div class="flex items-center gap-2 mb-2">
                                  <div class="w-1.5 h-3 bg-[#5bc0ff] shadow-[0_0_8px_#5bc0ff]"></div>
                                  <span class="text-[#a5d8ff] text-[13px] font-bold tracking-wider">装备</span>
                               </div>
                               <div class="h-[1px] w-full bg-gradient-to-r from-[#2d7ad4]/40 to-transparent mb-3"></div>
                               <div class="grid grid-cols-2 gap-y-3 px-1">
                                  <label class="flex items-center gap-2 cursor-pointer group">
                                     <div class="relative flex items-center justify-center">
                                        <input type="checkbox" class="peer appearance-none w-3 h-3 border border-[#00d0ff]/60 rounded-sm bg-[#00d0ff]/5 checked:bg-[#00d0ff]/30 transition-all" />
                                        <div class="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[#00d0ff] opacity-0 peer-checked:opacity-100 pointer-events-none"><div class="w-1 h-1 bg-[#00d0ff]"></div></div>
                                     </div>
                                     <span class="text-[11px] text-[#a5d8ff]/80 group-hover:text-white">火箭</span>
                                  </label>
                                  <label class="flex items-center gap-2 cursor-pointer group">
                                     <div class="relative flex items-center justify-center">
                                        <input type="checkbox" class="peer appearance-none w-3 h-3 border border-[#00d0ff]/60 rounded-sm bg-[#00d0ff]/5 checked:bg-[#00d0ff]/30 transition-all" />
                                        <div class="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[#00d0ff] opacity-0 peer-checked:opacity-100 pointer-events-none"><div class="w-1 h-1 bg-[#00d0ff]"></div></div>
                                     </div>
                                     <span class="text-[11px] text-[#a5d8ff]/80 group-hover:text-white">高炮</span>
                                  </label>
                                  <label class="flex items-center gap-2 cursor-pointer group">
                                     <div class="relative flex items-center justify-center">
                                        <input type="checkbox" class="peer appearance-none w-3 h-3 border border-[#00d0ff]/60 rounded-sm bg-[#00d0ff]/5 checked:bg-[#00d0ff]/30 transition-all" />
                                        <div class="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[#00d0ff] opacity-0 peer-checked:opacity-100 pointer-events-none"><div class="w-1 h-1 bg-[#00d0ff]"></div></div>
                                     </div>
                                     <span class="text-[11px] text-[#a5d8ff]/80 group-hover:text-white">燃气炮</span>
                                  </label>
                                  <label class="flex items-center gap-2 cursor-pointer group">
                                     <div class="relative flex items-center justify-center">
                                        <input type="checkbox" class="peer appearance-none w-3 h-3 border border-[#00d0ff]/60 rounded-sm bg-[#00d0ff]/5 checked:bg-[#00d0ff]/30 transition-all" />
                                        <div class="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[#00d0ff] opacity-0 peer-checked:opacity-100 pointer-events-none"><div class="w-1 h-1 bg-[#00d0ff]"></div></div>
                                     </div>
                                     <span class="text-[11px] text-[#a5d8ff]/80 group-hover:text-white">烟炉</span>
                                  </label>
                               </div>
                               <label class="flex items-center gap-2 mt-4 pl-1 group cursor-pointer">
                                  <div class="relative flex items-center justify-center">
                                     <input type="checkbox" checked class="peer appearance-none w-3.5 h-3.5 border border-[#00d0ff] rounded-sm bg-[#00d0ff]/10 checked:bg-[#00d0ff]/40 transition-all" />
                                     <div class="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[#00d0ff] opacity-0 peer-checked:opacity-100 pointer-events-none"><div class="w-1.5 h-1.5 bg-[#00d0ff] shadow-[0_0_5px_#00d0ff]"></div></div>
                                  </div>
                                  <span class="text-[11px] text-white">飞机</span>
                               </label>
                            </div>

                            <!-- Personnel info -->
                            <div>
                               <div class="flex items-center gap-2 mb-2">
                                  <div class="w-1.5 h-3 bg-[#5bc0ff] shadow-[0_0_8px_#5bc0ff]"></div>
                                  <span class="text-[#a5d8ff] text-[13px] font-bold tracking-wider">人员信息</span>
                               </div>
                               <div class="h-[1px] w-full bg-gradient-to-r from-[#2d7ad4]/40 to-transparent mb-3"></div>
                               <label class="flex items-center gap-2 px-1 cursor-pointer group">
                                  <div class="relative flex items-center justify-center">
                                     <input type="checkbox" v-model="showPersonnel" class="peer appearance-none w-3.5 h-3.5 border border-[#00d0ff] rounded-sm bg-[#00d0ff]/10 checked:bg-[#00d0ff]/40 transition-all" />
                                     <div class="absolute inset-x-0 inset-y-0 flex items-center justify-center text-[#00d0ff] opacity-0 peer-checked:opacity-100 pointer-events-none"><div class="w-1.5 h-1.5 bg-[#00d0ff] shadow-[0_0_5px_#00d0ff]"></div></div>
                                  </div>
                                  <span class="text-[11px] text-[#a5d8ff]/80 group-hover:text-white transition-colors">作业人员</span>
                               </label>
                            </div>
                         </div>
                      </div>

                      <!-- Product Overlay Controls -->
                      <div class="w-[180px] p-4 backdrop-blur-md border border-[#2d7ad4]/30 rounded-sm overflow-hidden" style="background: linear-gradient(135deg, rgba(10, 35, 79, 0.9), rgba(3, 13, 36, 0.9)); box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                         <!-- Header -->
                         <div @click="isProductExpanded = !isProductExpanded" class="flex items-center justify-between mb-3 cursor-pointer group/head">
                            <div class="flex items-center gap-2">
                               <div class="flex gap-0.5">
                                  <div class="w-1.5 h-3 bg-[#00d0ff] shadow-[0_0_8px_#00d0ff]"></div>
                                  <div class="w-1.5 h-3 bg-[#00d0ff]/40 shadow-[0_0_4px_#00d0ff]/20"></div>
                               </div>
                               <span class="text-[#a5d8ff] text-[13px] font-bold tracking-wider group-hover/head:text-white transition-colors">产品叠加</span>
                            </div>
                            <ChevronDown :size="14" class="text-[#a5d8ff]/60 transition-transform duration-300" :class="{ '-rotate-90': !isProductExpanded }" />
                         </div>

                         <div v-show="isProductExpanded" class="animate-in slide-in-from-top-1 duration-300">
                            <div class="h-[1px] w-full bg-gradient-to-r from-[#2d7ad4]/40 to-transparent mb-3"></div>
                            <div class="flex flex-col gap-3 px-1">
                               <label v-for="(label, key) in { satellite: '卫星云图', radar: '雷达回波', rainfall: '雨量实况', flightPath: '飞行轨迹' }" :key="key" class="flex items-center gap-3 cursor-pointer group">
                                  <div class="relative flex items-center justify-center">
                                     <input type="checkbox" v-model="overlayOptions[key as keyof typeof overlayOptions]" class="peer appearance-none w-4 h-4 border-2 border-[#00d0ff]/40 rounded-full bg-transparent checked:border-[#00d0ff] transition-all" />
                                     <div class="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                                        <div class="w-2 h-2 bg-[#00d0ff] rounded-full shadow-[0_0_8px_#00d0ff]"></div>
                                     </div>
                                  </div>
                                  <span class="text-[11px] text-[#a5d8ff] group-hover:text-white transition-colors">{{ label }}</span>
                               </label>
                            </div>
                            <!-- Decorative corner -->
                            <div class="absolute bottom-0 right-0 w-[4px] h-[4px] bg-yellow-500 rounded-br-[1px] shadow-[0_0_8px_rgba(234,179,8,0.4)]"></div>
                            <div class="absolute bottom-0 right-0 w-2 h-[1px] bg-yellow-500/50"></div>
                            <div class="absolute bottom-0 right-0 h-2 w-[1px] bg-yellow-500/50"></div>
                         </div>
                      </div>
                   </div>

                   <!-- Bottom Timeline -->
                   <div v-if="isAnyOverlayActive" class="absolute bottom-6 left-6 right-6 h-14 px-8 z-[500] backdrop-blur-md border border-[#2d7ad4]/30 rounded-sm flex items-center gap-8 animate-in slide-in-from-bottom-4 duration-500" style="background: rgba(10, 35, 79, 0.85); box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                      <div class="flex items-center gap-3 text-[#00d0ff] shrink-0 border-r border-[#00d0ff]/20 pr-6">
                         <Play :size="18" class="fill-current cursor-pointer hover:scale-110 transition-transform" />
                         <span class="text-[14px] font-mono font-bold tracking-widest">{{ timelineSteps[selectedTimeIndex] }}</span>
                      </div>
                      <div class="h-[2px] flex-1 bg-[#2d7ad4]/30 relative flex items-center">
                         <div class="absolute h-full bg-[#00d0ff] shadow-[0_0_12px_#00d0ff]" :style="`width: ${(selectedTimeIndex / (timelineSteps.length - 1)) * 100}%`"></div>
                         <div v-for="(step, i) in timelineSteps" :key="i" 
                              @click="selectedTimeIndex = i"
                              class="absolute w-2 h-2 rounded-full border border-[#00d0ff]/50 bg-[#050b1c] cursor-pointer hover:border-[#00d0ff] transition-all group/tick"
                              :class="{ 'bg-[#00d0ff] border-[#00d0ff] shadow-[0_0_8px_#00d0ff] scale-125': i === selectedTimeIndex }"
                              :style="`left: ${(i / (timelineSteps.length - 1)) * 100}%`"
                         >
                            <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap transition-colors"
                                  :class="i === selectedTimeIndex ? 'text-[#00d0ff] font-bold' : 'text-[#a5d8ff]/40 group-hover/tick:text-[#a5d8ff]'">{{ step }}</span>
                         </div>
                      </div>
                   </div>

                   <!-- Product Legend (Color Scale) -->
                   <div v-if="isAnyOverlayActive" class="absolute bottom-24 left-6 w-40 z-[500] p-3 backdrop-blur-md border border-[#2d7ad4]/30 rounded-sm animate-in fade-in slide-in-from-left-4 duration-500" style="background: rgba(10, 35, 79, 0.9);">
                      <div class="text-[10px] text-[#a5d8ff] mb-2 font-bold tracking-widest text-center">{{ activeOverlayLabel }}</div>
                      <div class="h-2.5 w-full bg-gradient-to-r from-[#2dcc5f] via-[#ffe600] to-[#ff4747] rounded-full mb-1"></div>
                      <div class="flex justify-between px-0.5">
                         <span class="text-[8px] text-[#a5d8ff]/60">15</span>
                         <span class="text-[8px] text-[#a5d8ff]/60">35</span>
                         <span class="text-[8px] text-[#a5d8ff]/60">55</span>
                         <span class="text-[8px] text-[#a5d8ff]/60">75+</span>
                      </div>
                   </div>

                   <!-- Map Legend from Subsystem -->
                   <div class="absolute bottom-24 right-6 w-[120px] border border-[#2d7ad4]/50 rounded-sm p-3 z-[500] backdrop-blur-md" style="background: radial-gradient(circle at 100% 0%, rgba(10, 35, 79, 0.9), rgba(3, 13, 36, 0.9)); box-shadow: inset 0 0 15px rgba(0,208,255,0.05), 0 4px 20px rgba(0,0,0,0.6);">
                       <div class="text-[#64a9f2] text-[12px] font-bold pb-2 flex items-center justify-center border-b border-[#2d7ad4]/40 mb-2 tracking-widest">
                         图例
                       </div>
                       <ul class="space-y-2.5 pt-1 text-[11px] text-[#a5d8ff]">
                         <li class="flex items-center justify-between cursor-pointer hover:text-white group transition-colors">
                           <span class="group-hover:translate-x-0.5 transition-transform">待作业</span>
                           <div class="w-2 h-2 rounded-full border border-[#ff9100] bg-[#ff9100] shadow-[0_0_8px_#ff9100]"></div>
                         </li>
                         <li class="flex items-center justify-between cursor-pointer hover:text-white group transition-colors">
                           <span class="group-hover:translate-x-0.5 transition-transform">作业中</span>
                           <div class="w-2 h-2 rounded-full border border-[#2dcc5f] bg-[#2dcc5f] shadow-[0_0_8px_#2dcc5f]"></div>
                         </li>
                         <li class="flex items-center justify-between cursor-pointer hover:text-white group transition-colors">
                           <span class="group-hover:translate-x-0.5 transition-transform">已完成</span>
                           <div class="w-2 h-2 rounded-full border border-[#ff4747] bg-[#ff4747] shadow-[0_0_8px_#ff4747]"></div>
                         </li>
                         <li class="flex items-center justify-between cursor-pointer hover:text-white pt-1 mt-1 border-t border-[#2d7ad4]/30 group transition-colors">
                           <span class="group-hover:translate-x-0.5 transition-transform">飞机轨迹</span>
                           <div class="w-5 h-0 border-t-2 border-dashed border-[#b870ff]"></div>
                         </li>
                       </ul>
                   </div>
                   <!-- Optional Overlay for tech feel -->
                   <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050b1c]/40 to-transparent z-[400]"></div>
                </div>
             </div>
          </section>

          <section class="w-[503px] flex flex-col gap-5 shrink-0 h-full">
            <div class="card flex-1 flex flex-col p-4">
              <div class="flex justify-between items-center mb-4">
                <div class="text-lg font-medium tracking-wide text-[#5bc0ff]">作业需求分析</div>
                <div class="flex gap-2">
                  <button 
                    v-for="(label, i) in demandSubNavItemLabels" 
                    :key="i"
                    @click="activeDemandSubNav = i"
                    class="text-[11px] px-2 py-0.5 rounded border transition-colors outline-none"
                    :class="activeDemandSubNav === i ? 'bg-[#2d7ad4] text-white border-[#2d7ad4]' : 'bg-transparent text-[#6b9dce] border-[#275b8c] hover:border-[#2d7ad4]'"
                  >
                    {{ label }}
                  </button>
                </div>
              </div>
              <div class="flex-1 flex gap-2 overflow-hidden">
                <!-- Left: Image/Map -->
                <div class="w-[45%] border border-[#275b8c]/40 bg-[#0a234a]/30 rounded p-2 flex items-center justify-center relative overflow-hidden group">
                  <img src="/01.png" class="w-full h-full object-contain opacity-80 transition-transform duration-700 group-hover:scale-110" />
                  <div class="absolute top-2 left-2 text-[10px] text-[#5bc0ff]/60 px-1.5 py-0.5 bg-black/40 rounded border border-[#275b8c]/30 backdrop-blur-sm">
                    {{ demandStats[activeDemandSubNav].title }}
                  </div>
                </div>
                <!-- Right: Stats -->
                <div class="flex-1 flex flex-col justify-center gap-6 pl-4 border-l border-[#275b8c]/20">
                   <div class="grid grid-cols-2 gap-y-8 gap-x-4">
                      <div v-for="(stat, idx) in demandStats[activeDemandSubNav].stats" :key="idx" class="flex flex-col items-center">
                         <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-bold font-mono transition-all duration-500" :style="{ color: stat.color, textShadow: `0 0 10px ${stat.color}40` }">{{ stat.val }}</span>
                            <span class="text-sm font-bold" :style="{ color: stat.color }">%</span>
                         </div>
                         <span class="text-xs text-[#a5d8ff] tracking-wider mt-1 opacity-80">{{ stat.label }}</span>
                         <div class="w-12 h-1 mt-2 rounded-full overflow-hidden bg-black/30">
                            <div class="h-full rounded-full transition-all duration-1000 ease-out" :style="{ width: stat.val + '%', backgroundColor: stat.color, boxShadow: `0 0 8px ${stat.color}` }"></div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            <div class="card flex-1 flex flex-col p-4 relative overflow-hidden">
              <div class="text-lg font-medium tracking-wide text-[#5bc0ff] mb-4 flex justify-between items-center shrink-0">
                 <span>七段业务产品</span>
              </div>
              <div class="flex-1 flex flex-col relative z-10 w-full h-full gap-3 overflow-hidden">
                 <!-- Main Area -->
                 <div class="flex-[1.5] flex gap-4 h-full relative overflow-hidden">
                    <!-- Left: PDF Snapshot -->
                    <div @click="isViewingReportDocx = true" class="w-[45%] border border-[#275b8c]/60 bg-[#0a1e45]/50 flex items-center justify-center overflow-hidden rounded relative p-1 shadow-[inset_0_0_15px_rgba(39,91,140,0.3)] cursor-pointer group hover:bg-[#0a1e45]/80 transition-colors h-[140px]">
                       <!-- Custom Uploaded Report Image -->
                       <img :src="img04" alt="人影业务快报" class="w-full h-full object-contain rounded-[2px] opacity-90 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300" referrerPolicy="no-referrer" />
                    </div>
                    
                    <!-- Right: Infographics Chart -->
                    <div class="flex-1 bg-[#0a1e45]/40 rounded-sm border border-[#2d7ad4]/20 flex items-center justify-between p-5 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                       <!-- Decorative background icon -->
                       <div class="absolute -right-4 -bottom-4 opacity-[0.03] transform rotate-12 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-0">
                          <ClipboardList :size="120" class="text-white" />
                       </div>

                       <!-- Progress Ring -->
                       <div class="relative w-28 h-28 flex items-center justify-center shrink-0">
                          <!-- Outer Glow -->
                          <div class="absolute inset-0 rounded-full bg-[#00d0ff]/5 blur-xl transition-all duration-700 group-hover:bg-[#00d0ff]/10"></div>
                          
                          <svg class="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 112 112">
                             <!-- Background Ring -->
                             <circle cx="56" cy="56" r="48" stroke="#1a3861" stroke-width="4" fill="none" opacity="0.5" />
                             <circle cx="56" cy="56" r="48" stroke="#1a3861" stroke-width="8" fill="none" stroke-dasharray="1,6" opacity="0.3" />
                             
                             <!-- Progress Bar -->
                             <circle cx="56" cy="56" r="48" stroke="url(#prodGrad)" stroke-width="6" fill="none"
                                     stroke-dasharray="301.6"
                                     :stroke-dashoffset="301.6 * (1 - seventhItems[activeSeven].current / seventhItems[activeSeven].total)"
                                     stroke-linecap="round" class="transition-all duration-1000 ease-in-out" />
                             
                             <!-- Inner Glow Ring -->
                             <circle cx="56" cy="56" r="42" stroke="#00d0ff" stroke-width="0.5" fill="none" opacity="0.2" stroke-dasharray="4,4" />
                             
                             <defs>
                                <linearGradient id="prodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                   <stop offset="0%" stop-color="#2d7ad4" />
                                   <stop offset="100%" stop-color="#00d0ff" />
                                </linearGradient>
                             </defs>
                          </svg>
                          
                          <div class="absolute flex flex-col items-center justify-center z-20">
                             <span class="text-[10px] text-[#a5d8ff]/60 font-medium mb-1 tracking-wider">已发布</span>
                             <div class="text-[14px] font-bold text-[#00d0ff] drop-shadow-[0_0_10px_rgba(0,208,255,0.6)] flex items-baseline">
                                <span class="text-2xl font-mono font-black">{{ seventhItems[activeSeven].current }}</span>
                                <span class="text-[10px] text-[#a5d8ff]/50 ml-0.5">/{{ seventhItems[activeSeven].total }}期</span>
                             </div>
                          </div>
                       </div>
                       
                       <!-- Stats Data -->
                       <div class="flex-1 flex flex-col gap-6 pl-8 border-l border-[#275b8c]/30 relative z-10">
                          <div class="flex flex-col relative">
                             <div class="flex items-center gap-1.5 mb-1.5">
                                <div class="w-1 h-3 bg-[#47ff88] rounded-full shadow-[0_0_5px_#47ff88]"></div>
                                <span class="text-[11px] font-medium text-[#c0e3ff] tracking-wide">产品期数</span>
                             </div>
                             <div class="flex items-baseline gap-1 text-[13px] text-[#e0f2fe] font-medium">
                                <span>第 <span class="text-[#00d0ff] font-mono text-xl font-bold">{{ seventhItems[activeSeven].current }}</span> 期</span>
                                <span class="text-[#2d7ad4]/70 font-light mx-1">/</span>
                                <span>共 <span class="text-white font-mono text-lg font-bold">{{ seventhItems[activeSeven].total }}</span> 期</span>
                             </div>
                          </div>
                          
                          <div class="flex flex-col relative">
                             <div class="flex items-center gap-1.5 mb-1.5">
                                <div class="w-1 h-3 bg-[#00d0ff] rounded-full shadow-[0_0_5px_#00d0ff]"></div>
                                <span class="text-[11px] font-medium text-[#64a9f2]/80 tracking-wide">发布进度</span>
                             </div>
                             <div class="flex items-baseline gap-1">
                                <span class="text-2xl font-mono font-bold text-[#00d0ff] tracking-tight">
                                   {{ Math.round((seventhItems[activeSeven].current / seventhItems[activeSeven].total) * 100) }}
                                </span>
                                <span class="text-[12px] text-[#00d0ff]/70 font-bold">%</span>
                             </div>
                             <!-- Small progress bar for visual feedback -->
                             <div class="w-full h-1 bg-[#1a3861] rounded-full mt-2 overflow-hidden max-w-[80px]">
                                <div class="h-full bg-gradient-to-r from-[#2d7ad4] to-[#00d0ff] transition-all duration-1000" :style="{ width: (seventhItems[activeSeven].current / seventhItems[activeSeven].total * 100) + '%' }"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <!-- Bottom: Progress Timeline -->
                 <div class="flex-[0.8] w-full relative px-6 mt-4 flex items-center">
                    <div class="absolute left-[56px] right-[56px] top-[20px] -translate-y-1/2 h-[5px] bg-[#31577d] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"></div>
                    
                    <div class="w-full flex justify-between relative z-10 -translate-y-1">
                       <button v-for="(item, i) in seventhItems" :key="i" @click="activeSeven = i" class="flex flex-col items-center group relative cursor-pointer outline-none w-16">
                          <!-- Point container -->
                          <div class="h-10 flex items-center justify-center">
                             <template v-if="activeSeven === i">
                                <div class="w-[38px] h-[38px] rounded-full border-[4px] border-[#00d0ff] flex items-center justify-center z-20"
                                     style="background-color: #0a1e45; box-shadow: 0 0 0 6px rgba(0,208,255,0.15), 0 0 15px rgba(0,208,255,0.6);">
                                   <div class="w-[20px] h-[20px] rounded-full bg-[#00d0ff] flex items-center justify-center">
                                      <ChevronsRight class="w-3.5 h-3.5 text-[#0a1e45] ml-[1px]" stroke-width="3.5" />
                                   </div>
                                </div>
                             </template>
                             <template v-else>
                                <div class="w-[28px] h-[28px] rounded-full border-[6px] bg-[#0a1e45] z-10 transition-all duration-300"
                                     :class="activeSeven > i ? 'border-[#31577d]' : 'border-[#31577d] group-hover:border-[#64a9f2]'">
                                </div>
                             </template>
                          </div>
                          <!-- Label text pointing down -->
                          <span class="text-[13px] font-medium transition-colors duration-300 whitespace-nowrap mt-2"
                                :class="activeSeven === i ? 'text-white font-bold drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]' : 'text-[#8aa2ba] group-hover:text-white'">
                             {{ item.label }}
                          </span>
                       </button>
                    </div>
                 </div>
              </div>
            </div>
            <div class="card flex-1 flex flex-col p-4">
              <div class="flex justify-between items-center mb-4">
                <div class="text-lg font-medium tracking-wide text-[#5bc0ff]">站点实景监控</div>
                <div class="flex gap-2">
                   <div class="flex items-center gap-1 relative">
                      <span class="text-[11px] text-[#a5d8ff] font-medium shrink-0">区县:</span>
                      <div class="relative flex items-center">
                        <select v-model="selectedDistrict" class="bg-[#0a234a]/60 border border-[#275b8c] text-[#a5d8ff] text-[11px] pl-2 pr-6 py-0.5 rounded outline-none focus:border-[#00d0ff] transition-colors cursor-pointer appearance-none min-w-[85px]">
                          <option v-for="d in tianjinDistricts" :key="d" :value="d">{{ d }}</option>
                        </select>
                        <ChevronDown class="absolute right-1 text-[#a5d8ff]/60 pointer-events-none" :size="12" />
                      </div>
                   </div>
                   <div class="flex items-center gap-1 relative">
                      <span class="text-[11px] text-[#a5d8ff] font-medium shrink-0">站点:</span>
                      <div class="relative flex items-center">
                        <select v-model="selectedSite" class="bg-[#0a234a]/60 border border-[#275b8c] text-[#a5d8ff] text-[11px] pl-2 pr-6 py-0.5 rounded outline-none focus:border-[#00d0ff] transition-colors cursor-pointer appearance-none min-w-[95px]">
                          <option value="site1">站点名称1</option>
                          <option value="site2">站点名称2</option>
                        </select>
                        <ChevronDown class="absolute right-1 text-[#a5d8ff]/60 pointer-events-none" :size="12" />
                      </div>
                   </div>
                </div>
              </div>
              <div class="flex-1 bg-[#050b1c] rounded border border-[#275b8c]/40 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                 <!-- Mock Video Area -->
                 <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-full h-full opacity-20 pointer-events-none">
                       <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_#275b8c_1px,_transparent_1px)] [background-size:20px_20px]"></div>
                    </div>
                    <div class="flex flex-col items-center gap-2 opacity-40">
                       <Camera class="w-10 h-10 text-[#3a7bbb]" />
                       <span class="text-[11px] text-[#5bc0ff] tracking-[0.2em] font-medium">正在获取实时视频流...</span>
                    </div>
                 </div>
                 
                 <!-- HUD Overlays -->
                 <div class="absolute top-2 left-2 text-[10px] text-[#00d0ff]/60 font-mono flex items-center gap-1">
                    <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    REC 00:00:{{ Math.floor(Math.random() * 60).toString().padStart(2, '0') }}
                 </div>
                 <div class="absolute top-2 right-3 text-[11px] text-[#00d0ff] font-sans font-bold bg-black/20 px-2 py-0.5 rounded-sm shadow-[0_0_8px_rgba(0,208,255,0.4)]">
                    {{ selectedDistrict }} - {{ selectedSite === 'site1' ? '站点1' : '站点2' }}
                 </div>
                 <div class="absolute bottom-2 left-2 text-[10px] text-[#00d0ff]/40 font-mono">
                    CAM_01_FEED_LVL
                 </div>
                 
                 <!-- Decorative Scanline -->
                 <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00d0ff]/5 to-transparent h-1/4 w-full -translate-y-full animate-[scan_6s_linear_infinite]"></div>
              </div>
            </div>
          </section>
        </template>

        <!-- Product Release Subsystem View (Active Nav 8) -->
        <template v-else-if="activeNav === 8">
          <section class="flex-1 flex flex-col h-full w-full relative">
            <div class="absolute inset-0 border border-[#1b4b8a] bg-gradient-to-br from-[#061838] to-[#0a234f] shadow-[inset_0_0_100px_rgba(27,75,138,0.5)]">
              <!-- HUD Tech Title & Navigation -->
              <div class="absolute top-8 left-8 z-10 w-[calc(100%-4rem)] flex flex-col">
                <div class="flex items-end justify-between w-full">
                  
                  <div class="flex items-end">
                    <!-- Title Section -->
                    <div class="relative flex items-center pr-12">
                       <div class="flex flex-col space-y-1 mr-4 mb-2">
                         <div class="w-[6px] h-10 bg-[#00d0ff] shadow-[0_0_15px_rgba(0,208,255,0.8)]"></div>
                         <div class="w-[6px] h-3 bg-[#00a3ff] opacity-70"></div>
                       </div>
                       <h2 class="text-white text-[34px] font-bold tracking-[0.05em] drop-shadow-[0_0_15px_rgba(0,163,255,0.6)] mb-2">
                         决策辅助子系统
                       </h2>
                    </div>

                    <!-- Navigation Menu -->
                    <div class="flex space-x-2 mb-1">
                      <button
                        v-for="(item, index) in subNavItems"
                        :key="index"
                        @click="activeSubNav = index"
                        class="relative px-8 py-2 text-[20px] font-bold tracking-wider transition-all duration-300 outline-none group"
                        :class="activeSubNav === index ? 'text-white' : 'text-[#6b9dce] hover:text-[#aee0ff]'"
                      >
                        <span class="relative z-10 drop-shadow-md">{{ item }}</span>
                        <!-- Active Line under the item -->
                        <div 
                          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] h-[3px] transition-all duration-300 border-b border-[#00d0ff]/20"
                          :class="activeSubNav === index ? 'bg-[#00d0ff] shadow-[0_0_15px_rgba(0,208,255,1)]' : 'bg-transparent group-hover:bg-[#175aa6]'"
                        ></div>
                        <!-- Active Subdued Background Highlight -->
                        <div 
                          v-if="activeSubNav === index" 
                          class="absolute inset-0 bg-gradient-to-t from-[#00d0ff]/20 to-transparent opacity-80"
                        ></div>
                      </button>
                    </div>
                  </div>

                  <!-- Right side Info & Decoration -->
                  <div class="flex flex-col items-end pb-1 pr-4 space-y-3">
                    <div class="flex items-start space-x-8">
                       <!-- Time and Duty -->
                       <div class="flex flex-col space-y-1 text-right">
                         <div class="text-[#a5d8ff] tracking-wider font-light text-lg">{{ timeStr }}</div>
                         <div class="text-sm text-[#7aa7d6] flex gap-4 justify-end">
                           <span>值班领导: xx</span>
                           <span>主岗: xx</span>
                           <span>加强岗: xx</span>
                         </div>
                       </div>
                       <!-- User Actions -->
                       <div class="flex items-center space-x-5 text-[16px] text-[#a5d8ff] pt-1">
                          <button class="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                            <User :size="16" />
                            <span>登陆用户</span>
                          </button>
                          <button class="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                            <MessageSquare :size="16" />
                            <span>消息</span>
                          </button>
                          <button class="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                            <Send :size="16" />
                            <span>发布</span>
                          </button>
                       </div>
                    </div>
                    
                    <div class="flex space-x-2 opacity-80">
                      <div class="w-8 h-2 skew-x-[-30deg] bg-[#175aa6]"></div>
                      <div class="w-8 h-2 skew-x-[-30deg] bg-[#175aa6]"></div>
                      <div class="w-4 h-2 skew-x-[-30deg] bg-[#00d0ff] shadow-[0_0_15px_rgba(0,208,255,0.8)]"></div>
                    </div>
                  </div>
                </div>

                <!-- Combined Baseline -->
                <div class="flex items-center w-full mt-1">
                  <div class="w-[420px] h-[3px] bg-[#00d0ff] shadow-[0_0_8px_rgba(0,208,255,0.8)]"></div>
                  <div class="w-2 h-[3px] bg-[#00d0ff] ml-2"></div>
                  <div class="w-1 h-[3px] bg-[#00d0ff] ml-1"></div>
                  <div class="flex-1 h-[1px] bg-gradient-to-r from-[#175aa6] via-[#175aa6]/30 to-transparent ml-2"></div>
                </div>
              </div>
              
              <!-- Content Area -->
              <div class="w-full h-full pt-[110px] pb-8 px-8 flex flex-col">
                <div class="flex-1 relative bg-transparent flex flex-col overflow-hidden">
                  <template v-if="activeSubNav === 0">
                    <div class="flex w-full h-full gap-5">
                      <!-- Left Panel -->
                      <div class="w-[460px] flex flex-col gap-4 shrink-0">
                        <div v-for="(cardItem, index) in reqLeftCards" :key="index" class="card flex-1 flex flex-col p-4 bg-[#143e79]/60 border border-[#2d7ad4]/50 hover:bg-[#143e79]/80 transition duration-300 relative z-10 w-full h-full">
                          <h3 class="text-white text-[22px] font-bold tracking-wide mb-3" style="text-shadow: 0 2px 4px rgba(0,0,0,0.5);">{{ cardItem.title }}</h3>
                          <div class="flex-1 flex bg-gradient-to-r from-[#031d4d] to-[#010b24] border border-[#215a99] rounded p-2 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                             <div class="w-[55%] h-full flex justify-center items-center relative overflow-hidden bg-[radial-gradient(circle_at_center,#0b2d66_0%,transparent_70%)]">
                               <div class="absolute inset-2 border border-[#3b87d9]/30 rounded-lg flex items-center justify-center p-2">
                                  <img src="/01.png" class="w-full h-full object-contain opacity-90 drop-shadow-[0_0_8px_rgba(71,255,136,0.5)]" alt="Icon" />
                               </div>
                             </div>
                             <div class="w-[45%] h-full flex flex-col justify-center items-center gap-3 pl-2 border-l border-[#1f569c]/30">
                                <div class="flex w-full justify-between gap-2 px-1">
                                   <div class="flex flex-col items-center flex-1">
                                      <div class="flex items-end space-x-1">
                                         <span class="text-[#ff4747] text-xl font-bold font-mono">{{ cardItem.stats[0].val.replace('%', '') }}</span><span class="text-[#ff4747] text-sm">%</span>
                                      </div>
                                      <span class="text-[#b0d2f2] text-xs mt-1 whitespace-nowrap">{{ cardItem.stats[0].label }}</span>
                                      <div class="w-8 h-[3px] bg-[#ff4747] mt-1 shadow-[0_0_5px_#ff4747]"></div>
                                   </div>
                                   <div class="flex flex-col items-center flex-1">
                                      <div class="flex items-end space-x-1">
                                         <span class="text-[#ffd047] text-xl font-bold font-mono">{{ cardItem.stats[1].val.replace('%', '') }}</span><span class="text-[#ffd047] text-sm">%</span>
                                      </div>
                                      <span class="text-[#b0d2f2] text-xs mt-1 whitespace-nowrap">{{ cardItem.stats[1].label }}</span>
                                      <div class="w-8 h-[3px] bg-[#ffd047] mt-1 shadow-[0_0_5px_#ffd047]"></div>
                                   </div>
                                </div>
                                <div class="flex w-full justify-between gap-2 px-1">
                                   <div class="flex flex-col items-center flex-1">
                                      <div class="flex items-end space-x-1">
                                          <span class="text-[#47ff88] text-xl font-bold font-mono">{{ cardItem.stats[2].val.replace('%', '') }}</span><span class="text-[#47ff88] text-sm">%</span>
                                      </div>
                                      <span class="text-[#b0d2f2] text-xs mt-1 whitespace-nowrap">{{ cardItem.stats[2].label }}</span>
                                      <div class="w-8 h-[3px] bg-[#47ff88] mt-1 shadow-[0_0_5px_#47ff88]"></div>
                                   </div>
                                   <div class="flex flex-col items-center flex-1">
                                      <div class="flex items-end space-x-1">
                                          <span class="text-[#47b2ff] text-xl font-bold font-mono">{{ cardItem.stats[3].val.replace('%', '') }}</span><span class="text-[#47b2ff] text-sm">%</span>
                                      </div>
                                      <span class="text-[#b0d2f2] text-xs mt-1 whitespace-nowrap">{{ cardItem.stats[3].label }}</span>
                                      <div class="w-8 h-[3px] bg-[#47b2ff] mt-1 shadow-[0_0_5px_#47b2ff]"></div>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>

                      <!-- Center Panel (Main Map) -->
                      <div class="card flex-1 relative bg-[#041126] border border-[#2d7ad4]/80 rounded-[4px] overflow-hidden p-0 shadow-[0_0_30px_rgba(45,122,212,0.2)]">
                        <div class="absolute inset-0 z-0">
                          <LeafletMap :show-fixed="showFixedPoints" :show-mobile="showMobilePoints" :show-personnel="showPersonnel" :overlays="overlayOptions" />
                        </div>
                        <div class="absolute inset-0 opacity-[0.05] pointer-events-none" style="background-image: linear-gradient(#00d0ff 1px, transparent 1px), linear-gradient(90deg, #00d0ff 1px, transparent 1px); background-size: 40px 40px;"></div>
                        <div class="absolute inset-0 pointer-events-none">
                           <!-- Marker 1 (Pending - Orange) -->
                           <div class="absolute top-[35%] left-[50%] flex flex-col items-center">
                              <div class="w-8 h-10 -mt-8 flex items-center justify-center relative">
                                <svg viewBox="0 0 24 34" fill="none" class="w-full h-full drop-shadow-[0_0_5px_rgba(255,145,0,0.8)]">
                                  <path d="M12 0C5.372 0 0 5.373 0 12c0 8.5 12 22 12 22s12-13.5 12-22C24 5.373 18.628 0 12 0z" fill="rgba(255,145,0,0.2)" stroke="#ff9100" stroke-width="1.5" />
                                  <circle cx="12" cy="12" r="5" fill="#ff9100" />
                                </svg>
                              </div>
                              <span class="text-white text-xs mt-1 bg-[#06152e]/80 px-2 py-0.5 rounded border border-[#ff9100]/60 shadow-[0_0_10px_rgba(255,145,0,0.3)]">张家坟 (固定)</span>
                           </div>
                           <!-- Marker 2 (In Progress - Green) -->
                           <div class="absolute top-[50%] left-[35%] flex flex-col items-center">
                              <div class="absolute inset-0 w-8 h-8 rounded-full border border-[#2dcc5f] animate-[ping_2s_ease-out_infinite] opacity-50 ml-0.5 mt-0.5"></div>
                              <div class="w-8 h-10 -mt-8 flex items-center justify-center relative">
                                <svg viewBox="0 0 24 34" fill="none" class="w-full h-full drop-shadow-[0_0_5px_rgba(45,204,95,0.8)]">
                                  <path d="M12 0C5.372 0 0 5.373 0 12c0 8.5 12 22 12 22s12-13.5 12-22C24 5.373 18.628 0 12 0z" fill="rgba(45,204,95,0.2)" stroke="#2dcc5f" stroke-width="1.5" />
                                  <circle cx="12" cy="12" r="5" fill="#2dcc5f" />
                                </svg>
                              </div>
                              <span class="text-white text-xs mt-1 bg-[#06152e]/80 px-2 py-0.5 rounded border border-[#2dcc5f]/60 shadow-[0_0_10px_rgba(45,204,95,0.3)]">漳卫河 (移动)</span>
                           </div>
                           <!-- Marker 3 (Completed - Red) -->
                           <div class="absolute top-[65%] left-[60%] flex flex-col items-center opacity-80">
                              <div class="w-8 h-10 -mt-8 flex items-center justify-center relative">
                                <svg viewBox="0 0 24 34" fill="none" class="w-full h-full drop-shadow-[0_0_5px_rgba(255,71,71,0.8)]">
                                  <path d="M12 0C5.372 0 0 5.373 0 12c0 8.5 12 22 12 22s12-13.5 12-22C24 5.373 18.628 0 12 0z" fill="rgba(255,71,71,0.2)" stroke="#ff4747" stroke-width="1.5" />
                                  <circle cx="12" cy="12" r="5" fill="#ff4747" />
                                </svg>
                              </div>
                              <span class="text-[#a5d8ff] text-xs mt-1 bg-[#06152e]/80 px-2 py-0.5 rounded border border-[#ff4747]/60 shadow-[0_0_10px_rgba(255,71,71,0.3)]">林区 (固定)</span>
                           </div>
                           <!-- Plane Icon -->
                           <div class="absolute top-[65%] left-[80%] flex flex-col items-center">
                             <div class="text-[#b870ff] drop-shadow-[0_0_8px_#b870ff] bg-[#0a1835]/80 p-1.5 rounded-full border border-[#b870ff]/50 flex items-center justify-center">
                               <Plane :size="20" class="transform origin-center rotate-[45deg]" />
                             </div>
                             <span class="text-[#b870ff] text-xs mt-1 font-bold">BZ-950 (播撒中)</span>
                           </div>
                        </div>

                        <!-- Top Left Panel: Operation Elements -->
                        <div class="absolute top-4 left-4 w-[200px] border border-[#2d7ad4]/80 rounded p-4 z-20" style="background: radial-gradient(circle at 100% 0%, rgba(10, 35, 79, 0.95), rgba(3, 13, 36, 0.95)); box-shadow: inset 0 0 15px rgba(0,208,255,0.1), 0 4px 20px rgba(0,0,0,0.5);">
                          <div class="text-[#64a9f2] text-[14px] font-bold pb-2 flex items-center border-b border-[#2d7ad4]/30 mb-3">
                            <div class="w-1.5 h-3 bg-[#64a9f2] mr-2 shadow-[0_0_5px_#64a9f2]"></div>
                            作业点类型
                          </div>
                          <div class="flex space-x-6 pt-1 text-[13px] text-[#a5d8ff] mb-5">
                            <label class="flex items-center space-x-2 cursor-pointer hover:text-white">
                              <input type="checkbox" checked class="accent-[#00d0ff] w-3 h-3" />
                              <span>固定</span>
                            </label>
                            <label class="flex items-center space-x-2 cursor-pointer hover:text-white">
                              <input type="checkbox" checked class="accent-[#00d0ff] w-3 h-3" />
                              <span>移动</span>
                            </label>
                          </div>

                          <div class="text-[#64a9f2] text-[14px] font-bold pb-2 flex items-center border-b border-[#2d7ad4]/30 mb-3">
                            <div class="w-1.5 h-3 bg-[#64a9f2] mr-2 shadow-[0_0_5px_#64a9f2]"></div>
                            装备
                          </div>
                          <ul class="grid grid-cols-2 gap-3 pt-1 text-[13px] text-[#a5d8ff] mb-5">
                            <li class="flex items-center space-x-2 cursor-pointer hover:text-white">
                               <div class="w-2.5 h-2.5 rounded-sm border border-[#00d0ff] bg-[#00d0ff]/20"></div><span>火箭</span>
                            </li>
                            <li class="flex items-center space-x-2 cursor-pointer hover:text-white">
                               <div class="w-2.5 h-2.5 rounded-sm border border-[#00d0ff] bg-[#00d0ff]/20"></div><span>高炮</span>
                            </li>
                            <li class="flex items-center space-x-2 cursor-pointer hover:text-white">
                               <div class="w-2.5 h-2.5 rounded-sm border border-[#00d0ff] bg-[#00d0ff]/20"></div><span>燃气炮</span>
                            </li>
                            <li class="flex items-center space-x-2 cursor-pointer hover:text-white">
                               <div class="w-2.5 h-2.5 rounded-sm border border-[#00d0ff] bg-[#00d0ff]/20"></div><span>烟炉</span>
                            </li>
                            <li class="flex items-center space-x-2 cursor-pointer hover:text-white col-span-2 mt-1">
                               <div class="w-2.5 h-2.5 rounded-sm border border-[#00d0ff] bg-[#00d0ff]/80 shadow-[0_0_5px_#00d0ff]"></div><span class="text-white font-bold tracking-wider">飞机</span>
                            </li>
                          </ul>

                          <div class="text-[#64a9f2] text-[14px] font-bold pb-2 flex items-center border-b border-[#2d7ad4]/30 mb-3">
                            <div class="w-1.5 h-3 bg-[#64a9f2] mr-2 shadow-[0_0_5px_#64a9f2]"></div>
                            人员信息
                          </div>
                          <div class="flex items-center justify-between text-[#a5d8ff] text-[13px] pt-1 px-1">
                            <div class="flex items-center space-x-2">
                               <User :size="16" class="text-[#00d0ff]" />
                               <span>作业人员</span>
                            </div>
                            <span class="text-[#00d0ff] text-base font-bold font-mono tracking-wider drop-shadow-[0_0_5px_rgba(0,208,255,0.8)]">124</span>
                          </div>
                        </div>

                        <!-- Bottom Right Panel: Legend -->
                        <div class="absolute bottom-4 right-4 w-[110px] border border-[#2d7ad4]/80 rounded p-3 z-20" style="background: radial-gradient(circle at 100% 0%, rgba(10, 35, 79, 0.95), rgba(3, 13, 36, 0.95)); box-shadow: inset 0 0 15px rgba(0,208,255,0.1), 0 4px 20px rgba(0,0,0,0.5);">
                          <div class="text-[#64a9f2] text-[13px] font-bold pb-2 flex items-center justify-center border-b border-[#2d7ad4]/40 mb-2">
                            图例
                          </div>
                          <ul class="space-y-3 pt-1 text-[13px] text-[#a5d8ff]">
                            <li class="flex items-center justify-between cursor-pointer hover:text-white">
                              <span>待作业</span>
                              <div class="w-2.5 h-2.5 rounded-full border border-[#ff9100] bg-[#ff9100] shadow-[0_0_5px_#ff9100]"></div>
                            </li>
                            <li class="flex items-center justify-between cursor-pointer hover:text-white">
                              <span>作业中</span>
                              <div class="w-2.5 h-2.5 rounded-full border border-[#2dcc5f] bg-[#2dcc5f] shadow-[0_0_5px_#2dcc5f]"></div>
                            </li>
                            <li class="flex items-center justify-between cursor-pointer hover:text-white">
                              <span>已完成</span>
                              <div class="w-2.5 h-2.5 rounded-full border border-[#ff4747] bg-[#ff4747] shadow-[0_0_5px_#ff4747]"></div>
                            </li>
                            <li class="flex items-center justify-between cursor-pointer hover:text-white pt-1 mt-1 border-t border-[#2d7ad4]/30">
                              <span>飞机轨迹</span>
                              <div class="w-4 h-0 border-t-2 border-dashed border-[#b870ff]"></div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <!-- Right Panel -->
                      <div class="w-[480px] flex flex-col gap-4 shrink-0">
                        <div v-for="(cardItem, index) in reqRightCards" :key="index" class="card flex-1 flex flex-col p-4 bg-[#143e79]/60 border border-[#2d7ad4]/50 hover:bg-[#143e79]/80 transition duration-300 relative z-10 w-full h-full">
                          <h3 class="text-white text-[22px] font-bold tracking-wide mb-3" style="text-shadow: 0 2px 4px rgba(0,0,0,0.5);">{{ cardItem.title }}</h3>
                          <div class="flex-1 flex bg-gradient-to-r from-[#031d4d] to-[#010b24] border border-[#215a99] rounded p-2 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                             <div class="w-[55%] h-full flex justify-center items-center relative overflow-hidden bg-[radial-gradient(circle_at_center,#0b2d66_0%,transparent_70%)]">
                               <div class="absolute inset-2 border border-[#3b87d9]/30 rounded-lg flex items-center justify-center p-2">
                                  <img src="/01.png" class="w-full h-full object-contain opacity-90 drop-shadow-[0_0_8px_rgba(71,255,136,0.5)]" alt="Icon" />
                               </div>
                             </div>
                             <div class="w-[45%] h-full flex flex-col justify-center items-center gap-3 pl-2 border-l border-[#1f569c]/30">
                                <div class="flex w-full justify-between gap-2 px-1">
                                   <div class="flex flex-col items-center flex-1">
                                      <div class="flex items-end space-x-1">
                                         <span class="text-[#ff4747] text-xl font-bold font-mono">{{ cardItem.stats[0].val.replace('%', '') }}</span><span class="text-[#ff4747] text-sm">%</span>
                                      </div>
                                      <span class="text-[#b0d2f2] text-xs mt-1 whitespace-nowrap">{{ cardItem.stats[0].label }}</span>
                                      <div class="w-8 h-[3px] bg-[#ff4747] mt-1 shadow-[0_0_5px_#ff4747]"></div>
                                   </div>
                                   <div class="flex flex-col items-center flex-1">
                                      <div class="flex items-end space-x-1">
                                         <span class="text-[#ffd047] text-xl font-bold font-mono">{{ cardItem.stats[1].val.replace('%', '') }}</span><span class="text-[#ffd047] text-sm">%</span>
                                      </div>
                                      <span class="text-[#b0d2f2] text-xs mt-1 whitespace-nowrap">{{ cardItem.stats[1].label }}</span>
                                      <div class="w-8 h-[3px] bg-[#ffd047] mt-1 shadow-[0_0_5px_#ffd047]"></div>
                                   </div>
                                </div>
                                <div class="flex w-full justify-between gap-2 px-1">
                                   <div class="flex flex-col items-center flex-1">
                                      <div class="flex items-end space-x-1">
                                          <span class="text-[#47ff88] text-xl font-bold font-mono">{{ cardItem.stats[2].val.replace('%', '') }}</span><span class="text-[#47ff88] text-sm">%</span>
                                      </div>
                                      <span class="text-[#b0d2f2] text-xs mt-1 whitespace-nowrap">{{ cardItem.stats[2].label }}</span>
                                      <div class="w-8 h-[3px] bg-[#47ff88] mt-1 shadow-[0_0_5px_#47ff88]"></div>
                                   </div>
                                   <div class="flex flex-col items-center flex-1">
                                      <div class="flex items-end space-x-1">
                                          <span class="text-[#47b2ff] text-xl font-bold font-mono">{{ cardItem.stats[3].val.replace('%', '') }}</span><span class="text-[#47b2ff] text-sm">%</span>
                                      </div>
                                      <span class="text-[#b0d2f2] text-xs mt-1 whitespace-nowrap">{{ cardItem.stats[3].label }}</span>
                                      <div class="w-8 h-[3px] bg-[#47b2ff] mt-1 shadow-[0_0_5px_#47b2ff]"></div>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  
                  <template v-else-if="activeSubNav === 1">
                    <div class="flex w-full h-full gap-5">
                      <!-- Left Menu for Product Production -->
                      <div class="w-[300px] shrink-0 border border-[#2d7ad4]/50 bg-[#143e79]/40 backdrop-blur-sm rounded p-4 flex flex-col gap-3 shadow-[inset_0_0_20px_rgba(45,122,212,0.1)]">
                        <div 
                          v-for="(item, index) in prodSubNavItems" 
                          :key="index"
                          @click="activeProdSubNav = index"
                          class="py-4 px-6 rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden group border"
                          :class="activeProdSubNav === index ? 'bg-[#175aa6] border-[#4b92d8] shadow-[0_4px_20px_rgba(23,90,166,0.5)] text-white' : 'bg-[#0a234a]/40 border-[#1f569c]/30 text-[#8cc4ff] hover:bg-[#123970]/60 hover:border-[#3b87d9]/60 hover:text-white backdrop-blur-sm'"
                        >
                          <div class="relative z-10 flex items-center font-medium text-[16px] tracking-normal">
                            <div class="w-1.5 h-4 mr-3 rounded-sm transition-colors duration-300" :class="activeProdSubNav === index ? 'bg-[#00d0ff] shadow-[0_0_10px_#00d0ff]' : 'bg-[#1f569c] group-hover:bg-[#00d0ff] group-hover:shadow-[0_0_8px_#00d0ff]'"></div>
                            {{ item }}
                          </div>
                          <!-- Highlight overlay -->
                          <div class="absolute inset-0 bg-gradient-to-r from-[#00d0ff]/10 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none" :class="activeProdSubNav === index ? 'opacity-100' : 'group-hover:opacity-100'"></div>
                        </div>
                      </div>
                      
                      <!-- Right Content Area -->
                      <div class="flex-1 border border-[#2d7ad4]/50 bg-[#041126]/60 backdrop-blur-sm rounded p-6 shadow-[inset_0_0_30px_rgba(45,122,212,0.1)] flex flex-col relative overflow-hidden">
                        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: linear-gradient(#00d0ff 1px, transparent 1px), linear-gradient(90deg, #00d0ff 1px, transparent 1px); background-size: 30px 30px;"></div>
                        
                        <template v-if="activeProdSubNav === 0">
                           <div class="relative z-10 w-full h-full flex flex-col">
                              <template v-if="!isCreatingReport && !isPreviewingReport">
                                 <!-- Filter Section -->
                                 <div class="flex items-center bg-[#102b54]/40 border border-[#1f569c]/50 p-4 rounded-lg mb-5 backdrop-blur-sm">
                                    <div class="flex flex-1 items-center justify-between text-[#a5d8ff] text-[15px]">
                                       <div class="flex items-center">
                                          <span class="font-medium tracking-wide mr-3">发布时间：</span>
                                          <input type="date" class="bg-[#041126]/50 border border-[#1f569c] hover:border-[#2d7ad4] rounded-md px-3 py-1.5 text-white outline-none focus:border-[#00d0ff] h-9 [color-scheme:dark] transition-colors shadow-inner" />
                                          <span class="text-[#4b92d8] px-3">至</span>
                                          <input type="date" class="bg-[#041126]/50 border border-[#1f569c] hover:border-[#2d7ad4] rounded-md px-3 py-1.5 text-white outline-none focus:border-[#00d0ff] h-9 [color-scheme:dark] transition-colors shadow-inner" />
                                          <button class="bg-[#175aa6]/80 hover:bg-[#2170cc] border border-[#4b92d8]/50 text-white px-6 py-1.5 rounded-md flex items-center justify-center transition-all duration-300 h-9 ml-6 tracking-wide hover:shadow-[0_0_15px_rgba(75,146,216,0.4)]">
                                            查询
                                          </button>
                                       </div>
                                       <button @click="isCreatingReport = true" class="bg-[#00d0ff]/20 hover:bg-[#00d0ff]/40 border border-[#00d0ff]/50 text-[#00d0ff] hover:text-white px-6 py-1.5 rounded-md flex items-center justify-center transition-all duration-300 h-9 tracking-wide hover:shadow-[0_0_15px_rgba(0,208,255,0.4)] gap-2">
                                         <span class="text-lg leading-none">+</span>
                                         <span>新增</span>
                                       </button>
                                    </div>
                                 </div>
                                 
                                 <!-- Table Section -->
                                 <div class="flex-1 border border-[#1f569c]/60 bg-[#061530]/40 rounded-lg overflow-hidden flex flex-col backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                                    <div class="grid grid-cols-[80px_minmax(0,1fr)_180px_100px_100px_220px_120px] bg-[#0d2a59]/60 text-[#8cc4ff] text-[15px] font-semibold tracking-wide py-4 px-4 border-b border-[#1f569c]/60 text-center">
                                       <div>序号</div>
                                       <div>产品名称</div>
                                       <div>发布时间</div>
                                       <div>值班员</div>
                                       <div>签发</div>
                                       <div>产品状态</div>
                                       <div>产品检验</div>
                                    </div>
                                    <div class="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
                                       <div v-for="row in processForecastReports" :key="row.id" class="grid grid-cols-[80px_minmax(0,1fr)_180px_100px_100px_220px_120px] text-[#a5d8ff] text-[15px] py-4 px-4 border-b border-[#1f569c]/30 text-center items-center hover:bg-[#143e79]/30 transition-colors duration-200">
                                          <div class="text-[#00d0ff] font-mono font-medium">{{ row.id }}</div>
                                          <div class="truncate px-4 text-left font-medium text-white/90">{{ row.name }}</div>
                                          <div class="font-mono text-[14px] opacity-80">{{ row.time }}</div>
                                          <div>{{ row.operator }}</div>
                                          <div>{{ row.issuer }}</div>
                                          <div class="flex items-center justify-center space-x-5 text-[#00d0ff]">
                                             <button @click="openPreview('/report.docx')" class="hover:text-white transition-colors">查看</button>
                                             <button class="hover:text-white transition-colors">修改</button>
                                             <button class="hover:text-white transition-colors">审核</button>
                                             <button class="text-[#ff6b6b] hover:text-[#ff8f8f] transition-colors">删除</button>
                                          </div>
                                          <div>
                                             <button class="text-[#47ff88] hover:text-white border border-[#47ff88]/30 hover:border-[#47ff88] hover:bg-[#47ff88]/10 px-4 py-1.5 rounded-md transition-all duration-300 text-[13px] tracking-wide">检验报告</button>
                                          </div>
                                       </div>
                                    </div>
                                    
                                    <!-- Pagination Section -->
                                    <div class="flex justify-between items-center px-6 py-4 border-t border-[#1f569c]/50 bg-[#0a234a]/30 text-[#8cc4ff] text-sm">
                                      <div class="tracking-wide">共 5 条记录</div>
                                      <div class="flex items-center space-x-2">
                                        <button class="px-2 py-1 border border-[#1f569c]/50 rounded-md hover:border-[#4b92d8] hover:bg-[#1f569c]/40 transition-colors text-[#64a9f2] disabled:opacity-30 disabled:cursor-not-allowed">&lt;</button>
                                        <button class="px-3 py-1 border border-[#00d0ff] bg-[#00d0ff]/10 text-[#00d0ff] font-bold rounded-md transition-colors shadow-[0_0_10px_rgba(0,208,255,0.2)]">1</button>
                                        <button class="px-3 py-1 border border-[#1f569c]/50 rounded-md hover:border-[#4b92d8] hover:bg-[#1f569c]/40 transition-colors text-[#64a9f2]">2</button>
                                        <button class="px-2 py-1 border border-[#1f569c]/50 rounded-md hover:border-[#4b92d8] hover:bg-[#1f569c]/40 transition-colors text-[#64a9f2]">&gt;</button>
                                        <select class="ml-4 bg-[#041126]/60 border border-[#1f569c]/50 hover:border-[#2d7ad4] rounded-md px-3 py-1.5 outline-none focus:border-[#00d0ff] transition-colors [color-scheme:dark] cursor-pointer shadow-inner">
                                          <option>10 条/页</option>
                                          <option>20 条/页</option>
                                          <option>50 条/页</option>
                                        </select>
                                      </div>
                                    </div>
                                 </div>
                              </template>
                              <template v-else-if="isCreatingReport">
                                 <!-- Create Report View -->
                                 <div class="flex items-center justify-between bg-[#102b54]/40 border border-[#1f569c]/50 p-4 rounded-lg mb-5 backdrop-blur-sm">
                                    <div class="text-white text-[17px] font-medium tracking-wide flex items-center">
                                       <div class="w-1.5 h-4 bg-[#00d0ff] mr-3 shadow-[0_0_8px_#00d0ff] rounded-sm"></div>
                                       新增作业过程预报报告
                                    </div>
                                    <button @click="isCreatingReport = false" class="border border-[#4b92d8]/50 text-[#a5d8ff] hover:text-white hover:bg-[#175aa6]/50 px-5 py-1.5 rounded-md flex items-center justify-center transition-colors duration-300 h-9 tracking-wide hover:shadow-[0_0_15px_rgba(75,146,216,0.3)]">
                                      返回列表
                                    </button>
                                 </div>
                                 <div class="flex-1 border border-[#1f569c]/40 bg-[#061530]/40 rounded-lg p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center backdrop-blur-sm">
                                    <div class="text-lg text-[#a5d8ff]/50 tracking-wide font-light">新增报告表单界面 (待填充)</div>
                                 </div>
                              </template>
                              <template v-else-if="isPreviewingReport">
                                 <!-- Preview Document View -->
                                 <div class="flex items-center justify-between bg-[#102b54]/40 border border-[#1f569c]/50 p-4 rounded-lg mb-5 backdrop-blur-sm">
                                    <div class="text-white text-[17px] font-medium tracking-wide flex items-center">
                                       <div class="w-1.5 h-4 bg-[#00d0ff] mr-3 shadow-[0_0_8px_#00d0ff] rounded-sm"></div>
                                       查看报告内容
                                    </div>
                                    <button @click="closePreview" class="border border-[#4b92d8]/50 text-[#a5d8ff] hover:text-white hover:bg-[#175aa6]/50 px-5 py-1.5 rounded-md flex items-center justify-center transition-colors duration-300 h-9 tracking-wide hover:shadow-[0_0_15px_rgba(75,146,216,0.3)]">
                                      返回列表
                                    </button>
                                 </div>
                                 <div class="flex-1 border border-[#1f569c]/40 bg-gray-50/95 rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col relative w-[85%] mx-auto h-[600px] overflow-y-auto custom-scrollbar backdrop-blur-md">
                                    <VueOfficeDocx :src="previewReportUrl" class="w-full h-full text-gray-800 min-h-[500px]" />
                                 </div>
                              </template>
                           </div>
                        </template>

                        <template v-else>
                          <div class="w-full h-full flex flex-col items-center justify-center">
                            <div class="text-[32px] font-bold text-[#4b92d8] tracking-widest relative z-10 drop-shadow-[0_0_10px_rgba(75,146,216,0.5)]">{{ prodSubNavItems[activeProdSubNav] }}</div>
                            <div class="text-lg mt-4 text-[#a5d8ff]/50 tracking-widest relative z-10">待填充内容区域</div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                  
                  <template v-else>
                    <div class="w-full h-full flex flex-col justify-center items-center text-[#4b92d8] border-2 border-dashed border-[#1f569c] rounded-xl bg-[#030d24]/50">
                      <div class="text-[40px] font-bold tracking-widest">{{ subNavItems[activeSubNav] }}</div>
                      <div class="text-xl mt-4 opacity-50 tracking-widest">待填充内容区域</div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </section>
        </template>

        <!-- Blank/Other views -->
        <template v-else>
          <div class="flex-1 flex flex-col items-center justify-center h-full w-full bg-[#02050f]">
            <div class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#7dc5ff] to-[#1a3a61] opacity-20 tracking-widest uppercase">
              {{ navItems[activeNav].label }}
            </div>
            <div class="w-24 h-1 bg-[#175aa6]/20 mt-4 rounded-full">
              <div class="h-full bg-[#00d0ff]/40 animate-pulse rounded-full" style="width: 40%"></div>
            </div>
            <div class="text-[#a5d8ff]/30 mt-6 tracking-[0.5em] text-sm font-light">模块开发中 (Module in Development)</div>
          </div>
        </template>
      </main>

      <!-- Bottom Navigation Refined -->
      <footer class="absolute bottom-0 left-0 w-full h-[86px] z-20 flex items-end justify-center pointer-events-none">
        
        <!-- Center Dock Platform Background -->
        <div class="relative w-full h-full flex justify-center pointer-events-auto">
          <!-- The sweeping SVG plate -->
          <svg class="absolute bottom-0 w-full h-full" viewBox="0 0 1920 86" preserveAspectRatio="none">
            <defs>
              <linearGradient id="dockGrad" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stop-color="#054593" stop-opacity="0.9" />
                 <stop offset="100%" stop-color="#021434" stop-opacity="1" />
              </linearGradient>
              <linearGradient id="dockBorder" x1="0" y1="0" x2="1" y2="0">
                 <stop offset="0%" stop-color="rgba(0,163,255,0)" />
                 <stop offset="25%" stop-color="rgba(0,163,255,0.8)" />
                 <stop offset="50%" stop-color="rgba(0,255,255,1)" />
                 <stop offset="75%" stop-color="rgba(0,163,255,0.8)" />
                 <stop offset="100%" stop-color="rgba(0,163,255,0)" />
              </linearGradient>
              <filter id="dockGlow">
                 <feGaussianBlur stdDeviation="3" result="blur" />
                 <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- Flat line stretching across the whole bottom to anchor the sides -->
            <rect x="0" y="80" width="1920" height="6" fill="#011030" />
            <line x1="0" y1="80" x2="1920" y2="80" stroke="#0050aa" stroke-width="1" />

            <!-- The raised central docking station -->
            <!-- We'll make it gracefully curve up from the base line -->
            <path
              d="M 80 86 C 200 86, 260 15, 360 15 L 1560 15 C 1660 15, 1720 86, 1840 86 Z"
              fill="url(#dockGrad)"
            />
            <!-- Glowing stroke highlighting the top edge of the central dock -->
            <path
              d="M 80 86 C 200 86, 260 15, 360 15 L 1560 15 C 1660 15, 1720 86, 1840 86"
              fill="none"
              stroke="url(#dockBorder)"
              stroke-width="2"
              filter="url(#dockGlow)"
            />
          </svg>

          <!-- Nav Items -->
          <nav class="relative z-10 flex space-x-3.5 px-6 pb-3 pt-[18px] h-full items-center">
            <button
              v-for="(item, index) in navItems"
              :key="index"
              @click="activeNav = index"
              class="group relative flex flex-col items-center justify-center cursor-pointer outline-none w-[95px]"
            >
              <div 
                class="flex flex-row items-center justify-center space-x-1.5 transition-all duration-300 relative z-10"
                :class="activeNav === index ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'"
              >
                <!-- Diamond Icon Shell -->
                <div class="relative w-10 h-10 flex items-center justify-center">
                   <!-- Outer glow rotating layer -->
                   <div 
                     class="absolute w-[28px] h-[28px] rotate-45 transition-all duration-300 border"
                     :class="[
                       activeNav === index 
                         ? 'bg-[#0684d8] border-[#00d0ff] shadow-[0_0_15px_rgba(0,208,255,0.8)]' 
                         : 'bg-gradient-to-br from-[#104b8e] to-[#042858] border-[#1f73c4] shadow-[inset_0_0_10px_rgba(31,115,196,0.3)]'
                     ]"
                   ></div>
                   
                   <!-- The Lucide Icon -->
                   <component 
                     :is="item.icon" 
                     class="relative z-10 w-[18px] h-[18px] transition-colors duration-300"
                     :class="activeNav === index ? 'text-white' : 'text-[#8dd4ff]'"
                   />
                </div>

                <!-- Text Label -->
                <span 
                  class="text-[16px] font-bold tracking-tight whitespace-nowrap pt-[2px] transition-all duration-300"
                  :class="activeNav === index ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]' : 'text-[#aee0ff] group-hover:text-white'"
                >
                  {{ item.label }}
                </span>
              </div>
              
              <!-- Active Highlight Bar Below -->
              <div 
                v-if="activeNav === index"
                class="absolute -bottom-[6px] left-[5%] w-[90%] h-[3px] rounded-t-lg bg-gradient-to-r from-transparent via-[#00d0ff] to-transparent shadow-[0_-2px_15px_rgba(0,208,255,1)]"
              ></div>
            </button>
          </nav>
        </div>
      </footer>

      <!-- Floating Report Preview Modal -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="isViewingReportDocx" class="absolute inset-0 z-[100] flex items-center justify-center p-20 pointer-events-none">
          <div class="absolute inset-0 bg-black/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-md pointer-events-auto" @click="isViewingReportDocx = false"></div>
          <div class="w-[1200px] h-[850px] bg-white rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col relative z-10 pointer-events-auto border border-[#2d7ad4]/40">
            <header class="h-16 bg-gradient-to-r from-[#f0f7ff] to-[#e6f0ff] border-b border-[#2d7ad4]/30 flex items-center justify-between px-8 shrink-0">
               <div class="flex items-center gap-4">
                  <div class="w-2.5 h-8 bg-gradient-to-b from-[#2d7ad4] to-[#1b4b8a] rounded-full shadow-[0_0_10px_rgba(45,122,212,0.4)]"></div>
                  <span class="text-[#0a234a] font-bold text-xl tracking-wider">人影业务快报预览 - report.docx</span>
               </div>
               <button @click="isViewingReportDocx = false" class="group flex items-center gap-2 bg-[#2d7ad4] text-white px-6 py-2 rounded-full text-base font-bold hover:bg-[#1b4b8a] transition-all shadow-[0_4px_15px_rgba(45,122,212,0.3)] hover:shadow-[0_6px_20px_rgba(45,122,212,0.5)] active:scale-95">
                  关闭预览
               </button>
            </header>
            <div class="flex-1 overflow-auto bg-[#f8f9fa] p-6 custom-scrollbar">
               <div class="max-w-4xl mx-auto shadow-sm ring-1 ring-black/5">
                 <VueOfficeDocx src="/report.docx" class="w-full" />
               </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  border-radius: 0.125rem;
  border-width: 1px;
  background-color: rgba(13, 27, 62, 0.6);
  border-color: rgba(39, 91, 140, 0.5);
  box-shadow: inset 0 0 20px rgba(39,91,140,0.2);
}
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  background: 
    linear-gradient(to right, #1cc2ff 2px, transparent 2px) 0 0,
    linear-gradient(to bottom, #1cc2ff 2px, transparent 2px) 0 0,
    linear-gradient(to left, #1cc2ff 2px, transparent 2px) 100% 0,
    linear-gradient(to bottom, #1cc2ff 2px, transparent 2px) 100% 0,
    linear-gradient(to right, #1cc2ff 2px, transparent 2px) 0 100%,
    linear-gradient(to top, #1cc2ff 2px, transparent 2px) 0 100%,
    linear-gradient(to left, #1cc2ff 2px, transparent 2px) 100% 100%,
    linear-gradient(to top, #1cc2ff 2px, transparent 2px) 100% 100%;
  background-repeat: no-repeat;
  background-size: 8px 8px;
}
</style>
