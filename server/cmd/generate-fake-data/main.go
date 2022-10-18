package main

import (
	"log"
	"testing"

	"github.com/CollActionteam/clothing-loop/server/local/app"
	"github.com/CollActionteam/clothing-loop/server/local/models"
	"github.com/CollActionteam/clothing-loop/server/local/tests/mocks"
	Faker "github.com/jaswdr/faker"
)

var faker = Faker.New()

func main() {
	app.ConfigInit(".")

	db := app.DatabaseInit()

	t := &testing.T{}

	chains := []*models.Chain{}
	userChainAdmins := []*models.User{}
	// userBasics := []*models.User{}

	for i := 0; i < 5; i++ {
		chain, user, _ := mocks.MockChainAndUser(t, db, mocks.MockChainAndUserOptions{
			IsChainAdmin: true,
		})

		chains = append(chains, chain)
		userChainAdmins = append(userChainAdmins, user)

		log.Printf("Generated -> Chain\t(ID: %d)", chain.ID)
		log.Printf("Generated -> User\t(ID: %d)", user.ID)
	}
	for i := 0; i < 5; i++ {
		chainIndex := faker.IntBetween(0, len(chains)-1)
		chain := chains[chainIndex]

		user, _ := mocks.MockUser(t, db, chain.ID, mocks.MockChainAndUserOptions{})
		log.Printf("Generated -> User\t(ID: %d)", user.ID)
		// userBasics = append(userBasics, user)
	}

	for _, user := range userChainAdmins {
		chainIndex := faker.IntBetween(0, len(chains)-1)
		chain := chains[chainIndex]

		if err := db.Create(&models.UserChain{
			UserID:       user.ID,
			ChainID:      chain.ID,
			IsChainAdmin: false,
		}).Error; err != nil {
			log.Fatal(err)
		}
		log.Printf("Added     -> User\t(ID: %d)\tto Chain (ID: %d)", user.ID, chain.ID)
	}

}
