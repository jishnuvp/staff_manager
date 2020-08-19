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

function modelActions() {
    let modal = document.querySelector("#staff-modal");
    let close = document.querySelector("#staff-modal .close");
    modal.style.display = "block";
    close.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.querySelector('#staff-modal .teaching-fields').classList.add('d-none');  //for hiding all custom fields
    document.querySelector('#staff-modal .administrative-fields').classList.add('d-none');
    document.querySelector('#staff-modal .support-fields').classList.add('d-none');
}


function validate(isAdd) {
    let code = document.querySelector('#staff-modal input[name="EmpCode"]').value;
    let name = document.querySelector('#staff-modal input[name="Name"]').value;
    let number = document.querySelector('#staff-modal input[name="ContactNumber"]').value;
    let subject = document.querySelector('#staff-modal input[name="Subject"]').value;
    let role = document.querySelector('#staff-modal input[name="Role"]').value;
    let department = document.querySelector('#staff-modal input[name="Department"]').value;
    var type;
    if (isAdd) {
        type = document.querySelector('#staff-modal select[name="StaffType"]').value;
    } else {
        type = document.querySelector('#staff-modal input[name="StaffType"]').value;
    }
    if (code == '' || name == '' || number == '' || !(/^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/.test(name)) || !(/^[0-9]+$/.test(number))) {
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
    let isAdd = false;
    let flag = validate(isAdd);
    if (flag) {
        let data;
        let id = parseInt(document.querySelector('#staff-modal input[name="Id"]').value);
        let code = document.querySelector('#staff-modal input[name="EmpCode"]').value;
        let name = document.querySelector('#staff-modal input[name="Name"]').value;
        let type = document.querySelector('#staff-modal input[name="StaffType"]').value;
        let number = document.querySelector('#staff-modal input[name="ContactNumber"]').value;
        let date = document.querySelector('#staff-modal input[name="DateOfJoin"]').value;
        data = {
            id: id,
            empCode: code,
            name: name,
            contactNumber: number,
            dateOfJoin: date
        }

        if (type == 'Teaching') {
            let subject = document.querySelector('#staff-modal input[name="Subject"]').value;
            data.subject = subject;
            data.staffType = 1;
        }
        else if (type == 'Administrative') {
            let role = document.querySelector('#staff-modal input[name="Role"]').value;
            data.role = role;
            data.staffType = 2;
        } else if (type == 'Support') {
            let department = document.querySelector('#staff-modal input[name="Department"]').value;
            data.department = department;
            data.staffType = 3;
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
                    if (response.status == 200 || response.status == 204) {
                        document.querySelector('#staff-modal').style.display = "none";
                        window.location.reload();
                    }
                    else
                        showToasterMessage('Something went wrong, Please try again.', '#ea2121');
                });
        } else {
            document.querySelector('#staff-modal').style.display = "none";
        }
    } else {
        showToasterMessage('Please submit valid data only', '#ea2121');
    }
}

function renderEditPopup(id) {                                // function to call getStaffById Api and prefill it on edit popup
    modelActions();
    document.querySelector('#edit-title').style.display = 'block';
    document.querySelector('#add-title').style.display = 'none';
    document.querySelector('#edit-sbmt-btn').style.display = 'block';
    document.querySelector('#add-sbmt-btn').style.display = 'none';
    document.querySelector('#form-date').style.display = 'flex';
    document.querySelector('#staff-type-add').style.display = 'none';
    document.querySelector('#staff-type-edit').style.display = 'block';
    let elements = document.getElementById("staff-form").elements;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].name == 'EmpCode' || elements[i].name == 'StaffType' || elements[i].name == 'DateOfJoin') {
            if (elements[i].readOnly == false)
                elements[i].readOnly = true;
        }
    }

    let modal = document.getElementById("Staff-modal");
    fetch(url + '' + id + '')
        .then((resp) => resp.json())
        .then(function (data) {
            let staff = data.staff;
            let date = new Date(staff.DateOfJoin);
            document.querySelector('#staff-modal input[name="Id"]').value = staff.Id;
            document.querySelector('#staff-modal input[name="EmpCode"]').value = staff.EmpCode;
            document.querySelector('#staff-modal input[name="Name"]').value = staff.Name;
            document.querySelector('#staff-modal input[name="StaffType"]').value = staff.StaffType;
            if (staff.StaffType == 'Teaching') {
                document.querySelector('#staff-modal input[name="Subject"]').value = staff.Subject;
                document.querySelector('#staff-modal .teaching-fields').classList.remove('d-none');
            }
            if (staff.StaffType == 'Administrative') {
                document.querySelector('#staff-modal input[name="Role"]').value = staff.Role;
                document.querySelector('#staff-modal .administrative-fields').classList.remove('d-none');
            }
            if (staff.StaffType == 'Support') {
                document.querySelector('#staff-modal input[name="Department"]').value = staff.Department;
                document.querySelector('#staff-modal .support-fields').classList.remove('d-none');
            }
            document.querySelector('#staff-modal input[name="ContactNumber"]').value = staff.ContactNumber;
            document.querySelector('#staff-modal input[name="DateOfJoin"]').value = date.toLocaleDateString();
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
        fetch(url + '' + id + '', fetchData)
            .then(function (response) {
                if (response.status == 200 || response.status == 204) {
                    document.querySelector('#staff-modal').style.display = "none";
                    window.location.reload();
                }
                else
                    showToasterMessage('Something went wrong. Please try again');
            });
    }
}

function renderAddPopup() {
    modelActions();
    document.querySelector('#edit-title').style.display = 'none';
    document.querySelector('#add-title').style.display = 'block';
    document.querySelector('#edit-sbmt-btn').style.display = 'none';
    document.querySelector('#add-sbmt-btn').style.display = 'block';
    document.querySelector('#form-date').style.display = 'none';
    document.querySelector('#staff-type-add').style.display = 'block';
    document.querySelector('#staff-type-edit').style.display = 'none';
    document.querySelector('#staff-modal .teaching-fields').classList.remove('d-none');

    let elements = document.getElementById("staff-form").elements;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].readOnly == true) {
            elements[i].readOnly = false;
        }
        elements[i].value = '';
    }
    document.querySelector('#staff-modal select[name="StaffType"]').value = 'Teaching';


}

function addStaff(e) {
    e.preventDefault();
    let isAdd = true;
    let flag = validate(isAdd);
    if (flag) {
        let data;
        let code = document.querySelector('#staff-modal input[name="EmpCode"]').value;
        let name = document.querySelector('#staff-modal input[name="Name"]').value;
        let type = document.querySelector('#staff-modal select[name="StaffType"]').value;
        let number = document.querySelector('#staff-modal input[name="ContactNumber"]').value;
        let date = new Date().toISOString();

        data = {
            empCode: code.toUpperCase(),
            name: name,
            contactNumber: number,
            dateOfJoin: date
        }
        if (type == 'Teaching') {
            let subject = document.querySelector('#staff-modal input[name="Subject"]').value;
            data.staffType = 1;
            data.subject = subject;
        }
        else if (type == 'Administrative') {
            let role = document.querySelector('#staff-modal input[name="Role"]').value;
            data.role = role;
            data.staffType = 2;
        } else if (type == 'Support') {
            let department = document.querySelector('#staff-modal input[name="Department"]').value;
            data.department = department;
            data.staffType = 3;
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
                    if (response.status == 201 || response.status == 204) {
                        document.querySelector('#staff-modal').style.display = "none";
                        window.location.reload();
                    }
                    else
                        showToasterMessage('EmpCode already exists, Try with another EmpCode.', '#ea2121');
                });
        } else {
            document.querySelector('#staff-modal').style.display = "none";
        }
    } else {
        showToasterMessage('Please submit valid data only', '#ea2121');
    }
}


function showHideFields() {
    let type = document.querySelector('#staff-modal select[name="StaffType"]').value;
    if (type == 'Teaching') {
        document.querySelector('#staff-modal .teaching-fields').classList.remove("d-none");
    } else {
        document.querySelector('#staff-modal .teaching-fields').classList.add("d-none");
    }
    if (type == 'Administrative') {
        document.querySelector('#staff-modal .administrative-fields').classList.remove("d-none");
    } else {
        document.querySelector('#staff-modal .administrative-fields').classList.add("d-none");
    }
    if (type == 'Support') {
        document.querySelector('#staff-modal .support-fields').classList.remove("d-none");
    } else {
        document.querySelector('#staff-modal .support-fields').classList.add("d-none");
    }
}

function showToasterMessage(error, bgColor) {
    let x = document.querySelector("#validate-alert");
    x.style.backgroundColor = bgColor;
    x.innerHTML = error;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("staff-table");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}