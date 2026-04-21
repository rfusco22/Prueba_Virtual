#!/usr/bin/sh

cd /home/ec2-user/callidon-equipment
cp db.sqlite3 ../db.sqlite3.$(date -d "today" +"%Y%m%d%H%M")

