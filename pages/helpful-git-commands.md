# Helpful git commands

_March 5, 2024_

A list of git commands to improve your source code management skills.

## Interactive commit

```
git commit --patch --verbose
```

Allows you to interactively select hunks of patch between the index and the work tree and commit them. It provides a detailed output of the commit process.

Prompt to select hunks to commit

```
@@ -84,7 +95,7 @@ export const Routes: React.FC<RoutesProps> = ({

   return (
     <Suspense fallback={Fallback ? <Fallback /> : undefined}>
-      <Layout {...rest}>
+      <Layout {...rest} error={error}>
         <BaseRoutes location={routerLocation}>
           {routeData?.redirect && <Navigate to={routeData.redirect} />}
           {routes.map(({path, Component, Fallback, ...routeProps}) => (
(3/3) Stage this hunk [y,n,q,a,d,K,g,/,e,?]?
```

Detailed output showing the changes being committed.

```
fix: pass error to layout

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch master
# Your branch is behind 'origin/master' by 4 commits, and can be fast-forwarded.
#   (use "git pull" to update your local branch)
#
# Changes to be committed:
#	modified:   src/components/routes.tsx
#
# Changes not staged for commit:
#	modified:   .size-limit.json
#	modified:   src/components/routes.tsx
#
# ------------------------ >8 ------------------------
# Do not modify or remove the line above.
# Everything below it will be ignored.
diff --git a/src/components/routes.tsx b/src/components/routes.tsx
index 2fea2b3..6b2d803 100644
--- a/src/components/routes.tsx
+++ b/src/components/routes.tsx
@@ -84,7 +84,7 @@ export const Routes: React.FC<RoutesProps> = ({
 
   return (
     <Suspense fallback={Fallback ? <Fallback /> : undefined}>
-      <Layout {...rest}>
+      <Layout {...rest} error={error}>
         <BaseRoutes location={routerLocation}>
           {routeData?.redirect && <Navigate to={routeData.redirect} />}
           {routes.map(({path, Component, Fallback, ...routeProps}) => (
```

Options explained

* `--patch` – Interactively choose hunks of patch between the index and the work tree and commit them.
* `--verbose` – Show unified diff of the changes being committed.

## Branch info

```
git branch --verbose
```

Lists all local branches along with the last commit on each branch.

```
  background-location ec6e18e feat: support background location for modals
  eslint-config       34de471 chore: update eslint config and fix errors
* master              bc8b8ab Merge pull request #19 from asyncink/error-to-layout
  refactor-loading    ebcebfb fix: simplify loading, fix isLoading lag
```

## Pretty log

```
git log --graph --oneline --all --decorate --date-order
```

Displays the commit history in a graphical format, with each commit on a single line, showing all branches, decorated with references, and sorted by date.

```
* 4f51b56 (origin/gh-pages) Deploying to gh-pages from @ rambler-digital-solutions/react-toolkit@bc8b8abfb1db317b4c27a7634abb6ecce8d28384 🚀
| *   bc8b8ab (HEAD -> master, tag: v2.8.0, origin/master) Merge pull request #19 from asyncink/error-to-layout
| |\  
| | * 601e01b fix: remove nullish coalescing
| | * b7ca3b9 chore: increase size limit
| | * b288524 feat: pass error to layout
| |/  
* | 22e52ae Deploying to gh-pages from @ rambler-digital-solutions/react-toolkit@d25e4ef4f143c5a0d2b2debae742aab6b524bcda 🚀
| *   d25e4ef (tag: v2.7.5) Merge pull request #18 from rambler-digital-solutions/refactor-loading
| |\  
| | * ebcebfb (origin/refactor-loading, refactor-loading) fix: simplify loading, fix isLoading lag
| |/  
* | 187b824 Deploying to gh-pages from @ rambler-digital-solutions/react-toolkit@c6a8a60bc7dfa23bacdc043ea3558f4e61f344c2 🚀
| * c6a8a60 chore: update eslint config
| *   c345f30 Merge pull request #17 from rambler-digital-solutions/eslint-config [skip ci]
| |\  
| | * 34de471 (origin/eslint-config, eslint-config) chore: update eslint config and fix errors
| |/  
* | 3338070 Deploying to gh-pages from @ rambler-digital-solutions/react-toolkit@d1cb7c6a29e86fb949dd2b9c29a8fc1b7a08928c 🚀
| * d1cb7c6 chore: increase size limits
```

Options explained

* `--graph` – Draw a text-based graphical representation of the commit history.
* `--oneline` – Display each commit on a single line.
* `--all` – Show all branches.
* `--decorate` – Show names of branches or tags of the commits that are shown.
* `--date-order` – Sort commits by date.

## File history

```
git log --follow --patch <path>
```

Shows the commit history of a specific file, including the changes made in each commit.

```
commit 10ed8b6304b8384cfafb3fb839e295cf2a1ccf51
Author: Andrey Polischuk
Date:   Wed Dec 13 10:49:38 2023 +0300

    fix: preload server route before hydration

diff --git a/src/components/routes.tsx b/src/components/routes.tsx
index 6e79fcf..e4a0d45 100644
--- a/src/components/routes.tsx
+++ b/src/components/routes.tsx
@@ -89,7 +89,7 @@ export const Routes: React.FC<RoutesProps> = ({
           key={path}
           path={path}
           element={
-            <Suspense fallback={Fallback ? <Fallback /> : null}>
+            <Suspense fallback={Fallback ? <Fallback /> : undefined}>
               {isWaitingMode && routeData.isLoading && Fallback ? (
                 <Fallback />
               ) : (
```

Options explained

* `--follow` – Continue listing the history of the file beyond renames.
* `--patch` – Show the diff of each commit.

## Short status

```
git status --short --branch
```

Displays the status of the working directory and the current branch in a short format.

```
## master...origin/master [behind 4]
 M .size-limit.json
 M src/components/routes.tsx
```

Options explained

* `--short` – Show the output in a short-format style.
* `--branch` – Show the name of the current branch.

## Sorted tags

```
git tag --sort version:refname
```

Lists all tags in the repository, sorted by version number.

```
v2.0.0
v2.1.0
v2.2.0
v2.3.0
v2.4.0
v2.5.0
v2.5.1
v2.6.0
v2.7.0
v2.7.1
v2.7.2
v2.7.3
v2.8.0
```

## Undo

```
git reset HEAD~1 --mixed
```

Resets the current HEAD to the previous commit. Changes in the working directory and index are preserved.

```
Unstaged changes after reset:
M       .size-limit.json
M       src/components/routes.tsx
```

Options explained

* `HEAD~1` – The commit before the current HEAD.
* `--mixed` – Reset the index but not the working directory.

## Grep across history

```
git rev-list --all | xargs git grep -F <search>
```

Searches for a specific term across all commits in the repository.

```
0c954d8e019c4b152e082e1fcf70f47392100c0e:README.md:### Pages meta data
0c954d8e019c4b152e082e1fcf70f47392100c0e:README.md:For adding custom styles, scripts, meta tags and
for more flexible customization of the entire document
0c954d8e019c4b152e082e1fcf70f47392100c0e:README.md:      <meta httpEquiv="X-UA-Compatible" content="
IE=edge" />
0c954d8e019c4b152e082e1fcf70f47392100c0e:README.md:      <meta charSet="utf-8" />
0c954d8e019c4b152e082e1fcf70f47392100c0e:README.md:      <meta name="viewport" content="width=device
-width, initial-scale=1" />
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/client/index.ts:export {Meta} from '../components/meta'
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/context.tsx:  meta?: MetaData
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/context.tsx:  onChangeMetaData: (meta: MetaD
ata) => void
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/context.tsx:  const [meta, setMeta] = useSta
te<MetaData>(value.meta ?? {})
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/context.tsx:      meta,
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/context.tsx:    [value, meta]
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/document.tsx:import {Meta} from './meta'
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/document.tsx:      <meta httpEquiv="X-UA-Com
patible" content="IE=edge" />
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/document.tsx:      <meta charSet="utf-8" />
0c954d8e019c4b152e082e1fcf70f47392100c0e:src/components/document.tsx:      <meta name="viewport" con
tent="width=device-width, initial-scale=1" />
```

## Cleanup branches

```
git branch --merged | sed "s/* master//g" | xargs -I % bash -c "git branch -d %; git push origin :%"
```

Deletes all local branches that have been merged into the master branch and removes them from the remote repository.

* `--merged` – List branches that have been merged into the current branch.
* `sed "s/* master//g"` – Remove master branch from the list.
* `xargs -I` – Interactively merged branches.

## Mass pull

```
find . -type d -depth 1 -exec git --git-dir={}/.git --work-tree=$PWD/{} pull origin master \;
```

Pulls changes from the master branch into all subdirectories that are Git repositories.

* `-type d` – Search for directories.
* `-depth 1` – Only search the current directory.
* `-exec {} \;` – Run a command for every find.

