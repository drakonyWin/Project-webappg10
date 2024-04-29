const express = require("express");
const path = require("path");
const con = require("./config/db");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
// Middleware for parsing application/json
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// API endpoint for getting room data
app.get('/getroom', function(req, res) {
    const sql = "SELECT rooms.room_name, rooms.image_path, time_slots.start_time, time_slots.end_time, time_slots.status FROM rooms INNER JOIN time_slots ON rooms.room_id = time_slots.room_id;";
    con.query(sql, function(err, results) {
        if (err) {
            console.error('Error fetching room data:', err);
            res.status(500).json({ error: 'An error occurred while fetching room data.' });
        } else {
            res.status(200).json(results);
        }
    });
});
app.get('/booking/:roomId', async (req, res) => {
    // Retrieve roomId from request parameters
    const roomId = req.params.roomId;

    try {
        // You may retrieve room data from the database here
        const roomInfo = await db.getRoomInfo(roomId);

        // Render the HTML page and pass room data to the template
        res.sendFile(path.join(__dirname, 'views', 'room_list1.html'))
    } catch (error) {
        console.error('Error retrieving room data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/form', async (req, res) => {
    const { room, time, reason } = req.body;

    // ตรวจสอบว่ามีข้อมูลที่ต้องการส่งมาหรือไม่
    if (!room || !time || !reason) {
        return res.status(400).json({ error: 'Missing room, time, or reason' });
    }

    const sqlUpdateRoom = "UPDATE time_slots SET status = 'pending' WHERE room_name = ?";
    const sqlInsertBooking = "INSERT INTO bookings (user_id, room_id, slot_id, objective, status, action_by, date, booked_at) VALUES (?, ?, ?, ?, 'pending', NULL, CURRENT_DATE(), NOW())";

    try {
        // Update status in your database
        await db.query(sqlUpdateRoom, [room]);

        // Get room ID, slot ID, and user ID
        const roomInfo = await db.getRoomInfo(room);
        const slotInfo = await db.getSlotInfo(time);
        const userInfo = await db.getUserInfo(req.user.username);

        // Insert booking data into your database
        await db.query(sqlInsertBooking, [userInfo.user_id, roomInfo.room_id, slotInfo.slot_id, reason]);

        // Retrieve booked room data from the database
        const bookedRoom = await db.getBookedRoom(roomInfo.room_id); // Assuming you have a function to get booked room data

        // Render the HTML page and pass room data to the template
        res.render('booking', { room: bookedRoom, data: "your_data_here" }); // Assuming you use a template engine like EJS
    } catch (error) {
        console.error('Error occurred while booking room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// Mock database (can be replaced with a real database)
// let bookings = [];



// Endpoint for booking a room
// app.post('/api/bookings', (req, res) => {
//     const { roomname, time_slot, student_status, date, status } = req.body;
    
//     // Mock response for demonstration
//     const newBooking = {
//         id: bookings.length + 1,
//         roomname,
//         time_slot,
//         student_status,
//         date,
//         status
//     };
    
//     bookings.push(newBooking);
//     res.json({ message: 'Booking successful', booking: newBooking });
// });

// ---------- bookroom -----------
// ------------- GET all booking_details --------------
app.get('/booking_details_l', function (req, res) {
    // Insert a new record into the bookings table
    const sql = "SELECT bookings.id AS BookingID, rooms.room_name AS Room, time_slots.start_time AS Start, time_slots.end_time AS End,users.username AS BookingBy, bookings.objective AS Objective, bookings.booked_at AS Booked, bookings.status AS ApproverStatus FROM bookings INNER JOIN rooms ON bookings.room_id = rooms.room_id INNER JOIN time_slots ON bookings.slot_id = time_slots.slot_id INNER JOIN users ON bookings.user_id = users.user_id WHERE bookings.status='pending'";
    con.query(sql, function (err, results)  {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
app.get('/booking_details_u', function (req, res) {
    // Insert a new record into the bookings table
    const sql = "SELECT bookings.id AS BookingID, rooms.room_name AS Room,  time_slots.start_time AS Start, time_slots.end_time AS End,users.username AS ApproverBy, bookings.objective AS Objective, bookings.booked_at AS Booked, bookings.status AS ApproverStatus FROM bookings INNER JOIN rooms ON bookings.room_id = rooms.room_id INNER JOIN time_slots ON bookings.slot_id = time_slots.slot_id INNER JOIN users ON bookings.action_by = users.user_id";
    con.query(sql, function (err, results)  {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});


// ------------- Update a Approver --------------
app.get("/Approver/:id", function (req, res) {
    const id = req.params.id;
    const sql = "UPDATE bookings SET status = 1 WHERE id = ?;";
    con.query(sql, [id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row updated is not 1');
            return res.status(500).send("Update failed");
        }
        res.send("Update succesfully");
    });
});

// ------------- Update a Not Approver --------------
app.get("/NotApprover/:id", function (req, res) {
    const id = req.params.id;
    const sql = "UPDATE bookings SET status = 2 WHERE id = ?;";
    con.query(sql, [id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        const sql1 = "UPDATE time_slot SET status = 1 WHERE slot_id = ( SELECT slot_id FROM bookings WHERE id = ? );"
        con.query(sql1, [id], function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send("Database server error");
            }
                res.send("Update succesfully");
            });
        });
});

// ------------- Update a Status --------------
app.get("/Status/:id/:status", function (req, res) {
    const id = req.params.id;
    const status = req.params.status;
    const sql = "UPDATE `time_slot` SET `status` = ? WHERE `time_slot`.`slot_id` = ?;";
    con.query(sql, [status, id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        if (results.affectedRows != 1) {
            console.error('Row updated is not 1');
            return res.status(500).send("Update failed");
        }
        res.send("Update succesfully");
    });
});


app.get('/regist.html', (_req, res) => {
    res.sendFile(path.join(__dirname, 'views/regist.html'));
});

// Register Create routes
app.post("/regist/create", async (req, res) => {
    const { name, email, username, password } = req.body;
    let hashpass = await bcrypt.hash(password, 10);
    try {
        con.query(
            "INSERT INTO users(username, email, password, role) VALUES(?,?,?,1)",
            [username, email, hashpass],
            (err, results, fields) => {
                if(err){
                    console.log("Error while inserting a user into the database", err);
                    return res.status(400).send();
                }
                return res.status(201).redirect('/login');
            } 
        );
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
});

// Routes
app.get('/password/:raw', function(req, res){
    const raw = req.params.raw;
    bcrypt.hash(raw, 10, function(err, hash){
        if(err){
            res.status(500).send('Server error');
        }
        else{
            res.send(hash);
        }
    });
});

app.post('/login', function(req, res){
    const username = req.body.username;
    const raw_password = req.body.password;
    const sql = "SELECT user_id,role,password FROM users WHERE username=?";
    
    con.query(sql, [username], function(err, results){
        if(err) {
            console.error(err);
            res.status(500).send('Server error');
        }
        else{
            if(results.length === 1){
                const hash = results[0].password;
                bcrypt.compare(raw_password, hash, function(err, same){
                    if(err){
                        res.status(500).send('Server error');
                    }else{
                        if(same){
                            res.json({ role: results[0].role })
                        }
                        else {
                            res.status(401).send('Login fail: wrong password');
                        }
                    }
                });
            }
            else{
                res.status(401).send('Login fail: wrong username');
            }
        }
    });
    // ------------- GET all unablebook --------------
app.get("/unablebook", function (req, res) {
    const sql = "SELECT BookingID FROM booking_details WHERE ReturnStatus IN (pending,reserved,disabled ) AND BorrowerID = ?;";
    con.query(sql, [req.session.userID], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        res.json(results);
    });
});
});


app.post('/bookingroom', function (req, res) {
    const newBooking = req.body;
    // Insert a new record into the booking_details table
    const sql = "INSERT INTO booking_details SET ?";
    con.query(sql, newBooking, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database server error");
        }
        const sql1 = "UPDATE Status =pending  WHERE sta =?;";
        con.query(sql1, [newBooking.MotorcycleID], function (err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send("Database server error");
            }
            res.send('/REQUEST_STATUS');

        });

    });
});

// Routes for serving HTML files
app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, '/views/login.html'));
});

// Routes for redirection after login
app.get('/G10HomeUser', function(req, res){
    res.sendFile(path.join(__dirname, '/views/G10HomeUser.html'));
});

app.get('/G10Homelecturer', function(req, res){
    res.sendFile(path.join(__dirname, '/views/G10Homelecturer.html'));
});

app.get('/G10Homestaff', function(req, res){
    res.sendFile(path.join(__dirname, '/views/G10Homestaff.html'));
});

app.get('/G10Dash', function(req, res){
    res.sendFile(path.join(__dirname, '/views/G10Dash.html'));
});

app.get('/history_lecturer', function(req, res){
    res.sendFile(path.join(__dirname, '/views/history_lecturer.html'));
});

app.get('/history_student', function(req, res){
    res.sendFile(path.join(__dirname, '/views/history_student.html'));
});

app.get('/historystaff', function(req, res){
    res.sendFile(path.join(__dirname, '/views/historystaff.html'));
});

app.get('/room_list1', function(req, res){
    res.sendFile(path.join(__dirname, '/views/room_list1.html'));
});

app.get('/roomlist_lecturer', function(req, res){
    res.sendFile(path.join(__dirname, '/views/roomlist_lecturer.html'));
});

app.get('/roomlist_staff', function(req, res){
    res.sendFile(path.join(__dirname, '/views/roomlist_staff.html'));
});
app.get('/request_status', function(req, res){
    res.sendFile(path.join(__dirname, '/views/REQUEST_STATUS.html'));
});
app.get('/request_user', function(req, res){
    res.sendFile(path.join(__dirname, '/views/u-REQUEST_STATUS.html'));
});

const port = 3000;
app.listen(port, function () {
    console.log("Server is ready at " + port);
});
