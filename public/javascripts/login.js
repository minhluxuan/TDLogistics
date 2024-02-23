// login.js

function loginUser() {
    // Lấy giá trị của các trường input
    const phoneNumber = document.getElementById('phone_number').value;
    const otp = document.getElementById('otp').value;

    // Tạo payload để gửi lên server
    const payload = {
        phoneNumber: phoneNumber,
        otp: otp
    };

    // Gửi yêu cầu bằng fetch API
    fetch('http://localhost:9000/api/v1/otp/verify_otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Xử lý phản hồi từ server
        console.log(data);
        // Ví dụ: điều hướng hoặc hiển thị thông báo thành công
    })
    .catch(error => {
        // Xử lý lỗi
        console.error('There was a problem with the fetch operation:', error);
    });
}

// Gắn sự kiện "click" vào nút submit
document.getElementById('submit').addEventListener('click', loginUser);
