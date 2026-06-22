const fs = require('fs');
const content = fs.readFileSync('c:/Users/prang/OneDrive/Cert/ProjectPlus/question-data.js', 'utf8');
const jsonStr = content.replace('window.examData = ', '');
try {
  const data = JSON.parse(jsonStr);
  const q30 = data.questions.find(q => q.number == '30' || q.id == 30);
  const q31 = data.questions.find(q => q.number == '31' || q.id == 31);
  console.log(JSON.stringify(q30, null, 2));
  console.log("------------------------");
  console.log(JSON.stringify(q31, null, 2));
} catch (e) {
  console.error("Parse error:", e);
}
