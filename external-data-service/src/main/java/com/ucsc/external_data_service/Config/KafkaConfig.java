package com.ucsc.external_data_service.Config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic externalDataRequestTopic() {
        return TopicBuilder.name("external-data.requested")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic externalDataUpdateTopic() {
        return TopicBuilder.name("external-data.updated")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic externalDataFailedTopic(){
        return TopicBuilder.name("external-data.failed")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
