# Как использовать Renovate Bot в собственном GitLab

_April 22, 2024_

В cамостоятельно размещенном GitLab нет встроенного [Renovate Bot](https://github.com/renovatebot/renovate). Что можно сделать, чтобы все таки настроить и пользоваться всеми преимуществами автоматического обновления зависимостей?

Renovate Bot – это автоматизированный инструмент, предназначенный для обновления зависимостей программного обеспечения. Он следит за новыми версиями библиотек и пакетов, используемых в вашем проекте, и автоматически создаёт merge requests для их обновления. Это обеспечивает более безопасное и актуальное состояние зависимостей, минимизируя риски, связанные с уязвимостями старых версий.

Для собственных размещений, в контексте обновлений фронтенд приложений, Renovate Bot предлагает несколько вариантов:

* Использовать npm пакет [`renovate`](https://www.npmjs.com/package/renovate).
* Использовать Docker образ [`renovate/renovate`](https://hub.docker.com/r/renovate/renovate/).
* Использовать [Renovate runner](https://gitlab.com/renovate-bot/renovate-runner/) для GitLab.
* Развернуть у себя Renovate [Community Edition или Enterprise Edition](https://github.com/mend/renovate-ce-ee).

Первый вариант нам не подходит, так как он заточен только под экосистему npm, а хотелось бы иметь более универсальный подход. Последний вариант не подходит, так как необходимо будет поддерживать отдельный инстанс приложения. Отдельный runner поддерживать также не хочется, поэтому мы остановимся на использовании Docker образа, который можно запустить в любом имеющемся runner.

## Шаг #1: Конфигурация репозитория

Создайте файл [`renovate.json`](https://docs.renovatebot.com/configuration-options/) в корне вашего репозитория. Я рекомендую сразу добавить туда следующие опции:

* [`reviewers`](https://docs.renovatebot.com/configuration-options/#reviewers) – список ответственных разработчиков, которые должны быть в курсе обновлений, и на которых будут назначены merge requests с обновлениями.
* [`minimumReleaseAge`](https://docs.renovatebot.com/configuration-options/#minimumreleaseage) – npm пакеты могут быть деопубликованы в течении 72 часов, стоит выжидать это время перед обновлением новой версии пакета.
* [`prHourlyLimit`](https://docs.renovatebot.com/configuration-options/#prhourlylimit) – отключаем лимит в 2 обновления в час.
* [`prConcurrentLimit`](https://docs.renovatebot.com/configuration-options/#prconcurrentlimit) – отключаем лимит в 10 одновременных обновлений.
* [`addLabels`](https://docs.renovatebot.com/configuration-options/#addlabels) – список меток для запросов слияния с типом обновления.
* [`automerge`](https://docs.renovatebot.com/configuration-options/#automerge) – если ваш код типизирован, достаточно покрыт статическими проверками и тестами, имеет смысл включить авто слияние для `patch` и `minor` обновлений, которые не ломают публичное API. Дополнительно настройкой `matchCurrentVersion` исключаем авто слияние для нестабильных 0.x обновлений.

Итоговые настройки:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "minimumReleaseAge": "3 days",
  "reviewers": ["andrepolischuk", "unicorn"],
  "prHourlyLimit": 0,
  "prConcurrentLimit": 0,
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "addLabels": ["dependencies", "patch"]
    },
    {
      "matchUpdateTypes": ["minor"],
      "addLabels": ["dependencies", "minor"]
    },
    {
      "matchUpdateTypes": ["major"],
      "addLabels": ["dependencies", "major"]
    },
    {
      "matchUpdateTypes": ["patch", "minor"],
      "matchCurrentVersion": "!/^0/",
      "automerge": true
    }
  ]
}
```

Если вы используете файл [`CODEOWNERS`](https://docs.gitlab.com/ee/user/project/codeowners/index.html#codeowners-file) для описания ответственных за код, можно не указывать ревьеров напрямую в конфигурации, а указать настройкой [`reviewersFromCodeOwners`](https://docs.renovatebot.com/configuration-options/#reviewersfromcodeowners), что их нужно подтянуть из файла.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "minimumReleaseAge": "3 days",
  "reviewersFromCodeOwners": true,
  ...
}
```

## Шаг 2: Конфигурация пайплайна GitLab CI

Добавьте дополнительный этап в ваш пайплайн, в котором будет использоваться Docker образ Renovate. Также необходимо добавить дополнительные настройки окружения, чтобы Renovate мог использовать API вашего собственного GitLab:

* [`RENOVATE_PLATFORM`](https://docs.renovatebot.com/self-hosted-configuration/#platform) – тип платформы, в нашем случае – `gitlab`.
* [`RENOVATE_ENDPOINT`](https://docs.renovatebot.com/self-hosted-configuration/#endpoint) – точка входа GitLab API.
* [`RENOVATE_TOKEN`](https://docs.renovatebot.com/self-hosted-configuration/#token) – [групповой](https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html) или [проектный](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) токен доступа в репозиторий.
* [`RENOVATE_AUTODISCOVER`](https://docs.renovatebot.com/self-hosted-configuration/#autodiscover) – автоматический поиск репозиториев – `true`.

Итоговый пайплайн:

```yml
stages:
  ...
  - update

...

update deps:
  stage: update
  image: docker.io/renovate/renovate:37-slim
  variables:
    RENOVATE_PLATFORM: 'gitlab'
    RENOVATE_ENDPOINT: $GL_API_URL
    RENOVATE_TOKEN: $GL_TOKEN
    RENOVATE_AUTODISCOVER: 'true'
  script:
    - renovate
```

## Шаг 3: Создание расписания

Обновления зависимостей выходят непрерывно. Чтобы немного снизить шум, добавьте расписание для запуска Renovate Bot, например, раз в неделю перед началом спринта. Вы получите список обновлений и сможете запланировать критические обновления на текущий спринт.

В GitLab есть [запланированные пайплайны](https://docs.gitlab.com/ee/ci/pipelines/schedules.html), где можно настроить расписание запуска проверки обновлений. Расписание задается в формате файла `crontab`.

```crontab
00 9 * * 1
```

Обновления с таким расписанием будут запускаться каждый понедельник в 9:00.

Также в настройки запланированного пайплайна стоит добавить переменную с типом задачи, например, `SCHEDULE_TYPE`, чтобы по ней запускать обновления в GitLab CI.

```yml
update deps:
  stage: update
  image: docker.io/renovate/renovate:37-slim
  variables:
    RENOVATE_PLATFORM: 'gitlab'
    RENOVATE_ENDPOINT: $GL_API_URL
    RENOVATE_TOKEN: $GL_TOKEN
    RENOVATE_AUTODISCOVER: 'true'
  rules:
    - if: '$SCHEDULE_TYPE == "weekly"'
  script:
    - renovate
```

## Заключение

Эта конфигурация не зависит от языка, и может использоваться не только для фронтенд проектов с npm, но и для любых других, которые располагаются в вашем GitLab.

Для дальнейшего чтения, обратите внимание на документацию [Renovate Bot](https://docs.renovatebot.com).
