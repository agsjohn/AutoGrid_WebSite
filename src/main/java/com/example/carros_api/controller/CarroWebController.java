package com.example.carros_api.controller;

import com.example.carros_api.model.Carro;
import com.example.carros_api.repository.CarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
@RequestMapping("/")
public class CarroWebController {
    @Autowired
    private CarroRepository carroRepository;


    // Rotas públicas
    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/busca")
    public String carregarPaginaBusca() {
        return "busca";
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


    // Rotas protegidas
    @GetMapping("/painel")
    public String crudCarrosPage(org.springframework.ui.Model model) {
        List<Carro> carros = carroRepository.findAll();
        model.addAttribute("carros", carros);
        return "painel";
    }
}