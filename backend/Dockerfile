# Build
FROM maven:3.9.9-amazoncorretto-21-alpine AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Create image
FROM bellsoft/liberica-runtime-container:jre-21-slim-musl

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]