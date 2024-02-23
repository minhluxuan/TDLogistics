const socket = io("http://localhost:9000");
const notificationArea = document.querySelector("#notificationArea");

socket.on("notifyNewOrder", (order) => {
    const newOrder = document.createElement('p');
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes() + "  " + today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear();
    const notification = time + " " + "Đơn hàng mới ở: " + order.address_source + "\n"
    + "Giao tới " + order.address_dest + '.';
    newOrder.innerText = notification;
    notificationArea.appendChild(newOrder);
});