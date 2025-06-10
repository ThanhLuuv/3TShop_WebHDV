package com.project._TShop.Exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String attribute, Integer id) {
        super(String.format("%s with %s %d not found", resource, attribute, id));
    }
    public ResourceNotFoundException(String resource, String attribute, String name) {
        super(String.format("%s with %s %s not found", resource, attribute, name));
    }
}