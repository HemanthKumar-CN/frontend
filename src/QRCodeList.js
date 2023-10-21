import * as React from "react";
// import Table from "@mui/material/Table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQRCodeContext } from "./Provider/QRCodeContext";
import { Logout } from "./Auth/Logout";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function QRCodeList() {
  // const [qrData, setQrData] = React.useState([]);
  const navigate = useNavigate();
  const { state, dispatch } = useQRCodeContext();

  console.log(state, "Global state");

  async function getData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/qrcodes`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
      console.log(response, "--getDAta");

      // setQrData(response.data);
      dispatch({ type: "ADD_QR_CODE", payload: response.data });
    } catch (error) {
      if (error.response.status === 401) {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("token");
      }
      console.log(error, "ERRRR");
    }
  }

  async function handleDelete(id) {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/qrcodes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );

      dispatch({ type: "REMOVE_QR_CODE", payload: id });

      console.log(response, "DElete request");
    } catch (error) {
      if (error.response.status === 401) {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("token");
      }
      console.log(error);
    }
  }

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 600 }} padding="10" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Thumbnail</TableCell>
              <TableCell align="left">Content</TableCell>
              <TableCell align="left">Scan_Date</TableCell>
              {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell> */}
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state?.qrCodes?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Avatar alt="Remy Sharp" src={row.thumbnail} />
                </TableCell>
                <TableCell align="left">{row.content}</TableCell>
                <TableCell align="left">
                  {new Date(row.createdAt).toDateString()}
                </TableCell>
                {/* <TableCell align="right">{row.carbs}</TableCell> */}
                <TableCell
                  align="right"
                  variant="button"
                  // onClick={() => handleDelete(row.id)}
                >
                  {
                    <DeleteOutlineIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(row.id)}
                    />
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={() => navigate(-1)}>
        Back
      </Button>
    </>
  );
}
