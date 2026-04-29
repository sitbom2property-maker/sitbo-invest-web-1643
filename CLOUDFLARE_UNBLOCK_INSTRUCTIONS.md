# 🔓 Разблокировка sitboinvest.ge для Claude и AI-ботов

## Текущий статус
- ❌ ClaudeBot получает **403 Forbidden** (заблокировано Cloudflare WAF)
- ❌ anthropic-ai получает **403 Forbidden** (заблокировано Cloudflare WAF)
- ✅ Обычные браузеры получают **200 OK**

## Корневая причина
Cloudflare **"Bot Fight Mode"** и **"Block AI Scrapers and Crawlers"** автоматически генерируют `robots.txt` с запретом на ClaudeBot, GPTBot и других AI-ботов.

---

## ЧТО СДЕЛАТЬ В CLOUDFLARE DASHBOARD

### 1️⃣ Отключить Bot Fight Mode

**Путь:** Security → Bots

1. Откройте https://dash.cloudflare.com/
2. Выберите домен **sitboinvest.ge**
3. Левое меню → **Security** → **Bots**
4. Найдите **Bot Fight Mode** → переключите на **OFF**
5. Кликните **Save**

### 2️⃣ Отключить "Block AI Scrapers and Crawlers"

**Путь:** Security → Settings / Scrape Shield

1. Левое меню → **Security** → **Settings** (или **Scrape Shield**)
2. Найдите **"Block AI Scrapers and Crawlers"** → **OFF**
3. Найдите **"Cloudflare Managed robots.txt"** → **OFF** (ОЧЕНЬ ВАЖНО!)
4. Найдите **Browser Integrity Check** → **OFF** (временно)
5. Левое меню → **Security** → **Overview**
6. Найдите **Security Level** → переключите на **Low**

### 3️⃣ Очистить кеш

**Путь:** Caching → Purge Everything

1. Левое меню → **Caching**
2. Кликните **Purge Everything**
3. Подтвердите
4. Подождите 2-3 минуты

### 4️⃣ Проверить WAF Rules

**Путь:** Security → WAF

1. Левое меню → **Security** → **WAF**
2. Посмотрите **Cloudflare Managed Rules** — убедитесь что **Bot Management** отключен
3. Посмотрите **Custom Rules** — убедитесь что нет правил блокирующих ClaudeBot, anthropic-ai, GPTBot

---

## ПРОВЕРКА ПОСЛЕ ПРИМЕНЕНИЯ

После выполнения всех шагов выполните эти команды:

```bash
# 1. Обычный запрос
curl -I https://sitboinvest.ge
# Ожидаем: HTTP/2 200

# 2. ClaudeBot
curl -I -A "ClaudeBot/1.0" https://sitboinvest.ge
# Ожидаем: HTTP/2 200 (не 403!)

# 3. anthropic-ai
curl -I -A "anthropic-ai" https://sitboinvest.ge
# Ожидаем: HTTP/2 200 (не 403!)

# 4. GPTBot
curl -I -A "GPTBot/1.0" https://sitboinvest.ge
# Ожидаем: HTTP/2 200 (не 403!)

# 5. robots.txt
curl https://sitboinvest.ge/robots.txt | head -20
# Ожидаем: User-agent: ClaudeBot / Allow: /

# 6. sitemap.xml
curl https://sitboinvest.ge/sitemap.xml | head -20
# Ожидаем: <?xml version="1.0"...
```

**УСПЕШНО:** Если все команды возвращают **200 OK** (не 403)

---

## СНИМОК ЭКРАНА: ГДЕ НАХОДЯТСЯ НАСТРОЙКИ

### Bot Fight Mode (Security → Bots)
```
┌─────────────────────────────────┐
│ Security > Bots                 │
├─────────────────────────────────┤
│ Bot Fight Mode:                 │
│ [○ OFF  ● ON]  ← переключить   │
│                                 │
│ Super Bot Fight Mode (если есть):│
│ [○ OFF  ● ON]  ← переключить   │
└─────────────────────────────────┘
```

### Scrape Shield (Security → Settings)
```
┌─────────────────────────────────┐
│ Security > Settings             │
├─────────────────────────────────┤
│ ☑ Block AI Scrapers and Crawlers│ → ☐ (отключить)
│ ☑ Cloudflare Managed robots.txt │ → ☐ (ВАЖНО!)
│ ☑ Browser Integrity Check       │ → ☐ (временно)
│ Security Level: Medium          │ → Low
└─────────────────────────────────┘
```

---

## ВАЖНО

⚠️ **После отключения этих функций:**
- Сайт может получить больше ботов (включая скамеров)
- Рекомендуется включить обратно **через 1-2 недели** после того как Claude выполнит аудит
- Или создать Firewall Rule который разрешает только определённых ботов

**Firewall Rule для белого списка ботов:**
```
Expression:
(http.user_agent contains "ClaudeBot" or 
 http.user_agent contains "anthropic-ai" or 
 http.user_agent contains "GPTBot" or
 http.user_agent contains "Googlebot" or
 http.user_agent contains "Bingbot")

Action: Allow
```

---

## КОНТАКТЫ ПОДДЕРЖКИ

- **Cloudflare Help:** https://support.cloudflare.com/
- **Runable Support:** support@runable.com (если сайт на их платформе)
