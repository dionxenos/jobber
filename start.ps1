$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

wt.exe new-tab --title "API" -d "$scriptDir\API" cmd /k "dotnet watch" `; `
       new-tab --title "Client" -d "$scriptDir\client" cmd /k "npm start"
