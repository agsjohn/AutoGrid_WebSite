package com.example.carros_api.repository;

import com.example.carros_api.model.Carro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarroRepository extends JpaRepository<Carro, Long>, JpaSpecificationExecutor<Carro> {
    @Query("SELECT DISTINCT c.marca FROM Carro c ORDER BY c.marca ASC")
    List<String> findDistinctMarcas();

    @Query("SELECT DISTINCT c.localizacao FROM Carro c ORDER BY c.localizacao ASC")
    List<String> findDistinctLocalizacoes();
}