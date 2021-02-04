#!/bin/sh
cd /home/pi/ally-refrigerator
git fetch

NEW_PACKAGE_VERSION=$(git diff origin/master HEAD \
 | grep version \
 | head -1 \
 | awk -F: '{ print $2 }' \
 | sed 's/[",]//g' \
 | tr -d '[[:space:]]')

CURRENT_PACKAGE_VERSION=$(git diff origin/master HEAD \
  | grep version \
  | head -2 \
  | sed -n -e '2,2p' \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')


if [ "$NEW_PACKAGE_VERSION" != "$CURRENT_PACKAGE_VERSION" ];
then
    echo "Есть обновление для контроллера!"
    echo "Текущая версия:"
    echo $CURRENT_PACKAGE_VERSION
    echo "Версия в репо:"
    echo $NEW_PACKAGE_VERSION
    git checkout -- package-lock.json
    git pull
    npm install
    /usr/local/bin/pm2 restart ecosystem.config.js
fi
