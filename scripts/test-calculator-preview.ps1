# Quick test: fetch preview page and check calculator + script version
$url = 'http://127.0.0.1:8788/'
try {
  $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 15
  $code = $resp.StatusCode
  $body = $resp.Content
  Write-Host "Status: $code"
  if ($body -match 'id="calculator"') { Write-Host "OK: #calculator section present" }
  if ($body -match '3\.6-brands-compact') { Write-Host "OK: script version 3.6-brands-compact" }
  if ($body -match 'price-calculator\.js') { Write-Host "OK: price-calculator.js referenced" }
  if ($body -match 'Alegeți marca|selectBrand') { Write-Host "OK: calculator brand label" }
  Write-Host "Test done."
} catch {
  Write-Host "Error: $($_.Exception.Message)"
  exit 1
}
