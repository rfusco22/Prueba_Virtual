# Installation (local testing)

```
git clone https://github.com/aldomariorm/callidon-equipment.git
cd callidon-equipment
python3 -m venv env
virtualenv env
source env/bin/activate
pip install -r requirements.txt
git apply local_test.diff
python manage.py runserver
```
