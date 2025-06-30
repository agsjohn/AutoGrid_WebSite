package com.example.carros_api.repository;

import com.example.carros_api.model.Carro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarroRepository extends JpaRepository<Carro, Long>, JpaSpecificationExecutor<Carro> {
    List<Carro> findByMarcaContainingIgnoreCase(String marca);
    List<Carro> findByTipoContainingIgnoreCase(String tipo);
    List<Carro> findByAno(int ano);

    List<Carro> findByMarcaContainingIgnoreCaseAndTipoContainingIgnoreCase(String marca, String tipo);
}