# 🏆 HormuzHabit

**A Duolingo-inspired habit tracker for Obsidian**

**ردیاب عادت برای ابسیدین با الهام از زنجیرهٔ روزانهٔ دولینگو**

[![Version](https://img.shields.io/badge/version-1.0.1-gold.svg)](https://github.com/singhaf9270/hormuz-habit/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🇬🇧 English

### About HormuzHabit

HormuzHabit brings the motivating experience of Duolingo's streak tracker to everyday habits inside Obsidian.

Track reading, exercise, writing, learning, or any activity you want to make part of your routine. Record your progress in daily notes, build consecutive-day streaks, earn trophies at configurable milestones, and celebrate your achievements with golden animations.

### Features

- 🔥 **Streak tracking:** Follow your current streak and longest personal record.
- 🏆 **Trophy milestones:** Configure a trophy threshold for each habit.
- 🎉 **Golden celebrations:** Enjoy confetti and a celebration message when reaching a trophy milestone.
- 📊 **Habit dashboard:** View your habits, progress statistics, and monthly calendars.
- 📝 **Daily Notes integration:** Store habit completion in your daily notes using Frontmatter properties.
- 🧩 **Three widget styles:** Display all habits, a specific habit, or a compact tracker.
- 🌐 **Bilingual interface:** Choose Persian or English.
- 📅 **Two calendar systems:** Display dates using the Jalali or Gregorian calendar.
- 🔢 **Persian numerals:** Optionally display numbers using Persian digits.
- 🗂️ **Path autocomplete:** Find existing folders and Markdown templates while configuring paths.
- 🎨 **Light and dark themes:** Styling adapts to Obsidian's theme.

## Usage

After installation, configure your habits, add a tracker code block to a note, and use its **Log** button to record daily completion. The dashboard shows streaks, trophy milestones, and monthly progress.

## Quick Start

1. Install HormuzHabit with [BRAT](https://github.com/TfTHacker/obsidian42-brat) using `singhaf9270/hormuz-habit`, or follow the manual installation steps below.
2. Open **Settings → Community plugins → HormuzHabit** and configure the language, calendar, number format, note folders, and habits.
3. Add this code block to a note to display all configured habits:

````markdown
```habit-tracker
```
````

4. To display one configured habit, use its name in a `habit` block. For example:

````markdown
```habit
Reading
```
````

5. Use the habit's Log button to record today's completion in your daily note. The streak and trophy progress update automatically.

---

## Installation

### Option 1: Install with BRAT

1. Open Obsidian and go to **Settings → Community plugins**.
2. Install and enable [BRAT](https://github.com/TfTHacker/obsidian42-brat).
3. Open the BRAT settings.
4. Choose the option to add a beta plugin.
5. Enter this repository:

   `singhaf9270/hormuz-habit`

6. Add the plugin and enable **HormuzHabit**.

### Option 2: Manual installation

1. Open the [HormuzHabit Releases page](https://github.com/singhaf9270/hormuz-habit/releases).
2. Download `main.js`, `manifest.json`, and `styles.css` from the release assets. If the files are not attached, download them individually from the repository.
3. Open your Obsidian vault's configuration folder.
4. Create the following directory if it does not exist:

   `.obsidian/plugins/hormuz-habit/`

5. Copy all three files into that directory.
6. Restart Obsidian if necessary.
7. Open **Settings → Community plugins** and enable **HormuzHabit**.

> **Note:** HormuzHabit is distributed through its GitHub repository and releases. Publishing a GitHub release does not automatically add the plugin to Obsidian's official Community Plugins directory.

## Getting Started

### 1. Configure your habits

Open:

**Settings → Community plugins → HormuzHabit**

Under **Habits**, you can add a new habit, edit its settings, or delete a habit.

Each habit has its own display name, Frontmatter field, emoji settings, and trophy threshold.

### 2. Set up daily notes

HormuzHabit identifies daily notes using Gregorian ISO filenames:

`YYYY-MM-DD.md`

For example:

`2026-10-29.md`

The calendar used to display dates can be Jalali or Gregorian. Changing the display calendar does not change the required Gregorian filename format.

In the plugin settings, configure the folders used to find existing habit records and create today's note.

### 3. Add a widget to a note

Create a Markdown code block using one of the supported widget types.

**Display all configured habits**

````markdown
```habit-tracker
```
````

**Display one habit**

The text inside the block must match the habit's display name, Frontmatter field name, or ID.

````markdown
```habit
Reading
```
````

**Display a compact tracker for one habit**

````markdown
```habit-compact
Reading
```
````

Replace `Reading` with the name of a habit configured in your settings.

If the name does not match an existing habit, the widget displays a message indicating that no matching habit was found.

### 4. Record a habit

1. Open the note containing your tracker.
2. Select the habit's **Log** button.
3. HormuzHabit records the completion in today's daily note.
4. The widget and dashboard refresh to reflect your progress.
5. When you reach a trophy milestone, a golden celebration is displayed.

A habit can be logged only once per day through its tracker button.

### 5. Open the dashboard

Select the HormuzHabit flame icon in the Obsidian ribbon, or use the Command Palette and search for:

`Open habit dashboard`

The dashboard displays each configured habit, its streak statistics, trophy progress, and a navigable monthly calendar.

## Settings Guide

Open **Settings → Community plugins → HormuzHabit** to configure the plugin.

### General settings

| Setting | Description |
| --- | --- |
| Interface language | Select Persian (`fa`) or English (`en`). |
| Calendar system | Choose Jalali or Gregorian dates for display. |
| Use Persian digits | Enable or disable Persian numerals in widgets, calendars, and progress indicators. |

### Path settings

| Setting | Description |
| --- | --- |
| Journal folder | The folder scanned for daily notes and recorded habit entries. |
| Daily note folder | The folder where today's daily note is created or updated. |
| Daily note template | An optional Markdown template used when a new daily note needs to be created. |

You can type a path manually or select an existing folder or Markdown file from the autocomplete suggestions.

**Default paths**

- Journal folder: `00 بولت ژورنال/00 روزنگار`
- Daily note folder: `00 بولت ژورنال/00 روزنگار`
- Daily note template: `99 - ستاپ/الگوی روزانه.md`

These are defaults, not requirements. Change them to match your own vault structure.

### Habit settings

Every habit can be configured independently.

| Setting | Description |
| --- | --- |
| Display name | The name shown in widgets and the dashboard. |
| Frontmatter field | The property name used to record completion in daily notes. |
| Habit emoji | The emoji displayed beside the habit name. |
| Trophy threshold | The number of consecutive logged days needed to reach a trophy milestone. |
| Streak emoji | The emoji used for the current streak. |
| Record emoji | The emoji used for the personal-best statistic. |
| Cup emoji | The emoji used for trophy progress and rewards. |

Use **Add habit** to create a new habit. Use **Delete** on a habit card to remove it from the configuration.

For example, a reading habit could use:

- Display name: `Reading`
- Frontmatter field: `reading`
- Habit emoji: `📚`
- Trophy threshold: `10`
- Streak emoji: `🔥`
- Record emoji: `🏆`
- Cup emoji: `🏅`

The Frontmatter field is the property stored in the daily note; the display name is the label shown to the user.

## Daily Notes and Frontmatter

When a habit is recorded, HormuzHabit writes a Boolean property with the value `true` to the daily note's Frontmatter.

For example, a note could contain:

```yaml
---
day: 2026-10-29
reading: true
---
```

Here, `reading` is an example Frontmatter field configured for a habit. Use your own configured field name.

If today's note does not exist, HormuzHabit attempts to create it in the configured daily note folder. If the configured template exists, the plugin uses it when creating the note.

The following placeholders are supported in the daily note template:

| Placeholder | Replaced with |
| --- | --- |
| `{{date}}` | Today's Gregorian ISO date |
| `{{title}}` | Today's Gregorian ISO date |
| `{{time}}` | Current time in `HH:mm` format |

If the configured template cannot be found, the plugin falls back to a simple daily note containing the habit property and a date heading.

## Trophy Progress and Streaks

The progress indicator helps you see how close you are to the next trophy.

- **Empty:** No streak progress has been recorded.
- **In progress:** The bar fills as your streak approaches its configured threshold.
- **Inactive today:** The progress bar uses a muted appearance when today's habit has not been logged.
- **Milestone reached:** Completing the threshold fills the bar and triggers the golden celebration.

For example, if your trophy threshold is `10`, reaching a streak of ten consecutive logged days completes a trophy milestone. Further milestones are earned as the streak continues.

## Troubleshooting

**My widget says no matching habit was found.**

Check that the name inside the `habit` or `habit-compact` block matches the configured display name, Frontmatter field, or habit ID.

**My streak or calendar looks incorrect.**

Check that your daily notes use the `YYYY-MM-DD.md` filename format and are stored in the configured Journal folder.

**My habit was not recorded.**

Check the Daily note folder, the Frontmatter field name, and whether the configured folder is accessible in your vault.

**My template was not used.**

Confirm that the template path points to an existing Markdown file. The template is optional.

**I cannot find a setting.**

Make sure HormuzHabit is enabled and open its own settings page under Community plugins.

## Privacy

Habit records are stored in your Obsidian vault's Markdown files. Review the plugin source code and the permissions of any other plugins you use if you want to understand how your vault data is accessed.

## Links and Support

- **Repository:** https://github.com/singhaf9270/hormuz-habit
- **Releases:** https://github.com/singhaf9270/hormuz-habit/releases
- **Issues and bug reports:** https://github.com/singhaf9270/hormuz-habit/issues
- **Obsidian:** https://obsidian.md

## License

HormuzHabit is released under the MIT License. See the `LICENSE` file for details.

---

## 🇮🇷 فارسی

### معرفی HormuzHabit

**HormuzHabit** یک ردیاب عادت برای ابسیدین است که از سیستم زنجیرهٔ روزانهٔ دولینگو الهام گرفته است.

با این پلاگین می‌توانی استمرار عادت‌هایی مانند مطالعه، ورزش، نوشتن، یادگیری و برنامه‌ریزی را دنبال کنی. عادت‌ها را در یادداشت‌های روزانه ثبت کن، زنجیرهٔ روزهای متوالی را بساز، به حد نصاب کاپ برس و پیشرفتت را با جشن طلایی تماشا کن.

### امکانات

- 🔥 پیگیری زنجیرهٔ روزهای متوالی و رکورد شخصی هر عادت
- 🏆 تعیین حد نصاب دریافت کاپ برای هر عادت
- 🎉 جشن طلایی، انیمیشن و پیام تبریک هنگام رسیدن به نقطهٔ عطف
- 📊 داشبورد اختصاصی همراه با آمار و تقویم ماهانه
- 📝 ثبت انجام عادت در Frontmatter یادداشت روزانه
- 🧩 سه نوع ویجت برای نمایش همهٔ عادت‌ها، یک عادت مشخص یا حالت فشرده
- 🌐 رابط کاربری فارسی و انگلیسی
- 📅 نمایش تاریخ با تقویم شمسی یا میلادی
- 🔢 امکان نمایش اعداد فارسی
- 🗂️ پیشنهاد خودکار مسیر پوشه‌ها و فایل‌های Markdown در تنظیمات
- 🎨 سازگاری ظاهری با تم روشن و تاریک ابسیدین

## نصب پلاگین

### روش اول: نصب با BRAT

1. در ابسیدین به **Settings → Community plugins** برو.
2. پلاگین [BRAT](https://github.com/TfTHacker/obsidian42-brat) را نصب و فعال کن.
3. وارد تنظیمات BRAT شو.
4. گزینهٔ افزودن پلاگین آزمایشی را انتخاب کن.
5. این مخزن را وارد کن:

   `singhaf9270/hormuz-habit`

6. پلاگین را اضافه کن و HormuzHabit را از بخش Community plugins فعال کن.

### روش دوم: نصب دستی

1. به [صفحهٔ انتشارهای HormuzHabit](https://github.com/singhaf9270/hormuz-habit/releases) برو.
2. فایل‌های `main.js`، `manifest.json` و `styles.css` را از فایل‌های انتشار دریافت کن. اگر فایل‌ها ضمیمه نشده‌اند، آن‌ها را جداگانه از مخزن دریافت کن.
3. پوشهٔ تنظیمات مخزن ابسیدین خودت را باز کن.
4. در صورت نیاز، این پوشه را بساز:

   `.obsidian/plugins/hormuz-habit/`

5. هر سه فایل را داخل پوشه قرار بده.
6. در صورت نیاز ابسیدین را دوباره اجرا کن.
7. از مسیر **Settings → Community plugins** پلاگین HormuzHabit را فعال کن.

> انتشار در GitHub به‌تنهایی به معنی اضافه‌شدن پلاگین به فهرست رسمی Community Plugins ابسیدین نیست.

## نحوه استفاده

### ۱. تعریف عادت‌ها

به مسیر زیر برو:

**Settings → Community plugins → HormuzHabit**

در بخش **Habits** می‌توانی عادت جدید اضافه کنی، تنظیمات هر عادت را تغییر بدهی یا آن را حذف کنی.

هر عادت نام نمایشی، نام فیلد Frontmatter، ایموجی‌های اختصاصی و حد نصاب دریافت کاپ خودش را دارد.

### ۲. تنظیم یادداشت‌های روزانه

HormuzHabit یادداشت‌های روزانه را با نام فایل میلادی و قالب زیر شناسایی می‌کند:

`YYYY-MM-DD.md`

برای نمونه:

`2026-10-29.md`

تقویم شمسی یا میلادی فقط شیوهٔ نمایش تاریخ را تغییر می‌دهد؛ نام فایل همچنان باید با قالب میلادی ISO باشد.

در تنظیمات پلاگین، پوشهٔ جست‌وجوی سوابق عادت و پوشهٔ ساخت یادداشت امروز را مشخص کن.

### ۳. افزودن ویجت به یادداشت

برای نمایش همهٔ عادت‌ها، این کد را در یادداشت قرار بده:

````markdown
```habit-tracker
```
````

برای نمایش یک عادت مشخص:

````markdown
```habit
مطالعه
```
````

برای نمایش حالت فشردهٔ یک عادت:

````markdown
```habit-compact
مطالعه
```
````

عبارت «مطالعه» باید با نام نمایشی، نام فیلد Frontmatter یا شناسهٔ یکی از عادت‌های تعریف‌شده مطابقت داشته باشد.

### ۴. ثبت انجام عادت

1. یادداشتی را که ویجت در آن قرار دارد باز کن.
2. دکمهٔ ثبت عادت را انتخاب کن.
3. پلاگین انجام عادت را در یادداشت روزانهٔ امروز ثبت می‌کند.
4. ویجت و داشبورد به‌روزرسانی می‌شوند.
5. با رسیدن به حد نصاب کاپ، جشن طلایی نمایش داده می‌شود.

از طریق دکمهٔ ویجت، هر عادت فقط یک بار در روز ثبت می‌شود.

### ۵. باز کردن داشبورد

روی آیکون شعلهٔ HormuzHabit در نوار کناری ابسیدین کلیک کن؛ یا Command Palette را باز کن و فرمان زیر را جست‌وجو کن:

`باز کردن داشبورد`

داشبورد آمار زنجیره، رکورد شخصی، تعداد کاپ‌ها، نوار پیشرفت و تقویم ماهانهٔ هر عادت را نمایش می‌دهد.

## راهنمای تنظیمات

### تنظیمات عمومی

| گزینه | توضیح |
| --- | --- |
| زبان رابط کاربری | انتخاب فارسی یا انگلیسی |
| نوع تقویم | نمایش تاریخ به‌شکل شمسی یا میلادی |
| استفاده از اعداد فارسی | نمایش اعداد فارسی در ویجت‌ها، تقویم و نوارهای پیشرفت |

### تنظیم مسیرها

| گزینه | توضیح |
| --- | --- |
| پوشه روزنگار | پوشه‌ای که پلاگین برای یافتن سوابق ثبت عادت بررسی می‌کند |
| پوشه ساخت یادداشت روزانه | پوشه‌ای که یادداشت امروز در آن ساخته یا به‌روزرسانی می‌شود |
| قالب یادداشت روزانه | فایل Markdown اختیاری برای ساخت یادداشت جدید |

می‌توانی مسیر را دستی بنویسی یا از پیشنهادهای خودکار پوشه‌ها و فایل‌های موجود انتخاب کنی.

**مسیرهای پیش‌فرض:**

- پوشه روزنگار: `00 بولت ژورنال/00 روزنگار`
- پوشه ساخت یادداشت روزانه: `00 بولت ژورنال/00 روزنگار`
- قالب یادداشت روزانه: `99 - ستاپ/الگوی روزانه.md`

این مسیرها اجباری نیستند؛ آن‌ها را با ساختار مخزن خودت هماهنگ کن.

### تنظیمات هر عادت

| گزینه | توضیح |
| --- | --- |
| نام نمایشی | نامی که در ویجت و داشبورد دیده می‌شود |
| نام فیلد Frontmatter | نام خاصیتی که انجام عادت را در یادداشت روزانه ثبت می‌کند |
| ایموجی عادت | ایموجی کنار نام عادت |
| حد نصاب جایزه | تعداد روزهای متوالی لازم برای رسیدن به کاپ |
| ایموجی زنجیره | ایموجی نمایش زنجیرهٔ فعلی |
| ایموجی رکورد | ایموجی آمار بهترین رکورد شخصی |
| ایموجی کاپ | ایموجی کاپ و نوار پیشرفت |

با گزینهٔ **افزودن عادت** می‌توانی عادت جدیدی بسازی. دکمهٔ حذف نیز عادت انتخاب‌شده را از تنظیمات پلاگین پاک می‌کند.

برای نمونه، تنظیمات یک عادت مطالعه می‌تواند چنین باشد:

- نام نمایشی: `مطالعه`
- نام فیلد Frontmatter: `reading`
- ایموجی عادت: `📚`
- حد نصاب جایزه: `10`
- ایموجی زنجیره: `🔥`
- ایموجی رکورد: `🏆`
- ایموجی کاپ: `🏅`

توجه کن که نام نمایشی با نام فیلد Frontmatter یکی نیست؛ اولی برای نمایش و دومی برای ثبت داده در یادداشت استفاده می‌شود.

## یادداشت روزانه و Frontmatter

هنگام ثبت عادت، پلاگین یک خاصیت بولی با مقدار `true` در Frontmatter یادداشت روزانه ثبت می‌کند.

برای مثال:

```yaml
---
day: 2026-10-29
reading: true
---
```

در این مثال، `reading` نام نمونهٔ فیلد یک عادت است. باید از نام فیلدی استفاده کنی که در تنظیمات همان عادت تعریف کرده‌ای.

اگر یادداشت امروز وجود نداشته باشد، پلاگین تلاش می‌کند آن را در پوشهٔ تعیین‌شده بسازد. اگر فایل قالب تنظیم‌شده موجود باشد، برای ایجاد یادداشت از آن استفاده می‌کند.

جای‌نگهدارهای قابل استفاده در قالب:

| عبارت | کاربرد |
| --- | --- |
| `{{date}}` | تاریخ میلادی امروز با قالب ISO |
| `{{title}}` | تاریخ میلادی امروز با قالب ISO |
| `{{time}}` | ساعت فعلی با قالب `HH:mm` |

اگر فایل قالب پیدا نشود، پلاگین از یک یادداشت ساده شامل فیلد عادت و عنوان تاریخ استفاده می‌کند.

## نوار پیشرفت و کاپ‌ها

نوار پیشرفت نشان می‌دهد چقدر تا کاپ بعدی فاصله داری.

- **خالی:** هنوز زنجیره‌ای ثبت نشده است.
- **در حال پیشرفت:** نوار با نزدیک‌شدن به حد نصاب پر می‌شود.
- **امروز ثبت نشده:** ظاهر نوار کم‌رنگ می‌شود.
- **رسیدن به حد نصاب:** نوار کامل می‌شود و جشن طلایی نمایش داده می‌شود.

برای مثال، اگر حد نصاب کاپ `10` باشد، با ثبت ده روز متوالی یک نقطهٔ عطف کامل می‌شود و با ادامهٔ زنجیره می‌توانی به نقاط عطف بعدی برسی.

## رفع اشکال

**ویجت می‌گوید عادتی پیدا نشد.**

نام داخل بلوک `habit` یا `habit-compact` را با نام نمایشی، نام فیلد Frontmatter یا شناسهٔ عادت مقایسه کن.

**زنجیره یا تقویم درست نمایش داده نمی‌شود.**

بررسی کن نام فایل‌های روزانه از قالب `YYYY-MM-DD.md` پیروی کند و یادداشت‌ها در پوشهٔ روزنگار تنظیم‌شده قرار داشته باشند.

**عادت ثبت نمی‌شود.**

مسیر پوشهٔ ساخت یادداشت روزانه، نام فیلد Frontmatter و دسترسی به پوشه را بررسی کن.

**قالب روزانه استفاده نمی‌شود.**

مطمئن شو مسیر قالب به یک فایل Markdown موجود اشاره می‌کند. استفاده از قالب اختیاری است.

**تنظیمات پلاگین را پیدا نمی‌کنم.**

مطمئن شو HormuzHabit فعال است و صفحهٔ تنظیمات اختصاصی آن را در بخش Community plugins باز کرده‌ای.

## حریم خصوصی

سوابق عادت‌ها در فایل‌های Markdown داخل مخزن ابسیدین خودت ذخیره می‌شوند. برای آگاهی از نحوهٔ دسترسی به اطلاعات مخزن، می‌توانی کد منبع پلاگین و سایر پلاگین‌های نصب‌شده را بررسی کنی.

## لینک‌ها و پشتیبانی

- **مخزن پروژه:** https://github.com/singhaf9270/hormuz-habit
- **نسخه‌های منتشرشده:** https://github.com/singhaf9270/hormuz-habit/releases
- **گزارش خطا و پیشنهاد:** https://github.com/singhaf9270/hormuz-habit/issues
- **وب‌سایت ابسیدین:** https://obsidian.md

## مجوز

HormuzHabit تحت مجوز MIT منتشر شده است. برای جزئیات، فایل `LICENSE` را ببین.
