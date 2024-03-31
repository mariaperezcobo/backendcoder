import { request, response } from "express";
import { ChatService } from "../services/index.js";
import logger from "../logging/logger.js";

export const chatView = async (req = request, res = response) => {
  try {
    const contenidochat = await ChatService.getChats();

    const user = req.user;

    res.render("chatmongoose", {
      user,
      contenidochat,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
};

export const chatPost = async (req = request, res = response) => {
  try {
    const chatmongooseNew = req.body;

    const resultadochat = await ChatService.addChats(chatmongooseNew);

    console.log(resultadochat);
    res.redirect("/chatmongoose");
  } catch (error) {
    // console.log(error)
    logger.error(`Error al enviar el mensaje: ${error.message}`);
    res.send("Error al enviar el mensaje");
  }
};
