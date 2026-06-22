$jsonContent = [System.IO.File]::ReadAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', [System.Text.Encoding]::UTF8)
$data = ConvertFrom-Json $jsonContent

$bad = $data.questions | Where-Object { $_.question -match 'เลือก' }
$bad | Select-Object id, question, correct_answer | ConvertTo-Json -Depth 5
