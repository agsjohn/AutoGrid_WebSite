let stompClient = null;
let notificationContainer = null;

function showNotification(message, carId) {

    const notificationElement = document.createElement('a');
    notificationElement.classList.add('notification-popup');
    notificationElement.href = `/produtos/${carId}`;
    notificationElement.textContent = message;

    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.classList.add('notification-container');
        document.body.appendChild(notificationContainer);
    }
    notificationContainer.appendChild(notificationElement);

    setTimeout(() => {
        notificationElement.remove();
    }, 5000);
}

function connect() {
    const socket = new SockJS('/ws-carros');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Conectado: ' + frame);

        stompClient.subscribe('/topic/newcar', function (notification) {
            const notificationObj = JSON.parse(notification.body);

            showNotification(notificationObj.content, notificationObj.carroId);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Desconectado.");
}

document.addEventListener('DOMContentLoaded', connect);