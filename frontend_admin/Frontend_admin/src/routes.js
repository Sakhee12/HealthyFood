
// Admin Imports
import ViewCategories from "views/admin/category/ViewCategories";
import MainDashboard from "views/admin/default";
import ViewProducts from "views/admin/product/ViewProducts";
import Profile from "views/admin/profile";

// Auth Imports
import Placeholder from "views/admin/Placeholder";
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdBarChart,
  MdCategory,
  MdDeliveryDining,
  MdHome,
  MdListAlt,
  MdLocalOffer,
  MdLogout,
  MdNotifications,
  MdOutlineShoppingCart,
  MdPayment,
  MdPeople,
  MdSettings
} from "react-icons/md";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Products",
    layout: "/admin",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    path: "products",
    children: [
      { name: "View Products", path: "view", component: <ViewProducts /> },
      { name: "Add Product", path: "add", component: <ViewProducts /> },
      { name: "Inventory", path: "inventory", component: <Placeholder title="Inventory" /> },
      { name: "Product Reviews", path: "reviews", component: <Placeholder title="Product Reviews" /> },
    ]
  },
  {
    name: "Category Management",
    layout: "/admin",
    icon: <MdCategory className="h-6 w-6" />,
    path: "category",
    children: [
      { name: "View Categories", path: "view", component: <ViewCategories /> },
      { name: "Add Category", path: "add", component: <ViewCategories /> },
    ]
  },
  {
    name: "Order Management",
    layout: "/admin",
    icon: <MdListAlt className="h-6 w-6" />,
    path: "orders",
    children: [
      { name: "New Orders", path: "new", component: <Placeholder title="New Orders" apiPath="/admin/orders" /> },
      { name: "Processing Orders", path: "processing", component: <Placeholder title="Processing" apiPath="/admin/orders" /> },
      { name: "Delivered Orders", path: "delivered", component: <Placeholder title="Delivered" apiPath="/admin/orders" /> },
      { name: "Cancelled Orders", path: "cancelled", component: <Placeholder title="Cancelled" apiPath="/admin/orders" /> },
    ]
  },
  {
    name: "Customer Management",
    layout: "/admin",
    icon: <MdPeople className="h-6 w-6" />,
    path: "customers",
    children: [
      { name: "All Customers", path: "all", component: <Placeholder title="All Customers" /> },
      { name: "Customer Orders", path: "customer-orders", component: <Placeholder title="Customer Orders" /> },
    ]
  },
  {
    name: "Delivery Partner",
    layout: "/admin",
    icon: <MdDeliveryDining className="h-6 w-6" />,
    path: "delivery",
    children: [
      { name: "Delivery Boys", path: "boys", component: <Placeholder title="Delivery Boys" /> },
      { name: "Assign Delivery", path: "assign", component: <Placeholder title="Assign Delivery" /> },
    ]
  },
  {
    name: "Offers & Coupons",
    layout: "/admin",
    icon: <MdLocalOffer className="h-6 w-6" />,
    path: "offers",
    children: [
      { name: "Create Coupon", path: "create", component: <Placeholder title="Create Coupon" /> },
      { name: "Manage Offers", path: "manage", component: <Placeholder title="Manage Offers" /> },
    ]
  },
  {
    name: "Payments",
    layout: "/admin",
    icon: <MdPayment className="h-6 w-6" />,
    path: "payments",
    children: [
      { name: "Transactions", path: "transactions", component: <Placeholder title="Transactions" /> },
      { name: "Refunds", path: "refunds", component: <Placeholder title="Refunds" /> },
    ]
  },
  {
    name: "Reports & Analytics",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "reports",
    children: [
      { name: "Sales Report", path: "sales", component: <Placeholder title="Sales Report" /> },
      { name: "Order Report", path: "order-report", component: <Placeholder title="Order Report" /> },
      { name: "Top Selling Fruits", path: "top-selling", component: <Placeholder title="Top Selling" /> },
    ]
  },
  {
    name: "Notifications",
    layout: "/admin",
    icon: <MdNotifications className="h-6 w-6" />,
    path: "notifications",
    children: [
      { name: "Send Notification", path: "send", component: <Placeholder title="Send Notification" /> }
    ]
  },
  {
    name: "Settings",
    layout: "/admin",
    icon: <MdSettings className="h-6 w-6" />,
    path: "settings",
    children: [
      { name: "App Settings", path: "app", component: <Placeholder title="App Settings" /> },
      { name: "Admin Profile", path: "profile", component: <Profile /> },
    ]
  },
  {
    name: "Logout",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLogout className="h-6 w-6" />,
    component: <SignIn />,
  },
];
export default routes;
