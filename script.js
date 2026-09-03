var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phnum');
var dobInput = document.getElementById('dob');
var courseInput = document.getElementById('course');
var aboutInput = document.getElementById('about');
var profileInput = document.getElementById('profilepic');
var submitButton = document.getElementById('submit');
var resetButton = document.getElementById('reset');
var genderButtons = document.querySelectorAll('.studentdetail button[type="radio"]');
var skillInputs = document.querySelectorAll('input[name="skills"]');
var form = document.querySelector('.form');
var students = [];
var nextId = 1;
var editingId = null;
var selectedGender = '';

var controls = document.createElement('div');
var searchInput = document.createElement('input');
var filterInput = document.createElement('select');
var cardsContainer = document.createElement('div');
var aboutCounter = document.createElement('p');
var courses = [];

for (var courseIndex = 1; courseIndex < courseInput.options.length; courseIndex++) {
    courses.push(courseInput.options[courseIndex].text);
}

controls.className = 'student-controls';
searchInput.type = 'text';
searchInput.placeholder = 'Search student by name...';
searchInput.className = 'search-input';
filterInput.className = 'course-filter';

var allCoursesOption = document.createElement('option');
allCoursesOption.value = 'All Courses';
allCoursesOption.textContent = 'All Courses';
filterInput.appendChild(allCoursesOption);

courses.forEach(function(course) {
    var option = document.createElement('option');
    option.value = course;
    option.textContent = course;
    filterInput.appendChild(option);
});

cardsContainer.className = 'cards-container';
aboutCounter.className = 'character-counter';
aboutCounter.textContent = '0 / 200';
aboutInput.parentElement.appendChild(aboutCounter);
controls.appendChild(searchInput);
controls.appendChild(filterInput);
form.parentElement.appendChild(controls);
form.parentElement.appendChild(cardsContainer);

function showMessage(field, message) {
    var messageElement = document.querySelector('[data-error="' + field.id + '"]');

    if (!messageElement) {
        messageElement = document.createElement('small');
        messageElement.className = 'validation-message';
        messageElement.setAttribute('data-error', field.id);
        field.parentElement.appendChild(messageElement);
    }

    messageElement.textContent = message;
    field.classList.add('invalid');
}

function clearMessage(field) {
    var messageElement = document.querySelector('[data-error="' + field.id + '"]');

    if (messageElement) {
        messageElement.remove();
    }

    field.classList.remove('invalid');
}

function validateName() {
    var name = nameInput.value.trim();

    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        showMessage(nameInput, 'Use 3 to 40 letters and spaces only.');
        return false;
    }

    clearMessage(nameInput);
    return true;
}

function validateEmail() {
    var email = emailInput.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage(emailInput, 'Enter a valid email address.');
        return false;
    }

    clearMessage(emailInput);
    return true;
}

function validatePhone() {
    if (!/^\d{10}$/.test(phoneInput.value.trim())) {
        showMessage(phoneInput, 'Phone number must contain exactly 10 digits.');
        return false;
    }

    clearMessage(phoneInput);
    return true;
}

function validateDob() {
    var selectedDate = new Date(dobInput.value);
    var today = new Date();
    var minimumDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());

    if (!dobInput.value || selectedDate > minimumDate) {
        showMessage(dobInput, 'Student must be at least 15 years old.');
        return false;
    }

    clearMessage(dobInput);
    return true;
}

function validateGender() {
    if (!selectedGender) {
        showMessage(genderButtons[genderButtons.length - 1], 'Select a gender.');
        return false;
    }

    clearMessage(genderButtons[genderButtons.length - 1]);
    return true;
}

function validateCourse() {
    if (courseInput.selectedIndex === 0) {
        showMessage(courseInput, 'Select a course.');
        return false;
    }

    clearMessage(courseInput);
    return true;
}

function validateSkills() {
    var hasSkill = false;

    skillInputs.forEach(function(input) {
        if (input.checked) {
            hasSkill = true;
        }
    });

    if (!hasSkill) {
        showMessage(skillInputs[skillInputs.length - 1], 'Select at least one skill.');
        return false;
    }

    clearMessage(skillInputs[skillInputs.length - 1]);
    return true;
}

function validateAbout() {
    var about = aboutInput.value.trim();
    aboutCounter.textContent = aboutInput.value.length + ' / 200';

    if (about.length < 20 || aboutInput.value.length > 200) {
        showMessage(aboutInput, 'About must contain 20 to 200 characters.');
        return false;
    }

    clearMessage(aboutInput);
    return true;
}

function validateProfile() {
    var file = profileInput.files[0];

    if (editingId === null && (!file || file.type.indexOf('image/') !== 0)) {
        showMessage(profileInput, 'Upload an image file.');
        return false;
    }

    clearMessage(profileInput);
    return true;
}

function getSkills() {
    var skills = [];

    skillInputs.forEach(function(input) {
        if (input.checked) {
            skills.push(input.value);
        }
    });

    return skills;
}

function createStudent() {
    var file = profileInput.files[0];

    students.push({
        id: nextId,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dob: dobInput.value,
        gender: selectedGender,
        course: courseInput.options[courseInput.selectedIndex].text,
        skills: getSkills(),
        about: aboutInput.value.trim(),
        photo: file.name
    });
    nextId++;
}

function updateStudent() {
    var file = profileInput.files[0];

    students.forEach(function(student) {
        if (student.id === editingId) {
            student.name = nameInput.value.trim();
            student.email = emailInput.value.trim();
            student.phone = phoneInput.value.trim();
            student.dob = dobInput.value;
            student.gender = selectedGender;
            student.course = courseInput.options[courseInput.selectedIndex].text;
            student.skills = getSkills();
            student.about = aboutInput.value.trim();

            if (file) {
                student.photo = file.name;
            }
        }
    });
}

function createCard(student) {
    var card = document.createElement('div');
    var header = document.createElement('div');
    var body = document.createElement('div');
    var footer = document.createElement('div');
    var title = document.createElement('h3');
    var details = [
        'Photo: ' + student.photo,
        'Email: ' + student.email,
        'Phone: ' + student.phone,
        'DOB: ' + student.dob,
        'Gender: ' + student.gender,
        'Course: ' + student.course,
        'Skills: ' + student.skills.join(', '),
        'About: ' + student.about
    ];

    card.className = 'student-card';
    card.setAttribute('data-id', student.id);
    header.className = 'card-header';
    body.className = 'card-body';
    footer.className = 'card-footer';
    title.textContent = student.name;
    header.appendChild(title);

    details.forEach(function(detail) {
        var paragraph = document.createElement('p');
        paragraph.textContent = detail;
        body.appendChild(paragraph);
    });

    var editButton = document.createElement('button');
    var deleteButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    footer.appendChild(editButton);
    footer.appendChild(deleteButton);
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);

    return card;
}

function displayStudents() {
    var searchText = searchInput.value.toLowerCase();
    var selectedCourse = filterInput.value;
    cardsContainer.innerHTML = '';

    students.forEach(function(student) {
        var nameMatches = student.name.toLowerCase().indexOf(searchText) !== -1;
        var courseMatches = selectedCourse === 'All Courses' || student.course === selectedCourse;

        if (nameMatches && courseMatches) {
            cardsContainer.appendChild(createCard(student));
        }
    });

    if (!cardsContainer.children.length) {
        cardsContainer.textContent = 'No students found';
    }
}

function resetForm() {
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    dobInput.value = '';
    courseInput.selectedIndex = 0;
    aboutInput.value = '';
    profileInput.value = '';
    skillInputs.forEach(function(input) {
        input.checked = false;
    });
    genderButtons.forEach(function(button) {
        button.classList.remove('selected');
    });
    selectedGender = '';
    editingId = null;
    submitButton.textContent = 'Register Student';
    aboutCounter.textContent = '0 / 200';

    document.querySelectorAll('.validation-message').forEach(function(message) {
        message.remove();
    });
    document.querySelectorAll('.invalid').forEach(function(field) {
        field.classList.remove('invalid');
    });
}

function isFormValid() {
    return validateName() && validateEmail() && validatePhone() && validateDob() &&
        validateGender() && validateCourse() && validateSkills() && validateAbout() &&
        validateProfile();
}

nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
phoneInput.addEventListener('input', validatePhone);
dobInput.addEventListener('change', validateDob);
courseInput.addEventListener('change', validateCourse);
aboutInput.addEventListener('input', validateAbout);
profileInput.addEventListener('change', validateProfile);
searchInput.addEventListener('input', displayStudents);
filterInput.addEventListener('change', displayStudents);

genderButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        selectedGender = button.textContent.trim();
        genderButtons.forEach(function(otherButton) {
            otherButton.classList.remove('selected');
        });
        button.classList.add('selected');
        validateGender();
    });
});

skillInputs.forEach(function(input) {
    input.addEventListener('change', validateSkills);
});

submitButton.addEventListener('click', function() {
    if (!isFormValid()) {
        return;
    }

    if (editingId === null) {
        createStudent();
    } else {
        updateStudent();
    }

    displayStudents();
    resetForm();
});

resetButton.addEventListener('click', resetForm);

cardsContainer.addEventListener('click', function(event) {
    var card = event.target.closest('.student-card');
    var studentId;

    if (!card) {
        return;
    }

    studentId = Number(card.getAttribute('data-id'));

    if (event.target.classList.contains('delete-btn')) {
        students = students.filter(function(student) {
            return student.id !== studentId;
        });
        displayStudents();
    }

    if (event.target.classList.contains('edit-btn')) {
        students.forEach(function(student) {
            if (student.id === studentId) {
                nameInput.value = student.name;
                emailInput.value = student.email;
                phoneInput.value = student.phone;
                dobInput.value = student.dob;
                courseInput.value = 'course' + (courses.indexOf(student.course) + 2);
                aboutInput.value = student.about;
                selectedGender = student.gender;
                editingId = student.id;
                submitButton.textContent = 'Update Student';
                aboutCounter.textContent = aboutInput.value.length + ' / 200';

                genderButtons.forEach(function(button) {
                    button.classList.toggle('selected', button.textContent.trim() === student.gender);
                });
                skillInputs.forEach(function(input) {
                    input.checked = student.skills.indexOf(input.value) !== -1;
                });
            }
        });
    }
});

displayStudents();
