import { request, response } from "express";
import { ChatService } from "../services/index.js";
import logger from "../logging/logger.js";

export const chatView = async (req = request, res = response) => {
  try {
    const contenidochat = await ChatService.getChats();
    //const contenidochat = await ChatModel.find().lean().exec()
    // console.log('conenidochat', {contenidochat})
    const user = req.user;

    res.render("chatmongoose", {
      user,
      contenidochat,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    //console.error('error', error)
  }
};

export const chatPost = async (req = request, res = response) => {
  try {
    const chatmongooseNew = req.body;

    const resultadochat = await ChatService.addChats(chatmongooseNew);
    //  const resultadochat = await ChatModel.create(chatmongooseNew)
    console.log(resultadochat);
    res.redirect("/chatmongoose");
  } catch (error) {
    // console.log(error)
    logger.error(`Error al enviar el mensaje: ${error.message}`);
    res.send("Error al enviar el mensaje");
  }
};
