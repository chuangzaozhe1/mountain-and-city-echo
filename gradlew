#!/bin/sh

GRADLE_HOME="/d/开发项目/.gradle/wrapper/dists/gradle-8.14.3-all/10utluxaxniiv4wxiphsi49nj/gradle-8.14.3"
APP_HOME=$( cd "${0%/*}" && pwd -P ) || exit

exec "$GRADLE_HOME/bin/gradle" -p "$APP_HOME" "$@"
