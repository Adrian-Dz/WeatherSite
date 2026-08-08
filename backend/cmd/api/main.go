package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

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

	http.ListenAndServe(":8080", r)
}
