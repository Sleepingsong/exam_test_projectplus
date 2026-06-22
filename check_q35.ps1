$jsonContent = [System.IO.File]::ReadAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', [System.Text.Encoding]::UTF8)
$data = ConvertFrom-Json $jsonContent

$q34 = $data.questions | Where-Object { $_.number -eq '34' }
$q35 = $data.questions | Where-Object { $_.number -eq '35' }
$q36 = $data.questions | Where-Object { $_.number -eq '36' }

Write-Host "--- Q34 ---"
Write-Host "Q: $($q34.question)"
Write-Host "A: $($q34.correct_answer | ConvertTo-Json -Compress)"

Write-Host "`n--- Q35 ---"
Write-Host "Q: $($q35.question)"
Write-Host "Options: $($q35.options | ConvertTo-Json -Compress)"
Write-Host "A: $($q35.correct_answer | ConvertTo-Json -Compress)"

Write-Host "`n--- Q36 ---"
Write-Host "Q: $($q36.question)"
Write-Host "A: $($q36.correct_answer | ConvertTo-Json -Compress)"
