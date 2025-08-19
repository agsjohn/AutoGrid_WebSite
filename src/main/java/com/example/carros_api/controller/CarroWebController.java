package com.example.carros_api.controller;

import com.example.carros_api.model.Carro;
import com.example.carros_api.repository.CarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/")
public class CarroWebController {
    @Autowired
    private CarroRepository carroRepository;


    // Rotas públicas
    @GetMapping
    public String index(Model model) {
        List<Carro> recentes = carroRepository.findTop4ByOrderByIdDesc();
        List<Carro> todosOsCarros = carroRepository.findAllByOrderByAnoDesc();

        Map<Integer, List<Carro>> veiculosPorAno = todosOsCarros.stream()
                .collect(Collectors.groupingBy(
                        Carro::getAno,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        model.addAttribute("recentes", recentes);
        model.addAttribute("veiculosPorAno", veiculosPorAno);

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