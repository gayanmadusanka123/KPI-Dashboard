package com.ucsc.kpi_dashboard.Mapper;

import com.ucsc.kpi_dashboard.Model.Tag;
import com.ucsc.kpi_dashboard.Payload.Dto.TagDto;

public class TagMapper {

    public static TagDto toDto(Tag tag) {

        TagDto dto = new TagDto();

        dto.setId(tag.getId());
        dto.setName(tag.getName());

        return dto;
    }

    public static Tag toEntity(TagDto dto) {

        Tag tag = new Tag();

        tag.setId(dto.getId());
        tag.setName(dto.getName());

        return tag;
    }
}