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
    fs.readFile("./public/data.txt", "utf-8",function(err_r, f_data)
    {
        if(err_r){
            res.end(err_r)
        }else{
        res.end(f_data);
        }
    })
})

app.post('/imgupload', upload.single("taskImage"), (req, res) => {
    details = req.body;
    details.image = req.file.filename;
    res.send("hi")
})

app.post('/upload', function(req, res)
{
    fs.readFile("./public/data.txt", "utf-8",function(err_r, f_data)
    {
        if(err_r){
            res.end(err_r)
        }else{
            f_data = f_data.length ? JSON.parse(f_data) : [];
            f_data.push(details)
            fs.writeFile("./public/data.txt", JSON.stringify(f_data), function(err, data)
            {
                if(err)
                {
                    res.end("err")
                }
                else
                {
                    res.end(JSON.stringify(details));
                }
            })
        }
    })
})

app.post('/update', function(req, res)
{
    fs.readFile("./public/data.txt", "utf-8", function(err_r, f_data)
    {
        if(err_r){
            res.end(err_r)
        }else{
            f_data = f_data.length ? JSON.parse(f_data) : [];
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
            fs.writeFile("./public/data.txt", JSON.stringify(f_data), function(err, data)
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
        }
    })
})

app.post('/delete', function(req, res)
{
    fs.readFile("./public/data.txt", "utf-8",function(err_r, f_data)
    {
        if(err_r){
            res.end(err_r)
        }else{
            f_data = f_data.length ? JSON.parse(f_data) : [];
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
            
            fs.writeFile("./public/data.txt", JSON.stringify(f_data), function(err, data)
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
        }
    })
})


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
