#!/bin/bash
killall gunicorn
source /home/ec2-user/callidon-equipment/env/bin/activate
pip install 'gunicorn==20.1.*'
source ../.DJANGO_SECRET_KEY
gunicorn -c /home/ec2-user/callidon-equipment/config/gunicorn/dev.py
