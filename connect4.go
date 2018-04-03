package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/satori/go.uuid"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{} // use default options

type message struct {
	RoomID   uuid.UUID `json:"roomId"`
	Column   int       `json:"column"`
	ClientID uuid.UUID `json:"clientId"`
	Msg      string    `json:"msg"`
}

type client struct {
	// Send chan []byte
	Ws *websocket.Conn
	ID uuid.UUID
}

type room struct {
	ID       uuid.UUID `json:"id"`
	Clients  []*client `json:"Clients"`
	RoomSize int       `json:"roomSize"`
}

var rooms []*room

func serveBase(w http.ResponseWriter, r *http.Request) {
	http.FileServer(http.Dir("./dist")).ServeHTTP(w, r)
}

func manageConnections(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()

	clientID := *new(uuid.UUID)
	roomID := *new(uuid.UUID)

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}

		data := new(message)
		err = json.Unmarshal(msg, data)
		if err != nil {
			log.Fatal(err)
		}

		clientID = data.ClientID

		log.Println("joining with clientID:", clientID)

		if data.Msg == "join" {
			// finding open room
			roomFound := false
			newClient := client{
				Ws: c,
				ID: clientID,
			}
			for _, r := range rooms {
				log.Println("finding room")
				if r.RoomSize < 2 {
					r.RoomSize++
					r.Clients = append(r.Clients, &newClient)
					newMessage := new(message)
					newMessage.RoomID = r.ID
					roomFound = true
					newMessage.ClientID = r.Clients[len(r.Clients)-1].ID
					newMessage.Column = -1
					newMessage.Msg = "joined"
					// stringMessage, _ := json.Marshal(newMessage)
					log.Println("joining room:", r.ID)
					c.WriteJSON(newMessage)
					break
				}
			}
			if !roomFound {
				roomID = uuid.Must(uuid.NewV4())
				newRoom := new(room)
				newRoom.ID = roomID
				newRoom.RoomSize++
				newRoom.Clients = append(newRoom.Clients, &newClient)
				newMessage := new(message)
				newMessage.RoomID = newRoom.ID
				roomFound = true
				newMessage.ClientID = newRoom.Clients[len(newRoom.Clients)-1].ID
				newMessage.Column = -1
				newMessage.Msg = "joined"
				// stringMessage, _ := json.Marshal(newMessage)
				log.Println("joining room:", newRoom.ID)
				c.WriteJSON(newMessage)
				rooms = append(rooms, newRoom)
				log.Println("creating room with roomID", roomID)
			}
		}

		if data.Msg == "leave" {
			roomID := data.RoomID
			// column := data.Column

			for _, r := range rooms {
				if r.ID == roomID {
					for i, cli := range r.Clients {
						if clientID == cli.ID {
							// remove client from room
							r.Clients = append(r.Clients[:i], r.Clients[i+1:]...)
							log.Println("Left room")
						}
					}
				}
			}
		}

		// err = c.WriteMessage(mt, msg)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}

func main() {
	http.HandleFunc("/ws", manageConnections)
	http.HandleFunc("/", serveBase)
	http.ListenAndServe(":9090", nil)
}
