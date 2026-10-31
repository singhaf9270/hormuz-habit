const {
  Plugin, PluginSettingTab, Setting, Notice, TFile, TFolder,
  MarkdownRenderChild, ItemView, Modal, moment, AbstractInputSuggest,
} = require("obsidian");

const VIEW_TYPE_HABIT_DASHBOARD = "habit-tracker-dashboard-view";

const DEFAULT_SETTINGS = {
  habits: [{
    id: "habit-1",
    fieldName: "مطالعه",
    habitName: "مطالعه",
    habitEmoji: "📚",
    streakEmoji: "🔥",
    trophyEmoji: "🏆",
    cupEmoji: "🏅",
    minStreakForTrophy: 10,
  }],
  journalPath: "00 بولت ژورنال/00 روزنگار",
  templatePath: "99 - ستاپ/الگوی روزانه.md",
  dailyNotePath: "00 بولت ژورنال/00 روزنگار",
  usePersianCalendar: true,
  language: "fa",
  calendar: "jalali",
  persianDigits: true,
};

function uid() { return "h" + Math.random().toString(36).slice(2, 10); }
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// ============================================================
//  تبدیل تقویم شمسی
// ============================================================
const JALALI_MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
                       "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const JALALI_MONTHS_EN = ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
                          "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"];

function div(a, b) { return ~~(a / b); }
function mod(a, b) { return a - ~~(a / b) * b; }

function jalCal(jy) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
                  1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  if (jy < jp || jy >= breaks[bl - 1]) return null;
  let jump = 0;
  for (let i = 1; i < bl; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy, gm, gd) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
        + div(153 * mod(gm + 9, 12) + 2, 5)
        + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy, jm, jd) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn) {
  let gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      const jm = 1 + div(k, 31);
      const jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    } else k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  const jm = 7 + div(k, 30);
  const jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

function jalaliToDate(jy, jm, jd) {
  const g = d2g(j2d(jy, jm, jd));
  return { gy: g.gy, gm: g.gm, gd: g.gd };
}
function dateToJalali(gy, gm, gd) { return d2j(g2d(gy, gm, gd)); }
function isLeapJalali(jy) { const r = jalCal(jy); return r ? r.leap === 0 : false; }
function daysInJalaliMonth(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalali(jy) ? 30 : 29;
}

// ============================================================
//  Persian helper
// ============================================================
class PersianHelper {
  constructor(plugin) { this.plugin = plugin; this.api = null; }
  init() {
    this.api = null;
    if (!this.plugin.settings.persianDigits) return;
    try {
      const pc = this.plugin.app.plugins.getPlugin("persian-calendar");
      if (pc && pc.api && typeof pc.api.toFaNumber === "function") {
        this.api = pc.api;
      }
    } catch (e) { this.api = null; }
  }
  fa(n) {
    const s = String(n);
    if (!this.plugin.settings.persianDigits) return s;
    if (this.api) { try { return this.api.toFaNumber(s); } catch (e) {} }
    return s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
  }
  isFa() { return this.plugin.settings.language !== "en"; }
  isJalali() { return (this.plugin.settings.calendar || "jalali") === "jalali"; }
  text(fa, en) { return this.isFa() ? fa : en; }
  toJalali(m) { return dateToJalali(m.year(), m.month() + 1, m.date()); }
  fromJalali(jy, jm, jd) {
    const g = jalaliToDate(jy, jm, jd);
    return moment({ year: g.gy, month: g.gm - 1, day: g.gd });
  }
  monthName(month) {
    if (this.isJalali()) return (this.isFa() ? JALALI_MONTHS : JALALI_MONTHS_EN)[month - 1] || "?";
    const fa = ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"];
    const en = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (this.isFa() ? fa : en)[month - 1] || "?";
  }
  formatLong(m) {
    if (this.isJalali()) {
      const j = this.toJalali(m);
      return this.fa(j.jd) + " " + this.monthName(j.jm) + " " + this.fa(j.jy);
    }
    return this.fa(m.date()) + " " + this.monthName(m.month() + 1) + " " + this.fa(m.year());
  }
  weekDayFa(m) {
    const fa = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
    const en = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return (this.isFa() ? fa : en)[m.day()];
  }
  daysInMonth(year, month) { return this.isJalali() ? daysInJalaliMonth(year, month) : new Date(year, month, 0).getDate(); }
  dateForCalendar(year, month, day) { return this.isJalali() ? this.fromJalali(year, month, day) : moment({ year, month: month - 1, day }); }
  calendarParts(m) { return this.isJalali() ? this.toJalali(m) : { jy: m.year(), jm: m.month() + 1, jd: m.date() }; }
}

// ============================================================
//  Path Input Suggest
// ============================================================
let PathInputSuggest = null;
if (typeof AbstractInputSuggest === "function") {
  PathInputSuggest = class extends AbstractInputSuggest {
    constructor(app, textInputEl, kind, extensions) {
      super(app, textInputEl);
      this.kind = kind;
      this.extensions = extensions || null;
    }

    _allItems() {
      if (this.kind === "folder") {
        return this.app.vault.getAllLoadedFiles()
          .filter((f) => f instanceof TFolder)
          .map((f) => f.path)
          .sort((a, b) => a.localeCompare(b, "fa"));
      }
      return this.app.vault.getFiles()
        .filter((f) => !this.extensions || this.extensions.includes(f.extension))
        .map((f) => f.path)
        .sort((a, b) => a.localeCompare(b, "fa"));
    }

    getSuggestions(query) {
      const items = this._allItems();
      const q = (query || "").trim().toLowerCase();
      if (!q) return items;
      const starts = [];
      const contains = [];
      for (const item of items) {
        const lower = item.toLowerCase();
        if (lower.startsWith(q)) starts.push(item);
        else if (lower.includes(q)) contains.push(item);
      }
      return starts.concat(contains);
    }

    renderSuggestion(value, el) { el.setText(value); }
    selectSuggestion(value) { this.setValue(value); this.close(); }
  };
}

// ============================================================
//  جشن طلایی
// ============================================================
function celebrateGolden(targetEl, language = "fa") {
  if (!targetEl) return;
  const goldColors = ["#fbbf24", "#f59e0b", "#d97706", "#fcd34d", "#fde68a", "#ffd700", "#ffed4e"];

  const computed = window.getComputedStyle(targetEl);
  if (computed.position === "static") targetEl.style.position = "relative";
  targetEl.style.overflow = "visible";

  targetEl.classList.add("habit-card-celebrating");

  const overlay = document.createElement("div");
  overlay.className = "habit-celebrate-overlay";
  targetEl.appendChild(overlay);

  const rect = targetEl.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  const makeConfetti = (count, delayMax) => {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const c = document.createElement("div");
      c.className = "habit-celebrate-confetti";
      c.style.background = goldColors[Math.floor(Math.random() * goldColors.length)];
      c.style.left = Math.random() * 100 + "%";
      c.style.width = (5 + Math.random() * 8) + "px";
      c.style.height = (8 + Math.random() * 7) + "px";
      c.style.animationDelay = (Math.random() * delayMax) + "s";
      const shapes = ["2px", "50%", "2px 6px"];
      c.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
      frag.appendChild(c);
    }
    return frag;
  };

  overlay.appendChild(makeConfetti(60, 1.2));
  const wave2 = document.createElement("div");
  const wave3 = document.createElement("div");
  overlay.appendChild(wave2);
  overlay.appendChild(wave3);
  setTimeout(() => wave2.appendChild(makeConfetti(50, 1.2)), 1500);
  setTimeout(() => wave3.appendChild(makeConfetti(50, 1.2)), 3000);

  const cx = w / 2;
  const cy = h / 2;
  const burstFrag = document.createDocumentFragment();
  for (let wave = 0; wave < 5; wave++) {
    const waveDelay = wave * 0.8;
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      p.className = "habit-celebrate-particle";
      p.style.background = goldColors[Math.floor(Math.random() * goldColors.length)];
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.6;
      const dist = 50 + Math.random() * Math.min(w, h) * 0.8;
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      const size = 5 + Math.random() * 9;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.animationDelay = (waveDelay + Math.random() * 0.3) + "s";
      burstFrag.appendChild(p);
    }
  }
  overlay.appendChild(burstFrag);

  const toast = document.createElement("div");
  toast.className = "habit-celebrate-toast";
  toast.textContent = language === "en" ? "🏆 Golden trophy!" : "🏆 کاپ طلایی!";
  targetEl.appendChild(toast);

  // ✅ محو شدن نرم در انتها
  setTimeout(() => {
    overlay.classList.add("fading-out");
    toast.classList.add("fading-out");
    targetEl.classList.remove("habit-card-celebrating");
    setTimeout(() => {
      overlay.remove();
      toast.remove();
      targetEl.style.overflow = "";
    }, 600);
  }, 9500);
}

// ============================================================
//  Progress Bar (خواب / بیدار / کامل / خالی)
// ============================================================
function renderCupProgress(parent, stats, threshold, habit, ph) {
  const wrap = parent.createDiv({ cls: "habit-cup-progress" });

  const safeThreshold = Math.max(1, threshold);
  const currentStreak = stats.currentStreak || 0;
  const isTodayDone = stats.isTodayDone;
  const isComplete = currentStreak > 0 && currentStreak % safeThreshold === 0;
  const streakInCycle = currentStreak % safeThreshold;
  const effectiveInCycle = (currentStreak > 0 && streakInCycle === 0) ? safeThreshold : streakInCycle;

  let fillPct = 0;
  let mode = "empty";

  if (currentStreak === 0) {
    fillPct = 0;
    mode = "empty";
  } else if (!isTodayDone) {
    fillPct = (effectiveInCycle / safeThreshold) * 100;
    mode = "grey";
  } else if (isComplete) {
    fillPct = 100;
    mode = "complete";
  } else {
    fillPct = (effectiveInCycle / safeThreshold) * 100;
    mode = "colored";
  }

  let remainingText = "";
  let isGolden = false;

  if (mode === "empty") {
    remainingText = ph.fa(safeThreshold) + " " + ph.text("روز تا کاپ بعدی", "days to next trophy");
  } else if (mode === "complete") {
    remainingText = ph.text("کاپ جدید آماده شد! 🎉", "New trophy unlocked! 🎉");
    isGolden = true;
  } else if (isTodayDone) {
    const remaining = safeThreshold - effectiveInCycle;
    remainingText = ph.fa(remaining) + " " + ph.text("روز تا کاپ بعدی", "days to next trophy");
    isGolden = remaining <= 2;
  } else {
    const remainingIfToday = safeThreshold - (effectiveInCycle + 1);
    if (remainingIfToday < 0) {
      remainingText = ph.text("امروز بزنی، چرخه جدید شروع می‌شه!", "Log today to start a new cycle!");
      isGolden = true;
    } else {
      remainingText = ph.fa(remainingIfToday) + " " + ph.text("روز تا کاپ بعدی (با ثبت امروز)", "days to next trophy (if logged today)");
      isGolden = remainingIfToday <= 2;
    }
  }

  const labelRow = wrap.createDiv({
    cls: "habit-cup-progress-label" + (isGolden ? " golden" : "") + (mode === "complete" ? " complete" : "")
  });

  const right = labelRow.createDiv({ cls: "habit-cup-progress-right" });
  right.createSpan({ cls: "habit-cup-progress-emoji", text: habit.cupEmoji });
  right.appendText(" ");
  right.appendText(remainingText);

  const left = labelRow.createDiv({ cls: "habit-cup-progress-left" });
  left.appendText(ph.fa(effectiveInCycle) + " / " + ph.fa(safeThreshold));

  const track = wrap.createDiv({ cls: "habit-cup-progress-track" });
  const fill = track.createDiv({ cls: "habit-cup-progress-fill" });

  if (mode === "grey") {
    fill.classList.add("grey");
  } else if (mode === "complete") {
    fill.classList.add("complete");
  } else if (mode === "colored") {
    const ratio = effectiveInCycle / safeThreshold;
    const hue = 260;
    const lightness = 65 - ratio * 30;
    const saturation = 70 + ratio * 25;
    fill.style.background = `linear-gradient(90deg, 
      hsl(${hue}, ${saturation}%, ${lightness + 8}%), 
      hsl(${hue}, ${saturation}%, ${lightness}%),
      hsl(${hue}, ${saturation}%, ${lightness - 5}%))`;
    if (isGolden) {
      fill.style.boxShadow = `0 0 ${8 + ratio * 12}px hsla(${hue}, 90%, ${lightness}%, 0.6)`;
    }
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.width = fillPct + "%";
    });
  });

  return wrap;
}

// ============================================================
//  Render Child (code block)
// ============================================================
class HabitTrackerRenderChild extends MarkdownRenderChild {
  constructor(app, plugin, containerEl, source) {
    super(containerEl);
    this.app = app;
    this.plugin = plugin;
    this.source = source;

    // ✅ ثبت رویداد هماهنگ‌سازی ویجت
    this.registerEvent(
      this.app.workspace.on("habit-tracker:sync", () => {
        try { this.render(); } catch (e) { /* ignore */ }
      })
    );
  }

  render() {
    this.containerEl.empty();
    this.containerEl.setAttribute("dir", this.plugin.settings.language === "en" ? "ltr" : "rtl");

    const src = (this.source || "").trim();
    const lines = src.split(/\n/).map((l) => l.trim()).filter(Boolean);
    const isCompact = lines.includes("compact");
    const nameQuery = lines.find((l) => l !== "compact");

    const all = this.plugin.settings.habits;
    const filtered = nameQuery
      ? all.filter((h) => h.habitName === nameQuery || h.fieldName === nameQuery || h.id === nameQuery)
      : all;

    if (filtered.length === 0) {
      this.containerEl.createDiv({ cls: "habit-empty", text: this.plugin.persianHelper.text("عادتی یافت نشد", "No matching habit found") });
      return;
    }
    filtered.forEach((h) => (isCompact ? this.renderCompact(h) : this.renderFull(h)));
  }

  _bindLogButton(btn, habit, selector) {
    btn.addEventListener("click", async () => {
      const newCup = await this.plugin.logHabit(habit);
      // logHabit خودش syncAll را صدا می‌زند، ولی برای اطمینان این‌جا هم رندر می‌کنیم
      this.render();
      if (newCup) {
        const newCard = this.containerEl.querySelector(selector);
        if (newCard) {
          setTimeout(() => celebrateGolden(newCard, this.plugin.settings.language), 50);
        }
      }
    });
  }

  renderQuantityTools(parent,habit,compact=false){
    if(habit.quantityEnabled){const ph=this.plugin.persianHelper,amount=this.plugin.getTodayAmount(habit),goal=Number(habit.dailyGoal)||0,line=parent.createDiv({cls:"hormuz-quantity-summary"+(compact?" compact":"")});line.createSpan({text:amount===null?ph.text("بدون ثبت مقدار","No amount yet"):ph.fa(amount)+" "+(habit.quantityUnit||"")});if(goal>0)line.createSpan({cls:"goal",text:" / "+ph.fa(goal)+" "+(habit.quantityUnit||"")});const analytics=parent.createEl("button",{cls:"hormuz-analytics-button"+(compact?" compact":""),text:ph.text("📊 تحلیل","📊 Analysis")});analytics.addEventListener("click",()=>this.plugin.openAnalytics(habit));}
  }

  renderFull(habit) {
    const ph = this.plugin.persianHelper;
    const stats = this.plugin.computeHabitStats(habit);
    const card = this.containerEl.createDiv({ cls: "habit-tracker-card" });

    const left = card.createDiv({ cls: "habit-left" });
    const ns = left.createSpan({ cls: "habit-name" });
    ns.createSpan({ cls: "habit-emoji", text: habit.habitEmoji });
    ns.appendText(" " + habit.habitName);
    left.createSpan({ cls: "habit-status-dot " + (stats.activeStreakToday > 0 ? "active" : "") });

    const statsEl = card.createDiv({ cls: "habit-stats" });
    const mk = (num, label, emoji) => {
      const b = statsEl.createDiv({ cls: "stat-box " + (num > 0 ? "active" : "") });
      b.createSpan({ cls: "num", text: ph.fa(num) });
      b.createSpan({ cls: "emoji", text: emoji });
      b.createSpan({ cls: "label", text: label });
    };
    mk(stats.activeStreakToday, ph.text("زنجیره", "Streak"), habit.streakEmoji);
    mk(stats.longestStreak, ph.text("رکورد", "Best"), habit.trophyEmoji);
    mk(stats.totalAccumulatedCups, ph.text("کاپ", "Trophies"), habit.cupEmoji);

    const btnWrap = card.createDiv({ cls: "habit-btn-wrap" });
    const isDone = this.plugin.isTodayDone(habit);
    const btn = btnWrap.createEl("button", {
      cls: "habit-btn " + (isDone ? "done" : ""),
      text: isDone ? ph.text("✓ ثبت شده", "✓ Logged") : ph.text("ثبت", "Log"),
    });
    if (!isDone || habit.quantityEnabled) this._bindLogButton(btn, habit, ".habit-tracker-card");
    this.renderQuantityTools(card,habit,false);

    const progressHolder = this.containerEl.createDiv({ cls: "habit-full-progress" });
    renderCupProgress(progressHolder, stats, habit.minStreakForTrophy || 10, habit, ph);
  }

  renderCompact(habit) {
    const ph = this.plugin.persianHelper;
    const stats = this.plugin.computeHabitStats(habit);
    const card = this.containerEl.createDiv({ cls: "habit-tracker-card" });
    card.style.padding = "10px 14px";

    const left = card.createDiv({ cls: "habit-left" });
    const ns = left.createSpan({ cls: "habit-name" });
    ns.createSpan({ cls: "habit-emoji", text: habit.habitEmoji });
    ns.appendText(" " + habit.habitName);

    const statsEl = card.createDiv({ cls: "habit-stats" });
    const mk = (num, emoji) => {
      const b = statsEl.createDiv({ cls: "stat-box " + (num > 0 ? "active" : "") });
      b.createSpan({ cls: "num", text: ph.fa(num) });
      b.createSpan({ cls: "emoji", text: emoji });
    };
    mk(stats.activeStreakToday, habit.streakEmoji);
    mk(stats.longestStreak, habit.trophyEmoji);
    mk(stats.totalAccumulatedCups, habit.cupEmoji);

    const btnWrap = card.createDiv({ cls: "habit-btn-wrap" });
    const isDone = this.plugin.isTodayDone(habit);
    const btn = btnWrap.createEl("button", {
      cls: "habit-btn " + (isDone ? "done" : ""),
      text: isDone ? "✓" : ph.text("ثبت", "Log"),
    });
    btn.style.padding = "5px 14px";
    if (!isDone || habit.quantityEnabled) this._bindLogButton(btn, habit, ".habit-tracker-card");
    this.renderQuantityTools(card,habit,true);

    const progressHolder = this.containerEl.createDiv({ cls: "habit-compact-progress" });
    renderCupProgress(progressHolder, stats, habit.minStreakForTrophy || 10, habit, ph);
  }
}

// ============================================================
//  Dashboard View
// ============================================================
class HabitDashboardView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.navigation = false;
    this.calState = {};
  }
  getViewType() { return VIEW_TYPE_HABIT_DASHBOARD; }
  getDisplayText() { return this.plugin.settings.language === "en" ? "Habits" : "عادت‌ها"; }
  getIcon() { return "flame"; }
  async onOpen() { this.render(); }
  async onClose() {}

  async render() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("habit-dashboard");
    container.setAttribute("dir", this.plugin.settings.language === "en" ? "ltr" : "rtl");

    const s = this.plugin.settings;
    const ph = this.plugin.persianHelper;
    const now = moment();

    const header = container.createDiv({ cls: "habit-dashboard-header" });
    const title = header.createDiv({ cls: "habit-dashboard-title" });
    title.createSpan({ text: "🔥" });
    title.appendText(this.plugin.persianHelper.text("عادت‌ها", "Habits"));
    const dateEl = header.createDiv({ cls: "habit-dashboard-date" });
    dateEl.createDiv({ text: ph.formatLong(now) });
    dateEl.createDiv({ cls: "sub", text: ph.weekDayFa(now) });

    if (s.habits.length === 0) {
      container.createDiv({ cls: "habit-empty", text: this.plugin.persianHelper.text("هیچ عادتی تعریف نشده", "No habits configured yet") });
      return;
    }

    s.habits.forEach((h) => this.renderCard(container, h));
  }

  renderCard(container, habit) {
    const ph = this.plugin.persianHelper;
    const stats = this.plugin.computeHabitStats(habit);
    const isDone = this.plugin.isTodayDone(habit);

    const streak = stats.activeStreakToday;
    const threshold = habit.minStreakForTrophy || 10;
    const isGolden = streak > 0 && streak % threshold === 0;

    const card = container.createDiv({ cls: "habit-mini-card" + (isGolden ? " golden-mode" : "") });
    card.dataset.habitId = habit.id;

    const header = card.createDiv({ cls: "habit-mini-header" });
    const titleEl = header.createDiv({ cls: "habit-mini-title" });
    titleEl.createSpan({ cls: "emoji", text: habit.habitEmoji });
    titleEl.createSpan({ cls: "name", text: habit.habitName });
    header.createSpan({ cls: "habit-mini-status " + (isDone ? "done" : "") });
    if(habit.quantityEnabled){const amount=this.plugin.getTodayAmount(habit),qline=card.createDiv({cls:"hormuz-quantity-summary dashboard"});qline.setText(amount===null?ph.text("مقدار امروز ثبت نشده","No amount logged today"):ph.fa(amount)+" "+(habit.quantityUnit||"")+(Number(habit.dailyGoal)>0?" / "+ph.fa(habit.dailyGoal)+" "+(habit.quantityUnit||""):""));}

    const statsRow = card.createDiv({ cls: "habit-mini-stats" });
    const addStat = (val, label, emoji) => {
      const b = statsRow.createDiv({ cls: "habit-mini-stat" + (isGolden ? " golden" : "") });
      b.createDiv({ cls: "v", text: ph.fa(val) });
      const l = b.createDiv({ cls: "l" });
      l.createSpan({ text: emoji });
      l.appendText(" " + label);
    };
    addStat(stats.activeStreakToday, ph.text("زنجیره", "Streak"), habit.streakEmoji);
    addStat(stats.longestStreak, ph.text("رکورد", "Best"), habit.trophyEmoji);
    addStat(stats.totalAccumulatedCups, ph.text("کاپ", "Trophies"), habit.cupEmoji);

    const progressHolder = card.createDiv({ cls: "habit-progress-holder" });
    renderCupProgress(progressHolder, stats, threshold, habit, ph);

    this.renderCalendar(card, habit, isGolden);

    if(habit.quantityEnabled){const analyticsBtn=card.createEl("button",{cls:"hormuz-analytics-button dashboard",text:ph.text("📊 تحلیل روند","📊 View analysis")});analyticsBtn.addEventListener("click",()=>this.plugin.openAnalytics(habit));}

    const logWrap = card.createDiv({ cls: "habit-mini-log-wrap" });
    const btn = logWrap.createEl("button", {
      cls: "habit-mini-log-btn " + (isDone ? "done" : "") + (isGolden ? " golden" : ""),
      text: isDone ? ph.text("✓ امروز ثبت شد", "✓ Logged today") : ph.text("+ ثبت امروز", "+ Log today"),
    });
    if (!isDone || habit.quantityEnabled) {
      btn.addEventListener("click", async () => {
        const newCup = await this.plugin.logHabit(habit);
        // logHabit خودش syncAll را صدا می‌زند
        this.render();
        if (newCup) {
          const newCard = container.querySelector(
            '.habit-mini-card[data-habit-id="' + habit.id + '"]'
          );
          if (newCard) {
            setTimeout(() => celebrateGolden(newCard, this.plugin.settings.language), 50);
          }
        }
      });
    }
  }

  refreshCalendar(cardEl, habit) {
    const oldCal = cardEl.querySelector(".habit-cal");
    if (!oldCal) return;
    const isGolden = cardEl.classList.contains("golden-mode");
    oldCal.remove();
    const logWrap = cardEl.querySelector(".habit-mini-log-wrap");
    const newCalHolder = document.createElement("div");
    newCalHolder.style.display = "contents";
    this.renderCalendarInto(newCalHolder, habit, isGolden);
    if (logWrap) cardEl.insertBefore(newCalHolder.firstChild, logWrap);
    else cardEl.appendChild(newCalHolder.firstChild);
  }

  renderCalendar(parent, habit, isGoldenMode) {
    this.renderCalendarInto(parent, habit, isGoldenMode);
  }

  renderCalendarInto(parent, habit, isGoldenMode) {
    const ph = this.plugin.persianHelper;
    const now = moment();
    const nowJ = ph.calendarParts(now);

    if (!this.calState[habit.id] || this.calState[habit.id].calendar !== (this.plugin.settings.calendar || "jalali")) {
      this.calState[habit.id] = { jy: nowJ.jy, jm: nowJ.jm, calendar: this.plugin.settings.calendar || "jalali" };
    }
    const cur = this.calState[habit.id];
    const isCurrentMonth = cur.jy === nowJ.jy && cur.jm === nowJ.jm;

    const cal = parent.createDiv({ cls: "habit-cal" + (isGoldenMode ? " golden-mode" : "") });

    const nav = cal.createDiv({ cls: "habit-cal-nav" });
    const prevBtn = nav.createEl("button", { cls: "habit-cal-nav-btn", text: "‹" });
    prevBtn.addEventListener("click", () => {
      cur.jm--;
      if (cur.jm < 1) { cur.jm = 12; cur.jy--; }
      const cardEl = cal.closest(".habit-mini-card");
      if (cardEl) this.refreshCalendar(cardEl, habit);
      else this.render();
    });

    const titleEl = nav.createDiv({ cls: "habit-cal-title" });
    titleEl.appendText(ph.monthName(cur.jm));
    titleEl.createSpan({ cls: "year", text: ph.fa(cur.jy) });

    const nextBtn = nav.createEl("button", { cls: "habit-cal-nav-btn", text: "›" });
    nextBtn.addEventListener("click", () => {
      cur.jm++;
      if (cur.jm > 12) { cur.jm = 1; cur.jy++; }
      const cardEl = cal.closest(".habit-mini-card");
      if (cardEl) this.refreshCalendar(cardEl, habit);
      else this.render();
    });
    if (isCurrentMonth) nextBtn.disabled = true;

    const wd = cal.createDiv({ cls: "habit-cal-weekdays" });
    const weekdays = ph.isJalali()
      ? (ph.isFa() ? ["ش", "ی", "د", "س", "چ", "پ", "ج"] : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"])
      : (ph.isFa() ? ["ی", "د", "س", "چ", "پ", "ج", "ش"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    weekdays.forEach((d) => wd.createSpan({ text: d }));

    const grid = cal.createDiv({ cls: "habit-cal-grid" });

    const daysCount = ph.daysInMonth(cur.jy, cur.jm);
    const firstMoment = ph.dateForCalendar(cur.jy, cur.jm, 1);
    const dow = firstMoment.day();
    const offsetToStart = ph.isJalali() ? (dow + 1) % 7 : dow;

    for (let i = 0; i < offsetToStart; i++) {
      grid.createDiv({ cls: "habit-cal-day empty" });
    }

    for (let d = 1; d <= daysCount; d++) {
      const dateM = ph.dateForCalendar(cur.jy, cur.jm, d);
      const done = this.plugin.isDayDone(habit, dateM);
      const isToday = dateM.isSame(now, "day");
      const isFuture = dateM.isAfter(now, "day");
      const streak = done ? this.plugin.getStreakAtDate(habit, dateM) : 0;
      const golden = done && streak > 0 && streak % habit.minStreakForTrophy === 0;
      const displayGolden = golden || (isGoldenMode && done);

      const cell = grid.createDiv({
        cls:
          "habit-cal-day " +
          (done ? "done " : "not-done ") +
          (displayGolden ? "golden " : "") +
          (isToday ? "today " : "") +
          (isFuture ? "future" : ""),
      });
      cell.setText(ph.fa(d));
      cell.setAttribute("title", ph.formatLong(dateM) + (done ? (golden ? " 🏆" : " ✓") : " ✗"));
    }
  }
}


class HabitQuantityModal extends Modal {
  constructor(app, plugin, habit, currentValue, onSubmit) { super(app); this.plugin=plugin; this.habit=habit; this.currentValue=currentValue; this.onSubmit=onSubmit; this.resolved=false; }
  finish(value) { if (!this.resolved) { this.resolved=true; this.onSubmit(value); } }
  onOpen() {
    const ph=this.plugin.persianHelper, {contentEl}=this; contentEl.empty(); contentEl.addClass("hormuz-quantity-modal");
    contentEl.setAttribute("dir",this.plugin.settings.language==="en"?"ltr":"rtl");
    contentEl.createEl("h2",{text:ph.text("ثبت مقدار عادت","Log habit amount")});
    contentEl.createEl("p",{cls:"hormuz-modal-desc",text:this.habit.habitName});
    const wrap=contentEl.createDiv({cls:"hormuz-quantity-input-wrap"});
    wrap.createEl("label",{text:ph.text("مقدار امروز","Today's amount")});
    const input=wrap.createEl("input",{type:"number",attr:{min:"0",step:"any",inputmode:"decimal"}});
    input.value=this.currentValue===null||this.currentValue===undefined?"":String(this.currentValue); input.placeholder="0";
    wrap.createDiv({cls:"hormuz-quantity-unit",text:this.habit.quantityUnit||""});
    const goal=Number(this.habit.dailyGoal);
    if(goal>0)contentEl.createDiv({cls:"hormuz-modal-hint",text:ph.text("هدف روزانه: ","Daily goal: ")+ph.fa(goal)+" "+(this.habit.quantityUnit||"")});
    const actions=contentEl.createDiv({cls:"hormuz-modal-actions"});
    const cancel=actions.createEl("button",{text:ph.text("انصراف","Cancel")});
    cancel.addEventListener("click",()=>{this.finish(null);this.close();});
    const save=actions.createEl("button",{cls:"mod-cta",text:ph.text("ثبت مقدار","Save amount")});
    save.addEventListener("click",()=>{const value=Number(input.value);if(input.value.trim()===""||!Number.isFinite(value)||value<0){new Notice(ph.text("یک مقدار معتبر وارد کن.","Enter a valid non-negative amount."));input.focus();return;}this.finish(value);this.close();});
    input.addEventListener("keydown",e=>{if(e.key==="Enter")save.click();}); window.setTimeout(()=>input.focus(),50);
  }
  onClose(){this.finish(null);this.contentEl.empty();}
}

class HabitAnalyticsModal extends Modal {
  constructor(app,plugin,habit){super(app);this.plugin=plugin;this.habit=habit;this.days=7;}
  onOpen(){this.render();}
  render(){
    const ph=this.plugin.persianHelper,{contentEl}=this;contentEl.empty();contentEl.addClass("hormuz-analytics-modal");
    contentEl.setAttribute("dir",this.plugin.settings.language==="en"?"ltr":"rtl");
    contentEl.createEl("h2",{text:(this.habit.habitEmoji||"📊")+" "+ph.text("تحلیل عادت: ","Habit analysis: ")+this.habit.habitName});
    const tabs=contentEl.createDiv({cls:"hormuz-analytics-tabs"});
    [7,30,90].forEach(d=>{const b=tabs.createEl("button",{text:ph.fa(d)+" "+ph.text("روز","days"),cls:this.days===d?"is-active":""});b.addEventListener("click",()=>{this.days=d;this.render();});});
    const from=moment().subtract(this.days-1,"days").startOf("day"),now=moment();
    const pages=this.plugin.getHabitPages(this.habit),byDay=new Map();
    pages.forEach(p=>{if(p.day.isSameOrAfter(from,"day")&&p.day.isSameOrBefore(now,"day")&&p.amount!==null)byDay.set(p.day.format("YYYY-MM-DD"),p.amount);});
    const values=[];for(let i=0;i<this.days;i++){const day=from.clone().add(i,"days"),key=day.format("YYYY-MM-DD");values.push({day,amount:byDay.get(key)||0,recorded:byDay.has(key)});}
    const recorded=values.filter(v=>v.recorded),total=recorded.reduce((a,v)=>a+v.amount,0),avgActive=recorded.length?total/recorded.length:0,avgCalendar=total/this.days,weekly=total/(this.days/7);
    const best=recorded.reduce((a,v)=>!a||v.amount>a.amount?v:a,null),goal=Number(this.habit.dailyGoal)>0?Number(this.habit.dailyGoal):0;
    const goalDays=goal?recorded.filter(v=>v.amount>=goal).length:0,pct=goal?Math.round(goalDays/this.days*100):0;
    const half=Math.floor(values.length/2),first=values.slice(0,half).reduce((a,v)=>a+v.amount,0)/Math.max(1,half),second=values.slice(half).reduce((a,v)=>a+v.amount,0)/Math.max(1,values.length-half);
    const trend=second>first*1.05?ph.text("روند صعودی ↗","Trending up ↗"):second<first*.95?ph.text("روند نزولی ↘","Trending down ↘"):ph.text("تقریباً ثابت →","Mostly steady →");
    const unit=this.habit.quantityUnit||"",grid=contentEl.createDiv({cls:"hormuz-analytics-grid"});
    const metric=(label,value)=>{const box=grid.createDiv({cls:"hormuz-analytics-metric"});box.createDiv({cls:"label",text:label});box.createDiv({cls:"value",text:value});};
    metric(ph.text("مجموع","Total"),ph.fa(Number(total.toFixed(2)))+" "+unit);
    metric(ph.text("میانگین روزهای ثبت‌شده","Avg. active day"),ph.fa(Number(avgActive.toFixed(2)))+" "+unit);
    metric(ph.text("میانگین روز تقویمی","Calendar-day avg."),ph.fa(Number(avgCalendar.toFixed(2)))+" "+unit);
    metric(ph.text("میانگین هفتگی","Weekly avg."),ph.fa(Number(weekly.toFixed(2)))+" "+unit);
    metric(ph.text("روزهای دارای ثبت","Active days"),ph.fa(recorded.length)+" / "+ph.fa(this.days));
    if(goal)metric(ph.text("تحقق هدف","Goal hit rate"),ph.fa(pct)+"%");
    metric(ph.text("بهترین روز","Best day"),best?ph.fa(best.amount)+" "+unit+" · "+ph.formatLong(best.day):"—");
    metric(ph.text("روند","Trend"),trend);
    const chart=contentEl.createDiv({cls:"hormuz-analytics-chart"});chart.createEl("h3",{text:ph.text("روند مقدار ثبت‌شده","Recorded amount trend")});
    const max=Math.max(1,...values.map(v=>v.amount),goal),bars=chart.createDiv({cls:"hormuz-analytics-bars"});
    values.forEach((v,i)=>{const col=bars.createDiv({cls:"hormuz-analytics-bar-col"}),bar=col.createDiv({cls:"hormuz-analytics-bar"});bar.style.height=Math.max(v.amount>0?3:1,v.amount/max*100)+"%";bar.setAttribute("title",ph.formatLong(v.day)+": "+ph.fa(v.amount)+" "+unit);if(goal&&v.amount>=goal)bar.addClass("goal-met");if(this.days===7||i%(this.days===30?5:15)===0||i===values.length-1)col.createDiv({cls:"hormuz-analytics-axis",text:ph.fa(ph.calendarParts(v.day).jd)});});
    if(!recorded.length)contentEl.createDiv({cls:"hormuz-modal-hint",text:ph.text("هنوز مقداری برای این بازه ثبت نشده است.","No quantities recorded in this period yet.")});
  }
  onClose(){this.contentEl.empty();}
}

// ============================================================
//  Plugin
// ============================================================
class HabitTrackerPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.persianHelper = new PersianHelper(this);
    this.persianHelper.init();

    this._pagesCache = new Map();
    this._cacheInvalid = true;

    this.registerView(VIEW_TYPE_HABIT_DASHBOARD, (leaf) => new HabitDashboardView(leaf, this));
    this.addRibbonIcon("flame", "HormuzHabit", () => this.activateView());
    this.addCommand({
      id: "open-dashboard",
      name: this.settings.language === "en" ? "Open habit dashboard" : "باز کردن داشبورد",
      callback: () => this.activateView(),
    });

    // ---------------------------------------------------------
    //  Code Blocks
    // ---------------------------------------------------------

    this.registerMarkdownCodeBlockProcessor("habit-tracker", (source, el, ctx) => {
      const child = new HabitTrackerRenderChild(this.app, this, el, source);
      ctx.addChild(child);
      child.render();
    });

    this.registerMarkdownCodeBlockProcessor("habit", (source, el, ctx) => {
      const name = (source || "").trim();
      const child = new HabitTrackerRenderChild(this.app, this, el, name);
      ctx.addChild(child);
      child.render();
    });

    this.registerMarkdownCodeBlockProcessor("habit-compact", (source, el, ctx) => {
      const name = (source || "").trim();
      const child = new HabitTrackerRenderChild(this.app, this, el, "compact\n" + name);
      ctx.addChild(child);
      child.render();
    });

    // ---------------------------------------------------------
    //  Events
    // ---------------------------------------------------------
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        const jp = (this.settings.journalPath || "").replace(/^"|"$/g, "");
        if (jp && file && !file.path.startsWith(jp)) return;
        this._cacheInvalid = true;
        this._scheduleRefresh();
      })
    );

    this.addSettingTab(new HabitTrackerSettingTab(this.app, this));
  }

  onunload() {
    if (this._t) { clearTimeout(this._t); this._t = null; }
    this._pagesCache = null;
  }

  _scheduleRefresh() {
    if (this._t) clearTimeout(this._t);
    this._t = setTimeout(() => this.refreshAll(), 600);
  }

  // ✅ هماهنگ‌سازی ویجت‌ها و داشبورد
  syncAll() {
    this._cacheInvalid = true;
    this._pagesCache.clear();

    // ۱) داشبورد را رفرش کن
    this.app.workspace.getLeavesOfType(VIEW_TYPE_HABIT_DASHBOARD).forEach((leaf) => {
      if (leaf.view instanceof HabitDashboardView) leaf.view.render();
    });

    // ۲) ویجت‌ها را رفرش کن (با رویداد)
    this.app.workspace.trigger("habit-tracker:sync");
  }

  refreshAll(opts = {}) {
    if (!opts.force && typeof document !== "undefined" && document.querySelector(".habit-celebrate-overlay")) {
      return;
    }
    this.persianHelper.init();
    this.syncAll();
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_HABIT_DASHBOARD);
    if (leaves.length > 0) leaf = leaves[0];
    else {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_HABIT_DASHBOARD, active: true });
    }
    workspace.revealLeaf(leaf);
  }

  async loadSettings() {
    const loaded = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded || {});
    if (this.settings.language !== "en") this.settings.language = "fa";
    if (this.settings.calendar !== "gregorian") this.settings.calendar = "jalali";
    if (typeof this.settings.persianDigits !== "boolean") this.settings.persianDigits = true;
    if (!Array.isArray(this.settings.habits)) {
      this.settings.habits = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.habits));
    }
    this.settings.habits.forEach((h) => { if (!h.id) h.id = uid(); if (h.quantityEnabled && !h.quantityFieldName) h.quantityFieldName = "hormuz_" + String(h.id).replace(/[^a-zA-Z0-9_-]/g, "_") + "_amount"; });
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this._cacheInvalid = true;
    this.refreshAll({ force: true });
  }

  _getHabitPagesCached(habit) {
    if (!this._cacheInvalid && this._pagesCache.has(habit.id)) {
      return this._pagesCache.get(habit.id);
    }
    const pages = this.getHabitPages(habit);
    this._pagesCache.set(habit.id, pages);
    return pages;
  }

  _invalidateCacheIfNeeded() {
    if (this._cacheInvalid) {
      this._pagesCache.clear();
      this._cacheInvalid = false;
    }
  }

  getHabitPages(habit) {
    this._invalidateCacheIfNeeded();
    const s = this.settings;
    const today = moment();
    const pages = [];
    const folder = s.journalPath.replace(/^"|"$/g, "");
    const prefix = folder ? folder + "/" : "";
    const files = this.app.vault.getMarkdownFiles();
    for (const f of files) {
      if (prefix && !f.path.startsWith(prefix)) continue;
      const cache = this.app.metadataCache.getFileCache(f);
      if (!cache || !cache.frontmatter) continue;
      const fm = cache.frontmatter;
      if (fm[habit.fieldName] === undefined) continue;
      let day = null;
      if (fm.day) {
        const d = moment(String(fm.day), "YYYY-MM-DD", true);
        if (d.isValid()) day = d;
      }
      if (!day) {
        const d = moment(f.basename, "YYYY-MM-DD", true);
        if (d.isValid()) day = d;
      }
      if (!day) continue;
      if (day.isAfter(today, "day")) continue;
      const amountRaw = habit.quantityFieldName ? fm[habit.quantityFieldName] : null;
      const amount = amountRaw === null || amountRaw === undefined || amountRaw === "" ? null : Number(amountRaw);
      pages.push({ day, complete: !!fm[habit.fieldName], amount: Number.isFinite(amount) ? amount : null });
    }
    pages.sort((a, b) => a.day.valueOf() - b.day.valueOf());
    return pages;
  }

  computeHabitStats(habit) {
    const pages = this.getHabitPages(habit);
    const today = moment();
    const threshold = habit.minStreakForTrophy || 10;
    let current = 0, longest = 0, cups = 0, lastCompleteDate = null;

    const flushStreak = () => {
      if (current > 0) {
        if (current > longest) longest = current;
        cups += Math.floor(current / threshold);
        current = 0;
      }
    };

    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      if (i > 0) {
        const diff = p.day.diff(pages[i - 1].day, "days");
        if (diff > 1 && current > 0) flushStreak();
      }
      if (p.complete) {
        current++;
        lastCompleteDate = p.day;
        if (current > longest) longest = current;
      } else {
        if (!p.day.isSame(today, "day") && current > 0) flushStreak();
      }
    }

    const todayStart = today.clone().startOf("day");
    const isTodayDone = !!(lastCompleteDate && lastCompleteDate.isSame(todayStart, "day"));

    let active = 0;
    let previousStreak = 0;
    let currentForProgress = 0;
    let activeCups = 0;

    if (current > 0 && lastCompleteDate) {
      const diff = todayStart.diff(lastCompleteDate.clone().startOf("day"), "days");

      if (diff <= 1) {
        active = current;
        currentForProgress = current;

        if (isTodayDone) {
          previousStreak = Math.max(0, current - 1);
        } else {
          previousStreak = current;
        }
      } else {
        active = 0;
        currentForProgress = 0;
        previousStreak = 0;
      }

      activeCups = Math.floor(current / threshold);
    }

    return {
      activeStreakToday: active,
      currentStreak: currentForProgress,
      previousStreak: previousStreak,
      isTodayDone: isTodayDone,
      longestStreak: longest,
      totalAccumulatedCups: cups + activeCups,
    };
  }

  getStreakAtDate(habit, date) {
    const pages = this.getHabitPages(habit);
    let streak = 0;
    let prevDay = null;
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      if (p.day.isAfter(date, "day")) break;
      if (prevDay) {
        const diff = p.day.diff(prevDay, "days");
        if (diff > 1) streak = 0;
      }
      if (p.complete) streak++;
      else streak = 0;
      prevDay = p.day;
      if (p.day.isSame(date, "day")) return p.complete ? streak : 0;
    }
    return 0;
  }

  getTodayAmount(habit) {
    if (!habit.quantityEnabled || !habit.quantityFieldName) return null;
    const today = moment();
    const page = this.getHabitPages(habit).find((p) => p.day.isSame(today, "day"));
    return page && Number.isFinite(page.amount) ? page.amount : null;
  }

  isDayDone(habit, date) {
    const target = date.format("YYYY-MM-DD");
    const folder = this.settings.journalPath.replace(/^"|"$/g, "");
    const prefix = folder ? folder + "/" : "";
    const directPath = prefix + target + ".md";

    const direct = this.app.vault.getAbstractFileByPath(directPath);
    if (direct instanceof TFile) {
      const cache = this.app.metadataCache.getFileCache(direct);
      if (cache && cache.frontmatter && cache.frontmatter[habit.fieldName] !== undefined) {
        return !!cache.frontmatter[habit.fieldName];
      }
    }

    const pages = this.getHabitPages(habit);
    for (const p of pages) {
      if (p.day.isSame(date, "day")) return p.complete;
    }
    return false;
  }

  isTodayDone(habit) { return this.isDayDone(habit, moment()); }

  promptQuantity(habit,currentValue){return new Promise(resolve=>new HabitQuantityModal(this.app,this,habit,currentValue,resolve).open());}
  openAnalytics(habit){new HabitAnalyticsModal(this.app,this,habit).open();}

  async logHabit(habit) {
    let amount=null;
    if(habit.quantityEnabled){amount=await this.promptQuantity(habit,this.getTodayAmount(habit));if(amount===null)return false;if(!habit.quantityFieldName)habit.quantityFieldName="hormuz_"+String(habit.id).replace(/[^a-zA-Z0-9_-]/g,"_")+"_amount";}
    const todayStr = moment().format("YYYY-MM-DD");
    const folder = this.settings.dailyNotePath.replace(/^"|"$/g, "");
    const prefix = folder ? folder + "/" : "";
    const filePath = prefix + todayStr + ".md";
    const threshold = habit.minStreakForTrophy || 10;

    try {
      const existing = this.app.vault.getAbstractFileByPath(filePath);
      if (existing instanceof TFile) {
        await this.app.fileManager.processFrontMatter(existing, (fm) => { fm[habit.fieldName] = true; if (habit.quantityEnabled) fm[habit.quantityFieldName] = amount; });
      } else {
        let content;
        const tpl = this.app.vault.getAbstractFileByPath(this.settings.templatePath);
        if (tpl instanceof TFile) {
          let raw = await this.app.vault.read(tpl);
          raw = raw
            .replace(/\{\{date\}\}/g, todayStr)
            .replace(/\{\{title\}\}/g, todayStr)
            .replace(/\{\{time\}\}/g, moment().format("HH:mm"));
          content = this._injectFrontmatter(raw, habit.fieldName, "true");
        } else {
          content = "---\n" + habit.fieldName + ": true\n---\n# " + todayStr + "\n";
        }
        if (folder && !this.app.vault.getAbstractFileByPath(folder)) {
          await this.app.vault.createFolder(folder).catch(() => {});
        }
        const created = await this.app.vault.create(filePath, content);
        if (habit.quantityEnabled) await this.app.fileManager.processFrontMatter(created, (fm) => { fm[habit.fieldName] = true; fm[habit.quantityFieldName] = amount; });
      }
      new Notice("✅ " + habit.habitName + " " + this.persianHelper.text("ثبت شد", "logged"));
    } catch (e) {
      new Notice("❌ " + e.message);
      console.error(e);
      return false;
    }

    this._cacheInvalid = true;
    await new Promise((r) => setTimeout(r, 200));
    this._pagesCache.clear();

    // ✅ هماهنگ‌سازی ویجت و سایدبار
    this.syncAll();

    const after = this.computeHabitStats(habit).activeStreakToday;
    if (after > 0 && after % threshold === 0) return true;
    return false;
  }

  async _setFrontmatterField(file, field, value) {
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      fm[field] = value;
    });
  }

  _injectFrontmatter(content, field, value) {
    if (content.startsWith("---")) {
      const end = content.indexOf("---", 3);
      if (end !== -1) {
        const fm = content.substring(0, end + 3);
        const rest = content.substring(end + 3);
        const re = new RegExp("^" + escRe(field) + ":\\s*.*$", "m");
        let nf;
        if (re.test(fm)) nf = fm.replace(re, field + ": " + value);
        else nf = fm.replace(/\n?---$/, "\n" + field + ": " + value + "\n---");
        return nf + rest;
      }
    }
    return "---\n" + field + ": " + value + "\n---\n" + content;
  }
}

// ============================================================
//  Settings
// ============================================================
class HabitTrackerSettingTab extends PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    const s = this.plugin.settings;
    const fa = s.language !== "en";
    containerEl.setAttribute("dir", fa ? "rtl" : "ltr");
    containerEl.addClass("hormuz-habit-settings");
    const tx = (f, e) => fa ? f : e;
    containerEl.createEl("h2", { text: "HormuzHabit" });
    containerEl.createEl("p", { cls: "hormuz-settings-intro", text: tx("عادت‌هایت را با یک تقویم، نوار پیشرفت و زنجیره‌های انگیزه‌بخش دنبال کن.", "Track your habits with a calendar, progress bars, and motivating streaks.") });

    const g = containerEl.createDiv({ cls: "hormuz-settings-section" });
    g.createEl("h3", { text: tx("تنظیمات عمومی", "General settings") });

    new Setting(g).setName(tx("زبان رابط کاربری", "Interface language"))
      .setDesc(tx("زبان نوشته‌ها و تنظیمات پلاگین را انتخاب کن.", "Choose the language used in the plugin interface and settings."))
      .addDropdown((d) => d.addOption("fa", "فارسی").addOption("en", "English").setValue(s.language || "fa").onChange(async (v) => {
        s.language = v; await this.plugin.saveSettings(); this.display();
      }));

    new Setting(g).setName(tx("نوع تقویم", "Calendar system"))
      .setDesc(tx("تقویم شمسی یا میلادی را برای نمایش انتخاب کن. نام فایل‌های روزانه همچنان با تاریخ میلادی ISO شناسایی می‌شود.", "Choose Jalali or Gregorian dates for display. Daily notes are still identified using ISO Gregorian filenames."))
      .addDropdown((d) => d.addOption("jalali", tx("شمسی", "Jalali" )).addOption("gregorian", tx("میلادی", "Gregorian")).setValue(s.calendar || "jalali").onChange(async (v) => {
        s.calendar = v; s.usePersianCalendar = v === "jalali"; await this.plugin.saveSettings(); this.display();
      }));

    new Setting(g).setName(tx("استفاده از اعداد فارسی", "Use Persian digits"))
      .setDesc(tx("اعداد روی ویجت، تقویم و نوار پیشرفت فارسی نمایش داده شوند.", "Display Persian digits in widgets, calendars, and progress bars."))
      .addToggle((t) => t.setValue(s.persianDigits !== false).onChange(async (v) => {
        s.persianDigits = v; this.plugin.persianHelper.init(); await this.plugin.saveSettings(); this.display();
      }));

    const pathSection = containerEl.createDiv({ cls: "hormuz-settings-section" });
    pathSection.createEl("h3", { text: tx("مسیرها", "Paths") });
    pathSection.createEl("p", { cls: "setting-item-description", text: tx("مسیرها را تایپ کن یا از پیشنهادهای خودکار انتخاب کن.", "Type a path or choose from autocomplete suggestions.") });

    this.addPathSetting(pathSection, {
      key: "journalPath", label: tx("پوشه روزنگار", "Journal folder"),
      desc: tx("پوشه‌ای که یادداشت‌های ثبت عادت در آن جست‌وجو می‌شوند.", "Folder scanned for habit entries."), kind: "folder"
    });
    this.addPathSetting(pathSection, {
      key: "dailyNotePath", label: tx("پوشه ساخت یادداشت روزانه", "Daily note folder"),
      desc: tx("یادداشت امروز در این پوشه ساخته یا به‌روزرسانی می‌شود.", "Today's note is created or updated in this folder."), kind: "folder"
    });
    this.addPathSetting(pathSection, {
      key: "templatePath", label: tx("قالب یادداشت روزانه", "Daily note template"),
      desc: tx("قالب اختیاری برای ساخت یادداشت جدید؛ فایل را از پیشنهادها انتخاب کن.", "Optional template used when creating a new note; select it from suggestions."), kind: "file"
    });

    const hs = containerEl.createDiv({ cls: "hormuz-settings-section" });
    hs.createEl("h3", { text: tx("عادت‌ها", "Habits") });
    s.habits.forEach((h) => this.renderHabitCard(hs, h, tx));
    const addBtn = hs.createEl("button", { cls: "habit-settings-add", text: tx("＋ افزودن عادت", "＋ Add habit") });
    addBtn.addEventListener("click", async () => {
      s.habits.push({ id: uid(), fieldName: fa ? "عادت جدید" : "New habit", habitName: fa ? "عادت جدید" : "New habit", habitEmoji: "⭐", streakEmoji: "🔥", trophyEmoji: "🏆", cupEmoji: "🏅", minStreakForTrophy: 10 });
      await this.plugin.saveSettings(); this.display();
    });

    renderCreatorSupport(containerEl, s.language || 'fa');
  }

  addPathSetting(parent, opts) {
    const s = this.plugin.settings;
    const setting = new Setting(parent).setName(opts.label).setDesc(opts.desc);
    setting.addText((t) => {
      t.setPlaceholder(opts.kind === "folder" ? "folder/subfolder" : "folder/template.md").setValue(s[opts.key] || "").onChange(async (v) => {
        s[opts.key] = v.trim(); await this.plugin.saveSettings();
      });
      if (PathInputSuggest) new PathInputSuggest(this.app, t.inputEl, opts.kind, opts.kind === "file" ? ["md"] : null);
    });
  }

  renderHabitCard(parent, habit, tx) {
    const card = parent.createDiv({ cls: "habit-settings-item" });
    const header = card.createDiv({ cls: "habit-settings-header" });
    const t = header.createDiv({ cls: "habit-settings-title" });
    t.createSpan({ text: habit.habitEmoji }); t.appendText(habit.habitName || (this.plugin.settings.language === "en" ? "Unnamed habit" : "بدون نام"));
    const del = header.createEl("button", { cls: "habit-settings-delete", text: tx("🗑 حذف", "🗑 Delete") });
    del.addEventListener("click", async () => { this.plugin.settings.habits = this.plugin.settings.habits.filter((h) => h.id !== habit.id); await this.plugin.saveSettings(); this.display(); });
    const grid = card.createDiv({ cls: "habit-settings-grid" });
    const field = (label, key, val, isNum = false) => {
      const w = grid.createDiv({ cls: "habit-settings-field" }); w.createEl("label", { text: label });
      const inp = w.createEl("input", { type: isNum ? "number" : "text" }); inp.value = val == null ? "" : String(val);
      inp.addEventListener("change", async () => { if (isNum) { const n = key === "dailyGoal" ? parseFloat(inp.value) : parseInt(inp.value); if (!isNaN(n) && n > 0) habit[key] = n; } else habit[key] = inp.value; await this.plugin.saveSettings(); });
    };
    field(tx("نام نمایشی", "Display name"), "habitName", habit.habitName);
    field(tx("نام فیلد Frontmatter", "Frontmatter field"), "fieldName", habit.fieldName);
    field(tx("ایموجی عادت", "Habit emoji"), "habitEmoji", habit.habitEmoji);
    field(tx("حد نصاب جایزه", "Trophy threshold"), "minStreakForTrophy", habit.minStreakForTrophy, true);
    field(tx("ایموجی زنجیره", "Streak emoji"), "streakEmoji", habit.streakEmoji);
    field(tx("ایموجی رکورد", "Record emoji"), "trophyEmoji", habit.trophyEmoji);
    field(tx("ایموجی کاپ", "Cup emoji"), "cupEmoji", habit.cupEmoji);
    const qToggle=grid.createDiv({cls:"habit-settings-field hormuz-quantity-toggle"});qToggle.createEl("label",{text:tx("ثبت کمیت برای این عادت","Track a quantity for this habit")});const qCheck=qToggle.createEl("input",{type:"checkbox"});qCheck.checked=!!habit.quantityEnabled;qCheck.addEventListener("change",async()=>{habit.quantityEnabled=qCheck.checked;if(habit.quantityEnabled&&!habit.quantityFieldName)habit.quantityFieldName="hormuz_"+String(habit.id).replace(/[^a-zA-Z0-9_-]/g,"_")+"_amount";await this.plugin.saveSettings();this.display();});
    field(tx("واحد (مثلاً دقیقه، صفحه، لیوان)","Unit (e.g. minutes, pages, cups)"),"quantityUnit",habit.quantityUnit||"");
    field(tx("هدف روزانه","Daily goal"),"dailyGoal",habit.dailyGoal||"",true);
  }
}

// ============================================================
//  Creator Support Section
// ============================================================
function renderCreatorSupport(container, language) {
  const fa = language === 'fa';
  const doc = container.ownerDocument;
  function el(parent, tag, cls, text) {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    parent.appendChild(node);
    return node;
  }
  function link(parent, cls, url, label) {
    const node = el(parent, 'a', cls);
    node.setAttribute('href', url);
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
    node.setAttribute('aria-label', label);
    return node;
  }
  function logo(parent, type) {
    const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', type === 'bale' ? '0 0 64 64' : '0 0 24 24');
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');
    svg.setAttribute('aria-hidden', 'true');
    function shape(tag, attrs) {
      const node = doc.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
      svg.appendChild(node);
    }
    if (type === 'bale') {
      shape('circle', { cx: '32', cy: '32', r: '30', fill: '#22A06B' });
      shape('path', { d: 'M20 33 L28 41 L46 23', fill: 'none', stroke: '#fff', 'stroke-width': '6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    } else if (type === 'telegram') {
      shape('path', { fill: '#229ED9', d: 'M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z' });
    } else if (type === 'youtube') {
      shape('path', { fill: '#FF0000', d: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z' });
      shape('path', { fill: '#fff', d: 'M9.6 8.4v7.2l6.2-3.6z' });
    } else {
      shape('path', { d: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linejoin': 'round' });
    }
    parent.appendChild(svg);
  }
  const root = el(container, 'section', 'ot-support');
  root.setAttribute('dir', fa ? 'rtl' : 'ltr');
  root.setAttribute('aria-label', fa ? 'ارتباط با ما و حمایت' : 'Connect and support');
  el(root, 'style', '', `
    .ot-support{margin-block:32px 16px;color:var(--text-normal)}
    .ot-support .ot-contact-heading{margin:0 0 6px;font-size:1.1em;font-weight:650;color:var(--text-normal)}
    .ot-support .ot-contact-intro{margin:0 0 16px;font-size:.88em;line-height:1.8;color:var(--text-muted)}
    .ot-support .ot-channel-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .ot-support a.ot-channel{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0;padding:18px 5px 12px;border:1px solid var(--background-modifier-border);border-radius:14px;background:var(--background-primary);color:var(--text-normal);text-decoration:none;box-shadow:0 3px 12px rgba(0,0,0,.025)}
    .ot-support .ot-channel-logo{display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:14px;background:var(--background-secondary)}
    .ot-support .ot-channel-logo svg{display:block;width:28px;height:28px;flex:none}
    .ot-support .ot-channel-name{font-size:.88em;font-weight:650;line-height:1.5;text-align:center}
    .ot-support .ot-channel-handle{font-size:clamp(9px,2.4vw,11px);color:var(--text-muted);direction:ltr;unicode-bidi:isolate;white-space:nowrap}
    .ot-support .ot-channel-join{margin-top:3px;font-size:.78em;color:var(--text-muted);line-height:1.8}
    .ot-support .ot-donation{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:16px;padding:18px;border:1px solid var(--background-modifier-border);border-radius:14px;background:var(--background-secondary)}
    .ot-support .ot-donation-symbol{display:flex;align-items:center;justify-content:center;flex:0 0 42px;height:42px;border:1px solid var(--background-modifier-border);border-radius:50%;background:var(--background-primary);color:var(--text-accent)}
    .ot-support .ot-donation-symbol svg{width:21px;height:21px}
    .ot-support .ot-donation-copy{flex:1 1 150px;min-width:0}
    .ot-support .ot-donation-title{margin:0 0 4px;font-size:.95em;font-weight:650;color:var(--text-normal)}
    .ot-support .ot-donation-desc{margin:0;font-size:.82em;line-height:1.9;color:var(--text-muted)}
    .ot-support a.ot-donation-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:38px;padding:8px 18px;border-radius:9px;background:var(--interactive-accent);color:var(--text-on-accent);font-size:.85em;font-weight:600;text-decoration:none;white-space:nowrap;margin-inline-start:auto}
    .ot-support a:focus-visible{outline:2px solid var(--interactive-accent);outline-offset:4px}
  `);
  el(root, 'h3', 'ot-contact-heading', fa ? 'همراه ما باشید' : 'Stay connected');
  el(root, 'p', 'ot-contact-intro', fa ? 'آموزش‌ها، تازه‌ها و نکته‌های کاربردی ابسیدین را در کانال‌های ما دنبال کنید.' : 'Follow our channels for Obsidian tutorials, updates and practical tips.');
  const grid = el(root, 'div', 'ot-channel-grid');
  const channels = [
    ['bale', fa ? 'بله' : 'Bale', 'https://ble.ir/obsidiantut'],
    ['telegram', fa ? 'تلگرام' : 'Telegram', 'https://t.me/obsidiantut'],
    ['youtube', fa ? 'یوتیوب' : 'YouTube', 'https://youtube.com/@obsidiantut']
  ];
  for (const [type, name, url] of channels) {
    const card = link(grid, 'ot-channel', url, (fa ? 'عضویت در کانال ' : 'Join our ') + name);
    logo(el(card, 'span', 'ot-channel-logo'), type);
    el(card, 'span', 'ot-channel-name', name);
    const handle = el(card, 'span', 'ot-channel-handle', '@obsidiantut');
    handle.setAttribute('dir', 'ltr');
    el(card, 'span', 'ot-channel-join', fa ? 'عضویت در کانال ↗' : 'Join channel ↗');
  }
  const donate = el(root, 'div', 'ot-donation');
  logo(el(donate, 'span', 'ot-donation-symbol'), 'heart');
  const copy = el(donate, 'div', 'ot-donation-copy');
  el(copy, 'h4', 'ot-donation-title', fa ? 'با همراهی شما، ادامه می‌دهیم' : 'Help this project grow');
  el(copy, 'p', 'ot-donation-desc', fa ? 'اگر این افزونه برایتان مفید بوده، می‌توانید از ادامهٔ توسعهٔ آن حمایت کنید.' : 'If this plugin helps you, consider supporting its continued development.');
  const button = link(donate, 'ot-donation-button', 'https://reymit.ir/singhaf9270', fa ? 'حمایت مالی از سازنده در ریمیت' : 'Support the creator on Reymit');
  button.textContent = fa ? 'حمایت مالی ↗' : 'Donate ↗';
}

module.exports = HabitTrackerPlugin;