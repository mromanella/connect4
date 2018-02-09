package main

import (
	"net/http"
)

func serveBase(w http.ResponseWriter, r *http.Request) {
	http.FileServer(http.Dir("./dist")).ServeHTTP(w, r)
}

func main() {
	http.HandleFunc("/", serveBase)
	http.ListenAndServe(":9090", nil)
}
