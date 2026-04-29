# Cloudflare WAF — Разблокировка AI Аудит Ботов

## Проблема
Cloudflare WAF блокирует запросы от Claude, GPTBot и других AI ботов с ошибкой **403 Forbidden** перед тем, как они дойдут до сервера.

## Решение

### Вариант 1: Отключить Bot Fight Mode (Самый Простой)
1. Перейти на https://dash.cloudflare.com
2. Выбрать домен **sitboinvest.ge**
3. Левое меню → **Security** → **Bots**
4. Найти **Bot Fight Mode** → **OFF**
5. Сохранить

**Минусы:** полностью отключает защиту от ботов

---

### Вариант 2: Firewall Rule с Whitelist (Рекомендуется)
1. Перейти на https://dash.cloudflare.com
2. Выбрать домен **sitboinvest.ge**
3. Левое меню → **Security** → **Firewall Rules**
4. **Create rule**
5. **Имя:** `Allow AI Audit Bots`
6. **Expression:** 
```
(cf.bot_management.score < 30 and (http.user_agent contains "ClaudeBot" or http.user_agent contains "anthropic-ai" or http.user_agent contains "GPTBot" or http.user_agent contains "AhrefsBot"))
```
7. **Action:** Allow
8. **Save and Deploy**

---

### Вариант 3: WAF Rules (Если используется WAF)
1. **Security** → **WAF**
2. **Cloudflare Managed Rules** → найти **Bots**
3. **Disable** или **Exception** → добавить исключение для User-Agent содержащих указанных ботов
4. **Deploy**

---

### Вариант 4: Через Page Rules (Legacy)
1. **Rules** → **Page Rules**
2. **Create Rule**
3. Pattern: `sitboinvest.ge/*`
4. **Security Level** → **Essentially Off**
5. Применить только для определённых User-Agent (если поддерживается)

---

## Whitelisted Bots
Добавить в исключения следующих ботов для аудита:

| Bot Name | User-Agent |
|----------|-----------|
| Claude | `ClaudeBot`, `anthropic-ai` |
| OpenAI | `GPTBot` |
| Ahrefs | `AhrefsBot` |
| Semrush | `SemrushBot` |
| MJ12 | `MJ12bot` |

---

## Проверка
После применения правила, проверить доступ:

```bash
curl -H "User-Agent: ClaudeBot" https://sitboinvest.ge/
# Должно вернуться 200 OK
```

---

## Если Используется Runable Platform
Если сайт хостится на Runable, может потребоваться обратиться в поддержку Runable, чтобы они добавили исключения в их WAF конфиг.

**Контакты:** docs.runable.com или support@runable.com

---

## Документация
- https://developers.cloudflare.com/bots/bot-management/
- https://developers.cloudflare.com/firewall/cf-firewall-rules/
