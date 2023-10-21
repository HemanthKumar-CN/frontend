// Define the qrCodeReducer function
export function qrCodeReducer(state, action) {
  switch (action.type) {
    case "ADD_QR_CODE":
      console.log(action.payload, "add_qr_code");
      return {
        ...state,
        qrCodes: [...action.payload],
      };
    case "REMOVE_QR_CODE":
      // Handle removing a QR code from the state
      console.log(action.payload, "remove_QR_code");

      //   console.log(updatedQRCodes, "----------+++++++updated", state.qrCodes);
      return {
        ...state,
        qrCodes: state.qrCodes.filter((code) => code.id !== action.payload),
      };
    case "LOGIN":
      // Handle login action to set user data and token
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "LOGOUT":
      // Handle logout action to clear user data and token
      return {
        ...state,
        user: null,
        token: null,
      };
    // Handle other actions as needed
    default:
      return state;
  }
}
