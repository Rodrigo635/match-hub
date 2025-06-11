package com.match_hub.backend_match_hub.entities;

import java.sql.Date;

import com.fasterxml.jackson.databind.deser.DataFormatReaders.Match;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Table(name = "championship")
@Entity
public class Championship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long championshipId;
    private String name;
    private String imageChampionship;
    private Date createdAt = new Date(System.currentTimeMillis());

    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match matchId;

    public Championship() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImageChampionship() {
        return imageChampionship;
    }

    public void setImageChampionship(String imageChampionship) {
        this.imageChampionship = imageChampionship;
    }

    
}
