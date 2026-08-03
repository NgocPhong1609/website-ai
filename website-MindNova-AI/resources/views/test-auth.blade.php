<!DOCTYPE html>
<html lang="vi">
<head>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white p-10">
    <div class="max-w-2xl mx-auto grid grid-cols-2 gap-6">

        <!-- FORM ĐĂNG KÝ -->
        <div class="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 class="text-xl font-bold mb-4 text-green-400">Đăng ký</h2>
            <input id="reg_name" type="text" placeholder="Tên" class="w-full p-2 mb-2 rounded bg-gray-700">
            <input id="reg_email" type="email" placeholder="Email" class="w-full p-2 mb-2 rounded bg-gray-700">
            <input id="reg_password" type="password" placeholder="Mật khẩu" class="w-full p-2 mb-2 rounded bg-gray-700">
            <input id="reg_password_confirmation" type="password" placeholder="Nhập lại MK" class="w-full p-2 mb-4 rounded bg-gray-700">
            <button onclick="register()" class="w-full bg-green-600 p-2 rounded font-bold">Đăng ký ngay</button>
        </div>

        <!-- FORM ĐĂNG NHẬP -->
        <div class="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 class="text-xl font-bold mb-4 text-blue-400">Đăng nhập</h2>
            <input id="log_email" type="email" placeholder="Email" class="w-full p-2 mb-2 rounded bg-gray-700">
            <input id="log_password" type="password" placeholder="Mật khẩu" class="w-full p-2 mb-4 rounded bg-gray-700">
            <button onclick="login()" class="w-full bg-blue-600 p-2 rounded font-bold mb-4">Đăng nhập</button>
            <button onclick="window.location.href='/api/auth/google'" class="w-full bg-white text-black p-2 rounded font-bold">Google Login</button>
        </div>
    </div>

    <!-- KHUNG KẾT QUẢ -->
    <div class="max-w-2xl mx-auto mt-6">
        <h3 class="text-sm text-gray-400 mb-2">Kết quả trả về từ Backend:</h3>
        <pre id="log" class="p-4 bg-black rounded text-green-400 text-xs overflow-auto h-40"></pre>
    </div>

    <script>
        async function register() {
            const data = {
                name: document.getElementById('reg_name').value,
                email: document.getElementById('reg_email').value,
                password: document.getElementById('reg_password').value,
                password_confirmation: document.getElementById('reg_password_confirmation').value
            };
            callApi('/api/register', data);
        }

        async function login() {
            const data = {
                email: document.getElementById('log_email').value,
                password: document.getElementById('log_password').value
            };
            callApi('/api/login', data);
        }

        async function callApi(url, data) {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            document.getElementById('log').innerText = JSON.stringify(result, null, 2);
        }
    </script>
</body>
</html>
