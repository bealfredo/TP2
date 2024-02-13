package br.unitins.topicos2.ano2024.service;

import java.util.List;

import br.unitins.topicos2.ano2024.dto.EstadoDTO;
import br.unitins.topicos2.ano2024.dto.EstadoResponseDTO;
import jakarta.validation.Valid;

public interface EstadoService {

        // recursos basicos
        List<EstadoResponseDTO> getAll();

        EstadoResponseDTO findById(Long id);
    
        EstadoResponseDTO create(@Valid EstadoDTO dto);
    
        EstadoResponseDTO update(Long id, EstadoDTO dto);
    
        void delete(Long id);
    
        // recursos extras
    
        List<EstadoResponseDTO> findByNome(String nome);
    
        long count();

        long countByNome(String nome);
    
}
