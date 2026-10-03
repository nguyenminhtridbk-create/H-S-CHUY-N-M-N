const fs = require('fs');

const text = fs.readFileSync('/tmp/bundle.js', 'utf-8');

// Find all matches for teacher objects, departments, classes, subjects, assignments
// Let us search for dept-
const deptIndex = text.indexOf('dept-toan');
console.log('dept-toan index:', deptIndex);
if (deptIndex !== -1) {
  console.log('Surrounding dept-toan:', text.substring(deptIndex - 100, deptIndex + 400));
}

// Search for list of departments
const deptArrayMatch = text.indexOf('id:"dept-');
console.log('First id:dept- at:', deptArrayMatch);
if (deptArrayMatch !== -1) {
  console.log('Context:', text.substring(deptArrayMatch - 100, deptArrayMatch + 500));
}

// Search for classes (e.g. 6A1, 10A1, etc.)
const classMatch = text.indexOf('"6A1"');
console.log('Class 6A1 at:', classMatch);
if (classMatch !== -1) {
  console.log('Context of 6A1:', text.substring(classMatch - 100, classMatch + 400));
}
