package com.example.carros_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="USERS")
public class User {
    @Id
    private String username;
    private String password;
}