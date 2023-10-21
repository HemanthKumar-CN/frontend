import React, { useState, useRef } from "react";
import {
  Container,
  Card,
  CardContent,
  makeStyles,
  Grid,
  TextField,
  Button,
  Snackbar,
} from "@material-ui/core";
import QrReader from "react-qr-reader";
import MuiAlert from "@mui/material/Alert";
import { AvatarGenerator } from "random-avatar-generator";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQRCodeContext } from "./Provider/QRCodeContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
  const [scanResultFile, setScanResultFile] = useState("");
  const [scanResultWebCam, setScanResultWebCam] = useState("");
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", message: "" });
  const classes = useStyles();
  const qrRef = useRef(null);
  const codeRef = useRef(null);
  const { state, dispatch } = useQRCodeContext();

  const handleErrorFile = (error) => {
    console.log(error);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };
  const handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result);
    }
  };
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  };
  const handleErrorWebCam = (error) => {
    console.log(error);
  };
  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result);
    }
  };

  const thumbnailGeneration = () => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  };

  const dbUpload = async () => {
    var obj = {};
    if (scanResultFile.length == 0 && scanResultWebCam.length == 0) {
      alert("Please scan or upload QRCode");
      return;
    }

    if (scanResultFile.length) {
      obj.content = scanResultFile;
      obj.thumbnail = thumbnailGeneration();
    }

    if (scanResultWebCam.length) {
      obj.content = scanResultWebCam;
      obj.thumbnail = thumbnailGeneration();
    }

    console.log(obj, scanResultWebCam);

    setToastMessage({ type: "", message: "" });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/qrcodes`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        },
      );
      console.log(response, "------------data uploaded");
      setToastMessage({
        type: "success",
        message: "QR code saved successfully",
      });
      setToast(true);
      setScanResultFile("");
      setScanResultWebCam("");
    } catch (error) {
      setScanResultFile("");
      setScanResultWebCam("");
      setToastMessage({
        type: "error",
        message: "Upload Error - Something went wrong",
      });
      setToast(true);
      if (error.response.status === 401) {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("token");
      }
      console.log(error, "Error in database upload");
    }
  };

  const Logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
  };

  return (
    <Container className={classes.container}>
      <Card>
        <h2 className={classes.title}>
          Scan Your QR Code & Store in Database{" "}
          <Button variant="contained" onClick={Logout}>
            Logout
          </Button>
        </h2>
        <Link to={"/scannedList"}>
          <h2
            className={classes.title}
            style={{ background: "green", textDecoration: "none" }}
          >
            See previously scanned data
          </h2>
        </Link>
        <Snackbar open={toast} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={toastMessage.type}
            sx={{ width: "100%" }}
          >
            {toastMessage.message}
          </Alert>
        </Snackbar>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <Button
                className={classes.btn}
                variant="contained"
                color="secondary"
                onClick={onScanFile}
              >
                Select QR-Code from Gallery
              </Button>

              {
                <QrReader
                  ref={qrRef}
                  delay={300}
                  style={{ width: "100%" }}
                  onError={handleErrorFile}
                  onScan={handleScanFile}
                  legacyMode
                />
              }

              <h3>Scanned Code: {scanResultFile}</h3>
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <h3>Qr Code Scan by Web Cam</h3>
              {/* <Button
                className={classes.btn}
                variant="contained"
                color="primary"
                onClick={handleScanner}
              >
                Start here to scan your QRCode
              </Button> */}
              <QrReader
                ref={codeRef}
                delay={300}
                style={{ width: "100%" }}
                onError={handleErrorWebCam}
                onScan={handleScanWebCam}
              />
              <h3>Scanned By WebCam Code: {scanResultWebCam}</h3>
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              {/* <TextField label="" onChange={(e) => setText(e.target.value)}/> */}
              <hr />
              <Button
                className={classes.btn}
                variant="contained"
                color="primary"
                onClick={dbUpload}
              >
                Click here to store the scaned content in database
              </Button>
              {/* <br/>
                            <br/>
                            <br/>
                            {imageUrl ? (
                              <a href={imageUrl} download>
                                  <img src={imageUrl} alt="img"/>
                              </a>) : null} */}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 10,
  },
  title: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    background: "#3f51b5",
    color: "#fff",
    padding: 20,
  },
  btn: {
    marginTop: 10,
    marginBottom: 20,
  },
}));

export default Home;
