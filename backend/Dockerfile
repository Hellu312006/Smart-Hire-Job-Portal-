# ===================================================================
# SmartHire Backend - Production Multi-Stage Dockerfile (Java 21)
# ===================================================================

# Stage 1: Build the application with Maven & Temurin JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace/app

# Copy dependency definition and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code and compile production JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Create a minimal, lightweight runtime container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create directory for persistent uploads and local database
RUN mkdir -p /app/uploads /app/data

# Copy the built JAR from builder stage
COPY --from=builder /workspace/app/target/smarthire-backend-1.0.0.jar app.jar

# Configuration environment variables (can be overridden by cloud providers)
ENV PORT=8080
ENV SERVER_PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

# Execute the Spring Boot application
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
