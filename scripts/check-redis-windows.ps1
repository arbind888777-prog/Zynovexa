$redisExe = "C:\Program Files\Redis\redis-server.exe"
$memuraiServices = Get-Service *memurai* -ErrorAction SilentlyContinue
$msiProcesses = Get-Process msiexec -ErrorAction SilentlyContinue
$portBusy = Get-NetTCPConnection -LocalPort 6379 -ErrorAction SilentlyContinue | Select-Object -First 1

Write-Output "Redis Windows diagnostics"
Write-Output "------------------------"

if (Test-Path $redisExe) {
  Write-Output "Redis binary: present ($redisExe)"
} else {
  Write-Output "Redis binary: missing"
}

if ($memuraiServices) {
  Write-Output "Memurai service(s):"
  $memuraiServices | ForEach-Object { Write-Output ("- {0}: {1}" -f $_.Name, $_.Status) }
} else {
  Write-Output "Memurai service: not installed"
}

if ($msiProcesses) {
  Write-Output "Windows Installer lock: active"
} else {
  Write-Output "Windows Installer lock: none"
}

if ($portBusy) {
  Write-Output "Redis port 6379: listening"
} else {
  Write-Output "Redis port 6379: not listening"
}

Write-Output ""
Write-Output "Recommended next step:"
if ($msiProcesses) {
  Write-Output "- Close the other installer or reboot Windows, then retry: winget install --id Redis.Redis"
} elseif (Test-Path $redisExe) {
  Write-Output "- Start Redis manually: & 'C:\Program Files\Redis\redis-server.exe'"
} else {
  Write-Output "- Install Redis: winget install --id Redis.Redis --accept-source-agreements --accept-package-agreements"
}