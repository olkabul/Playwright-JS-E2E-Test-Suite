export const locators = {
  createRoomBtn: "#createRoom",
  alertMsg: ".alert.alert-danger",
  roomListing: "p[id^='roomName']",
  roomName: "#roomName",
  roomPrice: "#roomPrice",
  checkboxes: {
    tv: "#tvCheckbox",
    radio: "#radioCheckbox",
    views: "#viewsCheckbox",
  },
  formContainer: "#root-container",
  roomByNumber: (roomNumber) =>
    `[data-testid="roomlisting"]:has(#roomName${roomNumber})`,
  deleteRoomBtn: (roomNumber) =>
    `[data-testid="roomlisting"]:has(#roomName${roomNumber}) .roomDelete`,
  formEditBtn: 'button:has-text("Edit")',
  formDescription: "#description",
  formAccessible: "#accessible",
  formTrueAccess: "#accessible > option:nth-child(2)",
  formRoomType: "#type",
  formUpdateBtn: "#update",
  roomDetails: ".room-details",
};
