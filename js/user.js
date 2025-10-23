// ========================
// 📦 HÀM QUẢN LÝ DỮ LIỆU
// ========================
function getUsers() {
  return JSON.parse(localStorage.getItem('AS_users') || '[]');
}
function setUsers(users) {
  localStorage.setItem('AS_users', JSON.stringify(users));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('AS_currentUser') || 'null');
}
function setCurrentUser(user) {
  localStorage.setItem('AS_currentUser', JSON.stringify(user));
}
function logout() {
  localStorage.removeItem('AS_currentUser');
  alert("Đã đăng xuất!");
  location.href = "login.html";
}

// ========================
// 🧍 ĐĂNG KÝ
// ========================
const btnRegister = document.getElementById("btnRegister");
if (btnRegister) {
  btnRegister.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    const users = getUsers();
    if (users.some(u => u.username === username || u.email === email)) {
      alert("Tên đăng nhập hoặc email đã tồn tại!");
      return;
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      isAdmin: false,
      locked: false,
      address: "",
    };

    users.push(newUser);
    setUsers(users);
    alert("Đăng ký thành công!");
    location.href = "login.html";
  });
}

// ========================
// 🔐 ĐĂNG NHẬP
// ========================
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const users = getUsers();
    const user = users.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    if (!user) {
      document.getElementById("msg").textContent = "Sai tên đăng nhập hoặc mật khẩu!";
      return;
    }
    if (user.locked) {
      alert("Tài khoản này đã bị khoá!");
      return;
    }

    setCurrentUser(user);
    alert("Đăng nhập thành công!");
    location.href = "profile.html";
  });
}

// ========================
// 🧾 HIỂN THỊ & SỬA THÔNG TIN
// ========================
if (location.pathname.endsWith("profile.html")) {
  const current = getCurrentUser();
  if (!current) {
    alert("Bạn cần đăng nhập trước!");
    location.href = "login.html";
  } else {
    document.getElementById("username").value = current.username;
    document.getElementById("email").value = current.email;

    document.getElementById("userArea").innerHTML = `
      Xin chào, <b>${current.username}</b> 
      <button onclick="logout()">Đăng xuất</button>
    `;

    document.getElementById("btnSave").addEventListener("click", () => {
      const newName = document.getElementById("username").value.trim();
      const newEmail = document.getElementById("email").value.trim();
      const newPass = document.getElementById("password").value;

      let users = getUsers();
      const idx = users.findIndex((u) => u.id === current.id);
      if (idx >= 0) {
        users[idx].username = newName;
        users[idx].email = newEmail;
        if (newPass) users[idx].password = newPass;
        setUsers(users);
        setCurrentUser(users[idx]);
        alert("Cập nhật thông tin thành công!");
      }
    });
  }
}
