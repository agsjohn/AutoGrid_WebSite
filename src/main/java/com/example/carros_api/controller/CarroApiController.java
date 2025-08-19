package com.example.carros_api.controller;

import com.example.carros_api.model.Carro;
import com.example.carros_api.repository.CarroRepository;
import com.example.carros_api.service.CarroService;
import jakarta.persistence.criteria.Expression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.stereotype.Controller;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/")
public class CarroApiController {
    @Autowired
    private CarroRepository carroRepository;
    @Autowired
    private CarroService carroService;


    // Rotas públicas
    @GetMapping("/api/buscar")
    @ResponseBody
    public List<Carro> buscarCarros(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) List<String> marca,
            @RequestParam(required = false) List<String> tipo,
            @RequestParam(required = false) String localizacao,
            @RequestParam(required = false) Integer anoMin,
            @RequestParam(required = false) Integer anoMax,
            @RequestParam(required = false) Double precoMin,
            @RequestParam(required = false) Double precoMax
    ) {
        return carroRepository.findAll((root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (titulo != null && !titulo.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%"));
            }
            if (marca != null && !marca.isEmpty()) {
                // coluna 'marca' no banco será comparada em minúsculas
                Expression<String> marcaEmMinusculas = criteriaBuilder.lower(root.get("marca"));
                // cláusula IN será usada com a coluna já em minúsculas
                // frontend envia os valores em minúsculas
                predicates.add(marcaEmMinusculas.in(marca));
            }
            if (localizacao != null && !localizacao.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("localizacao")), "%" + localizacao.toLowerCase() + "%"));
            }
            if (tipo != null && !tipo.isEmpty()) {
                Expression<String> tipoEmMinusculas = criteriaBuilder.lower(root.get("tipo"));
                List<String> tiposMinusculos = tipo.stream().map(String::toLowerCase).toList();
                predicates.add(tipoEmMinusculas.in(tiposMinusculos));
            }
            if (anoMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ano"), anoMin));
            }
            if (anoMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("ano"), anoMax));
            }
            if (precoMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("preco"), precoMin));
            }
            if (precoMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("preco"), precoMax));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }

    @GetMapping("/api/marcas")
    @ResponseBody
    public List<String> getMarcas() {
        return carroRepository.findDistinctMarcas();
    }

    @GetMapping("/api/localizacoes")
    @ResponseBody
    public List<String> getLocalizacoes() {
        return carroRepository.findDistinctLocalizacoes();
    }


    @GetMapping("/api/{id}")
    public ResponseEntity<Carro> getCarroById(@PathVariable Long id) {
        Optional<Carro> carroOptional = carroRepository.findById(id);
        return carroOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    // Rotas protegidas
    @PostMapping("/api/create")
    public ResponseEntity<Carro> createCarro(@RequestBody Carro carro) {
        carro.setId(null);
        Carro savedCarro = carroRepository.save(carro);
        carroService.SendMessageCarro(carro);
        return new ResponseEntity<>(savedCarro, HttpStatus.CREATED);
    }

    @PutMapping("/api/update/{id}")
    public ResponseEntity<Carro> updateCarro(@PathVariable Long id, @RequestBody Carro carroDetails) {
        Optional<Carro> carroOptional = carroRepository.findById(id);
        if (carroOptional.isPresent()) {
            Carro existingCarro = carroOptional.get();

            existingCarro.setTitulo(carroDetails.getTitulo());
            existingCarro.setMarca(carroDetails.getMarca());
            existingCarro.setAno(carroDetails.getAno());
            existingCarro.setPreco(carroDetails.getPreco());
            existingCarro.setQuilometragem(carroDetails.getQuilometragem());
            existingCarro.setImageUrl(carroDetails.getImageUrl());
            existingCarro.setImageUrl1(carroDetails.getImageUrl1());
            existingCarro.setImageUrl2(carroDetails.getImageUrl2());
            existingCarro.setImageUrl3(carroDetails.getImageUrl3());
            existingCarro.setLocalizacao(carroDetails.getLocalizacao());
            existingCarro.setTipo(carroDetails.getTipo());
            existingCarro.setDescricaoCurta(carroDetails.getDescricaoCurta());
            existingCarro.setDescricaoLonga(carroDetails.getDescricaoLonga());

            Carro updatedCarro = carroRepository.save(existingCarro);
            return ResponseEntity.ok(updatedCarro);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/delete/{id}")
    public ResponseEntity<Void> deleteCarro(@PathVariable Long id) {
        if (!carroRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        carroRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}