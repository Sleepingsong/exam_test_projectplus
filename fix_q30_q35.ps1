$ErrorActionPreference = 'Stop'

$jsonContent = [System.IO.File]::ReadAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', [System.Text.Encoding]::UTF8)
$data = ConvertFrom-Json $jsonContent

foreach ($q in $data.questions) {
    if ($q.id -eq 30) {
        # Fix the options to maintain order using ordered hashtable
        $q.options = [ordered]@{
            "A" = "ดีพลอยแอปพลิเคชัน"
            "B" = "แผนการย้อนเป็นเวอร์ชันก่อนหน้า"
            "C" = "การตรวจสอบความถูกต้อง"
            "D" = "กําหนดช่วงเวลาบํารุงรักษา"
        }
    }
    if ($q.number -eq "35" -and $q.quiz -eq "Project+_Quiz_1") {
        # Fix the correct answer to D
        $q.correct_answer = "D"
    }
}

$rawJson = $data | ConvertTo-Json -Depth 10

# Replace unicode escapes
$cleanJson = [System.Text.RegularExpressions.Regex]::Replace($rawJson, "\\u(?<Value>[a-zA-Z0-9]{4})", {
    param($m)
    [char][int]::Parse($m.Groups['Value'].Value, [System.Globalization.NumberStyles]::HexNumber)
})

[System.IO.File]::WriteAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', $cleanJson, [System.Text.Encoding]::UTF8)

$jsContent = "window.examData = " + $cleanJson + ";"
[System.IO.File]::WriteAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question-data.js', $jsContent, [System.Text.Encoding]::UTF8)

Write-Host "Fixed Q30 options order and Q35 answer successfully!"
