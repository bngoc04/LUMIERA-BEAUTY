const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', function () {
    // Navigation Handling
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.querySelector('.header-title');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('data-target');
            const title = this.getAttribute('data-title');
            if (title) pageTitle.textContent = title;

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                    loadSectionData(targetId); // Load data when section is shown
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    // Initial Load
    loadDashboardStats();
    loadAppointments(); // Load default view

    // Chart Check (Initialize empty chart variable globally if needed, or handle in loadDashboardStats)
    // Logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'đangnhap.html';
    });
});

async function loadSectionData(sectionId) {
    if (sectionId === 'appointments-view' || sectionId === 'appointments') loadAppointments();

    if (sectionId === 'services-view' || sectionId === 'services') loadServices();
    if (sectionId === 'customers-view' || sectionId === 'customers') loadCustomers();
    if (sectionId === 'settings-view' || sectionId === 'settings') loadSettings();
    if (sectionId === 'attendance-view' || sectionId === 'attendance') loadAttendance();
    if (sectionId === 'calendar-view' || sectionId === 'calendar') loadCalendar();
}


// --- Appointments ---
async function loadAppointments() {
    try {
        const res = await fetch(`${API_BASE_URL}/appointments`);
        const appointments = await res.json();

        const tbody = document.querySelector('#appointments-table tbody');
        if (!tbody) return;
        tbody.innerHTML = ''; // Clear existing

        const recentTbody = document.querySelector('#recent-appointments-body');
        if (recentTbody) recentTbody.innerHTML = '';

        appointments.forEach(app => {
            let actionButtons = `
                <button onclick="deleteAppointment('${app.id}')" class="btn-icon delete" title="Delete"><i class="fas fa-trash"></i></button>
            `;

            if (app.status === 'pending') {
                actionButtons = `
                    <button onclick="approveAppointment('${app.id}')" class="btn-icon approve" title="Approve" style="color: green; margin-right: 5px;"><i class="fas fa-check"></i></button>
                    ${actionButtons}
                `;
            }

            const row = `
                <tr>
                    <td>${app.firstName} ${app.lastName}</td>
                    <td>${app.service}</td>
                    <td>${app.date} ${app.time}</td>
                    <td>${app.phone}</td>
                    <td><span class="status-badge status-${app.status}">${app.status}</span></td>
                    <td>
                        ${actionButtons}
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;

            // Add to dashboard overview table (Recent Appointments - 4 columns)
            if (recentTbody && recentTbody.children.length < 5) {
                const recentRow = `
                    <tr>
                        <td>${app.firstName} ${app.lastName}</td>
                        <td>${app.service}</td>
                        <td>${app.date} ${app.time}</td>
                        <td><span class="status-badge status-${app.status}">${app.status}</span></td>
                    </tr>
                `;
                recentTbody.innerHTML += recentRow;
            }
        });

        updateStats(appointments);

    } catch (err) {
        console.error('Error loading appointments:', err);
    }
}



async function approveAppointment(id) {
    try {
        await fetch(`${API_BASE_URL}/appointments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'confirmed' })
        });

        Swal.fire({
            icon: 'success',
            title: 'Đã duyệt!',
            text: 'Lịch hẹn đã được xác nhận.',
            timer: 1500,
            showConfirmButton: false
        });

        loadAppointments(); // Refresh table
    } catch (err) {
        console.error('Error approving appointment:', err);
    }
}

async function deleteAppointment(id) {
    const result = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Bạn sẽ không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Vâng, xóa nó!',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        await fetch(`${API_BASE_URL}/appointments/${id}`, { method: 'DELETE' });
        loadAppointments();
        Swal.fire(
            'Đã xóa!',
            'Lịch hẹn đã bị xóa.',
            'success'
        );
    }
}

// --- Services ---
async function loadServices() {
    try {
        const res = await fetch(`${API_BASE_URL}/services`);


        const services = await res.json();
        const tbody = document.querySelector('#services-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        services.forEach(service => {
            const row = `
                <tr>
                    <td>
                        <div style="font-weight: 500;">${service.name}</div>
                        <div style="font-size: 12px; color: #666;">${service.description}</div>
                    </td>
                    <td>${service.duration}</td>
                    <td>${service.price}</td>
                    <td>
                        <button onclick="deleteService('${service.id}')" class="btn-icon delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (err) {
        console.error('Error loading services:', err);
    }
}

async function deleteService(id) {
    const result = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Xóa dịch vụ này khỏi hệ thống?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        await fetch(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' });
        loadServices();
        Swal.fire('Đã xóa!', 'Dịch vụ đã được xóa.', 'success');
    }
}

// Modal Functions
function openAddServiceModal() {
    document.getElementById('addServiceModal').style.display = 'block';
}

function closeAddServiceModal() {
    document.getElementById('addServiceModal').style.display = 'none';
}

// --- Customers ---
async function loadCustomers() {
    try {
        const res = await fetch(`${API_BASE_URL}/customers`);
        const customers = await res.json();
        const tbody = document.querySelector('#customers-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        customers.forEach(customer => {
            tbody.innerHTML += `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.totalBookings}</td>
                    <td>${customer.lastBooking}</td>
                </tr>
            `;
        });
    } catch (err) { console.error(err); }
}

window.deleteService = deleteService;
window.openAddServiceModal = openAddServiceModal;
window.closeAddServiceModal = closeAddServiceModal;

// Handle Add Service Submit
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization ... 

    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch(`${API_BASE_URL}/services`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (res.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: 'Dịch vụ mới đã được thêm.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    closeAddServiceModal();
                    e.target.reset();
                    loadServices();
                }
            } catch (err) {
                console.error('Error adding service:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể thêm dịch vụ. Vui lòng thử lại.'
                });
            }
        });
    }
});

// --- Settings ---
async function loadSettings() {
    try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        const settings = await res.json();

        const siteNameInput = document.querySelector('input[placeholder="Lumiera Beauty"]');
        const emailInput = document.querySelector('input[placeholder="contact@lumierabeauty.com"]');

        if (siteNameInput && settings.siteName) siteNameInput.value = settings.siteName;
        if (emailInput && settings.contactEmail) emailInput.value = settings.contactEmail;

    } catch (err) { console.error(err); }
}

async function updateStats(appointments) {
    try {
        // Fetch services to calculate revenue
        const sRes = await fetch(`${API_BASE_URL}/services`);
        const services = await sRes.json();
        const cRes = await fetch(`${API_BASE_URL}/customers`);
        const customers = await cRes.json();

        const total = appointments.length;
        const pending = appointments.filter(a => a.status === 'pending').length;
        const customerCount = customers.length;

        // Calculate Revenue: Sum of prices for 'completed' appointments
        let totalRevenue = 0;
        appointments.filter(a => a.status === 'completed').forEach(app => {
            const service = services.find(s => s.name === app.service);
            if (service && service.price) {
                // Convert price string "500.000" or "750.000" to number
                const priceNum = parseInt(service.price.replace(/\./g, '')) || 0;
                totalRevenue += priceNum;
            }
        });

        // Update Dashboard Values
        const totalEl = document.getElementById('total-appointments-val');
        const pendingEl = document.getElementById('pending-appointments-val');
        const customerEl = document.getElementById('new-customers-val');
        const revenueEl = document.getElementById('revenue-val');

        if (totalEl) totalEl.textContent = total;
        if (pendingEl) pendingEl.textContent = pending;
        if (customerEl) customerEl.textContent = customerCount;
        if (revenueEl) {
            // Format revenue to currency style or short M (e.g., 1.25M or 1.250.000)
            revenueEl.textContent = totalRevenue >= 1000000
                ? (totalRevenue / 1000000).toFixed(1) + 'M'
                : totalRevenue.toLocaleString('vi-VN');
        }

        // Use Chart.js to render stats
        renderChart(appointments);
    } catch (err) {
        console.error('Error updating stats:', err);
    }
}

// Chart Global Variable to destroy old chart before creating new one
let myChart = null;

function renderChart(appointments) {
    const ctx = document.getElementById('appointmentsChart');
    if (!ctx) return;

    // Calculate Status Counts
    const statusCounts = {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
    };

    appointments.forEach(app => {
        const status = app.status || 'pending';
        if (statusCounts[status] !== undefined) {
            statusCounts[status]++;
        }
    });

    const data = {
        labels: ['Chờ duyệt', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'],
        datasets: [{
            label: 'Số lượng Lịch hẹn',
            data: [statusCounts.pending, statusCounts.confirmed, statusCounts.completed, statusCounts.cancelled],
            backgroundColor: [
                '#FFB74D', // Orange for Pending
                '#4CAF50', // Green for Confirmed
                '#2196F3', // Blue for Completed
                '#F44336'  // Red for Cancelled
            ],
            hoverOffset: 4
        }]
    };

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

async function loadDashboardStats() {
    loadAppointments(); // Re-use logic
}

// Expose functions globally for onclick handlers
window.deleteAppointment = deleteAppointment;

// Handle Admin Dropdown
window.toggleAdminMenu = function (event) {
    event.stopPropagation();
    const dropdown = document.getElementById('admin-dropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'flex';
    } else {
        dropdown.style.display = 'none';
    }
};

window.logout = function (event) {
    if (event) event.preventDefault();
    Swal.fire({
        title: 'Đăng xuất?',
        text: "Bạn muốn kết thúc phiên làm việc?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Ở lại'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('authToken');
            window.location.href = 'đangnhap.html';
        }
    });
}

// Close Dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('admin-dropdown');
    const profile = document.querySelector('.admin-profile');

    if (dropdown && dropdown.style.display === 'flex') {
        if (!profile.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    }
});

// --- Attendance ---
async function loadAttendance() {
    try {
        const res = await fetch(`${API_BASE_URL}/attendance`);


        const attendance = await res.json();
        const tbody = document.querySelector('#attendance-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        attendance.forEach(record => {
            const row = `
                <tr>
                    <td>${record.employeeName}</td>
                    <td>${record.date}</td>
                    <td>${record.checkIn || '-'}</td>
                    <td>${record.checkOut || '-'}</td>
                    <td><span class="status-badge status-${record.status}">${record.status}</span></td>
                    <td>
                        <button onclick="deleteAttendance('${record.id}')" class="btn-icon delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (err) {
        console.error('Error loading attendance:', err);
    }
}

async function deleteAttendance(id) {
    const result = await Swal.fire({
        title: 'Xóa chấm công?',
        text: "Bạn có chắc chắn muốn xóa bản ghi này?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        await fetch(`${API_BASE_URL}/attendance/${id}`, { method: 'DELETE' });
        loadAttendance();
        Swal.fire('Đã xóa!', 'Bản ghi đã được xóa.', 'success');
    }
}

// Modal Functions for Attendance
function openAddAttendanceModal() {
    document.getElementById('addAttendanceModal').style.display = 'block';
}

function closeAddAttendanceModal() {
    document.getElementById('addAttendanceModal').style.display = 'none';
}

window.deleteAttendance = deleteAttendance;
window.openAddAttendanceModal = openAddAttendanceModal;
window.closeAddAttendanceModal = closeAddAttendanceModal;

// Handle Add Attendance Submit
document.addEventListener('DOMContentLoaded', () => {
    const addAttendanceForm = document.getElementById('addAttendanceForm');
    if (addAttendanceForm) {
        addAttendanceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch(`${API_BASE_URL}/attendance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (res.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đã lưu!',
                        text: 'Thông tin chấm công đã được cập nhật.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    closeAddAttendanceModal();
                    e.target.reset();
                    loadAttendance();
                }
            } catch (err) {
                console.error('Error saving attendance:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Có lỗi xảy ra khi lưu dữ liệu.'
                });
            }
        });
    }
});

// --- Calendar ---
async function loadCalendar() {
    try {
        const res = await fetch(`${API_BASE_URL}/appointments`);
        const appointments = await res.json();

        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        // Transform data for FullCalendar
        const events = appointments.map(app => {
            // Combine Date and Time
            const start = `${app.date}T${app.time}`;

            // Default coloring based on status
            let color = '#3788d8';
            if (app.status === 'confirmed') color = '#28a745';
            if (app.status === 'completed') color = '#6c757d';
            if (app.status === 'cancelled') color = '#dc3545';

            return {
                title: `${app.firstName} - ${app.service}`,
                start: start,
                color: color
            };
        });

        // Initialize Calendar
        calendarEl.innerHTML = '';

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            height: 'auto',
            events: events,
            eventClick: function (info) {
                Swal.fire({
                    title: info.event.title,
                    text: `Start: ${info.event.start.toLocaleString()}`,
                    icon: 'info'
                });
            }
        });

        calendar.render();

    } catch (err) {
        console.error('Error loading calendar:', err);
    }
}
