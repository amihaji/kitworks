const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycby46ltuXXMXzJm62nnxYuCdLHtFMUulKPFyenhk5RGE0owoP-XK8ljGt_r-AIogmNcbHA/exec';

// LOAD DATA USER
function loadUserTable() {
  fetch(`${URL_APPS_SCRIPT}?action=getTabelUser`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('userTableBody');
      tbody.innerHTML = '';
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15">Tidak ada data user.</td></tr>';
        return;
      }
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td>
          <td>${row[4]}</td><td>${row[5]}</td><td>${row[6]}</td>
          <td>${row[7]}</td><td>${row[8]}</td><td>${row[9]}</td>
          <td>${row[10]}</td><td>${row[11]}</td><td>${row[12]}</td><td>${row[13]}</td>
          <td>
            <i class="fas fa-edit action-icon" onclick="editUser('${row.join("','")}')"></i>
            <i class="fas fa-trash-alt action-icon" onclick="deleteUser('${row[0]}')"></i>
          </td>`;
        tbody.appendChild(tr);
      });
    });
}

// ADD & EDIT USER
document.getElementById('userForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const mode = document.getElementById('mode').value;
  const payload = {
    action: mode === 'add' ? 'addUser' : 'editUser',
    userId: document.getElementById('userId').value.trim(),
    userName: document.getElementById('userName').value.trim(),
    userEmail: document.getElementById('userEmail').value.trim(),
    userHP: document.getElementById('userHP').value.trim(),
    userPass: document.getElementById('userPass').value.trim(),
    userLevel: document.getElementById('userLevel').value.trim(),
    userSalah: document.getElementById('userSalah').value.trim(),
    aksesLogin: document.getElementById('aksesLogin').value.trim().toUpperCase(),
    aksesSetting: document.getElementById('aksesSetting').value.trim().toUpperCase(),
    aksesFLC: document.getElementById('aksesFLC').value.trim().toUpperCase(),
    aksesEstiH: document.getElementById('aksesEstiH').value.trim().toUpperCase(),
    aksesWE: document.getElementById('aksesWE').value.trim().toUpperCase(),
    aksesFollowup: document.getElementById('aksesFollowup').value.trim().toUpperCase(),
    aksesCRM: document.getElementById('aksesCRM').value.trim().toUpperCase()
  };
  fetch(URL_APPS_SCRIPT, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        loadUserTable();
      } else {
        alert('Gagal menyimpan data');
      }
    });
});

// EDIT USER MODAL
function editUser(...fields) {
  const [id, name, email, hp, pass, level, salah, login, setting, flc, estih, we, followup, crm] = fields;
  document.getElementById('mode').value = 'edit';
  document.getElementById('userId').value = id; document.getElementById('userId').readOnly = true;
  document.getElementById('userName').value = name;
  document.getElementById('userEmail').value = email;
  document.getElementById('userHP').value = hp;
  document.getElementById('userPass').value = pass;
  document.getElementById('userLevel').value = level;
  document.getElementById('userSalah').value = salah;
  document.getElementById('aksesLogin').value = login;
  document.getElementById('aksesSetting').value = setting;
  document.getElementById('aksesFLC').value = flc;
  document.getElementById('aksesEstiH').value = estih;
  document.getElementById('aksesWE').value = we;
  document.getElementById('aksesFollowup').value = followup;
  document.getElementById('aksesCRM').value = crm;
  new bootstrap.Modal(document.getElementById('userModal')).show();
}

// DELETE USER
function deleteUser(userId) {
  if (confirm(`Hapus user ${userId}?`)) {
    fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteUser', userId }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          loadUserTable();
        } else {
          alert('Gagal menghapus user');
        }
      });
  }
}

document.addEventListener('DOMContentLoaded', loadUserTable);
document.getElementById('addUserButton').addEventListener('click', () => {
  document.getElementById('mode').value = 'add';
  document.getElementById('userForm').reset();
  document.getElementById('userId').readOnly = false;
  new bootstrap.Modal(document.getElementById('userModal')).show();
});
