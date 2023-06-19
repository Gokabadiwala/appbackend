import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header( 
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
try {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB Connected"))
    .catch((err) => console.log("Error in url: ", err));
} catch (error) {
  console.log("DB not Connected");
}

const userSchema = mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 1000000000,
      max: 9999999999,
    },
    username: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: false,
    },
    DateOfBirth: {
      type: String,
      required: false,
    },
  },
  { versionKey: false }
);

const UserSendRequestSchema = mongoose.Schema(
  {
    OrderDate: {
      type: String,
      required: true,
    },
    OrderTime: {
      type: String,
      required: false,
    },
    OrderAcceptDate: {
      type: String,
      required: false,
    },
    OrderImg: {
      type: String,
      required: false,
    },
    OrderQuantity: {
      type: String,
      required: true,
    },
    OrderType: {
      type: [String],
      required: true,
    },
    UserCity: {
      type: String,
      required: false,
    },
    UserArea: {
      type: String,
      required: false,
    },
    UserAddress: {
      type: String,
      required: true,
    },
    UserInstruction: {
      type: String,
      required: true,
    },
    PickupFrom: {
      type: String,
      required: true,
    },
    UserId: {
      type: String,
      required: true,
    },
    OrderId: {
      type: Number,
      required: true,
    },
    OrderStatus: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);
const RateListSchema = mongoose.Schema(
  {
    Category: {
      type: String,
      required: true,
    },
    Rateicon: {
      type: String,
      required: true,
    },
    ItemName: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);
const AdminSchema = mongoose.Schema(
  {
    Username: {
      type: String,
    },
    Password: {
      type: String,
    },
  },
  { versionKey: false }
);
const AddressSchema = mongoose.Schema(
  {
    City: {
      type: String,
      required: true,
    },
    Area: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);
const QuantitySchema = mongoose.Schema(
  {
    QuantityItem: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);
const TimeSlotSchema = mongoose.Schema(
  {
    TimeItem: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);
const CancelledSchema = mongoose.Schema(
  {
    Title: {
      type: String,
      required: false,
    },
    Reason: {
      type: String,
      required: false,
    },
  },
  { versionKey: false }
);

const User = new mongoose.model("users", userSchema);
const UserSendRequest = new mongoose.model(
  "usersendrequest",
  UserSendRequestSchema
);
const RateList = new mongoose.model("RateList", RateListSchema);
const manageQuantity = new mongoose.model("manageQuantity", QuantitySchema);
const TimeSlot = new mongoose.model("manageTime", TimeSlotSchema);
const Address = new mongoose.model("manageAddress", AddressSchema);
const OrderCancelled = new mongoose.model("OrderCancelled", CancelledSchema);
const AdminData = new mongoose.model("AdminData", AdminSchema);

app.get("/", (req, res) => {
  console.log(req.body);
  res
    .status(200)
    .send({ message: "Backend Working", connection: process.env.MONGODB_URI });
});

app.post("/Login", async function (req, res) {
  var data = req.body;
  const check = await User.findOne({ number: data.number });
  if (check) {
    console.log("Already a User", check);
    res.status(200).send({ check, vaild: true });
  } else {
    res.status(200).send({ check, vaild: false });
  }
});
app.post("/AdminLogin", async function (req, res) {
  var data = req.body;
  const check = await AdminData.findOne({ Username: data.username, Password:data.password });
  if (check) {
    res.status(200).send({ success: true });
  } else {
    res.status(200).send({ success: false });
  }
});

app.post("/register", async function (req, res) {
  var data = req.body;
  const user = new User({
    number: data.number,
    username: data.username,
  });
  const check = await User.findOne({ number: data.number });
  if (check) {
    console.log("already a user", check);
    res.status(200).send(check);
  } else {
    user
      .save()
      .then((item) => {
        console.log("item saved to database", item);
        res.status(200).send(item);
      })
      .catch((err) => {
        console.log("unable to save to db", err);
        res.status(402).send("unable to save to database");
      });
  }
});

app.post("/addRateList", function (req, res) {
  console.log(req.body);
  const { Category, Rateicon, ItemName, Price } = req.body;
  const RateListItem = new RateList({
    Category,
    Rateicon,
    ItemName,
    Price,
  });

  RateListItem.save()
    .then((item) => {
      res.status(200).send({ message: "Item Added" });
    })
    .catch((err) => {
      res.status(402).send({ message: "unable to save to database" });
    });
});

app.post("/addAddress", function (req, res) {
  console.log(req.body);
  const { City, Area } = req.body;
  const AddressIteam = new Address({
    City,
    Area,
  });

  AddressIteam.save()
    .then((item) => {
      res.status(200).send({ message: "Item Added" });
    })
    .catch((err) => {
      res.status(402).send({ message: "unable to save to database" });
    });
});

app.post("/manageQuantity", function (req, res) {
  console.log(req.body);
  const { QuantityItem } = req.body;
  const manageQuantitys = new manageQuantity({ 
    QuantityItem  
  });

  manageQuantitys
    .save()
    .then((item) => {
      res.status(200).send({ message: "Item Added" });
    })
    .catch((err) => {
      res.status(402).send({ message: "unable to save to database" });
    });
});
app.post("/manageTime", function (req, res) {
  const { TimeItem } = req.body;
  const TimeSlots = new TimeSlot({
    TimeItem,
  });

  TimeSlots.save()
    .then((item) => {
      res.status(200).send({ message: "Item Added" });
    })
    .catch((err) => {
      res.status(402).send({ message: "unable to save to database" });
    });
});
app.post("/sendRequest", function (req, res) {
  const { finaldata } = req.body;
  const {
    OrderDate,
    OrderTime,
    OrderAcceptDate,
    OrderImg,
    OrderQuantity,
    OrderType,
    UserCity,
    UserArea,
    UserAddress,
    UserInstruction,
    PickupFrom,
    UserId,
    OrderId,
    OrderStatus,
  } = finaldata;
  const UserRequest = new UserSendRequest({
    OrderDate,
    OrderTime,
    OrderAcceptDate,
    OrderImg,
    OrderQuantity,
    OrderType,
    UserCity,
    UserArea,
    UserAddress,
    UserInstruction,
    PickupFrom,
    UserId,
    OrderId,
    OrderStatus,
  });
  UserRequest.save()
    .then((item) => {
      console.log("Booking Success", item);
      res.status(200).send({ message: "Booking Success" });
    })
    .catch((err) => {
      console.log("unable to save to db", err);
      res.status(402).send({ message: "unable to save to database" });
    });
});

app.post("/updateOrder", updateOrder, (req, res) => {
  res.send(res.data);
});

app.post("/updateAcceptOrder", updateAcceptOrder, (req, res) => {
  res.send(res.data);
});

app.get("/getAllUser", getAllUser, (req, res) => {
  res.send(res.data);
});

app.get("/OrderCancle", getAllOrderCancle, (req, res) => {
  res.send(res.data);
});

app.get("/getData/:id", getData, (req, res) => {
  res.send(res.data);
});

app.get("/getAllPickup", getAllPickup, (req, res) => {
  res.send(res.data);
});

app.get("/pickup/:id", getPickup, (req, res) => {
  res.send(res.data);
});

app.get("/getpickupdetails/:id", getpickupdetails, (req, res) => {
  res.send(res.data);
});

app.get("/getAllRateList", getAllRateList, (req, res) => {
  res.send(res.data);
});
app.get("/getAllQuantity", getAllQuantity, (req, res) => {
  res.send(res.data);
});
app.get("/getAllTime", getAllTime, (req, res) => {
  res.send(res.data);
});
app.get("/getAddress", getAddress, (req, res) => {
  res.send(res.data);
});

app.delete("/deleteUser/:id", deleteUser, (req, res) => {
  res.send(res.data);
});
app.delete("/deleteOrder/:id", (req, res) => {
  const { id } = req.params;
  try {
    UserSendRequest.deleteOne({ _id: id })
      .then((item) => {
        console.log("Order Deleted", item);
        res.status(200).send({ message: "Order Request Deleted"});
      })
      .catch((err) => {
        console.log("unable to delete from db", err);
        res.status(402).send({ message: "Try Again Later" });
      });
  } catch (e) {
    console.log("unable to find this order", e);
    res.status(500).send({ message: "Try Again Later" });
  }
});

app.delete("/deleteRateList/:id", deleteRateList, (req, res) => {
  res.send(res.data);
});
app.delete("/deleteAddress/:id", deleteAddress, (req, res) => {
  res.send(res.data);
});
app.delete("/deleteQuantity/:id", deleteQuantity, (req, res) => {
  res.send(res.data);
});
app.delete("/deleteTimeSlot/:id", deleteTimeSlot, (req, res) => {
  res.send(res.data);
});

app.put("/updateProfile", async (req, res) => {
  let data;
  const { username, number, DateOfBirth, genderValue } = req.body;
  try {
    data = await User.findOneAndUpdate(
      { number: number },
      { username: username, DateOfBirth: DateOfBirth, gender: genderValue }
    );
    if (data == null) {
      console.log("unable to find this order");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to find this order", e);
    res.status(500).send({ message: "unable to find this order" });
  }
  res.send(data);
});

async function updateOrder(req, res, next) {
  let data;
  const { id ,Title, Reason} = req.body;
  try {
    const newOrderCancelled = new OrderCancelled({
      Title,
      Reason,
    });
    newOrderCancelled.save()
    .then((item) => {
      console.log("Booking Cancelled", item);
      res.status(200).send({ message: "Booking Cancelled" });
    })
    .catch((err) => {
      console.log("unable to save to db", err);
      res.status(402).send({ message: "Try Again, Later" });
    });

    data = await UserSendRequest.findOneAndUpdate(
      { _id: id },
      { OrderStatus: "Cancelled" }
    );
    if (data == null) {
      console.log("unable to find this order");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to find this order", e);
    res.status(500).send({ message: "unable to find this order" });
  }
  res.data = data;
  next();
}
async function updateAcceptOrder(req, res, next) {
  let data;
  const { id ,Value} = req.body;
  try {
    data = await UserSendRequest.findOneAndUpdate(
      { _id: id },
      { OrderStatus: Value }
    );
    if (data == null) {
      console.log("unable to find this order");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to find this order", e);
    res.status(500).send({ message: "unable to find this order" });
  }
  res.data = data;
  next();
}
async function getpickupdetails(req, res, next) {
  let data;
  try {
    data = await UserSendRequest.findById(req.params.id);
    if (data == null) {
      console.log("unable to find this order");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to find this order", e);
    res.status(500).send({ message: "unable to find this order" });
  }
  res.data = data;
  next();
}

async function getPickup(req, res, next) {
  let data;
  try {
    data = await UserSendRequest.find({ UserId: req.params.id });
    if (data == null) {
      console.log("unable to find this order");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to find this order: ", e);
    res.status(500).send({ message: "unable to find this order" });
  }
  res.data = data;
  next();
}

async function getData(req, res, next) {
  let data;
  try {
    data = await User.findById(req.params.id);
    if (data == null) {
      console.log("unable to save to db");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to save to db: ", e);
    res.status(500).send({ message: "unable to save to db" });
  }
  res.data = data;
  next();
}

async function getAllUser(req, res, next) {
  let data;
  try {
    data = await User.find({});
    if (data == null) {
      console.log("unable to find data in db");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to Find data in db: ", e);
    res.status(500).send({ message: "unable to find data in db" });
  }
  res.data = data;
  next();
}

async function getAllOrderCancle(req, res, next) {
  let data;
  try {
    data = await OrderCancelled.find({});
    if (data == null) {
      console.log("unable to find data in db");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to Find data in db: ", e);
    res.status(500).send({ message: "unable to find data in db" });
  }
  res.data = data;
  next();
}
async function getAddress(req, res, next) {
  let data;
  try {
    data = await Address.find({});
    if (data == null) {
      console.log("unable to find data in db");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to Find data in db: ", e);
    res.status(500).send({ message: "unable to find data in db" });
  }
  res.data = data;
  next();
}

async function getAllPickup(req, res, next) {
  let data;
  try {
    data = await UserSendRequest.find({});
    if (data == null) {
      console.log("unable to find data in db");
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    console.log("unable to find data in db: ", e);
    res.status(500).send({ message: "unable to find data in db" });
  }
  res.data = data;
  next();
}

async function getAllRateList(req, res, next) {
  let data;
  try {
    data = await RateList.find({});
    if (data == null) {
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    res.status(500).send({ message: "unable to find data in db" });
  }
  res.data = data;
  next();
}
async function getAllQuantity(req, res, next) {
  let data;
  try {
    data = await manageQuantity.find({});
    if (data == null) {
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    res.status(500).send({ message: "unable to find data in db" });
  }
  res.data = data;
  next();
}
async function getAllTime(req, res, next) {
  let data;
  try {
    data = await TimeSlot.find({});
    if (data == null) {
      res.status(404).send({ message: "cannot find this Id" });
    }
  } catch (e) {
    res.status(500).send({ message: "unable to find data in db" });
  }
  res.data = data;
  next();
}

async function deleteRateList(req, res, next) {
  let data;
  const {id} = req.params;
  try {
    RateList.deleteOne({_id:id})
    .then((item) => {
      console.log("RateList Deleted", item);
      res.status(200).send({ message: "RateList Deleted" });
    })
    .catch((err) => {
      console.log("unable to save to db", err);
      res.status(402).send({ message: "Try Again, Later" });
    });
  } catch (e) {
    console.log("unable to find this order", e);
    res.status(500).send({ message: "Try Again, Later" });
  }
  res.data = data;
  next();
}
async function deleteQuantity(req, res, next) {
  let data;
  const {id} = req.params;
  try {
    manageQuantity.deleteOne({_id:id})
    .then((item) => {
      console.log("Quantity Deleted", item);
      res.status(200).send({ message: "Quantity Deleted" });
    })
    .catch((err) => {
      console.log("unable to delete from db", err);
      res.status(402).send({ message: "Try Again Later" });
    });
} catch (e) {
  console.log("unable to find this order", e);
  res.status(500).send({ message: "Try Again Later" });
}
  res.data = data;
  next();
}
async function deleteUser(req, res, next) {
  let data;
  const {id} = req.params;
  try {
    User.deleteOne({_id:id})
    .then((item) => {
      console.log("User Deleted", item);
      res.status(200).send({ message: "User Deleted" });
    })
    .catch((err) => {
      console.log("unable to delete from db", err);
      res.status(402).send({ message: "Try Again Later" });
    });
} catch (e) {
  console.log("unable to find this order", e);
  res.status(500).send({ message: "Try Again Later" });
}
  res.data = data;
  next();
}
async function deleteTimeSlot(req, res, next) {
  let data;
  const {id} = req.params;
  try {
    TimeSlot.deleteOne({_id:id})
    .then((item) => {
      console.log("Timeslot Deleted", item);
      res.status(200).send({ message: "Timeslot Deleted" });
    })
    .catch((err) => {
      console.log("unable to save to db", err);
      res.status(402).send({ message: "Try Again, Later" });
    });
  } catch (e) {
    console.log("unable to find this order", e);
    res.status(500).send({ message: "Try Again, Later" });
  }
  res.data = data;
  next();
}
async function deleteAddress(req, res, next) {
  let data;
  const {id} = req.params;
  try {
    Address.deleteOne({_id:id})
    .then((item) => {
      console.log("Address Deleted", item);
      res.status(200).send({ message: "Address Deleted" });
    })   .catch((err) => {
      console.log("unable to delete from db", err);
      res.status(402).send({ message: "Try Again Later" });
    });
} catch (e) {
  console.log("unable to find this order", e);
  res.status(500).send({ message: "Try Again Later" });
}
  res.data = data;
  next();
}

app.listen(PORT, function () {
  console.log(`Backend is running on Port: ${PORT}`);
});
