const API_URL = 'http://localhost:5000/api/students';
const TEACHER_API_URL = 'http://localhost:5000/api/teachers';
const AUTH_URL = 'http://localhost:5000/api/auth';

// UI Elements
const loginSection = document.getElementById('loginSection');
const roleSelection = document.getElementById('roleSelection');
const loginFormContainer = document.getElementById('loginFormContainer');
const loginTitle = document.getElementById('loginTitle');
const selectedRoleInput = document.getElementById('selectedRole');

const dashboardSection = document.getElementById('dashboardSection');
const adminPanel = document.getElementById('adminPanel');
const teacherPanel = document.getElementById('teacherPanel');
const studentCoursePanel = document.getElementById('studentCoursePanel');
const studentMessagePanel = document.getElementById('studentMessagePanel');

const logoutBtn = document.getElementById('logoutBtn');
const userNameDisplay = document.getElementById('userNameDisplay');
const userRoleDisplay = document.getElementById('userRoleDisplay');

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        showDashboard(localStorage.getItem('role'), localStorage.getItem('username'));
    }
});

// Role Selection UI Logic
window.selectRole = function(role) {
    roleSelection.style.display = 'none';
    loginFormContainer.style.display = 'block';
    selectedRoleInput.value = role;
    
    // Update Title based on role
    if(role === 'admin') loginTitle.innerText = "Admin Portal Login";
    if(role === 'teacher') loginTitle.innerText = "Teacher Portal Login";
    if(role === 'student') loginTitle.innerText = "Student Portal Login";
}

window.backToRoles = function() {
    loginFormContainer.style.display = 'none';
    roleSelection.style.display = 'block';
}

// Login Logic
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const expectedRole = document.getElementById('selectedRole').value;

    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            // Optional: Check if the logged-in user matches the portal they clicked
            if (data.role !== expectedRole) {
                alert(`Warning: You logged in as ${data.role}, but selected the ${expectedRole} portal.`);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.username);
            showDashboard(data.role, data.username);
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error("Login Error:", err);
    }
});

// Logout Logic
logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Dashboard Router
function showDashboard(role, username) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'flex';
    
    userNameDisplay.innerText = username.toUpperCase();
    userRoleDisplay.innerText = role.toUpperCase();
    
    // Hide all role-specific panels first
    adminPanel.style.display = 'none';
    teacherPanel.style.display = 'none';
    studentCoursePanel.style.display = 'none';
    studentMessagePanel.style.display = 'none';
    
    // Show panels based on role
    if (role === 'admin') {
        adminPanel.style.display = 'block';
    } else if (role === 'teacher') {
        teacherPanel.style.display = 'block';
    } else if (role === 'student') {
        studentCoursePanel.style.display = 'block';
        studentMessagePanel.style.display = 'block';
    }

    fetchData(role, username);
}

// Admin Toggle Logic
window.toggleAdminView = function(view) {
    const studentSection = document.getElementById('adminStudentSection');
    const teacherSection = document.getElementById('adminTeacherSection');
    
    if(view === 'student') {
        studentSection.style.display = 'block';
        teacherSection.style.display = 'none';
    } else {
        studentSection.style.display = 'none';
        teacherSection.style.display = 'block';
    }
}

// Add New Student (Admin Only) - Dual Creation
document.getElementById('adminForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const enrollmentId = document.getElementById('regEnrollment').value;
    const password = document.getElementById('regStudentPassword').value;
    
    const subjectName = document.getElementById('regSubject').value || 'General Studies';
    const subjectMarks = document.getElementById('regMarks').value || 0;
    
    const newStudent = {
        enrollmentId: enrollmentId,
        name: document.getElementById('regName').value,
        course: document.getElementById('regCourse').value,
        attendance: document.getElementById('regAttendance').value || 0,
        grade: document.getElementById('regGrade').value || "Not Assigned",
        subjects: [
            { name: subjectName, semester: 3, marksPercentage: Number(subjectMarks) }
        ]
    };

    try {
        // 1. Create the User Login Credentials
        const authResponse = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: enrollmentId, password: password, role: 'student' })
        });

        if (!authResponse.ok) {
            const errorData = await authResponse.json();
            alert(`Failed to create Student login credentials: ${errorData.details || errorData.error}`);
            return;
        }

        // 2. Create the Student Profile
        const profileResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newStudent)
        });

        if (profileResponse.ok) {
            document.getElementById('adminForm').reset();
            fetchData('admin', localStorage.getItem('username'));
            alert("Student Registered and Credentials Created Successfully!");
        } else {
            alert("Failed to create student profile.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
});

// Add New Teacher (Admin Only) - Dual Creation
document.getElementById('adminTeacherForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const employeeId = document.getElementById('regTeacherId').value;
    const password = document.getElementById('regTeacherPassword').value;
    const subjectsRaw = document.getElementById('regTeacherSubjects').value;
    const subjectsArray = subjectsRaw.split(',').map(s => s.trim()).filter(s => s);
    
    const newTeacher = {
        employeeId: employeeId,
        name: document.getElementById('regTeacherName').value,
        department: document.getElementById('regTeacherDept').value,
        subjectsTaught: subjectsArray
    };

    try {
        // 1. Create the User Login Credentials
        const authResponse = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: employeeId, password: password, role: 'teacher' })
        });

        if (!authResponse.ok) {
            const errorData = await authResponse.json();
            alert(`Failed to create Teacher login credentials: ${errorData.details || errorData.error}`);
            return;
        }

        // 2. Create the Teacher Profile
        const profileResponse = await fetch(TEACHER_API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newTeacher)
        });

        if (profileResponse.ok) {
            document.getElementById('adminTeacherForm').reset();
            fetchData('admin', localStorage.getItem('username'));
            alert("Teacher Registered and Credentials Created Successfully!");
        } else {
            alert("Failed to create teacher profile.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
});


// Update Student Record (Teacher Only)
document.getElementById('teacherForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const enrollmentId = document.getElementById('updateEnrollment').value;
    const grade = document.getElementById('updateGrade').value;
    const attendance = document.getElementById('updateAttendance').value;
    const subjectName = document.getElementById('updateSubject').value;
    const marks = document.getElementById('updateMarks').value;

    const updates = {};
    if(grade) updates.grade = grade;
    if(attendance) updates.attendance = Number(attendance);
    
    // If a subject is provided, we update the subjects array
    if(subjectName && marks) {
        updates.subjects = [{ name: subjectName, semester: 3, marksPercentage: Number(marks) }];
    }

    try {
        const response = await fetch(`${API_URL}/${enrollmentId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            document.getElementById('teacherForm').reset();
            fetchData('teacher', localStorage.getItem('username'));
            alert("Student Record Updated!");
        } else {
            alert("Failed to update student. Ensure Enrollment ID is correct.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
});

// Fetch Data & Build UI
async function fetchData(role, username) {
    const token = localStorage.getItem('token');
    
    try {
        // Fetch Students
        const stuResponse = await fetch(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
        const students = await stuResponse.json();
        
        if (role === 'admin') {
            const adminGrid = document.getElementById('adminGrid');
            adminGrid.innerHTML = ''; 
            students.forEach(student => adminGrid.appendChild(createStudentCard(student)));
            
            // Also Fetch Teachers for Admin
            const teacherResponse = await fetch(TEACHER_API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
            if (teacherResponse.ok) {
                const teachers = await teacherResponse.json();
                const adminTeacherGrid = document.getElementById('adminTeacherGrid');
                adminTeacherGrid.innerHTML = '';
                teachers.forEach(teacher => adminTeacherGrid.appendChild(createTeacherCard(teacher)));
            }
            
        } else if (role === 'teacher') {
            const teacherGrid = document.getElementById('teacherGrid');
            teacherGrid.innerHTML = ''; 
            students.forEach(student => teacherGrid.appendChild(createStudentCard(student)));
        } else {
            // IF STUDENT: Only show their data
            const myData = students.find(s => s.enrollmentId === username);
            
            if (myData) {
                document.getElementById('studentCourseName').innerText = `${myData.course} (${myData.enrollmentId})`;
                
                const tbody = document.getElementById('studentSubjectsBody');
                tbody.innerHTML = '';
                
                if(myData.subjects && myData.subjects.length > 0) {
                    myData.subjects.forEach(sub => {
                        tbody.innerHTML += `
                            <tr>
                                <td>${sub.name}</td>
                                <td>${sub.semester}</td>
                                <td>${sub.marksPercentage}%</td>
                            </tr>
                        `;
                    });
                } else {
                    tbody.innerHTML = `<tr><td colspan="3">No subject data found.</td></tr>`;
                }
                
                tbody.innerHTML += `
                    <tr style="background: rgba(0,0,0,0.05); font-weight: bold;">
                        <td>Overall Attendance</td>
                        <td>-</td>
                        <td>${myData.attendance || 0}%</td>
                    </tr>
                    <tr style="background: rgba(0,0,0,0.05); font-weight: bold;">
                        <td>Overall Grade</td>
                        <td colspan="2">${myData.grade}</td>
                    </tr>
                `;

            }
        }
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

// Helper function to draw a simple card for admin/teacher views
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    
    let subjectHTML = '';
    if (student.subjects && student.subjects.length > 0) {
        subjectHTML = `<p><strong>Subject:</strong> ${student.subjects[0].name} (${student.subjects[0].marksPercentage}%)</p>`;
    }

    card.innerHTML = `
        <strong>${student.name} (ID: ${student.enrollmentId})</strong>
        <p>Course: ${student.course}</p>
        ${subjectHTML}
        <p>Grade: <span style="color: #2b5876; font-weight: bold;">${student.grade}</span> | Attendance: ${student.attendance || 0}%</p>
    `;
    return card;
}

// Helper function to draw a teacher card for admin view
function createTeacherCard(teacher) {
    const card = document.createElement('div');
    card.className = 'student-card'; // Reuse style
    card.style.borderLeftColor = '#009688';
    card.innerHTML = `
        <strong>${teacher.name} (ID: ${teacher.employeeId})</strong>
        <p>Dept: ${teacher.department}</p>
        <p>Subjects: ${teacher.subjectsTaught ? teacher.subjectsTaught.join(', ') : 'None'}</p>
    `;
    return card;
}