package com.example.carros_api.service;

import com.example.carros_api.model.Carro;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class CarroService {

    private final KafkaTemplate<String, Carro> kafkaTemplateCarro;

    public CarroService(KafkaTemplate<String, Carro> kafkaTemplateCarro){
        this.kafkaTemplateCarro = kafkaTemplateCarro;
    }

    @SuppressWarnings("null")
    public void SendMessageCarro(Carro carro){
        System.out.println("Send message to partition 1");
        System.out.println("Sending Car: " + carro.getTitulo());
        kafkaTemplateCarro.send("added-new-car", 0, null, carro);
    }

    @KafkaListener(topicPartitions = @TopicPartition(topic = "added-new-car", partitions = {"0"}), containerFactory = "carroKafkaListenerContainerFactory")
    public void carroListener(Carro carro){
        System.out.println("Received Message Consumer 01: " + carro.getTitulo());
    }
}
