var ruta=require("express").Router();
var subirArchivo = require("../middlewares/subirArchivo");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUsuario}=require("../bd/usuariosBD");
const fs = require('fs').promises;

ruta.get("/",async(req,res)=>{
    var usuarios = await mostrarUsuarios();
    //console.log(usuarios);
    res.render("usuarios/mostrar",{usuarios:usuarios});

});

ruta.get("/nuevoUsuario",async(req,res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevoUsuario",subirArchivo(),async(req,res)=>{
    //console.log(req.file);
    req.body.foto=req.file.originalname;
    //console.log(req.body.foto);
    var error = await nuevoUsuario(req.body);
    //res.end();
    res.redirect("/");
});

ruta.get("/editar/:id",async(req,res)=>{
    var user = await buscarPorID(req.params.id);
    //res.end();
    //console.log(user);
    res.render("usuarios/modificar",{user});
});

ruta.post("/editar", subirArchivo(), async (req, res) => {
    try {
      const { id, borrar } = req.body;
      const usuarioAnterior = await buscarPorID(id);
      const fotoAnterior = usuarioAnterior ? usuarioAnterior.foto : null;
  
      if (req.file) {
        if (fotoAnterior) {
          await fs.unlink(`./web/images/${fotoAnterior}`);
        }
        req.body.foto = req.file.originalname;
      }
      var error = await modificarUsuario(req.body);
      if (borrar === "true") {
        if (fotoAnterior) {
          await fs.unlink(`./web/images/${fotoAnterior}`);
        }
        await borrarUsuario(id);
      }
  
      res.redirect("/");
    } catch (error) {
      console.error('Error al editar la foto o usuario:', error);
      res.status(500).send("Error al editar la foto o usuario");
    }
  });

ruta.get("/borrar/:id",async (req,res)=>{
    await borrarUsuario(req.params.id);
    res.redirect("/");
});


module.exports=ruta;