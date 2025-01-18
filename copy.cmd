@echo off
setlocal enabledelayedexpansion

REM Export MongoDB collections
ssh -l ubuntu ai-coach.club "docker exec ai-coach_mongodb_1 mongoexport --db ai-coach --collection users --type csv --out users.csv --fields _id,email,firstName,lastName,subscriptionStatus,subscriptionId,createdAt,lastLogin,isAdmin,visitedCountries,preferences"
ssh -l ubuntu ai-coach.club "docker exec ai-coach_mongodb_1 mongoexport --db ai-coach --collection exercises --type csv --out exercises.csv --fields _id,name,description,difficulty,category,equipment,videoUrl,createdAt,updatedAt"
ssh -l ubuntu ai-coach.club "docker exec ai-coach_mongodb_1 mongoexport --db ai-coach --collection teams --type csv --out teams.csv --fields _id,name,clubId,players,coaches,division,season"
ssh -l ubuntu ai-coach.club "docker exec ai-coach_mongodb_1 mongoexport --db ai-coach --collection waitlists --type csv --out waitlists.csv --fields _id,email,role"

REM Copy exported files to local machine
scp ubuntu@ai-coach.club:/home/ubuntu/users.csv .
scp ubuntu@ai-coach.club:/home/ubuntu/waitlists.csv .
scp ubuntu@ai-coach.club:/home/ubuntu/exercises.csv .
scp ubuntu@ai-coach.club:/home/ubuntu/teams.csv .
