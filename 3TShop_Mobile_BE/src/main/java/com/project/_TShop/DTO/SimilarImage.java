package com.project._TShop.DTO;
import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class SimilarImage {
    private int product_id;
    private double distance;

    // Getters và Setters

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    @Override
    public String toString() {
        return "SimilarImage{" +
                "product_id='" + product_id + '\'' +
                ", distance=" + distance +
                '}';
    }
}
