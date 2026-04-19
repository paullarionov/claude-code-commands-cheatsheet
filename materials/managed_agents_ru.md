# Claude Managed Agents

Практический плейбук

От концепции до продакшена за один день

На основе официальной документации Anthropic, инженерного блога и практических руководств  
Апрель 2026

Перевод: ТГ-канал @prompt_design  
April 9, 2026

---

## Что такое Claude Managed Agents

Если вы строите агентов на Messages API, вы знаете боль: нужно самому писать оркестрацию вызовов инструментов, управлять контекстом, поднимать песочницы, обрабатывать ошибки, хранить секреты. Это месяцы инженерной работы до того, как агент сделает хоть что-то полезное.

**Claude Managed Agents** — это готовая инфраструктура от Anthropic, где всё перечисленное уже сделано за вас. Вы описываете агента (модель, системный промпт, инструменты), а Anthropic запускает его в управляемом облаке: безопасные контейнеры, долгоживущие сессии, встроенное выполнение кода, стриминг событий.

Ключевое отличие от Messages API:

|  | Messages API | Managed Agents |
|--|-------------|----------------|
| **Что это** | Прямой доступ к модели | Готовая агентная платформа с инфраструктурой |
| **Для чего** | Кастомные агентные циклы, полный контроль | Долгие задачи, асинхронная работа, быстрый запуск |
| **Инфраструктура** | Строите сами | Предоставляется Anthropic |

### Зачем это нужно

Две главных проблемы, которые решает Managed Agents:

**1. Агентная обвязка устаревает.** Любая самописная обвязка закладывает предположения о том, чего Claude *не может* делать. Эти предположения устаревают с каждым обновлением модели и становятся бутылочным горлышком. Managed Agents обновляет обвязку автоматически — агент всегда использует последние возможности Claude.

**2. Claude работает всё дольше.** Горизонт задач растёт экспоненциально — на бенчмарке METR Claude уже превышает 10 человеко-часов работы. Это создаёт давление на инфраструктуру: она должна быть устойчива к сбоям, безопасна и масштабируема. Anthropic ожидает, что будущие версии Claude будут работать дни, недели или месяцы над самыми сложными задачами.

### Кто уже использует

- **Notion** — агенты внутри рабочего пространства для параллельного выполнения задач
- **Rakuten** — корпоративные агенты для разных департаментов, каждый запущен менее чем за неделю
- **Asana** — AI Teammates, работающие в Asana наравне с людьми
- **Sentry** — отладчик Seer находит баг, агент пишет патч и открывает PR
- **Vibecode** — Managed Agents как инфраструктура по умолчанию

### Статус и доступ

Managed Agents в открытой бете. Все эндпоинты требуют заголовок `managed-agents-2026-04-01` (SDK ставит его автоматически). Доступ включён по умолчанию для всех аккаунтов с API-ключом.

Отдельные фичи — Outcomes (критерии завершения), Multiagent (мультиагентность) и Memory — в research preview, для них нужно запросить доступ отдельно.

---

## Четыре ключевых концепции

Вся система строится на четырёх понятиях. Поймите их — и вы поймёте всю платформу.

### Agent — конфигурация агента

Версионируемая конфигурация: модель, системный промпт, инструменты, MCP-серверы, навыки. Создаёте один раз, ссылаетесь по ID. Один агент может иметь сколько угодно сессий.

Доступные модели: `claude-sonnet-4-6`, `claude-opus-4-6`.

### Environment — шаблон контейнера

Описание песочницы, в которой работают инструменты агента: тип среды, сетевые правила, предустановленные пакеты (Python, Node.js, Go и др.). Каждая сессия получает изолированный контейнер по этому шаблону.

### Session — выполнение задачи

Запущенный экземпляр агента внутри среды. Сессия хранит историю разговора, файловую систему, статус. Сессии могут работать часами. Можно подключать файлы и GitHub-репозитории при запуске, секреты хранятся в защищённом vault.

### Events — обмен сообщениями

Сообщения между вашим приложением и агентом: вы отправляете пользовательские сообщения, агент стримит ответы, вызовы инструментов и обновления статуса через Server-Sent Events (SSE). Историю событий можно получить целиком в любой момент.

---

## Быстрый старт: первый агент за 10 минут

### Шаг 0: Установите инструменты

**CLI (ant):**

```bash
# macOS
brew install anthropics/tap/ant

# Linux/WSL
VERSION=1.0.0
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')
curl -fsSL \
  "https://github.com/anthropics/anthropic-cli/releases/\
download/v${VERSION}/ant_${VERSION}_${OS}_${ARCH}.tar.gz" \
  | sudo tar -xz -C /usr/local/bin ant
```

**SDK:**

```bash
# Python
pip install anthropic

# TypeScript
npm install @anthropic-ai/sdk
```

**API-ключ:**

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

**Быстрый путь через Claude Code:**

```
claude update
claude
/claude-api managed-agents-onboarding
```

Встроенный навык `claude-api` проведёт через весь онбординг.

### Шаг 1: Создайте агента

```python
from anthropic import Anthropic

client = Anthropic()

agent = client.beta.agents.create(
    name="Coding Assistant",
    model="claude-sonnet-4-6",
    system="You are a helpful coding assistant. "
           "Write clean, well-documented code.",
    tools=[{"type": "agent_toolset_20260401"}],
)
print(f"Agent ID: {agent.id}")
```

`agent_toolset_20260401` — это набор всех встроенных инструментов разом: bash, чтение/запись файлов, веб-поиск, grep, glob. Сохраните `agent.id`.

**Через CLI:**

```bash
ant beta:agents create \
  --name "Coding Assistant" \
  --model claude-sonnet-4-6 \
  --system "You are a helpful coding assistant." \
  --tool '{type: agent_toolset_20260401}'
```

**Через curl:**

```bash
curl -sS https://api.anthropic.com/v1/agents \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "name": "Coding Assistant",
    "model": "claude-sonnet-4-6",
    "tools": [{"type": "agent_toolset_20260401"}]
  }'
```

### Шаг 2: Создайте среду

```python
environment = client.beta.environments.create(
    name="dev-env",
    config={
        "type": "cloud",
        "networking": {"type": "unrestricted"},
    },
)
print(f"Environment ID: {environment.id}")
```

Нужны конкретные пакеты? Добавьте в конфиг:

```json
{
  "type": "cloud",
  "networking": {"type": "unrestricted"},
  "packages": {"pip": ["pandas", "numpy"]}
}
```

### Шаг 3: Запустите сессию

```python
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="My first session",
)
print(f"Session ID: {session.id}")
```

### Шаг 4: Отправьте задачу и получите результат

```python
with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(
        session.id,
        events=[{
            "type": "user.message",
            "content": [{
                "type": "text",
                "text": "Create a Python script that generates "
                        "the first 20 Fibonacci numbers "
                        "and saves them to fibonacci.txt",
            }],
        }],
    )

    for event in stream:
        match event.type:
            case "agent.message":
                for block in event.content:
                    print(block.text, end="")
            case "agent.tool_use":
                print(f"\n[Tool: {event.name}]")
            case "session.status_idle":
                print("\n\nDone.")
                break
```

Что происходит под капотом:

1. Разворачивается контейнер по шаблону среды
2. Claude решает, какие инструменты использовать
3. Вызовы инструментов выполняются внутри контейнера
4. Результаты стримятся к вам в реальном времени
5. Когда задача завершена — событие `session.status_idle`

Никакого Docker, никакого кода оркестрации, никакого слоя выполнения инструментов.

---

## Встроенные инструменты

При подключении `agent_toolset_20260401` агент получает доступ ко всему набору:

| Инструмент | Описание |
|-----------|----------|
| **bash** | Выполнение shell-команд в контейнере |
| **read** | Чтение файлов |
| **write** | Запись файлов |
| **edit** | Замена строк в файлах |
| **glob** | Поиск файлов по шаблону |
| **grep** | Поиск текста по регулярным выражениям |
| **web_fetch** | Загрузка содержимого по URL |
| **web_search** | Поиск в интернете |

### Настройка инструментов

Отключить конкретные инструменты:

```json
{
  "type": "agent_toolset_20260401",
  "configs": [
    {"name": "web_fetch", "enabled": false},
    {"name": "web_search", "enabled": false}
  ]
}
```

Включить только нужные (всё остальное выключено):

```json
{
  "type": "agent_toolset_20260401",
  "default_config": {"enabled": false},
  "configs": [
    {"name": "bash", "enabled": true},
    {"name": "read", "enabled": true},
    {"name": "write", "enabled": true}
  ]
}
```

### Кастомные инструменты

Помимо встроенных, можно определять собственные инструменты. Claude формирует структурированный запрос, ваш код выполняет операцию, результат возвращается обратно:

```python
agent = client.beta.agents.create(
    name="Weather Agent",
    model="claude-sonnet-4-6",
    tools=[
        {"type": "agent_toolset_20260401"},
        {
            "type": "custom",
            "name": "get_weather",
            "description": "Get current weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name",
                    }
                },
                "required": ["location"],
            },
        },
    ],
)
```

Рекомендации по кастомным инструментам:

- **Подробные описания** — самый важный фактор. 3–4 предложения на инструмент: что делает, когда использовать, ограничения
- **Объединяйте связанные операции** в один инструмент с параметром `action`
- **Пространства имён в названиях** — `db_query`, `storage_read`
- **Возвращайте только важную информацию** — стабильные идентификаторы, не внутренние ссылки

---

## Система разрешений

Managed Agents имеет два режима разрешений для инструментов:

**`always_allow`** — инструменты выполняются автоматически. Для доверенных внутренних агентов.

**`always_ask`** — сессия останавливается и ждёт одобрения от вашего приложения перед каждым вызовом. Для пользовательских агентов.

Режимы можно комбинировать: чтение файлов и веб-поиск — автоматически, bash-команды — с одобрением. MCP-инструменты по умолчанию в режиме `always_ask`.

Это делает Managed Agents более готовым к продакшену, чем большинство open-source фреймворков (LangGraph, CrewAI, AutoGen) — ни один из них не предоставляет инструментных разрешений из коробки.

---

## Паттерны использования

### По событию (Event-triggered)

Внешний сервис запускает агента. Система обнаруживает баг — агент пишет патч и открывает PR. Человек не участвует между обнаружением и действием. Так работает Sentry.

### По расписанию (Scheduled)

Агент запускается по расписанию. Типичный пример — ежедневные дайджесты: активность в GitHub, обзор задач команды, сводка по X (Twitter).

### Разовая задача (Fire-and-forget)

Человек ставит задачу через Slack или Teams — получает результат: таблицу, презентацию, приложение. Так работает Asana AI Teammates.

### Долгие задачи (Long-horizon)

Задачи, работающие часами. Исследовательские проекты, масштабные миграции кода, глубокий анализ. Сессии сохраняют состояние — файлы, история, контекст — на протяжении всей работы.

### Типичная связка: CLI для настройки, SDK для рантайма

Шаблоны агентов хранятся как YAML в git (модель, системный промпт, инструменты, MCP-серверы). CLI применяет их в деплой-пайплайне. SDK управляет сессиями в рантайме.

---

## Outcomes: критерии завершения (research preview)

Outcomes превращают сессию из разговора в работу. Вы определяете, как должен выглядеть результат и по каким критериям оценивать качество. Агент работает до достижения цели, самостоятельно оценивая и итерируя.

### Как это работает

Когда вы задаёте outcome, система создаёт **грейдер** — отдельный процесс оценки, работающий в своём контексте, чтобы не быть под влиянием решений основного агента. Грейдер возвращает покритериальную оценку: что выполнено, что нет. Обратная связь передаётся агенту для следующей итерации.

### Рубрика

Структурируйте рубрику как конкретные, проверяемые критерии:

- Хорошо: «CSV содержит колонку price с числовыми значениями»
- Плохо: «Данные выглядят хорошо»

Пример рубрики для DCF-модели:

```
# DCF Model Rubric

## Revenue Projections
- Uses historical revenue data from the last 5 fiscal years
- Projects revenue for at least 5 years forward
- Growth rate assumptions are explicitly stated

## Output Quality
- All figures are in a single .xlsx file with labeled sheets
- Key assumptions are on a separate "Assumptions" sheet
- Sensitivity analysis on WACC and terminal growth rate
```

### Запуск с outcome

```python
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="Financial analysis",
)

client.beta.sessions.events.send(
    session_id=session.id,
    events=[{
        "type": "user.define_outcome",
        "description": "Build a DCF model for Costco in .xlsx",
        "rubric": {"type": "text", "content": RUBRIC},
        "max_iterations": 5,  # по умолчанию 3, макс 20
    }],
)
```

Агент начинает работу сразу — дополнительное сообщение не нужно.

### Результаты оценки

| Результат | Что дальше |
|-----------|-----------|
| `satisfied` | Сессия переходит в idle |
| `needs_revision` | Агент начинает новый цикл |
| `max_iterations_reached` | Финальная попытка, затем idle |
| `failed` | Рубрика не подходит к задаче |

Файлы-результаты агент сохраняет в `/mnt/session/outputs/` внутри контейнера. Забрать их можно через Files API:

```python
files = client.beta.files.list(scope_id=session.id)
for f in files.data:
    print(f"{f.id}: {f.filename} ({f.size_bytes} bytes)")

content = client.beta.files.download(files.data[0].id)
content.write_to_file("costco_dcf.xlsx")
```

---

## Мультиагентность (research preview)

Один агент-координатор может делегировать работу другим агентам. Каждый работает в своём потоке (thread) с изолированным контекстом, но все разделяют один контейнер и файловую систему.

### Когда делегировать

- **Код-ревью** — отдельный агент с read-only инструментами
- **Генерация тестов** — агент пишет и запускает тесты, не трогая продакшен-код
- **Исследование** — агент с веб-инструментами собирает и суммаризирует информацию

### Настройка

```python
orchestrator = client.beta.agents.create(
    name="Engineering Lead",
    model="claude-sonnet-4-6",
    system="You coordinate engineering work. "
           "Delegate code review to the reviewer "
           "and test writing to the test agent.",
    tools=[{"type": "agent_toolset_20260401"}],
    callable_agents=[
        {
            "type": "agent",
            "id": reviewer_agent.id,
            "version": reviewer_agent.version,
        },
        {
            "type": "agent",
            "id": test_writer_agent.id,
            "version": test_writer_agent.version,
        },
    ],
)
```

Ограничение: только один уровень делегирования. Координатор вызывает агентов, но те не могут вызывать других агентов.

### Потоки (threads)

- **Основной поток** — сессионный стрим координатора с общей картиной
- **Потоки агентов** — детальные события каждого подагента

```python
# Список потоков
for thread in client.beta.sessions.threads.list(session.id):
    print(f"[{thread.agent_name}] {thread.status}")

# Стрим конкретного потока
with client.beta.sessions.threads.stream(
    thread.id, session_id=session.id,
) as stream:
    for event in stream:
        if event.type == "agent.message":
            for block in event.content:
                if block.type == "text":
                    print(block.text, end="")
```

Потоки сохраняют контекст — можно отправить дополнительные инструкции в уже работающий поток.

---

## Архитектура: как устроено под капотом

Инженерная команда Anthropic сознательно не строила конкретную агентную обвязку — они ожидают, что обвязки будут постоянно эволюционировать. Вместо этого система разделена на три независимых компонента:

- **«Мозг»** — Claude и его обвязка (агентный цикл, выбор инструментов)
- **«Руки»** — песочницы и инструменты, выполняющие действия
- **«Сессия»** — журнал событий

Каждый компонент — это интерфейс с минимальными предположениями о других. Каждый может упасть или быть заменён независимо. Это даёт:

- **Надёжность** — сбой одного компонента не убивает всю систему
- **Безопасность** — изоляция выполнения от контекста
- **Гибкость** — можно подключать новые обвязки, песочницы и инфраструктуру

Встроенные оптимизации: prompt caching, compaction (сжатие контекста), автоматическое восстановление после сбоев инфраструктуры.

---

## Стоимость

Стандартные токенные тарифы Claude API плюс **$0.08 за час активной сессии.** Для ориентира: 10-минутная сессия кодирующего агента стоит несколько центов за вычисления.

Если вы на плане Max ($100–200/мес) и используете Claude Code, встроенный навык `claude-api` проведёт через онбординг бесплатно. Но API-usage при активном использовании выйдет в заметную сумму — стоит следить за потреблением.

---

## Чек-лист запуска

1. Получите API-ключ на console.anthropic.com
2. Установите CLI (ant) или SDK (Python/TypeScript)
3. Экспортируйте ключ: `export ANTHROPIC_API_KEY="..."`
4. Создайте агента (модель + промпт + инструменты)
5. Создайте среду (контейнер + пакеты + сеть)
6. Запустите сессию и отправьте задачу
7. Обработайте стрим событий в вашем приложении

Или: откройте Claude Code и скажите `start onboarding for managed agents in Claude API` — встроенный навык сделает всё пошагово.

Или: зайдите на platform.claude.com и используйте визуальный конструктор агентов в консоли.

---

## Лимиты

| Операция | Лимит |
|---------|-------|
| Создание ресурсов (агенты, сессии, среды) | 60 запросов/мин |
| Чтение (получение, списки, стриминг) | 600 запросов/мин |

Также действуют лимиты на уровне организации и тарифного плана.

---

## Источники

- Блог Anthropic: Claude Managed Agents — claude.com/blog/claude-managed-agents
- Документация: platform.claude.com/docs/en/managed-agents/overview
- Инженерный блог: дизайн Claude Managed Agents
- Практическое руководство по первому деплою (Return My Time)
