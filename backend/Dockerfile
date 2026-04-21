# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# In a monorepo, we must reference the subfolder path
# Copy the pom.xml from the backend folder
COPY backend/pom.xml .
RUN mvn dependency:go-offline

# Copy the source code from the backend folder
COPY backend/src ./src
RUN mvn package -DskipTests

# ─── Stage 2: Run ────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Dynamic Port handling
ENV PORT=8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=${PORT}", "-jar", "app.jar"]
