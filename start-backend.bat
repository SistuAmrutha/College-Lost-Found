@echo off
title College Lost & Found - Spring Boot Backend
echo ========================================================
echo   Starting College Lost & Found - Spring Boot Backend
echo   API: http://localhost:8080/api
echo   Swagger: http://localhost:8080/swagger-ui.html
echo ========================================================
cd /d "%~dp0backend"
mvn spring-boot:run
pause
