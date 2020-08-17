const url = 'https://localhost:44305/staff/';
function renderTable() {
    let type = document.querySelector("#type-select").value;
    let html = '';
    fetch(url + '?type=' + type + '')
        .then((resp) => resp.json())
        .then(function (data) {
            let staffs = data.StaffList;
            staffs.map(function (staff) {
                let d = new Date(staff.DateOfJoin);
                let htmlSegment = `<tr>
                            <td>${staff.Name}</td>
                            <td>${staff.EmpCode}</td>
                            <td>${staff.StaffType}</td>
                            <td>${staff.ContactNumber}</td>
                            <td>${d.toLocaleDateString()}</td>
                            <td>
                                <button title="Edit"  onclick="renderEditPopup(${staff.Id});">&#9997;</button>
                                <button title="Delete"  onclick="deleteStaff(${staff.Id});">&#10006;</button>
                            </td>
                            </tr>`;

                html += htmlSegment;
            })

            let container = document.querySelector('#staff-tb');
            container.innerHTML = html;
        })
        .catch(function (error) {
            console.log(error);
        });

}

renderTable();

function editModelActions() {
    let modal = document.querySelector("#edit-modal");
    let close = document.querySelector("#edit-modal .close");
    modal.style.display = "block";
    close.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.querySelector('#edit-modal .teaching-fields').classList.add('d-none');  //for hiding all custom fields
    document.querySelector('#edit-modal .administrative-fields').classList.add('d-none');
    document.querySelector('#edit-modal .support-fields').classList.add('d-none');
}


function validateOnEdit() {
    let id = parseInt(document.querySelector('#edit-modal input[name="Id"]').value);
    let code = document.querySelector('#edit-modal input[name="EmpCode"]').value;
    let name = document.querySelector('#edit-modal input[name="Name"]').value;
    let type = document.querySelector('#edit-modal input[name="StaffType"]').value;
    let number = document.querySelector('#edit-modal input[name="ContactNumber"]').value;
    let date = document.querySelector('#edit-modal input[name="DateOfJoin"]').value;
    let subject = document.querySelector('#edit-modal input[name="Subject"]').value;
    let role = document.querySelector('#edit-modal input[name="Role"]').value;
    let department = document.querySelector('#edit-modal input[name="Department"]').value;
    if (code == '' || name == '' || number == '' || !(/^[a-zA-Z]+$/.test(name)) || !(/^[0-9]+$/.test(number))) {
        return false;
    }
    if (type == 'Teaching' && subject == '' || type == 'Teaching' && !(/^[a-zA-Z]+$/.test(subject))) {
        return false;
    } else if (type == 'Administrative' && role == '' || type == 'Administrative' && !(/^[a-zA-Z]+$/.test(role))) {
        return false;
    } else if (type == 'Support' && department == '' || type == 'Support' && !(/^[a-zA-Z]+$/.test(department))) {
        return false;
    }
    return true;
}
function validateOnAdd() {
    let code = document.querySelector('#add-modal input[name="EmpCode"]').value;
    let name = document.querySelector('#add-modal input[name="Name"]').value;
    let type = document.querySelector('#add-modal select[name="StaffType"]').value;
    let number = document.querySelector('#add-modal input[name="ContactNumber"]').value;
    let subject = document.querySelector('#add-modal input[name="Subject"]').value;
    let role = document.querySelector('#add-modal input[name="Role"]').value;
    let department = document.querySelector('#add-modal input[name="Department"]').value;
    if (code == '' || name == '' || number == '' || !(/^[a-zA-Z]+$/.test(name)) || !(/^[0-9]+$/.test(number))) {
        return false;
    }
    if (type == 'Teaching' && subject == '' || type == 'Teaching' && !(/^[a-zA-Z]+$/.test(subject))) {
        return false;
    } else if (type == 'Administrative' && role == '' || type == 'Administrative' && !(/^[a-zA-Z]+$/.test(role))) {
        return false;
    } else if (type == 'Support' && department == '' || type == 'Support' && !(/^[a-zA-Z]+$/.test(department))) {
        return false;
    }
    return true;
}


function editStaff(e) {
    e.preventDefault();
    var flag = validateOnEdit();
    if (flag) {
        let data;
        let id = parseInt(document.querySelector('#edit-modal input[name="Id"]').value);
        let code = document.querySelector('#edit-modal input[name="EmpCode"]').value;
        let name = document.querySelector('#edit-modal input[name="Name"]').value;
        let type = document.querySelector('#edit-modal input[name="StaffType"]').value;
        let number = document.querySelector('#edit-modal input[name="ContactNumber"]').value;
        let date = document.querySelector('#edit-modal input[name="DateOfJoin"]').value;


        if (type == 'Teaching') {
            let subject = document.querySelector('#edit-modal input[name="Subject"]').value;
            data = {
                subject: subject,
                id: id,
                staffType: 1,
                empCode: code,
                name: name,
                contactNumber: number,
                dateOfJoin: date
            }
        }
        else if (type == 'Administrative') {
            let role = document.querySelector('#edit-modal input[name="Role"]').value;
            data = {
                id: id,
                empCode: code,
                name: name,
                staffType: 2,
                role: role,
                contactNumber: number,
                dateOfJoin: date
            }
        } else if (type == 'Support') {
            let department = document.querySelector('#edit-modal input[name="Department"]').value;
            data = {
                id: id,
                empCode: code,
                name: name,
                staffType: 3,
                department: department,
                contactNumber: number,
                dateOfJoin: date
            }
        }
        let fetchData = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers({ 'content-type': 'application/json' })
        }
        let isSubmit = getConfirmation();
        if (isSubmit) {
            fetch(url + '' + id + '', fetchData)
                .then(function (response) {
                    if (response.status == 200 || response.status == 204)
                        document.querySelector('#edit-modal').style.display = "none";
                    else
                        showErrorMessage('Something went wrong, Please try again.');
                });
        } else {
            document.querySelector('#edit-modal').style.display = "none";
        }
    } else {
        showErrorMessage('Please submit valid data only');
    }
}

function renderEditPopup(id) {                                // function to call getStaffById Api and prefill it on edit popup
    editModelActions();
    let modal = document.getElementById("Staff-modal");
    fetch(url + '' + id + '')
        .then((resp) => resp.json())
        .then(function (data) {
            let staff = data.staff;
            let date = new Date(staff.DateOfJoin);
            document.querySelector('#edit-modal input[name="Id"]').value = staff.Id;
            document.querySelector('#edit-modal input[name="EmpCode"]').value = staff.EmpCode;
            document.querySelector('#edit-modal input[name="Name"]').value = staff.Name;
            document.querySelector('#edit-modal input[name="StaffType"]').value = staff.StaffType;
            if (staff.StaffType == 'Teaching') {
                document.querySelector('#edit-modal input[name="Subject"]').value = staff.Subject;
                document.querySelector('#edit-modal .teaching-fields').classList.remove('d-none');
            }
            if (staff.StaffType == 'Administrative') {
                document.querySelector('#edit-modal input[name="Role"]').value = staff.Role;
                document.querySelector('#edit-modal .administrative-fields').classList.remove('d-none');
            }
            if (staff.StaffType == 'Support') {
                document.querySelector('#edit-modal input[name="Department"]').value = staff.Department;
                document.querySelector('#edit-modal .support-fields').classList.remove('d-none');
            }
            document.querySelector('#edit-modal input[name="ContactNumber"]').value = staff.ContactNumber;
            document.querySelector('#edit-modal input[name="DateOfJoin"]').value = date.toLocaleDateString();
        })
        .catch(function (error) {
            return false;
        });
}

function getConfirmation() {
    let isSubmit = confirm("Do you want to continue?");
    return isSubmit;
}

function deleteStaff(id) {
    let isSubmit = getConfirmation();
    if (isSubmit) {
        let fetchData = {
            method: 'DELETE',
            headers: new Headers()
        }
        fetch(url + '' + id + '', fetchData);
    }
}
function addModelActions() {
    let modal = document.querySelector("#add-modal");
    let close = document.querySelector("#add-modal .close");
    modal.style.display = "block";
    close.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function renderAddPopup() {
    addModelActions();
    document.querySelector('#add-modal .teaching-fields').classList.remove('d-none');
}

function addStaff(e) {
    e.preventDefault();
    let flag = validateOnAdd();
    if (flag) {
        let data;
        let code = document.querySelector('#add-modal input[name="EmpCode"]').value;
        let name = document.querySelector('#add-modal input[name="Name"]').value;
        let type = document.querySelector('#add-modal select[name="StaffType"]').value;
        let number = document.querySelector('#add-modal input[name="ContactNumber"]').value;
        let date = new Date().toISOString();


        if (type == 'Teaching') {
            let subject = document.querySelector('#add-modal input[name="Subject"]').value;
            data = {
                subject: subject,
                staffType: 1,
                empCode: code.toUpperCase(),
                name: name,
                contactNumber: number,
                dateOfJoin: date
            }
        }
        else if (type == 'Administrative') {
            let role = document.querySelector('#add-modal input[name="Role"]').value;
            data = {
                empCode: code.toUpperCase(),
                name: name,
                staffType: 2,
                role: role,
                contactNumber: number,
                dateOfJoin: date
            }
        } else if (type == 'Support') {
            let department = document.querySelector('#add-modal input[name="Department"]').value;
            data = {
                empCode: code.toUpperCase(),
                name: name,
                staffType: 3,
                department: department,
                contactNumber: number,
                dateOfJoin: date
            }
        }
        let fetchData = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({ 'content-type': 'application/json' })
        }
        let isSubmit = getConfirmation();
        if (isSubmit) {
            fetch(url, fetchData)
                .then(function (response) {
                    if (response.status == 201 || response.status == 204)
                        document.querySelector('#add-modal').style.display = "none";
                    else
                        showErrorMessage('EmpCode already exists, Try with another EmpCode.');
                });
        } else {
            document.querySelector('#add-modal').style.display = "none";
        }
    } else {
        showErrorMessage('Please submit valid data only');
    }
}


function showHideFields() {
    let type = document.querySelector('#add-modal select[name="StaffType"]').value;
    if (type == 'Teaching') {
        document.querySelector('#add-modal .teaching-fields').classList.remove("d-none");
    } else {
        document.querySelector('#add-modal .teaching-fields').classList.add("d-none");
    }
    if (type == 'Administrative') {
        document.querySelector('#add-modal .administrative-fields').classList.remove("d-none");
    } else {
        document.querySelector('#add-modal .administrative-fields').classList.add("d-none");
    }
    if (type == 'Support') {
        document.querySelector('#add-modal .support-fields').classList.remove("d-none");
    } else {
        document.querySelector('#add-modal .support-fields').classList.add("d-none");
    }
}

function showErrorMessage(error) {
    let x = document.querySelector("#validate-alert");
    x.innerHTML = error;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}