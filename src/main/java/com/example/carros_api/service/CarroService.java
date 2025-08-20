package com.example.carros_api.service;

import com.example.carros_api.model.CarNotification;
import com.example.carros_api.model.Carro;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class CarroService {

    @Autowired
    private KafkaTemplate<String, Carro> kafkaTemplateCarro;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @SuppressWarnings("null")
    public void SendMessageCarro(Carro carro){
        System.out.println("Send message to partition 1");
        System.out.println("Sending Car: " + carro.getTitulo());
        kafkaTemplateCarro.send("added-new-car", 0, null, carro);
    }

    @KafkaListener(topicPartitions = @TopicPartition(topic = "added-new-car", partitions = {"0"}), containerFactory = "carroKafkaListenerContainerFactory")
    public void carroListener(Carro carro){
        System.out.println("Received Message Consumer 01: " + carro.getTitulo());

        CarNotification notification = new CarNotification(carro.getTitulo(), carro.getId());

        simpMessagingTemplate.convertAndSend("/topic/newcar", notification);
        System.out.println("Notificação WebSocket enviada para o frontend com ID do carro.");
    }
}