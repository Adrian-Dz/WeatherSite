package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer conn.Close(context.Background())

	// Example query to test connection
	var version string
	if err := conn.QueryRow(context.Background(), "SELECT version()").Scan(&version); err != nil {
		log.Fatalf("Query failed: %v", err)
	}

	log.Println("Connected to:", version)

	r.Route("/auth", func(r chi.Router) {
		r.Get("/login", handleLogin)
		//r.Get("/register")
	})

	r.Route("/weather", func(r chi.Router) {
		//r.Get("/")
		//r.Get("/{id}")

		//r.Post("/")

		//r.Put("/{id}")

		//r.Delete("/{id}")
	})

	r.Route("/user", func(r chi.Router) {
		//r.Get("/")
		//r.Get("/{id}")

		//r.Post("/")

		//r.Put("/{id}")

		//r.Delete("/{id}")
	})

	http.ListenAndServe(":5000", r)
}
