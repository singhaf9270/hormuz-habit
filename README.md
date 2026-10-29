<div align="center">

# 🏆 HormuzHabit

**Habit tracker for Obsidian — Persian/English · Jalali/Gregorian · golden-cup celebrations**

**ردیاب عادت برای Obsidian — دوزبانه · تقویم شمسی/میلادی · جشن کاپ طلایی**

[![Version](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)](https://github.com/singhaf9270/hormuz-habit/releases)
[![Obsidian](https://img.shields.io/badge/Obsidian-%3E%3D1.5.0-7c3aed?style=for-the-badge&logo=obsidian)](https://obsidian.md)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Bale](https://img.shields.io/badge/Bale-@obsidiantut-22A06B?style=for-the-badge)](https://ble.ir/obsidiantut)
[![Telegram](https://img.shields.io/badge/Telegram-@obsidiantut-229ED9?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/obsidiantut)
[![YouTube](https://img.shields.io/badge/YouTube-@obsidiantut-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@obsidiantut)

[فارسی](#-فارسی) · [English](#-english) · [نصب سریع](#-نصب) · [Quick install](#-installation)

</div>

---

## 📸 Screenshots · تصاویر

> اگر تصویری داری، در پوشهٔ `docs/` بذار و این‌جا لینک بده. مثلاً:
>
> | Widget · ویجت | Dashboard · داشبورد | Golden cup · کاپ طلایی |
> |:---:|:---:|:---:|
> | ![widget](docs/widget.png) | ![dashboard](docs/dashboard.png) | ![golden](docs/golden.png) |

---

## 🇮🇷 فارسی

### ✨ معرفی

**HormuzHabit** یک پلاگین پیگیری عادت برای **Obsidian** است که برای استفادهٔ فارسی و انگلیسی طراحی شده. عادت‌های روزانه‌ات رو از داخل یادداشت‌های روزانه دنبال کن، زنجیره بساز و با رسیدن به حد نصاب، **کاپ طلایی** بگیر. 🏆

### 🎯 امکانات نسخهٔ ۱.۰.۰

| ویژگی | توضیح |
|:---|:---|
| 🌐 **دوزبانه** | رابط کاربری فارسی و انگلیسی |
| 📅 **تقویم شمسی و میلادی** | نمایش تاریخ‌ها با هر دو تقویم |
| 🔢 **اعداد فارسی** | نمایش اعداد با ارقام فارسی (قابل خاموش کردن) |
| 🔥 **زنجیره (Streak)** | شمارش روزهای پیوسته و رکورد شخصی |
| 🏅 **سیستم کاپ** | هر `N` روز پیوسته یک کاپ جدید (قابل تنظیم برای هر عادت) |
| 🏆 **جشن طلایی** | افکت کانفتی و توست هنگام رسیدن به کاپ جدید |
| 📊 **نوار پیشرفت هوشمند** | چهار حالت: خالی، خوابیده (خاکستری)، رنگی و کامل (فیروزه‌ای) |
| 🧩 **سه نوع ویجت** | `habit-tracker` (کامل)، `habit` (ساده)، `habit-compact` (فشرده) |
| 📝 **ثبت خودکار** | با کلیک روی دکمه، فیلد عادت در Frontmatter یادداشت روزانه `true` می‌شود |
| 🗓️ **داشبورد اختصاصی** | نمای کناری با تقویم ماهانه و آمار کامل هر عادت |
| 🎨 **تم روشن و تاریک** | طراحی هماهنگ با هر دو تم Obsidian |
| 📂 **پیشنهاد خودکار مسیر** | هنگام تایپ مسیر پوشه/فایل، پیشنهاد می‌دهد |
| 👁️ **پیش‌نمایش فایل‌ها** | در تنظیمات، فایل‌های Markdown پوشه قابل مشاهده و بازکردن هستند |

### 📦 نصب

#### روش ۱: نصب دستی
1. پوشه‌ای با نام `hormuz-habit` در مسیر زیر بساز:
<Vault>/.obsidian/plugins/hormuz-habit/

text
2. سه فایل زیر را داخل آن قرار بده:
- `main.js`
- `manifest.json`
- `styles.css`
3. Obsidian را باز کن و در **Settings → Community plugins** پلاگین **HormuzHabit** را فعال کن.

#### روش ۲: از طریق BRAT
1. پلاگین [BRAT](https://github.com/TfTHacker/obsidian42-brat) را نصب کن.
2. در BRAT این آدرس را وارد کن:
singhaf9270/hormuz-habit

text

### 🚀 استفاده از ویجت

برای نمایش **همهٔ عادت‌ها**:

~~~markdown
```habit-tracker
text

برای نمایش **یک عادت مشخص** (نام نمایشی یا نام فیلد Frontmatter):

~~~markdown
```habit
مطالعه
```
نسخهٔ فشرده:

markdown
```habit-compact
مطالعه
```
🗓️ ساختار یادداشت روزانه
پلاگین یادداشت‌های روزانه را با نام فایل تاریخ میلادی ISO (YYYY-MM-DD.md) و فیلد day در Frontmatter شناسایی می‌کند:

yaml
---
day: 2025-01-15
مطالعه: true
ورزش: false
---
💡 نام فیلد (مطالعه) همان چیزی است که در تنظیمات هر عادت وارد می‌کنی.

📅 نکته: تقویم فقط شیوهٔ نمایش را تغییر می‌دهد. شناسایی یادداشت‌ها همیشه با تاریخ میلادی ISO انجام می‌شود.

⚙️ تنظیمات
تنظیم	توضیح
زبان رابط	فارسی یا انگلیسی
نوع تقویم	شمسی یا میلادی (فقط نمایش)
اعداد فارسی	نمایش اعداد با ارقام فارسی
پوشه روزنگار	پوشه‌ای که یادداشت‌های عادت جست‌وجو می‌شوند
پوشه یادداشت روزانه	محل ساخت یادداشت امروز
قالب یادداشت	قالب اختیاری برای ساخت یادداشت جدید
عادت‌ها	نام، فیلد Frontmatter، ایموجی‌ها، حد نصاب جایزه
🎨 حالت‌های نوار پیشرفت
حالت	رنگ	معنی
خالی	بدون رنگ	هنوز هیچ روزی ثبت نشده
خوابیده	خاکستری	زنجیره قبلی هست ولی امروز ثبت نشده
رنگی	بنفش	امروز ثبت شده و در حال پیشرفت
کامل	فیروزه‌ای	به کاپ رسیدی! 🎉
🇬🇧 English
✨ Overview
HormuzHabit is a habit-tracking plugin for Obsidian built for both Persian and English workflows. Track your daily habits from within your journal notes, build streaks, and earn a golden trophy when you hit your milestone. 🏆

🎯 Features (v1.0.0)
Feature	Description
🌐 Bilingual	Persian and English interface
📅 Jalali & Gregorian	Display dates in either calendar
🔢 Persian digits	Display numbers with Persian numerals (toggleable)
🔥 Streaks	Track consecutive days and personal bests
🏅 Trophy system	A new trophy every N consecutive days (configurable per habit)
🏆 Golden celebration	Confetti and toast when you reach a new trophy
📊 Smart progress bar	Four states: empty, dormant (grey), colored, complete (teal)
🧩 Three widget types	habit-tracker (full), habit (simple), habit-compact (compact)
📝 Auto logging	Click the button and the habit field becomes true in the daily note's frontmatter
🗓️ Dedicated dashboard	Side panel with monthly calendar and full stats per habit
🎨 Light & dark	Styled for both Obsidian themes
📂 Path autocomplete	Suggests folders/files while typing
👁️ File previews	Preview and open Markdown files from settings
📦 Installation
Method 1: Manual
Create a folder named hormuz-habit at:

text
<Vault>/.obsidian/plugins/hormuz-habit/
Place these files inside it:

main.js

manifest.json

styles.css

Open Obsidian and enable HormuzHabit in Settings → Community plugins.

Method 2: Via BRAT
Install the BRAT plugin.

Add this repository in BRAT:

text
singhaf9270/hormuz-habit
🚀 Widget usage
All habits:

markdown
```habit-tracker
```
A specific habit (display name or frontmatter field):

markdown
```habit
Reading
```
Compact version:

markdown
```habit-compact
Reading
```
🗓️ Daily note structure
The plugin identifies daily notes by their ISO Gregorian filename (YYYY-MM-DD.md) and reads the day frontmatter field:

yaml
---
day: 2025-01-15
Reading: true
Exercise: false
---
💡 The field name (Reading) is exactly what you enter in each habit's settings.

📅 Note: The calendar setting only changes display. Daily notes are always identified by ISO Gregorian dates.

⚙️ Settings
Setting	Description
Interface language	Persian or English
Calendar system	Jalali or Gregorian (display only)
Persian digits	Show numbers with Persian numerals
Journal folder	Folder scanned for habit entries
Daily note folder	Where today's note is created
Daily note template	Optional template for new notes
Habits	Name, frontmatter field, emojis, trophy threshold
🎨 Progress bar states
State	Color	Meaning
Empty	None	No days logged yet
Dormant	Grey	Previous streak exists but today isn't logged
Colored	Purple	Today logged, progress ongoing
Complete	Teal	Trophy reached! 🎉
📣 همراه ما باشید · Stay connected
آموزش‌ها، تازه‌ها و نکته‌های کاربردی Obsidian را در کانال‌های ما دنبال کنید.
Follow us for Obsidian tutorials, updates, and practical tips.

<div align="center">
📢 بله · Bale	✈️ تلگرام · Telegram	▶️ یوتیوب · YouTube
https://img.shields.io/badge/Bale-@obsidiantut-22A06B?style=for-the-badge	https://img.shields.io/badge/Telegram-@obsidiantut-229ED9?style=for-the-badge&logo=telegram&logoColor=white	https://img.shields.io/badge/YouTube-@obsidiantut-FF0000?style=for-the-badge&logo=youtube&logoColor=white
ble.ir/obsidiantut	t.me/obsidiantut	youtube.com/@obsidiantut
</div>
❤️ حمایت مالی · Support
اگر این افزونه برایتان مفید بوده، می‌توانید از ادامهٔ توسعهٔ آن حمایت کنید.
If this plugin helps you, consider supporting its continued development.

<div align="center">
https://img.shields.io/badge/%D8%AD%D9%85%D8%A7%DB%8C%D8%AA%20%D9%85%D8%A7%D9%84%DB%8C-Reymit-8b5cf6?style=for-the-badge

reymit.ir/singhaf9270

</div>
🤝 مشارکت · Contributing
از مشارکت، گزارش باگ و پیشنهاد ویژگی‌ها استقبال می‌شود!
Contributions, bug reports, and feature suggestions are welcome!

🐛 گزارش باگ · Bug report

💡 پیشنهاد ویژگی · Feature request

🔀 Pull Request

📄 مجوز · License
این پروژه تحت مجوز MIT منتشر شده است.
This project is released under the MIT License.

LICENSE

<div align="center">
ساخته شده با ❤️ برای جامعهٔ Obsidian
Made with ❤️ for the Obsidian community

https://img.shields.io/github/stars/singhaf9270/hormuz-habit?style=social
https://img.shields.io/github/forks/singhaf9270/hormuz-habit?style=social

</div> ```
