
README
HormuzHabit

Bilingual habit tracking for Obsidian — Persian/English, Jalali/Gregorian, and a visual streak dashboard.

فارسی

HormuzHabit یک پلاگین پیگیری عادت برای Obsidian است که برای استفاده‌ی فارسی و انگلیسی طراحی شده است.

امکانات نسخهٔ ۱.۰.۰

انتخاب زبان رابط کاربری: فارسی یا انگلیسی
انتخاب تقویم شمسی یا میلادی
امکان نمایش اعداد فارسی یا انگلیسی
داشبورد عادت‌ها، تقویم ماهانه و نوار پیشرفت زنجیره
نمایش خاکستری زنجیرهٔ قبلی تا زمانی که عادت امروز ثبت شود؛ زنجیره پس از گذشت بیش از یک روز از آخرین ثبت، منقضی می‌شود
تنظیم مسیر پوشهٔ روزنگار، پوشهٔ یادداشت روزانه و قالب روزانه
پیشنهاد خودکار مسیرها هنگام تایپ
پیش‌نمایش فایل‌های Markdown در پوشه‌ها؛ برای بازکردن هر فایل روی آن کلیک کنید
امکان تعریف چند عادت و تنظیم نام فیلد Frontmatter، ایموجی‌ها و حد نصاب جایزه
ذخیره‌سازی تنظیمات در فضای استاندارد پلاگین Obsidian
نصب دستی

پوشه‌ای با نام hormuz-habit در مسیر .obsidian/plugins/ بسازید.
فایل‌های main.js، manifest.json و styles.css را داخل آن قرار دهید.
در Obsidian به Settings → Community plugins بروید و HormuzHabit را فعال کنید.
استفاده از ویجت

برای نمایش همهٔ عادت‌ها در یک یادداشت:

```habit-tracker
```
برای نمایش یک عادت مشخص، نام نمایشی یا نام فیلد Frontmatter آن را در خط بعد بنویسید:

```habit
مطالعه
```
نسخهٔ فشرده:

```habit-compact
مطالعه
```
نکته دربارهٔ تاریخ‌ها

تقویم فقط شیوهٔ نمایش تاریخ را تغییر می‌دهد. شناسایی یادداشت‌های روزانه همچنان از تاریخ میلادی ISO با قالب YYYY-MM-DD و فیلد day در Frontmatter پشتیبانی می‌کند. اگر قالب روزانهٔ شما ساختار متفاوتی دارد، مطمئن شوید فیلد تاریخ یا نام فایل با این قالب سازگار باشد.

English

HormuzHabit is a bilingual habit-tracking plugin for Obsidian, with a visual dashboard designed for both Persian and English workflows.

Features in version 1.0.0

Interface language selection: Persian or English
Jalali or Gregorian calendar display
Persian-digit display toggle
Habit dashboard, monthly calendar, and streak progress bar
Previous streak stays grey until today's habit is logged; it expires when more than one day has passed since the last completion
Configurable journal folder, daily-note folder, and daily template path
Path autocomplete while typing
Markdown file previews for folders; click a file to open it
Multiple habits with configurable Frontmatter fields, emojis, and trophy thresholds
Settings stored using Obsidian's standard plugin data storage
Manual installation

Create a folder named hormuz-habit in .obsidian/plugins/.
Copy main.js, manifest.json, and styles.css into that folder.
In Obsidian, open Settings → Community plugins and enable HormuzHabit.
Widget usage

To display all habits in a note:

```habit-tracker
```
To display a specific habit, add its display name or Frontmatter field name:

```habit
Reading
```
Compact widget:

```habit-compact
Reading
```
Date note

The calendar setting changes date display only. Daily notes are still detected using ISO Gregorian dates (YYYY-MM-DD) and the day Frontmatter field. If your daily-note template uses a different structure, make sure its date field or filename matches this format.

Release

Version: 1.0.0
Plugin ID: hormuz-habit
Minimum Obsidian version: 1.5.0
