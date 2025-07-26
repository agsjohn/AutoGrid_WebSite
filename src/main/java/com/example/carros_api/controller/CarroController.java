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
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/")
public class CarroController {

    @Autowired
    private CarroRepository carroRepository;

    @Autowired
    private CarroService carroService;

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String loginPage(HttpSession session) {
        if (session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")) {
            return "login";
        } else {
            return "redirect:/crud";
        }
    }

    @PostMapping("/do-login")
    public String doLogin(@RequestParam String username, @RequestParam String password, HttpSession session) {
        if (ADMIN_USERNAME.equals(username) && ADMIN_PASSWORD.equals(password)) {
            session.setAttribute("loggedIn", true);
            return "redirect:/crud";
        }
        return "login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    @GetMapping("/crud")
    public String crudCarrosPage(HttpSession session, org.springframework.ui.Model model) {
        if (session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")) {
            return "redirect:/login";
        }
        List<Carro> carros = carroRepository.findAll();
        model.addAttribute("carros", carros);
        return "crud";
    }

    @GetMapping("/busca")
    public String carregarPaginaBusca() {
        return "busca";
    }

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
                // O frontend envia os valores em minúsculas
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

    @PostMapping("/api")
    public ResponseEntity<Carro> createCarro(HttpSession session, @RequestBody Carro carro) {
        if(session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")){
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
        carro.setId(null);
        Carro savedCarro = carroRepository.save(carro);
        carroService.SendMessageCarro(carro);

        return new ResponseEntity<>(savedCarro, HttpStatus.CREATED);
    }

    @PutMapping("/api/{id}")
    public ResponseEntity<Carro> updateCarro(HttpSession session, @PathVariable Long id, @RequestBody Carro carroDetails) {
        if(session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")){
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
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

    @DeleteMapping("/api/{id}")
    public ResponseEntity<Void> deleteCarro(HttpSession session, @PathVariable Long id) {
        if(session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")){
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }

        if (!carroRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        carroRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/produtos/{id}")
    public String paginaProduto(@PathVariable Long id, org.springframework.ui.Model model) {
        Carro carro = carroRepository.findById(id).orElse(null);
        if (carro == null) {
            return "redirect:/busca";
        }
        model.addAttribute("carro", carro);
        return "produto";
    }
}