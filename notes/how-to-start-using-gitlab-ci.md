# How to start using Gitlab CI

_February 1, 2018_

Quick start of testing, building and deploying packages or applications with the built-in CI.

Gitlab has a cool integrated CI/CD service. If you have repositories there, you can automate some infrastructure parts of development workflow out of the box.

For example, you can:

* Run tests on packages and apps
* Publish to npm
* Build and deploy apps to multiple environments
* Create multi-staging job pipelines

## Initial setup

Let's test and publish some package to npm in CI. To configure it just add [`.gitlab-ci.yml`](https://docs.gitlab.com/ee/ci/yaml/README.html#gitlab-ci-yml) to the root of a repository and push it. And one more thing you need to do is [configure runners](https://docs.gitlab.com/runner/) that is used to run jobs.

In a `.gitlab-ci.yml` file you define set of [jobs](https://docs.gitlab.com/ee/ci/yaml/README.html#jobs) you want run in repository.

```yaml
---

test:
  script:
    - npm install
    - npm test
```

Also you can specify [stages](https://docs.gitlab.com/ee/ci/yaml/README.html#stages) to manage the ordering of jobs’ execution. Jobs defined at the same stages run in parallel, jobs defined at the next stage run after successful completion of the previous stage.

```yaml
---

stages:
  - test
  - publish

before_script: npm install

test:
  stage: test
  script: npm test

publish:
  stage: publish
  script: npm publish
```

In this example publish job only runs after test succeeds.

For each job you need define a [shell script](https://docs.gitlab.com/ee/ci/yaml/README.html#script) or an array of them that are executed.

```yaml
test:
  script: npm test

# or

test:
  script:
    - npm run lint
    - npm test
```

## Jobs' execution policy

Runners execute jobs on each push in all refs by default. You can limit running the specific job by define `only` or `except` directives in its configuration.

```yaml
publish:
  stage: publish
  only:
    - tags
  script: npm publish
```

Now test job runs on each refs, and publish job only runs when tag is pushed. You can set refs to exectute a job using regular expressions or keywords, such a `branches`, `tags`, `api`, `schedules`, and something else. Read more about [job policy in Gitlab's docs](https://docs.gitlab.com/ee/ci/yaml/README.html#only-and-except-simplified).

## Secret tokens

You can easy automate publishing or deployment workflow with [CI variables](https://docs.gitlab.com/ee/ci/variables/README.html). It allows publish npm packages from gitlab repository to the npm registry by run only `npm version` command on local machine.

1. Generate the npm auth token locally by logging onto npm with `npm login` command. This will save auth token to npm configuration file `~/.npmrc`:

  ```
  //registry.npmjs.org/:_authToken=NPM_AUTH_TOKEN
  ```

1. Copy this token and set it in `NPM_AUTH_TOKEN` variable in project [secret variables](https://docs.gitlab.com/ee/ci/variables/README.html#secret-variables).
1. Configure `.gitlab-ci.yml` to setting authToken:

  ```yaml
  ---

  stages:
    - test
    - publish

  before_script: npm install

  test:
    stage: test
    script:
      - npm run lint
      - npm test

  publish:
    stage: publish
    only:
      - tags
    script:
      - echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc
      - npm publish
  ```

1. Add `postversion` hook to `package.json` to push the version commit with tags after increasing version:

  ```json
  {
    ...
    "scripts": {
      "test": "ava",
      "postversion": "git push --follow-tags"
    },
    ...
  }
  ```

Now when you're going to publish new release, run `npm version`. This will update the `package.json` version, create commit, push it with tags. When tests succeeds, CI will automatically publish this version to npm.

Also you can use variables to store SSH keys that using for deployment to stage or production.

1. Generate a new SSH keys locally.

  ```sh
  ssh-keygen -t rsa -b 4096
  ```

1. Copy the public key to servers you're going to deploy from CI.
1. Copy the private key and add it as `SSH_PRIVATE_KEY` secret variable to project.
1. Add the private key to `ssh-agent` to load.

  ```yaml
  ---

  stages:
    - test
    - stage

  before_script: npm install

  test:
    stage: test
    script:
      - npm run lint
      - npm test

  deploy_stage:
    stage: stage
    only:
      - tags
    script:
      - mkdir -p ~/.ssh
      - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
      - chmod 600 ~/.ssh/id_rsa
      - ssh-keyscan -H stage.awesome.app >> ~/.ssh/known_hosts
      - npm run dist
      - rsync -rpl ./dist/ stage.awesome.app:/dists/$CI_COMMIT_TAG/
  ```

In this case when you run `npm version` command, runner tests the new version of application and then automatically deploys it to stage server.

Read more about [using SSH keys](https://docs.gitlab.com/ee/ci/ssh_keys/README.html) with Gitlab CI.

## Manual jobs

Next stage jobs run automatically by default after all previous jobs have passed. But you can execute jobs manually by using [`when` directive](https://docs.gitlab.com/ee/ci/yaml/README.html#when).

```yaml
deploy_stage:
  stage: stage
  only:
    - tags
  when: manual
  script:
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H stage.awesome.app >> ~/.ssh/known_hosts
    - npm run dist
    - rsync -rpl ./dist/ stage.awesome.app:/dists/$CI_COMMIT_TAG/
```

Following this configuration, deploy job needs to be started by a user [from pipeline](https://docs.gitlab.com/ee/ci/pipelines.html#manual-actions-from-the-pipeline-graph).

## Caching

If you build or compile package before publishing, you'll need install dependencies before running every job. Let's speed up testing and publishing. You can specify `cache` directive with list of files which should be cached between jobs. By default Gitlab caches all files tracked by git.

Add `node_modules` directory to caching list:

```yaml
---

stages:
  - test
  - publish

test:
  stage: test
  cache:
    key: "$CI_COMMIT_REF_NAME:node_modules"
    paths:
      - node_modules/
    policy: push
  script:
    - npm install
    - npm run lint
    - npm test

publish:
  stage: publish
  cache:
    key: "$CI_COMMIT_REF_NAME:node_modules"
    paths:
      - node_modules/
    policy: pull
  only:
    - tags
  script:
    - echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc
    - npm publish
```

In this example `key` directive allows to cache dependencies solely between jobs with the same ref name. Test job installs dependencies and pushes them to cache. Publish job pulls dependencies, compiles and publishes results. Read more about [caching in Gitlab's docs](https://docs.gitlab.com/ee/ci/yaml/README.html#cache).

## Pages for API docs

Another interesting task you can do in CI is a publishing docs for package to [Gitlab pages](https://docs.gitlab.com/ee/user/project/pages/). Add job called `pages` to `.gitlab-ci.yml` file with [`artifacts` directive](https://docs.gitlab.com/ee/ci/yaml/README.html#artifacts) to tell runner that this job creates artifacts.

```yaml
stages:
  - test
  - publish
  - pages

...

pages:
  stage: docs
  cache:
    key: "$CI_COMMIT_REF_NAME:node_modules"
    paths:
      - node_modules/
    policy: pull
  only:
    - tags
  script:
    - npm run docs
  artifacts:
    paths:
      - public
```

With this configuration `npm run docs` command builds the site with API documentations to artifacts `./public` directory. This directory will be automatically deployed to Gitlab pages when job completed.

## Wrapping up

That's it. I reviewed the basics of usage integrated Gitlab CI for testing, building or deploying packages or applications. I hope you'll find something new for yourself.

Read the CI docs to gain a deeper understanding how it works:

* [GitLab Continuous Integration](https://docs.gitlab.com/ee/ci/README.html)
* [Introduction to pipelines and jobs](https://docs.gitlab.com/ee/ci/pipelines.html)
* [GitLab CI/CD Variables](https://docs.gitlab.com/ee/ci/variables/README.html)
* [Configuring GitLab Runners](https://docs.gitlab.com/ee/ci/runners/README.html)
