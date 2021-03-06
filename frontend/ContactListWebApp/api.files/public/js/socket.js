/**
 * The PORT is being hardcoded here.
 * Please note that it will need to be changed if we change the port in the 
 * .env file
 */
const socket = io(`http://localhost:3200`);

const toastLevel = {
  SUCCESS: 0,
  WARNING: 1,
  ERROR: 2
};

function configureToastSocket() {
  toastr.remove();
  toastr.options.positionClass = "toast-top-right";
  toastr.options.timeOut = "2000";
}

socket.on("add:contact", arg => {
  loadDataTable();
  configureToastSocket();
  toastr.success(`${arg.contact.firstName} ${arg.contact.lastName}`,arg.message);
});

socket.on("update:contact", arg => {
  loadDataTable();
  configureToastSocket();
  toastr.warning(`${arg.contact.firstName} ${arg.contact.lastName}`,arg.message);
});

socket.on("delete:contact", arg => {
  loadDataTable();
  configureToastSocket();
  toastr.error(arg.message);
});

socket.on("disconnect", (reason) => {
  console.error("Socked has been disconnected");
  if (reason === "io server disconnect") {
    socket.connect();
  }
});