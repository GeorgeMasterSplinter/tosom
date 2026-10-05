$ErrorActionPreference = 'Stop'
$script = 'C:\Users\Creeq\AIWorkspace\scripts\uninstall.ps1'
Start-Process powershell.exe -ArgumentList ('-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File ' + $script) -WindowStyle Hidden
Start-Sleep -Seconds 3
Write-Output 'LAUNCHED'
