package com.cognizant.ireno;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

/**
 * IRENO Advisor Backend Application
 * 
 * This is the main entry point for the Spring Boot backend that handles:
 * - WebSocket communication with React frontend
 * - REST API communication with Flask AI server
 * - Real-time message processing for utility grid management
 * 
 * To run this application:
 * 1. Ensure Java 17+ is installed
 * 2. Run: mvn spring-boot:run
 * 3. Application will start on http://localhost:8080
 * 
 * Architecture:
 * React Frontend ↔ Spring Boot Backend (WebSocket) ↔ Flask AI Server (REST)
 * 
 * @author Cognizant Interns
 * @version 1.0.0
 */
@SpringBootApplication
@EnableWebSocket
public class IrenoAdvisorBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(IrenoAdvisorBackendApplication.class, args);
        System.out.println("🚀 IRENO Advisor Backend is running!");
        System.out.println("📡 WebSocket endpoint: ws://localhost:8080/chat");
        System.out.println("🔗 Test endpoint: http://localhost:8080/test?query=your_question");
        System.out.println("⚡ Ready to process utility grid queries!");
    }
} 