package com.example.carros_api.controller;

import com.example.carros_api.model.CarNotification;
import com.example.carros_api.model.Carro;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class NotificationController {


    @MessageMapping("/notification")
    @SendTo("/topic/newcar")
    public CarNotification carNotification(Carro carro) throws Exception {
        Thread.sleep(1000);
        return new CarNotification("Novo carro adicionado: " + HtmlUtils.htmlEscape(carro.getTitulo()) + "!", carro.getId());
    }
}