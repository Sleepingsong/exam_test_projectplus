$jsonContent = [System.IO.File]::ReadAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', [System.Text.Encoding]::UTF8)
$data = ConvertFrom-Json $jsonContent

foreach ($q in $data.questions) {
    if ($q.id -eq 76 -or $q.id -eq "76") {
        $q.correct_answer = @("C", "E")
    }
    if ($q.id -eq 78 -or $q.id -eq "78") {
        $q.correct_answer = @("A", "C")
    }
}

$rawJson = $data | ConvertTo-Json -Depth 10

$cleanJson = [System.Text.RegularExpressions.Regex]::Replace($rawJson, "\\u(?<Value>[a-zA-Z0-9]{4})", {
    param($m)
    [char][int]::Parse($m.Groups['Value'].Value, [System.Globalization.NumberStyles]::HexNumber)
})

[System.IO.File]::WriteAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', $cleanJson, [System.Text.Encoding]::UTF8)

$jsContent = "window.examData = " + $cleanJson + ";"
[System.IO.File]::WriteAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question-data.js', $jsContent, [System.Text.Encoding]::UTF8)

Write-Host "Fixed multi-choice Q76 and Q78 successfully!"
