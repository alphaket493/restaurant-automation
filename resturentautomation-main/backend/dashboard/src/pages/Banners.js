import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CardContent,
  Card,
  Chip,
  ImageList,
  DialogActions,
  ImageListItem,
  ImageListItemBar,
  Slide,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { useState, useEffect, forwardRef } from "react";
import firebase from "../Firebase/index";
import getUser from "../Firebase/getUser";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import { API_SERVICE } from "../URI";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Banners = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [User, setUser] = useState({ displayName: "", email: "" });
  const [banners, setBanners] = useState([]);
  const [deleteBanner, setDeleteBanner] = useState(null);
  const [showBannerDetails, setShowBannerDetails] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState({});
  const [openDeleteBannerPrompt, setOpenDeleteBannerPrompt] = useState(false);
  const [TandC, setTandC] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [bannersDetails, setBannersDetails] = useState(null);
  useEffect(() => {
    const get = async () => {
      setUser(await getUser());
    };
    get();
  }, []);
  useEffect(() => {
    const getCoupons = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/coupons/getcoupons/${User.email}`
        );
        const content = await rawResponse.json();

        setCoupons(content);
      } catch (err) {}
    };

    getCoupons();
  }, [User]);
  const uploadBanner = async (ul) => {
    try {
      const rawResponse = await fetch(
        `${API_SERVICE}/api/v1/main/banners/addbanner`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            banner: ul,
            email: User.email,
            name: image.name,
            TandC,
            coupon: selectedCoupon,
          }),
        }
      );
      const content = await rawResponse.json();
      console.log(content);
      setBanners((old) => [...old, content]);
      setImageUrl("");
      setImage("");
      setTandC("");
      setSelectedCoupon({});
      setOpen(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setImageUrl("");
      setImage("");
      setOpen(false);
    }
  };
  const updateBanner = async (ul) => {
    console.log(bannersDetails);
    try {
      const rawResponse = await fetch(
        `${API_SERVICE}/api/v1/main/banners/updatebanner/${bannersDetails?._id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            banner: ul,
            email: User.email,
            TandC,
            coupon: selectedCoupon
          }),
        }
      );
      const content = await rawResponse.json();
      console.log(content);
      window.location.reload();
   
      setTimeout(()=>{
        setOpenEdit(false);
        setBanners((old) => [...old, content]);
        setImageUrl("");
        setImage("");
        setTandC("");
        setSelectedCoupon({});
        setBannersDetails(null);
        setLoading(false);
      },2000)
     
   

    } catch (err) {
      console.log(err);
      setImageUrl("");
      setImage("");
      setOpenEdit(false);
    }
  };
  const handleUpdateItemImage = () => {
    const storage = firebase.storage();
    setLoading(true);
    const uploadTask = storage.ref(`banners/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("banners")
          .child(image.name)
          .getDownloadURL()
          .then((ul) => {
            setImageUrl(ul);
            uploadBanner(ul);
          });
      }
    );
  };
  const handleUpdateItemImageUpdate = () => {
    const storage = firebase.storage();
    setLoading(true);
    if(image===""){
      updateBanner(bannersDetails?.banner);
      return;
    }
    const uploadTask = storage.ref(`banners/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("banners")
          .child(image.name)
          .getDownloadURL()
          .then((ul) => {
            setImageUrl(ul);
            updateBanner(ul);
          });
      }
    );
  };
  useEffect(() => {
    const getBanners = async () => {
      try {
        const rawResponse = await fetch(
          `${API_SERVICE}/api/v1/main/banners/getbanners/${User.email}`
        );
        const content = await rawResponse.json();
        console.log(content);
        setBanners(content);
      } catch (err) {}
    };

    getBanners();
  }, [User]);
  const handleDeleteBanner = async () => {
    if (deleteBanner === null) {
      setOpenDeleteBannerPrompt(false);
      return;
    }
    try {
      const rawResponse = await fetch(
        `${API_SERVICE}/api/v1/main/banners/removebanner/${deleteBanner._id}`,
        {
          method: "delete",
        }
      );
      const res = await rawResponse.json();
      console.log(res);
      const newBan = banners.filter(
        (bannner) => bannner._id !== deleteBanner._id
      );
      setBanners(newBan);
      setOpenDeleteBannerPrompt(false);
      setDeleteBanner(null);
    } catch (err) {
      setOpenDeleteBannerPrompt(false);
      console.log(err);
      setDeleteBanner(null);
    }
  };
  const imageChangeHandler = (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);

    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };
  const addBanner = () => {
    if (image !== "") handleUpdateItemImage();
  };
  const updateBannerHandler = () => {

    handleUpdateItemImageUpdate();
  };
  const closeBanner = () => {
    setImageUrl("");
    setImage("");
    setOpen(false);
    setTandC("");
    setSelectedCoupon({});
    setOpenEdit(false);
  };
useEffect(()=>{
 if(openEdit){
  if(!selectedCoupon.couponCode){
    setSelectedCoupon({couponCode:bannersDetails?.coupon.couponCode,discount:bannersDetails?.coupon.discount});
  }
  if(!TandC){
    setTandC(bannersDetails?.TandC);
  }
 }
},[openEdit])
  return (
    <>
      <Helmet>
        <title>Banners</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",

          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          m: 10,
          mb: 0,
        }}
      >
        <Typography color="textPrimary" variant="h2" sx={{ mb: 3 }}>
          Banners
        </Typography>

        <Button
          variant="contained"
          component="label"
          onClick={() => setOpen(true)}
        >
          Add Banner
        </Button>
      </Box>
      <Box
        sx={{
          mt: 2,
          ml: 5,
          mr: 5,
          backgroundColor: "white",
          border: "1px solid white",
          borderRadius: "10px",
          height: "70vh",
          overflow: "scroll",
          overflowX: "hidden",
        }}
      >
        <ImageList sx={{ display: "flex" }}>
          {banners.map((item) => (
            <ImageListItem
              key={item._id}
              sx={{
                m: 5,
                boxShadow: "1px 1px  10px 1px lightgrey",
                width: "300px",
                cursor: "pointer",
              }}
            >
              <img
                src={`${item.banner}`}
                srcSet={`${item.banner}`}
                alt={item.name}
                loading="lazy"
                width="100px"
                height="100px"
                onClick={() => {
                  if (item.TandC !== "") {
                    setBannersDetails(item);
                    setShowBannerDetails(true);
                  }
                }}
              />
              <ImageListItemBar title={item.name} position="below" />
              <Button
                variant="contained"
                component="label"
                onClick={() =>{          setBannersDetails(item); setOpenEdit(true)}}
              >
                Edit Banner
              </Button>
              <Box
                sx={{
                  display: "flex",
                  ml: 15,
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Button
                  varient="contained"
                  onClick={() => {
                    setDeleteBanner(item);
                    setOpenDeleteBannerPrompt(true);
                  }}
                  style={{ color: "red", width: "50%" }}
                >
                  delete <DeleteIcon style={{ color: "red" }} />
                </Button>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <Dialog
        fullScreen
        open={showBannerDetails}
        onClose={() => setShowBannerDetails(false)}
        TransitionComponent={Transition}
      >
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Offer Details
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setShowBannerDetails(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>

        <List>
          <ListItem button>
            <ListItemText
              primary="Coupon Name"
              secondary={
                bannersDetails?.coupon.couponCode +
                " " +
                bannersDetails?.coupon.discount
              }
            />
          </ListItem>
          <Divider />

          <ListItem button>
            <ListItemText
              primary={"Terms & Conditions"}
              secondary={bannersDetails?.TandC}
            />
          </ListItem>
        </List>
      </Dialog>
      <Dialog open={open} fullWidth onClose={() => {}}>
        <DialogTitle>Banner</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3 }}>
            <Card sx={{ marginTop: "20px" }}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img alt="" variant="rounded" src={imageUrl} width="500px" />
                </Box>
              </CardContent>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  m: 1,
                }}
              >
                <Button variant="contained" component="label" sx={{ mb: 3 }}>
                  Choose Banner
                  <input
                    type="file"
                    hidden
                    onChange={(e) => imageChangeHandler(e)}
                  />
                </Button>
                <Typography
                  align="left"
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Select Coupon Name
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  fullWidth
                  label="Category"
                  value={selectedCoupon.couponCode}
                  sx={{ mb: 3 }}
                  onChange={(e) => {
                    setSelectedCoupon(
                      coupons.find((ele) => ele.couponCode === e.target.value)
                    );
                  }}
                >
                  {coupons?.map((cat) => {
                    return (
                      <MenuItem
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        value={cat.couponCode}
                        key={cat}
                      >
                        <label> {cat.couponCode}</label>
                        <label> {cat.discount}</label>
                      </MenuItem>
                    );
                  })}
                </Select>
                <Typography
                  align="left"
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Write Terms and Condition
                </Typography>
                <textarea
                  value={TandC}
                  style={{ minHeight: "100px", fontSize: "1.3em" }}
                  onChange={(e) => setTandC(e.target.value)}
                />
              </Box>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              closeBanner();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              addBanner();
            }}
          >
            Add {loading && <CircularProgress />}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} fullWidth onClose={() => {}}>
        <DialogTitle>Banner</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3 }}>
            <Card sx={{ marginTop: "20px" }}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img alt="" variant="rounded" src={imageUrl?imageUrl:bannersDetails?.banner} width="500px" />
                </Box>
              </CardContent>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  m: 1,
                }}
              >
                <Button variant="contained" component="label" sx={{ mb: 3 }}>
                  Change Banner
                  <input
                    type="file"
                    hidden
                    onChange={(e) => imageChangeHandler(e)}
                  />
                </Button>
                <Typography
                  align="left"
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Select Coupon Name
                </Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  fullWidth
                  label="Category"
                  value={selectedCoupon.couponCode?selectedCoupon.couponCode:bannersDetails?.coupon.couponCode}
                  sx={{ mb: 3 }}
                  onChange={(e) => {
                    setSelectedCoupon(
                      coupons.find((ele) => ele.couponCode === e.target.value)
                    );
                  }}
                >
                 
                  {coupons?.map((cat) => {
                    return (
                    
                     
      
                      <MenuItem
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        value={cat.couponCode}
                        key={cat}
                      >
                        <label> {cat.couponCode}</label>
                        <label> {cat.discount}</label>
                      </MenuItem>
                      
                    );
                  })}
                </Select>
                <Typography
                  align="left"
                  color="textPrimary"
                  variant="subtitle1"
                >
                  Write Terms and Condition
                </Typography>
                <textarea
                  value={TandC!==""?TandC:bannersDetails?.TandC}
                  style={{ minHeight: "100px", fontSize: "1.3em" }}
                  onChange={(e) => setTandC(e.target.value)}
                />
              </Box>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              closeBanner();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateBannerHandler();
            }}
          >
            Update {loading && <CircularProgress />}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteBannerPrompt}
        onClose={() => {
          setOpenDeleteBannerPrompt(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete?"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDeleteBannerPrompt(false);
            }}
          >
            NO
          </Button>
          <Button onClick={() => handleDeleteBanner()} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Banners;
