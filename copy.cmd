@echo off
setlocal enabledelayedexpansion

REM Export collections with expanded fields and metadata
ssh -l ubuntu ai-coach.shop "docker exec ai-coach_mongodb_1 mongoexport --db ai-coach --type csv --collection users --fields _id,email,firstName,lastName,subscriptionStatus,subscriptionId,createdAt,lastLogin,isAdmin,visitedCountries,preferences.language,preferences.currency,preferences.interests,preferences.bio >users.csv"

REM Copy exported files to local machine
scp ubuntu@ai-coach.club:/home/ubuntu/users.csv .
