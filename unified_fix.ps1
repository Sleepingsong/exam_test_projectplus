$ErrorActionPreference = 'Stop'

$jsonContent = [System.IO.File]::ReadAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', [System.Text.Encoding]::UTF8)
$data = ConvertFrom-Json $jsonContent

$oldQuestions = $data.questions
$newQuestions = @()

for ($i = 0; $i -le 28; $i++) {
    $q = $oldQuestions[$i] | Select-Object *
    $newQuestions += $q
}

# Fix 29 (id 30)
$q30 = $oldQuestions[29] | Select-Object *
$q30.options = @{
    "A" = "ดีพลอยแอปพลิเคชัน"
    "B" = "แผนการย้อนเป็นเวอร์ชันก่อนหน้า"
    "C" = "การตรวจสอบความถูกต้อง"
    "D" = "กําหนดช่วงเวลาบํารุงรักษา"
}
$q30.correct_answer = "D"
$newQuestions += $q30

# Insert 30 (id 31)
$q31 = New-Object PSObject -Property @{
    id = 31
    quiz = "Project+_Quiz_1"
    number = "31"
    question = "ผู้จัดการโครงการได้รับการส่งต่อปัญหามาจากกลุ่มภายนอกที่รายงานว่างานส่งมอบที่คาดไว้ควรจะพร้อมใช้งานได้สักระยะหนึ่งแล้ว หลังจากการวิเคราะห์ ทีมงานของโครงการก็ทราบว่างานส่งมอบดังกล่าวได้มีการส่งมอบอย่างตรงเวลา ผู้จัดการโครงการควรทําข้อใดเป็นอันดับต่อไป"
    options = $oldQuestions[29].options
    correct_answer = $oldQuestions[29].correct_answer
    is_highlighted_green = $true
    explanation = $oldQuestions[30].explanation
}
$q31 = $q31 | Select-Object id, quiz, number, question, options, correct_answer, is_highlighted_green, explanation
$newQuestions += $q31

# Shift 31 to 141 (id 32 to 142)
for ($i = 31; $i -le 141; $i++) {
    $q = $oldQuestions[$i-1] | Select-Object *
    $q.id = $i + 1
    $q.explanation = $oldQuestions[$i].explanation
    $newQuestions += $q
}

# Add 142 (id 143, Quiz 2 Q60)
$q60 = $oldQuestions[141] | Select-Object *
$q60.id = 143
$q60.explanation = @{
    correct_reason = "การตรวจสอบแผนการสื่อสาร (Review communication plan) เป็นสิ่งแรกที่ควรทำเมื่อมีคำขอรายงานหรือข้อมูลใหม่ๆ เพื่อดูว่ารายงานเหล่านั้นควรรวมอยู่ในการสื่อสารปกติหรือไม่ และใครควรเป็นผู้รับผิดชอบ"
    incorrect_reasons = @{}
}
$newQuestions += $q60

# Fix multiple choice arrays
foreach ($q in $newQuestions) {
    if ($q.id -eq 76) {
        $q.correct_answer = @("C", "E")
    }
    if ($q.id -eq 78) {
        $q.correct_answer = @("A", "C")
    }
}

$data.total_questions = 143
$data.questions = $newQuestions

$rawJson = $data | ConvertTo-Json -Depth 10

# Replace unicode escapes
$cleanJson = [System.Text.RegularExpressions.Regex]::Replace($rawJson, "\\u(?<Value>[a-zA-Z0-9]{4})", {
    param($m)
    [char][int]::Parse($m.Groups['Value'].Value, [System.Globalization.NumberStyles]::HexNumber)
})

[System.IO.File]::WriteAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question.json', $cleanJson, [System.Text.Encoding]::UTF8)

$jsContent = "window.examData = " + $cleanJson + ";"
[System.IO.File]::WriteAllText('c:\Users\prang\OneDrive\Cert\ProjectPlus\question-data.js', $jsContent, [System.Text.Encoding]::UTF8)

Write-Host "Unified data fixed successfully using ConvertTo-Json!"
