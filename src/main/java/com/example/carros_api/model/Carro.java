package com.example.carros_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Carro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremento
    private Long id;
    private String titulo;
    private String marca;
    private int ano;
    private double preco;
    private int quilometragem;
    private String imageUrl;
    private String imageUrl1;
    private String imageUrl2;
    private String imageUrl3;
    private String localizacao;
    private String tipo;
    private String descricaoCurta;
    private String descricaoLonga;
}