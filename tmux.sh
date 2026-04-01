#!/bin/bash
SESSION="conexao_monstrinho"
VENV="/home/ramon/MDIS/mdis/venv/bin/activate"
SCRIPT="/home/ramon/MDIS/mdis/main.py"
LOG="/home/ramon/MDIS/mdis/logs/main.log"

mkdir -p "$(dirname "$LOG")"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "⚠️ A sessão '$SESSION' já está em execução."
  echo "➡️ Abra com: tmux attach -t $SESSION"
else
  echo "🚀 Iniciando sessão '$SESSION'..."
  tmux new-session -d -s "$SESSION" \
    "bash -lc 'source \"$VENV\" && python -u \"$SCRIPT\" 2>&1 | tee -a \"$LOG\"; exec bash'"
  echo "✅ Sessão '$SESSION' criada com sucesso."
  echo "➡️ Logs: tail -f $LOG"
fi
