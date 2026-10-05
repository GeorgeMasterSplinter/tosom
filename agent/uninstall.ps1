$ErrorActionPreference = 'Continue'
$ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$logDir = 'C:\Users\Creeq\AIWorkspace\logs'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir 'uninstall.log'
Set-Content -Path $logFile -Value ('=== UNINSTALL RUN ' + $ts + ' ===') -Encoding UTF8

function Log($m) {
  $l = ((Get-Date -Format 'HH:mm:ss') + ' ' + $m)
  Write-Output $l
  Add-Content -Path $logFile -Value $l -Encoding UTF8
}

function Restart-Installer {
  taskkill /F /IM msiexec.exe 2>&1 | Out-Null
  net stop msiserver 2>&1 | Out-Null
  Start-Sleep -Seconds 2
  net start msiserver 2>&1 | Out-Null
}

$regPaths = @(
  'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
  'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
  'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
function Get-Entries { return @(Get-ItemProperty $regPaths -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName }) }

$targets = @(
  @{ Match='DaVinci Resolve Control Panels*'; Label='DaVinci Resolve Control Panels' },
  @{ Match='DaVinci Resolve';               Label='DaVinci Resolve'; Exact=$true },
  @{ Match='Blackmagic RAW*';               Label='Blackmagic RAW' },
  @{ Match='CapCut*';                       Label='CapCut' },
  @{ Match='Wondershare Filmora*';          Label='Wondershare Filmora' },
  @{ Match='Wondershare NativePush*';       Label='Wondershare NativePush' },
  @{ Match='Counter-Strike: Source';        Label='Counter-Strike: Source'; Exact=$true },
  @{ Match='Intel Endurance Gaming*';       Label='Intel Endurance Gaming' }
)

# Close any running instances of the target apps (best-effort) so uninstalls are not blocked
$closeProcs = @('EnduranceGamingProcess','IntelEnduranceGaming','CapCut','Filmora','FilmoraMix','Resolve','Fusion','hl2')
foreach ($pn in $closeProcs) {
  $gp = Get-Process -Name $pn -ErrorAction SilentlyContinue
  if ($gp) { Log ('CLOSE PROCESS: ' + $pn); $gp | Stop-Process -Force -ErrorAction SilentlyContinue; Start-Sleep -Seconds 2 }
}

function Run-Waited($exe, $argsText, $maxWait) {
  if ($argsText) { $p = Start-Process -FilePath $exe -ArgumentList $argsText -PassThru -WindowStyle Normal }
  else { $p = Start-Process -FilePath $exe -PassThru -WindowStyle Normal }
  $elapsed = 0
  while (-not $p.HasExited -and $elapsed -lt $maxWait) { Start-Sleep -Seconds 3; $elapsed += 3 }
  if ($p.HasExited) { return $p.ExitCode }
  return -999
}

foreach ($t in $targets) {
  $ms = @(if ($t.Exact) { Get-Entries | Where-Object { $_.DisplayName -eq $t.Match } } else { Get-Entries | Where-Object { $_.DisplayName -like $t.Match } })
  if ($ms.Count -eq 0) { Log ('SKIP not-found: ' + $t.Label); continue }
  foreach ($e in $ms) {
    Log ('>>> ' + $e.DisplayName + '  [' + $e.Publisher + ']')
    $us = ([string]$e.UninstallString).Trim()
    if ($us -eq '') { Log '    (no UninstallString - skipping)'; continue }
    if ($us.StartsWith('"')) {
      $end = $us.IndexOf('"', 1)
      $exe = $us.Substring(1, $end - 1); $rest = $us.Substring($end + 1).Trim()
    } else {
      $sp = $us.IndexOf(' ')
      if ($sp -lt 0) { $exe = $us; $rest = '' } else { $exe = $us.Substring(0, $sp); $rest = $us.Substring($sp + 1).Trim() }
    }
    $base = [System.IO.Path]::GetFileName($exe).ToLower()
    $isMsi = ($base -eq 'msiexec.exe' -or $base -eq 'msiexec' -or $exe -like '*msiexec*')
    if ($isMsi) {
      $exe = (Join-Path $env:windir 'System32\msiexec.exe')
      $rest = ($rest -replace '/[iI]','/X')
      if ($rest -notmatch '/qn') { $rest = (($rest + ' /qn /norestart').Trim()) }
    }
    elseif ($base -like 'unins*.exe') { if ($rest -notmatch '/VERYSILENT') { $rest = (($rest + ' /VERYSILENT /NORESTART /SUPPRESSMSGBOXES').Trim()) } }
    elseif ($base -eq 'uninstall.exe') { if ($rest -notmatch '/S') { $rest = (($rest + ' /S').Trim()) } }
    if ($exe -match '^https?://') { Log '    (URL uninstaller - cannot run headless)'; continue }
    $txt = ''; if ($rest) { $txt = '  ARGS: ' + $rest }
    Log ('    RUN: ' + $exe + $txt)
    try {
      if ($isMsi) {
        $code = Run-Waited $exe $rest 240
        if ($code -eq -999) {
          Log '    MSI timed out (240s) - killing msiexec + restarting installer service, retrying'
          Restart-Installer
          Start-Sleep -Seconds 5
          $code = Run-Waited $exe $rest 240
        }
        if ($code -eq -999) { Log '    MSI still stuck after retry - moving on' } else { Log ('    RESULT: exit=' + $code) }
      } else {
        $code = Run-Waited $exe $rest 300
        if ($code -eq -999) { Log '    Timed out (300s) - may need manual action - moving on' } else { Log ('    RESULT: exit=' + $code) }
      }
    } catch {
      Log ('    ERROR: ' + $_.Exception.Message)
    }
    Start-Sleep -Seconds 3
  }
}

Log '=== POST-VERIFY ==='
$after = Get-Entries
foreach ($t in $targets) {
  $c = @(if ($t.Exact) { $after | Where-Object { $_.DisplayName -eq $t.Match } } else { $after | Where-Object { $_.DisplayName -like $t.Match } }).Count
  if ($c -eq 0) { Log ('GONE: ' + $t.Label) } else { Log ('STILL PRESENT (' + $c + '): ' + $t.Label) }
}
Log 'ALL_DONE'
