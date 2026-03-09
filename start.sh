#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Convert Git Bash path to Windows path if needed
to_win_path() {
    if command -v cygpath &>/dev/null; then
        cygpath -w "$1"
    else
        echo "$1"
    fi
}

if command -v wt.exe &>/dev/null; then
    API_DIR=$(to_win_path "$SCRIPT_DIR/API")
    CLIENT_DIR=$(to_win_path "$SCRIPT_DIR/client")
    MSYS_NO_PATHCONV=1 wt.exe -w 0 new-tab --title "API" -d "$API_DIR" -- cmd /k "dotnet watch" \; new-tab --title "Client" -d "$CLIENT_DIR" -- cmd /k "npm start"
elif command -v gnome-terminal &>/dev/null; then
    gnome-terminal --tab --title="API" -- bash -c "cd '$SCRIPT_DIR/API' && dotnet watch; exec bash"
    gnome-terminal --tab --title="Client" -- bash -c "cd '$SCRIPT_DIR/client' && npm start; exec bash"
elif command -v open &>/dev/null; then
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR/API' && dotnet watch\""
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR/client' && npm start\""
else
    echo "No supported terminal found. Starting in background..."
    cd "$SCRIPT_DIR/API" && dotnet watch &
    cd "$SCRIPT_DIR/client" && npm start &
    wait
fi
