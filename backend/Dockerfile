# ─── Stage 1: Build ──────────────────────────────────────────────────────────
# Use a Maven image to build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the JAR
COPY src ./src
RUN mvn package -DskipTests

# ─── Stage 2: Run ────────────────────────────────────────────────────────────
# Use a lightweight JRE image for the final container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Dynamic Port handling (Render sets the PORT env var)
ENV PORT=8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=${PORT}", "-jar", "app.jar"]
