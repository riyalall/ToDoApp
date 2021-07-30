const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const path = require('path')
var multer  = require('multer')
var index,loc,details;

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/images/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})
 
var upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
})

function fileFilter(req, file, cb)
{
    if(file.mimetype === "image/png")
    {
        cb(null, true);
    }
    else
    {
        cb("not supported extension", false);
    }
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/images')))
app.use(express.json())

app.get("/data", function(req, res)
{
    readTasks(function(tasks){
        res.send(tasks);
    })
})

app.post('/imgupload', upload.single("taskImage"), (req, res) => {
    details = req.body;
    details.image = req.file.filename;
    res.send("uploaded")
})

app.post('/upload', function(req, res)
{
    readTasks(function(f_data){
        f_data.push(details)
        saveTasks(JSON.stringify(f_data), function(err)
        {
            if(err)
            {
                res.send("err")
            }
            else
            {
                res.send(JSON.stringify(details));
            }
        })
    })
})

app.post('/update', function(req, res)
{
    readTasks(function(f_data){
        var data=req.body;
        for(var x in f_data){
            if(f_data[x].Id==data.Id){
                if(f_data[x].Status=='true'){
                    f_data[x].Status='false';
                }else{
                    f_data[x].Status='true';
                }
                break;
            }
        }
        saveTasks(JSON.stringify(f_data), function(err)
        {
            if(err)
            {
                res.end("err")
            }
            else
            {
                res.end()
            }
        })
    })
})

app.post('/delete', function(req, res)
{
   readTasks(function(f_data){
        var data=req.body;
        for(var x in f_data){
            if(f_data[x].Id==data.Id){
                index=x;
                loc = './public/images/'+f_data[x].image;
                fs.unlink(loc, function (err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });
                f_data.splice(x,1)
                break;
            }
        }
        saveTasks(JSON.stringify(f_data), function(err)
        {
            if(err)
            {
                res.end("err")
            }
            else
            {
                res.end()
            }
        })
    })
})

function readTasks(callback)
{
    fs.readFile("./data.txt","utf-8", function(err, data)
    {
        data  = data ? JSON.parse(data) : [];

        callback(data);
    })
}

function saveTasks(data,callback)
{
    fs.writeFile("./data.txt", data, function(err)
    {
        callback(err);
    })
}


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
