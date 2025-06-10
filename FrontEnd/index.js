const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const session = require("express-session");

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/img", express.static(path.join(__dirname, "img")));
app.use("/js", express.static(path.join(__dirname, "js")));

function checkOrderSuccess(req, res, next) {
  if (req.session.orderSuccess) {
    next();
  } else {
    res.redirect("/");
  }
}


app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/status.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/status.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/home.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "auth/login.html"));
});

app.get("/forgot-password", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "auth/forgot-password.html"));
});
app.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "auth/reset-password.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "auth/register.html"));
});
app.get("/verify", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "auth/verify-register.html"));
});
//
app.get("/tee", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/category.html"));
});

app.get("/category/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/products.html"));
});

app.get("/product/search*", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/products.html"));
});

app.get("/product/search-by-image", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/products.html"));
});

app.get("/paint", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/category.html"));
});

app.get("/jean", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/category.html"));
});

app.get("/hoodie", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/category.html"));
});

app.get("/paints", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/category.html"));
});

app.get("/short", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/category.html"));
});

app.get("/t-shirt", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/category.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/cart.html"));
});

app.get("/order", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/order.html"));
});

app.get("/pay-page", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/pay-page.html"));
});

app.get("/personal-infor", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/personal-infor.html"));
});

app.get("/product-detail/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "user/product-detail.html"));
});

// ADMIN CONTROLLER
app.get('/admin/manage-product', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'admin/home_admin.html'));
});

app.get('/admin/manage-order', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'admin/management-order.html'));
});

app.get('/admin/add-new-product', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'admin/add-new-product.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'admin/dashboard.html'));
});

app.get('/admin/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'auth/login.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
