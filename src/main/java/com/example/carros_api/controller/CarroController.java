package com.example.carros_api.controller;

import com.example.carros_api.model.Carro;
import com.example.carros_api.repository.CarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.jpa.domain.Specification;
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

    // --- Login simples para o Admin ---
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    @GetMapping
    public String index() {
        return "index"; // Corresponde a src/main/resources/templates/index.html
    }

    @GetMapping("/login")
    public String loginPage(HttpSession session) {
        if (session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")) {
            return "login";
        } else {
            return "redirect:/crud";
        }
//        return "login"; // Corresponde a src/main/resources/templates/login.html
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
        return "crud"; // Corresponde a src/main/resources/templates/crud_carros.html
    }

    @GetMapping("/busca")
    public String carregarPaginaBusca() {
        return "busca"; // Apenas renderiza a página HTML vazia
    }


//    @GetMapping("/crud/adicionar")
//    public String adicionarCarroPage(HttpSession session, org.springframework.ui.Model model) {
//        if (session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")) {
//            return "redirect:/login";
//        }
//        model.addAttribute("carro", new Carro()); // Objeto vazio para o formulário de adição
//        model.addAttribute("action", "/crud/salvar"); // Ação do formulário
//        return "form_carro";
//    }

//    @GetMapping("/crud/editar/{id}")
//    public String editarCarroPage(@PathVariable Long id, HttpSession session, org.springframework.ui.Model model) {
//        if (session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")) {
//            return "redirect:/login";
//        }
//        Carro carro = carroRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("ID de carro inválido:" + id));
//        model.addAttribute("carro", carro);
//        model.addAttribute("action", "/crud/salvar");
//        return "form_carro";
//    }

//    @PostMapping("/crud/salvar")
//    public String salvarCarro(@ModelAttribute Carro carro, HttpSession session) {
//        if (session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")) {
//            return "redirect:/login";
//        }
//        carroRepository.save(carro);
//        return "redirect:/crud";
//    }

//    @PostMapping("/crud/deletar/{id}")
//    public String deletarCarro(@PathVariable Long id, HttpSession session) {
//        if (session.getAttribute("loggedIn") == null || !(boolean) session.getAttribute("loggedIn")) {
//            return "redirect:/login";
//        }
//        carroRepository.deleteById(id);
//        return "redirect:/crud";
//    }

    // --- Rotas para a busca e detalhes (consumindo dados do DB) ---
//    @GetMapping("/busca")
//    public String buscarCarros(@RequestParam(required = false) String marca,
//                               @RequestParam(required = false) String tipo,
//                               @RequestParam(required = false) String ano,
//                               org.springframework.ui.Model model) {
//        List<Carro> carros;
//
//        if (marca != null && !marca.isEmpty()) {
//            carros = carroRepository.findByMarcaContainingIgnoreCase(marca);
//        } else if (tipo != null && !tipo.isEmpty()) {
//            carros = carroRepository.findByTipoContainingIgnoreCase(tipo);
//        } else if (ano != null && !ano.isEmpty()) {
//            try {
//                carros = carroRepository.findByAno(Integer.parseInt(ano));
//            } catch (NumberFormatException e) {
//                carros = carroRepository.findAll(); // Ou lide com o erro de forma mais sofisticada
//            }
//        } else {
//            carros = carroRepository.findAll(); // Se nenhum filtro, retorna todos
//        }
//        model.addAttribute("carros", carros);
//        return "busca"; // Corresponde a src/main/resources/templates/busca.html
//    }

    @GetMapping("/api/buscar")
    @ResponseBody // Garante que a resposta será o corpo da requisição (JSON)
    public List<Carro> buscarCarros(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String localizacao,
            @RequestParam(required = false) Integer anoMin,
            @RequestParam(required = false) Integer anoMax,
            @RequestParam(required = false) Double precoMin,
            @RequestParam(required = false) Double precoMax
            // Adicione outros filtros que precisar: precoMin, precoMax, etc.
    ) {
        // Usando Specification para criar uma query dinâmica e segura
        List<Carro> carros = carroRepository.findAll((root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (titulo != null && !titulo.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), "%" + titulo.toLowerCase() + "%"));
            }
            if (marca != null && !marca.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("marca")), "%" + marca.toLowerCase() + "%"));
            }
            if (localizacao != null && !localizacao.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("localizacao")), "%" + localizacao.toLowerCase() + "%"));
            }
            if (tipo != null && !tipo.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("tipo")), "%" + tipo.toLowerCase() + "%"));
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

            // ... adicione outros predicados para preço, localização, etc.

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });

        return carros;
    }

    @GetMapping("/produtos/{id}")
    public String detalhesCarro(@PathVariable Long id, org.springframework.ui.Model model) {
        Carro carro = carroRepository.findById(id).orElse(null);
        if (carro == null) {
            return "redirect:/busca";
        }
        model.addAttribute("carro", carro);
        return "produto";
    }
}