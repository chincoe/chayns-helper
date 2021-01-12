setlocal ENABLEDELAYEDEXPANSION
FOR /F "tokens=* USEBACKQ" %%F IN (`npm view chayns-helper version`) DO (
SET pkgversion=%%F
)
SET str=%1
SET depmessage=%str:#pkgversion#=!pkgversion!%
npm deprecate chayns-helper@%pkgversion% %depmessage%