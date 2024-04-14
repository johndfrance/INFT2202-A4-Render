let LOCAL = false;
let HostName, URI;
if(LOCAL){
    URI = "mongodb://localhost/contacts";
    HostName = "localhost";
}else{
    URI = "mongodb+srv://johnfrance1:p1UEAikTSTi4UHiu@cluster0.t8tpzjb.mongodb.net/contacts?retryWrites=true&w=majority"
    HostName = "MongoDB Atlas";
}

export{URI, HostName};
export const SessionSecret = "INFT2202SessionSecret";