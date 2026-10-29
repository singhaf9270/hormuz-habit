# HormuzHabit

**A bilingual habit-tracking plugin for Obsidian, built around daily notes, streaks, and milestone rewards.**

**پیگیری عادت‌ها در Obsidian؛ از ثبت روزانه تا زنجیره‌های پیوسته و پاداش‌های قابل شخصی‌سازی.**

<p align="center">
  <a href="https://github.com/singhaf9270/hormuz-habit/releases">
    <img src="https://img.shields.io/badge/version-1.0.0-7C3AED?style=flat-square" alt="Version 1.0.0">
  </a>
  <img src="https://img.shields.io/badge/Obsidian-%3E%3D1.5.0-7C3AED?style=flat-square&logo=obsidian" alt="Obsidian 1.5.0 or later">
  <img src="https://img.shields.io/badge/license-MIT-16A34A?style=flat-square" alt="MIT License">
</p>

<p align="center">
  <a href="#فارسی">فارسی</a> ·
  <a href="#english">English</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#usage">Usage</a>
</p>

---

## فارسی

### پیگیری عادت‌ها، در بستر یادداشت‌های روزانه

**HormuzHabit** یک افزونهٔ پیگیری عادت برای [Obsidian](https://obsidian.md) است که ثبت عادت‌ها را به یادداشت‌های روزانهٔ خودت متصل می‌کند.

عادت‌ها را تعریف کن، پیشرفت روزانه را ثبت کن، زنجیره‌های پیوسته‌ات را دنبال کن و برای رسیدن به نقاط عطف، کاپ طلایی بگیر. اطلاعات عادت‌ها در Frontmatter یادداشت‌های روزانه ذخیره می‌شوند و داشبورد افزونه، نمایی یکپارچه از سابقه و پیشرفت آن‌ها ارائه می‌دهد.

رابط فارسی و انگلیسی، پشتیبانی از تقویم شمسی و میلادی و امکان تنظیم پاداش برای هر عادت، این افزونه را برای گردش کارهای متفاوت قابل استفاده می‌کند.

### قابلیت‌ها

| قابلیت | توضیحات |
|---|---|
| **رابط دوزبانه** | انتخاب زبان فارسی یا انگلیسی از تنظیمات |
| **تقویم دوگانه** | نمایش تاریخ‌ها به شمسی یا میلادی |
| **ارقام فارسی** | نمایش اعداد با ارقام فارسی، با امکان غیرفعال‌سازی |
| **زنجیرهٔ عادت‌ها** | محاسبهٔ روزهای پیوسته و بهترین رکورد هر عادت |
| **پاداش‌های قابل تنظیم** | تعیین تعداد روزهای لازم برای دریافت هر کاپ، به‌صورت مستقل برای هر عادت |
| **جشن رسیدن به هدف** | نمایش کانفتی و اعلان هنگام دریافت کاپ جدید |
| **نوار پیشرفت چندحالته** | نمایش وضعیت عادت از شروع ثبت تا رسیدن به نقطهٔ عطف |
| **سه نوع ویجت** | نمایش کامل، ساده یا فشردهٔ عادت‌ها در یادداشت‌ها |
| **ثبت مستقیم در Frontmatter** | ثبت عادت با کلیک روی دکمه، بدون نیاز به ویرایش دستی فیلد |
| **داشبورد اختصاصی** | مشاهدهٔ تقویم ماهانه و آمار عادت‌ها در پنل کناری |
| **هماهنگی با تم Obsidian** | پشتیبانی ظاهری از تم‌های روشن و تاریک |
| **پیشنهاد مسیر** | پیشنهاد مسیر پوشه‌ها و فایل‌ها هنگام تنظیم مسیر |
| **پیش‌نمایش فایل‌ها** | مشاهده و بازکردن فایل‌های Markdown از بخش تنظیمات |

### نصب

#### روش اول: نصب دستی

۱. در پوشهٔ افزونه‌های Vault خود، پوشه‌ای با نام `hormuz-habit` بساز:

```text
<Vault>/.obsidian/plugins/hormuz-habit/
```

۲. سه فایل زیر را داخل آن قرار بده:

- `main.js`
- `manifest.json`
- `styles.css`

۳. در Obsidian به مسیر زیر برو:

`Settings → Community plugins`

۴. افزونهٔ **HormuzHabit** را فعال کن. اگر در فهرست ظاهر نشد، فهرست افزونه‌ها را بازخوانی کن یا Obsidian را دوباره اجرا کن.

#### روش دوم: نصب با BRAT

۱. افزونهٔ [BRAT](https://github.com/TfTHacker/obsidian42-brat) را نصب و فعال کن.

۲. در تنظیمات BRAT، مخزن زیر را اضافه کن:

```text
singhaf9270/hormuz-habit
```

۳. پس از نصب، HormuzHabit را از بخش Community plugins فعال کن.

### استفاده از ویجت‌ها

ویجت‌ها را می‌توان در هر یادداشتی که Obsidian برای افزونه‌های مربوطه پردازش می‌کند، قرار داد.

**نمایش همهٔ عادت‌ها**

````markdown
```habit-tracker
```
````

**نمایش یک عادت مشخص**

نام نمایشی یا نام فیلد Frontmatter عادت را وارد کن:

````markdown
```habit
مطالعه
```
````

**نمایش فشردهٔ یک عادت**

````markdown
```habit-compact
مطالعه
```
````

برای مثال، اگر عادت «مطالعه» در تنظیمات تعریف شده باشد، می‌توانی ویجت ساده یا فشردهٔ آن را در یادداشت موردنظر قرار بدهی.

### ساختار یادداشت‌های روزانه

HormuzHabit یادداشت‌های روزانه را بر اساس نام فایل با تاریخ میلادی ISO شناسایی می‌کند:

```text
YYYY-MM-DD.md
```

نمونهٔ Frontmatter:

```yaml
---
day: 2025-01-15
مطالعه: true
ورزش: false
---
```

- `day` تاریخ روز را مشخص می‌کند.
- نام هر فیلد عادت باید با فیلد تعریف‌شده در تنظیمات افزونه مطابقت داشته باشد.
- مقدار `true` نشان‌دهندهٔ ثبت عادت و `false` نشان‌دهندهٔ ثبت‌نشدن آن است.

**نکتهٔ مهم دربارهٔ تقویم:** تقویم شمسی یا میلادی فقط شیوهٔ نمایش تاریخ‌ها را تغییر می‌دهد. شناسایی فایل‌های روزانه همچنان بر اساس تاریخ میلادی ISO انجام می‌شود.

### تنظیمات

| تنظیم | کاربرد |
|---|---|
| زبان رابط | انتخاب فارسی یا انگلیسی |
| نوع تقویم | نمایش تاریخ به شمسی یا میلادی |
| ارقام فارسی | فعال یا غیرفعال‌کردن ارقام فارسی |
| پوشهٔ روزنگار | تعیین پوشه‌ای که سوابق عادت‌ها از آن خوانده می‌شوند |
| پوشهٔ یادداشت روزانه | تعیین محل ایجاد یادداشت امروز |
| قالب یادداشت | استفاده از قالب اختیاری هنگام ساخت یادداشت جدید |
| تنظیم عادت‌ها | تعریف نام، فیلد Frontmatter، ایموجی و حد نصاب کاپ برای هر عادت |

### وضعیت‌های نوار پیشرفت

| وضعیت | رنگ | مفهوم |
|---|---|---|
| خالی | بدون رنگ | هنوز سابقه‌ای برای عادت ثبت نشده است |
| غیرفعال | خاکستری | زنجیرهٔ قبلی وجود دارد، اما عادت امروز ثبت نشده است |
| در حال پیشرفت | بنفش | عادت امروز ثبت شده و پیشرفت ادامه دارد |
| تکمیل‌شده | فیروزه‌ای | نقطهٔ عطف کاپ محقق شده است |

---

## English

### Habit tracking that lives in your daily notes

**HormuzHabit** is a habit-tracking plugin for [Obsidian](https://obsidian.md) that connects daily habit logging with your existing notes.

Define your habits, record daily progress, build consecutive-day streaks, and celebrate milestones with golden trophies. Habit entries are stored in daily-note frontmatter, while a dedicated dashboard brings your history and progress together.

With Persian and English interfaces, Jalali and Gregorian calendar displays, and per-habit trophy thresholds, HormuzHabit supports different languages and workflows without requiring a separate note for every habit.

### Features

| Feature | Description |
|---|---|
| **Bilingual interface** | Switch between Persian and English |
| **Dual calendar support** | Display dates using the Jalali or Gregorian calendar |
| **Persian numerals** | Toggle Persian digit formatting |
| **Streak tracking** | Track consecutive days and personal records |
| **Configurable milestones** | Set a trophy threshold independently for each habit |
| **Milestone celebrations** | Confetti and a notification when a new trophy is earned |
| **Multi-state progress bar** | Visualize progress from an empty state to a completed milestone |
| **Three widget types** | Full, simple, and compact habit views |
| **Frontmatter logging** | Update a habit field directly from its widget |
| **Dedicated dashboard** | Explore a monthly calendar and habit statistics in a side panel |
| **Theme compatibility** | Styling for Obsidian's light and dark themes |
| **Path suggestions** | Get folder and file suggestions while configuring paths |
| **File previews** | Browse and open Markdown files from settings |

### Installation

#### Option 1: Manual installation

1. Create a folder named `hormuz-habit` inside your vault's plugin directory:

```text
<Vault>/.obsidian/plugins/hormuz-habit/
```

2. Place these three files inside the folder:

- `main.js`
- `manifest.json`
- `styles.css`

3. Open Obsidian and navigate to:

`Settings → Community plugins`

4. Enable **HormuzHabit**. If it does not appear in the list, refresh the plugin list or restart Obsidian.

#### Option 2: Install with BRAT

1. Install and enable [BRAT](https://github.com/TfTHacker/obsidian42-brat).

2. Add the following repository in BRAT:

```text
singhaf9270/hormuz-habit
```

3. Enable HormuzHabit under Community plugins.

### Usage

Add one of the following code blocks to a Markdown note.

**Display all habits**

````markdown
```habit-tracker
```
````

**Display a specific habit**

Use its display name or frontmatter field:

````markdown
```habit
Reading
```
````

**Display a compact habit widget**

````markdown
```habit-compact
Reading
```
````

### Daily note structure

HormuzHabit identifies daily notes by their Gregorian ISO filename:

```text
YYYY-MM-DD.md
```

Example frontmatter:

```yaml
---
day: 2025-01-15
Reading: true
Exercise: false
---
```

- `day` identifies the date associated with the note.
- Habit field names must match the fields configured in the plugin settings.
- `true` indicates a logged habit; `false` indicates that it has not been logged.

**Calendar note:** The calendar setting changes date presentation only. Daily notes are always identified using Gregorian ISO dates.

### Settings

| Setting | Description |
|---|---|
| Interface language | Choose Persian or English |
| Calendar system | Display dates in Jalali or Gregorian format |
| Persian digits | Enable or disable Persian numeral formatting |
| Journal folder | Select the folder scanned for habit history |
| Daily note folder | Choose where today's note is created |
| Daily note template | Optionally use a template when creating a new note |
| Habit configuration | Set each habit's name, frontmatter field, emoji, and trophy threshold |

### Progress bar states

| State | Color | Meaning |
|---|---|---|
| Empty | None | No habit history has been recorded |
| Dormant | Grey | A previous streak exists, but today's habit has not been logged |
| In progress | Purple | Today's habit is logged and progress continues |
| Complete | Teal | The trophy milestone has been reached |

---

## Project links

- **Repository:** [singhaf9270/hormuz-habit](https://github.com/singhaf9270/hormuz-habit)
- **Releases:** [View releases](https://github.com/singhaf9270/hormuz-habit/releases)
- **License:** [MIT](LICENSE)
- **Report a bug:** [Open an issue](https://github.com/singhaf9270/hormuz-habit/issues/new)
- **Request a feature:** [Open an issue](https://github.com/singhaf9270/hormuz-habit/issues/new)

## Follow the Obsidian tutorials

Persian-language tutorials, practical workflows, and plugin updates.

- [Bale](https://ble.ir/obsidiantut)
- [Telegram](https://t.me/obsidiantut)
- [YouTube](https://youtube.com/@obsidiantut)

## Support development

If HormuzHabit is useful in your workflow, you can support its continued development.

[Support via Reymit](https://reymit.ir/singhaf9270)

## Contributing

Bug reports, feature requests, and pull requests are welcome. Please use the repository's issue tracker to describe a problem or propose an improvement.

## License

Released under the [MIT License](LICENSE).

<p align="center">
  Made with care for the Obsidian community.
  <br>
  ساخته‌شده برای تجربه‌ای منظم‌تر در Obsidian
</p>
