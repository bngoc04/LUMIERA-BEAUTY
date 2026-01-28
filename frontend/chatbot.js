const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}


const generateResponse = (chatLi) => {
    const message = userMessage.toLowerCase();
    let responseText = "";

    // Simple Rule-based Logic
    if (message.includes("chào") || message.includes("hi") || message.includes("hello")) {
        responseText = "Xin chào! Chào mừng bạn đến với Lumiera Beauty. Tôi là Lumiera AI, tôi có thể giúp gì cho bạn hôm nay?";
    } else if (message.includes("giá") || message.includes("chi phí") || message.includes("bao nhiêu")) {
        responseText = "Chúng tôi có các dịch vụ với mức giá ưu đãi:<br>- Chăm sóc da: Từ 500.000 VNĐ<br>- Làm tóc: Từ 300.000 VNĐ<br>- Trang điểm: Từ 400.000 VNĐ<br>Bạn có thể xem chi tiết tại trang <a href='services.html' style='color: white; text-decoration: underline;'>Dịch vụ</a>.";
    } else if (message.includes("dịch vụ") || message.includes("service")) {
        responseText = "Lumiera Beauty cung cấp các dịch vụ chuyên nghiệp về:<br>- Chăm sóc da & Spa<br>- Tạo mẫu tóc<br>- Trang điểm & Làm móng<br>Vui lòng tham khảo thêm tại trang <a href='services.html' style='color: white; text-decoration: underline;'>Dịch vụ</a>.";
    } else if (message.includes("đặt lịch") || message.includes("book") || message.includes("lịch hẹn")) {
        responseText = "Bạn có thể đặt lịch hẹn trực tuyến ngay tại trang <a href='datlich.html' style='color: white; text-decoration: underline;'>Đặt lịch</a>.<br>Hoặc liên hệ hotline: (+086)456.999.77 để được hỗ trợ nhanh nhất.";
    } else if (message.includes("lumiera")) {
        responseText = "Tôi là Lumiera AI, trợ lý ảo thông minh độc quyền của Lumiera Beauty. Rất vui được hỗ trợ bạn!";
    } else {
        responseText = "Cảm ơn bạn đã nhắn tin. Hiện tại tôi chỉ có thể trả lời các câu hỏi cơ bản. Bạn vui lòng liên hệ hotline (+086)456.999.77 hoặc fanpage để nhân viên tư vấn chi tiết hơn nhé!";
    }

    // Return response with delay
    setTimeout(() => {
        const messageElement = chatLi.querySelector("p");
        messageElement.innerHTML = responseText;
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Typing...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
