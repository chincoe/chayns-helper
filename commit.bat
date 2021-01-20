setlocal ENABLEDELAYEDEXPANSION
timeout /t 3 /nobreak > NUL
FOR /F "tokens=* USEBACKQ" %%F IN (`npm view chayns-helper version`) DO (
SET pkgversion=%%F
)
SET str=%1
git commit -m ":bookmark: %str% %pkgversion%"
git push
git push --tags
