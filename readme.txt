# run env 
.venv/scripts/activate
# start backend
cd backend
uvicorn app.main:app --reload
# start frontend (Second terminal)
npm run dev

# What to do 
when you login if pass or user name is wrong it does not show a popup insted it reloads
add one more registration factor email
