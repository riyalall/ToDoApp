var divListTask = document.getElementById("task");
var addTask=document.getElementById("addTask");
var newtask = document.getElementById("NewTask");
var files_ip = document.getElementById("images");
var ImageDetails,imgarr;
let id=0;

fetchData();

function fetchData(){
    var request = new XMLHttpRequest();
        request.addEventListener("load", function(response){
            var data = JSON.parse(response.target.responseText);
            //console.log(data)
            for(var index in data)
            {
                id=data[index].Id;
                //console.log(id)
                createElement(data[index]);
            }
        });
    request.open("get","/data");        
    request.send();
}

addTask.addEventListener("click",function(){
    if(newtask.value && files_ip.files.length>0){
        var file = files_ip.files[0];
        id = parseInt(id)+1;

        const formData = new FormData();
        formData.append('taskImage', file);
        formData.append('Id', id);
        formData.append('Text', newtask.value);
        formData.append('Status',false);
        
        //console.log(formData)

        var xhttp = new XMLHttpRequest();

        xhttp.addEventListener("load", function(req,res){
            var request = new XMLHttpRequest();
            request.addEventListener("load", function(response){ 
                newtask.value = "";
                files_ip.value="";
                //console.log(this.responseText)
                createElement(JSON.parse(this.responseText))
             })
            request.open("post","/upload");
            request.setRequestHeader("Content-Type", "application/json");
            request.send();
        })

        xhttp.open("POST", "/imgupload");
        xhttp.send(formData); 
    }
});

function statusUpdate(event){
    var targetParent = event.target.parentNode.parentNode;
    //console.log(event.target.checked)
    var data = {
        Id: parseInt(targetParent.id)
    }
    if(event.target.checked){
        targetParent.firstElementChild.setAttribute("style","text-decoration: line-through;")
    }else{
        targetParent.firstElementChild.setAttribute("style","text-decoration: none;")
    }
    var request = new XMLHttpRequest();
    request.addEventListener("load",function(response){
        //console.log("Updated status")
    })
    request.open("post","/update")
    request.setRequestHeader("Content-Type", "application/json");
    //console.log(data)
    request.send(JSON.stringify(data));
}

function deleteTask(event){
    var targetParent = event.target.parentNode.parentNode;
    var data = {
        Id: parseInt(targetParent.id)
    }
    var request = new XMLHttpRequest();
    request.addEventListener("load",function(response){
        //console.log("event deleted")
        targetParent.parentNode.removeChild(targetParent)
    })
    request.open("post","/delete")
    request.setRequestHeader("Content-Type", "application/json");
    //console.log(data)
    request.send(JSON.stringify(data));
}

function createElement(data){
    //console.log(data)
    var divTask = document.createElement("div");
    divTask.setAttribute("id", data.Id);

    var pTaskdetails = document.createElement("label");
    pTaskdetails.innerHTML = data.Text;
    divTask.appendChild(pTaskdetails);

    var img = document.createElement("img")
    img.setAttribute("src",data.image)
    img.setAttribute("style","height:20px;width:20px;")
    divTask.appendChild(img)
    
    var divAlign = document.createElement("div");
    divAlign.setAttribute("style","float:right;")
    
    var chkTask = document.createElement("input");
    chkTask.setAttribute("type", "checkbox");
    chkTask.setAttribute("style","margin-right: 10px;");
    if(data.Status=='true'){
        chkTask.setAttribute("checked","checked");
        pTaskdetails.setAttribute("style","text-decoration: line-through;")
    }
    chkTask.addEventListener("click", statusUpdate);
    divAlign.appendChild(chkTask);

    var btnDelteTask = document.createElement("button");
    btnDelteTask.classList.add("button");
    btnDelteTask.innerHTML = "x";
    btnDelteTask.addEventListener("click", deleteTask);
    divAlign.appendChild(btnDelteTask);
    divTask.appendChild(divAlign);
    //console.log(divTask);
    divListTask.appendChild(divTask); 
}