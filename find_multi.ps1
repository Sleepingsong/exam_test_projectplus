$jsonContent = [System.IO.File]::ReadAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', [System.Text.Encoding]::UTF8)
$data = ConvertFrom-Json $jsonContent

$bad = $data.questions | Where-Object { $_.question -match '\(เลือก' }
foreach ($q in $bad) {
    Write-Host "ID: $($q.id) - Ans: $($q.correct_answer | ConvertTo-Json -Compress) - Text: $($q.question)"
}
