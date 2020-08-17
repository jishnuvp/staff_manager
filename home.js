const url = 'https://localhost:44305/staff/';
function renderTable() {
    let type = document.getElementById("type-select").value;
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
    let modal = document.getElementsByClassName("modal")[0];
    let close = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    close.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById('teaching-fields').classList.add('d-none');  //for hiding all custom fields
    document.getElementById('administrative-fields').classList.add('d-none');
    document.getElementById('support-fields').classList.add('d-none');
}



function editStaff() {                                      // function to call edit api
    let data;
    let id = parseInt(document.querySelector('#edit-modal #id').value);
    let code = document.querySelector('#edit-modal #empcode').value;
    let name = document.querySelector('#edit-modal #name').value;
    let type = document.querySelector('#edit-modal #staff-type').value;
    let number = document.querySelector('#edit-modal #contact-num').value;
    let date = document.querySelector('#edit-modal #join-date').value;
    if (type == 'Teaching') {
        let subject = document.querySelector('#edit-modal #subject').value;
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
        let role = document.querySelector('#edit-modal #role').value;
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
        let department = document.querySelector('#edit-modal #department').value;
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
    fetch(url + '' + id + '', fetchData)
        .then(function () {
            document.querySelector('#edit-modal').style.display = "none";
        });
}

function renderEditPopup(id) {                                // function to call getStaffById Api and prefill it on edit popup
    modelActions();
    let modal = document.getElementById("Staff-modal");
    fetch(url + '' + id + '')
        .then((resp) => resp.json())
        .then(function (data) {
            let staff = data.staff;
            let date = new Date(staff.DateOfJoin);
            document.getElementById('id').value = staff.Id;
            document.getElementById('empcode').value = staff.EmpCode;
            document.getElementById('name').value = staff.Name;
            document.getElementById('staff-type').value = staff.StaffType;
            if (staff.StaffType == 'Teaching') {
                document.getElementById('subject').value = staff.Subject;
                document.getElementById('teaching-fields').classList.remove('d-none');
            }
            if (staff.StaffType == 'Administrative') {
                document.getElementById('role').value = staff.Role;
                document.getElementById('administrative-fields').classList.remove('d-none');
            }
            if (staff.StaffType == 'Support') {
                document.getElementById('department').value = staff.Department;
                document.getElementById('support-fields').classList.remove('d-none');
            }
            document.getElementById('contact-num').value = staff.ContactNumber;
            document.getElementById('join-date').value = date.toLocaleDateString();
        })
        .catch(function (error) {
            return false;
        });
}

function addStaff() {
    document.getElementById('staff-form').trigger('reset');
    modelActions();
}

function showHideFields() {
    let type = document.getElementById('staff-type').value;
    if (type == 'Teaching') {
        let teachingFields = document.getElementById('teaching-fields').classList.remove("d-none");
    }
}