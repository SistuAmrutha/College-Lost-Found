package com.collegelostfound;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class CollegeLostFoundApplication {

    public static void main(String[] args) {
        SpringApplication.run(CollegeLostFoundApplication.class, args);
    }
}
