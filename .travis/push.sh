#!/bin/sh
readonly GITHUB_ORG="${GITHUB_ORG:-y1j2x34}"
readonly GITHUB_REPO="${GITHUB_REPO:-rest-client}"
readonly TARGET_BRANCH="${TARGET_BRANCH:-master}"
readonly SOURCE_BRANCH="${SOURCE_BRANCH:-master}"

readonly AUTOCOMMIT_NAME="Travis CI"
readonly AUTOCOMMIT_EMAIL="travis@travis-ci.org"
readonly AUTOCOMMIT_BRANCH="temp"

log() {
  echo "$@" >&2
}

ensure_preconditions_met() {
#   if [ -z "${TRAVIS_PULL_REQUEST_BRANCH}" ]; then
#     log "Job is CI for a push, skipping creation of production build"
#     exit 0
#   fi
#   if [ "${TRAVIS_BRANCH}_${TRAVIS_PULL_REQUEST_BRANCH}" != "${TARGET_BRANCH}_${SOURCE_BRANCH}" ]; then
#     log "Skipping creation of production build"
#     log "We only create production builds for pull requests from '${SOURCE_BRANCH}' to '${TARGET_BRANCH}'"
#     log "but this pull request is from '${TRAVIS_PULL_REQUEST_BRANCH}' to '${TRAVIS_BRANCH}'"
#     exit 0
#   fi
  if [ -z "${GITHUB_TOKEN}" ]; then
    log "GITHUB_TOKEN not set: won't be able to push production build"
    log "Please configure the token in .travis.yml or the Travis UI"
    exit 1
  fi
}

setup_git() {
  git config --global user.email "${AUTOCOMMIT_EMAIL}"
  git config --global user.name "${AUTOCOMMIT_NAME}"
  git remote add origin-travis "https://${GITHUB_TOKEN}@github.com/${GITHUB_ORG}/${GITHUB_REPO}.git"
}

commit_build_files() {
  git checkout -b "${AUTOCOMMIT_BRANCH}"
  git add ./dist
  git commit -m "travis: ${TRAVIS_BUILD_NUMBER}"
}

push_to_github() {
  git push --set-upstream origin-travis "${AUTOCOMMIT_BRANCH:SOURCE_BRANCH}"
}

ensure_preconditions_met
setup_git
commit_build_files
push_to_github
