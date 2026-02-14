🆘 Backup & Restore Guide
This guide explains the Safe Backup system and provides commands to recover your environment if settings are lost or wiped.

📂 File Descriptions
Your ~/Documents/Claude_Backup folder contains the following assets:

1. Configuration Backups (JSON)
global_settings.json: Direct copy of your Claude settings. Contains raw API tokens for seamless login restoration.

global_settings_SAFE.json: Redacted version of global settings. Your ANTHROPIC_AUTH_TOKEN has been removed for safe sharing or off-site storage.

local_settings_SAFE.json: Project-specific settings for AI_Personal_Assistant_Core, stripped of sensitive keys.

2. Logic & Tools (Scripts)
safe_backup.sh: The "engine" that runs when you use the cb alias. It handles file copying and secret redaction.

statusline.sh: The script generating your colorful terminal status bar, including token usage and Git context.

🛠 Restoration Commands
To restore your files, run these commands in your terminal to move backups back to their original system locations.

1. Restore Global Settings
Restores theme preferences, MCP servers, and active login sessions.

Bash
cp ~/Documents/Claude_Backup/global_settings.json ~/Library/Application\ Support/Claude/settings.json
2. Restore Status Line Script
Restores the custom terminal progress bar.

Bash
cp ~/Documents/Claude_Backup/statusline.sh ~/.claude/scripts/statusline.sh
3. Restore Maintenance Tool (cb alias)
Restores the backup script and resets its permissions.

Bash
cp ~/Documents/Claude_Backup/safe_backup.sh ~/Documents/Claude_Backup/safe_backup.sh
chmod +x ~/Documents/Claude_Backup/safe_backup.sh
4. Restore Local Project Template
Restores the secure .example template to the project root.

Bash
cp ~/Documents/Claude_Backup/local_settings_SAFE.json ./.claude/settings.local.json.example
⚠️ Important Considerations
Restoring to YOUR Mac: Always use global_settings.json to keep your active tokens so you don't have to log in again.

Restoring to a NEW Mac: Use global_settings_SAFE.json. You will need to log in manually, but your API keys remain secure.

Final Step: Always run source ~/.zshrc after restoring to refresh your terminal configuration.

## 🚀 How to activate the 'cr' command
If you are on a new machine and just created the script, run these two commands once:

1. **Make it executable**: `chmod +x ~/Documents/Claude_Backup/restore_env.sh`
2. **Reload your settings**: `source ~/.zshrc`

**Now you can just type `cr` anytime to restore!**