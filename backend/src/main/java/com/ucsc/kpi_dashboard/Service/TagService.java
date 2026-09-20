package com.ucsc.kpi_dashboard.Service;

import com.ucsc.kpi_dashboard.Exeptions.TagException;
import com.ucsc.kpi_dashboard.Payload.Dto.TagDto;

import java.util.List;

public interface TagService {

    TagDto createTag(TagDto dto) throws TagException;

    TagDto updateTag(Long id, TagDto dto) throws TagException;

    TagDto getTagById(Long id) throws TagException;

    List<TagDto> getAllTags() throws TagException;

    void deleteTag(Long id) throws TagException;
}