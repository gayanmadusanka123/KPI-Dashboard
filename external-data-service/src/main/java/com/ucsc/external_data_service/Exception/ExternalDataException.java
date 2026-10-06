package com.ucsc.external_data_service.Exception;

public class ExternalDataException extends RuntimeException{
        public ExternalDataException(String message) {
            super(message);
        }

        public ExternalDataException(String message, Throwable cause) {
            super(message, cause);
        }
    }

