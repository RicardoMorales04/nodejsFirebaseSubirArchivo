var conexion = require("../bd/conexion").conexion;
var Usuario = require("../modelos/Usuario");
const fs = require('fs');

async function mostrarUsuarios(){
    var users=[];
    try{
        var usuarios=await conexion.get();
        //console.log(usuarios);
        usuarios.forEach(usuario => {
        //console.log(usuario.data());//Para mostrar toda la info data() y id para mostrar solo el campo solicitado
        var user=new Usuario(usuario.id,usuario.data());
        //console.log(user);
        //console.log(user.obtenerDatos);
        if(user.bandera==0){
            //console.log(user.obtenerDatos);
            users.push(user.obtenerDatos);
        }
    });
    }
    catch(err){
        console.log("Error al recuperar usuarios de la BD "+err);
    }
    return users;
}

async function buscarPorID(id){
    var user;
   // console.log(id);
    try{
        var usuario = await conexion.doc(id).get();//Aqui se manda el registro que se consiga con ese id
       // console.log(usuario);
        var usuarioObjeto=new Usuario(usuario.id,usuario.data());
        //console.log(usuarioObjeto);
        if(usuarioObjeto.bandera==0){
            //console.log(usuarioObjeto.obtenerDatos);
            user=usuarioObjeto.obtenerDatos;
           //s console.log(user);
       } 
    }
    catch(err){
        console.log("Error al recuperar el usuario "+err);
    }
    console.log(user);
    return user;
}

async function nuevoUsuario(datos){
    var user=new Usuario(null,datos);
    var error=1;
    if(user.bandera==0){
        try{
            await conexion.doc().set(user.obtenerDatos);
            console.log("Usuario insertado a la BD");
            error=0;
        }
        catch(err){
            console.log("Error al capturar al nuevo usuario "+err);
        }
    }
    return error;
}

async function modificarUsuario(datos) {
    var error = 1;
    var usuario = await buscarPorID(datos.id);

    if (usuario) {
        try {
            await conexion.doc(usuario.id).set(datos);
            console.log("Registro actualizado");
            error = 0;
        } catch (err) {
            console.log("Error al modificar el usuario: " + err);
        }
    } else {
        console.log("El usuario no existe o el ID no es válido.");
    }
    return error;
}


async function borrarUsuario(id){
    try {
        const usuario = await buscarPorID(id);
        if (usuario && usuario.foto) {
            // Borra el archivo de la foto si existe
            fs.unlinkSync(`web/images/${usuario.foto}`);
            await conexion.doc(id).delete();
            console.log("Registro y foto borrados");
        } else {
            console.log("El usuario no existe o no tiene una foto asociada.");
        }
    } catch (err) {
        console.log("Error al borrar el usuario o la foto: " + err);
    }
}

module.exports={
    mostrarUsuarios,
    buscarPorID,
    nuevoUsuario,
    modificarUsuario,
    borrarUsuario
}