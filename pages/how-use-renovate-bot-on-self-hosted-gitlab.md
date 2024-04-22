# How use Renovate Bot on self-hosted GitLab

_April 22, 2024_

There is no built-in [Renovate Bot](https://github.com/renovatebot/renovate) on a self-hosted GitLab. What can we do to set it up and enjoy all the benefits of automatic dependency updates?

Renovate Bot is an automated tool designed to update software dependencies. It checks new versions of libraries and packages used in your project and automatically creates merge requests for their updates. This ensures a safer and up-to-date state of dependencies, minimizing the risks associated with vulnerabilities in old versions.

For self-hosted repositories of frontend applications, Renovate Bot offers the following options:

* Use the npm package [`renovate`](https://www.npmjs.com/package/renovate).
* Use the Docker image [`renovate/renovate`](https://hub.docker.com/r/renovate/renovate/).
* Use [Renovate runner](https://gitlab.com/renovate-bot/renovate-runner/) for GitLab.
* Deploy Renovate [Community Edition or Enterprise Edition](https://github.com/mend/renovate-ce-ee) on your own.

The first option is not suitable for us because it's designed for the npm projects, and we would like a more universal approach. The last option is also not suitable because it would require maintaining a separate Renovate instance. We also do not want to maintain a separate runner, so we will use the Docker image that can be run on any existing runner.

## Step #1: Repository configuration

Create a file [`renovate.json`](https://docs.renovatebot.com/configuration-options/) in the root of your repository. I recommend adding the following options:

* [`reviewers`](https://docs.renovatebot.com/configuration-options/#reviewers) – a list of developers who should be aware of updates and on whom merge requests with updates will be assigned.
* [`minimumReleaseAge`](https://docs.renovatebot.com/configuration-options/#minimumreleaseage) – npm packages can be unpublished within 72 hours, so it's worth waiting this time before updating to a new version of the package.
* [`addLabels`](https://docs.renovatebot.com/configuration-options/#addlabels) – a list of labels for merge requests with the update type.
* [`automerge`](https://docs.renovatebot.com/configuration-options/#automerge) – if your code is typed, sufficiently covered with static checks and tests, it makes sense to enable auto-merge for `patch` and `minor` updates that does not break packages API.

Final settings:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "minimumReleaseAge": "3 days",
  "reviewers": ["andrepolischuk", "unicorn"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "addLabels": ["patch"],
      "automerge": true
    },
    {
      "matchUpdateTypes": ["minor"],
      "addLabels": ["minor"],
      "automerge": true
    },
    {
      "matchUpdateTypes": ["major"],
      "addLabels": ["major"]
    }
  ]
}
```

If you use [`CODEOWNERS`](https://docs.gitlab.com/ee/user/project/codeowners/index.html#codeowners-file) file to describe those responsible for your code, you don't need to directly specify reviewers in the configuration, but instead use the [`reviewersFromCodeOwners`](https://docs.renovatebot.com/configuration-options/#reviewersfromcodeowners) setting to pull them from the file.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "minimumReleaseAge": "3 days",
  "reviewersFromCodeOwners": true,
  ...
}
```

## Step 2: GitLab CI pipeline configuration

Add a stage to your pipeline that uses Renovate Bot Docker image. Also, add environment settings so that Renovate Bot can use the API of your self-hosted GitLab:

* [`RENOVATE_PLATFORM`](https://docs.renovatebot.com/self-hosted-configuration/#platform) – platform type, in our case – `gitlab`.
* [`RENOVATE_ENDPOINT`](https://docs.renovatebot.com/self-hosted-configuration/#endpoint) – entry point of the GitLab API.
* [`RENOVATE_TOKEN`](https://docs.renovatebot.com/self-hosted-configuration/#token) – [group](https://docs.gitlab.com/ee/user/group/settings/group_access_tokens.html) or [project](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) access token for the repository.
* [`RENOVATE_AUTODISCOVER`](https://docs.renovatebot.com/self-hosted-configuration/#autodiscover) – automatic repository discovery – `true`.

Final pipeline:

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

## Step 3: Creating a schedule

Dependency updates are released continuously. To reduce noise, add a schedule for running Renovate Bot, for example, once a week before the start of sprint. You will receive a list of updates and will be able to plan critical updates for the current sprint.

GitLab has [scheduled pipelines](https://docs.gitlab.com/ee/ci/pipelines/schedules.html) where you can set up a schedule for checking updates. The schedule is set in `crontab` file format.

```crontab
00 9 * * 1
```

Updates with this schedule will be run every Monday at 9 am.

Also, add a variable with the task type, for example, `SCHEDULE_TYPE`, so that it can be used to trigger updates on GitLab CI.

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

## Bonus

This configuration is not dependent on language and can be used not for frontend projects with npm but also for the rest located on your GitLab.

For further reading, check the [Renovate Bot](https://docs.renovatebot.com) documentation.
