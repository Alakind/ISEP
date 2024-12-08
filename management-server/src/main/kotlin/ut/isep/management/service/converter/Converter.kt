package ut.isep.management.service.converter

import dto.CreateDTO
import dto.ReadDTO
import dto.UpdateDTO
import entity.BaseEntity

interface ReadConverter<E : BaseEntity<*>, R : ReadDTO> {
    fun toDTO(entity: E): R
}

interface CreateConverter<E : BaseEntity<*>, C : CreateDTO> {
    fun fromDTO(createDTO: C): E
}

interface UpdateConverter<E : BaseEntity<*>, U : UpdateDTO<*>> {
    fun updateEntity(entity: E, updateDTO: U): E
}