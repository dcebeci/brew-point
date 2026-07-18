$ErrorActionPreference = "Continue"
cd F:\Projects\brew-point
$pkg = Get-Content package.json | ConvertFrom-Json
$all = @{}
$pkg.dependencies.PSObject.Properties | ForEach-Object { $all[$_.Name] = $_.Value }
$pkg.devDependencies.PSObject.Properties | ForEach-Object { $all[$_.Name] = $_.Value }

$tmp = "$env:TEMP\bp-fix"
Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

foreach ($name in $all.Keys) {
  $folder = "node_modules\" + ($name -replace '/', '\')
  $exists = Test-Path "$folder\package.json"
  if (-not $exists) {
    Write-Output "MISSING: $name -> fixing..."
    Push-Location $tmp
    $range = $all[$name] -replace '[\^~]', ''
    npm pack "$name@$range" 2>$null | Out-Null
    $tgz = Get-ChildItem *.tgz | Select-Object -Last 1
    tar -xzf $tgz.FullName
    Pop-Location
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    Copy-Item "$tmp\package\*" -Destination $folder -Recurse -Force
    Remove-Item "$tmp\package" -Recurse -Force
    Remove-Item "$tmp\$($tgz.Name)" -Force
  } else {
    Write-Output "ok: $name"
  }
}
Write-Output "DONE"
